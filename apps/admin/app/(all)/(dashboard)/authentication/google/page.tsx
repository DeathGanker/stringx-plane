/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { useState } from "react";
import { observer } from "mobx-react";
import useSWR from "swr";
import { Switch } from "@makeplane/propel/components/switch";
// assets
import GoogleLogo from "@/app/assets/logos/google-logo.svg?url";
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
import { InstanceGoogleConfigForm } from "./form";

const InstanceGoogleAuthenticationPage = observer(function InstanceGoogleAuthenticationPage(
  _props: Route.ComponentProps
) {
  // store
  const { fetchInstanceConfigurations, formattedConfig, updateInstanceConfigurations } = useInstance();
  // state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // config
  const enableGoogleConfig = formattedConfig?.IS_GOOGLE_ENABLED ?? "";

  useSWR("INSTANCE_CONFIGURATIONS", () => fetchInstanceConfigurations());

  const updateConfig = async (key: "IS_GOOGLE_ENABLED", value: string) => {
    setIsSubmitting(true);

    const payload = {
      [key]: value,
    };

    const updateConfigPromise = updateInstanceConfigurations(payload);

    setPromiseToast(updateConfigPromise, {
      loading: "正在保存配置",
      success: {
        title: "配置已保存",
        message: () => `Google 认证现已${value === "1" ? "启用" : "关闭"}。`,
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
  return (
    <PageWrapper
      customHeader={
        <AuthenticationMethodCard
          name="Google"
          description="允许成员使用 Google 账号登录或注册 Plane。"
          icon={<img src={GoogleLogo} height={24} width={24} alt="Google Logo" />}
          config={
            <Switch
              aria-label="启用 Google 认证"
              checked={Boolean(parseInt(enableGoogleConfig))}
              onCheckedChange={() => {
                if (Boolean(parseInt(enableGoogleConfig)) === true) {
                  updateConfig("IS_GOOGLE_ENABLED", "0");
                } else {
                  updateConfig("IS_GOOGLE_ENABLED", "1");
                }
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
        <InstanceGoogleConfigForm config={formattedConfig} />
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

export const meta: Route.MetaFunction = () => [{ title: "Google 认证 - God Mode" }];

export default InstanceGoogleAuthenticationPage;
