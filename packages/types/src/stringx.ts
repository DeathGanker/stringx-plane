/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

/** Independent of Issue state.group — never treat completed as acceptance. */
export type TStringXAcceptanceStatus = "acceptance_pending" | "acceptance_passed" | "acceptance_rejected";

export type TStringXTaskDefinition = {
  id: string | null;
  workspace: string | null;
  project: string;
  issue: string;
  goal: string;
  deliverables: string;
  acceptance_criteria: string;
  required_capabilities: string;
  revision: number;
  created_at?: string;
  updated_at?: string;
  created_by?: string | null;
  updated_by?: string | null;
};

export type TStringXTaskDefinitionRevision = {
  id: string;
  workspace: string;
  project: string;
  issue: string;
  task_definition: string;
  revision: number;
  goal: string;
  deliverables: string;
  acceptance_criteria: string;
  required_capabilities: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
};

export type TStringXAcceptanceRecord = {
  id: string;
  workspace: string;
  project: string;
  issue: string;
  status: TStringXAcceptanceStatus;
  conclusion: string;
  evidence_url: string;
  evidence_notes: string;
  task_definition_revision: string | null;
  decided_by: string | null;
  decided_at: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
  issue_meta?: {
    id: string;
    name: string;
    sequence_id: number;
  } | null;
};

export type TStringXTaskDefinitionWritePayload = {
  goal: string;
  deliverables: string;
  acceptance_criteria: string;
  required_capabilities: string;
};

export type TStringXAcceptanceWritePayload = {
  status?: TStringXAcceptanceStatus;
  conclusion?: string;
  evidence_url?: string;
  evidence_notes?: string;
  task_definition_revision?: string | null;
};
