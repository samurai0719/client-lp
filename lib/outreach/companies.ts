import type { SupabaseClient } from "@supabase/supabase-js";
import { TABLES } from "./constants";
import { domainKey, nameKey, normalizeEmail, normalizeUrl, pgQuote, phoneKey, splitAddress } from "./normalize";

/**
 * 営業先企業の登録（重複除外つき）。
 * 自動取得・CSV・手動のどの経路からも必ずここを通す。
 *
 * 同一企業の判定：メールアドレス / 公式HPのドメイン / 電話番号 / 取得元ID（法人番号・place_id）/
 * 法人番号 / 会社名＋都道府県（＋市区町村）のいずれかが一致したら同じ会社とみなす。
 * 既存レコードに無い項目だけを補い、新しいレコードは作らない。
 */

export type CompanyInput = {
  company_name: string;
  corporate_name?: string | null;
  corporate_number?: string | null;
  contact_name?: string | null;
  prefecture?: string | null;
  city?: string | null;
  address?: string | null;
  phone?: string | null;
  website_url?: string | null;
  email?: string | null;
  email_source_url?: string | null;
  contact_form_url?: string | null;
  company_profile_url?: string | null;
  source: "nta" | "gbizinfo" | "google_places" | "url_list" | "csv" | "manual";
  source_ref?: string | null;
  source_job_id?: string | null;
  notes?: string | null;
};

export type CompanyRow = {
  id: string;
  company_name: string;
  corporate_name: string | null;
  corporate_number: string | null;
  name_key: string;
  contact_name: string | null;
  prefecture: string | null;
  city: string | null;
  address: string | null;
  phone: string | null;
  phone_key: string | null;
  website_url: string | null;
  website_source: string | null;
  domain: string | null;
  email: string | null;
  email_source_url: string | null;
  contact_form_url: string | null;
  company_profile_url: string | null;
  source: string;
  source_ref: string | null;
  fetched_at: string;
  last_checked_at: string | null;
  crawl_status: string;
  crawl_error: string | null;
  email_status: string;
  refusal_notice: boolean;
  review_status: string;
  reviewed_at: string | null;
  send_blocked: boolean;
  send_blocked_reason: string | null;
  outreach_status: string;
  last_sent_at: string | null;
  opened_at: string | null;
  clicked_at: string | null;
  replied_at: string | null;
  unsubscribed_at: string | null;
  bounced_at: string | null;
  last_error: string | null;
  linked_inquiry_id: string | null;
  linked_driver_company_id: string | null;
  linked_job_posting_id: string | null;
  inquired_at: string | null;
  contracted_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type InsertOutcome = { result: "inserted" | "duplicate"; id: string } | { result: "error"; message: string };

function clean(v: string | null | undefined, max = 300): string | null {
  const s = (v ?? "").trim();
  return s ? s.slice(0, max) : null;
}

export function prepareCompany(input: CompanyInput) {
  const website = normalizeUrl(input.website_url);
  const email = normalizeEmail(input.email);
  const addr = splitAddress(input.address);
  const prefecture = clean(input.prefecture, 10) ?? addr.prefecture;
  const city = clean(input.city, 50) ?? addr.city;
  return {
    company_name: clean(input.company_name, 200)!,
    corporate_name: clean(input.corporate_name, 200),
    corporate_number: clean(input.corporate_number, 13),
    name_key: nameKey(input.corporate_name || input.company_name),
    contact_name: clean(input.contact_name, 60),
    prefecture,
    city,
    address: clean(input.address, 300),
    phone: clean(input.phone, 30),
    phone_key: phoneKey(input.phone),
    website_url: website,
    domain: domainKey(website),
    email,
    email_source_url: clean(input.email_source_url, 500),
    contact_form_url: normalizeUrl(input.contact_form_url),
    company_profile_url: normalizeUrl(input.company_profile_url),
    source: input.source,
    source_ref: clean(input.source_ref, 200),
    source_job_id: input.source_job_id ?? null,
    notes: clean(input.notes, 2000),
    // メールが分かっていればHP確認を待たずに送信候補（確認待ち）にする
    email_status: email ? "found" : "unchecked",
    // gBizINFO・国税庁由来は、HPのURLが無くても gBizINFO の法人詳細から取れることがあるため「未確認」にしておく
    crawl_status:
      website || ((input.source === "gbizinfo" || input.source === "nta") && input.corporate_number) ? "pending" : email ? "checked" : "no_website",
  };
}

export async function findDuplicate(
  db: SupabaseClient,
  row: ReturnType<typeof prepareCompany>
): Promise<CompanyRow | null> {
  const ors: string[] = [];
  if (row.email) ors.push(`email.eq.${pgQuote(row.email)}`); // 保存時に必ず小文字化している
  if (row.domain) ors.push(`domain.eq.${pgQuote(row.domain)}`);
  if (row.phone_key) ors.push(`phone_key.eq.${pgQuote(row.phone_key)}`);
  if (row.corporate_number) ors.push(`corporate_number.eq.${pgQuote(row.corporate_number)}`);
  if (row.source_ref) ors.push(`and(source.eq.${row.source},source_ref.eq.${pgQuote(row.source_ref)})`);

  if (ors.length > 0) {
    const { data } = await db.from(TABLES.companies).select("*").or(ors.join(",")).limit(1);
    if (data && data.length > 0) return data[0] as CompanyRow;
  }

  // 会社名＋都道府県。市区町村が両方分かっていて食い違う場合は別会社（同名の別法人）とみなす
  if (row.name_key && row.prefecture) {
    const { data } = await db
      .from(TABLES.companies)
      .select("*")
      .eq("name_key", row.name_key)
      .eq("prefecture", row.prefecture)
      .limit(5);
    const hit = (data as CompanyRow[] | null)?.find((c) => !c.city || !row.city || c.city === row.city);
    if (hit) return hit;
  }
  return null;
}

/** 既存レコードに無い項目だけを補う */
function mergePatch(existing: CompanyRow, row: ReturnType<typeof prepareCompany>): Record<string, unknown> {
  const patch: Record<string, unknown> = {};
  const fill = (key: keyof CompanyRow & keyof typeof row) => {
    if (!existing[key] && row[key]) patch[key] = row[key];
  };
  (["corporate_name", "corporate_number", "contact_name", "prefecture", "city", "address", "phone", "phone_key",
    "contact_form_url", "company_profile_url"] as const).forEach(fill);

  if (!existing.website_url && row.website_url) {
    patch.website_url = row.website_url;
    if (row.domain) patch.domain = row.domain;
    if (existing.crawl_status === "no_website") patch.crawl_status = "pending";
  }
  if (!existing.email && row.email) {
    patch.email = row.email;
    patch.email_status = "found";
    if (row.email_source_url) patch.email_source_url = row.email_source_url;
  }
  if (row.notes && !existing.notes) patch.notes = row.notes;
  if (Object.keys(patch).length > 0) patch.updated_at = new Date().toISOString();
  return patch;
}

export async function insertCompany(db: SupabaseClient, input: CompanyInput): Promise<InsertOutcome> {
  if (!input.company_name?.trim()) return { result: "error", message: "会社名がありません" };
  const row = prepareCompany(input);

  const dup = await findDuplicate(db, row);
  if (dup) {
    const patch = mergePatch(dup, row);
    if (Object.keys(patch).length > 0) {
      const { error } = await db.from(TABLES.companies).update(patch).eq("id", dup.id);
      // 補完した値が別の会社と衝突した場合（同じドメインのグループ会社など）は補完しない
      if (error && error.code !== "23505") return { result: "error", message: error.message };
    }
    return { result: "duplicate", id: dup.id };
  }

  const { data, error } = await db.from(TABLES.companies).insert(row).select("id").single();
  if (error) {
    if (error.code === "23505") {
      const again = await findDuplicate(db, row);
      return again ? { result: "duplicate", id: again.id } : { result: "error", message: "重複のため登録できませんでした" };
    }
    return { result: "error", message: error.message };
  }
  return { result: "inserted", id: (data as { id: string }).id };
}
