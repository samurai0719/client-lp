const STEPS = [
  { step: "1", title: "無料登録", body: "公式サイトのフォームから、氏名・連絡先などの基本情報を登録します。" },
  { step: "2", title: "希望条件のヒアリング", body: "担当アドバイザーが、働き方や希望条件について電話などでヒアリングします。" },
  { step: "3", title: "求人紹介・面接対策", body: "希望条件に合う求人の紹介と、書類・面接対策のサポートを受けられます。" },
  { step: "4", title: "面接・入職", body: "選考を経て、条件交渉や入職日の調整をサポートしてもらいながら入職します。" },
];

export default function FlowSection() {
  return (
    <section className="bg-slate-50 px-4 py-12 sm:px-6 sm:py-16" aria-labelledby="flow-heading">
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-teal-600">Flow</span>
          <h2 id="flow-heading" className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
            利用の流れ
          </h2>
        </div>

        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-4 sm:gap-3">
          {STEPS.map(({ step, title, body }, i) => (
            <div key={step} className="relative rounded-2xl border border-slate-200 bg-white p-4 text-center">
              <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white">
                {step}
              </span>
              <p className="mt-3 text-sm font-semibold text-slate-900">{title}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{body}</p>
              {i < STEPS.length - 1 && (
                <span
                  aria-hidden
                  className="absolute -bottom-3 left-1/2 hidden -translate-x-1/2 text-slate-300 sm:-right-3 sm:bottom-auto sm:left-auto sm:top-1/2 sm:block sm:-translate-y-1/2 sm:translate-x-0"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 6 15 12 9 18" />
                  </svg>
                </span>
              )}
            </div>
          ))}
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-relaxed text-slate-400">
          ※ サービスにより流れが異なる場合があります。詳細は各サービスの公式サイトをご確認ください。
        </p>
      </div>
    </section>
  );
}
