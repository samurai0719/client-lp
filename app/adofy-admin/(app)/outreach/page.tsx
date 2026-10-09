import Link from "next/link";
import { AlertTriangle, ChevronRight, ClipboardCheck } from "lucide-react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { CampaignStatusBadge } from "@/components/outreach-admin/Badges";
import { getOutreachDb } from "@/lib/outreach/access";
import { ADMIN_BASE, TABLES, TEST_BATCH_SIZE } from "@/lib/outreach/constants";
import { formatJst, pct } from "@/lib/outreach/format";
import { syncInquiryLinks } from "@/lib/outreach/links";
import { effectiveLimits, getSettings, sendReadiness } from "@/lib/outreach/settings";

export const dynamic = "force-dynamic";
export const metadata = { title: "営業メール ダッシュボード｜ドラテク" };


// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function count(db: SupabaseClient, table: string, apply?: (q: any) => any): Promise<number> {
  let q = db.from(table).select("id", { count: "exact", head: true });
  if (apply) q = apply(q);
  const { count: n } = await q;
  return n ?? 0;
}

function isoHoursAgo(h: number): string {
  return new Date(Date.now() - h * 3_600_000).toISOString();
}

export default async function OutreachDashboard() {
  const { db } = (await getOutreachDb())!;

  // 問い合わせとの紐付けを最新にしてから集計する（失敗しても表示は続ける）
  await syncInquiryLinks(db).catch(() => null);

  const C = TABLES.companies;
  const S = TABLES.sends;
  const dayAgo = isoHoursAgo(24);
  const [
    total, withEmail, noEmail, unchecked, reviewPending, approved, unsent,
    sent, delivered, errors, bounced, opened, clicked, replied, unsubscribed, inquired, contracted, sent24h, queued,
  ] = await Promise.all([
    count(db, C),
    count(db, C, (q) => q.eq("email_status", "found")),
    count(db, C, (q) => q.eq("email_status", "none")),
    count(db, C, (q) => q.eq("crawl_status", "pending")),
    count(db, C, (q) => q.eq("email_status", "found").eq("review_status", "pending").eq("refusal_notice", false)),
    count(db, C, (q) => q.eq("email_status", "found").eq("review_status", "approved")),
    count(db, C, (q) => q.eq("email_status", "found").eq("outreach_status", "unsent").neq("review_status", "excluded").eq("refusal_notice", false)),
    count(db, S, (q) => q.not("sent_at", "is", null)),
    count(db, S, (q) => q.eq("status", "delivered")),
    count(db, S, (q) => q.eq("status", "failed")),
    count(db, S, (q) => q.eq("status", "bounced")),
    count(db, S, (q) => q.not("opened_at", "is", null)),
    count(db, S, (q) => q.not("clicked_at", "is", null)),
    count(db, C, (q) => q.not("replied_at", "is", null)),
    count(db, C, (q) => q.not("unsubscribed_at", "is", null)),
    count(db, C, (q) => q.not("inquired_at", "is", null)),
    count(db, C, (q) => q.not("contracted_at", "is", null)),
    count(db, S, (q) => q.gt("claimed_at", dayAgo).not("status", "in", "(queued,cancelled,skipped)")),
    count(db, S, (q) => q.in("status", ["queued", "sending"])),
  ]);

  const settings = await getSettings(db);
  const readiness = sendReadiness(settings);
  const limits = effectiveLimits(settings);
  const { data: campaigns, error } = await db
    .from(TABLES.campaigns)
    .select("id,name,status,updated_at")
    .order("created_at", { ascending: false })
    .limit(5);
  const { data: jobs } = await db.from(TABLES.jobs).select("id").in("status", ["queued", "running"]);

  const funnel = [
    { label: "送信", value: sent },
    { label: "クリック", value: clicked },
    { label: "返信", value: replied },
    { label: "問い合わせ・登録", value: inquired },
    { label: "契約", value: contracted },
  ];
  const max = Math.max(1, ...funnel.map((f) => f.value));

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-slate-900">営業メール ダッシュボード</h1>

      {error && (
        <p className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
          データを読み込めませんでした。Supabase に <code>supabase/migrations/010_driver_outreach.sql</code> を適用してください。
        </p>
      )}

      {!readiness.ready && (
        <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="flex items-center gap-1.5 font-bold">
            <AlertTriangle className="h-4 w-4" />
            まだ営業メールを送信できません（設定が必要です）
          </p>
          <ul className="mt-2 list-disc space-y-0.5 pl-5">
            {readiness.problems.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <Link href={`${ADMIN_BASE}/settings`} className="mt-2 inline-flex items-center font-bold text-amber-800 underline">
            設定へ <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {reviewPending > 0 && (
        <Link
          href={`${ADMIN_BASE}/companies?f=review`}
          className="mb-4 flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-blue-900 hover:bg-blue-100"
        >
          <ClipboardCheck className="h-6 w-6 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="font-bold">送信候補の目視確認：確認待ち {reviewPending.toLocaleString()}社</p>
            <p className="text-xs">
              テスト{TEST_BATCH_SIZE}件送信は「送信OK」にした企業にだけ送ります（現在 送信OK {approved}社）。
            </p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0" />
        </Link>
      )}

      <h2 className="mb-2 text-sm font-bold text-slate-500">営業先リスト</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="登録企業数" value={total} href={`${ADMIN_BASE}/companies`} />
        <Stat label="メールあり" value={withEmail} href={`${ADMIN_BASE}/companies?f=has_email`} />
        <Stat label="メールなし" value={noEmail} href={`${ADMIN_BASE}/companies?f=no_email`} />
        <Stat label="HP未確認" value={unchecked} href={`${ADMIN_BASE}/companies?f=unchecked`} sub={jobs?.length ? `取得ジョブ ${jobs.length}件 進行中` : undefined} />
        <Stat label="確認待ち" value={reviewPending} href={`${ADMIN_BASE}/companies?f=review`} />
        <Stat label="未送信" value={unsent} href={`${ADMIN_BASE}/companies?f=unsent`} sub="メールあり・除外以外" />
      </div>

      <h2 className="mb-2 mt-6 text-sm font-bold text-slate-500">送信結果</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="送信済み" value={sent} href={`${ADMIN_BASE}/companies?f=sent`} />
        <Stat label="配信成功" value={delivered} sub={pct(delivered, sent)} />
        <Stat label="エラー・バウンス" value={errors + bounced} sub={`バウンス ${bounced}`} alert={errors + bounced > 0} href={`${ADMIN_BASE}/companies?f=error`} />
        <Stat label="開封（参考値）" value={opened} sub={pct(opened, sent)} />
        <Stat label="クリック数" value={clicked} sub={pct(clicked, sent)} />
        <Stat label="配信停止" value={unsubscribed} href={`${ADMIN_BASE}/companies?f=unsubscribed`} />
      </div>

      <h2 className="mb-2 mt-6 text-sm font-bold text-slate-500">成果</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="返信数" value={replied} href={`${ADMIN_BASE}/companies?f=replied`} />
        <Stat label="問い合わせ・登録数" value={inquired} href={`${ADMIN_BASE}/companies?f=inquired`} />
        <Stat label="契約数" value={contracted} href={`${ADMIN_BASE}/companies?f=contracted`} />
        <Stat label="返信率" text={pct(replied, sent)} sub="返信 ÷ 送信" />
        <Stat label="問い合わせ率" text={pct(inquired, sent)} sub="問い合わせ ÷ 送信" />
        <Stat label="契約率" text={pct(contracted, sent)} sub="契約 ÷ 送信" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="mb-3 font-bold text-slate-900">送信 → 契約までの流れ</h2>
          <ul className="space-y-2">
            {funnel.map((f) => (
              <li key={f.label} className="grid grid-cols-[6.5rem_1fr_3.5rem] items-center gap-2 text-sm">
                <span className="font-bold text-slate-600">{f.label}</span>
                <span className="h-5 overflow-hidden rounded bg-slate-100">
                  <span className="block h-full rounded bg-[#0a1f4e]" style={{ width: `${(f.value / max) * 100}%` }} />
                </span>
                <span className="text-right font-bold tabular-nums text-slate-900">{f.value.toLocaleString()}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-slate-400">
            問い合わせ・登録は、LPのUTM（utm_content=企業ID）または メール・ドメイン・電話番号の一致で自動紐付けしています。
            開封数は画像の読み込みで判定するため参考値です。
          </p>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="mb-3 flex items-center justify-between font-bold text-slate-900">
            営業メール
            <Link href={`${ADMIN_BASE}/campaigns`} className="inline-flex items-center text-sm text-blue-700">
              一覧へ <ChevronRight className="h-4 w-4" />
            </Link>
          </h2>
          <p className="mb-3 rounded-lg bg-slate-50 p-2.5 text-xs text-slate-600">
            直近24時間の送信 <b className="text-slate-900">{sent24h}</b> / 上限 {limits.per_day}件・送信待ち <b className="text-slate-900">{queued}</b>件・
            速度 {limits.per_minute}件/分・{limits.per_hour}件/時
          </p>
          {(campaigns ?? []).length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-400">
              まだ営業メールがありません。
              <Link href={`${ADMIN_BASE}/campaigns/new`} className="ml-1 font-bold text-blue-700 underline">作成する</Link>
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {(campaigns as { id: string; name: string; status: string; updated_at: string }[]).map((c) => (
                <li key={c.id}>
                  <Link href={`${ADMIN_BASE}/campaigns/${c.id}`} className="flex items-center gap-2 py-2.5 hover:bg-slate-50">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-bold text-slate-900">{c.name}</span>
                      <span className="text-xs text-slate-500">{formatJst(c.updated_at)}</span>
                    </span>
                    <CampaignStatusBadge status={c.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value, text, sub, href, alert = false }: { label: string; value?: number; text?: string; sub?: string; href?: string; alert?: boolean }) {
  const inner = (
    <>
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-black tabular-nums ${alert ? "text-rose-600" : "text-[#0a1f4e]"}`}>
        {text ?? (value ?? 0).toLocaleString()}
      </p>
      {sub && <p className="mt-0.5 text-xs text-slate-400">{sub}</p>}
    </>
  );
  const cls = `block rounded-xl border bg-white p-3.5 ${alert ? "border-rose-300" : "border-slate-200"}`;
  return href ? (
    <Link href={href} className={`${cls} hover:border-slate-400`}>
      {inner}
    </Link>
  ) : (
    <div className={cls}>{inner}</div>
  );
}
