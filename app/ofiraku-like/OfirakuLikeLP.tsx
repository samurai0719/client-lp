'use client';

import { useEffect, useRef } from 'react';

const PROBLEMS = [
  {
    icon: '💻',
    title: 'デスクワークによる慢性的な肩・首の不調',
    desc: '長時間の座り仕事で体に負荷が蓄積し、午後になるほど集中力が低下するという悩みを抱える企業が増えています。',
  },
  {
    icon: '🏢',
    title: '福利厚生を充実させたいが、何を選べばよいか分からない',
    desc: '社員に喜ばれる制度を導入したいものの、費用対効果や運用の手間から二の足を踏んでいるご担当者様が多くいらっしゃいます。',
  },
  {
    icon: '🔄',
    title: '離職や採用コストに頭を悩ませている',
    desc: '優秀な人材の定着率向上や採用力の強化に向けて、職場環境の改善策を模索している企業様からのご相談が増えています。',
  },
  {
    icon: '⏱️',
    title: '社員が自分のケアに時間を使えていない',
    desc: '業務の忙しさから整体やリフレッシュを後回しにしてしまい、気づけば心身の疲労が蓄積している状況が見受けられます。',
  },
];

const STRENGTHS = [
  {
    num: '01',
    title: 'オフィスに来るから、続けられる',
    desc: '移動の手間がなく、スキマ時間に受けられるため、継続率が高いのが特徴です。施術者が直接職場へ伺う出張型だからこそ、忙しい社員にも取り入れてもらいやすい設計です。',
    image: 'https://static.wixstatic.com/media/5ebda9_2c8b710fa01542c5b14638ec9081161b~mv2.png',
  },
  {
    num: '02',
    title: '経営層にも現場にも説明しやすい',
    desc: '健康経営・採用強化・離職防止など、複数の文脈でメリットを伝えられるため、社内稟議が通りやすい構成になっています。導入資料のご提供もサポートします。',
    image: null,
  },
  {
    num: '03',
    title: '小さなスペースから始められる',
    desc: '専用設備は不要で、会議室や休憩スペースを活用した導入が可能です。まずは月1回・数名からのトライアル実施にも対応していますので、リスクなくお試しいただけます。',
    image: null,
  },
];

const CASES = [
  {
    industry: 'ITベンチャー・スタートアップ',
    tag: '採用・定着強化',
    voice_staff: 'PCに向かう時間が長いので、首と肩の張りが慢性化していました。オフィスで受けられるようになってから、午後の集中力が明らかに変わった気がします。',
    voice_hr: '「健康に投資している会社」というイメージが採用面でも効いています。特に若い世代への訴求力が高く、面接時の話題にもなっています。',
  },
  {
    industry: '介護・医療福祉法人',
    tag: '現場の疲労ケア',
    voice_staff: '体を使う仕事なので疲れが抜けにくかったのですが、定期的にケアを受けられる環境になってから、気持ちの余裕が生まれています。',
    voice_hr: '離職率の改善を目的に導入しましたが、「職場が自分の体を気にかけてくれている」という雰囲気が、チームの雰囲気にも良い影響を与えていると感じています。',
  },
];

const FLOW = [
  { step: '01', title: 'まずはご相談', desc: 'フォームまたはお電話で、御社の状況やご要望をざっくばらんにお聞かせください。' },
  { step: '02', title: 'ヒアリング・現地確認', desc: '対象人数・スペース・希望頻度などをもとに、最適なプランをご提案します。' },
  { step: '03', title: 'プランご提案・合意', desc: '費用・スケジュール・実施内容を確認のうえ、合意後にご契約となります。' },
  { step: '04', title: '導入・定期実施スタート', desc: '初回日程を調整し、いよいよオフィスでのサービス提供が始まります。' },
];

const FAQS = [
  {
    q: 'どのくらいのスペースがあれば導入できますか？',
    a: '折り畳みベッド1台が置けるスペース（目安：2〜3畳程度）があれば対応可能です。会議室や休憩コーナーをご活用いただいているケースが多くあります。',
  },
  {
    q: '何名から利用できますか？また月に何回が目安ですか？',
    a: '1社あたりの最低人数は設けておりません。月1回・数名からのトライアル導入も承っております。継続的な効果を実感いただくために、月2回以上をおすすめしています。',
  },
  {
    q: '初期費用や設備投資は必要ですか？',
    a: 'こちらにご記載の内容は、実際のサービス条件に合わせて差し替えてください。初期費用・設備・無料体験の有無などを、御社のプランに沿ってご案内できます。',
  },
];

export default function OfirakuLikeLP() {
  const fadeRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.1 }
    );
    fadeRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const addRef = (el: HTMLElement | null) => {
    if (el && !fadeRefs.current.includes(el)) {
      fadeRefs.current.push(el);
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden" style={{ background: '#f9f7f2', color: '#1c1917' }}>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative flex min-h-[90vh] items-end overflow-hidden">

        {/* ── 背景画像 ── */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://static.wixstatic.com/media/5ebda9_de73cb17512f4dac8af81d87cc97a08a~mv2.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-[65%_30%] md:object-[70%_30%]"
          fetchPriority="high"
        />

        {/* ── グラデーションオーバーレイ（テキスト可読性） ── */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'linear-gradient(105deg, rgba(15,9,2,0.80) 0%, rgba(15,9,2,0.60) 55%, rgba(15,9,2,0.18) 100%)',
          }}
        />
        {/* 下部フェード */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-48"
          style={{ background: 'linear-gradient(to top, rgba(15,9,2,0.55) 0%, transparent 100%)' }}
        />
        {/* 左エッジ強調 */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-32 sm:w-64"
          style={{ background: 'linear-gradient(to right, rgba(15,9,2,0.30) 0%, transparent 100%)' }}
        />

        {/* ── コンテンツ ── */}
        <div className="relative mx-auto w-full max-w-7xl px-6 pb-16 pt-32 md:px-10 md:pb-20 lg:pb-28 lg:pt-40">

          {/* ラベル */}
          <div
            className="mb-7 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(212,173,114,0.55)',
              color: '#e8cc88',
              backdropFilter: 'blur(10px)',
            }}
          >
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: '#d4ad72' }} />
            法人向け 出張ウェルネスサービス
          </div>

          {/* メインキャッチコピー */}
          <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl xl:text-7xl" style={{ color: '#ffffff' }}>
            働く人の体を、
            <br />
            <span
              style={{
                background: 'linear-gradient(90deg, #e8cc88 0%, #d4ad72 50%, #c9a96e 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              職場から整える。
            </span>
          </h1>

          {/* サブコピー */}
          <p className="mt-6 max-w-lg text-base leading-8 md:text-lg" style={{ color: 'rgba(255,255,255,0.80)' }}>
            専門施術者がオフィスに直接伺い、短時間でも「楽になった」を実感できるコンディションケアを提供します。
            福利厚生・健康経営・採用強化など、複数の課題に同時にアプローチできる法人向けサービスです。
          </p>

          {/* CTAボタン */}
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#contact" className="wellness-cta-btn">
              <span className="wellness-cta-btn-inner">
                <span className="block text-center text-base font-bold leading-snug">
                  無料で出張整体を<br />体験してみる
                </span>
              </span>
              <span className="wellness-cta-shine" aria-hidden="true" />
            </a>
            <a
              href="#flow"
              className="inline-flex items-center justify-center rounded-2xl px-7 py-4 text-base font-semibold transition hover:-translate-y-0.5"
              style={{
                background: 'rgba(255,255,255,0.10)',
                border: '1.5px solid rgba(212,173,114,0.50)',
                color: '#e8cc88',
                backdropFilter: 'blur(8px)',
              }}
            >
              導入の流れを見る
            </a>
          </div>

          {/* 補足タグ */}
          <div className="mt-8 flex flex-wrap gap-3">
            {['初期費用0円から相談可能', '最短2週間で導入', '健康経営対応実績あり'].map((tag) => (
              <span
                key={tag}
                className="rounded-full px-4 py-1.5 text-sm font-medium"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.22)',
                  color: 'rgba(255,255,255,0.82)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                ✓ {tag}
              </span>
            ))}
          </div>

          {/* 補足カード */}
          <div className="mt-10 flex flex-wrap gap-3">
            {[
              { val: '★ 4.9', label: '導入企業 評価平均' },
              { val: '97%', label: '利用者満足度' },
              { val: '月2回〜', label: '実施ペース' },
              { val: '全国対応', label: '対応エリア' },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl px-5 py-3 text-center"
                style={{
                  background: 'rgba(255,255,255,0.09)',
                  border: '1px solid rgba(212,173,114,0.28)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <div className="text-base font-bold" style={{ color: '#e8cc88' }}>{s.val}</div>
                <div className="mt-0.5 text-xs" style={{ color: 'rgba(255,255,255,0.60)' }}>{s.label}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── PROBLEMS ─────────────────────────────────────── */}
      <section
        ref={addRef}
        className="section-fade mx-auto max-w-7xl px-6 py-16 md:px-10 lg:py-24"
      >
        <div className="mx-auto max-w-3xl text-center">
          <span
            className="inline-block rounded-full px-4 py-1 text-sm font-semibold"
            style={{ background: '#f0e9d8', color: '#8a6d3e' }}
          >
            こんな課題はありませんか
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl" style={{ color: '#1c1917' }}>
            多くの企業が抱える、<br className="hidden sm:block" />職場環境の悩み
          </h2>
          <p className="mt-4 text-base leading-8" style={{ color: '#78716c' }}>
            「社員の体調管理に投資したい」「定着率を上げたい」—そのご要望に応えるのが、オフィスに届くウェルネスサービスです。
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {PROBLEMS.map((item) => (
            <div
              key={item.title}
              className="group rounded-3xl p-6 transition hover:-translate-y-1"
              style={{
                background: '#fff',
                border: '1px solid #e8e0d0',
                boxShadow: '0 4px 20px rgba(140,110,60,0.06)',
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl text-xl"
                  style={{ background: '#faf3e6' }}
                >
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold" style={{ color: '#1c1917' }}>{item.title}</h3>
                  <p className="mt-2 text-sm leading-7" style={{ color: '#78716c' }}>{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── STRENGTHS ────────────────────────────────────── */}
      <section
        style={{ background: '#fff', borderTop: '1px solid #e5ddd0', borderBottom: '1px solid #e5ddd0' }}
      >
        <div
          ref={addRef}
          className="section-fade mx-auto max-w-7xl px-6 py-16 md:px-10 lg:py-24"
        >
          <div className="mx-auto max-w-2xl text-center">
            <span
              className="inline-block rounded-full px-4 py-1 text-sm font-semibold"
              style={{ background: '#f0e9d8', color: '#8a6d3e' }}
            >
              選ばれる理由
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl" style={{ color: '#1c1917' }}>
              継続されやすい、3つの設計ポイント
            </h2>
            <p className="mt-4 text-base leading-8" style={{ color: '#78716c' }}>
              「良さそうだけど続かない」をなくすために、導入しやすさ・伝わりやすさ・負担の少なさを意識した構成にしています。
            </p>
          </div>

          <div className="mt-14 grid gap-7 lg:grid-cols-3">
            {STRENGTHS.map((item) => (
              <article
                key={item.num}
                className="group rounded-[28px] transition hover:-translate-y-1"
                style={{
                  background: 'linear-gradient(180deg,#fff 0%,#faf8f3 100%)',
                  border: '1px solid #e5ddd0',
                  boxShadow: '0 8px 32px rgba(140,110,60,0.07)',
                  padding: '28px',
                }}
              >
                <div
                  className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-bold tracking-widest"
                  style={{ background: 'linear-gradient(135deg, #f0e4c8 0%, #e0ceaa 100%)', color: '#8a6d3e' }}
                >
                  {item.num}
                </div>
                <h3 className="text-lg font-bold leading-snug" style={{ color: '#1c1917' }}>{item.title}</h3>
                <p className="mt-3 text-sm leading-7" style={{ color: '#78716c' }}>{item.desc}</p>

                {/* photo area */}
                {item.image ? (
                  <div className="mt-6 aspect-[16/9] overflow-hidden rounded-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                ) : (
                  <div
                    className="mt-6 flex aspect-[16/9] items-center justify-center rounded-2xl text-center"
                    style={{ background: 'linear-gradient(160deg,#faf7f0 0%,#f0e9d8 100%)', border: '2px dashed #d4c4a0' }}
                  >
                    <div>
                      <div className="text-3xl opacity-25">📷</div>
                      <p className="mt-1 text-xs" style={{ color: '#b0a080' }}>写真・イラストを挿入</p>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CASES ────────────────────────────────────────── */}
      <section
        ref={addRef}
        className="section-fade mx-auto max-w-7xl px-6 py-16 md:px-10 lg:py-24"
      >
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          {/* Left */}
          <div>
            <span
              className="inline-block rounded-full px-4 py-1 text-sm font-semibold"
              style={{ background: '#f0e9d8', color: '#8a6d3e' }}
            >
              導入事例
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl" style={{ color: '#1c1917' }}>
              業種を問わず、<br />幅広い職場で活用中
            </h2>
            <p className="mt-4 text-base leading-8" style={{ color: '#78716c' }}>
              IT・製造・介護・小売など、さまざまな業種・規模の企業に導入いただいています。ここでは2つの活用例をご紹介します。
            </p>

            {/* photo placeholder */}
            <div
              className="mt-8 flex aspect-[4/3] items-center justify-center rounded-3xl text-center"
              style={{
                background: 'linear-gradient(160deg,#faf7f0 0%,#ede6d5 100%)',
                border: '2px dashed #c9b48a',
                boxShadow: '0 4px 20px rgba(140,110,60,0.06)',
              }}
            >
              <div>
                <div className="text-5xl opacity-25">📷</div>
                <p className="mt-2 text-sm font-semibold" style={{ color: '#a08060' }}>導入事例写真エリア</p>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-6">
            {CASES.map((item) => (
              <article
                key={item.industry}
                className="rounded-3xl"
                style={{
                  background: '#fff',
                  border: '1px solid #e5ddd0',
                  boxShadow: '0 6px 24px rgba(140,110,60,0.07)',
                  padding: '28px',
                }}
              >
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold" style={{ color: '#1c1917' }}>{item.industry}</h3>
                  <span
                    className="rounded-full px-3 py-0.5 text-xs font-semibold"
                    style={{ background: '#faf3e6', color: '#8a6d3e', border: '1px solid #e0ceaa' }}
                  >
                    {item.tag}
                  </span>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl p-5" style={{ background: '#faf7f0', border: '1px solid #ede6d5' }}>
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#8a6d3e' }}>スタッフの声</p>
                    <p className="mt-3 text-sm leading-7" style={{ color: '#57534e' }}>「{item.voice_staff}」</p>
                  </div>
                  <div className="rounded-2xl p-5" style={{ background: '#f7f7f5', border: '1px solid #e8e5e0' }}>
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#78716c' }}>導入ご担当者の声</p>
                    <p className="mt-3 text-sm leading-7" style={{ color: '#57534e' }}>「{item.voice_hr}」</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── FLOW ─────────────────────────────────────────── */}
      <section
        id="flow"
        style={{ background: '#fdfcf8', borderTop: '1px solid #e5ddd0', borderBottom: '1px solid #e5ddd0' }}
      >
        <div
          ref={addRef}
          className="section-fade mx-auto max-w-7xl px-6 py-16 md:px-10 lg:py-24"
        >
          <div className="mx-auto max-w-3xl text-center">
            <span
              className="inline-block rounded-full px-4 py-1 text-sm font-semibold"
              style={{ background: '#f0e9d8', color: '#8a6d3e' }}
            >
              ご利用の流れ
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl" style={{ color: '#1c1917' }}>
              ご相談から導入まで、<br className="hidden sm:block" />スムーズに進みます
            </h2>
            <p className="mt-4 text-base leading-8" style={{ color: '#78716c' }}>
              初回のご相談は無料です。まずはお気軽にお問い合わせください。
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FLOW.map((item, i) => (
              <div
                key={item.step}
                className="relative rounded-[28px] p-6"
                style={{
                  background: '#fff',
                  border: '1px solid #e5ddd0',
                  boxShadow: '0 4px 20px rgba(140,110,60,0.07)',
                }}
              >
                {/* connector */}
                {i < FLOW.length - 1 && (
                  <div
                    className="absolute -right-3 top-8 hidden h-0.5 w-6 lg:block"
                    style={{ background: 'linear-gradient(90deg,#d4ad72,transparent)' }}
                  />
                )}
                <div
                  className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
                  style={{ background: 'linear-gradient(135deg,#d4ad72 0%,#8a6d3e 100%)', color: '#fff' }}
                >
                  {item.step}
                </div>
                <h3 className="text-base font-bold" style={{ color: '#1c1917' }}>{item.title}</h3>
                <p className="mt-2 text-sm leading-7" style={{ color: '#78716c' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ + CONTACT ─────────────────────────────────── */}
      <section
        ref={addRef}
        className="section-fade mx-auto max-w-7xl px-6 py-16 md:px-10 lg:py-24"
      >
        <div className="grid gap-12 lg:grid-cols-[1fr_0.95fr] lg:items-start">
          {/* FAQ */}
          <div>
            <span
              className="inline-block rounded-full px-4 py-1 text-sm font-semibold"
              style={{ background: '#f0e9d8', color: '#8a6d3e' }}
            >
              よくあるご質問
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl" style={{ color: '#1c1917' }}>
              導入前のご不安を<br />解消します
            </h2>

            <div className="mt-8 space-y-4">
              {FAQS.map((item) => (
                <div
                  key={item.q}
                  className="rounded-[24px] p-6"
                  style={{
                    background: '#fff',
                    border: '1px solid #e5ddd0',
                    boxShadow: '0 2px 12px rgba(140,110,60,0.05)',
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold"
                      style={{ background: 'linear-gradient(135deg,#d4ad72,#8a6d3e)', color: '#fff' }}
                    >
                      Q
                    </span>
                    <h3 className="text-base font-bold leading-snug" style={{ color: '#1c1917' }}>{item.q}</h3>
                  </div>
                  <div className="mt-4 flex items-start gap-3">
                    <span
                      className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold"
                      style={{ background: '#f0e9d8', color: '#8a6d3e' }}
                    >
                      A
                    </span>
                    <p className="text-sm leading-7" style={{ color: '#78716c' }}>{item.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div
            id="contact"
            className="sticky top-8 rounded-[32px] p-8"
            style={{
              background: 'linear-gradient(160deg,#fffdf8 0%,#f5eedf 100%)',
              border: '1.5px solid #d4c4a0',
              boxShadow: '0 24px 64px rgba(140,110,60,0.16)',
            }}
          >
            <span
              className="inline-block rounded-full px-4 py-1 text-xs font-bold uppercase tracking-widest"
              style={{ background: '#fff', color: '#8a6d3e', border: '1px solid #d4ad72' }}
            >
              Contact
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight md:text-3xl" style={{ color: '#1c1917' }}>
              まずは気軽に<br />ご相談ください
            </h2>
            <p className="mt-3 text-sm leading-7" style={{ color: '#78716c' }}>
              料金・対応エリア・実施頻度など、ご状況に合わせてご案内します。
              以下のフォームはダミーです。実際のフォームや予約システムに差し替えてご利用ください。
            </p>

            <div className="mt-7 space-y-3">
              {[
                { label: '会社名', placeholder: '株式会社〇〇' },
                { label: 'ご担当者名', placeholder: '山田 太郎' },
                { label: 'メールアドレス', placeholder: 'info@example.com' },
              ].map((f) => (
                <div key={f.label}>
                  <label className="mb-1 block text-xs font-semibold" style={{ color: '#8a6d3e' }}>{f.label}</label>
                  <div
                    className="rounded-xl px-4 py-3 text-sm"
                    style={{
                      background: '#fff',
                      border: '1px solid #ddd5c0',
                      color: '#c0b090',
                    }}
                  >
                    {f.placeholder}
                  </div>
                </div>
              ))}
              <div>
                <label className="mb-1 block text-xs font-semibold" style={{ color: '#8a6d3e' }}>ご相談内容</label>
                <div
                  className="min-h-[80px] rounded-xl px-4 py-3 text-sm"
                  style={{ background: '#fff', border: '1px solid #ddd5c0', color: '#c0b090' }}
                >
                  例）社員20名、月2回の導入を検討しています
                </div>
              </div>

              <a
                href="#"
                className="wellness-cta-btn mt-2 block"
                style={{ maxWidth: '100%' }}
              >
                <span className="wellness-cta-btn-inner">
                  <span className="block text-center text-base font-bold leading-snug">
                    無料で出張整体を<br />体験してみる
                  </span>
                </span>
                <span className="wellness-cta-shine" aria-hidden="true" />
              </a>

              <p className="mt-2 text-center text-xs" style={{ color: '#b0a080' }}>
                ※ 強引な営業は一切行いません。ご安心ください。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer style={{ background: '#fff', borderTop: '1px solid #e5ddd0' }}>
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-10 text-sm md:flex-row md:items-center md:justify-between md:px-10">
          <div>
            <p className="font-semibold" style={{ color: '#8a6d3e' }}>Office Wellness</p>
            <p className="mt-1 text-xs" style={{ color: '#a09070' }}>© 2026 Office Wellness. All rights reserved.</p>
          </div>
          <nav className="flex gap-5 text-sm" style={{ color: '#78716c' }}>
            <a href="#" className="hover:underline" style={{ color: '#78716c' }}>会社概要</a>
            <a href="#" className="hover:underline" style={{ color: '#78716c' }}>プライバシーポリシー</a>
            <a href="#contact" className="hover:underline" style={{ color: '#78716c' }}>お問い合わせ</a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
