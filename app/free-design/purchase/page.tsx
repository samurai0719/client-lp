import type { Metadata } from "next";
import "../../adofy/adofy.css";
import "../free-design.css";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/check";
import { LogoMark } from "@/components/adofy/ui";
import PurchaseForm from "./PurchaseForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "このデザインで購入を希望する｜adofy",
  robots: { index: false, follow: false },
  // メール内リンクのトークンを外部サイトへ referrer で渡さない
  referrer: "no-referrer",
};

/**
 * デザイン送付メールの「このデザインで購入を希望する」のリンク先。
 * 開いただけでは何も記録しない（メールソフトのリンク先チェックで誤記録しないため）。
 */
export default async function PurchasePage({ searchParams }: { searchParams: Promise<{ t?: string }> }) {
  const { t = "" } = await searchParams;
  const token = /^[A-Za-z0-9_-]{20,64}$/.test(t) ? t : "";

  let company: string | null = null;
  let already = false;
  let found = false;
  if (token && isSupabaseAdminConfigured()) {
    const { data } = await createAdminClient()
      .from("hp_design_requests")
      .select("company_name, contact_name, purchase_requested_at")
      .eq("public_token", token)
      .maybeSingle();
    if (data) {
      found = true;
      company = data.company_name ?? `${data.contact_name} 様`;
      already = Boolean(data.purchase_requested_at);
    }
  }

  return (
    <div className="adf-lp fd-page">
      <header className="fd-header">
        <span className="fd-header__logo">
          <span className="fd-header__mark">
            <LogoMark className="fd-header__svg" />
          </span>
          <span className="fd-header__name">adofy</span>
        </span>
      </header>
      <main className="fd-main fd-purchase">
        {!found ? (
          <div className="fd-done">
            <p className="fd-done__title">リンクを確認できませんでした</p>
            <p className="fd-done__text">お手数ですが、デザインをお送りしたメールのボタンから開き直すか、そのメールにご返信ください。</p>
          </div>
        ) : (
          <PurchaseForm token={token} company={company} already={already} />
        )}
      </main>
    </div>
  );
}
