/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { useParams } from "react-router";
import { StringXProjectAcceptancePage } from "@/components/stringx/project-acceptance-page";

function ProjectAcceptancePage() {
  const { workspaceSlug, projectId } = useParams();
  const slug = workspaceSlug?.toString() ?? "";
  const id = projectId?.toString() ?? "";

  if (!slug || !id) return null;

  return <StringXProjectAcceptancePage workspaceSlug={slug} projectId={id} />;
}

export default ProjectAcceptancePage;
