import { NextResponse } from "next/server";
import { authed, bad, str, UUID } from "@/lib/outreach/api";
import { PREFECTURE_NAMES, TABLES } from "@/lib/outreach/constants";
import { domainKey, normalizeUrl } from "@/lib/outreach/normalize";

export const dynamic = "force-dynamic";

/**
 * ChatGPT（手動）でHPを探すための書き出し・取り込み。
 *   GET  … HPが分からない会社を最大30社返す（まだ ChatGPT で調べていない会社だけ）
 *   POST … ChatGPT の回答「番号,URL」を貼り付けて登録。URLは自動処理でHPを開き、
 *          社名か電話番号がHP上にあるときだけ採用する（enrich.ts）
 */

type Row = { id: string; corporate_number: string | null; company_name: string; address: string | null; prefecture: string | null; city: string | null };

export async function GET(req: Request) {
  const a = await authed(req);
  if ("error" in a) return a.error;
  const sp = new URL(req.url).searchParams;
  const pref = sp.get("prefecture") ?? "";
  const limit = Math.min(50, Math.max(1, Number(sp.get("limit")) || 30));

  let q = a.db
    .from(TABLES.companies)
    .select("id,corporate_number,company_name,address,prefecture,city", { count: "exact" })
    .is("website_url", null)
    .is("email", null)
    .eq("crawl_status", "no_website")
    .is("website_source", null)
    .neq("review_status", "excluded");
  if (PREFECTURE_NAMES.includes(pref)) q = q.eq("prefecture", pref);
  const { data, count, error } = await q.order("created_at", { ascending: true }).limit(limit);
  if (error) return bad("読み込めませんでした。migration 012 が適用されているか確認してください。", 500);
  const rows = (data ?? []) as Row[];
  return NextResponse.json({
    remaining: count ?? 0,
    rows: rows.map((r) => ({
      id: r.id,
      key: r.corporate_number || r.id.slice(0, 8),
      name: r.company_name,
      address: r.address || [r.prefecture, r.city].filter(Boolean).join(""),
    })),
  });
}

export async function POST(req: Request) {
  const a = await authed<{ ids?: unknown; text?: unknown }>(req);
  if ("error" in a) return a.error;
  const ids = Array.isArray(a.body.ids) ? a.body.ids.filter((x): x is string => typeof x === "string" && UUID.test(x)).slice(0, 50) : [];
  const text = str(a.body.text, 20000);
  if (ids.length === 0) return bad("先に「会社を表示」で対象の会社を表示してください");

  const { data } = await a.db.from(TABLES.companies).select("id,corporate_number").in("id", ids);
  const byKey = new Map<string, string>();
  for (const r of (data ?? []) as { id: string; corporate_number: string | null }[]) {
    byKey.set(r.corporate_number || r.id.slice(0, 8), r.id);
  }

  // 「番号,URL」「番号 URL」「| 番号 | 会社名 | URL |」など、ChatGPT の多少の書き方の揺れを吸収する
  const found = new Map<string, string>();
  for (const line of text.split(/\r?\n/)) {
    const key = [...byKey.keys()].find((k) => line.includes(k));
    if (!key) continue;
    const url = normalizeUrl(line.match(/https?:\/\/[^\s,|）)」"'<>]+/)?.[0] ?? "");
    if (url && domainKey(url)) found.set(key, `${new URL(url).origin}/`);
  }

  const now = new Date().toISOString();
  let registered = 0;
  for (const [key, id] of byKey) {
    const url = found.get(key);
    const patch = url
      ? { website_url: url, website_source: "chatgpt", crawl_status: "pending", email_status: "unchecked", crawl_error: null, last_checked_at: null, updated_at: now }
      : { website_source: "chatgpt_none", updated_at: now };
    const { error } = await a.db.from(TABLES.companies).update(patch).eq("id", id);
    if (!error && url) registered++;
  }
  return NextResponse.json({ ok: true, registered, notFound: byKey.size - registered });
}
