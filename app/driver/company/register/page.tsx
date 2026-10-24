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
      <main className="bg-[#f5f8fc] py-6 sm:py-12">
        <div className="mx-auto w-full max-w-3xl px-5 sm:px-6">
          <header className="mb-6 text-center">
            <p className="mb-2 inline-block rounded-full bg-[#ffc400] px-3 py-1 text-xs font-black text-[#0a1f4e]">
              かんたん2ステップ・約3分
            </p>
            <h1 className="text-2xl font-black leading-snug text-[#0a1f4e] sm:text-3xl">
              無料で求人を掲載する
            </h1>
            <ul className="mt-4 flex flex-wrap justify-center gap-2">
              {["登録0円", "掲載0円", "月額0円", "応募・面接0円", "登録後の営業電話なし"].map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-[#0d2b52]/15 bg-white px-3 py-1.5 text-[12px] font-bold text-[#0d2b52]"
                >
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[13px] leading-relaxed text-[#0d2b52]/60">
              料金は、ドライバーが入社した時だけ1名{PRICING.successFee}
              {PRICING.taxNote}です。
            </p>
          </header>

          <RegisterWizard />
        </div>
      </main>
    </CompanyShell>
  );
}
