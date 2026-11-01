# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

"""
StringX task-definition + acceptance APIs.

Acceptance conclusions are ADMIN-only. MCP must not call these write paths.
Issue completed is never mapped to acceptance_passed.
"""

from django.db import transaction
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response

from plane.app.permissions import ROLE, allow_permission
from plane.app.serializers.stringx import (
    AcceptanceRecordSerializer,
    TaskDefinitionRevisionSerializer,
    TaskDefinitionSerializer,
)
from plane.db.models import AcceptanceRecord, Issue, TaskDefinition, TaskDefinitionRevision
from plane.db.models.project import ProjectMember
from ..base import BaseAPIView


CONTENT_FIELDS = ("goal", "deliverables", "acceptance_criteria", "required_capabilities")


def _issue_or_404(slug, project_id, issue_id):
    return Issue.objects.get(pk=issue_id, workspace__slug=slug, project_id=project_id)


def _snapshot_revision(task_definition: TaskDefinition) -> TaskDefinitionRevision:
    return TaskDefinitionRevision.objects.create(
        project_id=task_definition.project_id,
        issue_id=task_definition.issue_id,
        task_definition=task_definition,
        revision=task_definition.revision,
        goal=task_definition.goal,
        deliverables=task_definition.deliverables,
        acceptance_criteria=task_definition.acceptance_criteria,
        required_capabilities=task_definition.required_capabilities,
    )


def _content_changed(task_definition: TaskDefinition, payload: dict) -> bool:
    for field in CONTENT_FIELDS:
        if field in payload and getattr(task_definition, field) != (payload.get(field) or ""):
            return True
    return False


def _latest_revision_for_issue(issue_id):
    return (
        TaskDefinitionRevision.objects.filter(issue_id=issue_id, deleted_at__isnull=True)
        .order_by("-revision")
        .first()
    )


def _is_project_admin(user, slug, project_id) -> bool:
    member_qs = ProjectMember.objects.filter(
        workspace__slug=slug,
        member=user,
        project_id=project_id,
        is_active=True,
    )
    if member_qs.filter(role=ROLE.ADMIN.value).exists():
        return True
    from plane.db.models import WorkspaceMember

    return member_qs.exists() and WorkspaceMember.objects.filter(
        member=user,
        workspace__slug=slug,
        role=ROLE.ADMIN.value,
        is_active=True,
    ).exists()


class TaskDefinitionEndpoint(BaseAPIView):
    """GET / PUT current task definition for an issue (1:1)."""

    @allow_permission([ROLE.ADMIN, ROLE.MEMBER, ROLE.GUEST])
    def get(self, request, slug, project_id, issue_id):
        _issue_or_404(slug, project_id, issue_id)
        task_definition = TaskDefinition.objects.filter(
            workspace__slug=slug, project_id=project_id, issue_id=issue_id
        ).first()
        if not task_definition:
            return Response(
                {
                    "id": None,
                    "workspace": None,
                    "project": project_id,
                    "issue": issue_id,
                    "goal": "",
                    "deliverables": "",
                    "acceptance_criteria": "",
                    "required_capabilities": "",
                    "revision": 0,
                },
                status=status.HTTP_200_OK,
            )
        return Response(TaskDefinitionSerializer(task_definition).data, status=status.HTTP_200_OK)

    @allow_permission([ROLE.ADMIN, ROLE.MEMBER])
    def put(self, request, slug, project_id, issue_id):
        issue = _issue_or_404(slug, project_id, issue_id)
        payload = {field: request.data.get(field, "") or "" for field in CONTENT_FIELDS}

        with transaction.atomic():
            task_definition = TaskDefinition.objects.filter(
                workspace__slug=slug, project_id=project_id, issue_id=issue_id
            ).first()

            if not task_definition:
                task_definition = TaskDefinition(
                    project_id=project_id,
                    issue=issue,
                    revision=1,
                    **payload,
                )
                task_definition.save()
                _snapshot_revision(task_definition)
            else:
                if _content_changed(task_definition, payload):
                    for field, value in payload.items():
                        setattr(task_definition, field, value)
                    task_definition.revision = task_definition.revision + 1
                    task_definition.save()
                    _snapshot_revision(task_definition)
                else:
                    # No content change — do not bump revision or rewrite history.
                    task_definition.save()

        return Response(TaskDefinitionSerializer(task_definition).data, status=status.HTTP_200_OK)


class TaskDefinitionRevisionEndpoint(BaseAPIView):
    """List immutable task-definition revisions for an issue."""

    @allow_permission([ROLE.ADMIN, ROLE.MEMBER, ROLE.GUEST])
    def get(self, request, slug, project_id, issue_id):
        _issue_or_404(slug, project_id, issue_id)
        revisions = TaskDefinitionRevision.objects.filter(
            workspace__slug=slug, project_id=project_id, issue_id=issue_id
        ).order_by("-revision")
        return Response(
            TaskDefinitionRevisionSerializer(revisions, many=True).data,
            status=status.HTTP_200_OK,
        )


class IssueAcceptanceRecordEndpoint(BaseAPIView):
    """
    List / create acceptance records for an issue.

    POST may create acceptance_pending (ADMIN/MEMBER).
    Decision statuses (passed/rejected) require project ADMIN and set decided_*.
    """

    @allow_permission([ROLE.ADMIN, ROLE.MEMBER, ROLE.GUEST])
    def get(self, request, slug, project_id, issue_id):
        _issue_or_404(slug, project_id, issue_id)
        records = AcceptanceRecord.objects.filter(
            workspace__slug=slug, project_id=project_id, issue_id=issue_id
        ).order_by("-created_at")
        return Response(AcceptanceRecordSerializer(records, many=True).data, status=status.HTTP_200_OK)

    @allow_permission([ROLE.ADMIN, ROLE.MEMBER])
    def post(self, request, slug, project_id, issue_id):
        issue = _issue_or_404(slug, project_id, issue_id)
        requested_status = request.data.get("status", AcceptanceRecord.Status.PENDING)

        if requested_status not in AcceptanceRecord.Status.values:
            return Response({"error": "Invalid acceptance status"}, status=status.HTTP_400_BAD_REQUEST)

        is_decision = requested_status in {
            AcceptanceRecord.Status.PASSED,
            AcceptanceRecord.Status.REJECTED,
        }
        if is_decision and not _is_project_admin(request.user, slug, project_id):
            return Response(
                {"error": "Only project admins can write acceptance conclusions"},
                status=status.HTTP_403_FORBIDDEN,
            )

        revision = None
        revision_id = request.data.get("task_definition_revision")
        if revision_id:
            revision = TaskDefinitionRevision.objects.filter(
                pk=revision_id, workspace__slug=slug, project_id=project_id, issue_id=issue_id
            ).first()
            if not revision:
                return Response(
                    {"error": "task_definition_revision not found for this issue"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            revision = _latest_revision_for_issue(issue_id)

        record = AcceptanceRecord(
            project_id=project_id,
            issue=issue,
            status=requested_status,
            conclusion=request.data.get("conclusion", "") or "",
            evidence_url=request.data.get("evidence_url", "") or "",
            evidence_notes=request.data.get("evidence_notes", "") or "",
            task_definition_revision=revision,
        )
        if is_decision:
            record.decided_by = request.user
            record.decided_at = timezone.now()
        record.save()

        return Response(AcceptanceRecordSerializer(record).data, status=status.HTTP_201_CREATED)


class IssueAcceptanceRecordDetailEndpoint(BaseAPIView):
    """Patch an acceptance record — ADMIN-only (conclusions / status changes)."""

    @allow_permission([ROLE.ADMIN])
    def patch(self, request, slug, project_id, issue_id, pk):
        if not _is_project_admin(request.user, slug, project_id):
            return Response(
                {"error": "Only project admins can write acceptance conclusions"},
                status=status.HTTP_403_FORBIDDEN,
            )

        _issue_or_404(slug, project_id, issue_id)
        try:
            record = AcceptanceRecord.objects.get(
                pk=pk, workspace__slug=slug, project_id=project_id, issue_id=issue_id
            )
        except AcceptanceRecord.DoesNotExist:
            return Response({"error": "Acceptance record not found"}, status=status.HTTP_404_NOT_FOUND)

        next_status = request.data.get("status", record.status)
        if next_status not in AcceptanceRecord.Status.values:
            return Response({"error": "Invalid acceptance status"}, status=status.HTTP_400_BAD_REQUEST)

        for field in ("conclusion", "evidence_url", "evidence_notes"):
            if field in request.data:
                setattr(record, field, request.data.get(field) or "")

        if "status" in request.data:
            record.status = next_status
            if next_status in {
                AcceptanceRecord.Status.PASSED,
                AcceptanceRecord.Status.REJECTED,
            }:
                record.decided_by = request.user
                record.decided_at = timezone.now()

        if "task_definition_revision" in request.data:
            revision_id = request.data.get("task_definition_revision")
            if revision_id:
                revision = TaskDefinitionRevision.objects.filter(
                    pk=revision_id, workspace__slug=slug, project_id=project_id, issue_id=issue_id
                ).first()
                if not revision:
                    return Response(
                        {"error": "task_definition_revision not found for this issue"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                record.task_definition_revision = revision

        record.save()
        return Response(AcceptanceRecordSerializer(record).data, status=status.HTTP_200_OK)


class ProjectAcceptanceRecordEndpoint(BaseAPIView):
    """Project-level acceptance list for /acceptance page (read)."""

    @allow_permission([ROLE.ADMIN, ROLE.MEMBER, ROLE.GUEST])
    def get(self, request, slug, project_id):
        records = (
            AcceptanceRecord.objects.filter(workspace__slug=slug, project_id=project_id)
            .select_related("issue", "decided_by", "task_definition_revision")
            .order_by("-created_at")[:200]
        )
        data = AcceptanceRecordSerializer(records, many=True).data
        # Attach lightweight issue identifiers for the management page.
        issue_map = {
            str(issue.id): {"id": str(issue.id), "name": issue.name, "sequence_id": issue.sequence_id}
            for issue in Issue.objects.filter(id__in=[r.issue_id for r in records]).only(
                "id", "name", "sequence_id"
            )
        }
        for row in data:
            row["issue_meta"] = issue_map.get(str(row["issue"]))
        return Response(data, status=status.HTTP_200_OK)
