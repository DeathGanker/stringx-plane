# StringX 本机冒烟（火山方舟 + 中文默认）

密钥与真实接入点 ID **永不进 git**。下文只用占位符。

## 中文偏好

- 代码默认：`packages/i18n` 中 `FALLBACK_LANGUAGE = "zh-CN"`
- 用户侧：个人资料 language 设为 `zh-CN`（或清空后依赖 fallback）
- God Mode Admin：侧栏 / 登录 / 常规·邮件·认证·AI 等标题级文案已硬编码中文（非全量 i18n）

## 火山方舟（豆包）LLM 配置

OpenAI 兼容协议；Provider 保持 `openai`。

| 项             | 值 / 说明                                      |
| -------------- | ---------------------------------------------- |
| `LLM_PROVIDER` | `openai`                                       |
| `LLM_BASE_URL` | `https://ark.cn-beijing.volces.com/api/v3`     |
| `LLM_MODEL`    | `<ep-接入点ID>`（形如 `ep-…`）                 |
| `LLM_API_KEY`  | 方舟 API Key；亦可用环境变量别名 `ARK_API_KEY` |
| 可选别名       | `ARK_BASE_URL`、`ARK_MODEL`（与上表等价）      |

也可在 **God Mode → 人工智能** 填写三字段：**Base URL**、**接入点 ID / 模型**、**API Key**（写入实例配置，勿提交）。

自定义 Base URL 或模型以 `ep-` 开头时，跳过官方 OpenAI 模型白名单。

## 启动

1. 在本仓库根目录使用 compose（`docker-compose.override.yml` 将 Redis/Postgres/MinIO 宿主端口 remap 为 **6389 / 5439 / 9010**，便于与本机其他栈并存）。若用 `docker-compose-local.yml`，请同时 `-f docker-compose.override.yml`。
2. 确保 `apps/api/.env`（gitignore）含所需变量；**不要**把该文件或密钥提交进仓。
3. 跑迁移，需包含刀 2 的 `0127_stringx_task_definition_and_acceptance`。
4. `pnpm dev`：Web **3000**，Admin / God Mode **3001**。

## 冒烟检查

1. 打开 `http://localhost:3001` → 人工智能：可见 **Base URL**、**接入点 ID / 模型**、**API Key** 三字段。
2. 调用一次 GPT 集成（或等价 `chat.completions`）确认方舟通路。
3. 本机已验证过则可不在 CI/云端重跑；在 PR 描述注明即可。

## 安全

- 勿提交 `apps/api/.env`、根 `.env`、含 `ARK_API_KEY` / `LLM_API_KEY` 真实值的文件。
- 勿把真实 `ep-…`、API Key 写进文档或 PR 描述。
- 提交前自检：`rg -n 'ARK_API_KEY|sk-|ep-'` 应仅见 env 读取名或文档占位，无真实密钥。
