/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { useParams } from "react-router";
import { PageHead } from "@/components/core/page-title";
import { StringXPlaceholderPage } from "@/components/stringx/placeholder-page";

function ProjectAcceptancePage() {
  const { workspaceSlug, projectId } = useParams();
  const slug = workspaceSlug?.toString() ?? "";
  const id = projectId?.toString() ?? "";

  return (
    <>
      <PageHead title="人工验收" />
      <StringXPlaceholderPage
        title="人工验收"
        summary="管理员人工验收记录占位。任务执行完成态（completed）不得复用为验收通过。"
        bullets={[
          "验收需要独立状态机：待验收 / 验收通过 / 驳回整改等（命名待下一刀敲定）。",
          "MCP 禁止提供验收工具；Web 保留人工确认与证据追溯。",
          "无验收模型前，不得展示 0%、100% 或「已验收」假数据。",
        ]}
        links={[
          {
            href: `/${slug}/projects/${id}/overview`,
            label: "返回项目 360",
          },
          {
            href: `/${slug}/projects/${id}/issues`,
            label: "执行工作台",
            description: "任务 completed 只表示执行完成，不表示验收通过。",
          },
        ]}
        footnote="本轮无验收写接口；任何静默验收 API 都不在范围内。"
      />
    </>
  );
}

export default ProjectAcceptancePage;
