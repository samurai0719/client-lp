const CHECK_POINTS = [
  "希望する地域・施設・働き方の求人を扱っているか",
  "担当者との連絡手段や頻度が合うか",
  "職場の内部情報や面接対策など、必要なサポートがあるか",
  "1社だけで決めず、必要に応じて複数社を比較する",
];

export default function HowToChooseSection() {
  return (
    <section className="bg-white px-4 py-12 sm:px-6 sm:py-16" aria-labelledby="howto-heading">
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-teal-600">How to Choose</span>
          <h2 id="howto-heading" className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
            看護師転職サービスの選び方
          </h2>
        </div>

        <ul className="mx-auto max-w-2xl space-y-3">
          {CHECK_POINTS.map((point, i) => (
            <li key={point} className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed text-slate-700">{point}</p>
            </li>
          ))}
        </ul>

        <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-relaxed text-slate-400">
          複数のサービスに登録すること自体が転職の成功を保証するものではありません。ご自身の希望条件と各サービスの特徴を照らし合わせたうえでご検討ください。
        </p>
      </div>
    </section>
  );
}
