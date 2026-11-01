/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { observer } from "mobx-react";
import { WEB_BASE_URL } from "@plane/constants";
// plane internal packages
import { Tooltip } from "@makeplane/propel/components/tooltip";
import { ArrowNarrowLeftOutline, NewTabOutline } from "@makeplane/propel/icons";
import { cn } from "@plane/utils";
// hooks
import { useInstance, useTheme } from "@/hooks/store";

export const AdminSidebarHelpSection = observer(function AdminSidebarHelpSection() {
  // store
  const { instance } = useInstance();
  const { isSidebarCollapsed, toggleSidebar } = useTheme();

  const productLink = encodeURI(WEB_BASE_URL + "/");
  const versionLabel = instance?.current_version ? `v${instance.current_version}` : undefined;

  return (
    <div
      className={cn(
        "flex h-14 w-full flex-shrink-0 items-center justify-between gap-1 self-baseline border-t border-subtle bg-surface-1 px-4",
        {
          "h-auto flex-col gap-1.5 py-2": isSidebarCollapsed,
        }
      )}
    >
      <div className={`flex items-center gap-1 ${isSidebarCollapsed ? "w-full flex-col justify-center" : "w-full"}`}>
        <Tooltip label="进入产品（Web）" side={isSidebarCollapsed ? "right" : "top"}>
          <a
            href={productLink}
            className={cn(
              "relative inline-flex items-center justify-center gap-1.5 rounded-sm bg-accent-primary px-2.5 py-1.5 text-body-xs-medium whitespace-nowrap text-on-color hover:opacity-90",
              { "w-full": isSidebarCollapsed }
            )}
            aria-label="进入产品"
          >
            <NewTabOutline width={14} height={14} />
            {!isSidebarCollapsed && "进入产品"}
          </a>
        </Tooltip>
        {!isSidebarCollapsed && versionLabel && (
          <Tooltip label={`版本 ${versionLabel}`} side="top">
            <span className="ml-auto px-1 text-10 text-tertiary">{versionLabel}</span>
          </Tooltip>
        )}
        <Tooltip label="切换侧栏" side={isSidebarCollapsed ? "right" : "top"}>
          <button
            type="button"
            aria-label="切换侧栏"
            className={cn(
              "grid place-items-center rounded-md p-1.5 text-secondary outline-none hover:bg-layer-1-hover hover:text-primary",
              {
                "w-full": isSidebarCollapsed,
                "ml-auto": isSidebarCollapsed || !versionLabel,
              }
            )}
            onClick={() => toggleSidebar(!isSidebarCollapsed)}
          >
            <ArrowNarrowLeftOutline className={`size-4 duration-300 ${isSidebarCollapsed ? "rotate-180" : ""}`} />
          </button>
        </Tooltip>
      </div>
      {isSidebarCollapsed && versionLabel && (
        <Tooltip label={`版本 ${versionLabel}`} side="right">
          <span className="text-10 text-tertiary">{versionLabel}</span>
        </Tooltip>
      )}
    </div>
  );
});
