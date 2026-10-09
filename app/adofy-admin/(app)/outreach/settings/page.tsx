import SettingsForm from "@/components/outreach-admin/SettingsForm";
import SuppressionAdd from "@/components/outreach-admin/SuppressionAdd";
import { getOutreachDb } from "@/lib/outreach/access";
import { aiConfigured } from "@/lib/outreach/ai";
import { SUPPRESSION_REASON_LABEL, TABLES } from "@/lib/outreach/constants";
import { formatJst } from "@/lib/outreach/format";
import { fromAddress, getSettings, providerLimits, publicBaseUrl, replyToAddress } from "@/lib/outreach/settings";

export const dynamic = "force-dynamic";
export const metadata = { title: "営業メールの設定｜ドラテク営業" };

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { db } = (await getOutreachDb())!;
  const { q } = await searchParams;
  const settings = await getSettings(db);
  const { data: raw } = await db.from(TABLES.settings).select("*").eq("id", 1).maybeSingle();

  let sq = db.from(TABLES.suppressions).select("*", { count: "exact" }).order("created_at", { ascending: false }).limit(100);
  if (q) sq = sq.ilike("email", `%${q.replace(/[\\%_]/g, (c) => "\\" + c)}%`);
  const { data: sup, count: supCount } = await sq;

  const env: [string, boolean, string][] = [
    ["RESEND_API_KEY", Boolean(process.env.RESEND_API_KEY), "メール配信（Resend）"],
    ["OUTREACH_FROM_EMAIL", Boolean(fromAddress()), `営業メールの送信元 ${fromAddress() ?? ""}`],
    ["OUTREACH_REPLY_TO", Boolean(replyToAddress(settings)), `返信先 ${replyToAddress(settings) ?? ""}`],
    ["RESEND_WEBHOOK_SECRET", Boolean(process.env.RESEND_WEBHOOK_SECRET), "配信成功・バウンス・返信の受信"],
    ["CRON_SECRET", Boolean(process.env.CRON_SECRET), "cronでの自動送信（無くても画面を開いていれば進みます）"],
    ["GBIZINFO_API_TOKEN", Boolean(process.env.GBIZINFO_API_TOKEN), "営業先の取得（gBizINFO）"],
    ["GOOGLE_PLACES_API_KEY", Boolean(process.env.GOOGLE_PLACES_API_KEY), "営業先の取得（Google Places）"],
    ["OPENAI_API_KEY", aiConfigured(), "AIで文章を作成"],
  ];
  const base = publicBaseUrl();

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-xl font-bold text-slate-900">営業メールの設定</h1>

      <SettingsForm
        initial={{
          per_minute: settings.per_minute,
          per_hour: settings.per_hour,
          per_day: settings.per_day,
          min_days_between_campaigns: settings.min_days_between_campaigns,
          sender_name: (raw as { sender_name?: string } | null)?.sender_name ?? "",
          sender_address: (raw as { sender_address?: string } | null)?.sender_address ?? "",
          sender_email: (raw as { sender_email?: string } | null)?.sender_email ?? "",
          sender_phone: (raw as { sender_phone?: string } | null)?.sender_phone ?? "",
        }}
        fallback={{ sender_name: settings.sender_name, sender_address: settings.sender_address, sender_email: settings.sender_email, sender_phone: settings.sender_phone }}
        providerLimits={providerLimits()}
      />

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="mb-2 font-bold text-slate-900">接続設定（環境変数）</h2>
        <ul className="divide-y divide-slate-100 text-sm">
          {env.map(([k, ok, desc]) => (
            <li key={k} className="flex flex-wrap items-center gap-2 py-2">
              <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${ok ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{ok ? "設定済み" : "未設定"}</span>
              <code className="text-xs text-slate-800">{k}</code>
              <span className="text-xs text-slate-500">{desc}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 space-y-1 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
          <p>Resend Webhook のURL：<code className="break-all text-slate-900">{base}/api/outreach/webhooks/resend</code></p>
          <p>（イベント：email.delivered / email.bounced / email.complained / email.failed / email.suppressed、返信の受信を使う場合は email.received）</p>
          <p>cron のURL：<code className="break-all text-slate-900">{base}/api/cron/outreach</code>（Authorization: Bearer CRON_SECRET・1〜5分ごと）</p>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="mb-1 font-bold text-slate-900">配信停止リスト（{(supCount ?? 0).toLocaleString()}件）</h2>
        <p className="mb-3 text-xs text-slate-500">
          ここに載っているアドレスには、どの営業メールも送りません。配信停止・ハードバウンス・迷惑メール報告・HPの送信お断り表示は自動で登録されます。
          電話などで送信を断られた場合は手動で追加してください。
        </p>
        <SuppressionAdd />
        <form className="mt-3 flex gap-2">
          <input name="q" defaultValue={q} placeholder="アドレスで検索" className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm" />
          <button className="rounded-lg bg-slate-800 px-4 text-sm font-bold text-white">検索</button>
        </form>
        <ul className="mt-3 divide-y divide-slate-100 text-sm">
          {((sup ?? []) as { id: string; email: string; reason: string; note: string | null; created_at: string }[]).map((s) => (
            <li key={s.id} className="flex flex-wrap items-center gap-2 py-2">
              <span className="min-w-0 flex-1 break-all text-slate-800">{s.email}</span>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">{SUPPRESSION_REASON_LABEL[s.reason] ?? s.reason}</span>
              <span className="text-xs text-slate-400">{formatJst(s.created_at)}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
