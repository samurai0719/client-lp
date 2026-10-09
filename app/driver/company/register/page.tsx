import type { Metadata } from "next";
import CompanyShell from "@/components/driver-company/CompanyShell";
import PageViewTracker from "@/components/driver-company/PageViewTracker";
import RegisterWizard from "@/components/driver-company/RegisterWizard";
import { PRICING, SERVICE } from "@/config/driver-company";

/**
 * 企業登録・求人登録ページ（公開URL: driver.taxidriver-beginner.com/company/register）。
 * LPのCTAはすべてこのページへ遷移する。
 */

const TITLE = `求人情報の無料登録｜ドライバー採用なら${SERVICE.name}`;
const DESCRIPTION =
  "会社情報と求人情報を入力するだけで、求人の掲載と登録ドライバーへのメール配信が始まります。企業登録・求人登録・掲載・応募受信はすべて0円。料金は採用1名につき25万円の成果報酬のみです。";

export const metadata: Metadata = {
  metadataBase: new URL(SERVICE.siteUrl),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: SERVICE.registerUrl },
  openGraph: {
    type: "website",
    siteName: SERVICE.name,
    title: TITLE,
    description: DESCRIPTION,
    url: SERVICE.registerUrl,
    locale: "ja_JP",
    images: [{ url: SERVICE.logo, width: 640, height: 645, alt: SERVICE.name }],
  },
};

export default function Page() {
  return (
    <CompanyShell>
      <PageViewTracker event="company_register_view" />
      <main className="bg-[#f5f8fc] py-10 sm:py-14">
        <div className="mx-auto w-full max-w-3xl px-5 sm:px-6">
          <header className="mb-7 text-center">
            <p className="mb-2 text-xs font-bold tracking-[0.2em] text-[#0d2b52]/45">
              COMPANY &amp; JOB REGISTRATION
            </p>
            <h1 className="text-2xl font-bold leading-relaxed text-[#0d2b52] sm:text-3xl">
              求人情報を無料で登録する
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-[#0d2b52]/75">
              会社情報と求人情報をご入力ください。ご登録いただいた求人は{SERVICE.name}へ掲載し、
              登録条件に一致する登録ドライバーへ自動でメール配信します。
            </p>
            <ul className="mt-5 flex flex-wrap justify-center gap-2">
              {["企業登録0円", "求人掲載0円", "メール配信0円", "応募受信0円", "営業電話なし"].map(
                (t) => (
                  <li
                    key={t}
                    className="rounded-full border border-[#0d2b52]/15 bg-white px-3 py-1.5 text-[12px] font-bold text-[#0d2b52]"
                  >
                    {t}
                  </li>
                )
              )}
            </ul>
            <p className="mt-4 text-[13px] leading-relaxed text-[#0d2b52]/60">
              料金は採用1名につき{PRICING.successFee}
              {PRICING.taxNote}の成果報酬のみです。{PRICING.condition}
            </p>
          </header>

          <RegisterWizard />
        </div>
      </main>
    </CompanyShell>
  );
}
