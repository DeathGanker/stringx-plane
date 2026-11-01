# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

from plane.app.serializers.base import BaseSerializer
from plane.db.models import AcceptanceRecord, TaskDefinition, TaskDefinitionRevision


class TaskDefinitionSerializer(BaseSerializer):
    class Meta:
        model = TaskDefinition
        fields = [
            "id",
            "workspace",
            "project",
            "issue",
            "goal",
            "deliverables",
            "acceptance_criteria",
            "required_capabilities",
            "revision",
            "created_at",
            "updated_at",
            "created_by",
            "updated_by",
        ]
        read_only_fields = [
            "id",
            "workspace",
            "project",
            "issue",
            "revision",
            "created_at",
            "updated_at",
            "created_by",
            "updated_by",
        ]


class TaskDefinitionRevisionSerializer(BaseSerializer):
    class Meta:
        model = TaskDefinitionRevision
        fields = [
            "id",
            "workspace",
            "project",
            "issue",
            "task_definition",
            "revision",
            "goal",
            "deliverables",
            "acceptance_criteria",
            "required_capabilities",
            "created_at",
            "updated_at",
            "created_by",
            "updated_by",
        ]
        read_only_fields = fields


class AcceptanceRecordSerializer(BaseSerializer):
    class Meta:
        model = AcceptanceRecord
        fields = [
            "id",
            "workspace",
            "project",
            "issue",
            "status",
            "conclusion",
            "evidence_url",
            "evidence_notes",
            "task_definition_revision",
            "decided_by",
            "decided_at",
            "created_at",
            "updated_at",
            "created_by",
            "updated_by",
        ]
        read_only_fields = [
            "id",
            "workspace",
            "project",
            "issue",
            "decided_by",
            "decided_at",
            "created_at",
            "updated_at",
            "created_by",
            "updated_by",
        ]
