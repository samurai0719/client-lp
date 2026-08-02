import { getServiceByRank } from "@/config/nurse-ranking";
import AffiliateLink from "@/components/nurse-ranking/AffiliateLink";
import RankMedal from "@/components/nurse-ranking/RankMedal";

const TYPES: { rank: 1 | 2 | 3; label: string }[] = [
  { rank: 1, label: "職場のリアルな情報を重視したい" },
  { rank: 2, label: "地域に詳しい担当者へ相談したい" },
  { rank: 3, label: "気になる病院を逆指名したい" },
];

export default function TypeRecommendationSection() {
  return (
    <section className="bg-slate-50 px-4 py-12 sm:px-6 sm:py-16" aria-labelledby="type-heading">
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-teal-600">For You</span>
          <h2 id="type-heading" className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
            タイプ別おすすめ
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {TYPES.map(({ rank, label }) => {
            const service = getServiceByRank(rank);
            return (
              <div key={rank} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="min-h-[3.2rem] text-sm font-semibold leading-snug text-slate-700">{label}</p>
                <div className="my-4 flex items-center gap-2">
                  <RankMedal rank={rank} size="sm" />
                  <p className="font-bold text-slate-900">{service.name}</p>
                </div>
                <AffiliateLink
                  href={service.affiliateUrl}
                  service={service.name}
                  rank={service.rank}
                  position="type_recommendation"
                  className="mt-auto flex items-center justify-center rounded-full bg-teal-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-teal-700"
                >
                  詳しく見る
                </AffiliateLink>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
