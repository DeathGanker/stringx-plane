/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { layout, route } from "@react-router/dev/routes";
import type { RouteConfigEntry } from "@react-router/dev/routes";

/**
 * StringX Phase 1 routes — merged into core via `mergeRoutes`.
 * Nested layout files must mirror core so children deep-merge under the same shells.
 */
export const extendedRoutes: RouteConfigEntry[] = [
  layout("./(all)/layout.tsx", [
    layout("./(all)/[workspaceSlug]/layout.tsx", [
      layout("./(all)/[workspaceSlug]/(projects)/layout.tsx", [
        // Workspace 交付概况
        layout("./(all)/[workspaceSlug]/(projects)/delivery/layout.tsx", [
          route(":workspaceSlug/delivery", "./(all)/[workspaceSlug]/(projects)/delivery/page.tsx"),
        ]),

        // Project 360 + delivery-line placeholders
        layout("./(all)/[workspaceSlug]/(projects)/projects/(detail)/[projectId]/layout.tsx", [
          route(
            ":workspaceSlug/projects/:projectId/overview",
            "./(all)/[workspaceSlug]/(projects)/projects/(detail)/[projectId]/overview/page.tsx"
          ),
          route(
            ":workspaceSlug/projects/:projectId/materials",
            "./(all)/[workspaceSlug]/(projects)/projects/(detail)/[projectId]/materials/page.tsx"
          ),
          route(
            ":workspaceSlug/projects/:projectId/sow",
            "./(all)/[workspaceSlug]/(projects)/projects/(detail)/[projectId]/sow/page.tsx"
          ),
          route(
            ":workspaceSlug/projects/:projectId/acceptance",
            "./(all)/[workspaceSlug]/(projects)/projects/(detail)/[projectId]/acceptance/page.tsx"
          ),
        ]),
      ]),
    ]),
  ]),
];
