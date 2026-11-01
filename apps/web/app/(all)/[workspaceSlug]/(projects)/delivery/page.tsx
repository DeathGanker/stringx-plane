/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { useParams } from "react-router";
import { PageHead } from "@/components/core/page-title";
import { StringXPlaceholderPage } from "@/components/stringx/placeholder-page";

/**
 * Workspace-level 交付概况 entry.
 * Not Plane Analytics and not the Issues目录 alone — management home for StringX.
 */
function WorkspaceDeliveryPage() {
  const { workspaceSlug } = useParams();
  const slug = workspaceSlug?.toString() ?? "";

  return (
    <>
      <PageHead title="交付概况" />
      <StringXPlaceholderPage
        title="交付概况"
        summary="跨项目交付管理入口占位。后续会按可见项目汇总 SOW 基线与阶段，而不是经营健康度或 Plane Analytics。"
        bullets={[
          "首屏回答：有哪些在交付的项目？各自 SOW / M1–M4 结构如何？",
          "不展示虚构的经营评分、回款或验收通过率。",
          "项目点击进入「项目 360」，证据与执行详情再下钻。",
          "Cycles / Modules 不是 SOW 阶段；任务 completed 不是验收通过。",
        ]}
        links={[
          {
            href: `/${slug}/projects`,
            label: "项目目录",
            description: "保留原 Plane 项目列表，作为执行与成员管理入口。",
          },
        ]}
        footnote="本页为第一阶段信息架构占位，尚无聚合接口与验收模型。禁止静默立项 / 静默验收。"
      />
    </>
  );
}

export default WorkspaceDeliveryPage;
