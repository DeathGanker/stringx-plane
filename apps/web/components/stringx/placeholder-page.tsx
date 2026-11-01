/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import Link from "next/link";

export type TStringXPlaceholderLink = {
  href: string;
  label: string;
  description?: string;
};

type Props = {
  title: string;
  summary: string;
  bullets?: string[];
  links?: TStringXPlaceholderLink[];
  footnote?: string;
};

/**
 * Minimal StringX Phase 1 shell. No fake metrics, no silent create/accept actions.
 */
export function StringXPlaceholderPage(props: Props) {
  const { title, summary, bullets = [], links = [], footnote } = props;

  return (
    <div className="h-full w-full overflow-y-auto bg-surface-1">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-10">
        <div className="flex flex-col gap-2">
          <p className="text-caption-sm-medium tracking-wide text-tertiary uppercase">StringX</p>
          <h1 className="text-2xl font-semibold text-primary">{title}</h1>
          <p className="text-14 leading-6 text-secondary">{summary}</p>
        </div>

        {bullets.length > 0 && (
          <ul className="flex list-disc flex-col gap-2 pl-5 text-14 leading-6 text-secondary">
            {bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        )}

        {links.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-subtle pt-6">
            <p className="text-13 font-medium text-primary">相关路径</p>
            <div className="flex flex-col gap-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-md border border-subtle px-4 py-3 transition-colors hover:bg-layer-1"
                >
                  <p className="text-14 font-medium text-primary">{link.label}</p>
                  {link.description ? <p className="mt-1 text-13 text-secondary">{link.description}</p> : null}
                </Link>
              ))}
            </div>
          </div>
        )}

        {footnote ? <p className="text-13 leading-5 text-tertiary">{footnote}</p> : null}
      </div>
    </div>
  );
}
