/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { useState } from "react";
import { observer } from "mobx-react";
import Link from "next/link";
import useSWR from "swr";
import { LoadingOutline as LoaderIcon } from "@makeplane/propel/icons";
// types
import { Button } from "@makeplane/propel/components/button";
import { Switch } from "@makeplane/propel/components/switch";
import type { TInstanceConfigurationKeys } from "@plane/types";
import { cn } from "@plane/utils";
// components
import { PageWrapper } from "@/components/common/page-wrapper";
import { Skeleton } from "@/components/common/skeleton";
import { WorkspaceListItem } from "@/components/workspace/list-item";
import { setPromiseToast } from "@plane/blocks/toast";
// hooks
import { useInstance, useWorkspace } from "@/hooks/store";
// types
import type { Route } from "./+types/page";

const WorkspaceManagementPage = observer(function WorkspaceManagementPage(_props: Route.ComponentProps) {
  // states
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // store
  const { formattedConfig, fetchInstanceConfigurations, updateInstanceConfigurations } = useInstance();
  const {
    workspaceIds,
    loader: workspaceLoader,
    paginationInfo,
    fetchWorkspaces,
    fetchNextWorkspaces,
  } = useWorkspace();
  // derived values
  const disableWorkspaceCreation = formattedConfig?.DISABLE_WORKSPACE_CREATION ?? "";
  const hasNextPage = paginationInfo?.next_page_results && paginationInfo?.next_cursor !== undefined;

  // fetch data
  useSWR("INSTANCE_CONFIGURATIONS", () => fetchInstanceConfigurations());
  useSWR("INSTANCE_WORKSPACES", () => fetchWorkspaces());

  const updateConfig = async (key: TInstanceConfigurationKeys, value: string) => {
    setIsSubmitting(true);

    const payload = {
      [key]: value,
    };

    const updateConfigPromise = updateInstanceConfigurations(payload);

    setPromiseToast(updateConfigPromise, {
      loading: "正在保存配置",
      success: {
        title: "成功",
        message: () => "配置已保存",
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
      header={{
        title: "本实例上的工作区",
        description: "查看全部工作区，并控制谁可以创建工作区。",
      }}
    >
      <div className="space-y-3">
        {formattedConfig ? (
          <div className={cn("flex w-full items-center gap-14 rounded-sm")}>
            <div className="flex grow items-center gap-4">
              <div className="grow">
                <div className="pb-1 text-16 font-medium">禁止其他人创建工作区</div>
                <div className={cn("text-11 leading-5 font-regular text-tertiary")}>
                  开启后仅你可创建工作区，新工作区需由你邀请用户加入。
                </div>
              </div>
            </div>
            <div className={`shrink-0 pr-4 ${isSubmitting && "opacity-70"}`}>
              <div className="flex items-center gap-4">
                <Switch
                  checked={Boolean(parseInt(disableWorkspaceCreation))}
                  onCheckedChange={() => {
                    if (Boolean(parseInt(disableWorkspaceCreation)) === true) {
                      updateConfig("DISABLE_WORKSPACE_CREATION", "0");
                    } else {
                      updateConfig("DISABLE_WORKSPACE_CREATION", "1");
                    }
                  }}
                  size="sm"
                  aria-label="禁止其他人创建工作区"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>
        ) : (
          <Skeleton>
            <Skeleton.Item height="50px" width="100%" />
          </Skeleton>
        )}
        {workspaceLoader !== "init-loader" ? (
          <>
            <div className="flex items-center justify-between gap-2 pt-6">
              <div className="flex flex-col items-start gap-x-2">
                <div className="flex items-center gap-2 text-16 font-medium">
                  本实例全部工作区 <span className="text-tertiary">• {workspaceIds.length}</span>
                  {workspaceLoader && ["mutation", "pagination"].includes(workspaceLoader) && (
                    <LoaderIcon className="h-4 w-4 animate-spin" />
                  )}
                </div>
                <div className={cn("text-11 leading-5 font-regular text-tertiary")}>
                  暂不支持删除工作区；仅当你是该工作区的管理员或成员时才能进入。
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  stretch="auto"
                  nativeButton={false}
                  render={<Link href="/workspace/create" />}
                  label="创建工作区"
                />
              </div>
            </div>
            <div className="flex flex-col gap-4 py-2">
              {workspaceIds.map((workspaceId) => (
                <WorkspaceListItem key={workspaceId} workspaceId={workspaceId} />
              ))}
            </div>
            {hasNextPage && (
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="md"
                  stretch="auto"
                  onClick={() => fetchNextWorkspaces()}
                  loading={workspaceLoader === "pagination"}
                  label="加载更多"
                />
              </div>
            )}
          </>
        ) : (
          <Skeleton className="space-y-10 py-8">
            <Skeleton.Item height="24px" width="20%" />
            <Skeleton.Item height="92px" width="100%" />
            <Skeleton.Item height="92px" width="100%" />
            <Skeleton.Item height="92px" width="100%" />
          </Skeleton>
        )}
      </div>
    </PageWrapper>
  );
});

export const meta: Route.MetaFunction = () => [{ title: "工作区管理 - God Mode" }];

export default WorkspaceManagementPage;
