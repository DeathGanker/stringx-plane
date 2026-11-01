/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { useParams } from "react-router";
import { PageHead } from "@/components/core/page-title";
import { StringXPlaceholderPage } from "@/components/stringx/placeholder-page";

function ProjectSowPage() {
  const { workspaceSlug, projectId } = useParams();
  const slug = workspaceSlug?.toString() ?? "";
  const id = projectId?.toString() ?? "";

  return (
    <>
      <PageHead title="SOW 阶段" />
      <StringXPlaceholderPage
        title="SOW 阶段（M1–M4）"
        summary="已确认 SOW 基线与合同交付阶段占位。禁止用 Cycles 或 Modules 冒充 M1–M4。"
        bullets={[
          "每个阶段应有交付物与阶段验收标准；阶段选中只改变查看范围，不推进生命周期。",
          "阶段内「基线任务完成数」≠「阶段验收通过」。",
          "基线来源需可追溯到材料 / 确认记录（后续刀次实现）。",
        ]}
        links={[
          {
            href: `/${slug}/projects/${id}/overview`,
            label: "返回项目 360",
          },
          {
            href: `/${slug}/projects/${id}/acceptance`,
            label: "人工验收",
            description: "与任务 completed 分离的验收记录占位。",
          },
        ]}
        footnote="若后置产品分解需要「模块」概念，必须改名隔离，不得直接复用 Plane Modules。"
      />
    </>
  );
}

export default ProjectSowPage;
