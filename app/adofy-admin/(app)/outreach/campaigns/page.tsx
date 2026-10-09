import Link from "next/link";
import { Plus } from "lucide-react";
import { CampaignStatusBadge } from "@/components/outreach-admin/Badges";
import { getOutreachDb } from "@/lib/outreach/access";
import { ADMIN_BASE, TABLES } from "@/lib/outreach/constants";
import { formatJst } from "@/lib/outreach/format";
import type { CampaignRow } from "@/lib/outreach/queue";

export const dynamic = "force-dynamic";
export const metadata = { title: "営業メール一覧｜ドラテク営業" };

export default async function CampaignsPage() {
  const { db } = (await getOutreachDb())!;
  const { data, error } = await db.from(TABLES.campaigns).select("*").order("created_at", { ascending: false }).limit(100);
  const campaigns = (data ?? []) as CampaignRow[];

  // 送信数・クリック数をキャンペーンごとに集計
  const stats = new Map<string, { sent: number; clicked: number; replied: number; errors: number }>();
  for (const c of campaigns) {
    const base = db.from(TABLES.sends).select("id", { count: "exact", head: true }).eq("campaign_id", c.id);
    const [sent, clicked, replied, errors] = await Promise.all([
      base.not("sent_at", "is", null).then((r) => r.count ?? 0),
      db.from(TABLES.sends).select("id", { count: "exact", head: true }).eq("campaign_id", c.id).not("clicked_at", "is", null).then((r) => r.count ?? 0),
      db.from(TABLES.sends).select("id", { count: "exact", head: true }).eq("campaign_id", c.id).not("replied_at", "is", null).then((r) => r.count ?? 0),
      db.from(TABLES.sends).select("id", { count: "exact", head: true }).eq("campaign_id", c.id).in("status", ["failed", "bounced"]).then((r) => r.count ?? 0),
    ]);
    stats.set(c.id, { sent, clicked, replied, errors });
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <h1 className="text-xl font-bold text-slate-900">営業メール</h1>
        <Link href={`${ADMIN_BASE}/campaigns/new`} className="ml-auto inline-flex items-center gap-1 rounded-lg bg-[#0a1f4e] px-3 py-2 text-sm font-bold text-white">
          <Plus className="h-4 w-4" /> 新規作成
        </Link>
      </div>
      {error && <p className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">読み込めませんでした。migration 010 を適用してください。</p>}
      {campaigns.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white py-10 text-center text-sm text-slate-400">まだ営業メールがありません。</p>
      ) : (
        <ul className="space-y-2">
          {campaigns.map((c) => {
            const s = stats.get(c.id)!;
            return (
              <li key={c.id}>
                <Link href={`${ADMIN_BASE}/campaigns/${c.id}`} className="block rounded-xl border border-slate-200 bg-white p-3.5 hover:border-slate-400">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="min-w-0 flex-1 truncate font-bold text-slate-900">{c.name}</span>
                    <CampaignStatusBadge status={c.status} />
                  </div>
                  <p className="mt-0.5 truncate text-sm text-slate-600">{c.subject}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    送信 {s.sent}・クリック {s.clicked}・返信 {s.replied}・エラー {s.errors}　/　作成 {formatJst(c.created_at)}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
