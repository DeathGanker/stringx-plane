/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { observer } from "mobx-react";
// plane imports
import { useTranslation } from "@plane/i18n";
// components
import { SettingsBoxedControlItem } from "@/components/settings/boxed-control-item";
import { SettingsHeading } from "@/components/settings/heading";

export const BillingRoot = observer(function BillingRoot() {
  const { t } = useTranslation();

  return (
    <section className="relative scrollbar-hide size-full overflow-y-auto">
      <div>
        <SettingsHeading
          title={t("workspace_settings.settings.billing_and_plans.heading")}
          description={t("workspace_settings.settings.billing_and_plans.description")}
        />
        <div className="mt-6">
          <SettingsBoxedControlItem title="当前版本" description="本实例当前运行版本（演示面不展示商业升级对比）。" />
        </div>
      </div>
      {/* StringX demo shell: hide paid-plan comparison / upgrade CTAs */}
    </section>
  );
});
