'use client';

import { TIPS, type Tip } from '@/components/levjob-driver/config';

interface TipsStepProps {
  /** 「次に進む」で免許の質問（4問目）へ */
  onNext: () => void;
}

/** 豆知識1つ。登録画面の画像に、選ぶ場所を赤丸（または角丸の枠）で重ねる */
function TipCard({ tip }: { tip: Tip }) {
  const { image, circle } = tip;
  return (
    <div className="rounded-2xl border-2 border-dashed border-amber-400 bg-amber-50 px-4 pt-4 pb-5">
      <p className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-0.5 text-sm font-bold text-white">
        <span aria-hidden="true">💡</span>豆知識
      </p>
      <div className="relative mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image.src} width={image.width} height={image.height} alt={image.alt} className="block h-auto w-full" />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute rounded-[50%] border-4 border-red-600 shadow-[0_0_0_2px_rgba(255,255,255,0.9)]"
          style={{
            left: `${circle.left}%`,
            top: `${circle.top}%`,
            width: `${circle.width}%`,
            height: `${circle.height}%`,
            borderRadius: circle.radius,
          }}
        />
      </div>
      <p className="mt-4 text-[15px] font-bold leading-relaxed text-slate-800 [text-wrap:pretty] [word-break:auto-phrase]">
        <strong className="text-red-600 [background:linear-gradient(transparent_60%,#ffe066_60%)]">{tip.em}</strong>
        {tip.text}
      </p>
    </div>
  );
}

/**
 * 在職中かの質問と免許の質問の間（3.5問目）に出す、登録時の豆知識2つ
 * （/levjob-driver のアンケート型LPと同じ画像・文言）と「次に進む」ボタン。
 */
export default function TipsStep({ onNext }: TipsStepProps) {
  return (
    <section className="px-5 py-8">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold leading-snug text-slate-800">
          <span className="whitespace-nowrap">好条件の求人を紹介してもらう</span>
          <wbr />
          <span className="whitespace-nowrap">ための豆知識</span>
        </h2>
      </div>

      <div className="flex flex-col gap-5">
        <TipCard tip={TIPS.timing} />
        <TipCard tip={TIPS.area} />
      </div>

      <div className="mx-auto mt-8 max-w-[360px]">
        <button
          type="button"
          onClick={onNext}
          className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 px-5 py-6 text-white shadow-[0_6px_22px_rgba(29,78,216,0.38)] transition-all duration-150 hover:from-blue-500 hover:to-blue-700 active:scale-[0.97]"
        >
          <span className="text-[19px] font-extrabold tracking-tight">次に進む</span>
          <span className="text-2xl transition-transform duration-150 group-hover:translate-x-1.5" aria-hidden="true">
            →
          </span>
        </button>
      </div>
    </section>
  );
}
