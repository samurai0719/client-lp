"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { ArrowLeft, CalendarClock, Check, Clock, Mail, Phone, Save } from "lucide-react";
import {
  DEVICE_LABEL,
  PLAN_LABEL,
  SOURCE_LABEL,
  classifySource,
  formatJst,
  isoToJstInput,
  jstInputToIso,
  type LeadRow,
} from "@/lib/saiyoRescue/leads";
import { SourceBadge } from "./Badges";
import StatusSelect from "./StatusSelect";

type SaveState = "idle" | "saving" | "saved" | "error";

/** 問い合わせ詳細。スマホで「電話する → ステータス変更 → メモ → 次回対応日」がすぐできる並びにしている */
export default function LeadDetail({ lead: initial, assignees }: { lead: LeadRow; assignees: string[] }) {
  const [lead, setLead] = useState(initial);
  const [memo, setMemo] = useState(initial.memo ?? "");
  const [next, setNext] = useState(isoToJstInput(initial.next_contact_at));
  const [assigned, setAssigned] = useState(initial.assigned_to ?? "");
  const [state, setState] = useState<SaveState>("idle");

  const dirty =
    memo !== (lead.memo ?? "") || next !== isoToJstInput(lead.next_contact_at) || assigned !== (lead.assigned_to ?? "");

  async function save() {
    setState("saving");
    try {
      const res = await fetch(`/api/adofy-admin/saiyo-rescue/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memo, next_contact_at: jstInputToIso(next), assigned_to: assigned }),
      });
      const json = (await res.json()) as { lead?: LeadRow };
      if (!res.ok || !json.lead) throw new Error();
      setLead(json.lead);
      setMemo(json.lead.memo ?? "");
      setNext(isoToJstInput(json.lead.next_contact_at));
      setAssigned(json.lead.assigned_to ?? "");
      setState("saved");
      setTimeout(() => setState("idle"), 2000);
    } catch {
      setState("error");
    }
  }

  /** メモの先頭に「10/6 17:30 」のような日時を挿入（スマホでの記録を速くする） */
  function stampMemo() {
    const now = new Date().toLocaleString("ja-JP", {
      timeZone: "Asia/Tokyo",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    setMemo((m) => `${now} \n${m ? `\n${m}` : ""}`.replace(/\n\n$/, "\n"));
  }

  /** 次回対応日のクイック設定（明日10:00 等） */
  function quickNext(days: number, hour: number) {
    const d = new Date();
    d.setTime(d.getTime() + 9 * 3600 * 1000);
    d.setUTCDate(d.getUTCDate() + days);
    d.setUTCHours(hour, 0, 0, 0);
    setNext(d.toISOString().slice(0, 16));
  }

  const src = classifySource(lead);

  return (
    <div className="pb-28 lg:pb-6">
      <Link href="/adofy-admin/saiyo-rescue/leads" className="mb-3 inline-flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-slate-800">
        <ArrowLeft className="h-4 w-4" />
        問い合わせ一覧へ
      </Link>

      {/* ヘッダー：会社名・連絡ボタン・ステータス */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-slate-500">{formatJst(lead.created_at)} 受付</p>
            <h1 className="mt-0.5 text-xl font-bold text-slate-900 sm:text-2xl">{lead.company_name}</h1>
            <p className="text-sm text-slate-600">{lead.contact_name} 様</p>
          </div>
          <StatusSelect id={lead.id} value={lead.status} size="lg" onChange={(s) => setLead((l) => ({ ...l, status: s }))} />
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <a
            href={`tel:${lead.phone}`}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-lg font-bold text-white active:bg-blue-700"
          >
            <Phone className="h-5 w-5" />
            {lead.phone}
          </a>
          <a
            href={`mailto:${lead.email}`}
            className="flex min-w-0 items-center justify-center gap-2 rounded-xl border-2 border-blue-600 px-4 py-3 text-sm font-bold text-blue-700"
          >
            <Mail className="h-5 w-5 shrink-0" />
            <span className="truncate">{lead.email}</span>
          </a>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.1fr]">
        {/* 対応管理 */}
        <section className="order-1 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 lg:order-2">
          <h2 className="mb-3 text-base font-bold text-slate-900">対応管理</h2>

          <label className="block">
            <span className="mb-1 flex items-center gap-1.5 text-sm font-bold text-slate-700">
              <CalendarClock className="h-4 w-4 text-blue-600" />
              次回対応日
            </span>
            <input
              type="datetime-local"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base"
            />
          </label>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[
              ["今日 15:00", 0, 15],
              ["明日 10:00", 1, 10],
              ["明日 15:00", 1, 15],
              ["3日後 10:00", 3, 10],
              ["1週間後 10:00", 7, 10],
            ].map(([label, d, h]) => (
              <button
                key={label as string}
                type="button"
                onClick={() => quickNext(d as number, h as number)}
                className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 active:bg-slate-200"
              >
                {label}
              </button>
            ))}
            {next && (
              <button type="button" onClick={() => setNext("")} className="rounded-full px-3 py-1.5 text-xs font-bold text-rose-600">
                クリア
              </button>
            )}
          </div>

          <label className="mt-4 block">
            <span className="mb-1 block text-sm font-bold text-slate-700">担当者</span>
            <input
              type="text"
              list="sr-assignees"
              value={assigned}
              onChange={(e) => setAssigned(e.target.value)}
              placeholder="例）塚本"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base"
            />
            <datalist id="sr-assignees">
              {assignees.map((a) => (
                <option key={a} value={a} />
              ))}
            </datalist>
          </label>

          <div className="mt-4">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700">対応メモ</span>
              <button
                type="button"
                onClick={stampMemo}
                className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 active:bg-blue-100"
              >
                <Clock className="h-3.5 w-3.5" />
                日時を挿入
              </button>
            </div>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              rows={9}
              placeholder={"例）\n10/6 17:30 電話\n社長対応\nドライバー5名採用希望\n現在Indeed利用中\n月20万円使用"}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base leading-relaxed"
            />
            {lead.updated_at && <p className="mt-1 text-xs text-slate-400">最終更新：{formatJst(lead.updated_at)}</p>}
          </div>

          {/* PCでは通常配置、スマホでは画面下に固定して押しやすくする */}
          <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 p-3 backdrop-blur lg:static lg:mt-4 lg:border-0 lg:bg-transparent lg:p-0">
            <button
              type="button"
              onClick={save}
              disabled={!dirty || state === "saving"}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0a1f4e] py-3.5 text-base font-bold text-white disabled:opacity-40"
            >
              {state === "saved" ? <Check className="h-5 w-5" /> : <Save className="h-5 w-5" />}
              {state === "saving" ? "保存中…" : state === "saved" ? "保存しました" : "メモ・次回対応日・担当者を保存"}
            </button>
            {state === "error" && <p className="mt-1 text-center text-sm font-bold text-rose-600">保存に失敗しました。もう一度お試しください。</p>}
          </div>
        </section>

        {/* 問い合わせ内容 */}
        <section className="order-2 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 lg:order-1">
          <h2 className="mb-3 text-base font-bold text-slate-900">問い合わせ内容</h2>
          <dl className="divide-y divide-slate-100 text-sm">
            <Row label="会社名">{lead.company_name}</Row>
            <Row label="担当者名">{lead.contact_name}</Row>
            <Row label="電話番号">
              <a href={`tel:${lead.phone}`} className="font-bold text-blue-700 underline">
                {lead.phone}
              </a>
            </Row>
            <Row label="メール">
              <a href={`mailto:${lead.email}`} className="break-all text-blue-700 underline">
                {lead.email}
              </a>
            </Row>
            <Row label="都道府県">{lead.prefecture}</Row>
            <Row label="採用職種">{lead.job_type}</Row>
            <Row label="希望採用人数">{lead.desired_hires}</Row>
            <Row label="現在の採用人数">{lead.current_employees}</Row>
            <Row label="現在の求人媒体">{lead.current_job_media}</Row>
            <Row label="広告費（月）">{lead.monthly_recruitment_budget}</Row>
            <Row label="HP URL">
              {lead.website_url && <ExtLink href={lead.website_url} />}
            </Row>
            <Row label="求人URL">
              {lead.job_page_url && <ExtLink href={lead.job_page_url} />}
            </Row>
            <Row label="希望プラン">{lead.desired_plan ? PLAN_LABEL[lead.desired_plan] ?? lead.desired_plan : null}</Row>
            <Row label="相談内容">
              {lead.message && <span className="whitespace-pre-wrap">{lead.message}</span>}
            </Row>
            <Row label="問い合わせ日時">{formatJst(lead.created_at)}</Row>
          </dl>

          <h3 className="mb-2 mt-5 text-sm font-bold text-slate-900">流入元</h3>
          <dl className="divide-y divide-slate-100 rounded-lg bg-slate-50 px-3 text-xs">
            <Row label="判定">
              <SourceBadge lead={lead} /> <span className="ml-1 text-slate-500">{SOURCE_LABEL[src]}</span>
            </Row>
            <Row label="utm_source">{lead.utm_source}</Row>
            <Row label="utm_medium">{lead.utm_medium}</Row>
            <Row label="utm_campaign">{lead.utm_campaign}</Row>
            <Row label="utm_content">{lead.utm_content}</Row>
            <Row label="utm_term">{lead.utm_term}</Row>
            <Row label="landing_page">{lead.landing_page && <span className="break-all">{lead.landing_page}</span>}</Row>
            <Row label="referrer">{lead.referrer && <span className="break-all">{lead.referrer}</span>}</Row>
            <Row label="端末">{lead.device_type ? DEVICE_LABEL[lead.device_type] : null}</Row>
          </dl>
        </section>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  const empty = children === null || children === undefined || children === "" || children === false;
  return (
    <div className="grid grid-cols-[7.5rem_1fr] gap-2 py-2.5">
      <dt className="font-bold text-slate-500">{label}</dt>
      <dd className="min-w-0 text-slate-900">{empty ? <span className="text-slate-300">—</span> : children}</dd>
    </div>
  );
}

function ExtLink({ href }: { href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="break-all text-blue-700 underline">
      {href}
    </a>
  );
}
