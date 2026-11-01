/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { useCallback, useEffect, useState } from "react";
import { observer } from "mobx-react";
import Link from "next/link";
import { EUserPermissions, EUserPermissionsLevel } from "@plane/constants";
import type { TStringXAcceptanceRecord, TStringXAcceptanceStatus, TStringXTaskDefinition } from "@plane/types";
import { Button } from "@makeplane/propel/elements/button";
import { useUserPermissions } from "@/hooks/store/user";
import { StringXService } from "@/services/stringx.service";
import { STRINGX_ACCEPTANCE_STATUS_LABEL } from "./acceptance-status-label";

const stringxService = new StringXService();

type Props = {
  workspaceSlug: string;
  projectId: string;
  issueId: string;
  disabled?: boolean;
};

const EMPTY_DEFINITION: TStringXTaskDefinition = {
  id: null,
  workspace: null,
  project: "",
  issue: "",
  goal: "",
  deliverables: "",
  acceptance_criteria: "",
  required_capabilities: "",
  revision: 0,
};

export const StringXIssueDeliveryPanel = observer(function StringXIssueDeliveryPanel(props: Props) {
  const { workspaceSlug, projectId, issueId, disabled = false } = props;
  const { allowPermissions } = useUserPermissions();

  const canEditDefinition = allowPermissions(
    [EUserPermissions.ADMIN, EUserPermissions.MEMBER],
    EUserPermissionsLevel.PROJECT,
    workspaceSlug,
    projectId
  );
  const canDecideAcceptance = allowPermissions(
    [EUserPermissions.ADMIN],
    EUserPermissionsLevel.PROJECT,
    workspaceSlug,
    projectId
  );

  const [definition, setDefinition] = useState<TStringXTaskDefinition>(EMPTY_DEFINITION);
  const [records, setRecords] = useState<TStringXAcceptanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingDefinition, setSavingDefinition] = useState(false);
  const [savingAcceptance, setSavingAcceptance] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    goal: "",
    deliverables: "",
    acceptance_criteria: "",
    required_capabilities: "",
  });
  const [acceptanceForm, setAcceptanceForm] = useState({
    status: "acceptance_pending" as TStringXAcceptanceStatus,
    conclusion: "",
    evidence_url: "",
    evidence_notes: "",
  });

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [nextDefinition, nextRecords] = await Promise.all([
        stringxService.getTaskDefinition(workspaceSlug, projectId, issueId),
        stringxService.listIssueAcceptanceRecords(workspaceSlug, projectId, issueId),
      ]);
      setDefinition(nextDefinition);
      setForm({
        goal: nextDefinition.goal ?? "",
        deliverables: nextDefinition.deliverables ?? "",
        acceptance_criteria: nextDefinition.acceptance_criteria ?? "",
        required_capabilities: nextDefinition.required_capabilities ?? "",
      });
      setRecords(nextRecords);
    } catch {
      setError("无法加载任务定义 / 验收记录。");
    } finally {
      setLoading(false);
    }
  }, [workspaceSlug, projectId, issueId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const handleSaveDefinition = async () => {
    if (!canEditDefinition || disabled) return;
    setSavingDefinition(true);
    setError(null);
    try {
      const saved = await stringxService.upsertTaskDefinition(workspaceSlug, projectId, issueId, form);
      setDefinition(saved);
      setForm({
        goal: saved.goal ?? "",
        deliverables: saved.deliverables ?? "",
        acceptance_criteria: saved.acceptance_criteria ?? "",
        required_capabilities: saved.required_capabilities ?? "",
      });
    } catch {
      setError("保存任务定义失败。");
    } finally {
      setSavingDefinition(false);
    }
  };

  const handleCreateAcceptance = async () => {
    if (disabled) return;
    if (
      (acceptanceForm.status === "acceptance_passed" || acceptanceForm.status === "acceptance_rejected") &&
      !canDecideAcceptance
    ) {
      setError("仅项目管理员可写入验收结论（通过 / 驳回）。");
      return;
    }
    if (!canEditDefinition && !canDecideAcceptance) return;

    setSavingAcceptance(true);
    setError(null);
    try {
      await stringxService.createIssueAcceptanceRecord(workspaceSlug, projectId, issueId, acceptanceForm);
      setAcceptanceForm({
        status: "acceptance_pending",
        conclusion: "",
        evidence_url: "",
        evidence_notes: "",
      });
      await reload();
    } catch {
      setError("创建验收记录失败（结论写入仅管理员）。");
    } finally {
      setSavingAcceptance(false);
    }
  };

  return (
    <div className="rounded-md border border-subtle bg-surface-1 p-4">
      <div className="flex flex-col gap-1">
        <p className="text-caption-sm-medium tracking-wide text-tertiary uppercase">StringX</p>
        <h3 className="text-14 font-semibold text-primary">任务定义与人工验收</h3>
        <p className="text-13 leading-5 text-secondary">
          执行完成（Issue completed）≠ 验收通过。验收使用独立状态 <code className="text-12">acceptance_*</code>，禁止用
          Automations / MCP 冒充。
        </p>
      </div>

      {loading ? <p className="mt-4 text-13 text-tertiary">加载中…</p> : null}
      {error ? <p className="text-red-500 mt-3 text-13">{error}</p> : null}

      <div className="mt-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-13 font-medium text-primary">任务定义</p>
          <p className="text-12 text-tertiary">
            当前 revision：{definition.revision > 0 ? `v${definition.revision}` : "尚未建立"}
          </p>
        </div>
        {(
          [
            ["goal", "目标"],
            ["deliverables", "交付物"],
            ["acceptance_criteria", "验收标准"],
            ["required_capabilities", "所需能力"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="flex flex-col gap-1">
            <span className="text-12 text-tertiary">{label}</span>
            <textarea
              className="focus:border-accent min-h-16 rounded-md border border-subtle bg-transparent px-3 py-2 text-13 text-primary outline-none"
              value={form[key]}
              disabled={disabled || !canEditDefinition || loading}
              onChange={(event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))}
            />
          </label>
        ))}
        {canEditDefinition && !disabled ? (
          <div>
            <Button
              type="button"
              variant="primary"
              size="sm"
              stretch="auto"
              onClick={() => void handleSaveDefinition()}
              disabled={savingDefinition}
            >
              {savingDefinition ? "保存中…" : "保存并生成 revision"}
            </Button>
          </div>
        ) : null}
      </div>

      <div className="mt-6 flex flex-col gap-3 border-t border-subtle pt-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-13 font-medium text-primary">人工验收记录</p>
          <Link href={`/${workspaceSlug}/projects/${projectId}/acceptance`} className="text-accent text-12">
            项目验收页
          </Link>
        </div>

        {records.length === 0 ? (
          <p className="text-13 text-tertiary">尚无验收记录。不显示 0% / 已验收假数据。</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {records.map((record) => (
              <li key={record.id} className="rounded-md border border-subtle px-3 py-2 text-13">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-primary">{STRINGX_ACCEPTANCE_STATUS_LABEL[record.status]}</span>
                  <span className="text-12 text-tertiary">{record.status}</span>
                  {record.task_definition_revision ? (
                    <span className="text-12 text-tertiary">rev 关联已记录</span>
                  ) : null}
                </div>
                {record.conclusion ? <p className="mt-1 text-secondary">{record.conclusion}</p> : null}
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
                {record.decided_at ? (
                  <p className="mt-1 text-12 text-tertiary">决定时间：{new Date(record.decided_at).toLocaleString()}</p>
                ) : null}
              </li>
            ))}
          </ul>
        )}

        {(canEditDefinition || canDecideAcceptance) && !disabled ? (
          <div className="flex flex-col gap-2 rounded-md border border-dashed border-subtle p-3">
            <p className="text-12 font-medium text-primary">新建验收记录</p>
            <select
              className="rounded-md border border-subtle bg-transparent px-3 py-2 text-13"
              value={acceptanceForm.status}
              onChange={(event) =>
                setAcceptanceForm((prev) => ({
                  ...prev,
                  status: event.target.value as TStringXAcceptanceStatus,
                }))
              }
            >
              <option value="acceptance_pending">待验收 (acceptance_pending)</option>
              {canDecideAcceptance ? (
                <>
                  <option value="acceptance_passed">验收通过 (acceptance_passed)</option>
                  <option value="acceptance_rejected">驳回整改 (acceptance_rejected)</option>
                </>
              ) : null}
            </select>
            <textarea
              className="min-h-14 rounded-md border border-subtle bg-transparent px-3 py-2 text-13"
              placeholder="结论 / 说明（管理员写入通过或驳回时填写）"
              value={acceptanceForm.conclusion}
              onChange={(event) => setAcceptanceForm((prev) => ({ ...prev, conclusion: event.target.value }))}
            />
            <input
              className="rounded-md border border-subtle bg-transparent px-3 py-2 text-13"
              placeholder="证据链接（可选）"
              value={acceptanceForm.evidence_url}
              onChange={(event) => setAcceptanceForm((prev) => ({ ...prev, evidence_url: event.target.value }))}
            />
            <textarea
              className="min-h-12 rounded-md border border-subtle bg-transparent px-3 py-2 text-13"
              placeholder="证据说明（可选）"
              value={acceptanceForm.evidence_notes}
              onChange={(event) => setAcceptanceForm((prev) => ({ ...prev, evidence_notes: event.target.value }))}
            />
            <div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                stretch="auto"
                onClick={() => void handleCreateAcceptance()}
                disabled={savingAcceptance}
              >
                {savingAcceptance ? "提交中…" : "创建验收记录"}
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
});
