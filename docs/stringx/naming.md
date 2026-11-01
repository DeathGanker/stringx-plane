# StringX 概念命名与状态边界

## 硬边界（不可混用）

| 概念         | 是什么                                         | 不是什么                                        |
| ------------ | ---------------------------------------------- | ----------------------------------------------- |
| 材料立项     | 材料草案 + **人工确认** 后才立项               | Plane **Intake** / Triage                       |
| SOW 基线     | 已确认的合同范围与来源追溯                     | 未确认材料、草稿                                |
| M1–M4        | SOW **合同交付阶段**（交付物 / 阶段验收标准）  | Plane **Cycles**、**Modules**、项目生命周期状态 |
| 任务执行完成 | Issue `state.group === completed` 等执行态     | **验收通过**                                    |
| 人工验收     | 管理员确认记录（人、时、结论、证据）           | 任务 completed、自动化改状态、MCP 验收工具      |
| 任务定义     | 目标 / 交付物 / 验收标准 / 所需能力 + revision | Issue 描述的随意改写（历史 revision 不可覆写）  |

## 执行 vs 验收（已落地模型）

执行侧继续使用 Plane Issue 状态组（backlog / unstarted / started / completed / cancelled）。

验收侧独立表 `stringx_acceptance_records`（模型 `AcceptanceRecord`），状态枚举：

| 状态值                | 含义     |
| --------------------- | -------- |
| `acceptance_pending`  | 待验收   |
| `acceptance_passed`   | 验收通过 |
| `acceptance_rejected` | 驳回整改 |

关联字段：`issue`、`decided_by`、`decided_at`、`conclusion`、`evidence_url` / `evidence_notes`、`task_definition_revision`。

禁止：

- 把 Issue `completed` 显示为「已验收」
- 用完成比例推导「验收进度 / 验收通过率」
- 在无记录时展示 `0` / `100%` /「正常」冒充验收或经营结论
- MCP / Automations 写验收结论

## 任务定义（已落地模型）

| 表 / 模型                                                      | 关系                           | 说明                                                                                         |
| -------------------------------------------------------------- | ------------------------------ | -------------------------------------------------------------------------------------------- |
| `stringx_task_definitions` / `TaskDefinition`                  | **1:1** `Issue`                | 当前定义：`goal`、`deliverables`、`acceptance_criteria`、`required_capabilities`、`revision` |
| `stringx_task_definition_revisions` / `TaskDefinitionRevision` | N:1 `TaskDefinition` + `Issue` | 每次内容变更递增 revision 并**追加**快照；禁止原地改历史                                     |

## API（最小）

- `GET/PUT .../issues/<issue_id>/task-definition/`
- `GET .../issues/<issue_id>/task-definition/revisions/`
- `GET/POST .../issues/<issue_id>/acceptance-records/`（结论状态仅项目 ADMIN）
- `PATCH .../issues/<issue_id>/acceptance-records/<id>/`（结论写入仅 ADMIN）
- `GET .../projects/<project_id>/acceptance-records/`（项目验收页）

## 导航用语

- **交付概况**：工作区跨项目管理入口
- **项目 360**：单项目交付结构首屏
- **执行工作台**：原 Work items（Issues）
- **人工验收**：独立验收记录列表（≠ completed）
