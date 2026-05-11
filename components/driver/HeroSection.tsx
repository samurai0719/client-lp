'use client';

interface HeroSectionProps {
  onAnswer: (answer: string) => void;
}

const BADGES = ['✓ 未経験歓迎', '✓ 資格取得支援あり', '✓ 高収入求人あり'];

/**
 * ファーストビュー + Q1 セクション。
 * 1問目の回答後は DriverContent 側で step を進めることで
 * このコンポーネントごと非表示になります。
 *
 * 画像差し替え:
 *   現在は Wixstatic の URL を直接参照しています。
 *   ローカル画像に差し替える場合は FV_IMAGE_SRC を
 *   "/images/driver-fv.png" に変更し、public/images/ に画像を配置してください。
 */
const FV_IMAGE_SRC =
  'https://static.wixstatic.com/media/5ebda9_99d3d0d773514fa1acce476635216af6~mv2.png';

export default function HeroSection({ onAnswer }: HeroSectionProps) {
  return (
    <section className="w-full bg-white">

      {/* ── 【1】PR表記 ──
           法的要件として最上部に配置。デザインを崩さず自然に入れる。
      */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-1.5 text-center">
        <span className="text-[11px] font-semibold text-slate-500 tracking-wide">
          【PR】レバジョブ
        </span>
      </div>

      {/* ── サービスヘッダー ── */}
      <header className="bg-gradient-to-r from-blue-800 to-blue-600 text-white">
        <div className="px-4 py-2.5 flex items-center justify-between">
          <div>
            <p className="text-[9px] font-semibold tracking-widest text-blue-200 uppercase">
              Driver Career Support
            </p>
            <h1 className="text-sm font-bold leading-tight">ドライバー転職ナビ</h1>
          </div>
          {/* 「無料・登録不要」削除済み */}
        </div>
      </header>

      {/* ── ファーストビュー画像 ──
           w-full h-auto block で画像の自然なアスペクト比を維持して表示。
           object-cover で強制クロップせず、画像全体を崩さずに見せる。
           グラデーション背景は画像読み込み失敗時のフォールバック。
      */}
      <div className="w-full bg-gradient-to-br from-blue-900 to-blue-600">
        <img
          src={FV_IMAGE_SRC}
          alt="トラックドライバー転職ナビ メインビジュアル"
          className="w-full h-auto block"
        />
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
            onClick={() => onAnswer('今すぐ転職したい')}
            className="group w-full rounded-2xl transition-all duration-150 active:scale-[0.97]
              bg-gradient-to-br from-blue-600 to-blue-800
              hover:from-blue-500 hover:to-blue-700
              shadow-[0_6px_22px_rgba(29,78,216,0.38)]
              hover:shadow-[0_8px_28px_rgba(29,78,216,0.50)]
              text-white px-5 py-6"
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
            onClick={() => onAnswer('まずは情報収集したい')}
            className="group w-full rounded-2xl transition-all duration-150 active:scale-[0.97]
              bg-gradient-to-br from-sky-400 to-sky-600
              hover:from-sky-300 hover:to-sky-500
              shadow-[0_4px_16px_rgba(14,165,233,0.30)]
              hover:shadow-[0_6px_22px_rgba(14,165,233,0.44)]
              text-white px-5 py-5"
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

      </div>
    </section>
  );
}
