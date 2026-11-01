/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { observer } from "mobx-react";
import { useParams } from "react-router";
import { PageHead } from "@/components/core/page-title";
import { StringXPlaceholderPage } from "@/components/stringx/placeholder-page";
import { useProject } from "@/hooks/store/use-project";

/**
 * 项目 360 — StringX management home for a single project.
 * Not Analytics. Execution work items stay under /issues.
 */
function ProjectOverviewPage() {
  const { workspaceSlug, projectId } = useParams();
  const { getProjectById } = useProject();
  const project = projectId ? getProjectById(projectId) : undefined;
  const slug = workspaceSlug?.toString() ?? "";
  const id = projectId?.toString() ?? "";
  const pageTitle = project?.name ? `${project.name} - 项目 360` : "项目 360";

  return (
    <>
      <PageHead title={pageTitle} />
      <StringXPlaceholderPage
        title="项目 360"
        summary="项目交付结构首屏占位。后续展示已确认 SOW 基线、M1–M4 阶段、基线任务映射与证据入口；不把任务完成数写成验收进度。"
        bullets={[
          "SOW 的 M1–M4 是合同交付阶段，不是项目生命周期状态，也不是 Cycles / Modules。",
          "任务执行完成（completed）与管理员人工验收通过必须分开命名与建模。",
          "材料立项需人工确认；本页与 MCP 均不得静默创建项目或静默验收。",
        ]}
        links={[
          {
            href: `/${slug}/projects/${id}/materials`,
            label: "材料立项",
            description: "材料草案 → 人工确认立项（≠ Plane Intake）。",
          },
          {
            href: `/${slug}/projects/${id}/sow`,
            label: "SOW 阶段",
            description: "已确认基线与 M1–M4 交付物 / 验收标准占位。",
          },
          {
            href: `/${slug}/projects/${id}/acceptance`,
            label: "人工验收",
            description: "管理员验收记录占位；禁止复用 completed 状态。",
          },
          {
            href: `/${slug}/projects/${id}/issues`,
            label: "执行工作台",
            description: "原 Plane Work items（List 默认）。",
          },
        ]}
        footnote="第一阶段只落信息架构与路由；数据模型与 MCP 在后续刀次实现。"
      />
    </>
  );
}

export default observer(ProjectOverviewPage);
