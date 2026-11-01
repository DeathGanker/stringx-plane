# StringX MCP 接口草案（第一阶段文档，无实现）

> 本文件只定边界与意图，**不实现** MCP server。完整工具面在后续刀次。

## 允许（日常输入 / 查询）

- 上报 / 查询材料草案与元数据
- 只读：项目阶段总览、SOW 阶段、基线任务上下文
- 上报任务成果（附件 / 链接 / 说明）— **不**改变验收结论

## 禁止

- **确认立项**工具（立项必须 Web 人工确认）
- **验收**工具（验收必须管理员在 Web 完成）
- 静默创建项目 / 静默改验收状态 / 静默触发接近「假验收」的 Automations

## 建议工具名（草案）

| 工具                         | 读写 | 说明                                                  |
| ---------------------------- | ---- | ----------------------------------------------------- |
| `submit_material_draft`      | 写   | 材料草案；不立项                                      |
| `get_material_status`        | 读   | 草案 / 已确认                                         |
| `get_project_stage_overview` | 读   | M1–M4 + 基线任务执行概况（完成数≠验收）               |
| `get_task_definition`        | 读   | 任务定义与 revision（可对齐 Web GET task-definition） |
| `submit_task_outcome`        | 写   | 成果回传；不验收                                      |

明确不存在：`confirm_project_intake`、`accept_deliverable`、`mark_accepted`。

刀 2 起 Web 已有验收写接口，**仍禁止** MCP 封装这些路径。
