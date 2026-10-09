import { NextResponse } from "next/server";
import { authed, bad, str } from "@/lib/outreach/api";
import { insertCompany } from "@/lib/outreach/companies";

export const dynamic = "force-dynamic";

/** 企業を1件手動登録 */
export async function POST(req: Request) {
  const a = await authed(req);
  if ("error" in a) return a.error;
  const b = a.body;
  const company_name = str(b.company_name, 200);
  if (!company_name) return bad("会社名を入力してください");
  const r = await insertCompany(a.db, {
    company_name,
    contact_name: str(b.contact_name, 60),
    email: str(b.email, 200),
    phone: str(b.phone, 30),
    prefecture: str(b.prefecture, 10),
    city: str(b.city, 50),
    address: str(b.address, 300),
    website_url: str(b.website_url, 500),
    notes: str(b.notes, 2000),
    source: "manual",
  });
  if (r.result === "error") return bad(r.message, 500);
  return NextResponse.json(r);
}
