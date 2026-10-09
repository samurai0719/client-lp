import type { SupabaseClient } from "@supabase/supabase-js";
import { TABLES } from "./constants";
import type { CompanyRow } from "./companies";
import { crawlCompanySite } from "./crawler";
import { domainKey, nameKey } from "./normalize";
import { gbizLookupWebsite, placesFindWebsite } from "./sources";
import { addSuppression } from "./suppress";

/**
 * 「公式HPを確認 → 公開メールアドレスを取得」の段階。
 * crawl_status = pending の会社を古い順に少しずつ処理する。
 */

const PLACEHOLDER_NAME = /^[a-z0-9.-]+\.[a-z]{2,}$/i;

export async function enrichCompany(db: SupabaseClient, c: CompanyRow): Promise<void> {
  const now = new Date().toISOString();
  let website = c.website_url;

  // 法人番号が分かっていてHP未登録なら、gBizINFO の法人詳細からHPのURLを引く（無料）
  if (!website && c.corporate_number && process.env.GBIZINFO_API_TOKEN) {
    try {
      website = await gbizLookupWebsite(c.corporate_number);
    } catch (err) {
      await db
        .from(TABLES.companies)
        .update({ crawl_error: (err instanceof Error ? err.message : String(err)).slice(0, 200), last_checked_at: now })
        .eq("id", c.id);
      return; // 次回に再試行
    }
  }

  // それでもHPが分からなければ、会社名＋住所で Google Places から探す（APIキーがある場合のみ）
  if (!website && process.env.GOOGLE_PLACES_API_KEY) {
    try {
      website = await placesFindWebsite(c);
    } catch (err) {
      await db
        .from(TABLES.companies)
        .update({ crawl_error: (err instanceof Error ? err.message : String(err)).slice(0, 200), last_checked_at: now })
        .eq("id", c.id);
      return; // 次回に再試行
    }
  }

  if (!website) {
    await db
      .from(TABLES.companies)
      .update({
        crawl_status: "no_website",
        email_status: c.email ? c.email_status : "none",
        last_checked_at: now,
        updated_at: now,
      })
      .eq("id", c.id);
    return;
  }

  // ChatGPT で調べたURLは、HP上に社名か電話番号があるときだけ使う（もっともらしい別サイトを答えることがあるため）
  const needsIdentity = c.website_source === "chatgpt";
  const r = await crawlCompanySite(website, needsIdentity ? { name: c.corporate_name || c.company_name, phone: c.phone } : undefined);
  if (needsIdentity && r.status === "checked" && r.identityMatched === false) {
    await db
      .from(TABLES.companies)
      .update({
        website_url: null,
        website_source: "chatgpt_mismatch",
        crawl_status: "no_website",
        email_status: c.email ? c.email_status : "none",
        crawl_error: `ChatGPTのURL（${website}）に社名・電話番号が見つからないため不採用`,
        last_checked_at: now,
        updated_at: now,
      })
      .eq("id", c.id);
    return;
  }
  const patch: Record<string, unknown> = {
    website_url: website,
    crawl_status: r.status,
    crawl_error: r.error,
    last_checked_at: now,
    updated_at: now,
  };
  if (!c.domain) {
    const d = domainKey(r.finalUrl ?? website);
    if (d) patch.domain = d;
  }
  if (r.contactFormUrl && !c.contact_form_url) patch.contact_form_url = r.contactFormUrl;
  if (r.companyProfileUrl && !c.company_profile_url) patch.company_profile_url = r.companyProfileUrl;
  if (r.siteTitle && PLACEHOLDER_NAME.test(c.company_name)) {
    patch.company_name = r.siteTitle;
    patch.name_key = nameKey(r.siteTitle);
  }
  if (r.refusal) {
    patch.refusal_notice = true;
    patch.notes = [c.notes, `HPに送信お断りの表示：「${r.refusal}」`].filter(Boolean).join("\n").slice(0, 2000);
  }

  if (r.status === "checked") {
    if (c.email) {
      // CSV等で既にメールがある場合は上書きしない
    } else if (r.email) {
      patch.email = r.email;
      patch.email_source_url = r.emailSourceUrl;
      patch.email_status = "found";
    } else {
      patch.email_status = "none";
    }
  } else if (!c.email) {
    patch.email_status = "none";
  }

  let { error } = await db.from(TABLES.companies).update(patch).eq("id", c.id);
  if (error?.code === "23505") {
    // 同じメールアドレス・ドメインの会社が既に登録済み（グループ会社・支店など）→ 重複として除外
    const dupReason = `重複の可能性（同じ${patch.email ? "メールアドレス" : "ドメイン"}の企業が登録済み）`;
    delete patch.email;
    delete patch.email_source_url;
    delete patch.domain;
    patch.email_status = c.email ? c.email_status : "none";
    patch.review_status = "excluded";
    patch.notes = [c.notes, dupReason].filter(Boolean).join("\n").slice(0, 2000);
    ({ error } = await db.from(TABLES.companies).update(patch).eq("id", c.id));
  }
  if (error) console.error("[outreach] enrich update failed:", error.code, error.message);

  const email = (patch.email as string | undefined) ?? c.email;
  if (r.refusal && email) await addSuppression(db, email, "site_refusal", r.refusal);
}

/** 未確認の会社を limit 件、時間内で処理する */
export async function enrichPending(db: SupabaseClient, opts: { limit: number; deadline: number }): Promise<number> {
  const { data } = await db
    .from(TABLES.companies)
    .select("*")
    .eq("crawl_status", "pending")
    // 直前に失敗したもの（gBizINFO 一時エラー）は少し間を空ける
    .or(`last_checked_at.is.null,last_checked_at.lt.${new Date(Date.now() - 10 * 60_000).toISOString()}`)
    .order("created_at", { ascending: true })
    .limit(opts.limit);
  const rows = (data ?? []) as CompanyRow[];

  let done = 0;
  // 同時に数件ずつ（相手サイトに負荷をかけないよう、1社内のページは順番に読む）
  const CONCURRENCY = 3;
  for (let i = 0; i < rows.length; i += CONCURRENCY) {
    if (Date.now() > opts.deadline) break;
    await Promise.all(rows.slice(i, i + CONCURRENCY).map((c) => enrichCompany(db, c).catch((e) => console.error("[outreach] enrich failed:", e))));
    done += Math.min(CONCURRENCY, rows.length - i);
  }
  return done;
}
