import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '運営企業の実績 | Paint Net',
  description:
    'Paint Netを運営する岐阜のIT企業の広告運用・提携実績をご紹介します。大手企業との取引実績を通じて培った信頼で、安心できる外壁塗装会社のご紹介をしています。',
};

const WORKS = [
  {
    name: 'ナース専科',
    category: '看護師向け転職サービス',
    desc: '看護師向け転職サービスの広告運用に関わり、LP制作・広告クリエイティブ改善・送客導線の最適化を行ってきました。',
    initial: 'N',
    color: '#2563eb',
  },
  {
    name: 'レバレジーズグループ',
    category: '人材・転職系サービス',
    desc: '人材領域の広告案件に携わり、ユーザーの悩みに合わせた訴求設計やLP改善を行ってきました。',
    initial: 'L',
    color: '#0891b2',
  },
  {
    name: 'マイナビ薬剤師',
    category: '薬剤師向け転職サービス',
    desc: '薬剤師向け転職サービスの広告案件に関わり、転職希望者に分かりやすく情報を届ける広告運用を行ってきました。',
    initial: 'M',
    color: '#dc2626',
  },
  {
    name: 'RIZAP GOLF',
    category: 'ゴルフレッスン・スクール',
    desc: '高単価サービス領域の広告案件に携わり、ユーザーの不安を減らしながら行動につなげるLP・広告導線を設計してきました。',
    initial: 'R',
    color: '#16a34a',
  },
  {
    name: 'A8.net',
    category: 'ASP・成果報酬型広告',
    desc: 'A8.netを通じて、成果報酬型広告の運用に取り組んでいます。広告クリエイティブ、LP改善、送客導線の最適化を行い、ユーザーに分かりやすく情報を届ける広告運用を行っています。',
    initial: 'A',
    color: '#7c3aed',
  },
  {
    name: 'レントラックス',
    category: 'クローズドASP・成果報酬型広告',
    desc: 'レントラックス経由の広告案件にも取り組んでおり、人材・転職領域を中心に、ユーザーの悩みに合わせた訴求設計やLP改善を行っています。',
    initial: 'L',
    color: '#0f766e',
  },
];

const STRENGTHS = [
  'ユーザーに誤解を与えない分かりやすい訴求',
  '広告主・提携企業の信頼を損なわない運用',
  '数値を見ながらLP・広告クリエイティブを改善',
  'ユーザーと企業、どちらにもメリットがある導線設計',
];

export default function WorksPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800 antialiased" style={{ fontFamily: 'system-ui, sans-serif' }}>

      {/* ── ヘッダー ── */}
      <header
        className="sticky top-0 z-50"
        style={{
          backgroundColor: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(226,232,240,0.6)',
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <a href="/gaiheki-article" className="flex items-center gap-2 text-sm font-bold" style={{ color: '#0a1628' }}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polyline points="15 18 9 12 15 6" /></svg>
            記事LPに戻る
          </a>
          <span className="text-xs font-bold tracking-wider uppercase" style={{ color: '#ea580c' }}>Paint Net</span>
        </div>
      </header>

      {/* ── 1. ファーストビュー ── */}
      <section
        className="py-20 sm:py-28"
        style={{ background: 'linear-gradient(160deg, #0a1628 0%, #1a3a6b 55%, #1e4a8a 100%)' }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <span
            className="inline-block text-xs font-bold tracking-widest uppercase mb-5 px-4 py-1.5 rounded-full"
            style={{ background: 'rgba(249,115,22,0.2)', color: '#fb923c', border: '1px solid rgba(249,115,22,0.3)' }}
          >
            Company Works
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight tracking-tight mb-5">
            運営企業の実績
          </h1>
          <p className="text-base sm:text-lg text-blue-100 leading-relaxed mb-4">
            大手企業の広告案件や成果報酬型広告運用を通じて、
            <br className="hidden sm:block" />信頼できる集客支援を行っています。
          </p>
          <p className="text-sm text-blue-200 leading-relaxed max-w-xl mx-auto">
            Paint Netでは、外壁塗装を検討している方に安心してご相談いただけるよう、
            運営企業の実績も公開しています。
          </p>
        </div>
      </section>

      {/* ── 2. 広告運用・提携実績 ── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">

          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-1 h-5 rounded-full" style={{ background: 'linear-gradient(to bottom, #f97316, #ea580c)' }} />
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#ea580c' }}>Track Record</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: '#0a1628' }}>
              広告運用・提携実績
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-500 max-w-md mx-auto leading-relaxed">
              大手企業との取引を通じて、信頼性の高い広告運用の知見を積んできました。
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {WORKS.map(({ name, category, desc, initial, color }) => (
              <div
                key={name}
                className="rounded-2xl p-6 border hover:shadow-md transition-shadow duration-200"
                style={{ borderColor: '#e4ecf6', background: 'linear-gradient(135deg, #fafcff 0%, #f2f7ff 100%)' }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg font-black shadow-sm"
                    style={{ backgroundColor: color }}
                  >
                    {initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span
                      className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-full mb-2"
                      style={{ background: '#fff3e0', color: '#ea580c' }}
                    >
                      {category}
                    </span>
                    <p className="text-base font-bold mb-2" style={{ color: '#0a1628' }}>{name}</p>
                    <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. 代理店としての強み ── */}
      <section
        className="py-16 sm:py-24"
        style={{ background: 'linear-gradient(160deg, #f0f5fb 0%, #f6f9ff 100%)' }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6">

          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-1 h-5 rounded-full" style={{ background: 'linear-gradient(to bottom, #f97316, #ea580c)' }} />
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#ea580c' }}>Our Values</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: '#0a1628' }}>
              代理店として大切にしていること
            </h2>
          </div>

          <div className="space-y-3">
            {STRENGTHS.map((text, i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-2xl px-5 py-4 border"
                style={{
                  background: 'linear-gradient(135deg, #f0f5fb 0%, #eaf1fa 100%)',
                  borderColor: '#dce8f4',
                  boxShadow: '0 2px 10px rgba(10,22,40,0.06)',
                }}
              >
                <div
                  className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
                >
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <p className="text-sm sm:text-base font-semibold leading-snug" style={{ color: '#0f2040' }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. 代理店からのご依頼について ── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">

          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-1 h-5 rounded-full" style={{ background: 'linear-gradient(to bottom, #f97316, #ea580c)' }} />
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#ea580c' }}>For Agencies</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: '#0a1628' }}>
              代理店からのご依頼にも対応
            </h2>
          </div>

          <div
            className="rounded-2xl p-6 sm:p-8 border space-y-4"
            style={{ borderColor: '#e4ecf6', background: 'linear-gradient(135deg, #fafcff 0%, #f2f7ff 100%)' }}
          >
            {[
              '弊社では、ASPや広告代理店からお仕事をいただき、成果報酬型広告の運用・LP制作・広告クリエイティブ改善に取り組んでいます。',
              '単に広告を配信するだけではなく、ユーザーの悩みや検索意図に合わせて、分かりやすく信頼される導線を設計することを大切にしています。',
              'また、代理店や提携企業の信頼を損なわないよう、誤解を与える表現や過度な訴求は避け、長期的に運用できる広告設計を意識しています。',
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className="shrink-0 mt-1 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
                >
                  <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Paint Netとのつながり ── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div
            className="relative overflow-hidden rounded-3xl p-8 sm:p-10"
            style={{ background: 'linear-gradient(145deg, #0a1628 0%, #1a3a6b 55%, #1e4a8a 100%)' }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(249,115,22,0.15) 0%, transparent 50%)',
              }}
            />
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 rounded-full" style={{ background: 'linear-gradient(to bottom, #f97316, #ea580c)' }} />
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#fb923c' }}>Our Promise</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight tracking-tight mb-4">
                だからこそ、悪質な塗装店は紹介できません
              </h2>
              <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
                Paint Netは、広告運用や企業提携で培った信頼を大切にしている運営企業が管理しています。
                <br /><br />
                そのため、目先の紹介数だけを目的に、悪質な塗装店や不安のある業者をご紹介することはありません。
                <br /><br />
                地域密着で、安心して相談できる優良店のご紹介を大切にしています。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. CTA ── */}
      <section
        className="py-16 sm:py-20"
        style={{ background: 'linear-gradient(160deg, #f0f5fb 0%, #f6f9ff 100%)' }}
      >
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            外壁塗装のご相談は、記事LPからお気軽にどうぞ。
          </p>
          <a
            href="/gaiheki-article"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold text-white transition-all duration-150 hover:opacity-90 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              boxShadow: '0 4px 20px rgba(234,88,12,0.35)',
            }}
          >
            <svg className="w-4 h-4 shrink-0 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polyline points="9 18 15 12 9 6" /></svg>
            Paint Netの記事LPに戻る
          </a>
        </div>
      </section>

      {/* ── フッター ── */}
      <footer className="py-8 border-t" style={{ borderColor: '#e2e8f0', backgroundColor: '#f8fafc' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs text-slate-400">© 2025 Paint Net. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
