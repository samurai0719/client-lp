import { NextResponse } from "next/server";
import { authed, str, UUID } from "@/lib/outreach/api";
import { TABLES } from "@/lib/outreach/constants";
import type { CompanyRow } from "@/lib/outreach/companies";
import { normalizeUrl } from "@/lib/outreach/normalize";
import { renderEmail } from "@/lib/outreach/render";
import { getSettings, sendReadiness } from "@/lib/outreach/settings";
import { SERVICE } from "@/config/driver-company";

export const dynamic = "force-dynamic";

/**
 * 送信前の文面確認。実際の送信と同じ処理で差し込み・フッターを付けて返す。
 * companyId があればその企業で、無ければ確認待ち・送信OKの企業から数社を選んで表示する。
 */
export async function POST(req: Request) {
  const a = await authed(req);
  if ("error" in a) return a.error;
  const b = a.body;
  const settings = await getSettings(a.db);
  const landing = normalizeUrl(str(b.landing_page_url, 500)) ?? SERVICE.url;
  const campaign = { subject: str(b.subject, 200), body: typeof b.body === "string" ? b.body : "" };

  let companies: CompanyRow[] = [];
  const companyId = str(b.companyId, 40);
  if (UUID.test(companyId)) {
    const { data } = await a.db.from(TABLES.companies).select("*").eq("id", companyId).limit(1);
    companies = (data ?? []) as CompanyRow[];
  } else {
    const { data } = await a.db
      .from(TABLES.companies)
      .select("*")
      .eq("email_status", "found")
      .neq("review_status", "excluded")
      .order("reviewed_at", { ascending: false, nullsFirst: false })
      .limit(2);
    companies = (data ?? []) as CompanyRow[];
  }
  // 会社名が無い場合の宛名も確認できるよう、架空の例を1件足す
  const samples = [
    ...companies,
    { id: "00000000-0000-0000-0000-000000000000", company_name: "", contact_name: null, prefecture: "埼玉県", city: "川口市", source: "csv" },
  ];

  const previews = samples.map((c) => ({
    company: c.company_name || "（会社名なしの例）",
    email: "email" in c ? (c as CompanyRow).email : null,
    ...renderEmail(campaign, c, { campaignId: "preview0-0000-0000-0000-000000000000", landingPageUrl: landing, token: null, settings }),
  }));
  return NextResponse.json({
    previews: previews.map((p) => ({ company: p.company, email: p.email, subject: p.subject, text: p.text })),
    readiness: sendReadiness(settings),
  });
}
