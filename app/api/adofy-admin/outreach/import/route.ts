import { NextResponse } from "next/server";
import { authed, bad, str } from "@/lib/outreach/api";
import { insertCompany } from "@/lib/outreach/companies";
import { looksLikePersonalAddress } from "@/lib/outreach/emailPolicy";
import { normalizeEmail } from "@/lib/outreach/normalize";
import { isSuppressed } from "@/lib/outreach/suppress";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

type Row = Record<string, string>;

/**
 * CSV取り込み（補助機能）。ブラウザ側でCSVを読み、200行ずつ送ってくる。
 * 重複（メール・ドメイン・電話・会社名＋地域）は自動で除外し、既存レコードの空欄だけ補う。
 */
export async function POST(req: Request) {
  const a = await authed<{ rows?: unknown; consent?: unknown }>(req);
  if ("error" in a) return a.error;
  if (a.body.consent !== true) return bad("取り込むアドレスの取得経路の確認にチェックしてください");
  const rows = Array.isArray(a.body.rows) ? (a.body.rows as Row[]).slice(0, 200) : [];
  if (rows.length === 0) return bad("取り込む行がありません");

  let inserted = 0;
  let duplicate = 0;
  const errors: { row: number; message: string }[] = [];
  const warnings: { row: number; message: string }[] = [];

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i] ?? {};
    const company_name = str(r.company_name, 200);
    const rawEmail = str(r.email, 200);
    const email = rawEmail ? normalizeEmail(rawEmail) : null;
    if (!company_name && !email) {
      errors.push({ row: i, message: "会社名もメールアドレスもありません" });
      continue;
    }
    if (rawEmail && !email) {
      errors.push({ row: i, message: `メールアドレスの形式が不正です（${rawEmail}）` });
      continue;
    }
    if (email && looksLikePersonalAddress(email)) {
      warnings.push({ row: i, message: `個人アドレスの可能性があります（${email}）。確認待ちで目視確認してください` });
    }
    if (email && (await isSuppressed(a.db, email))) {
      warnings.push({ row: i, message: `配信停止リストに登録済みのため送信されません（${email}）` });
    }
    const res = await insertCompany(a.db, {
      company_name: company_name || email!.split("@")[1],
      contact_name: str(r.contact_name, 60),
      email,
      phone: str(r.phone, 30),
      prefecture: str(r.prefecture, 10),
      city: str(r.city, 50),
      address: str(r.address, 300),
      website_url: str(r.website_url, 500),
      notes: str(r.notes, 2000),
      source: "csv",
    });
    if (res.result === "inserted") inserted++;
    else if (res.result === "duplicate") duplicate++;
    else if (res.result === "error") errors.push({ row: i, message: res.message });
  }
  return NextResponse.json({ inserted, duplicate, errors, warnings });
}
