/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

type TUpgradeBadge = {
  className?: string;
  size?: "sm" | "md";
};

/**
 * StringX demo shell: hide Pro / upgrade affordances on the default path.
 * Call sites remain so EE/upstream diffs stay small; render nothing.
 */
export function UpgradeBadge(_props: TUpgradeBadge) {
  return null;
}
