/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { API_BASE_URL } from "@plane/constants";
import type {
  TStringXAcceptanceRecord,
  TStringXAcceptanceWritePayload,
  TStringXTaskDefinition,
  TStringXTaskDefinitionRevision,
  TStringXTaskDefinitionWritePayload,
} from "@plane/types";
import { APIService } from "@/services/api.service";

export class StringXService extends APIService {
  constructor() {
    super(API_BASE_URL);
  }

  async getTaskDefinition(workspaceSlug: string, projectId: string, issueId: string): Promise<TStringXTaskDefinition> {
    return this.get(`/api/workspaces/${workspaceSlug}/projects/${projectId}/issues/${issueId}/task-definition/`).then(
      (response) => response?.data
    );
  }

  async upsertTaskDefinition(
    workspaceSlug: string,
    projectId: string,
    issueId: string,
    payload: TStringXTaskDefinitionWritePayload
  ): Promise<TStringXTaskDefinition> {
    return this.put(
      `/api/workspaces/${workspaceSlug}/projects/${projectId}/issues/${issueId}/task-definition/`,
      payload
    ).then((response) => response?.data);
  }

  async listTaskDefinitionRevisions(
    workspaceSlug: string,
    projectId: string,
    issueId: string
  ): Promise<TStringXTaskDefinitionRevision[]> {
    return this.get(
      `/api/workspaces/${workspaceSlug}/projects/${projectId}/issues/${issueId}/task-definition/revisions/`
    ).then((response) => response?.data);
  }

  async listIssueAcceptanceRecords(
    workspaceSlug: string,
    projectId: string,
    issueId: string
  ): Promise<TStringXAcceptanceRecord[]> {
    return this.get(
      `/api/workspaces/${workspaceSlug}/projects/${projectId}/issues/${issueId}/acceptance-records/`
    ).then((response) => response?.data);
  }

  async createIssueAcceptanceRecord(
    workspaceSlug: string,
    projectId: string,
    issueId: string,
    payload: TStringXAcceptanceWritePayload
  ): Promise<TStringXAcceptanceRecord> {
    return this.post(
      `/api/workspaces/${workspaceSlug}/projects/${projectId}/issues/${issueId}/acceptance-records/`,
      payload
    ).then((response) => response?.data);
  }

  async patchIssueAcceptanceRecord(
    workspaceSlug: string,
    projectId: string,
    issueId: string,
    recordId: string,
    payload: TStringXAcceptanceWritePayload
  ): Promise<TStringXAcceptanceRecord> {
    return this.patch(
      `/api/workspaces/${workspaceSlug}/projects/${projectId}/issues/${issueId}/acceptance-records/${recordId}/`,
      payload
    ).then((response) => response?.data);
  }

  async listProjectAcceptanceRecords(workspaceSlug: string, projectId: string): Promise<TStringXAcceptanceRecord[]> {
    return this.get(`/api/workspaces/${workspaceSlug}/projects/${projectId}/acceptance-records/`).then(
      (response) => response?.data
    );
  }
}
