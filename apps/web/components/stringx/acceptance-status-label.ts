/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { TStringXAcceptanceStatus } from "@plane/types";

/** Display labels — never map Issue completed here. */
export const STRINGX_ACCEPTANCE_STATUS_LABEL: Record<TStringXAcceptanceStatus, string> = {
  acceptance_pending: "待验收",
  acceptance_passed: "验收通过",
  acceptance_rejected: "驳回整改",
};
