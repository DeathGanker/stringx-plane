# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

from django.urls import path

from plane.app.views import (
    IssueAcceptanceRecordDetailEndpoint,
    IssueAcceptanceRecordEndpoint,
    ProjectAcceptanceRecordEndpoint,
    TaskDefinitionEndpoint,
    TaskDefinitionRevisionEndpoint,
)

urlpatterns = [
    path(
        "workspaces/<str:slug>/projects/<uuid:project_id>/issues/<uuid:issue_id>/task-definition/",
        TaskDefinitionEndpoint.as_view(),
        name="stringx-task-definition",
    ),
    path(
        "workspaces/<str:slug>/projects/<uuid:project_id>/issues/<uuid:issue_id>/task-definition/revisions/",
        TaskDefinitionRevisionEndpoint.as_view(),
        name="stringx-task-definition-revisions",
    ),
    path(
        "workspaces/<str:slug>/projects/<uuid:project_id>/issues/<uuid:issue_id>/acceptance-records/",
        IssueAcceptanceRecordEndpoint.as_view(),
        name="stringx-issue-acceptance-records",
    ),
    path(
        "workspaces/<str:slug>/projects/<uuid:project_id>/issues/<uuid:issue_id>/acceptance-records/<uuid:pk>/",
        IssueAcceptanceRecordDetailEndpoint.as_view(),
        name="stringx-issue-acceptance-record-detail",
    ),
    path(
        "workspaces/<str:slug>/projects/<uuid:project_id>/acceptance-records/",
        ProjectAcceptanceRecordEndpoint.as_view(),
        name="stringx-project-acceptance-records",
    ),
]
