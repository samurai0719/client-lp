'use client';

import { useEffect, useRef } from 'react';

const COMPANY_ROWS = [
  { label: '屋号', value: 'リラクゼーションPT' },
  { label: '所在地', value: '岐阜県岐阜市真砂町３丁目１１' },
  { label: '対応エリア', value: '全国対応（出張施術）' },
  {
    label: '代表者経歴',
    value: [
      '中部学院大学 看護リハビリテーション学部 理学療法学科 卒業',
      '整形外科 勤務（3年）',
      '岐阜県サッカー部 トレーナー 歴任',
    ],
  },
  { label: 'サービス内容', value: '法人向け出張コンディションケア / 企業内整体 / 福利厚生支援' },
  { label: 'お問い合わせ', value: 'サービスページのフォームよりご連絡ください' },
];

const STORY_PARAGRAPHS = [
  {
    heading: '理学療法士として、現場で気づいたこと',
    body: '整形外科での勤務やサッカー部のトレーナー活動を通じて、私がずっと感じていたことがあります。それは、「体の不調は、仕事のパフォーマンスや気持ちにも、確実に影響する」ということです。痛みや疲れを抱えたまま働いていると、集中力が落ち、些細なことでイライラし、気づかないうちに心まで消耗していく。その悪循環を、多くの方が「仕方ない」と諦めながら過ごしています。',
  },
  {
    heading: '忙しい人こそ、ケアが届きにくい',
    body: '「整体に行きたいけど時間がない」「仕事が終わるとクタクタで、自分のケアまで回せない」—そういった声は、現場で本当によく耳にします。特に長時間勤務や立ち仕事、デスクワーク、身体介助といった負荷の大きい仕事に就いている方ほど、ケアを後回しにしてしまいがちです。私はそこに、大きな課題を感じていました。',
  },
  {
    heading: 'だから、こちらから届けに行く',
    body: 'リラクゼーションPTを立ち上げたのは、「待っていてもらうのではなく、必要な人のところに直接届ける」という考えからです。専門施術者がオフィスや職場に直接伺い、勤務の合間に短時間で受けられるコンディションケアを提供する—それが私たちの出張整体サービスの原点です。移動の手間なく、少ない時間でも「体が楽になった」を実感できる。そういう形でケアを届けたいと思っています。',
  },
  {
    heading: '単なるリラクゼーションではなく、医療・現場の知識を活かした施術を',
    body: '理学療法士として培った解剖学の知識や、整形外科・スポーツ現場でのリハビリ・コンディショニング経験を活かし、単なる気持ちよさで終わらない、根拠のある施術を提供します。痛みの原因にアプローチし、その場限りでなく「続けることで変わる」を目指した施術内容を心がけています。',
  },
  {
    heading: '続けやすさ、導入しやすさを何より大切に',
    body: '福利厚生や健康経営の取り組みは、「始められても続かない」が最も多い課題です。だからこそ、私たちは導入のハードルを下げることに真剣に取り組んでいます。専用設備は不要、スペースは会議室で十分、月1回・数名からのトライアルも可能。担当者様の負担を最小限に抑えながら、現場に馴染む形で定着できるサービスを目指しています。',
  },
  {
    heading: '働く人を支えることが、会社全体の活力になる',
    body: '社員ひとりひとりの体が整うことは、その人の生産性や気持ちだけでなく、チームの雰囲気や組織全体の活力にも確実につながります。「職場が自分のことを大切にしてくれている」という感覚は、離職防止にも、採用力の向上にも、静かながら強い影響を持ちます。私はそう信じているからこそ、法人向けのサービスとして、この出張ケアに取り組んでいます。',
  },
  {
    heading: '1社1社、1人1人に、丁寧に向き合いたい',
    body: '業種や職場環境はそれぞれ異なります。警備・IT・介護・製造・小売—どんな現場にも、それぞれの体の負担があり、それぞれに合ったケアがあります。大きな数字より、目の前の一人に真剣に向き合うこと。その積み重ねが、信頼につながると思っています。初めてのご相談から、導入後のフォローまで、丁寧に寄り添ってまいります。',
  },
];

export default function OfirakuLikeCompanyPage() {
  const fadeRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('in-view');
        });
      },
      { threshold: 0.08 }
    );
    fadeRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const addRef = (el: HTMLElement | null) => {
    if (el && !fadeRefs.current.includes(el)) fadeRefs.current.push(el);
  };

  return (
    <main className="min-h-screen overflow-x-hidden" style={{ background: '#f9f7f2', color: '#1c1917' }}>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section
        className="relative flex min-h-[60vh] items-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1a130a 0%, #2c1f0e 55%, #1a130a 100%)',
        }}
      >
        {/* 背景テクスチャ */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(212,173,114,0.07) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        {/* ゴールドグロー */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-[10%] top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(212,173,114,0.10) 0%, transparent 70%)' }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 left-[5%] h-[300px] w-[300px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(212,173,114,0.06) 0%, transparent 70%)' }}
        />

        <div className="relative mx-auto w-full max-w-7xl px-6 py-20 md:px-10 lg:py-28">
          {/* ラベル */}
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(212,173,114,0.40)',
              color: '#e8cc88',
              backdropFilter: 'blur(8px)',
            }}
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: '#d4ad72' }} />
            事業者概要
          </div>

          {/* 屋号 */}
          <h1
            className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
            style={{
              background: 'linear-gradient(90deg, #f5e9cc 0%, #d4ad72 50%, #c9a96e 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            リラクゼーションPT
          </h1>

          <p className="mt-5 max-w-lg text-base leading-8 md:text-lg" style={{ color: 'rgba(255,255,255,0.70)' }}>
            理学療法士の専門知識と現場経験を活かし、
            働く人の体と心を職場から支える出張コンディションケアを提供しています。
          </p>

          {/* 区切りアクセント */}
          <div
            className="mt-8 h-px w-20 rounded-full"
            style={{ background: 'linear-gradient(90deg, #d4ad72, transparent)' }}
          />
        </div>
      </section>

      {/* ── 写真エリア ───────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 pt-12 md:px-10">
        <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
          {/* メイン写真（16:9） */}
          <div
            className="relative aspect-[16/9] overflow-hidden rounded-[28px]"
            style={{
              background: 'linear-gradient(160deg,#f0e9d8 0%,#e5d8c0 100%)',
              border: '2px dashed #c9b48a',
              boxShadow: '0 8px 32px rgba(140,110,60,0.10)',
            }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full"
                style={{ background: 'rgba(255,255,255,0.55)', border: '2px dashed #c9ad80' }}
              >
                <span className="text-3xl opacity-30">📷</span>
              </div>
              <p className="text-sm font-semibold" style={{ color: '#a08060' }}>メイン写真を後から挿入できます</p>
              <p className="text-xs" style={{ color: '#b8a070' }}>推奨比率：16:9</p>
            </div>
          </div>

          {/* サブ写真（4:3） */}
          <div
            className="relative aspect-[4/3] overflow-hidden rounded-[28px] md:aspect-auto"
            style={{
              background: 'linear-gradient(160deg,#f5eedf 0%,#ede0c4 100%)',
              border: '2px dashed #c9b48a',
              boxShadow: '0 8px 32px rgba(140,110,60,0.08)',
              minHeight: '200px',
            }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full"
                style={{ background: 'rgba(255,255,255,0.55)', border: '2px dashed #c9ad80' }}
              >
                <span className="text-2xl opacity-30">📷</span>
              </div>
              <p className="text-xs font-semibold" style={{ color: '#a08060' }}>サブ写真を後から挿入できます</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 会社概要テーブル ─────────────────────────────── */}
      <section
        ref={addRef}
        className="section-fade mx-auto max-w-7xl px-6 py-16 md:px-10 lg:py-24"
      >
        <div className="mb-10">
          <span
            className="inline-block rounded-full px-4 py-1 text-sm font-semibold"
            style={{ background: '#f0e9d8', color: '#8a6d3e' }}
          >
            事業者概要
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl" style={{ color: '#1c1917' }}>
            基本情報
          </h2>
        </div>

        <div
          className="overflow-hidden rounded-[28px]"
          style={{
            border: '1.5px solid #d4c4a0',
            boxShadow: '0 12px 48px rgba(140,110,60,0.10)',
          }}
        >
          {COMPANY_ROWS.map((row, i) => (
            <div
              key={row.label}
              className="grid grid-cols-1 sm:grid-cols-[180px_1fr]"
              style={{
                background: i % 2 === 0 ? '#fff' : '#faf7f0',
                borderBottom: i < COMPANY_ROWS.length - 1 ? '1px solid #ede6d5' : 'none',
              }}
            >
              <dt
                className="px-7 py-5 text-xs font-bold uppercase tracking-widest sm:border-r"
                style={{ color: '#8a6d3e', borderColor: '#ede6d5' }}
              >
                {row.label}
              </dt>
              <dd className="px-7 py-5 text-sm leading-8 font-medium" style={{ color: '#3d3530' }}>
                {Array.isArray(row.value) ? (
                  <ul className="space-y-1">
                    {row.value.map((v) => (
                      <li key={v} className="flex items-start gap-2">
                        <span
                          className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                          style={{ background: '#d4ad72' }}
                        />
                        {v}
                      </li>
                    ))}
                  </ul>
                ) : (
                  row.value
                )}
              </dd>
            </div>
          ))}
        </div>
      </section>

      {/* ── 会社紹介 ─────────────────────────────────────── */}
      <section
        style={{ background: '#fff', borderTop: '1px solid #e5ddd0', borderBottom: '1px solid #e5ddd0' }}
      >
        <div
          ref={addRef}
          className="section-fade mx-auto max-w-7xl px-6 py-16 md:px-10 lg:py-24"
        >
          <div className="mb-12">
            <span
              className="inline-block rounded-full px-4 py-1 text-sm font-semibold"
              style={{ background: '#f0e9d8', color: '#8a6d3e' }}
            >
              私たちについて
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl" style={{ color: '#1c1917' }}>
              なぜ、このサービスを<br className="hidden sm:block" />届けたいのか
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {STORY_PARAGRAPHS.map((para, i) => (
              <article
                key={para.heading}
                className="group rounded-[24px] p-7 transition hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(160deg, #fffdf8 0%, #faf7f0 100%)',
                  border: '1px solid #e8dfc8',
                  boxShadow: '0 4px 20px rgba(140,110,60,0.06)',
                }}
              >
                {/* 番号アクセント */}
                <div
                  className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #f0e4c8 0%, #e0ceaa 100%)',
                    color: '#8a6d3e',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>

                <h3 className="mb-3 text-base font-bold leading-snug" style={{ color: '#1c1917' }}>
                  {para.heading}
                </h3>

                <div
                  className="mb-4 h-px w-8 rounded-full"
                  style={{ background: 'linear-gradient(90deg, #d4ad72, transparent)' }}
                />

                <p className="text-sm leading-8" style={{ color: '#57534e' }}>
                  {para.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── メッセージ & CTA ──────────────────────────────── */}
      <section
        ref={addRef}
        className="section-fade mx-auto max-w-7xl px-6 py-16 md:px-10 lg:py-24"
      >
        <div
          className="mx-auto max-w-3xl overflow-hidden rounded-[32px] p-10 text-center md:p-14"
          style={{
            background: 'linear-gradient(160deg, #2c1f0e 0%, #1a130a 100%)',
            border: '1.5px solid rgba(212,173,114,0.30)',
            boxShadow: '0 24px 72px rgba(26,19,10,0.30)',
          }}
        >
          {/* ゴールドライン */}
          <div
            className="mx-auto mb-8 h-px w-16 rounded-full"
            style={{ background: 'linear-gradient(90deg, transparent, #d4ad72, transparent)' }}
          />

          <span
            className="inline-block rounded-full px-4 py-1 text-xs font-bold uppercase tracking-widest"
            style={{
              background: 'rgba(212,173,114,0.12)',
              border: '1px solid rgba(212,173,114,0.35)',
              color: '#e8cc88',
            }}
          >
            Message
          </span>

          <h2 className="mt-6 text-2xl font-bold leading-snug tracking-tight md:text-3xl" style={{ color: '#ffffff' }}>
            まずは、気軽にご相談ください。
          </h2>

          <p className="mt-5 text-sm leading-8 md:text-base" style={{ color: 'rgba(255,255,255,0.68)' }}>
            「うちの職場でも導入できるかな」「どのくらいの費用がかかるの」—
            そんな漠然とした疑問でも大歓迎です。
            <br className="hidden sm:block" />
            強引な営業は一切行いません。
            <br className="hidden sm:block" />
            まずは御社の状況をお聞かせください。
            <br className="hidden sm:block" />
            1社1社に合った形で、丁寧にご提案します。
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="/ofiraku-like#contact"
              className="inline-flex items-center justify-center rounded-2xl px-8 py-4 text-base font-bold transition hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, #d4ad72 0%, #8a6d3e 100%)',
                color: '#fff',
                boxShadow: '0 8px 28px rgba(140,110,60,0.40)',
              }}
            >
              無料相談・お問い合わせ
            </a>
            <a
              href="/ofiraku-like"
              className="inline-flex items-center justify-center rounded-2xl px-8 py-4 text-base font-semibold transition hover:-translate-y-0.5"
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1.5px solid rgba(212,173,114,0.40)',
                color: '#e8cc88',
                backdropFilter: 'blur(8px)',
              }}
            >
              サービス詳細を見る
            </a>
          </div>

          {/* ゴールドライン */}
          <div
            className="mx-auto mt-8 h-px w-16 rounded-full"
            style={{ background: 'linear-gradient(90deg, transparent, #d4ad72, transparent)' }}
          />
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer style={{ background: '#fff', borderTop: '1px solid #e5ddd0' }}>
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-10 text-sm md:flex-row md:items-center md:justify-between md:px-10">
          <div>
            <p className="font-semibold" style={{ color: '#8a6d3e' }}>リラクゼーションPT</p>
            <p className="mt-1 text-xs" style={{ color: '#a09070' }}>© 2026 リラクゼーションPT. All rights reserved.</p>
          </div>
          <nav className="flex gap-5 text-sm" style={{ color: '#78716c' }}>
            <a href="/ofiraku-like" className="hover:underline" style={{ color: '#78716c' }}>サービスTOP</a>
            <a href="/ofiraku-like#flow" className="hover:underline" style={{ color: '#78716c' }}>導入の流れ</a>
            <a href="/ofiraku-like#contact" className="hover:underline" style={{ color: '#78716c' }}>お問い合わせ</a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
