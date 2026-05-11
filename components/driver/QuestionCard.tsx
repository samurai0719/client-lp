'use client';

import ChoiceButton from './ChoiceButton';

export interface Choice {
  /** 選択肢のメインラベル */
  label: string;
  /** サブラベル (任意) */
  subLabel?: string;
  /**
   * 選択肢画像のパス (任意)。
   * 例: /images/driver/license-normal.png
   * 設定するだけで自動表示されます。未設定時はプレースホルダーを表示します。
   */
  imageSrc?: string;
}

interface QuestionCardProps {
  /** STEP 1〜3 内の番号 (StepHeader と同期) */
  stepNumber: number;
  question: string;
  choices: Choice[];
  /** 通常ステップ: 選択したら呼ばれる */
  onSelect?: (answer: string) => void;
  /** 最終ステップ: 選択時に遷移するアフィリエイトURL */
  affiliateUrl?: string;
  /**
   * 'grid' = 2列グリッド → ChoiceButton は縦型カード (cardLayout='card')
   * 'stack' = 縦1列    → ChoiceButton は横型リスト (cardLayout='list')
   */
  layout?: 'grid' | 'stack';
}

export default function QuestionCard({
  stepNumber,
  question,
  choices,
  onSelect,
  affiliateUrl,
  layout = 'grid',
}: QuestionCardProps) {
  const isFinal = Boolean(affiliateUrl);

  return (
    <section className="px-5 py-8 animate-fade-in">

      {/* 質問ヘッダー */}
      <div className="text-center mb-6">
        <p className="text-[10px] font-bold tracking-[0.2em] text-blue-500 uppercase mb-2">
          STEP {stepNumber} / 3
        </p>
        <h2 className="text-xl font-bold text-slate-800 leading-snug">{question}</h2>
        <p className="text-xs text-slate-400 mt-2">あてはまるものを選んでください</p>
        {isFinal && (
          <p className="mt-2 text-xs font-medium text-orange-500 bg-orange-50 inline-block px-3 py-1 rounded-full">
            選択後、求人情報ページへご案内します
          </p>
        )}
      </div>

      {/* ── 選択肢 ──
           layout='grid'  → 2列グリッド + 縦型カード (画像上 + テキスト下)
           layout='stack' → 縦1列      + 横型リスト (画像左 + テキスト右)
      */}
      {layout === 'stack' ? (
        <div className="flex flex-col gap-3">
          {choices.map((c) => (
            <ChoiceButton
              key={c.label}
              label={c.label}
              subLabel={c.subLabel}
              imageSrc={c.imageSrc}
              cardLayout="list"
              onClick={onSelect ? () => onSelect(c.label) : undefined}
              href={affiliateUrl}
            />
          ))}
        </div>
      ) : (
        /* 2列グリッド: 奇数個の最後は全幅 */
        <div className="grid grid-cols-2 gap-4">
          {choices.map((c, i) => (
            <ChoiceButton
              key={c.label}
              label={c.label}
              subLabel={c.subLabel}
              imageSrc={c.imageSrc}
              cardLayout="card"
              className={
                choices.length % 2 !== 0 && i === choices.length - 1 ? 'col-span-2' : ''
              }
              onClick={onSelect ? () => onSelect(c.label) : undefined}
              href={affiliateUrl}
            />
          ))}
        </div>
      )}
    </section>
  );
}
