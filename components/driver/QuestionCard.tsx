'use client';

import ChoiceButton from './ChoiceButton';

export interface Choice {
  /** 選択肢のメインラベル（回答として保存される値） */
  label: string;
  /** サブラベル (任意・表示のみ) */
  subLabel?: string;
  /**
   * 選択肢画像のパス (任意)。
   * 例: /images/driver/license-normal.png
   * 設定するだけで自動表示されます。未設定時はプレースホルダーを表示します。
   */
  imageSrc?: string;
}

/**
 * 1ステップ分の枠。上に「STEP n / 7」、中に質問（QuestionCard）を1〜2問並べる。
 */
export function StepSection({
  stepNumber,
  totalSteps,
  children,
}: {
  stepNumber: number;
  totalSteps: number;
  children: React.ReactNode;
}) {
  return (
    <section className="px-5 pt-6 pb-8">
      <p className="text-center text-[10px] font-bold tracking-[0.2em] text-blue-500 uppercase mb-4">
        STEP {stepNumber} / {totalSteps}
      </p>
      <div className="flex flex-col gap-9">{children}</div>
    </section>
  );
}

type QuestionCardProps = {
  /** ステップ内の質問番号（2問あるときだけ表示） */
  index?: number;
  question: string;
  /** 質問文の下の補足（省略時は単一/複数選択に合わせた案内） */
  hint?: string;
  choices: Choice[];
  /**
   * 'card' = 画像つき縦型カード（従来の見た目）
   * 'text' = 文字だけのカード（選択肢が多い質問用）
   */
  variant?: 'card' | 'text';
  /** 画像カードのとき、奇数個の最後を全幅にする（従来の見た目） */
  stretchLast?: boolean;
} & (
  | { mode?: 'single'; value: string; onSelect: (answer: string) => void }
  | { mode: 'multi'; values: string[]; onToggle: (answer: string) => void }
);

/**
 * 質問1問。単一選択は押すとすぐ onSelect（親が次へ進める）、複数選択は押すたびに onToggle。
 * どちらも選んだ回答は選択済みの見た目で残る（戻ってきたときに修正できる）。
 */
export default function QuestionCard(props: QuestionCardProps) {
  const { index, question, hint, choices, variant = 'text', stretchLast = true } = props;
  const isMulti = props.mode === 'multi';
  const isSelected = (label: string) => (isMulti ? props.values.includes(label) : props.value === label);
  const press = (label: string) => (isMulti ? props.onToggle(label) : props.onSelect(label));

  return (
    <div>
      {/* 質問ヘッダー */}
      <div className="text-center mb-4">
        {index !== undefined && (
          <p className="text-[10px] font-bold tracking-widest text-blue-400 mb-1">質問 {index}</p>
        )}
        <h2 className="text-lg font-bold text-slate-800 leading-snug">{question}</h2>
        <p className="text-xs text-slate-400 mt-1.5">
          {hint ?? (isMulti ? 'あてはまるものをすべて選んでください' : 'あてはまるものを選んでください')}
        </p>
      </div>

      {/* 選択肢: 2列グリッド。画像カードで奇数個のときは最後を全幅 */}
      <div className={`grid grid-cols-2 ${variant === 'card' ? 'gap-3' : 'gap-2.5'}`}>
        {choices.map((c, i) => (
          <ChoiceButton
            key={c.label}
            label={c.label}
            subLabel={c.subLabel}
            imageSrc={c.imageSrc}
            cardLayout={variant}
            selected={isSelected(c.label)}
            className={stretchLast && choices.length % 2 !== 0 && i === choices.length - 1 ? 'col-span-2' : ''}
            onClick={() => press(c.label)}
          />
        ))}
      </div>
    </div>
  );
}
