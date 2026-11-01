/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { useForm } from "react-hook-form";
import { ThoughtsOutline } from "@makeplane/propel/icons";
import { Button } from "@makeplane/propel/components/button";
import type { IFormattedInstanceConfiguration, TInstanceAIConfigurationKeys } from "@plane/types";
// components
import type { TControllerInputFormField } from "@/components/common/controller-input";
import { ControllerInput } from "@/components/common/controller-input";
import { setToast } from "@plane/blocks/toast";
// hooks
import { useInstance } from "@/hooks/store";

type IInstanceAIForm = {
  config: IFormattedInstanceConfiguration;
};

type AIFormValues = Record<TInstanceAIConfigurationKeys, string>;

export function InstanceAIForm(props: IInstanceAIForm) {
  const { config } = props;
  // store
  const { updateInstanceConfigurations } = useInstance();
  // form data
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AIFormValues>({
    defaultValues: {
      LLM_BASE_URL: config["LLM_BASE_URL"] || "",
      LLM_MODEL: config["LLM_MODEL"] || "",
      LLM_API_KEY: config["LLM_API_KEY"] || "",
    },
  });

  const aiFormFields: TControllerInputFormField<AIFormValues>[] = [
    {
      key: "LLM_BASE_URL",
      type: "text",
      label: "Base URL",
      description: (
        <>
          OpenAI 兼容协议的 API 根地址。火山方舟示例：
          <code className="mx-1 text-12">https://ark.cn-beijing.volces.com/api/v3</code>
          。留空则使用官方 OpenAI。
        </>
      ),
      placeholder: "https://ark.cn-beijing.volces.com/api/v3",
      error: Boolean(errors.LLM_BASE_URL),
      required: false,
    },
    {
      key: "LLM_MODEL",
      type: "text",
      label: "接入点 ID / 模型",
      description: (
        <>
          OpenAI 模型名，或火山方舟推理接入点 ID（形如 <code className="text-12">ep-…</code>
          ）。自定义 Base URL 或 <code className="text-12">ep-</code> 前缀时不做官方模型白名单校验。
        </>
      ),
      placeholder: "ep-xxxxxxxxxxxxxxxx",
      error: Boolean(errors.LLM_MODEL),
      required: false,
    },
    {
      key: "LLM_API_KEY",
      type: "password",
      label: "API Key",
      description: <>填写 LLM_API_KEY；本机也可用环境变量 ARK_API_KEY 作为兼容别名。密钥不会进入 git。</>,
      placeholder: "请输入 API Key",
      error: Boolean(errors.LLM_API_KEY),
      required: false,
    },
  ];

  const onSubmit = async (formData: AIFormValues) => {
    const payload: Partial<AIFormValues> = { ...formData };

    await updateInstanceConfigurations(payload)
      .then(() =>
        setToast({
          type: "success",
          title: "已保存",
          message: "AI 设置已更新",
        })
      )
      .catch((err) => console.error(err));
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div>
          <div className="pb-1 text-18 font-medium text-primary">LLM（OpenAI 兼容 / 火山方舟）</div>
          <div className="text-13 font-regular text-tertiary">
            通过 OpenAI 兼容客户端接入官方 OpenAI 或火山方舟（豆包）。Provider 请保持为 openai。
          </div>
        </div>
        <div className="grid-col grid w-full grid-cols-1 items-center justify-between gap-x-12 gap-y-8 lg:grid-cols-3">
          {aiFormFields.map((field) => (
            <ControllerInput
              key={field.key}
              control={control}
              type={field.type}
              name={field.key}
              label={field.label}
              description={field.description}
              placeholder={field.placeholder}
              error={field.error}
              required={field.required}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col items-start gap-4">
        <Button
          variant="primary"
          size="md"
          stretch="auto"
          onClick={handleSubmit(onSubmit)}
          loading={isSubmitting}
          label={isSubmitting ? "保存中" : "保存更改"}
        />

        <div className="relative inline-flex items-center gap-1.5 rounded-sm border border-accent-subtle bg-accent-subtle px-4 py-2 text-caption-sm-regular text-accent-secondary">
          <ThoughtsOutline className="size-4" />
          <div>密钥仅保存在实例配置或本机被 gitignore 的 .env 中，切勿写入仓库或 PR 描述。</div>
        </div>
      </div>
    </div>
  );
}
