# StringX on Plane

本仓库是 makeplane/plane 的空叉（`DeathGanker/stringx-plane`），按 2026-11-01 已拍板的第一阶段简报绿野重做交付主线。旧 Codeup 实现仅作语义参考，禁止整包移植。

## 交付主线

材料 → **人工确认立项** → SOW 基线 → **M1–M4 阶段** → 任务（含任务定义）→ 成果回传 → **管理员人工验收**

## 第一阶段原则

- 做减法：可删能力默认关、不进主导航；不大删上游包。
- MCP 管日常输入/查询；Web 管呈现、人工确认与证据追溯。
- **禁止**静默立项、禁止验收工具、禁止用 `completed` 冒充验收。

## 已落地刀次

1. **刀 1**：Features 减法 + delivery / overview / materials / sow / acceptance 路由占位
2. **刀 2**：任务定义 revision（1:1 Issue）+ 独立验收表 `acceptance_*`（Web 最小读写；MCP 无验收工具）
3. **刀 3**：火山方舟（豆包）LLM Base URL 适配 + zh-CN 默认（见 [local-smoke.md](./local-smoke.md)）

## 文档

- [phase-1-surface.md](./phase-1-surface.md) — 保留面 / 可藏 / 禁区
- [naming.md](./naming.md) — 概念命名、表名与 API
- [mcp-interface-draft.md](./mcp-interface-draft.md) — MCP 接口草案（无实现；明确无验收工具）
- [local-smoke.md](./local-smoke.md) — 本机方舟 + 中文冒烟（无密钥）
