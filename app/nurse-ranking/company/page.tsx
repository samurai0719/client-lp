import type { Metadata } from "next";
import LegalPageShell from "@/components/nurse-ranking/LegalPageShell";
import { siteMeta } from "@/config/nurse-ranking";

const canonicalUrl = siteMeta.domain ? `https://${siteMeta.domain}/nurse-ranking/company` : undefined;

// 運営者名・住所・連絡先は実データが確定するまで推測で入力しない。
// 下記のTODO項目は、公開前に必ず正しい情報へ差し替えること。
const companyInfo = {
  operatorName: "TODO: 運営者情報を入力",
  address: "TODO: 運営者情報を入力",
  contact: "TODO: 運営者情報を入力",
  representative: "TODO: 運営者情報を入力",
};

export const metadata: Metadata = {
  title: "運営者情報｜看護師転職サイトおすすめランキング",
  description: "看護師転職サイトおすすめランキングの運営者情報です。",
  alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
};

export default function CompanyPage() {
  return (
    <LegalPageShell title="運営者情報">
      <section>
        <table className="w-full border-collapse text-sm">
          <tbody>
            <tr className="border-b border-slate-100">
              <th scope="row" className="w-32 py-3 pr-4 text-left align-top font-semibold text-slate-500">
                サイト名
              </th>
              <td className="py-3">看護師転職サイトおすすめランキング</td>
            </tr>
            <tr className="border-b border-slate-100">
              <th scope="row" className="w-32 py-3 pr-4 text-left align-top font-semibold text-slate-500">
                運営者名
              </th>
              <td className="py-3 text-amber-700">{companyInfo.operatorName}</td>
            </tr>
            <tr className="border-b border-slate-100">
              <th scope="row" className="w-32 py-3 pr-4 text-left align-top font-semibold text-slate-500">
                代表者
              </th>
              <td className="py-3 text-amber-700">{companyInfo.representative}</td>
            </tr>
            <tr className="border-b border-slate-100">
              <th scope="row" className="w-32 py-3 pr-4 text-left align-top font-semibold text-slate-500">
                所在地
              </th>
              <td className="py-3 text-amber-700">{companyInfo.address}</td>
            </tr>
            <tr className="border-b border-slate-100">
              <th scope="row" className="w-32 py-3 pr-4 text-left align-top font-semibold text-slate-500">
                連絡先
              </th>
              <td className="py-3 text-amber-700">{companyInfo.contact}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>掲載内容について</h2>
        <p>
          当サイトに掲載する看護師転職サービスの情報は、各サービスの公式サイトで確認できる内容をもとに作成しています。
          掲載順位の考え方は「ランキング・編集方針」、広告の取り扱いは「広告掲載ポリシー」をご確認ください。
        </p>
      </section>

      <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-700">
        ※ 運営者名・所在地・連絡先は未確定のため仮の表示です。公開前に正式な情報へ差し替えてください。
      </p>
    </LegalPageShell>
  );
}
