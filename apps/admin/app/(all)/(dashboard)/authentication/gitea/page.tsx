/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { useState } from "react";
import { observer } from "mobx-react";
import useSWR from "swr";
// plane internal packages
import { Switch } from "@makeplane/propel/components/switch";
// assets
import giteaLogo from "@/app/assets/logos/gitea-logo.svg?url";
// components
import { AuthenticationMethodCard } from "@/components/authentication/authentication-method-card";
import { PageWrapper } from "@/components/common/page-wrapper";
import { Skeleton } from "@/components/common/skeleton";
import { setPromiseToast } from "@plane/blocks/toast";
// hooks
import { useInstance } from "@/hooks/store";
// types
import type { Route } from "./+types/page";
// local
import { InstanceGiteaConfigForm } from "./form";

const InstanceGiteaAuthenticationPage = observer(function InstanceGiteaAuthenticationPage() {
  // store
  const { fetchInstanceConfigurations, formattedConfig, updateInstanceConfigurations } = useInstance();
  // state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // config
  const enableGiteaConfig = formattedConfig?.IS_GITEA_ENABLED ?? "";
  useSWR("INSTANCE_CONFIGURATIONS", () => fetchInstanceConfigurations());

  const updateConfig = async (key: "IS_GITEA_ENABLED", value: string) => {
    setIsSubmitting(true);

    const payload = {
      [key]: value,
    };

    const updateConfigPromise = updateInstanceConfigurations(payload);

    setPromiseToast(updateConfigPromise, {
      loading: "正在保存配置",
      success: {
        title: "配置已保存",
        message: () => `Gitea 认证现已${value === "1" ? "启用" : "关闭"}。`,
      },
      error: {
        title: "错误",
        message: () => "保存配置失败",
      },
    });

    try {
      await updateConfigPromise;
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isGiteaEnabled = enableGiteaConfig === "1";

  return (
    <PageWrapper
      customHeader={
        <AuthenticationMethodCard
          name="Gitea"
          description="允许成员使用 Gitea 账号登录或注册 Plane。"
          icon={<img src={giteaLogo} height={24} width={24} alt="Gitea Logo" />}
          config={
            <Switch
              aria-label="启用 Gitea 认证"
              checked={isGiteaEnabled}
              onCheckedChange={() => {
                updateConfig("IS_GITEA_ENABLED", isGiteaEnabled ? "0" : "1");
              }}
              size="sm"
              disabled={isSubmitting || !formattedConfig}
            />
          }
          disabled={isSubmitting || !formattedConfig}
          withBorder={false}
        />
      }
    >
      {formattedConfig ? (
        <InstanceGiteaConfigForm config={formattedConfig} />
      ) : (
        <Skeleton className="space-y-8">
          <Skeleton.Item height="50px" width="25%" />
          <Skeleton.Item height="50px" />
          <Skeleton.Item height="50px" />
          <Skeleton.Item height="50px" />
          <Skeleton.Item height="50px" width="50%" />
        </Skeleton>
      )}
    </PageWrapper>
  );
});
export const meta: Route.MetaFunction = () => [{ title: "Gitea 认证 - God Mode" }];

export default InstanceGiteaAuthenticationPage;
