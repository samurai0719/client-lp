import { services, comparisonFootnote } from "@/config/nurse-ranking";
import RankMedal from "@/components/nurse-ranking/RankMedal";
import AffiliateLink from "@/components/nurse-ranking/AffiliateLink";

export default function ComparisonSection() {
  return (
    <section className="bg-white px-4 py-12 sm:px-6 sm:py-16" aria-labelledby="comparison-heading">
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-teal-600">Comparison</span>
          <h2 id="comparison-heading" className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
            まずは3社を比較
          </h2>
        </div>

        {/* ── PC: 表 ───────────────────────────────────────────────── */}
        <div className="hidden overflow-hidden rounded-2xl border border-slate-200 shadow-sm lg:block">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th scope="col" className="w-16 px-4 py-3 text-left text-xs font-semibold text-slate-500">順位</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-slate-500">サービス名</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-slate-500">おすすめポイント</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-slate-500">規模・実績</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-slate-500">相談料金</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-slate-500">連絡手段</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-slate-500">向いている人</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-slate-500">&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.name} className="border-t border-slate-100">
                  <td className="px-4 py-4">
                    <RankMedal rank={s.rank} size="sm" />
                  </td>
                  <td className="px-4 py-4 font-bold text-slate-900">{s.name}</td>
                  <td className="px-4 py-4 text-slate-600">{s.comparisonHighlight}</td>
                  <td className="px-4 py-4 text-slate-600">
                    {s.scaleFact}
                    <span className="block text-[10px] text-slate-400">確認日：{s.sourceCheckedAt}</span>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{s.consultationFee}</td>
                  <td className="px-4 py-4 text-slate-600">{s.contactMethods}</td>
                  <td className="px-4 py-4 text-slate-600">{s.comparisonSuitableFor}</td>
                  <td className="px-4 py-4">
                    <AffiliateLink
                      href={s.affiliateUrl}
                      service={s.name}
                      rank={s.rank}
                      position="comparison_table"
                      className="inline-block whitespace-nowrap rounded-full bg-teal-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-teal-700"
                    >
                      無料相談する
                    </AffiliateLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── スマホ: 要約カード ───────────────────────────────────── */}
        <div className="space-y-4 lg:hidden">
          {services.map((s) => (
            <div key={s.name} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2.5">
                <RankMedal rank={s.rank} size="sm" />
                <p className="font-bold text-slate-900">{s.name}</p>
              </div>
              <dl className="space-y-2 text-sm">
                <div className="flex gap-2">
                  <dt className="w-24 shrink-0 text-xs font-medium text-slate-400">おすすめ点</dt>
                  <dd className="text-slate-600">{s.comparisonHighlight}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-24 shrink-0 text-xs font-medium text-slate-400">規模・実績</dt>
                  <dd className="text-slate-600">
                    {s.scaleFact}
                    <span className="block text-[10px] text-slate-400">確認日：{s.sourceCheckedAt}</span>
                  </dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-24 shrink-0 text-xs font-medium text-slate-400">相談料金</dt>
                  <dd className="text-slate-600">{s.consultationFee}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-24 shrink-0 text-xs font-medium text-slate-400">連絡手段</dt>
                  <dd className="text-slate-600">{s.contactMethods}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-24 shrink-0 text-xs font-medium text-slate-400">向いている人</dt>
                  <dd className="text-slate-600">{s.comparisonSuitableFor}</dd>
                </div>
              </dl>
              <AffiliateLink
                href={s.affiliateUrl}
                service={s.name}
                rank={s.rank}
                position="comparison_table"
                className="mt-4 flex w-full items-center justify-center rounded-full bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-700 active:scale-[0.98]"
              >
                無料相談する
              </AffiliateLink>
            </div>
          ))}
        </div>

        <p className="mt-4 text-center text-[11px] text-slate-400">{comparisonFootnote}</p>
      </div>
    </section>
  );
}
