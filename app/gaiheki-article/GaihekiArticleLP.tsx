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
const HERO_IMG_DESKTOP = 'https://static.wixstatic.com/media/5ebda9_b587bb6b0e8b4a25b9c79b4c78608664~mv2.png';
const HERO_IMG_MOBILE  = 'https://static.wixstatic.com/media/5ebda9_747d0f5c2e16449092f277bf83807312~mv2.png';

// ─── スクロールフェードアップ (globals.css の section-fade / in-view を使用) ──
function useFadeUp() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('in-view');
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
          <Camera className="w-6 h-6 text-slate-400" />
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

// ─── セクションラベル（オレンジ縦線 + テキスト）────────────────────────────
function Label({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-3">
      <div
        className="w-1 h-5 rounded-full"
        style={{ background: 'linear-gradient(to bottom, #f97316, #ea580c)' }}
      />
      <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#ea580c' }}>
        {children}
      </span>
    </div>
  );
}

// ─── セクション見出し ────────────────────────────────────────────────────────
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
      className={`text-[1.65rem] sm:text-[1.9rem] font-black leading-tight tracking-tight ${center ? 'text-center' : ''}`}
      style={{ color: light ? '#ffffff' : '#0a1628' }}
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

// ─── FAQ アコーディオン ──────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="overflow-hidden rounded-2xl transition-colors duration-200"
      style={{
        border: `1.5px solid ${open ? '#ea580c' : '#e2e8f0'}`,
        backgroundColor: open ? '#fffbf7' : '#ffffff',
      }}
    >
      <button
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <span
            className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-colors duration-200"
            style={{
              backgroundColor: open ? '#ea580c' : '#f1f5f9',
              color: open ? '#ffffff' : '#94a3b8',
            }}
          >
            Q
          </span>
          <span className="text-sm font-semibold text-slate-800 leading-snug">{q}</span>
        </div>
        {open
          ? <ChevronUp className="shrink-0 w-4 h-4 text-orange-500" />
          : <ChevronDown className="shrink-0 w-4 h-4 text-slate-400" />}
      </button>
      {open && (
        <div className="px-5 pb-5">
          <div className="flex items-start gap-3 border-t border-orange-100 pt-4">
            <span
              className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black"
              style={{ backgroundColor: '#fff0e6', color: '#ea580c' }}
            >
              A
            </span>
            <p className="text-sm text-slate-600 leading-relaxed">{a}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// メインコンポーネント
// ════════════════════════════════════════════════════════════════════════════
export default function GaihekiArticleLP() {
  return (
    <div className="min-h-dvh bg-white text-slate-800 antialiased overflow-x-hidden">

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-sm"
              style={{ background: 'linear-gradient(135deg, #1a3a6b 0%, #0a1628 100%)' }}
            >
              P
            </div>
            <div className="leading-none">
              <p className="font-black text-[15px] tracking-tight" style={{ color: '#0a1628' }}>
                Paint Net
              </p>
              <p className="hidden sm:block text-[9px] font-medium text-slate-400 tracking-wide mt-0.5">
                外壁塗装の比較・診断メディア
              </p>
            </div>
          </div>
          <a
            href={DESTINATION_LP_URL}
            className="text-xs font-bold text-white px-4 py-2 rounded-xl cursor-pointer transition-all duration-150 hover:opacity-90 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              boxShadow: '0 2px 12px rgba(234,88,12,0.35)',
            }}
          >
            無料診断へ →
          </a>
        </div>
      </header>

      {/* ── 1. ファーストビュー — 画像のみ ─────────────────────────────── */}
      <section className="pt-14">
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

      {/* ── 2. よくある失敗 ──────────────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <FadeUp className="text-center mb-10">
            <Label>よくある失敗</Label>
            <H2 center>外壁塗装で後悔する4つのパターン</H2>
            <p className="mt-4 text-sm sm:text-base text-slate-500 max-w-md mx-auto leading-relaxed">
              多くの方が経験する失敗を事前に知っておくことで、回避できます。
            </p>
          </FadeUp>

          {/* [IMAGE_2: 外壁塗装の失敗事例・施工前後イメージ] */}
          {/* ↓ ここに施工前後や失敗事例の横長画像を差し込む */}
          <FadeUp delay={80} className="mb-10">
            <ImgPlaceholder
              aspect="21/9"
              label="失敗事例・施工前後イメージ"
              className="shadow-md"
            />
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
            {[
              {
                n: '01',
                icon: AlertTriangle,
                title: '価格だけで業者を決めてしまう',
                desc: '安さの理由が粗悪な材料・手抜き工事の場合も。価格の安さだけで判断するのは危険です。',
              },
              {
                n: '02',
                icon: FileText,
                title: '見積もりを1社だけで判断する',
                desc: '比較対象がないと、提示された金額が適正かどうか分かりません。最低でも3社の比較がおすすめです。',
              },
              {
                n: '03',
                icon: Search,
                title: '塗料の違いが分からないまま契約する',
                desc: '塗料によって耐久年数が5〜20年と大きく異なります。どの塗料を使うか必ず確認しましょう。',
              },
              {
                n: '04',
                icon: Shield,
                title: '工事後の保証・アフターを確認しない',
                desc: '施工後に不具合が出たとき、保証がなければ自費対応になります。保証内容は契約前にチェックを。',
              },
            ].map(({ n, icon: Icon, title, desc }, i) => (
              <FadeUp key={n} delay={i * 70}>
                <div
                  className="relative overflow-hidden rounded-2xl p-5 sm:p-6 border hover:shadow-md transition-shadow duration-200"
                  style={{
                    borderColor: '#e4ecf6',
                    background: 'linear-gradient(135deg, #fafcff 0%, #f2f7ff 100%)',
                  }}
                >
                  <span
                    className="absolute -top-3 -right-1 text-8xl font-black opacity-[0.05] tabular-nums leading-none select-none pointer-events-none"
                    style={{ color: '#1a3a6b' }}
                  >
                    {n}
                  </span>
                  <span
                    className="text-2xl font-black tabular-nums leading-none block mb-3"
                    style={{
                      background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {n}
                  </span>
                  <div className="flex items-start gap-2">
                    <Icon className="shrink-0 w-4 h-4 text-amber-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-slate-800 mb-1.5">{title}</p>
                      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. 相見積もり ────────────────────────────────────────────────── */}
      <section
        className="py-16 sm:py-24"
        style={{ background: 'linear-gradient(160deg, #f0f5fb 0%, #f6f9ff 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <FadeUp className="text-center mb-10">
            <Label>相見積もりの重要性</Label>
            <H2 center>なぜ、複数社に見積もりを依頼するべきなのか</H2>
            <p className="mt-4 text-sm sm:text-base text-slate-500 max-w-md mx-auto leading-relaxed">
              「業者に失礼かも…」と思わなくて大丈夫。
              <br />相見積もりは賢い選択の第一歩です。
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {[
              { n: '01', icon: FileText, title: '適正価格が分かる',    desc: '複数の見積もりを比較することで、地域の相場が自然と見えてきます。' },
              { n: '02', icon: Search,   title: '提案内容の差が見える', desc: '同じ家でも、塗料・工法・工程で会社ごとに提案が異なります。' },
              { n: '03', icon: Shield,   title: '手抜きリスクを減らせる', desc: '複数社から見られていると分かることで、施工品質が上がりやすくなります。' },
              { n: '04', icon: Star,     title: '自分に合う会社を選べる', desc: '担当者の対応や説明の丁寧さも、実際に比べることで判断できます。' },
            ].map(({ n, icon: Icon, title, desc }, i) => (
              <FadeUp key={n} delay={i * 80}>
                <div
                  className="relative overflow-hidden rounded-2xl p-5 sm:p-6 h-full border hover:border-orange-200 hover:shadow-md transition-all duration-200"
                  style={{ backgroundColor: '#ffffff', borderColor: '#dce8f4' }}
                >
                  <span
                    className="absolute top-3 right-4 text-6xl font-black opacity-[0.04] tabular-nums leading-none pointer-events-none select-none"
                    style={{ color: '#1a3a6b' }}
                  >
                    {n}
                  </span>
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 shadow-sm"
                    style={{ background: 'linear-gradient(135deg, #1a3a6b 0%, #0a1628 100%)' }}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm font-bold text-slate-800 mb-2">{title}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={200} className="mt-10 text-center">
            <p className="text-sm text-slate-500 mb-5">
              まず複数社の見積もりで、適正な相場を確認しましょう
            </p>
            <div className="flex justify-center">
              <div style={{ minWidth: '240px', width: '100%', maxWidth: '300px' }}>
                <CtaPrimary label="相場と進め方を確認する" sub="無料・登録不要" />
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── 4. 業者の見極め ──────────────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <FadeUp className="text-center mb-12">
            <Label>業者選びのコツ</Label>
            <H2 center>信頼できる外壁塗装会社の5つの特徴</H2>
            <p className="mt-4 text-sm sm:text-base text-slate-500 max-w-md mx-auto leading-relaxed">
              以下の特徴が揃っている会社は、安心して相談しやすい傾向があります。
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

            {/* 左: チェックリスト */}
            <div className="space-y-3">
              {[
                { n: '01', title: '説明が分かりやすく、質問に丁寧に答えてくれる', desc: '専門用語を多用せず、施主目線で話せる担当者かどうか確認しましょう。' },
                { n: '02', title: '見積もりの内訳が細かく記載されている',         desc: '「一式○○円」だけの見積もりは要注意。材料名・数量・単価が明記されているか確認を。' },
                { n: '03', title: '施工後の保証・アフターフォローが明確',          desc: '保証期間、対応範囲、連絡先がはっきりしているか。口頭だけでなく書面で確認しましょう。' },
                { n: '04', title: '地域での施工実績がある',                        desc: '地元の気候・建材・規制を知っている業者は、より適切な提案をしやすい傾向があります。' },
                { n: '05', title: '無理な営業・即決プレッシャーをかけない',        desc: '「今日だけの特別価格」などの言葉には注意。じっくり検討できる環境を大切にしてください。' },
              ].map(({ n, title, desc }, i) => (
                <FadeUp key={n} delay={i * 60}>
                  <div
                    className="flex items-start gap-4 rounded-2xl p-4 sm:p-5 border hover:border-orange-200 hover:shadow-sm transition-all duration-200"
                    style={{ borderColor: '#e4ecf6', backgroundColor: '#f8fafc' }}
                  >
                    <div
                      className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-sm"
                      style={{ background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)' }}
                    >
                      {n}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 mb-1">{title}</p>
                      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
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
                {/* [IMAGE_3: 業者との打ち合わせ・説明シーン] */}
                <ImgPlaceholder
                  aspect="3/4"
                  label="業者打ち合わせイメージ"
                  className="shadow-xl"
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
                      <p className="text-xs font-bold text-slate-800">地域密着の実績あり</p>
                      <p className="text-[10px] text-slate-400">東海エリア対応</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── 5. 費用・塗料・時期 ──────────────────────────────────────────── */}
      <section
        className="py-16 sm:py-24"
        style={{ background: 'linear-gradient(160deg, #fffbf7 0%, #fff6ee 50%, #fffbf7 100%)' }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          <FadeUp className="text-center mb-12">
            <Label>基礎知識</Label>
            <H2 center>費用・塗料・時期について知っておきたいこと</H2>
            <p className="mt-4 text-sm sm:text-base text-slate-500 max-w-md mx-auto leading-relaxed">
              外壁塗装を検討するうえで、最初に押さえておきたい基本情報です。
            </p>
          </FadeUp>

          <div className="space-y-4">
            {[
              { n: '1', orange: true,
                title: '工事費用は家の条件によって大きく変わる',
                body: '建物の大きさ・外壁の状態・使用する塗料によって、費用は数十万〜百万円以上の幅があります。「相場が分からない」という方こそ、複数社で比較することが大切です。' },
              { n: '2', orange: false,
                title: '塗料の種類で耐久年数が変わる',
                body: 'シリコン・フッ素・無機など、塗料によって耐久年数は5〜20年以上と大きく異なります。コストと耐久性のバランスを、専門家に相談しながら選ぶのがおすすめです。' },
              { n: '3', orange: false,
                title: '早めの確認が補修費を抑えるポイント',
                body: '外壁の劣化は放置すると下地まで傷みが広がり、補修費用が増加しやすくなります。「まだ大丈夫かな」という段階で専門家に確認してもらうのが賢い選択です。' },
              { n: '4', orange: false,
                title: '時期よりも業者選びの方が結果を左右する',
                body: '塗装は年間を通じて施工可能です。「いつ塗るか」よりも「どの業者に頼むか」の方が、仕上がりや満足度に大きく影響します。' },
            ].map(({ n, orange, title, body }, i) => (
              <FadeUp key={n} delay={i * 80}>
                <div
                  className="grid items-start rounded-2xl p-5 sm:p-7 border hover:shadow-sm transition-shadow duration-200"
                  style={{
                    gridTemplateColumns: 'auto 1fr',
                    gap: '1.25rem',
                    backgroundColor: orange ? '#fffbf7' : '#ffffff',
                    borderColor: orange ? '#fed7aa' : '#e4ecf6',
                  }}
                >
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
                    <p className="text-base font-bold text-slate-800 mb-2">{title}</p>
                    <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. 症状チェック ──────────────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <FadeUp className="text-center mb-10">
            <Label>劣化サイン</Label>
            <H2 center>こんな症状があるなら、早めの確認がおすすめ</H2>
            <p className="mt-4 text-sm sm:text-base text-slate-500 max-w-md mx-auto leading-relaxed">
              外壁・屋根の以下のサインは、塗装時期が近づいているサインかもしれません。
            </p>
          </FadeUp>

          {/* [IMAGE_4: 外壁の劣化症状 — ひび割れ・チョーキング・コケなどのイメージ] */}
          {/* ↓ ここに劣化サインを示す横長画像を差し込む */}
          <FadeUp delay={80} className="mb-10">
            <ImgPlaceholder
              aspect="21/9"
              label="外壁の劣化サインイメージ"
              className="shadow-md"
            />
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {[
              { icon: Sun,           label: '色あせ・くすみ',       desc: '外壁の色が褪せてきたら、塗膜の保護機能が落ちているサインです。' },
              { icon: AlertTriangle, label: 'ひび割れ（クラック）', desc: '細かいひびでも雨水が侵入し、下地の腐食につながる場合があります。' },
              { icon: Droplets,      label: 'コケ・カビの発生',     desc: '湿気がたまりやすい北面などに多く見られます。塗膜が劣化しているサインです。' },
              { icon: Home,          label: 'チョーキング（白い粉）', desc: '外壁を触ったときに白い粉がつく状態。塗料の寿命が近づいています。' },
              { icon: Shield,        label: '雨漏り・防水の不安',   desc: '天井のシミや水まわりの湿気が気になる場合、外壁や屋根の防水性を確認することをおすすめします。' },
              { icon: Search,        label: '外壁の浮き・剥がれ',   desc: '塗膜が浮いていたり剥がれている場合は、下地までダメージが及んでいる可能性があります。' },
            ].map(({ icon: Icon, label, desc }, i) => (
              <FadeUp key={label} delay={i * 55}>
                <div
                  className="relative overflow-hidden rounded-2xl p-5 sm:p-6 border hover:border-orange-200 hover:shadow-md transition-all duration-200"
                  style={{
                    borderColor: '#e4ecf6',
                    background: 'linear-gradient(135deg, #fafcff 0%, #f2f7ff 100%)',
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 shadow-sm"
                    style={{ backgroundColor: '#fff3e8' }}
                  >
                    <Icon className="w-5 h-5 text-orange-500" />
                  </div>
                  <p className="text-sm font-bold text-slate-800 mb-1.5">{label}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={200}>
            <div
              className="mt-8 rounded-2xl p-5 sm:p-6 flex items-start gap-4 border"
              style={{ backgroundColor: '#fff8f2', borderColor: '#fed7aa' }}
            >
              <AlertTriangle className="shrink-0 w-5 h-5 text-orange-500 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-orange-800 mb-1">
                  1つでも当てはまるなら、早めの確認をおすすめします
                </p>
                <p className="text-xs text-orange-700 leading-relaxed">
                  外壁の劣化は時間が経つほど補修の範囲・費用が増えやすくなります。
                  まずは無料診断で現状をチェックしてみましょう。
                </p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── 7. メインCTA ─────────────────────────────────────────────────── */}
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
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <FadeUp>
            <span className="inline-block text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#fb923c' }}>
              無料診断 / Free Diagnosis
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight mb-5">
              東海エリアで対応できる
              <br />外壁塗装会社を確認する
            </h2>
            <p className="text-base text-blue-100 leading-relaxed mb-8">
              30秒・7問のかんたん診断で、
              <br />あなたに合った進め方をご案内します。
            </p>
            <div className="flex flex-col items-center gap-4">
              <div style={{ minWidth: '260px', width: '100%', maxWidth: '320px' }}>
                <CtaPrimary label="無料で診断をはじめる" sub="登録不要・完全無料" />
              </div>
              <CtaLink label="相場と進め方を先に確認する" light />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── 8. FAQ ──────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24" style={{ backgroundColor: '#f8fafc' }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <FadeUp className="text-center mb-10">
            <Label>よくある質問</Label>
            <H2 center>はじめての方からよくいただくご質問</H2>
          </FadeUp>
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

      {/* ── 9. 最終CTA ───────────────────────────────────────────────────── */}
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
              <div className="relative">
                <span className="inline-block text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#fb923c' }}>
                  Next Step
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight mb-3">
                  記事を読んで、次の一歩へ
                </h2>
                <p className="text-sm text-blue-100 leading-relaxed mb-8 max-w-sm mx-auto">
                  かんたんな診断に答えるだけで、東海エリアで対応できる会社と相場の目安が分かります。
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
                  <div style={{ minWidth: '260px', width: '100%', maxWidth: '320px' }}>
                    <CtaPrimary label="東海で対応できる会社を確認する" sub="30秒・7問のかんたん診断" />
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
      <footer className="border-t py-8" style={{ borderColor: '#e2e8f0', backgroundColor: '#f8fafc' }}>
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
          <p className="text-xs text-slate-400 leading-relaxed">
            東海エリアの外壁塗装をサポートする情報サービスです。
            <br />© 2024 Paint Net. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}
