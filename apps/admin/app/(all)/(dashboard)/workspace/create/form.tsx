/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
// plane imports
import { WEB_BASE_URL, ORGANIZATION_SIZE, RESTRICTED_URLS } from "@plane/constants";
import { Button } from "@makeplane/propel/components/button";
import { Input, InputGroup } from "@makeplane/propel/components/input";
import { Select, SelectContent, SelectItem, SelectList, SelectTrigger } from "@makeplane/propel/components/select";
import { InstanceWorkspaceService } from "@plane/services";
import type { IWorkspace } from "@plane/types";
import { validateSlug, validateWorkspaceName } from "@plane/utils";
// components
import { setToast } from "@plane/blocks/toast";
// hooks
import { useWorkspace } from "@/hooks/store";

const instanceWorkspaceService = new InstanceWorkspaceService();

export function WorkspaceCreateForm() {
  // router
  const router = useRouter();
  // states
  const [slugError, setSlugError] = useState(false);
  const [invalidSlug, setInvalidSlug] = useState(false);
  const [defaultValues, setDefaultValues] = useState<Partial<IWorkspace>>({
    name: "",
    slug: "",
    organization_size: "",
  });
  // store hooks
  const { createWorkspace } = useWorkspace();
  // form info
  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors, isSubmitting, isValid },
  } = useForm<IWorkspace>({ defaultValues, mode: "onChange" });
  // derived values
  const [workspaceBaseURL, setWorkspaceBaseURL] = useState(() => encodeURI(WEB_BASE_URL || ""));

  useEffect(() => {
    if (!WEB_BASE_URL) {
      setWorkspaceBaseURL(encodeURI(window.location.origin + "/"));
    }
  }, []);

  const handleCreateWorkspace = async (formData: IWorkspace) => {
    try {
      const res = await instanceWorkspaceService.slugCheck(formData.slug);
      if (res.status === true && !RESTRICTED_URLS.includes(formData.slug)) {
        setSlugError(false);
        try {
          await createWorkspace(formData);
          setToast({
            type: "success",
            title: "成功",
            message: "工作区已创建",
          });
          router.push(`/workspace`);
        } catch {
          setToast({
            type: "error",
            title: "错误",
            message: "无法创建工作区，请重试。",
          });
        }
      } else {
        setSlugError(true);
      }
    } catch {
      setToast({
        type: "error",
        title: "错误",
        message: "创建工作区时出错，请重试。",
      });
    }
  };

  useEffect(
    () => () => {
      // when the component unmounts set the default values to whatever user typed in
      setDefaultValues(getValues());
    },
    [getValues, setDefaultValues]
  );

  return (
    <div className="space-y-8">
      <div className="grid-col grid w-full max-w-4xl grid-cols-1 items-start justify-between gap-x-10 gap-y-6 lg:grid-cols-2">
        <div className="flex flex-col gap-1">
          <h4 className="text-13 text-tertiary">工作区名称</h4>
          <div className="flex flex-col gap-1">
            <Controller
              control={control}
              name="name"
              rules={{
                validate: (value) => validateWorkspaceName(value, true),
              }}
              render={({ field: { value, ref, onChange } }) => (
                <InputGroup size="lg">
                  <Input
                    size="lg"
                    id="workspaceName"
                    type="text"
                    value={value}
                    onChange={(e) => {
                      onChange(e.target.value);
                      setValue("name", e.target.value);
                      setValue("slug", e.target.value.toLocaleLowerCase().trim().replace(/ /g, "-"), {
                        shouldValidate: true,
                      });
                    }}
                    ref={ref}
                    aria-invalid={Boolean(errors.name)}
                    data-invalid={errors.name ? true : undefined}
                    placeholder="建议使用便于识别的名称"
                  />
                </InputGroup>
              )}
            />
            <span className="text-11 text-danger-primary">{errors?.name?.message}</span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <h4 className="text-13 text-tertiary">工作区 URL</h4>
          <Controller
            control={control}
            name="slug"
            rules={{
              validate: (value) => validateSlug(value),
            }}
            render={({ field: { onChange, value, ref } }) => (
              <InputGroup size="lg">
                <span className="text-13 whitespace-nowrap text-secondary">{workspaceBaseURL}</span>
                <Input
                  id="workspaceUrl"
                  type="text"
                  size="lg"
                  value={value.toLocaleLowerCase().trim().replace(/ /g, "-")}
                  onChange={(e) => {
                    if (/^[a-zA-Z0-9_-]+$/.test(e.target.value)) setInvalidSlug(false);
                    else setInvalidSlug(true);
                    onChange(e.target.value.toLowerCase());
                  }}
                  ref={ref}
                  aria-invalid={Boolean(errors.slug)}
                  data-invalid={errors.slug ? true : undefined}
                  placeholder="workspace-name"
                />
              </InputGroup>
            )}
          />
          {slugError && <p className="text-13 text-danger-primary">该 URL 已被占用，请换一个。</p>}
          {invalidSlug && (
            <p className="text-13 text-danger-primary">URL 仅可包含字母、数字、连字符（-）与下划线（_）。</p>
          )}
          {errors.slug && <span className="text-11 text-danger-primary">{errors.slug.message}</span>}
        </div>
        <div className="flex flex-col gap-1">
          <h4 className="text-13 text-tertiary">预计有多少人使用此工作区？</h4>
          <div className="w-full">
            <Controller
              name="organization_size"
              control={control}
              rules={{ required: "此为必填项。" }}
              render={({ field: { value, onChange } }) => (
                <Select value={value} onValueChange={onChange}>
                  <SelectTrigger size="lg" placeholder="选择人数范围" />
                  <SelectContent>
                    <SelectList>
                      {ORGANIZATION_SIZE.map((item) => (
                        <SelectItem key={item} value={item} label={item} size="lg" />
                      ))}
                    </SelectList>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.organization_size && (
              <span className="text-13 text-danger-primary">{errors.organization_size.message}</span>
            )}
          </div>
        </div>
      </div>
      <div className="flex max-w-4xl items-center gap-4 py-1">
        <Button
          variant="primary"
          size="md"
          stretch="auto"
          onClick={handleSubmit(handleCreateWorkspace)}
          disabled={!isValid}
          loading={isSubmitting}
          label={isSubmitting ? "创建中" : "创建工作区"}
        />
        <Button
          variant="secondary"
          size="md"
          stretch="auto"
          nativeButton={false}
          render={<Link href="/workspace" />}
          label="返回"
        />
      </div>
    </div>
  );
}
