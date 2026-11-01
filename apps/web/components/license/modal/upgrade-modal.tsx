/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { observer } from "mobx-react";

export type PaidPlanUpgradeModalProps = {
  isOpen: boolean;
  handleClose: () => void;
};

/**
 * StringX demo shell: paid-plan upgrade modal (plane.so / talk-to-sales CTAs) is a no-op.
 * Call sites / type export kept so upstream diffs stay small.
 */
export const PaidPlanUpgradeModal = observer(function PaidPlanUpgradeModal(_props: PaidPlanUpgradeModalProps) {
  return null;
});
