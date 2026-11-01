/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { observer } from "mobx-react";
// components
import { PageWrapper } from "@/components/common/page-wrapper";
// types
import type { Route } from "./+types/page";
// local
import { WorkspaceCreateForm } from "./form";

const WorkspaceCreatePage = observer(function WorkspaceCreatePage(_props: Route.ComponentProps) {
  return (
    <PageWrapper
      header={{
        title: "在本实例创建新工作区",
        description: "创建后需在工作区设置中邀请用户加入。",
      }}
    >
      <WorkspaceCreateForm />
    </PageWrapper>
  );
});

export const meta: Route.MetaFunction = () => [{ title: "创建工作区 - God Mode" }];

export default WorkspaceCreatePage;
