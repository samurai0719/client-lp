import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { authed, bad, str, UUID } from "@/lib/outreach/api";
import { CHATGPT_BLOCK_REASON, PREFECTURE_NAMES, TABLES } from "@/lib/outreach/constants";
import { verifyEmailOnPage } from "@/lib/outreach/crawler";
import { looksLikePersonalAddress } from "@/lib/outreach/emailPolicy";
import { domainKey, isSharedHost, normalizeEmail, normalizeUrl } from "@/lib/outreach/normalize";
import { addSuppression, isSuppressed } from "@/lib/outreach/suppress";

export const runtime = "nodejs";
export const maxDuration = 60;


export const dynamic = "force-dynamic";

/**
 * ChatGPT（手動）でHPを探すための書き出し・取り込み。
 *   GET  … HPが分からない会社を最大30社返す（まだ ChatGPT で調べていない会社だけ）
 *   POST … ChatGPT の回答「番号,公式HP,メール,掲載ページ」を貼り付けて登録。
 *          HP … 自動処理でHPを開き、社名か電話番号がHP上にあるときだけ採用する（enrich.ts）
 *          メール … 掲載ページを開いて本当に書かれているか・送信お断りの表示がないかを確認してから登録。
 *                   公式HP以外に載っていたアドレスもあるため、目視確認して「送信OK」にするまで送らない
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
  const text = str(a.body.text, 30000);
  if (ids.length === 0) return bad("先に「会社を表示」で対象の会社を表示してください");

  const { data } = await a.db.from(TABLES.companies).select("id,corporate_number,company_name").in("id", ids);
  const byKey = new Map<string, { id: string; name: string }>();
  for (const r of (data ?? []) as { id: string; corporate_number: string | null; company_name: string }[]) {
    byKey.set(r.corporate_number || r.id.slice(0, 8), { id: r.id, name: r.company_name });
  }

  // 1行1社：「番号,公式HP,メールアドレス,メールが載っているページ」。表形式・空白区切りなどの揺れも吸収する
  const answers = new Map<string, { hp: string | null; email: string | null; page: string | null }>();
  for (const line of text.split(/\r?\n/)) {
    const key = [...byKey.keys()].find((k) => line.includes(k));
    if (!key) continue;
    const email = normalizeEmail(line.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/)?.[0] ?? "");
    const urls = [...line.matchAll(/https?:\/\/[^\s,|）)」"'<>、]+/g)].map((m) => m[0]);
    // メールより前のURLを公式HP、後ろのURLを掲載ページとみなす（無ければ1つ目／2つ目）
    const emailAt = email ? line.toLowerCase().indexOf(email) : -1;
    const before = urls.filter((u) => emailAt < 0 || line.indexOf(u) < emailAt);
    const after = urls.filter((u) => emailAt >= 0 && line.indexOf(u) > emailAt);
    const hpRaw = before[0] ?? null;
    const pageRaw = after[0] ?? (before.length > 1 ? before[1] : null) ?? (email ? hpRaw : null);
    const hp = normalizeUrl(hpRaw ?? "");
    answers.set(key, {
      hp: hp && domainKey(hp) ? `${new URL(hp).origin}/` : null,
      email,
      page: normalizeUrl(pageRaw ?? ""),
    });
  }

  // メールアドレスは、掲載ページを実際に開いて確かめてから登録する（同時に数件ずつ）
  type Outcome = { hp: boolean; email: "added" | "rejected" | "none"; reason?: string; name: string };
  const outcomes: Outcome[] = [];
  const entries = [...byKey.entries()];
  const now = new Date().toISOString();
  const CONCURRENCY = 6;
  for (let i = 0; i < entries.length; i += CONCURRENCY) {
    await Promise.all(
      entries.slice(i, i + CONCURRENCY).map(async ([key, co]) => {
        const ans = answers.get(key);
        const patch: Record<string, unknown> = { updated_at: now };
        const out: Outcome = { hp: false, email: "none", name: co.name };

        if (ans?.hp) {
          Object.assign(patch, { website_url: ans.hp, website_source: "chatgpt", crawl_status: "pending", crawl_error: null, last_checked_at: null });
          out.hp = true;
        }

        if (ans?.email) {
          const v = await checkEmail(a.db, ans.email, ans.page);
          if (v.ok) {
            Object.assign(patch, {
              email: ans.email,
              email_status: "found",
              email_source_url: v.finalUrl,
              // ChatGPT 経由のアドレスは、確認待ちで目視確認して「送信OK」にするまで送らない
              review_status: "pending",
              send_blocked: true,
              send_blocked_reason: CHATGPT_BLOCK_REASON,
            });
            out.email = "added";
          } else {
            out.email = "rejected";
            out.reason = v.reason;
            if (v.refusal) await addSuppression(a.db, ans.email, "site_refusal", v.refusal);
          }
        }

        if (!out.hp && out.email !== "added") Object.assign(patch, { website_source: "chatgpt_none" });
        else if (!out.hp && out.email === "added") Object.assign(patch, { crawl_status: "checked" });
        else if (out.email !== "added") Object.assign(patch, { email_status: "unchecked" });

        const { error } = await a.db.from(TABLES.companies).update(patch).eq("id", co.id);
        if (error) {
          out.email = out.email === "added" ? "rejected" : out.email;
          out.reason = error.code === "23505" ? "同じメールアドレス（またはHP）の企業が既に登録済み" : "保存に失敗";
        }
        outcomes.push(out);
      })
    );
  }

  return NextResponse.json({
    ok: true,
    hpRegistered: outcomes.filter((o) => o.hp).length,
    emailAdded: outcomes.filter((o) => o.email === "added").length,
    rejected: outcomes.filter((o) => o.email === "rejected").map((o) => `${o.name}：${o.reason}`),
    notFound: outcomes.filter((o) => !o.hp && o.email === "none").length,
  });
}

/** ChatGPT が答えたメールアドレスの確認 */
async function checkEmail(
  db: SupabaseClient,
  email: string,
  page: string | null
): Promise<{ ok: true; finalUrl: string } | { ok: false; reason: string; refusal?: string }> {
  if (!page) return { ok: false, reason: "掲載ページのURLがありません" };
  const domain = email.split("@")[1];
  // 会社ドメインのアドレスで、部署・窓口らしくないもの（yamada@ 等）は個人アドレスとみなして使わない
  if (!isSharedHost(domain) && looksLikePersonalAddress(email)) return { ok: false, reason: `個人アドレスの可能性（${email}）` };
  if (await isSuppressed(db, email)) return { ok: false, reason: `配信停止リストに登録済み（${email}）` };
  const v = await verifyEmailOnPage(email, page);
  if (!v.ok) return { ok: false, reason: v.reason };
  if (v.refusal) return { ok: false, reason: `掲載ページに送信お断りの表示（${v.refusal}）`, refusal: v.refusal };
  return { ok: true, finalUrl: v.finalUrl };
}
