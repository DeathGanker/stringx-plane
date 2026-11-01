# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

"""
StringX delivery-line models (Phase 1 cut 2).

Hard boundaries:
- Issue state.group == completed is execution complete, NOT acceptance.
- AcceptanceRecord statuses are independent of Plane Issue states.
- TaskDefinitionRevision rows are append-only snapshots; never rewrite history.
"""

from django.conf import settings
from django.db import models

from .project import ProjectBaseModel


class TaskDefinition(ProjectBaseModel):
    """
    Current task definition for a work item (1:1 with Issue).

    Edits bump `revision` and append a TaskDefinitionRevision snapshot.
    """

    issue = models.OneToOneField(
        "db.Issue",
        on_delete=models.CASCADE,
        related_name="stringx_task_definition",
    )
    goal = models.TextField(blank=True, default="")
    deliverables = models.TextField(blank=True, default="")
    acceptance_criteria = models.TextField(blank=True, default="")
    required_capabilities = models.TextField(blank=True, default="")
    revision = models.PositiveIntegerField(default=1)

    class Meta:
        verbose_name = "StringX Task Definition"
        verbose_name_plural = "StringX Task Definitions"
        db_table = "stringx_task_definitions"
        ordering = ("-updated_at",)

    def __str__(self):
        return f"TaskDefinition issue={self.issue_id} rev={self.revision}"


class TaskDefinitionRevision(ProjectBaseModel):
    """Immutable snapshot of a TaskDefinition at a given revision number."""

    task_definition = models.ForeignKey(
        TaskDefinition,
        on_delete=models.CASCADE,
        related_name="revisions",
    )
    issue = models.ForeignKey(
        "db.Issue",
        on_delete=models.CASCADE,
        related_name="stringx_task_definition_revisions",
    )
    revision = models.PositiveIntegerField()
    goal = models.TextField(blank=True, default="")
    deliverables = models.TextField(blank=True, default="")
    acceptance_criteria = models.TextField(blank=True, default="")
    required_capabilities = models.TextField(blank=True, default="")

    class Meta:
        verbose_name = "StringX Task Definition Revision"
        verbose_name_plural = "StringX Task Definition Revisions"
        db_table = "stringx_task_definition_revisions"
        ordering = ("-revision",)
        constraints = [
            models.UniqueConstraint(
                fields=["task_definition", "revision"],
                condition=models.Q(deleted_at__isnull=True),
                name="stringx_task_def_rev_unique_alive",
            ),
        ]

    def __str__(self):
        return f"TaskDefinitionRevision issue={self.issue_id} rev={self.revision}"


class AcceptanceRecord(ProjectBaseModel):
    """
    Independent human acceptance record.

    Must never be derived from Issue completed / Automations / MCP.
    Status vocabulary is acceptance_* — not Plane state groups.
    """

    class Status(models.TextChoices):
        PENDING = "acceptance_pending", "Acceptance pending"
        PASSED = "acceptance_passed", "Acceptance passed"
        REJECTED = "acceptance_rejected", "Acceptance rejected"

    issue = models.ForeignKey(
        "db.Issue",
        on_delete=models.CASCADE,
        related_name="stringx_acceptance_records",
    )
    status = models.CharField(
        max_length=32,
        choices=Status.choices,
        default=Status.PENDING,
        db_index=True,
    )
    conclusion = models.TextField(blank=True, default="")
    evidence_url = models.TextField(blank=True, default="")
    evidence_notes = models.TextField(blank=True, default="")
    task_definition_revision = models.ForeignKey(
        TaskDefinitionRevision,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="acceptance_records",
    )
    decided_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="stringx_acceptance_decisions",
    )
    decided_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "StringX Acceptance Record"
        verbose_name_plural = "StringX Acceptance Records"
        db_table = "stringx_acceptance_records"
        ordering = ("-created_at",)

    def __str__(self):
        return f"AcceptanceRecord issue={self.issue_id} status={self.status}"
