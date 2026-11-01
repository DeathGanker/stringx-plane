# StringX 第一阶段：保留面与禁区

## 必留（瘦 Plane）

- Web + API + Admin + Proxy
- Workspace / Project / 成员权限 / 项目归档
- Issue 核：状态、负责人、日期、优先级、评论、Activity、附件/链接、按 key 浏览
- **List** 为默认布局
- API Tokens
- Project Features 开关、Project States、Members
- Profile / 通知最小可用

## 可藏（有能力但不进主导航 / 后置）

- Live、Home Stickies / Favorites
- Kanban、Spreadsheet（仍可切换；不抢交付首屏）
- 父子 / 依赖、复杂 Views、Pages（`page_view` 默认关）
- Webhooks、导入导出、Command K

## 第一阶段可删（默认关 / 入口拿掉）

| 能力                                                      | 处理                                             | 禁区说明                           |
| --------------------------------------------------------- | ------------------------------------------------ | ---------------------------------- |
| Cycles（含 Active Cycles）                                | Feature 默认关；种子项目也不开                   | **≠ M1–M4**                        |
| Modules                                                   | Feature 默认关                                   | **≠ SOW 阶段**；后置分解须改名隔离 |
| Intake / Triage                                           | Feature 默认关                                   | **≠ 材料立项**                     |
| Pages                                                     | Feature 默认关（本叉相对上游翻为 off）           | 后置                               |
| Analytics                                                 | 工作区主导航移除；Issues 头栏 Analytics 按钮移除 | 交付首屏不是 Analytics             |
| Calendar / Gantt                                          | 从默认布局切换器隐藏                             | List 优先                          |
| Estimates                                                 | 设置侧栏隐藏                                     | 后置                               |
| Automations                                               | 设置侧栏隐藏                                     | 避免静默改状态接近假验收           |
| Space / DeployBoard 发布                                  | 项目操作菜单隐藏 Publish                         | 不公开发布                         |
| Plane AI（Pi Chat）/ Dashboards                           | 用户菜单隐藏                                     | 内置 AI 后置                       |
| GitHub / Slack / Reactions / Votes / Issue Types / 计费壳 | 不进本阶段产品面                                 | —                                  |

## StringX 必建

| 路径                                           | 状态（第一阶段）                       |
| ---------------------------------------------- | -------------------------------------- |
| `/:workspaceSlug/delivery`                     | 占位（刀 1）                           |
| `/:workspaceSlug/projects/:projectId/overview` | 占位（刀 1）                           |
| `.../materials`                                | 占位（刀 1；模型在后续刀）             |
| `.../sow`                                      | 占位（刀 1；真实 M1–M4 在后续刀）      |
| `.../acceptance`                               | **刀 2 已接独立验收记录列表**          |
| Issue 详情面板                                 | **刀 2：任务定义 revision + 验收读写** |

## 代码触点（摘要）

- 默认 Features：`apps/api/plane/db/models/project.py` + migration `0126`
- 种子不强制开 Cycles/Modules：`workspace_seed_task.py`
- 导航 / 布局：`packages/constants/src/stringx.ts`、`workspace.ts`、`settings/project.ts`
- 路由：`apps/web/app/routes/extended.ts`
- 任务定义 / 验收：`apps/api/plane/db/models/stringx.py` + migration `0127`；API `plane/app/urls/stringx.py`；Web `components/stringx/`
