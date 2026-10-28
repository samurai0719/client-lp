'use client';

import { useEffect, useRef } from 'react';
import QuestionCard from './QuestionCard';
import { DESIRED_TIMINGS, TOTAL_STEPS } from './questions';

interface HeroSectionProps {
  /** 質問1（今のお気持ち）の回答 */
  motivation: string;
  /** 質問2（転職時期）の回答 */
  desiredTiming: string;
  onMotivation: (answer: string) => void;
  /** 転職時期を選んだら親が STEP2 へ進める */
  onTiming: (answer: string) => void;
}

const BADGES = ['✓ 未経験歓迎', '✓ 資格取得支援あり', '✓ 高収入求人あり'];

/**
 * ファーストビュー + STEP1（今のお気持ち → 転職時期）。
 * 今のお気持ちを選ぶと、同じページの下に転職時期の質問が出てスクロールします。
 * 転職時期を選ぶと DriverContent 側で STEP2 へ進み、このコンポーネントは非表示になります。
 * 戻るボタンで STEP1 に戻ったときは、選んだ回答が選択済みの見た目で残ります。
 *
 * 画像差し替え:
 *   現在は Wixstatic の URL を直接参照しています。
 *   ローカル画像に差し替える場合は FV_IMAGE_SRC を
 *   "/images/driver/fv.png" に変更し、public/images/driver/ に画像を配置してください。
 */
/** FV画像の右下に王冠つきで重ねる実績（数字は運営者の実績。変えるときは根拠を確認すること） */
const FV_ACHIEVEMENTS = [
  { sub: '累計応募者数', main: '2,000人以上', size: 'text-[8.6cqw]' },
  { sub: 'ドラテクは', main: '元大型ドライバーが運営', size: 'text-[7cqw]' },
];

/** 王冠マーク（金） */
function CrownIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[10cqw] w-[10cqw] shrink-0">
      <path
        d="M3 8.5l4.2 3.6L12 5l4.8 7.1L21 8.5l-1.7 9.5H4.7L3 8.5z"
        fill="#f5b800"
        stroke="#b07a00"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <rect x="4.7" y="18.6" width="14.6" height="2.2" rx="0.6" fill="#d99a00" />
      <circle cx="12" cy="4.4" r="1.4" fill="#f5b800" />
      <circle cx="2.8" cy="8" r="1.2" fill="#f5b800" />
      <circle cx="21.2" cy="8" r="1.2" fill="#f5b800" />
    </svg>
  );
}

const FV_IMAGE_SRC =
  'https://static.wixstatic.com/media/5ebda9_99d3d0d773514fa1acce476635216af6~mv2.png';

export default function HeroSection({ motivation, desiredTiming, onMotivation, onTiming }: HeroSectionProps) {
  const timingRef = useRef<HTMLDivElement>(null);
  const prevMotivation = useRef(motivation);

  // 今のお気持ちを（新しく）選んだら、転職時期の質問までスクロールする
  useEffect(() => {
    if (motivation && motivation !== prevMotivation.current) {
      timingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    prevMotivation.current = motivation;
  }, [motivation]);

  const ring = (label: string) =>
    motivation === label ? ' ring-4 ring-blue-300 ring-offset-2' : motivation ? ' opacity-70' : '';

  return (
    <section className="w-full bg-white">

      {/* ── サービスヘッダー ──
           ロゴは紺色のため、青グラデーション上では白いチップに載せてコントラストを確保。
           ロゴ画像: public/images/driver/logo.png (ロゴマーク+ロゴタイプの縦組み)
      */}
      <header className="bg-gradient-to-r from-blue-800 to-blue-600 text-white">
        <div className="px-4 py-2.5 flex items-center gap-3">
          <h1 className="shrink-0">
            <img
              src="/images/driver/logo.png"
              alt="ドラテク"
              width={640}
              height={645}
              className="h-11 w-auto block bg-white rounded-lg p-1.5 shadow-sm"
            />
          </h1>
          <div className="min-w-0">
            <p className="text-[9px] font-semibold tracking-widest text-blue-200 uppercase">
              Doratech Driver Career
            </p>
            <p className="text-[13px] font-bold leading-tight">
              ドライバー求人・転職サービス
            </p>
          </div>
        </div>
      </header>

      {/* ── ファーストビュー画像 ──
           w-full h-auto block で画像の自然なアスペクト比を維持して表示。
           object-cover で強制クロップせず、画像全体を崩さずに見せる。
           グラデーション背景は画像読み込み失敗時のフォールバック。
      */}
      <div className="relative w-full bg-gradient-to-br from-blue-900 to-blue-600">
        <img
          src={FV_IMAGE_SRC}
          alt="ドラテク トラックドライバー求人 メインビジュアル"
          className="w-full h-auto block"
        />

        {/* ── 実績バッジ（王冠） ──
             画像右下（運転席の窓・腕のあたり）に重ねる。画像の文字や顔にかからない位置。
             画像の幅に合わせて文字も縮むよう、サイズは cqw（画像幅に対する割合）で指定。
        */}
        <ul className="absolute right-[2.5%] bottom-[5%] flex w-[47%] flex-col gap-[1.6cqw] [container-type:inline-size]" aria-label="ドラテクの実績">
          {FV_ACHIEVEMENTS.map((a) => (
            <li
              key={a.main}
              className="flex items-center gap-[2cqw] rounded-[3cqw] border border-amber-300/80 bg-white/92 px-[3cqw] py-[2cqw] shadow-[0_4px_14px_rgba(15,40,100,0.30)] backdrop-blur-sm"
            >
              <CrownIcon />
              <span className="min-w-0 leading-[1.2]">
                <span className="block text-[6.2cqw] font-bold text-slate-600">{a.sub}</span>
                <span className={`block whitespace-nowrap ${a.size} font-black tracking-tight text-blue-800`}>{a.main}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── 訴求バッジ ── */}
      <div className="bg-blue-700 px-3 py-2">
        <div className="flex gap-1.5 justify-center flex-wrap">
          {BADGES.map((b) => (
            <span
              key={b}
              className="bg-white/15 text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-white/25 whitespace-nowrap"
            >
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* ── サービス紹介のミニセクション ── */}
      <div className="border-b border-blue-100 bg-gradient-to-b from-blue-50 to-white px-4 py-4 text-center">
        <p className="text-[15px] font-black leading-snug text-blue-800">
          トラックドライバーの<span className="text-orange-500">逆採用</span>サービス！
        </p>
        <p className="mt-1 text-[13px] font-bold leading-snug text-slate-700">
          あなたは<span className="bg-[linear-gradient(transparent_60%,#fde68a_60%)] px-0.5">企業からのスカウトを待つだけ！</span>
        </p>
      </div>

      {/* ── Q1: あなたの今のお気持ちは？ ──
           ※ 回答後 HeroSection ごと非表示 (DriverContent 側で step === 0 の条件でレンダリング制御)
      */}
      <div className="px-4 pt-5 pb-7 bg-white">

        {/* 質問テキスト */}
        <div className="text-center mb-5">
          <p className="text-[10px] font-bold tracking-widest text-blue-500 uppercase mb-1">
            QUESTION 1
          </p>
          <h2 className="text-lg font-bold text-slate-800 leading-snug">
            あなたの今のお気持ちは？
          </h2>
          <p className="text-[11px] text-slate-400 mt-1">あてはまるものを選んでください</p>
          <p className="mt-2 inline-block rounded-full bg-blue-50 px-3 py-0.5 text-[11px] font-bold text-blue-600">
            STEP 1 / {TOTAL_STEPS}・あと{TOTAL_STEPS - 1}ステップ
          </p>
        </div>

        {/* ── CTA ボタン ──
             max-w-[360px] mx-auto でPC版の横幅を抑制し、中央寄せで品よく配置。
             モバイルでは px-4 の余白だけで自然に広がる。
             縦幅は py-6/py-5 でしっかりした押しやすいサイズに。
        */}
        <div className="max-w-[360px] mx-auto flex flex-col gap-3">

          {/* プライマリ: 今すぐ転職したい */}
          <button
            type="button"
            onClick={() => onMotivation('今すぐ転職したい')}
            aria-pressed={motivation === '今すぐ転職したい'}
            className={`group w-full rounded-2xl transition-all duration-150 active:scale-[0.97]
              bg-gradient-to-br from-blue-600 to-blue-800
              hover:from-blue-500 hover:to-blue-700
              shadow-[0_6px_22px_rgba(29,78,216,0.38)]
              hover:shadow-[0_8px_28px_rgba(29,78,216,0.50)]
              text-white px-5 py-6${ring('今すぐ転職したい')}`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="text-left">
                <span className="block text-[17px] font-extrabold leading-tight tracking-tight">
                  今すぐ転職したい
                </span>
                <span className="block text-xs font-normal text-blue-200 mt-1.5">
                  すぐに動き出したい方はこちら
                </span>
              </div>
              <span className="text-2xl shrink-0 group-hover:translate-x-1.5 transition-transform duration-150">
                →
              </span>
            </div>
          </button>

          {/* セカンダリ: まずは情報収集したい */}
          <button
            type="button"
            onClick={() => onMotivation('まずは情報収集したい')}
            aria-pressed={motivation === 'まずは情報収集したい'}
            className={`group w-full rounded-2xl transition-all duration-150 active:scale-[0.97]
              bg-gradient-to-br from-sky-400 to-sky-600
              hover:from-sky-300 hover:to-sky-500
              shadow-[0_4px_16px_rgba(14,165,233,0.30)]
              hover:shadow-[0_6px_22px_rgba(14,165,233,0.44)]
              text-white px-5 py-5${ring('まずは情報収集したい')}`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="text-left">
                <span className="block text-[15px] font-bold leading-tight">
                  まずは情報収集したい
                </span>
                <span className="block text-[11px] font-normal text-sky-100 mt-1.5">
                  じっくり検討したい方はこちら
                </span>
              </div>
              <span className="text-xl shrink-0 group-hover:translate-x-1.5 transition-transform duration-150">
                →
              </span>
            </div>
          </button>

        </div>
        {/* 「※ 無料・登録不要でご確認いただけます」削除済み */}

        {/* 転職時期: 今のお気持ちを選ぶと表示。選ぶと STEP2 へ */}
        {motivation && (
          <div ref={timingRef} className="mt-8 scroll-mt-4 border-t border-slate-100 pt-7">
            <QuestionCard
              index={2}
              question="いつ頃の転職を考えていますか？"
              choices={DESIRED_TIMINGS.map((label) => ({ label }))}
              value={desiredTiming}
              onSelect={onTiming}
            />
          </div>
        )}

      </div>
    </section>
  );
}
