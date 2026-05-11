'use client';

import { useState } from 'react';
import ChoiceButton from './ChoiceButton';

/* ─────────────────────────────────────────────────────────────────────
   免許区分データ
   ・imageSrc: ローカル画像に差し替える場合は /images/driver/... のパスに変更してください
     (ファイルは public/images/driver/ に配置)
   ・現在は Wixstatic の URL を直接参照しています
───────────────────────────────────────────────────────────────────── */
interface LicenseChoice {
  value: string;
  label: string;
  subLabel?: string;
  imageSrc?: string;
}

const LICENSE_CHOICES: LicenseChoice[] = [
  {
    value: 'at-mt-normal',
    label: 'AT/MT普通',
    subLabel: '(H29/3以降)',
    imageSrc: 'https://static.wixstatic.com/media/5ebda9_1b40937d390f4c40bd3b01f9c487bec1~mv2.png',
  },
  {
    value: 'at-semi-mid-5t',
    label: 'AT準中型',
    subLabel: '(5t限定)',
    imageSrc: 'https://static.wixstatic.com/media/5ebda9_6177120472e6466c801931e292e20f3d~mv2.png',
  },
  {
    value: 'mt-semi-mid-5t',
    label: 'MT準中型',
    subLabel: '(5t限定)',
    imageSrc: 'https://static.wixstatic.com/media/5ebda9_b2cdfd4e1f0446a7809fba3eb8e10c8e~mv2.png',
  },
  {
    value: 'semi-mid',
    label: '準中型免許',
    imageSrc: 'https://static.wixstatic.com/media/5ebda9_cb8f0d0787b34430bbbdf18d0313561d~mv2.png',
  },
  {
    value: 'at-mid-8t',
    label: 'AT中型',
    subLabel: '(8t限定)',
    imageSrc: 'https://static.wixstatic.com/media/5ebda9_92dbd8da3a9c4f88be9f8561b4cdaa8e~mv2.png',
  },
  {
    value: 'mt-mid-8t',
    label: 'MT中型',
    subLabel: '(8t限定)',
    imageSrc: 'https://static.wixstatic.com/media/5ebda9_e41191b102a041a2a70ef914602699f4~mv2.png',
  },
  {
    value: 'mid',
    label: '中型免許',
    imageSrc: 'https://static.wixstatic.com/media/5ebda9_9c78e2426c274f158dbe958336166be8~mv2.png',
  },
  {
    value: 'large',
    label: '大型免許',
    imageSrc: 'https://static.wixstatic.com/media/5ebda9_e0bebf481ece4a009278382a9eff777f~mv2.png',
  },
];

interface LicenseQuestionProps {
  stepNumber: number;
  /**
   * 最終CTAから遷移するA8アフィリエイトURL。
   * app/driver/page.tsx の AFFILIATE_URL から渡されます。
   */
  affiliateUrl: string;
}

export default function LicenseQuestion({ stepNumber, affiliateUrl }: LicenseQuestionProps) {
  /* ── 複数選択の状態管理 ──
   * selected: 選択中の value の Set
   * toggle  : カードタップで追加 / 解除
   */
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (value: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }
      return next;
    });
  };

  const hasSelection = selected.size > 0;

  return (
    <section className="px-5 py-8 animate-fade-in">

      {/* 質問ヘッダー */}
      <div className="text-center mb-6">
        <p className="text-[10px] font-bold tracking-[0.2em] text-blue-500 uppercase mb-2">
          STEP {stepNumber} / 3
        </p>
        <h2 className="text-xl font-bold text-slate-800 leading-snug">
          どんな免許をお持ちですか？
        </h2>
        <p className="text-xs text-blue-500 font-semibold mt-1.5">複数選択可</p>
        <p className="mt-2 text-xs font-medium text-orange-500 bg-orange-50 inline-block px-3 py-1 rounded-full">
          選択後、求人情報ページへご案内します
        </p>
      </div>

      {/* ── 免許選択グリッド (2列固定) ──
           imageSrc の画像は ChoiceButton 内で
           h-[72px] コンテナ + max-h-[52px] + object-contain で自然に収まります。
           画像の差し替えは LICENSE_CHOICES の imageSrc を変えるだけです。
      */}
      <div className="grid grid-cols-2 gap-3">
        {LICENSE_CHOICES.map((c) => (
          <ChoiceButton
            key={c.value}
            label={c.label}
            subLabel={c.subLabel}
            imageSrc={c.imageSrc}
            cardLayout="card"
            selected={selected.has(c.value)}
            onClick={() => toggle(c.value)}
          />
        ))}
      </div>

      {/* ── 最終 CTA ──
           hasSelection=true のとき <a> タグ (rel="nofollow sponsored") として機能。
           未選択時はグレーアウトし操作不可。
           遷移先 URL: app/driver/page.tsx の AFFILIATE_URL → affiliateUrl プロップ経由。
      */}
      <div className="mt-6">
        {hasSelection ? (
          <a
            href={affiliateUrl}
            rel="nofollow sponsored"
            className="block w-full text-center rounded-2xl px-6 py-5
              text-white font-extrabold text-[17px] tracking-tight
              bg-gradient-to-br from-blue-600 to-blue-800
              hover:from-blue-500 hover:to-blue-700
              shadow-[0_6px_22px_rgba(29,78,216,0.38)]
              hover:shadow-[0_8px_28px_rgba(29,78,216,0.50)]
              transition-all duration-150 active:scale-[0.97]"
          >
            この条件で求人を確認する →
          </a>
        ) : (
          <div
            className="block w-full text-center rounded-2xl px-6 py-5
              text-slate-400 font-extrabold text-[17px] tracking-tight
              bg-slate-100 border-2 border-slate-200
              cursor-not-allowed select-none"
            aria-disabled="true"
          >
            この条件で求人を確認する →
          </div>
        )}

        {/* 選択数フィードバック */}
        <p className="text-center text-xs mt-2.5 min-h-[1.2em]">
          {hasSelection ? (
            <span className="text-blue-500 font-semibold">
              {selected.size}件選択中 — ボタンを押して確認
            </span>
          ) : (
            <span className="text-slate-400">
              ※ 免許を1つ以上選択してください
            </span>
          )}
        </p>
      </div>

    </section>
  );
}
