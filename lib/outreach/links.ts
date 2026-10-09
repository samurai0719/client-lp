import type { SupabaseClient } from "@supabase/supabase-js";
import { TABLES } from "./constants";
import { domainKey, normalizeEmail, phoneKey } from "./normalize";

/**
 * 営業メール → LP → 企業登録・問い合わせ の自動紐付け。
 *
 * 1. UTM（utm_medium=outreach, utm_content=営業先企業ID）が残っている登録・問い合わせは確実に紐付く
 * 2. UTM が無い場合（別の端末で開いた等）は、営業メールを送った企業のうち
 *    メールアドレス / 公式HPドメイン / 電話番号 が一致するものに紐付ける
 *
 * 007 / 008 のテーブルが未作成でもエラーにせず何もしない。
 */

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Posting = { id: string; company_id: string; utm_medium: string | null; utm_content: string | null; created_at: string };
type DriverCompany = {
  id: string;
  notification_email: string | null;
  website_url: string | null;
  phone: string | null;
  created_at: string;
};
type Inquiry = { id: string; email: string; phone: string; utm_medium: string | null; utm_content: string | null; created_at: string };

async function linkCompany(db: SupabaseClient, outreachId: string, patch: Record<string, unknown>, at: string) {
  const { data } = await db.from(TABLES.companies).select("id,inquired_at").eq("id", outreachId).maybeSingle();
  if (!data) return false;
  const row = data as { id: string; inquired_at: string | null };
  await db
    .from(TABLES.companies)
    .update({ ...patch, inquired_at: row.inquired_at ?? at, updated_at: new Date().toISOString() })
    .eq("id", outreachId);
  return true;
}

async function matchByContact(
  db: SupabaseClient,
  c: { email?: string | null; website?: string | null; phone?: string | null }
): Promise<string | null> {
  const ors: string[] = [];
  const email = normalizeEmail(c.email);
  const emailDomain = email ? domainKey(`http://${email.split("@")[1]}`) : null;
  const siteDomain = domainKey(c.website ?? null);
  const pk = phoneKey(c.phone);
  if (email) ors.push(`email.eq."${email}"`);
  for (const d of new Set([emailDomain, siteDomain].filter(Boolean) as string[])) {
    ors.push(`domain.eq."${d}"`);
    // HP未登録（CSV等）の企業は、送信先メールアドレスのドメインで照合する
    ors.push(`email.like."%@${d}"`);
  }
  if (pk) ors.push(`phone_key.eq."${pk}"`);
  if (ors.length === 0) return null;
  const { data } = await db
    .from(TABLES.companies)
    .select("id")
    .not("last_sent_at", "is", null)
    .or(ors.join(","))
    .limit(1);
  return (data as { id: string }[] | null)?.[0]?.id ?? null;
}

export async function syncInquiryLinks(db: SupabaseClient): Promise<{ linked: number }> {
  let linked = 0;
  // 最初に営業メールを送った日時より前の登録・問い合わせは対象外
  const { data: first } = await db
    .from(TABLES.sends)
    .select("sent_at")
    .not("sent_at", "is", null)
    .order("sent_at", { ascending: true })
    .limit(1);
  const firstSent = (first as { sent_at: string }[] | null)?.[0]?.sent_at;
  if (!firstSent) return { linked };
  const since = new Date(Math.max(new Date(firstSent).getTime(), Date.now() - 180 * 86_400_000)).toISOString();

  // 既に紐付いているIDは対象外
  const { data: already } = await db
    .from(TABLES.companies)
    .select("linked_job_posting_id,linked_inquiry_id,linked_driver_company_id")
    .or("linked_job_posting_id.not.is.null,linked_inquiry_id.not.is.null,linked_driver_company_id.not.is.null")
    .limit(5000);
  const done = new Set<string>();
  for (const r of (already ?? []) as Record<string, string | null>[]) {
    for (const v of Object.values(r)) if (v) done.add(v);
  }

  // ── 企業登録・求人登録（008） ──
  const { data: postings, error: pErr } = await db
    .from("driver_job_postings")
    .select("id,company_id,utm_medium,utm_content,created_at")
    .gte("created_at", since)
    .order("created_at", { ascending: true })
    .limit(2000);
  if (!pErr) {
    const companyIds = [...new Set(((postings ?? []) as Posting[]).map((p) => p.company_id))];
    const companies = new Map<string, DriverCompany>();
    for (let i = 0; i < companyIds.length; i += 200) {
      const { data } = await db
        .from("driver_companies")
        .select("id,notification_email,website_url,phone,created_at")
        .in("id", companyIds.slice(i, i + 200));
      for (const c of (data ?? []) as DriverCompany[]) companies.set(c.id, c);
    }
    for (const p of (postings ?? []) as Posting[]) {
      if (done.has(p.id) || done.has(p.company_id)) continue;
      let target: string | null = null;
      if (p.utm_medium === "outreach" && p.utm_content && UUID.test(p.utm_content)) target = p.utm_content;
      if (!target) {
        const dc = companies.get(p.company_id);
        if (dc) target = await matchByContact(db, { email: dc.notification_email, website: dc.website_url, phone: dc.phone });
      }
      if (target && (await linkCompany(db, target, { linked_job_posting_id: p.id, linked_driver_company_id: p.company_id }, p.created_at))) {
        linked++;
        done.add(p.id);
        done.add(p.company_id);
      }
    }
  }

  // ── 問い合わせ（007） ──
  const { data: inquiries, error: iErr } = await db
    .from("driver_company_inquiries")
    .select("id,email,phone,utm_medium,utm_content,created_at")
    .gte("created_at", since)
    .limit(2000);
  if (!iErr) {
    for (const q of (inquiries ?? []) as Inquiry[]) {
      if (done.has(q.id)) continue;
      let target: string | null = null;
      if (q.utm_medium === "outreach" && q.utm_content && UUID.test(q.utm_content)) target = q.utm_content;
      if (!target) target = await matchByContact(db, { email: q.email, phone: q.phone });
      if (target && (await linkCompany(db, target, { linked_inquiry_id: q.id }, q.created_at))) {
        linked++;
        done.add(q.id);
      }
    }
  }

  return { linked };
}
