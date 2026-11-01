/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { useCallback, useEffect, useState } from "react";
import { observer } from "mobx-react";
import Link from "next/link";
import type { TStringXAcceptanceRecord } from "@plane/types";
import { PageHead } from "@/components/core/page-title";
import { StringXService } from "@/services/stringx.service";
import { STRINGX_ACCEPTANCE_STATUS_LABEL } from "./acceptance-status-label";

const stringxService = new StringXService();

type Props = {
  workspaceSlug: string;
  projectId: string;
};

export const StringXProjectAcceptancePage = observer(function StringXProjectAcceptancePage(props: Props) {
  const { workspaceSlug, projectId } = props;
  const [records, setRecords] = useState<TStringXAcceptanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const next = await stringxService.listProjectAcceptanceRecords(workspaceSlug, projectId);
      setRecords(next);
    } catch {
      setError("无法加载验收记录。");
    } finally {
      setLoading(false);
    }
  }, [workspaceSlug, projectId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return (
    <>
      <PageHead title="人工验收" />
      <div className="h-full w-full overflow-y-auto bg-surface-1">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-10">
          <div className="flex flex-col gap-2">
            <p className="text-caption-sm-medium tracking-wide text-tertiary uppercase">StringX</p>
            <h1 className="text-2xl font-semibold text-primary">人工验收</h1>
            <p className="text-14 leading-6 text-secondary">
              本页列出独立验收记录（<code className="text-13">acceptance_pending / passed / rejected</code>
              ）。Issue <code className="text-13">completed</code>{" "}
              只表示执行完成，不是验收通过；禁止用完成比例冒充验收进度。
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-13">
            <Link href={`/${workspaceSlug}/projects/${projectId}/overview`} className="text-accent">
              返回项目 360
            </Link>
            <Link href={`/${workspaceSlug}/projects/${projectId}/issues`} className="text-accent">
              执行工作台
            </Link>
          </div>

          {loading ? <p className="text-13 text-tertiary">加载中…</p> : null}
          {error ? <p className="text-red-500 text-13">{error}</p> : null}

          {!loading && records.length === 0 ? (
            <p className="text-14 text-secondary">
              尚无验收记录。请在 Work item 详情的「任务定义与人工验收」面板创建；无模型时不展示 0% / 「已验收」。
            </p>
          ) : null}

          <ul className="flex flex-col gap-3">
            {records.map((record) => {
              const issueHref = `/${workspaceSlug}/projects/${projectId}/issues/${record.issue}`;
              const issueLabel = record.issue_meta
                ? `#${record.issue_meta.sequence_id} ${record.issue_meta.name}`
                : record.issue;
              return (
                <li key={record.id} className="rounded-md border border-subtle px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={issueHref} className="text-14 font-medium text-primary hover:underline">
                      {issueLabel}
                    </Link>
                    <span className="rounded-sm bg-layer-2 px-2 py-0.5 text-12 text-secondary">
                      {STRINGX_ACCEPTANCE_STATUS_LABEL[record.status]}
                    </span>
                    <span className="text-12 text-tertiary">{record.status}</span>
                  </div>
                  {record.conclusion ? <p className="mt-2 text-13 text-secondary">{record.conclusion}</p> : null}
                  {record.evidence_url ? (
                    <a
                      href={record.evidence_url}
                      className="text-accent mt-1 block text-12"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {record.evidence_url}
                    </a>
                  ) : null}
                  <p className="mt-2 text-12 text-tertiary">
                    {record.decided_at ? `决定于 ${new Date(record.decided_at).toLocaleString()}` : "尚未形成验收结论"}
                    {record.task_definition_revision ? " · 已关联任务定义 revision" : ""}
                  </p>
                </li>
              );
            })}
          </ul>

          <p className="text-13 leading-5 text-tertiary">MCP 不得提供验收工具。结论写入仅 Web 项目管理员路径。</p>
        </div>
      </div>
    </>
  );
});
