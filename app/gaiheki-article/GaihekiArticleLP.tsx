'use client';

import { useState, useEffect, useRef, type ReactNode } from 'react';
import {
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Shield,
  FileText,
  Star,
  Droplets,
  Sun,
  Home,
  Search,
  Camera,
} from 'lucide-react';

// ─── CTAリンク先 — ここを変えるだけで全CTAが差し替わる ─────────────────────
const DESTINATION_LP_URL = '/gaiheki';

// ─── ファーストビュー画像 — PC/スマホを個別に差し替え可能 ───────────────────
const HERO_IMG_DESKTOP = 'https://static.wixstatic.com/media/5ebda9_7e6c91edccdd4a78bb86a0a1b573fcb6~mv2.png';
const HERO_IMG_MOBILE  = 'https://static.wixstatic.com/media/5ebda9_6241eb02d83749be949dec2810da37ec~mv2.png';

const BEFORE_IMG = 'https://static.wixstatic.com/media/5ebda9_c94aba7955a84b01b6e6cda114ec6d9a~mv2.png';
const AFTER_IMG  = 'https://static.wixstatic.com/media/5ebda9_06c8eaff4d3b45fcb0f524ab67c50ec0~mv2.png';
const LOGO_IMG   = 'https://static.wixstatic.com/media/5ebda9_759ae5aecbce476d806bbc03c12629a0~mv2.png';

// ─── スクロールフェードアップ (globals.css の section-fade / in-view を使用) ──
function useFadeUp() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const show = () => el.classList.add('in-view');
    // 既にビューポート内にある要素は即座に表示（タイトル等ページ上部の要素向け）
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      show();
      return () => {};
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show();
          observer.unobserve(el);
        }
      },
      { threshold: 0.07 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function FadeUp({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useFadeUp();
  return (
    <div
      ref={ref}
      className={`section-fade ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ─── 画像プレースホルダー ────────────────────────────────────────────────────
function ImgPlaceholder({
  aspect = '4/3',
  label = '画像エリア',
  className = '',
}: {
  aspect?: string;
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl ${className}`}
      style={{ aspectRatio: aspect }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #e4ecf6 0%, #d8e6f2 45%, #dde8f4 100%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(100,130,180,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(100,130,180,0.09) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm"
          style={{
            backgroundColor: 'rgba(255,255,255,0.88)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          <Camera className="w-6 h-6 text-[#8a8f9a]" />
        </div>
        <span
          className="text-xs font-medium tracking-wide px-3 py-1 rounded-full"
          style={{ backgroundColor: 'rgba(255,255,255,0.72)', color: '#94a3b8' }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

// ─── セクションラベル（英文ラベル — .sec-title .en パターン）────────────────
function Label({ children, center = true }: { children: ReactNode; center?: boolean }) {
  return (
    <div className={`flex ${center ? 'justify-center' : ''} mb-3`}>
      <span className={center ? 'gaiheki-sec-en' : 'gaiheki-sec-en-left'}>
        {children}
      </span>
    </div>
  );
}

// ─── セクション見出し（Shippori Mincho B1 + h-markアンダーライン）──────────
function H2({
  children,
  light = false,
  center = false,
}: {
  children: ReactNode;
  light?: boolean;
  center?: boolean;
}) {
  return (
    <h2
      className={`gaiheki-font-mincho text-balance break-keep text-[1.65rem] sm:text-[1.9rem] leading-snug ${center ? 'text-center' : ''}`}
      style={{
        color: light ? '#ffffff' : '#28292a',
        fontWeight: 500,
        letterSpacing: '0.12em',
      }}
    >
      {children}
    </h2>
  );
}

// ─── オレンジCTAボタン（globals.css の gaiheki-cta-btn を再利用）────────────
function CtaPrimary({ label, sub }: { label: string; sub?: string }) {
  return (
    <a href={DESTINATION_LP_URL} className="gaiheki-cta-btn">
      <span className="gaiheki-cta-shine" aria-hidden />
      <span className="gaiheki-cta-btn-inner">
        <span className="text-[15px] leading-snug">{label}</span>
        {sub && <span className="text-xs font-normal opacity-80 mt-0.5">{sub}</span>}
      </span>
    </a>
  );
}

// ─── テキストリンクCTA ───────────────────────────────────────────────────────
function CtaLink({ label, light = false }: { label: string; light?: boolean }) {
  return (
    <a
      href={DESTINATION_LP_URL}
      className="inline-flex items-center gap-1.5 text-sm font-semibold transition-opacity duration-150 hover:opacity-60 cursor-pointer"
      style={{
        color: light ? '#93c5fd' : '#1a3a6b',
        textDecoration: 'underline',
        textUnderlineOffset: '3px',
      }}
    >
      {label}
      <ArrowRight className="w-3.5 h-3.5" />
    </a>
  );
}

// ─── FAQ アコーディオン（デザイン仕様準拠）──────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid #ece6dc' }}>
      <button
        className="w-full flex items-start justify-between gap-3 py-[18px] text-left cursor-pointer bg-transparent border-0"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {/* Q マーク — Manrope風、オレンジ、背景なし */}
        <span
          className="shrink-0 text-[20px] font-black leading-[1.4]"
          style={{ color: '#e96a1f', fontFamily: '"Manrope", system-ui, sans-serif', letterSpacing: '-0.01em' }}
          aria-hidden
        >
          Q
        </span>
        <span className="flex-1 text-sm font-bold leading-snug text-left" style={{ color: '#28292a', lineHeight: 1.6 }}>
          {q}
        </span>
        {/* 円形シェブロン */}
        <span
          className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            border: open ? 'none' : '1.5px solid #d8cebd',
            background: open ? '#e96a1f' : 'transparent',
            color: open ? '#fff' : '#5a5f6c',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
          aria-hidden
        >
          <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="2 4 6 8 10 4" />
          </svg>
        </span>
      </button>
      {/* グリッドアニメーションで展開 */}
      <div
        style={{
          display: 'grid',
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.28s ease',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <p
            className="text-sm leading-relaxed"
            style={{
              color: '#5a5f6c',
              lineHeight: 1.9,
              padding: open ? '0 0 20px 32px' : '0 0 0 32px',
            }}
          >
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── ビフォーアフタースライダー ──────────────────────────────────────────────
function BeforeAfterSlider({ beforeImg, afterImg }: { beforeImg: string; afterImg: string }) {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const calcPos = (clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const { left, width } = el.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - left) / width) * 100)));
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => { if (isDragging.current) calcPos(e.clientX); };
    const onUp = () => { isDragging.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-3xl select-none shadow-xl"
      style={{ aspectRatio: '16/10', cursor: 'col-resize', touchAction: 'none' }}
      onMouseDown={(e) => { isDragging.current = true; calcPos(e.clientX); e.preventDefault(); }}
      onTouchMove={(e) => calcPos(e.touches[0].clientX)}
      onTouchStart={(e) => calcPos(e.touches[0].clientX)}
    >
      {/* アフター画像（ベース） */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={afterImg} alt="施工後（アフター）" className="absolute inset-0 w-full h-full object-cover pointer-events-none" draggable={false} />
      {/* ビフォー画像（クリップ） */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={beforeImg}
        alt="施工前（ビフォー）"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        draggable={false}
      />
      {/* ラベル */}
      <span
        className="absolute top-3 left-3 z-10 text-white text-xs font-black px-3 py-1 rounded-full"
        style={{ background: 'rgba(10,22,40,0.70)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
      >
        BEFORE
      </span>
      <span
        className="absolute top-3 right-3 z-10 text-white text-xs font-black px-3 py-1 rounded-full"
        style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
      >
        AFTER
      </span>
      {/* 仕切り線 */}
      <div
        className="absolute inset-y-0 z-10 w-0.5 bg-white"
        style={{ left: `${pos}%`, transform: 'translateX(-50%)', boxShadow: '0 0 8px rgba(0,0,0,0.35)' }}
      />
      {/* ハンドル */}
      <div
        className="absolute z-20 top-1/2 w-11 h-11 rounded-full bg-white flex items-center justify-center"
        style={{
          left: `${pos}%`,
          transform: 'translateX(-50%) translateY(-50%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.28)',
          border: '3px solid white',
        }}
      >
        <svg viewBox="0 0 32 16" width="30" height="15" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <polyline points="10 1 4 8 10 15" />
          <polyline points="22 1 28 8 22 15" />
        </svg>
      </div>
      {/* 操作ヒント（初期表示） */}
      <div
        className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 text-white text-[11px] font-medium px-3 py-1 rounded-full whitespace-nowrap"
        style={{ background: 'rgba(10,22,40,0.55)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
      >
        スライドして比較
      </div>
    </div>
  );
}

// ─── 装飾用 inline SVG（背景の有機的シェイプ＋資格・職人イラスト群） ──────────
// 配色: ネイビー #1E3A5F / オレンジ #F97316 / 薄ブルー #EAF5FF / 薄オレンジ #FFF3E8 / 薄グレー #F8FAFC / 白
const SVG_NAVY = '#1E3A5F';
const SVG_ORANGE = '#F97316';
const SVG_BLUE_BG = '#EAF5FF';
const SVG_BEIGE_BG = '#FFF3E8';
const SVG_GRAY_BG = '#F8FAFC';
const SVG_WHITE = '#FFFFFF';

// セクション背景に敷く大きな波形（淡い色を重ねた柔らかいレイヤー）
function SoftWaveBg({
  className = 'w-full h-auto',
  tone = 'light',
}: {
  className?: string;
  tone?: 'light' | 'navy';
}) {
  if (tone === 'navy') {
    return (
      <svg className={className} viewBox="0 0 800 400" fill="none" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 120C140 50 240 95 380 120C530 147 620 60 800 100V400H0V120Z" fill={SVG_WHITE} opacity="0.05" />
        <path d="M0 190C150 130 260 175 400 145C550 113 660 168 800 120V400H0V190Z" fill={SVG_ORANGE} opacity="0.10" />
        <path d="M30 260C170 210 300 275 450 225C580 182 690 200 770 175" stroke={SVG_WHITE} strokeWidth="3" strokeLinecap="round" opacity="0.16" />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 800 500" fill="none" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 120C120 40 220 80 340 110C480 145 560 40 800 90V500H0V120Z" fill={SVG_BLUE_BG} opacity="0.75" />
      <path d="M0 210C130 140 250 190 390 160C540 128 640 190 800 130V500H0V210Z" fill={SVG_BEIGE_BG} opacity="0.8" />
      <path d="M40 310C180 250 300 330 450 270C570 220 680 240 760 210" stroke={SVG_WHITE} strokeWidth="8" strokeLinecap="round" opacity="0.9" />
    </svg>
  );
}

// セクション角に添える柔らかいblob形状（低opacityで背景の邪魔をしない）
function OrganicBlob({
  className = 'w-64 h-64',
  color = SVG_BLUE_BG,
  opacity = 0.5,
}: {
  className?: string;
  color?: string;
  opacity?: number;
}) {
  return (
    <svg className={className} viewBox="0 0 400 400" fill="none" aria-hidden="true">
      <path
        d="M200 40C260 35 330 70 355 130C380 190 365 265 310 310C255 355 175 365 120 330C65 295 35 225 45 160C55 95 140 45 200 40Z"
        fill={color}
        opacity={opacity}
      />
    </svg>
  );
}

// ファーストビュー: 資格バッジ（メダル＋リボン＋チェック）
function CertificationBadgeSvg({ className = 'w-16 h-16' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 160 160" fill="none" aria-hidden="true">
      <circle cx="80" cy="70" r="46" fill={SVG_BEIGE_BG} />
      <circle cx="80" cy="70" r="34" fill="none" stroke={SVG_NAVY} strokeWidth="5" />
      <path d="M64 70L75 81L98 56" fill="none" stroke={SVG_ORANGE} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M62 110L52 146L80 130L108 146L98 110" fill={SVG_BLUE_BG} stroke={SVG_NAVY} strokeWidth="4" strokeLinejoin="round" />
    </svg>
  );
}

// 悩みセクション: 家＋クエスチョン＋見積書＋虫眼鏡
function InspectionHouseSvg({ className = 'w-16 h-16' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 220 180" fill="none" aria-hidden="true">
      <path d="M20 86L86 30L152 86" stroke={SVG_NAVY} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M38 82V148H134V82" fill={SVG_WHITE} stroke={SVG_NAVY} strokeWidth="7" strokeLinejoin="round" />
      <path d="M70 148V112H102V148" fill={SVG_BLUE_BG} stroke={SVG_NAVY} strokeWidth="6" strokeLinejoin="round" />
      <path d="M68 50c0 -9 7 -15 14 -15c8 0 14 5.5 14 12.5c0 7 -5.5 9.5 -9.5 12.5c-3 2.2 -4.5 5 -4.5 8.5" fill="none" stroke={SVG_ORANGE} strokeWidth="6" strokeLinecap="round" />
      <circle cx="82" cy="86" r="3.6" fill={SVG_ORANGE} />
      <circle cx="168" cy="120" r="26" fill={SVG_BEIGE_BG} stroke={SVG_NAVY} strokeWidth="7" />
      <line x1="187" y1="139" x2="206" y2="158" stroke={SVG_NAVY} strokeWidth="8" strokeLinecap="round" />
      <rect x="156" y="106" width="24" height="28" rx="2" fill={SVG_WHITE} stroke={SVG_ORANGE} strokeWidth="3" />
      <line x1="161" y1="114" x2="175" y2="114" stroke={SVG_ORANGE} strokeWidth="2.4" strokeLinecap="round" />
      <line x1="161" y1="121" x2="175" y2="121" stroke={SVG_ORANGE} strokeWidth="2.4" strokeLinecap="round" />
      <line x1="161" y1="128" x2="171" y2="128" stroke={SVG_ORANGE} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

// 解決セクション: 家＋盾＋チェック＋職人ヘルメット
function CraftsmanShieldSvg({ className = 'w-16 h-16' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 220 180" fill="none" aria-hidden="true">
      <path d="M14 78L62 40L110 78" stroke={SVG_NAVY} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="34" y="76" width="56" height="50" fill={SVG_BLUE_BG} stroke={SVG_NAVY} strokeWidth="7" strokeLinejoin="round" />
      <path d="M150 22L196 38V78C196 108 174 126 150 138C126 126 104 108 104 78V38Z" fill={SVG_BEIGE_BG} stroke={SVG_ORANGE} strokeWidth="7" strokeLinejoin="round" />
      <path d="M128 80L144 98L176 58" fill="none" stroke={SVG_ORANGE} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M40 158a22 18 0 0 1 44 0Z" fill={SVG_NAVY} />
      <rect x="34" y="156" width="56" height="8" rx="4" fill={SVG_NAVY} />
    </svg>
  );
}

// 劣化サインセクション: ひび割れた壁＋虫眼鏡＋チェック（写真が主役のため控えめに使用）
function CrackInspectionSvg({ className = 'w-16 h-16' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 220 180" fill="none" aria-hidden="true">
      <rect x="14" y="20" width="130" height="110" rx="6" fill={SVG_GRAY_BG} stroke={SVG_NAVY} strokeWidth="5" />
      <line x1="14" y1="55" x2="144" y2="55" stroke={SVG_NAVY} strokeWidth="2" opacity="0.25" />
      <line x1="14" y1="90" x2="144" y2="90" stroke={SVG_NAVY} strokeWidth="2" opacity="0.25" />
      <path d="M38 20L56 55L40 80L62 110L50 130" fill="none" stroke={SVG_ORANGE} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="156" cy="118" r="34" fill={SVG_BLUE_BG} stroke={SVG_NAVY} strokeWidth="7" />
      <path d="M142 118L153 129L174 102" fill="none" stroke={SVG_ORANGE} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="180" y1="142" x2="204" y2="166" stroke={SVG_NAVY} strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}

// 信頼できる特徴セクション: 資格証＋リボン＋チェックリスト
function TrustFeatureSvg({ className = 'w-16 h-16' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 220 180" fill="none" aria-hidden="true">
      <rect x="16" y="14" width="92" height="120" rx="6" fill={SVG_BLUE_BG} stroke={SVG_NAVY} strokeWidth="6" />
      <line x1="32" y1="34" x2="92" y2="34" stroke={SVG_NAVY} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      <line x1="32" y1="46" x2="92" y2="46" stroke={SVG_NAVY} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      <circle cx="62" cy="84" r="22" fill={SVG_BEIGE_BG} stroke={SVG_ORANGE} strokeWidth="5" />
      <path d="M62 70L70 84L62 98L54 84Z" fill={SVG_ORANGE} />
      <path d="M48 134L40 162L62 150L84 162L76 134" fill={SVG_BEIGE_BG} stroke={SVG_ORANGE} strokeWidth="4" strokeLinejoin="round" />
      <rect x="124" y="40" width="84" height="92" rx="6" fill={SVG_WHITE} stroke={SVG_NAVY} strokeWidth="6" />
      <path d="M138 64l6 6 12 -14" fill="none" stroke={SVG_ORANGE} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="164" y1="64" x2="196" y2="64" stroke={SVG_NAVY} strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      <path d="M138 92l6 6 12 -14" fill="none" stroke={SVG_ORANGE} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="164" y1="92" x2="196" y2="92" stroke={SVG_NAVY} strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      <path d="M138 112l6 6 12 -14" fill="none" stroke={SVG_ORANGE} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="164" y1="112" x2="188" y2="112" stroke={SVG_NAVY} strokeWidth="3" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

// 費用セクション: 見積書＋電卓＋チェック
function EstimateDocumentSvg({ className = 'w-16 h-16' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 220 180" fill="none" aria-hidden="true">
      <rect x="20" y="16" width="78" height="108" rx="3" fill={SVG_WHITE} stroke={SVG_NAVY} strokeWidth="6" />
      <line x1="34" y1="38" x2="84" y2="38" stroke={SVG_NAVY} strokeWidth="4" strokeLinecap="round" opacity="0.55" />
      <line x1="34" y1="54" x2="84" y2="54" stroke={SVG_NAVY} strokeWidth="4" strokeLinecap="round" opacity="0.55" />
      <line x1="34" y1="70" x2="70" y2="70" stroke={SVG_NAVY} strokeWidth="4" strokeLinecap="round" opacity="0.55" />
      <path d="M30 100l8 -10 9 6 7 -9 9 12" fill="none" stroke={SVG_ORANGE} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="118" y="58" width="76" height="92" rx="8" fill={SVG_BLUE_BG} stroke={SVG_NAVY} strokeWidth="6" />
      <g stroke={SVG_NAVY} strokeWidth="3.6" strokeLinecap="round" opacity="0.7">
        <line x1="138" y1="78" x2="150" y2="94" />
        <line x1="162" y1="78" x2="150" y2="94" />
        <line x1="150" y1="94" x2="150" y2="110" />
        <line x1="142" y1="98" x2="158" y2="98" />
        <line x1="142" y1="104" x2="158" y2="104" />
      </g>
      <circle cx="186" cy="130" r="22" fill={SVG_ORANGE} />
      <path d="M176 130l7 7 14 -16" fill="none" stroke={SVG_WHITE} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 費用カードの背景ウォーターマーク: ペイント缶＋筆
function PaintCanLineSvg({ className = 'w-16 h-16' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 160 160" fill="none" aria-hidden="true">
      <path d="M46 64L114 64L106 138a8 8 0 0 1 -8 7H62a8 8 0 0 1 -8 -7Z" fill={SVG_BLUE_BG} stroke={SVG_NAVY} strokeWidth="6" strokeLinejoin="round" />
      <path d="M40 64C40 52 58 44 80 44C102 44 120 52 120 64" fill="none" stroke={SVG_NAVY} strokeWidth="6" strokeLinecap="round" />
      <path d="M64 44L70 20L98 20L96 44" fill="none" stroke={SVG_ORANGE} strokeWidth="5" strokeLinejoin="round" />
      <line x1="58" y1="88" x2="102" y2="88" stroke={SVG_ORANGE} strokeWidth="5" strokeLinecap="round" opacity="0.6" />
      <line x1="58" y1="108" x2="96" y2="108" stroke={SVG_ORANGE} strokeWidth="5" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

// 費用カードの背景ウォーターマーク: 円マーク＋チェック
function YenCoinCheckSvg({ className = 'w-16 h-16' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 160 160" fill="none" aria-hidden="true">
      <circle cx="68" cy="76" r="48" fill={SVG_BEIGE_BG} stroke={SVG_NAVY} strokeWidth="6" />
      <g stroke={SVG_NAVY} strokeWidth="5" strokeLinecap="round">
        <line x1="50" y1="54" x2="68" y2="78" />
        <line x1="86" y1="54" x2="68" y2="78" />
        <line x1="68" y1="78" x2="68" y2="100" />
        <line x1="54" y1="84" x2="82" y2="84" />
        <line x1="54" y1="92" x2="82" y2="92" />
      </g>
      <circle cx="118" cy="112" r="24" fill={SVG_ORANGE} />
      <path d="M107 112L115 120L130 102" fill="none" stroke={SVG_WHITE} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// CTAボタン横の小さな矢印アクセント
function ArrowNudgeSvg({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 60 60" fill="none" aria-hidden="true">
      <path d="M8 40C20 44 36 38 50 18" stroke={SVG_ORANGE} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.8" />
      <path d="M38 14L51 17L47 30" fill="none" stroke={SVG_ORANGE} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
    </svg>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// メインコンポーネント
// ════════════════════════════════════════════════════════════════════════════
export default function GaihekiArticleLP() {
  return (
    <div className="gaiheki-article-lp min-h-dvh bg-white antialiased overflow-x-hidden" style={{ color: '#28292a' }}>
      {/* Shippori Mincho B1 + Manrope フォント — React 19 link hoisting */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Shippori+Mincho+B1:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap"
        rel="stylesheet"
      />

      {/* ── ヘッダー ────────────────────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          backgroundColor: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(226,232,240,0.6)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LOGO_IMG}
              alt="Paint Net"
              className="w-[135px] sm:w-[165px] h-auto object-contain"
              loading="eager"
            />
          </div>
          <a
            href={DESTINATION_LP_URL}
            className="text-sm font-bold text-white px-5 py-2.5 rounded-xl cursor-pointer transition-all duration-150 hover:opacity-90 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              boxShadow: '0 2px 12px rgba(234,88,12,0.35)',
            }}
          >
            無料で相談する →
          </a>
        </div>
      </header>

      {/* ── 1. ファーストビュー — 画像のみ ─────────────────────────────── */}
      <section className="pt-16 sm:pt-20">
        {/* デスクトップ画像 (lg = 1024px 以上) */}
        <img
          src={HERO_IMG_DESKTOP}
          alt="外壁塗装のプロが施工するきれいな外壁イメージ"
          className="hidden lg:block w-full h-auto"
          loading="eager"
        />
        {/* モバイル・タブレット画像 (lg 未満 = スマホ・タブレット) */}
        <img
          src={HERO_IMG_MOBILE}
          alt="外壁塗装のプロが施工するきれいな外壁イメージ"
          className="block lg:hidden w-full h-auto"
          loading="eager"
        />
      </section>

      {/* ── 1-A. ファーストビュー直下: 新コンセプトの見出し ───────────────── */}
      <section className="relative bg-white pt-10 pb-16 sm:pt-14 sm:pb-24 overflow-hidden">
        <SoftWaveBg className="absolute inset-x-0 top-0 w-full h-auto pointer-events-none" />
        <OrganicBlob
          className="absolute -top-16 -right-20 w-64 h-64 sm:w-96 sm:h-96 pointer-events-none"
          color={SVG_BLUE_BG}
          opacity={0.6}
        />
        <OrganicBlob
          className="absolute -bottom-24 -left-16 w-56 h-56 sm:w-80 sm:h-80 pointer-events-none"
          color={SVG_BEIGE_BG}
          opacity={0.65}
        />
        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <FadeUp>
            <span
              className="inline-flex items-center gap-2 text-xs font-bold tracking-wide px-4 py-1.5 rounded-full mb-5"
              style={{ background: 'rgba(255,255,255,0.8)', color: SVG_NAVY, border: '1px solid #c8d8ec' }}
            >
              <CertificationBadgeSvg className="w-4 h-4 shrink-0" />
              国家資格「一級塗装技能士」だけを厳選紹介
            </span>
            <h1 className="gaiheki-font-mincho text-balance break-keep text-[1.55rem] sm:text-[2.1rem] leading-snug tracking-wide" style={{ color: '#28292a', fontWeight: 600 }}>
              一級塗装技能士だけを、厳選紹介。
              <br />
              価格だけで選ばない、品質重視の外壁塗装。
            </h1>
            <p className="mt-5 text-sm sm:text-base text-[#5a5f6c] leading-relaxed text-balance break-keep">
              外壁塗装は、誰に任せるかで仕上がりが変わります。
              <br className="md:hidden" />
              Paint Netでは、一級塗装技能士を持つ職人・業者を中心に、
              <br className="md:hidden" />
              品質を重視した外壁塗装をご案内します。
            </p>
            <div className="mt-8 flex justify-center">
              <div style={{ minWidth: '240px', width: '100%', maxWidth: '320px' }}>
                <CtaPrimary label="一級塗装技能士に相談する" sub="登録不要・完全無料" />
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── 2. ペイントネットの強み ──────────────────────────────────────── */}
      <section
        className="relative py-14 sm:py-24"
        style={{
          backgroundImage: 'url(https://static.wixstatic.com/media/5ebda9_d91c62c59e6c4bc6aef3cb0848c36058~mv2.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* 文字を読みやすくする薄い白オーバーレイ */}
        <div className="absolute inset-0 bg-white/70 pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">

          <div className="text-center mb-8">
            {/* ロゴ画像 ＋ "の強み" — 横一行 */}
            <div className="flex flex-row items-center justify-center gap-3 sm:gap-4 mb-4 flex-nowrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={LOGO_IMG}
                alt="Paint Net"
                className="w-[140px] sm:w-[195px] h-auto object-contain shrink-0"
              />
              <p
                className="gaiheki-font-mincho text-2xl sm:text-3xl whitespace-nowrap"
                style={{ color: '#28292a', fontWeight: 600, letterSpacing: '0.1em' }}
              >
                の強み
              </p>
            </div>
            <p className="text-sm sm:text-base text-[#5a5f6c] max-w-md mx-auto leading-relaxed">
              国家資格である一級塗装技能士を持つ職人・業者を厳選してご紹介する、Paint Netならではのポイントをご紹介します。
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
            {[
              {
                n: '01',
                icon: Home,
                title: '地域密着で、一級塗装技能士に相談がしやすい',
                desc: '岐阜・愛知・三重エリアに精通した地域密着型のサポートで、資格を持つ職人に気軽にご相談いただける環境を整えています。',
              },
              {
                n: '02',
                icon: Star,
                title: '一級塗装技能士を持つ職人だけをご紹介',
                desc: '国家資格である一級塗装技能士を保有し、技術力に実績のある職人・業者だけを厳選してご紹介します。安心して工事をお任せいただけます。',
              },
              {
                n: '03',
                icon: Search,
                title: '外壁の状態に合わせて、必要な工事だけを提案',
                desc: '過剰な工事を勧めず、実際の外壁の状態を診断した上で本当に必要な施工内容だけをご提案します。',
              },
              {
                n: '04',
                icon: Shield,
                title: '屋根なし・外壁のみなど、希望に合わせた相談が可能',
                desc: '「外壁だけ塗り替えたい」「屋根は後回しで」など、ご予算や状況に合わせて柔軟に対応します。',
              },
              {
                n: '05',
                icon: CheckCircle,
                title: '見積もりから施工後まで、安心して相談できる体制',
                desc: '見積もり・工事中・完了後のアフターフォローまで、一貫して相談できる窓口をご用意しています。',
              },
            ].map(({ n, icon: Icon, title, desc }, i) => (
              <FadeUp key={n} delay={i * 70} className={n === '05' ? 'sm:col-span-2' : ''}>
                <div
                  className="relative overflow-hidden rounded-lg p-5 sm:p-6 border hover:border-orange-200 hover:shadow-md transition-all duration-200 h-full"
                  style={{
                    borderColor: '#d8cebd',
                    backgroundColor: '#fff',
                    boxShadow: '0 1px 1px rgba(28,29,32,.03), 0 6px 18px -14px rgba(28,29,32,.18)',
                  }}
                >
                  <span
                    className="absolute -top-3 -right-1 text-8xl font-black opacity-[0.04] tabular-nums leading-none select-none pointer-events-none"
                    style={{ fontFamily: '"Manrope", system-ui, sans-serif', color: '#e96a1f' }}
                  >
                    {n}
                  </span>
                  <div className="flex items-start gap-4">
                    <div
                      className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center shadow-sm"
                      style={{ background: 'linear-gradient(135deg, #e96a1f 0%, #c9501a 100%)' }}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold leading-snug mb-1.5" style={{ color: '#28292a' }}>{title}</p>
                      <p className="text-xs leading-relaxed" style={{ color: '#5a5f6c' }}>{desc}</p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. よくある失敗 ──────────────────────────────────────────────── */}
      <section
        className="relative py-14 sm:py-20"
        style={{
          backgroundImage: 'url(https://static.wixstatic.com/media/5ebda9_b84350cba9754741ba1ad76461c6d345~mv2.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-white/65 pointer-events-none" />
        <OrganicBlob
          className="absolute -bottom-10 -right-10 w-56 h-56 sm:w-72 sm:h-72 pointer-events-none"
          color={SVG_BEIGE_BG}
          opacity={0.35}
        />
        <InspectionHouseSvg className="hidden lg:block absolute -top-10 -left-10 w-40 h-40 opacity-[0.14] pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">

          {/* セクションタイトル画像「こんなお悩みありませんか？」 */}
          <div className="flex justify-center mb-8 px-2 sm:px-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://static.wixstatic.com/media/5ebda9_031e9f734b9142f6add320141ab4faf4~mv2.png"
              alt="こんなお悩みありませんか？"
              className="w-full max-w-[900px] sm:max-w-[1000px] h-auto object-contain"
              loading="lazy"
            />
          </div>

          {/* チェックリスト */}
          <div className="max-w-2xl mx-auto space-y-3">
            {[
              '安さだけで選んで、手抜き工事にならないか不安',
              'どの業者の技術力が高いのか分からない',
              '見積もりの金額だけで比較していいか迷っている',
              '職人さんの腕や資格まで確認できない',
              '信頼できる職人に直接相談したい',
            ].map((text, i) => (
              <FadeUp key={i} delay={i * 60}>
                <div
                  className="flex items-center gap-4 rounded-lg px-5 py-4 border"
                  style={{
                    background: '#fbf8f4',
                    borderColor: '#d8cebd',
                    boxShadow: '0 1px 1px rgba(28,29,32,.03), 0 6px 18px -14px rgba(28,29,32,.18)',
                  }}
                >
                  {/* オレンジチェックアイコン */}
                  <div
                    className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
                  >
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <p className="text-sm sm:text-base font-semibold leading-snug" style={{ color: '#28292a' }}>
                    {text}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. 解決できる内容（旧:相見積もり） ──────────────────────────── */}
      <section
        className="relative py-16 sm:py-24"
        style={{
          backgroundImage: 'url(https://static.wixstatic.com/media/5ebda9_abbfd76b5340448896ea7e32f0329150~mv2.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-white/60 pointer-events-none" />
        <OrganicBlob
          className="absolute -top-12 -left-12 w-60 h-60 sm:w-80 sm:h-80 pointer-events-none"
          color={SVG_BLUE_BG}
          opacity={0.4}
        />
        <CraftsmanShieldSvg className="hidden lg:block absolute -bottom-10 -right-10 w-44 h-44 opacity-[0.14] pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">

          {/* セクション3タイトル画像 */}
          <div className="flex justify-center mb-8 px-2 sm:px-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://static.wixstatic.com/media/5ebda9_ad58c00f70f54482b0873d887206257b~mv2.png"
              alt="そんなお悩み、ペイントネットなら解決できます"
              className="w-full max-w-[900px] sm:max-w-[1000px] h-auto object-contain"
              loading="lazy"
            />
          </div>

          <FadeUp>
            <div className="text-center mb-10">
              <H2 center>
                <span>一級塗装技能士を持つ職人だから、</span>
                <br className="md:hidden" />
                <span>品質面でも相談しやすい</span>
              </H2>
              <p className="mt-4 text-sm sm:text-base text-[#5a5f6c] max-w-lg mx-auto leading-relaxed">
                Paint Netでは、外壁塗装の品質を重視したい方に向けて、一級塗装技能士を持つ職人・業者を中心にご紹介しています。
                価格だけでなく、技術力・説明の丁寧さ・施工後の安心感まで考えて選びたい方に向いています。
              </p>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: '一級塗装技能士を持つ職人だけをご紹介',
                body: '国家資格である一級塗装技能士の職人や、外壁塗装歴10年以上のベテラン職人など、技術力と実績を厳選してご紹介します。',
                // ▼ 画像を差し替える場合: src を変更してください
                imgSrc: 'https://static.wixstatic.com/media/5ebda9_24f40d7d07e34c6bae724890486dc288~mv2.png',
                imgAlt: '一級塗装技能士を持つ職人だけをご紹介',
                cta: null,
              },
              {
                title: '岐阜のIT企業が運営',
                body: '大手企業との取引実績や提携実績がある岐阜のIT企業が運営しているため、資格を持たない業者や悪質な塗装店をご紹介することはありません。安心してご相談いただけます。',
                imgSrc: 'https://static.wixstatic.com/media/5ebda9_3dff8aaf91f84704b911db4531e67f77~mv2.png',
                imgAlt: '岐阜のIT企業が運営',
                cta: { label: '運営企業の実績を見てみる', href: '/works' },
              },
              {
                title: '価格だけで選ばない、適正価格をご案内',
                body: '安さだけを基準にすると、必要な工程が省かれてしまう場合があります。一級塗装技能士の技術力を踏まえたうえで、お客様と相談しながらご自宅に合った適正価格をご案内します。',
                imgSrc: 'https://static.wixstatic.com/media/5ebda9_9507f0f37b9a43afade26f41bc20f676~mv2.png',
                imgAlt: '価格だけで選ばない、適正価格をご案内',
                cta: null,
              },
              {
                title: '塗料は最低でもシリコン以上をご提案',
                body: '外壁を長持ちさせるためには、品質面を考えてもシリコン以上の塗料を使用することが大切です。職人の技術力と耐久性を踏まえたうえで、適切な塗料をご提案します。',
                imgSrc: 'https://static.wixstatic.com/media/5ebda9_2eda3a35968f49c28561d1f1987b06c7~mv2.png',
                imgAlt: '塗料は最低でもシリコン以上をご提案',
                cta: null,
              },
            ].map(({ title, body, imgSrc, imgAlt, cta }, i) => (
              <FadeUp key={i} delay={i * 80}>
                <div
                  className="overflow-hidden rounded-2xl shadow-md h-full flex flex-col"
                  style={{ backgroundColor: 'rgba(255,255,255,0.92)', border: '1px solid rgba(220,232,244,0.8)' }}
                >
                  {/* ── 画像エリア ── 後から imgSrc に URL を入れてください */}
                  {imgSrc ? (
                    /* 実画像: 縦横比を維持して自然に表示（object-contain） */
                    <div className="w-full px-4 pt-4 pb-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imgSrc}
                        alt={imgAlt}
                        className="w-full h-auto object-contain rounded-xl"
                      />
                    </div>
                  ) : (
                    /* プレースホルダー: 16:9 固定エリア */
                    <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                      <div
                        className="absolute inset-0 flex flex-col items-center justify-center gap-2"
                        style={{
                          background: 'linear-gradient(135deg, #e4ecf6 0%, #d8e6f2 45%, #dde8f4 100%)',
                        }}
                      >
                        <Camera className="w-8 h-8 text-slate-300" />
                        <span className="text-xs font-medium text-[#8a8f9a] tracking-wide">画像を挿入予定</span>
                      </div>
                    </div>
                  )}

                  {/* ── コンテンツエリア ── */}
                  <div className="p-5 sm:p-6 flex flex-col flex-1">
                    {/* オレンジアクセントライン */}
                    <div
                      className="w-8 h-1 rounded-full mb-3"
                      style={{ background: 'linear-gradient(90deg, #f97316, #ea580c)' }}
                    />
                    <h3 className="text-balance break-keep text-base sm:text-[1.05rem] font-bold mb-2 leading-snug" style={{ color: '#0a1628' }}>
                      {title}
                    </h3>
                    <p className="text-sm text-[#5a5f6c] leading-relaxed">{body}</p>
                    {cta && (
                      <a
                        href={cta.href}
                        className="mt-4 inline-flex items-center justify-center w-full rounded-xl px-4 py-3 text-sm font-bold text-white transition-all duration-150 hover:opacity-90 active:scale-95"
                        style={{
                          background: 'linear-gradient(135deg, #f97316, #ea580c)',
                          boxShadow: '0 3px 12px rgba(234,88,12,0.35)',
                        }}
                      >
                        {cta.label}
                        <svg className="ml-2 w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polyline points="9 18 15 12 9 6" /></svg>
                      </a>
                    )}
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={200} className="mt-10 text-center">
            <div className="flex justify-center">
              <div style={{ minWidth: '240px', width: '100%', maxWidth: '300px' }}>
                <CtaPrimary label="無料で相談する" sub="登録不要・完全無料" />
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── 5. 業者の見極め ──────────────────────────────────────────────── */}
      <section
        className="relative py-16 sm:py-24"
        style={{
          backgroundImage: 'url(https://static.wixstatic.com/media/5ebda9_1dc8203348f343d89fc51b2a24eb20b4~mv2.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* オーバーレイ: Tailwind の opacity modifier の代わりに inline style で確実に適用 */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.45)' }}
        />
        <OrganicBlob
          className="absolute -top-10 -right-10 w-60 h-60 sm:w-80 sm:h-80 pointer-events-none"
          color={SVG_BEIGE_BG}
          opacity={0.4}
        />
        <TrustFeatureSvg className="hidden lg:block absolute -bottom-12 -left-12 w-44 h-44 opacity-[0.14] pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">

          {/* セクション4タイトル画像 */}
          <div className="flex justify-center mb-8 px-2 sm:px-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://static.wixstatic.com/media/5ebda9_41213cde587d4344b552e043139c9cfe~mv2.png"
              alt="信頼できる外壁塗装会社の選び方"
              className="w-full max-w-[900px] sm:max-w-[1000px] h-auto object-contain"
              loading="lazy"
            />
          </div>

          <FadeUp>
            <div className="text-center mb-10">
              <H2 center>信頼できる一級塗装技能士の5つの特徴</H2>
              <p className="mt-4 text-sm sm:text-base text-[#5a5f6c] max-w-lg mx-auto leading-relaxed">
                資格の有無だけでなく、説明の丁寧さや見積もりの透明性まで含めて、安心して相談できる職人かどうかを確認しましょう。
              </p>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

            {/* 左: チェックリスト */}
            <div className="space-y-3">
              {[
                {
                  title: '一級塗装技能士などの資格を持っている',
                  desc: '国家資格を保有しているかどうかは、技術力を見極める分かりやすい指標です。',
                  iconSrc: 'https://static.wixstatic.com/media/5ebda9_0659303679724573b8b2ab61832229cd~mv2.png', // icon1
                },
                {
                  title: '劣化状況を見たうえで、必要な工事を説明してくれる',
                  desc: '専門用語を多用せず、施主目線で分かりやすく状態を説明してくれるか確認しましょう。',
                  iconSrc: 'https://static.wixstatic.com/media/5ebda9_289ce999043d496395b6c70f179edfca~mv2.png', // icon2
                },
                {
                  title: '見積もりの内訳が細かく、塗料や工程が分かりやすい',
                  desc: '「一式○○円」だけの見積もりは要注意。材料名・数量・単価が明記されているか確認を。',
                  iconSrc: 'https://static.wixstatic.com/media/5ebda9_e4cdf06f766c4442b7f37bf674b49bc4~mv2.png', // icon3
                },
                {
                  title: '施工中の写真や進捗を共有してくれる',
                  desc: '見えにくい工程も、写真で共有してくれる職人なら安心して任せられます。',
                  iconSrc: 'https://static.wixstatic.com/media/5ebda9_e50da6ed8be84e539a2bb6d271238cc7~mv2.png', // icon4
                },
                {
                  title: '契約を急かさず、比較検討をすすめてくれる',
                  desc: '「今日だけの特別価格」など即決を迫る言葉には注意。じっくり検討できる環境を大切にしている職人を選びましょう。',
                  iconSrc: 'https://static.wixstatic.com/media/5ebda9_505ea8ebff114121b5ff65de4a9c9147~mv2.png', // icon5
                },
              ].map(({ title, desc, iconSrc }, i) => (
                <FadeUp key={i} delay={i * 60}>
                  <div
                    className="flex items-start gap-4 rounded-lg p-4 sm:p-5 border transition-all duration-200"
                    style={{
                      borderColor: '#d8cebd',
                      backgroundColor: '#ffffff',
                      boxShadow: '0 1px 1px rgba(28,29,32,.03), 0 6px 18px -14px rgba(28,29,32,.18)',
                    }}
                  >
                    {/* ── アイコンエリア（76×76px）── iconSrc に URL を入れると画像表示 */}
                    <div
                      className="shrink-0 w-[76px] h-[76px] overflow-hidden flex items-center justify-center p-1"
                      style={{
                        borderRadius: '18px',
                        background: '#ffffff',
                        border: '1px solid #d8cebd',
                      }}
                    >
                      {iconSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={iconSrc} alt={title} className="w-full h-full object-contain" />
                      ) : (
                        /* プレースホルダー（空白状態） */
                        <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" aria-hidden>
                          <rect x="4" y="4" width="24" height="24" rx="4" stroke="#c8d8e8" strokeWidth="1.5" strokeDasharray="3 2" />
                          <circle cx="12" cy="13" r="3" stroke="#c8d8e8" strokeWidth="1.5" />
                          <path d="M4 24l7-7 5 5 4-4 8 7" stroke="#c8d8e8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>

                    {/* ── テキストエリア ── */}
                    <div className="flex-1 min-w-0 pt-1">
                      {/* タイトル：h-mark.strong 仕様 — rgba(233,106,31,0.45) 58%-95% */}
                      <p className="text-sm font-bold mb-2 leading-snug">
                        <span
                          style={{
                            display: 'inline',
                            backgroundImage: 'linear-gradient(transparent 58%, rgba(233,106,31,0.45) 58%, rgba(233,106,31,0.45) 95%, transparent 95%)',
                            backgroundRepeat: 'no-repeat',
                            WebkitBoxDecorationBreak: 'clone',
                            boxDecorationBreak: 'clone',
                            padding: '0 0.08em',
                            color: '#28292a',
                          }}
                        >
                          {title}
                        </span>
                      </p>
                      <p className="text-xs text-[#5a5f6c] leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>

            {/* 右: 画像 [IMAGE_3] */}
            {/* ↓ ここに業者との打ち合わせ・丁寧な説明シーンを差し込む */}
            <FadeUp delay={120}>
              <div className="relative" style={{ isolation: 'isolate' }}>
                <div
                  className="absolute inset-0 rounded-3xl pointer-events-none"
                  style={{
                    backgroundColor: '#d8e6f0',
                    transform: 'translate(14px, 14px)',
                    zIndex: -1,
                  }}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://static.wixstatic.com/media/5ebda9_cde1eeda171946b784bdfbc98ad03fd1~mv2.png"
                  alt="信頼できる外壁塗装会社の特徴"
                  className="w-full h-auto rounded-2xl shadow-xl object-contain"
                  loading="lazy"
                />
                <div
                  className="absolute top-4 -left-3 sm:-left-5 z-10 bg-white rounded-2xl px-4 py-3 shadow-xl border"
                  style={{ borderColor: '#e2eaf4' }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: '#fff0e6' }}
                    >
                      <CheckCircle className="w-4 h-4 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#28292a]">一級塗装技能士 在籍</p>
                      <p className="text-[10px] text-[#8a8f9a]">国家資格保有の実績</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── 5-A. セクション5直後 追加画像 ①② ─────────────────────────────── */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
          <FadeUp>
            {/* PC版 */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://static.wixstatic.com/media/5ebda9_1f907cc4851044ffa60cf22237cd911f~mv2.png"
              alt=""
              className="hidden md:block w-full h-auto rounded-xl shadow-md object-contain"
              loading="lazy"
            />
            {/* モバイル版 */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://static.wixstatic.com/media/5ebda9_0a2881d6bdf1404f934d61b1c90e8a58~mv2.png"
              alt=""
              className="block md:hidden w-full h-auto rounded-xl shadow-md object-contain"
              loading="lazy"
            />
          </FadeUp>
          <FadeUp delay={80}>
            {/* PC版 */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://static.wixstatic.com/media/5ebda9_0e6ee6f23c9e4c99ac827795c36833be~mv2.png"
              alt=""
              className="hidden md:block w-full h-auto rounded-xl shadow-md object-contain"
              loading="lazy"
            />
            {/* モバイル版 */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://static.wixstatic.com/media/5ebda9_b96f6e2d460f4d9383290a3628e96b40~mv2.png"
              alt=""
              className="block md:hidden w-full h-auto rounded-xl shadow-md object-contain"
              loading="lazy"
            />
          </FadeUp>
        </div>
      </div>

      {/* ── 6. 費用・塗料・時期 ──────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-16 sm:py-24"
        style={{ background: 'linear-gradient(160deg, #fffbf7 0%, #fff6ee 50%, #fffbf7 100%)' }}
      >
        <OrganicBlob
          className="absolute -bottom-16 -left-16 w-60 h-60 sm:w-80 sm:h-80 pointer-events-none"
          color={SVG_BLUE_BG}
          opacity={0.4}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">

          <div className="text-center mb-8">
            <Label>基礎知識</Label>
            <H2 center>
              <span>費用・塗料・時期について</span>
              <br className="md:hidden" />
              <span>知っておきたいこと</span>
            </H2>
            <p className="mt-4 text-sm sm:text-base text-[#5a5f6c] max-w-md mx-auto leading-relaxed">
              外壁塗装を検討するうえで、最初に押さえておきたい基本情報です。
              金額の安さだけで選ぶと、必要な工程が省かれてしまう場合があります。塗料の種類・下地処理・塗装回数・職人の技術力まで含めて比較することが大切です。
            </p>
          </div>

          <div className="space-y-4">
            {[
              { n: '1', orange: true, icon: YenCoinCheckSvg,
                title: '工事費用は家の条件によって大きく変わる',
                body: '建物の大きさ・外壁の状態・使用する塗料によって、費用は数十万〜百万円以上の幅があります。「相場が分からない」という方こそ、塗料・工程・職人の技術力まで含めて比較することが大切です。' },
              { n: '2', orange: false, icon: PaintCanLineSvg,
                title: '塗料の種類で耐久年数が変わる',
                body: 'シリコン・フッ素・無機など、塗料によって耐久年数は5〜20年以上と大きく異なります。コストと耐久性のバランスを、専門家に相談しながら選ぶのがおすすめです。' },
              { n: '3', orange: false, icon: EstimateDocumentSvg,
                title: '早めの確認が補修費を抑えるポイント',
                body: '外壁の劣化は放置すると下地まで傷みが広がり、補修費用が増加しやすくなります。「まだ大丈夫かな」という段階で、資格を持つ職人に確認してもらうのが賢い選択です。' },
              { n: '4', orange: false, icon: CertificationBadgeSvg,
                title: '時期よりも職人選びの方が結果を左右する',
                body: '塗装は年間を通じて施工可能です。「いつ塗るか」よりも「どの職人に頼むか」の方が、仕上がりや満足度に大きく影響します。' },
            ].map(({ n, orange, icon: CardIcon, title, body }, i) => (
              <FadeUp key={n} delay={i * 80}>
                <div
                  className="relative overflow-hidden grid items-start rounded-lg p-5 sm:p-7 border transition-shadow duration-200"
                  style={{
                    gridTemplateColumns: 'auto 1fr',
                    gap: '1.25rem',
                    backgroundColor: orange ? '#fff3e8' : '#ffffff',
                    borderColor: '#d8cebd',
                    boxShadow: '0 1px 1px rgba(28,29,32,.03), 0 6px 18px -14px rgba(28,29,32,.18)',
                  }}
                >
                  <CardIcon className="hidden sm:block absolute -bottom-4 -right-4 w-24 h-24 opacity-[0.08] pointer-events-none" />
                  <span
                    className="text-5xl sm:text-6xl font-black leading-none tabular-nums"
                    style={{
                      background: orange
                        ? 'linear-gradient(135deg, #f97316, #ea580c)'
                        : 'linear-gradient(135deg, #1a3a6b, #0a1628)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {n}
                  </span>
                  <div className="pt-1">
                    <p className="text-base font-bold text-[#28292a] mb-2">{title}</p>
                    <p className="text-sm text-[#5a5f6c] leading-relaxed">{body}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. 症状チェック ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white py-16 sm:py-24">
        <CrackInspectionSvg className="hidden lg:block absolute -top-10 -right-10 w-40 h-40 opacity-[0.13] pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">

          <div className="text-center mb-8">
            <Label>劣化サイン</Label>
            <H2 center>
              <span>こんな症状があるなら、</span>
              <br className="md:hidden" />
              <span>早めの確認がおすすめ</span>
            </H2>
            <p className="mt-4 text-sm sm:text-base text-[#5a5f6c] max-w-md mx-auto leading-relaxed">
              外壁・屋根の以下のサインは、塗装時期が近づいているサインかもしれません。
            </p>
          </div>

          {/* 劣化サイン 6カード — PC: 3列グリッド / モバイル: 横スクロール(scroll-snap) */}
          <FadeUp delay={80}>
            <div
              className="flex flex-nowrap overflow-x-auto gap-4 pb-4 -mx-4 px-[7.5vw] sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-3 lg:gap-5"
              style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
            >
              {[
                {
                  icon: Sun,
                  label: '色あせ・くすみ',
                  desc: '外壁の色が褪せてきたら、塗膜の保護機能が落ちているサインです。',
                  imgSrc: 'https://static.wixstatic.com/media/5ebda9_8c869e549ced431a88586252a279042b~mv2.png',
                },
                {
                  icon: AlertTriangle,
                  label: 'ひび割れ（クラック）',
                  desc: '細かいひびでも雨水が侵入し、下地の腐食につながる場合があります。',
                  imgSrc: 'https://static.wixstatic.com/media/5ebda9_1142950534184f00b6e657fba7b33c93~mv2.png',
                },
                {
                  icon: Droplets,
                  label: 'コケ・カビの発生',
                  desc: '湿気がたまりやすい北面などに多く見られます。塗膜が劣化しているサインです。',
                  imgSrc: 'https://static.wixstatic.com/media/5ebda9_8f3d0842e9944bbf982d25b8211e4774~mv2.png',
                },
                {
                  icon: Home,
                  label: 'チョーキング（白い粉）',
                  desc: '外壁を触ったときに白い粉がつく状態。塗料の寿命が近づいています。',
                  imgSrc: 'https://static.wixstatic.com/media/5ebda9_4f9d1a87d9a848b785832c952033b37d~mv2.png',
                },
                {
                  icon: Shield,
                  label: '雨漏り・防水の不安',
                  desc: '天井のシミや水まわりの湿気が気になる場合、外壁や屋根の防水性を確認することをおすすめします。',
                  imgSrc: 'https://static.wixstatic.com/media/5ebda9_cf57b1abd4974fddae593241b083937f~mv2.png',
                },
                {
                  icon: Search,
                  label: '外壁の浮き・剥がれ',
                  desc: '塗膜が浮いていたり剥がれている場合は、下地までダメージが及んでいる可能性があります。',
                  imgSrc: 'https://static.wixstatic.com/media/5ebda9_8e3547e6e19149328120f9c5c11f3dc5~mv2.png',
                },
              ].map(({ icon: Icon, label, desc, imgSrc }) => (
                <div
                  key={label}
                  className="flex-none w-[85vw] sm:w-auto overflow-hidden rounded-xl border hover:border-orange-200 hover:shadow-md transition-all duration-200"
                  style={{
                    borderColor: '#d8cebd',
                    backgroundColor: '#fff',
                    boxShadow: '0 1px 4px rgba(0,0,0,.06)',
                    scrollSnapAlign: 'center',
                  }}
                >
                  {/* カード上部: 画像 (16:9) */}
                  <div className="w-full overflow-hidden" style={{ aspectRatio: '16/9' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imgSrc}
                      alt={label}
                      className="w-full h-full object-cover object-center"
                      loading="lazy"
                    />
                  </div>
                  {/* カード下部: アイコン・タイトル・説明文 */}
                  <div className="p-4 sm:p-5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 shadow-sm"
                      style={{ backgroundColor: '#fff3e8' }}
                    >
                      <Icon className="w-5 h-5 text-orange-500" />
                    </div>
                    <p className="text-sm font-bold text-[#28292a] mb-1.5">{label}</p>
                    <p className="text-xs text-[#5a5f6c] leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>

          <FadeUp delay={200}>
            <div
              className="mt-8 rounded-lg p-5 sm:p-6 flex items-start gap-4 border"
              style={{ backgroundColor: '#fff8f2', borderColor: '#f5c79b' }}
            >
              <AlertTriangle className="shrink-0 w-5 h-5 text-orange-500 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-orange-800 mb-1">
                  1つでも当てはまるなら、早めの確認をおすすめします
                </p>
                <p className="text-xs text-orange-700 leading-relaxed">
                  外壁の劣化は時間が経つほど補修の範囲・費用が増えやすくなります。
                  まずは無料診断で現状をチェックしてみましょう。
                  <br />
                  このような症状がある場合、塗装の知識や施工経験がある職人に状態を確認してもらうことが大切です。Paint Netでは、一級塗装技能士を持つ職人・業者への相談が可能です。
                </p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── 8. ビフォーアフター ──────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-16 sm:py-24"
        style={{ backgroundColor: '#fbf8f4' }}
      >
        <OrganicBlob
          className="absolute -top-10 -right-10 w-56 h-56 sm:w-72 sm:h-72 pointer-events-none"
          color={SVG_BLUE_BG}
          opacity={0.3}
        />
        <OrganicBlob
          className="absolute -bottom-16 -right-16 w-64 h-64 sm:w-96 sm:h-96 pointer-events-none"
          color={SVG_BEIGE_BG}
          opacity={0.35}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <Label>施工事例</Label>
            <H2 center>ビフォーアフター</H2>
            <p className="mt-4 text-sm sm:text-base text-[#5a5f6c] max-w-md mx-auto leading-relaxed">
              スライダーを左右に動かして、施工前後の変化を比較してみてください。一級塗装技能士による施工事例です。
            </p>
          </div>

          {[
            {
              beforeImg: 'https://static.wixstatic.com/media/5ebda9_173d632532d4472eb1e82ebbc8186348~mv2.jpg',
              afterImg:  'https://static.wixstatic.com/media/5ebda9_7edcb11055b74ec8ba666390d99a9aa4~mv2.jpg',
              meta: [
                { label: '建物規模', value: '30坪前後' },
                { label: '施工価格', value: '約90万円' },
                { label: '屋根塗装', value: 'なし' },
                { label: '使用塗料', value: 'シリコン塗料' },
              ],
            },
            {
              beforeImg: BEFORE_IMG,
              afterImg:  AFTER_IMG,
              meta: [
                { label: '建物規模', value: '40坪' },
                { label: '施工価格', value: '110万円' },
                { label: '屋根塗装', value: 'なし' },
                { label: '使用塗料', value: 'シリコン塗料' },
              ],
            },
            {
              beforeImg: 'https://static.wixstatic.com/media/5ebda9_4ba7e7b8af4f4a7d845983808fd79f7a~mv2.jpg',
              afterImg:  'https://static.wixstatic.com/media/5ebda9_a3a23d7598434ac8a4054b6d64e67c6b~mv2.jpg',
              meta: [
                { label: '建物規模', value: '40坪' },
                { label: '施工価格', value: '110万円' },
                { label: '屋根塗装', value: 'なし' },
                { label: '使用塗料', value: 'シリコン塗料' },
              ],
            },
          ].map(({ beforeImg, afterImg, meta }, caseIdx) => (
            <div key={caseIdx} className={caseIdx > 0 ? 'mt-16 sm:mt-20' : ''}>
              <FadeUp delay={80}>
                <BeforeAfterSlider beforeImg={beforeImg} afterImg={afterImg} />
              </FadeUp>
              <FadeUp delay={160}>
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {meta.map(({ label, value }) => (
                    <div
                      key={label}
                      className="rounded-lg p-4 text-center border"
                      style={{
                        backgroundColor: '#ffffff',
                        borderColor: '#d8cebd',
                        boxShadow: '0 1px 4px rgba(0,0,0,.06)',
                      }}
                    >
                      <p className="text-[11px] font-bold text-[#8a8f9a] uppercase tracking-wider mb-1.5">{label}</p>
                      <p className="text-sm font-bold text-[#28292a]">{value}</p>
                    </div>
                  ))}
                </div>
              </FadeUp>
            </div>
          ))}

          {/* ── 施工中の確認体制ギャラリー ──────────────────────────────────── */}
          <FadeUp delay={120} className="mt-20 sm:mt-28">
            <div className="text-center mb-8 sm:mb-10">
              <Label>施工中の確認体制</Label>
              <H2 center>
                <span>一級塗装技能士による施工品質を、</span>
                <br className="md:hidden" />
                <span>写真で確認</span>
              </H2>
              <p className="mt-4 text-sm sm:text-base text-[#5a5f6c] max-w-lg mx-auto leading-relaxed text-balance break-keep">
                Paint Netでは、施工中も職人さんとやりとりしながら、作業状況を確認します。
                お客様にも安心していただけるよう、施工中の写真を共有し、見えにくい工程も分かりやすくお伝えします。
              </p>
            </div>

            {/* PC版: 大1枚(2列) + 右縦 + 下3枚 */}
            <div className="hidden sm:grid sm:grid-cols-3 sm:gap-3 lg:gap-4">
              {/* Photo 1: 横長・2列スパン */}
              <div
                className="sm:col-span-2 overflow-hidden rounded-2xl"
                style={{ aspectRatio: '16/9', boxShadow: '0 6px 24px rgba(0,0,0,.13)' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://static.wixstatic.com/media/5ebda9_1fa62fdbcb624c2ca60610428642a680~mv2.jpg"
                  alt="施工中の確認①"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              {/* Photo 2: 右縦・高さはPhoto 1に合わせてグリッドが自動調整 */}
              <div
                className="overflow-hidden rounded-2xl"
                style={{ boxShadow: '0 6px 24px rgba(0,0,0,.13)' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://static.wixstatic.com/media/5ebda9_aff0a15cae5f4801aa9595b40e82e256~mv2.jpg"
                  alt="施工中の確認②"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              {/* Photos 3–5: 3列均等 */}
              {[
                { src: 'https://static.wixstatic.com/media/5ebda9_f441a414f6c341c69ecee68493c03523~mv2.jpg', alt: '施工中の確認③' },
                { src: 'https://static.wixstatic.com/media/5ebda9_2199224b2c924ff2bb3dfb4a007dd2f7~mv2.jpg', alt: '施工中の確認④' },
                { src: 'https://static.wixstatic.com/media/5ebda9_d83b87c756884854b2f4f0e61cb2088b~mv2.jpg', alt: '施工中の確認⑤' },
              ].map(({ src, alt }) => (
                <div
                  key={alt}
                  className="overflow-hidden rounded-2xl"
                  style={{ aspectRatio: '4/3', boxShadow: '0 6px 24px rgba(0,0,0,.13)' }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>

            {/* スマホ版: 横スクロール */}
            <div
              className="sm:hidden flex gap-3 overflow-x-auto pb-3 -mx-4 px-[5vw]"
              style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
            >
              {[
                'https://static.wixstatic.com/media/5ebda9_1fa62fdbcb624c2ca60610428642a680~mv2.jpg',
                'https://static.wixstatic.com/media/5ebda9_aff0a15cae5f4801aa9595b40e82e256~mv2.jpg',
                'https://static.wixstatic.com/media/5ebda9_f441a414f6c341c69ecee68493c03523~mv2.jpg',
                'https://static.wixstatic.com/media/5ebda9_2199224b2c924ff2bb3dfb4a007dd2f7~mv2.jpg',
                'https://static.wixstatic.com/media/5ebda9_d83b87c756884854b2f4f0e61cb2088b~mv2.jpg',
              ].map((src, i) => (
                <div
                  key={i}
                  className="flex-none overflow-hidden rounded-2xl"
                  style={{
                    width: '78vw',
                    aspectRatio: '4/3',
                    boxShadow: '0 4px 16px rgba(0,0,0,.12)',
                    scrollSnapAlign: 'center',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`施工中の確認${i + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── 9. お客様の口コミ ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white py-16 sm:py-24">
        <OrganicBlob
          className="absolute -top-12 -left-12 w-56 h-56 sm:w-72 sm:h-72 pointer-events-none"
          color={SVG_BEIGE_BG}
          opacity={0.3}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <Label>お客様の声</Label>
            <H2 center>
              <span>実際に利用された</span>
              <br className="md:hidden" />
              <span>お客様の口コミ</span>
            </H2>
            <p className="mt-4 text-sm sm:text-base text-[#5a5f6c] max-w-md mx-auto leading-relaxed">
              東海エリアで外壁塗装を行ったお客様からいただいた率直なご感想です。
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                initial: 'K',
                name: 'K.T 様',
                area: '岐阜県 / 戸建て',
                rating: 5,
                text: '見た目がかなり綺麗になって、家全体が明るく見えるようになりました。価格も想定内で安心してお願いできました。外壁だけでこんなに印象が変わるとは思っていなかったので驚いています。',
              },
              {
                initial: 'M',
                name: 'M.S 様',
                area: '愛知県 / 戸建て',
                rating: 5,
                text: '担当の方の対応が丁寧で、工事の流れも分かりやすかったです。初めての塗装工事でしたが不安なく進められました。細かい質問にも親切に答えていただけて、とても信頼できました。',
              },
              {
                initial: 'H',
                name: 'H.N 様',
                area: '三重県 / 戸建て',
                rating: 5,
                text: '古く見えていた外壁が新築みたいな印象になって驚きました。費用と仕上がりのバランスにも満足しています。近所の方にも「きれいになったね」と言ってもらえてとても嬉しかったです。',
              },
            ].map(({ initial, name, area, rating, text }, i) => (
              <FadeUp key={name} delay={i * 80}>
                <div
                  className="rounded-lg p-6 border flex flex-col gap-4 h-full transition-shadow duration-200"
                  style={{
                    backgroundColor: '#ffffff',
                    borderColor: '#d8cebd',
                    boxShadow: '0 1px 1px rgba(28,29,32,.03), 0 6px 18px -14px rgba(28,29,32,.18)',
                  }}
                >
                  {/* 星評価 */}
                  <div className="flex gap-0.5">
                    {Array.from({ length: rating }).map((_, j) => (
                      <svg key={j} viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="#f97316" aria-hidden>
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
                      </svg>
                    ))}
                  </div>
                  {/* 口コミ本文 */}
                  <p className="text-sm text-[#5a5f6c] leading-relaxed flex-1">
                    「{text}」
                  </p>
                  {/* 投稿者 */}
                  <div
                    className="flex items-center gap-3 pt-4 border-t"
                    style={{ borderColor: '#f1f5f9' }}
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0"
                      style={{ background: 'linear-gradient(135deg, #1a3a6b 0%, #0a1628 100%)' }}
                    >
                      {initial}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#28292a]">{name}</p>
                      <p className="text-xs text-[#8a8f9a]">{area}</p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. メインCTA ────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-16 sm:py-24"
        style={{ background: 'linear-gradient(160deg, #0a1628 0%, #1a3a6b 55%, #1e4a8a 100%)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 75% 50%, rgba(249,115,22,0.18) 0%, transparent 55%), radial-gradient(circle at 25% 50%, rgba(59,130,246,0.18) 0%, transparent 55%)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <SoftWaveBg tone="navy" className="absolute inset-x-0 bottom-0 w-full h-auto pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <FadeUp>
            <span className="inline-block text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#fb923c' }}>
              一級塗装技能士紹介 / Certified Craftsman
            </span>
            <h2 className="text-balance break-keep text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight mb-5">
              一級塗装技能士に
              <br />相談してみませんか？
            </h2>
            <p className="text-balance break-keep text-base text-blue-100 leading-relaxed mb-8">
              外壁の状態や費用感が分からない方も、まずはお気軽にご相談ください。
              <br className="md:hidden" />
              Paint Netが、品質を重視した外壁塗装の相談先をご案内します。
            </p>
            <div className="flex flex-col items-center gap-4">
              <div className="relative" style={{ minWidth: '260px', width: '100%', maxWidth: '320px' }}>
                <ArrowNudgeSvg className="hidden lg:block absolute top-1/2 -translate-y-1/2 -left-14 w-10 h-10 opacity-60 scale-x-[-1] pointer-events-none" />
                <CtaPrimary label="一級塗装技能士を紹介してもらう" sub="登録不要・完全無料" />
              </div>
              <CtaLink label="相場と進め方を先に確認する" light />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── 11. FAQ ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-14 sm:py-24" style={{ backgroundColor: '#fbf8f4' }}>
        <OrganicBlob
          className="absolute -bottom-14 -right-14 w-56 h-56 sm:w-72 sm:h-72 pointer-events-none"
          color={SVG_BLUE_BG}
          opacity={0.3}
        />
        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <Label>よくある質問</Label>
            <H2 center>
              <span>はじめての方から</span>
              <br className="md:hidden" />
              <span>よくいただくご質問</span>
            </H2>
          </div>
          <div className="space-y-3">
            {[
              { q: 'まだ塗装するか決めていなくても相談できますか？',     a: 'もちろん大丈夫です。「まだ先かな」と思っている段階でも、現状を確認することで最適なタイミングが分かります。情報収集だけでもお気軽にどうぞ。' },
              { q: '相見積もりだけでもお願いできますか？',               a: 'はい、問題ありません。むしろ複数社の見積もりを比較することを推奨しています。比較することで適正価格と良い業者を見つけやすくなります。' },
              { q: 'しつこい営業はありませんか？',                       a: '当サービスでは、無理な営業・即決のプレッシャーは一切ありません。ご納得いただけるまでじっくりとご検討いただける環境を大切にしています。' },
              { q: 'どのタイミングで塗装を検討すべきですか？',           a: '一般的な目安は前回の塗装から10〜15年ですが、外壁の状態によって異なります。色あせ・ひび割れ・チョーキングなどのサインが見られたら、早めに専門家に確認してもらいましょう。' },
            ].map((item, i) => (
              <FadeUp key={i} delay={i * 60}>
                <FaqItem {...item} />
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── 12. 最終CTA ───────────────────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">

          {/* [IMAGE_5: 信頼感ビジュアル — 施工後の美しい外壁・満足した施主イメージ] */}
          {/* ↓ ここにフィナルCTA直前の信頼感を演出する横長画像を差し込む */}
          <FadeUp className="mb-10">
            <ImgPlaceholder
              aspect="16/5"
              label="信頼感ビジュアル（施工後イメージ）"
              className="shadow-lg"
            />
          </FadeUp>

          <FadeUp delay={100}>
            <div
              className="relative overflow-hidden rounded-3xl p-8 sm:p-12 text-center"
              style={{
                background: 'linear-gradient(145deg, #0a1628 0%, #1a3a6b 55%, #1e4a8a 100%)',
                boxShadow: '0 20px 60px rgba(10,22,40,0.28), 0 4px 16px rgba(10,22,40,0.12)',
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 20% 80%, rgba(249,115,22,0.12) 0%, transparent 40%), radial-gradient(circle at 80% 20%, rgba(59,130,246,0.12) 0%, transparent 40%)',
                }}
              />
              <SoftWaveBg tone="navy" className="absolute inset-x-0 bottom-0 w-full h-auto pointer-events-none" />
              <div className="relative z-10">
                <span className="inline-block text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#fb923c' }}>
                  Next Step
                </span>
                <h2 className="text-balance break-keep text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight mb-3">
                  一級塗装技能士に
                  <br />相談してみませんか？
                </h2>
                <p className="text-balance break-keep text-sm text-blue-100 leading-relaxed mb-8 max-w-sm mx-auto">
                  外壁の状態や費用感が分からない方も、まずはお気軽にご相談ください。Paint Netが、品質を重視した外壁塗装の相談先をご案内します。
                </p>
                <div className="flex justify-center gap-6 text-xs text-blue-200 mb-8">
                  {['登録不要', '完全無料', '営業なし'].map((t) => (
                    <span key={t} className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-orange-400" />
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <div className="relative" style={{ minWidth: '260px', width: '100%', maxWidth: '320px' }}>
                    <ArrowNudgeSvg className="hidden lg:block absolute top-1/2 -translate-y-1/2 -left-14 w-10 h-10 opacity-60 scale-x-[-1] pointer-events-none" />
                    <CtaPrimary label="一級塗装技能士を紹介してもらう" sub="登録不要・完全無料" />
                  </div>
                  <CtaLink label="相場と進め方を先に確認する" light />
                </div>
                <p className="mt-6 text-xs text-blue-300 opacity-60">
                  岐阜・愛知・三重エリアに対応しています
                </p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── フッター ─────────────────────────────────────────────────────── */}
      <footer className="border-t py-8" style={{ borderColor: '#ece6dc', backgroundColor: '#fbf8f4' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-2.5 mb-3">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-sm"
              style={{ background: 'linear-gradient(135deg, #1a3a6b, #0a1628)' }}
            >
              P
            </div>
            <span className="font-black text-sm" style={{ color: '#0a1628' }}>Paint Net</span>
          </div>
          <p className="text-xs text-[#8a8f9a] leading-relaxed">
            一級塗装技能士を持つ職人・業者を厳選してご紹介する、東海エリアの外壁塗装サポートサービスです。
            <br />© 2024 Paint Net. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}
