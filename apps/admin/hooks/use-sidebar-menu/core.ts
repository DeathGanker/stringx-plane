/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { BrainCog } from "lucide-react";
// plane imports
import { ImageOutline, LockOutline, MailOutline, SettingsOutline, WorkspaceOutline } from "@makeplane/propel/icons";
// types
import type { TSidebarMenuItem } from "./types";

export type TCoreSidebarMenuKey = "general" | "email" | "workspace" | "authentication" | "ai" | "image";

export const coreSidebarMenuLinks: Record<TCoreSidebarMenuKey, TSidebarMenuItem> = {
  general: {
    Icon: SettingsOutline,
    name: "常规",
    description: "识别实例并查看关键信息。",
    href: `/general/`,
  },
  email: {
    Icon: MailOutline,
    name: "邮件",
    description: "配置 SMTP 控件。",
    href: `/email/`,
  },
  workspace: {
    Icon: WorkspaceOutline,
    name: "工作区",
    description: "管理本实例上的所有工作区。",
    href: `/workspace/`,
  },
  authentication: {
    Icon: LockOutline,
    name: "认证",
    description: "配置认证方式。",
    href: `/authentication/`,
  },
  ai: {
    Icon: BrainCog,
    name: "人工智能",
    description: "配置 LLM（OpenAI 兼容 / 火山方舟）凭据。",
    href: `/ai/`,
  },
  image: {
    Icon: ImageOutline,
    name: "Plane 中的图片",
    description: "允许第三方图片库。",
    href: `/image/`,
  },
};
