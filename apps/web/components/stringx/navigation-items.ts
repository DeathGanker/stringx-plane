/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { BoardOutline, CheckDoneOutline, ClipboardOutline, HierarchyOutline } from "@makeplane/propel/icons";
import { EUserPermissions } from "@plane/constants";
import type { TNavigationItem } from "@/components/workspace/sidebar/project-navigation";

/**
 * StringX project nav items always rendered (not gated by Plane feature flags).
 * Uses `label` so we do not churn i18n locales in Phase 1.
 */
export function getStringXProjectNavigationItems(workspaceSlug: string, projectId: string): TNavigationItem[] {
  const base = `/${workspaceSlug}/projects/${projectId}`;
  return [
    {
      key: "overview",
      name: "项目 360",
      label: "项目 360",
      i18n_key: "sidebar.work_items",
      href: `${base}/overview`,
      icon: BoardOutline,
      access: [EUserPermissions.ADMIN, EUserPermissions.MEMBER, EUserPermissions.GUEST],
      shouldRender: true,
      sortOrder: 0,
    },
    {
      key: "materials",
      name: "材料立项",
      label: "材料立项",
      i18n_key: "sidebar.work_items",
      href: `${base}/materials`,
      icon: ClipboardOutline,
      access: [EUserPermissions.ADMIN, EUserPermissions.MEMBER],
      shouldRender: true,
      sortOrder: 0.5,
    },
    {
      key: "sow",
      name: "SOW",
      label: "SOW",
      i18n_key: "sidebar.work_items",
      href: `${base}/sow`,
      icon: HierarchyOutline,
      access: [EUserPermissions.ADMIN, EUserPermissions.MEMBER],
      shouldRender: true,
      sortOrder: 0.6,
    },
    {
      key: "acceptance",
      name: "人工验收",
      label: "人工验收",
      i18n_key: "sidebar.work_items",
      href: `${base}/acceptance`,
      icon: CheckDoneOutline,
      access: [EUserPermissions.ADMIN, EUserPermissions.MEMBER],
      shouldRender: true,
      sortOrder: 0.7,
    },
  ];
}
