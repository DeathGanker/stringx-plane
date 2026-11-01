/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { useTranslation } from "@plane/i18n";
// ui
import { DialogActions, DialogInfo } from "@makeplane/propel/components/dialog";
import { PlaneVersionNumber } from "@/components/global/version-number";

/**
 * StringX demo shell: product-updates footer is version-only.
 * No go.plane.so / forum / plane.so / support@plane.so outbound CTAs.
 */
export function ProductUpdatesFooter() {
  const { t } = useTranslation();
  return (
    <DialogActions>
      <DialogInfo>
        <div className="flex items-center gap-2 text-13 text-secondary">
          <span>{t("whats_new")}</span>
          <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current" aria-hidden>
            <circle cx={1} cy={1} r={1} />
          </svg>
          <PlaneVersionNumber />
        </div>
      </DialogInfo>
    </DialogActions>
  );
}
