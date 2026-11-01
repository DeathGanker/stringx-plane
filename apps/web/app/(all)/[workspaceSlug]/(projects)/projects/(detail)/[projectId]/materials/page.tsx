/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { useParams } from "react-router";
import { PageHead } from "@/components/core/page-title";
import { StringXPlaceholderPage } from "@/components/stringx/placeholder-page";

function ProjectMaterialsPage() {
  const { workspaceSlug, projectId } = useParams();
  const slug = workspaceSlug?.toString() ?? "";
  const id = projectId?.toString() ?? "";

  return (
    <>
      <PageHead title="材料立项" />
      <StringXPlaceholderPage
        title="材料立项"
        summary="材料草案与人工确认立项占位。Plane Intake / Triage 不是本路径，禁止混用。"
        bullets={[
          "流程：材料草案 → 人工确认立项 → 才进入已确认 SOW 基线。",
          "AI / MCP 可上报材料，但不得提供静默立项工具。",
          "无确认则不应出现「已确认基线」或伪装成项目已立项。",
        ]}
        links={[
          {
            href: `/${slug}/projects/${id}/overview`,
            label: "返回项目 360",
          },
          {
            href: `/${slug}/projects/${id}/sow`,
            label: "SOW 阶段",
            description: "立项确认后的基线与 M1–M4 占位。",
          },
        ]}
        footnote="本轮无数据模型与写接口；仅保留概念命名与路由。"
      />
    </>
  );
}

export default ProjectMaterialsPage;
