import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ExternalLink } from "lucide-react";
import CompanyActions from "@/components/outreach-admin/CompanyActions";
import { CrawlBadge, OutreachStatusBadge, ReviewBadge, SendStatusBadge } from "@/components/outreach-admin/Badges";
import { getOutreachDb } from "@/lib/outreach/access";
import type { CompanyRow } from "@/lib/outreach/companies";
import { ADMIN_BASE, CRAWL_STATUS_LABEL, SOURCE_LABEL, TABLES } from "@/lib/outreach/constants";
import { formatJst } from "@/lib/outreach/format";
import type { SendRow } from "@/lib/outreach/queue";
import { sentMailFor } from "@/lib/outreach/sentMail";
import { getSettings } from "@/lib/outreach/settings";
import SentMail from "@/components/outreach-admin/SentMail";

export const dynamic = "force-dynamic";
export const metadata = { title: "営業先企業の詳細｜ドラテク営業" };

export default async function CompanyDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { db } = (await getOutreachDb())!;
  const { data } = await db.from(TABLES.companies).select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const c = data as CompanyRow;

  const { data: sendsData } = await db
    .from(TABLES.sends)
    .select("*, email_campaigns(name,subject,body,landing_page_url)")
    .eq("company_id", id)
    .order("queued_at", { ascending: false });
  const settings = await getSettings(db);
  const sends = (sendsData ?? []) as (SendRow & { email_campaigns: { name: string; subject: string; body: string; landing_page_url: string } | null })[];

  // 営業 → クリック → 問い合わせ → 契約 の流れ
  const firstSent = sends.filter((s) => s.sent_at).at(-1)?.sent_at ?? null;
  const steps = [
    { label: "営業メール送信", at: firstSent },
    { label: "LPクリック", at: c.clicked_at },
    { label: "返信", at: c.replied_at },
    { label: "問い合わせ・登録", at: c.inquired_at },
    { label: "契約", at: c.contracted_at },
  ];

  const info: [string, React.ReactNode][] = [
    ["法人名", c.corporate_name],
    ["法人番号", c.corporate_number],
    ["担当者名", c.contact_name],
    ["住所", c.address ?? [c.prefecture, c.city].filter(Boolean).join(" ")],
    ["電話番号", c.phone],
    ["公式HP", c.website_url && <Ext href={c.website_url} />],
    ["公開メールアドレス", c.email],
    ["メール掲載ページ", c.email_source_url && (/^https?:/.test(c.email_source_url) ? <Ext href={c.email_source_url} /> : c.email_source_url)],
    ["問い合わせフォーム", c.contact_form_url ? <Ext href={c.contact_form_url} /> : null],
    ["会社概要ページ", c.company_profile_url && <Ext href={c.company_profile_url} />],
    ["取得元", `${SOURCE_LABEL[c.source] ?? c.source}（${formatJst(c.fetched_at)}）`],
    ["HP確認", `${CRAWL_STATUS_LABEL[c.crawl_status] ?? c.crawl_status}（最終確認 ${formatJst(c.last_checked_at)}）${c.crawl_error ? `：${c.crawl_error}` : ""}`],
    ["送信停止", c.send_blocked ? `停止中（${c.send_blocked_reason ?? ""}）` : null],
    ["最後のエラー", c.last_error],
  ];

  return (
    <div className="max-w-4xl">
      <Link href={`${ADMIN_BASE}/companies`} className="mb-2 inline-flex items-center text-sm text-slate-500">
        <ChevronLeft className="h-4 w-4" /> 一覧へ
      </Link>
      <h1 className="text-xl font-bold text-slate-900">{c.company_name}</h1>
      <div className="mt-2 flex flex-wrap gap-1">
        <CrawlBadge status={c.crawl_status} hasEmail={Boolean(c.email)} />
        <ReviewBadge status={c.review_status} />
        <OutreachStatusBadge status={c.outreach_status} />
        {c.refusal_notice && <span className="rounded-md bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-700">HPに送信お断りの表示あり（送信しません）</span>}
      </div>

      <ol className="mt-4 grid grid-cols-5 gap-1 text-center text-[11px] sm:text-xs">
        {steps.map((s) => (
          <li key={s.label} className={`rounded-lg border p-2 ${s.at ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-slate-200 bg-white text-slate-400"}`}>
            <p className="font-bold">{s.label}</p>
            <p className="mt-0.5">{s.at ? formatJst(s.at).slice(5) : "—"}</p>
          </li>
        ))}
      </ol>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_18rem]">
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <dl className="divide-y divide-slate-100 text-sm">
            {info
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k} className="grid grid-cols-[8rem_1fr] gap-2 py-2">
                  <dt className="font-bold text-slate-500">{k}</dt>
                  <dd className="min-w-0 break-all text-slate-800">{v}</dd>
                </div>
              ))}
          </dl>
          {(c.linked_job_posting_id || c.linked_inquiry_id) && (
            <div className="mt-3 rounded-lg bg-violet-50 p-3 text-sm text-violet-900">
              <p className="font-bold">営業メール経由の登録・問い合わせ</p>
              {c.linked_job_posting_id && (
                <Link href={`/adofy-admin/doratech/${c.linked_job_posting_id}`} className="mt-1 block underline">
                  企業・求人登録を開く
                </Link>
              )}
              {c.linked_inquiry_id && <p className="mt-1">問い合わせID：{c.linked_inquiry_id}</p>}
            </div>
          )}
        </section>

        <CompanyActions company={c} />
      </div>

      <section className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="mb-2 font-bold text-slate-900">送信履歴</h2>
        {sends.length === 0 ? (
          <p className="py-4 text-center text-sm text-slate-400">まだ送信していません。</p>
        ) : (
          <ul className="divide-y divide-slate-100 text-sm">
            {sends.map((s) => (
              <li key={s.id} className="py-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <Link href={`${ADMIN_BASE}/campaigns/${s.campaign_id}`} className="font-bold text-slate-900 hover:underline">
                    {s.email_campaigns?.name ?? "（削除済み）"}
                  </Link>
                  <SendStatusBadge status={s.status} />
                  {s.batch === "test" && <span className="text-xs text-blue-700">テスト送信</span>}
                </div>
                <p className="mt-0.5 text-xs text-slate-500">
                  送信 {formatJst(s.sent_at)}・配信 {formatJst(s.delivered_at)}・開封(参考) {formatJst(s.opened_at)}・クリック {formatJst(s.clicked_at)}
                  {s.click_count > 1 ? `（${s.click_count}回）` : ""}
                </p>
                {s.error_message && <p className="mt-0.5 text-xs text-rose-600">{s.error_message}</p>}
                <SentMail mail={sentMailFor(s, s.email_campaigns ? { id: s.campaign_id, ...s.email_campaigns } : null, c, settings)} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Ext({ href }: { href: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1 text-blue-700 hover:underline">
      {href} <ExternalLink className="h-3 w-3 shrink-0" />
    </a>
  );
}
