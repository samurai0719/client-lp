'use client';

interface ChoiceButtonProps {
  label: string;
  subLabel?: string;
  /**
   * 選択肢画像のパス / URL。
   * 未設定時はプレースホルダーを表示します。
   * 例: /images/driver/license-normal.png
   */
  imageSrc?: string;
  onClick?: () => void;
  /** A8等アフィリエイトリンクへ遷移する場合に指定 */
  href?: string;
  /**
   * 'card' = 縦型 (画像上 + テキスト下・中央寄せ) → グリッド2列に適している
   * 'list' = 横型 (画像左 + テキスト中 + 矢印右)   → スタック1列に適している
   */
  cardLayout?: 'card' | 'list';
  /** 複数選択モード用: true のとき選択済み状態の見た目になります */
  selected?: boolean;
  className?: string;
}

/** 画像未設定時プレースホルダー */
function PlaceholderIcon({ size }: { size: 'sm' | 'md' }) {
  const s = size === 'md' ? 26 : 20;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"
      className="text-blue-200" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="4"
        stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="8.5" r="1.8" fill="currentColor" />
      <path d="M2 16l5.5-5.5 4 4 3-3 7.5 5"
        stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** 選択済みバッジ (card layout 右上) */
function CheckBadge() {
  return (
    <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-blue-500
                    flex items-center justify-center shadow-sm z-10">
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export default function ChoiceButton({
  label,
  subLabel,
  imageSrc,
  onClick,
  href,
  cardLayout = 'list',
  selected = false,
  className = '',
}: ChoiceButtonProps) {

  /* ── ラッパースタイル ──
   * selected=false: 白bg → hover で青塗り反転
   * selected=true : 薄青bg + 青枠 → hover でも選択状態を維持
   */
  const baseWrapper = [
    'group relative w-full overflow-hidden rounded-xl border-2 shadow-sm',
    'transition-all duration-150 cursor-pointer select-none',
    selected
      ? 'bg-blue-50 border-blue-500 hover:bg-blue-100 hover:border-blue-600'
      : 'bg-white border-slate-200 hover:bg-blue-600 hover:border-blue-600 hover:shadow-md active:bg-blue-700 active:scale-[0.97]',
    className,
  ].join(' ');

  /* ── テキスト色 ── */
  const labelCls = selected
    ? 'block text-xs font-bold text-blue-700 leading-tight'
    : 'block text-xs font-bold text-slate-800 group-hover:text-white leading-tight transition-colors duration-150';

  const subLabelCls = selected
    ? 'block text-[10px] text-blue-500 mt-0.5 leading-snug'
    : 'block text-[10px] text-slate-500 group-hover:text-blue-100 mt-0.5 leading-snug transition-colors duration-150';

  const arrowCls = selected
    ? 'text-sm text-blue-400 shrink-0 leading-none'
    : 'text-sm text-slate-300 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-150 shrink-0 leading-none';

  /* ────────────────────────────────────────────────────
     縦型カード (cardLayout='card')
     ┌──────────────────────┐
     │  ✓ (選択中右上)       │
     │  ┌──────────────┐    │
     │  │  [  img  ]   │    │  ← 固定高さ, object-contain, 中央寄せ
     │  └──────────────┘    │
     │   label              │  ← 中央寄せ
     │   subLabel           │
     └──────────────────────┘

     ポイント:
     ・画像コンテナに h-[72px] を固定し、内側に p-2 で余白
     ・img に max-h-full / max-w-full + object-contain でリサイズなく収める
     ・テキストを text-center で統一
  ──────────────────────────────────────────────────── */
  const CardInner = () => (
    <div className="flex flex-col h-full">
      {selected && <CheckBadge />}

      {/* 画像エリア: 高さ固定 + 中央寄せ + object-contain */}
      <div className="w-full h-[72px] flex items-center justify-center p-2
                      border-b border-slate-100/80 bg-white">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={label}
            className="max-h-full max-w-full object-contain"
            style={{ maxHeight: '52px' }}
          />
        ) : (
          /* プレースホルダー: imageSrc を渡すと自動で差し替わります */
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-50 to-slate-50
                          border border-blue-100/80 flex items-center justify-center">
            <PlaceholderIcon size="md" />
          </div>
        )}
      </div>

      {/* テキストエリア: 中央寄せ */}
      <div className="flex-1 flex flex-col items-center justify-center px-2 py-2 text-center">
        <span className={labelCls}>{label}</span>
        {subLabel && <span className={subLabelCls}>{subLabel}</span>}
      </div>
    </div>
  );

  /* ────────────────────────────────────────────────────
     横型リスト (cardLayout='list')
     ┌────────────────────────────────────────┐
     │ [img/ph]  label / subLabel        ›   │
     └────────────────────────────────────────┘
  ──────────────────────────────────────────── */
  const ListInner = () => (
    <div className="flex items-center gap-3 px-4 py-4">
      {/* 画像エリア (左): 固定サイズ + object-contain */}
      <div className="w-14 h-14 shrink-0 rounded-lg border border-blue-100/80
                      flex items-center justify-center bg-white p-1">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={label}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <PlaceholderIcon size="sm" />
        )}
      </div>

      <div className="flex-1 text-left">
        <span className={labelCls}>{label}</span>
        {subLabel && <span className={subLabelCls}>{subLabel}</span>}
      </div>
      <span className={arrowCls}>›</span>
    </div>
  );

  const inner = cardLayout === 'card' ? <CardInner /> : <ListInner />;

  if (href) {
    return (
      <a href={href} rel="nofollow sponsored" className={baseWrapper}>
        {inner}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={baseWrapper}>
      {inner}
    </button>
  );
}
