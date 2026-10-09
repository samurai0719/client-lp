import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import type { SupabaseClient } from "@supabase/supabase-js";
import CampaignEditor from "@/components/outreach-admin/CampaignEditor";
import SendControls from "@/components/outreach-admin/SendControls";
import SendRowActions from "@/components/outreach-admin/SendRowActions";
import { CampaignStatusBadge, SendStatusBadge } from "@/components/outreach-admin/Badges";
import { getOutreachDb } from "@/lib/outreach/access";
import { aiConfigured } from "@/lib/outreach/ai";
import { ADMIN_BASE, SEND_STATUS_LABEL, TABLES, TEST_BATCH_SIZE } from "@/lib/outreach/constants";
import { formatJst, pct } from "@/lib/outreach/format";
import type { CampaignRow, SendRow } from "@/lib/outreach/queue";
import { getSettings, replyToAddress, sendReadiness } from "@/lib/outreach/settings";
import { sentMailFor } from "@/lib/outreach/sentMail";
import SentMail from "@/components/outreach-admin/SentMail";

export const dynamic = "force-dynamic";
export const metadata = { title: "送信結果｜ドラテク営業" };

const PAGE = 100;

async function sendCounts(db: SupabaseClient, campaignId: string, batch?: "test") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c = async (apply: (q: any) => any) => {
    let q = db.from(TABLES.sends).select("id", { count: "exact", head: true }).eq("campaign_id", campaignId);
    if (batch) q = q.eq("batch", batch);
    const { count } = await apply(q);
    return (count as number | null) ?? 0;
  };
  const statuses = ["queued", "sending", "sent", "delivered", "bounced", "failed", "skipped", "cancelled"] as const;
  const byStatus = Object.fromEntries(await Promise.all(statuses.map(async (s) => [s, await c((q) => q.eq("status", s))] as const)));
  const [total, sent, opened, clicked, replied, unsubscribed] = await Promise.all([
    c((q) => q),
    c((q) => q.not("sent_at", "is", null)),
    c((q) => q.not("opened_at", "is", null)),
    c((q) => q.not("clicked_at", "is", null)),
    c((q) => q.not("replied_at", "is", null)),
    c((q) => q.not("unsubscribed_at", "is", null)),
  ]);
  return { byStatus: byStatus as Record<(typeof statuses)[number], number>, total, sent, opened, clicked, replied, unsubscribed };
}

export default async function CampaignDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ s?: string; b?: string; p?: string }>;
}) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const sp = await searchParams;
  const { db } = (await getOutreachDb())!;
  const { data } = await db.from(TABLES.campaigns).select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const c = data as CampaignRow;

  const [all, test, settings] = await Promise.all([sendCounts(db, id), sendCounts(db, id, "test"), getSettings(db)]);
  const readiness = sendReadiness(settings);

  let testEligible = 0;
  let restEligible = 0;
  if (c.status === "draft") {
    const { data: n } = await db.rpc("outreach_count_eligible", { p_campaign_id: id, p_batch: "test" });
    testEligible = Math.min(Number(n ?? 0), TEST_BATCH_SIZE);
  }
  if (c.status === "test_completed") {
    const { data: n } = await db.rpc("outreach_count_eligible", { p_campaign_id: id, p_batch: "rest" });
    restEligible = Number(n ?? 0);
  }

  // 送信先の一覧
  const statusFilter = sp.s && sp.s in SEND_STATUS_LABEL ? sp.s : sp.s === "clicked" || sp.s === "replied" ? sp.s : "";
  const page = Math.max(1, Number(sp.p) || 1);
  let q = db
    .from(TABLES.sends)
    .select("*, outreach_companies(company_name,prefecture,city,contact_name,source)", { count: "exact" })
    .eq("campaign_id", id);
  if (sp.b === "test") q = q.eq("batch", "test");
  if (statusFilter === "clicked") q = q.not("clicked_at", "is", null);
  else if (statusFilter === "replied") q = q.not("replied_at", "is", null);
  else if (statusFilter) q = q.eq("status", statusFilter);
  const { data: sendData, count: sendTotal } = await q
    .order("sent_at", { ascending: false, nullsFirst: false })
    .order("queued_at", { ascending: true })
    .range((page - 1) * PAGE, page * PAGE - 1);
  const sends = (sendData ?? []) as (SendRow & { outreach_companies: { company_name: string; prefecture: string | null; city: string | null; contact_name: string | null; source: string } | null })[];

  const link = (patch: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const m = { s: statusFilter || undefined, b: sp.b, ...patch };
    for (const [k, v] of Object.entries(m)) if (v) p.set(k, v);
    const s = p.toString();
    return `${ADMIN_BASE}/campaigns/${id}${s ? `?${s}` : ""}`;
  };

  const showTest = ["test_sending", "test_completed"].includes(c.status) || (c.status === "paused" && c.resume_status === "test_sending");
  const view = showTest ? test : all;

  return (
    <div>
      <Link href={`${ADMIN_BASE}/campaigns`} className="mb-2 inline-flex items-center text-sm text-slate-500">
        <ChevronLeft className="h-4 w-4" /> 営業メール一覧
      </Link>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h1 className="min-w-0 text-xl font-bold text-slate-900">{c.name}</h1>
        <CampaignStatusBadge status={c.status} />
      </div>

      <SendControls
        id={c.id}
        status={c.status}
        resumeStatus={c.resume_status}
        testEligible={testEligible}
        restEligible={restEligible}
        queued={all.byStatus.queued + all.byStatus.sending}
        readiness={readiness}
      />

      <h2 className="mb-2 mt-6 text-sm font-bold text-slate-500">{showTest ? `テスト送信（${TEST_BATCH_SIZE}件）の結果` : "送信結果"}</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
        <Mini label="送信待ち" value={view.byStatus.queued + view.byStatus.sending} />
        <Mini label="送信成功" value={view.sent} />
        <Mini label="配信成功" value={view.byStatus.delivered} sub={pct(view.byStatus.delivered, view.sent)} />
        <Mini label="バウンス" value={view.byStatus.bounced} alert={view.byStatus.bounced > 0} />
        <Mini label="エラー" value={view.byStatus.failed} alert={view.byStatus.failed > 0} />
        <Mini label="クリック" value={view.clicked} sub={pct(view.clicked, view.sent)} />
        <Mini label="返信あり" value={view.replied} sub={pct(view.replied, view.sent)} />
        <Mini label="配信停止" value={view.unsubscribed} sub={`開封(参考) ${view.opened}`} />
      </div>
      {view.byStatus.skipped > 0 && (
        <p className="mt-2 text-xs text-slate-500">送信直前に除外（配信停止・バウンス済み等）：{view.byStatus.skipped}件</p>
      )}

      {c.status === "draft" ? (
        <div className="mt-6">
          <h2 className="mb-2 font-bold text-slate-900">文面の編集（下書きの間だけ編集できます）</h2>
          <CampaignEditor
            initial={{ id: c.id, name: c.name, subject: c.subject, body: c.body, landing_page_url: c.landing_page_url, prefectures: c.target?.prefectures ?? [] }}
            defaultLanding={c.landing_page_url}
            aiEnabled={aiConfigured()}
            testRecipient={replyToAddress(settings)}
          />
        </div>
      ) : (
        <details className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
          <summary className="cursor-pointer font-bold text-slate-900">文面（送信開始後は変更できません）</summary>
          <p className="mt-3 text-sm font-bold">件名：{c.subject}</p>
          <pre className="mt-2 whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-sm text-slate-800">{c.body}</pre>
          <p className="mt-2 text-xs text-slate-500">
            LP：{c.landing_page_url}・地域：{c.target?.prefectures?.length ? c.target.prefectures.join("・") : "全国"}
          </p>
        </details>
      )}

      {all.total > 0 && (
        <section className="mt-6">
          <h2 className="mb-2 font-bold text-slate-900">送信先（{(sendTotal ?? 0).toLocaleString()}件）</h2>
          <div className="-mx-4 mb-3 flex gap-1.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
            {[
              ["", "すべて"],
              ["queued", "送信待ち"],
              ["sent", "送信成功"],
              ["delivered", "配信成功"],
              ["bounced", "バウンス"],
              ["failed", "エラー"],
              ["skipped", "除外"],
              ["clicked", "クリック"],
              ["replied", "返信あり"],
            ].map(([k, label]) => (
              <Link
                key={k}
                href={link({ s: k || undefined, p: undefined })}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold ${statusFilter === k ? "border-[#0a1f4e] bg-[#0a1f4e] text-white" : "border-slate-200 bg-white text-slate-600"}`}
              >
                {label}
              </Link>
            ))}
            <Link
              href={link({ b: sp.b === "test" ? undefined : "test", p: undefined })}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold ${sp.b === "test" ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-blue-700"}`}
            >
              テスト分のみ
            </Link>
          </div>
          <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white">
            {sends.map((s) => (
              <li key={s.id} className="flex flex-wrap items-start gap-x-3 gap-y-1 p-3 text-sm">
                <div className="min-w-0 flex-1">
                  <Link href={`${ADMIN_BASE}/companies/${s.company_id}`} className="block truncate font-bold text-slate-900 hover:underline">
                    {s.outreach_companies?.company_name ?? "（削除済み）"}
                    <span className="ml-2 text-xs font-normal text-slate-400">{s.outreach_companies?.prefecture}</span>
                  </Link>
                  <p className="break-all text-xs text-slate-500">{s.email}</p>
                  <p className="text-xs text-slate-400">
                    送信 {formatJst(s.sent_at)}
                    {s.clicked_at && <span className="ml-2 font-bold text-blue-700">クリック {formatJst(s.clicked_at)}</span>}
                    {s.replied_at && <span className="ml-2 font-bold text-violet-700">返信あり</span>}
                    {s.unsubscribed_at && <span className="ml-2 font-bold text-amber-700">配信停止</span>}
                  </p>
                  {s.error_message && <p className="text-xs text-rose-600">{s.error_message}</p>}
                  <SentMail mail={sentMailFor(s, c, s.outreach_companies ? { id: s.company_id, ...s.outreach_companies } : null, settings)} />
                </div>
                <div className="flex items-center gap-2">
                  {s.batch === "test" && <span className="text-xs font-bold text-blue-700">テスト</span>}
                  <SendStatusBadge status={s.status} />
                  {s.sent_at && !s.replied_at && <SendRowActions companyId={s.company_id} />}
                </div>
              </li>
            ))}
          </ul>
          {(sendTotal ?? 0) > PAGE && (
            <div className="mt-3 flex justify-center gap-2 text-sm">
              {page > 1 && <Link href={link({ p: String(page - 1) })} className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-bold">前へ</Link>}
              <span className="px-2 py-2 text-slate-500">{page} / {Math.ceil((sendTotal ?? 0) / PAGE)}</span>
              {page * PAGE < (sendTotal ?? 0) && <Link href={link({ p: String(page + 1) })} className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-bold">次へ</Link>}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function Mini({ label, value, sub, alert = false }: { label: string; value: number; sub?: string; alert?: boolean }) {
  return (
    <div className={`rounded-xl border bg-white p-3 ${alert ? "border-rose-300" : "border-slate-200"}`}>
      <p className="text-[11px] font-bold text-slate-500">{label}</p>
      <p className={`text-xl font-black tabular-nums ${alert ? "text-rose-600" : "text-[#0a1f4e]"}`}>{value.toLocaleString()}</p>
      {sub && <p className="text-[11px] text-slate-400">{sub}</p>}
    </div>
  );
}
