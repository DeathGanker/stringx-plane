/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { observer } from "mobx-react";
// hooks
import type { TSelectionHelper } from "@/hooks/use-multiple-select";

type Props = {
  className?: string;
  selectionHelpers: TSelectionHelper;
};

/**
 * StringX demo shell: CE bulk-ops banner was a Plane One marketing CTA
 * (MARKETING_PLANE_ONE_PAGE_LINK / plane.so/one). Render nothing on the demo path.
 */
export const IssueBulkOperationsRoot = observer(function IssueBulkOperationsRoot(_props: Props) {
  return null;
});
