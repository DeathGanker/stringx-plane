/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { observer } from "mobx-react";
// ui
import { Tooltip } from "@makeplane/propel/components/tooltip";
// hooks
import { usePlatformOS } from "@/hooks/use-platform-os";
import packageJson from "package.json";

/**
 * StringX demo shell: version-only footer chip.
 * No Community / Upgrade copy; does not open PaidPlanUpgradeModal.
 */
export const WorkspaceEditionBadge = observer(function WorkspaceEditionBadge() {
  const { isMobile } = usePlatformOS();
  const versionLabel = `v${packageJson.version}`;

  return (
    <Tooltip label={`版本：${versionLabel}`} disabled={isMobile}>
      <span
        className="inline-flex items-center rounded-sm px-2 py-1 text-11 text-tertiary"
        aria-label={`版本 ${versionLabel}`}
      >
        {versionLabel}
      </span>
    </Tooltip>
  );
});
