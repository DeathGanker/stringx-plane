/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { observer } from "mobx-react";
import { CyclesOutline } from "@makeplane/propel/icons";
import { useTranslation } from "@plane/i18n";
import { ContentWrapper } from "@plane/blocks/layout";
// components
import { PageHead } from "@/components/core/page-title";
// hooks
import { useWorkspace } from "@/hooks/store/use-workspace";

/**
 * StringX demo shell: Active Cycles workspace view without paid-plan upgrade wall
 * (no WorkspaceActiveCyclesUpgrade / plane.so/pricing CTA).
 */
function WorkspaceActiveCyclesPage() {
  const { t } = useTranslation();
  const { currentWorkspace } = useWorkspace();
  const pageTitle = currentWorkspace?.name ? `${currentWorkspace?.name} - Active Cycles` : undefined;

  return (
    <>
      <PageHead title={pageTitle} />
      <ContentWrapper className="flex items-center justify-center">
        <div className="flex max-w-md flex-col items-center gap-3 px-6 py-16 text-center">
          <CyclesOutline className="size-10 rotate-180 text-tertiary" />
          <h2 className="text-18 font-medium text-primary">{t("active_cycles")}</h2>
          <p className="text-13 text-tertiary">
            工作区级 Active Cycles 总览不在本演示面提供。请在各项目内的 Cycles 中查看进行中的周期。
          </p>
        </div>
      </ContentWrapper>
    </>
  );
}

export default observer(WorkspaceActiveCyclesPage);
