/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { EIssueLayoutTypes } from "@plane/types";

/**
 * StringX Phase 1 product-surface controls.
 *
 * Goal: subtract Plane CE chrome that collides with the delivery line
 * (材料 → 立项确认 → SOW → M1–M4 → 任务 → 成果 → 人工验收) without deleting
 * upstream packages. Features stay in settings for explicit re-enable.
 *
 * Hard rules:
 * - Cycles / Modules ≠ SOW M1–M4
 * - Intake ≠ 材料立项
 * - completed ≠ 验收通过
 */
export const STRINGX_PHASE1 = {
  /** Workspace sidebar keys omitted from primary chrome. */
  hiddenWorkspaceNavKeys: ["analytics"] as const,
  /** User-menu keys omitted from primary chrome. */
  hiddenUserMenuKeys: ["pi-chat", "dashboards"] as const,
  /** Project settings keys omitted from settings sidebar (routes remain). */
  hiddenProjectSettingsKeys: ["estimates", "automations"] as const,
  /**
   * Issue layout switcher options for the project work-item header.
   * Calendar / Gantt stay in the codebase but are demoted from the default switcher.
   * List remains the backend + frontend default layout.
   */
  primaryIssueLayouts: [EIssueLayoutTypes.LIST, EIssueLayoutTypes.KANBAN, EIssueLayoutTypes.SPREADSHEET] as const,
  /** Hide Space / DeployBoard publish entry from project actions. */
  hideProjectPublishAction: true,
  /** Default project landing tab for StringX management path. */
  defaultProjectTabKey: "overview" as const,
} as const;

export type TStringXHiddenWorkspaceNavKey = (typeof STRINGX_PHASE1.hiddenWorkspaceNavKeys)[number];
export type TStringXHiddenUserMenuKey = (typeof STRINGX_PHASE1.hiddenUserMenuKeys)[number];
export type TStringXHiddenProjectSettingsKey = (typeof STRINGX_PHASE1.hiddenProjectSettingsKeys)[number];
