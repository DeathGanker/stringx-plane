/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import React, { useState } from "react";
import { observer } from "mobx-react";
import { HelpOutline } from "@makeplane/propel/icons";
import { useTranslation } from "@plane/i18n";
// ui
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@makeplane/propel/components/menu";
// components
import { AppSidebarItem } from "@/components/sidebar/sidebar-item";
import { PlaneVersionNumber } from "@/components/global/version-number";
// hooks
import { usePowerK } from "@/hooks/store/use-power-k";

/**
 * StringX demo shell: help menu keeps local shortcuts only.
 * No plane.so / sales / forum / GitHub / docs outbound links.
 */
export const HelpMenuRoot = observer(function HelpMenuRoot() {
  // store hooks
  const { t } = useTranslation();
  const { toggleShortcutsListModal } = usePowerK();
  // states
  const [isNeedHelpOpen, setIsNeedHelpOpen] = useState(false);

  return (
    <Menu onOpenChange={setIsNeedHelpOpen}>
      <MenuTrigger
        render={
          <button
            type="button"
            className="group flex flex-col items-center justify-center gap-0.5 text-tertiary"
            aria-label={t("power_k.group_titles.help")}
          >
            <AppSidebarItem.Icon icon={<HelpOutline className="size-5" />} highlight={isNeedHelpOpen} />
          </button>
        }
      />
      <MenuContent
        side="bottom"
        align="end"
        footer={
          <div className="text-11 text-secondary">
            <PlaneVersionNumber />
          </div>
        }
      >
        <MenuItem label={t("keyboard_shortcuts")} onClick={() => toggleShortcutsListModal(true)} />
      </MenuContent>
    </Menu>
  );
});
