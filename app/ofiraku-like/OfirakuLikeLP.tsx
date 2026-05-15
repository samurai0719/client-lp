'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

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
    image: 'https://static.wixstatic.com/media/5ebda9_b4cb541035394717ae1f7655408a0217~mv2.png',
  },
  {
    num: '03',
    title: '小さなスペースから始められる',
    desc: '専用設備は不要で、会議室や休憩スペースを活用した導入が可能です。まずは月1回・数名からのトライアル実施にも対応していますので、リスクなくお試しいただけます。',
    image: 'https://static.wixstatic.com/media/5ebda9_247aab7ff264494aac66d92736f611de~mv2.png',
  },
];

const VOICES = [
  {
    industry: '警備会社',
    tag: '福利厚生・現場ケア',
    title: '警備会社の声',
    body: '長時間勤務や立ち仕事が多い職場ですが、勤務の合間に受けやすいと社員からとても好評です。導入前は「忙しい現場に合うか不安」という声もありましたが、実際にはスキマ時間で利用できるため継続する社員が増えました。「体が楽になっただけでなく、気持ちの余裕も生まれた」との声も届いており、福利厚生として導入して本当に良かったと感じています。',
    role: '警備会社 人事担当',
  },
  {
    industry: 'IT企業',
    tag: '肩・首ケア・社員満足度',
    title: 'IT企業の声',
    body: 'デスクワーク中心の職場で、肩や首の不調を訴えるスタッフが多く悩んでいました。リフレッシュ施策の一環として試験導入したところ、「オフィスで受けられる手軽さが続けやすい」と好評で、社員満足度が目に見えて上がりました。健康経営への取り組みとして社外へのアピールにもつながり、採用面接時の話題にもなっています。',
    role: 'IT系スタートアップ 総務責任者',
  },
  {
    industry: '介護系企業',
    tag: 'スタッフ定着・疲労軽減',
    title: '介護系企業の声',
    body: '身体的負担の大きい現場では、スタッフの疲労やモチベーション維持が長年の課題でした。短時間で受けられるため忙しいシフトの中でも取り入れやすく、「職場が自分の体を気にかけてくれている」という安心感がスタッフに生まれています。定着率の改善はもちろん、チームの雰囲気も明るくなったと感じています。',
    role: '介護福祉法人 施設長',
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
    a: '折り畳みベッド1台が置けるスペース（目安：2〜3畳程度）があれば対応可能です。会議室や休憩コーナーをご活用いただいているケースが多くあります。ベッドは持参しますので、特別な備品のご用意は不要です。',
  },
  {
    q: '何名から利用できますか？また月に何回が目安ですか？',
    a: '最低人数は設けておりません。月1回・数名からのトライアル導入も承っております。継続的な効果を実感いただくために、月2回以上をおすすめしています。',
  },
  {
    q: '料金はどのくらいかかりますか？',
    a: '7,000円／時間（税込）です。3時間で21,000円、4時間で28,000円が目安です。交通費は移動距離により応相談となります。まずはお気軽にご相談ください。',
  },
  {
    q: '本サービスは医療行為ですか？',
    a: '本サービスは医療行為・治療目的ではなく、予防・健康支援として提供しています。日々のコンディション維持や疲労ケアを目的としたサービスです。',
  },
  {
    q: '福利厚生として就業規則に組み込めますか？',
    a: '福利厚生として運用しやすい設計になっています。導入にあたっては、就業規則・福利厚生規程・顧問税理士への確認を推奨しています。運用方法についても導入前にご相談いただけます。',
  },
];

const SERVICE_STEPS = [
  {
    num: '01',
    title: 'ヒアリング・簡易チェック',
    desc: '不調部位・姿勢・動きのクセなどを確認します。お身体の状態を把握したうえで、その日の施術内容を調整します。',
  },
  {
    num: '02',
    title: 'コンディショニング',
    desc: 'ストレッチ・可動域改善・筋緊張へのアプローチ・動作のクセの修正など、お一人おひとりの状態に合わせて対応します。',
  },
  {
    num: '03',
    title: 'セルフケア指導',
    desc: '職場や自宅でも継続できる簡単なメニューや注意点をお伝えします。施術の効果を日常でも維持できるようにサポートします。',
  },
];

const SCHEDULE_ROWS = [
  { hours: '3時間', min30: '5〜6名', min60: '3名', note: '' },
  { hours: '4時間', min30: '7〜8名', min60: '4名', note: '' },
  { hours: '6〜7時間（1日）', min30: '12〜14名', min60: '6〜7名', note: '休憩含む' },
];

const AREAS = ['岐阜市', '各務原市', '羽島市', '岐南町', '笠松町', '瑞穂市', '一宮市'];

const WELFARE_ROWS = [
  { label: '対象', value: '全従業員（希望者が公平に利用できる形）' },
  { label: 'ルール例', value: '月1回まで・30分枠・会社負担上限○円など上限設定' },
  { label: '予約管理', value: '総務部で一元管理。紙・Excel・Googleフォーム等でも対応可' },
  { label: '会社負担', value: '福利厚生費として計上しやすい設計。顧問税理士・就業規則との事前確認を推奨' },
];

const PREPARE_LIST = [
  '会議室など、ベッド1台が置けるスペース（2〜3畳程度）',
  '予約管理は紙・Excel・Googleフォームなど、運用しやすい方法でOK',
  'ベッドは持参します。特別な備品のご用意は不要です',
];

export default function OfirakuLikeLP() {
  const fadeRefs = useRef<(HTMLElement | null)[]>([]);
  const [voiceIndex, setVoiceIndex] = useState(0);
  const prevVoice = () => setVoiceIndex((i) => (i - 1 + VOICES.length) % VOICES.length);
  const nextVoice = () => setVoiceIndex((i) => (i + 1) % VOICES.length);

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

      {/* ── HEADER ───────────────────────────────────────── */}
      <header
        className="fixed inset-x-0 top-0 z-50"
        style={{
          background: 'rgba(255,255,255,0.92)',
          borderBottom: '1px solid #e8dfc8',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
        }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center px-6 md:px-10">
          {/* ロゴ + 屋号 */}
          <a href="/ofiraku-like" className="flex items-center gap-3 select-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://static.wixstatic.com/media/5ebda9_e0c04a2a8b2242c19ce4205e82c291c4~mv2.png"
              alt="リラクゼーションPT ロゴ"
              className="h-9 w-auto object-contain md:h-10"
            />
            <span
              className="text-base font-bold tracking-wide md:text-lg"
              style={{ color: '#3d2a12' }}
            >
              リラクゼーション<span style={{ color: '#8a6d3e' }}>PT</span>
            </span>
          </a>

          {/* 右側ナビ（CTAリンクのみ） */}
          <div className="ml-auto hidden sm:flex items-center gap-5">
            <a
              href="#flow"
              className="text-sm font-medium transition hover:opacity-70"
              style={{ color: '#78716c' }}
            >
              導入の流れ
            </a>
            <a
              href="#contact"
              className="rounded-full px-5 py-2 text-sm font-bold transition hover:opacity-80"
              style={{
                background: 'linear-gradient(135deg,#d4ad72 0%,#8a6d3e 100%)',
                color: '#fff',
                boxShadow: '0 2px 10px rgba(140,110,60,0.25)',
              }}
            >
              無料相談
            </a>
          </div>
        </div>
      </header>

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

      {/* ── SERVICE CONTENT ─────────────────────────────── */}
      <section
        style={{ background: '#fdfcf8', borderTop: '1px solid #e5ddd0', borderBottom: '1px solid #e5ddd0' }}
      >
        <div
          ref={addRef}
          className="section-fade mx-auto max-w-7xl px-6 py-16 md:px-10 lg:py-24"
        >
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            {/* Left */}
            <div>
              <span
                className="inline-block rounded-full px-4 py-1 text-sm font-semibold"
                style={{ background: '#f0e9d8', color: '#8a6d3e' }}
              >
                提供内容
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl" style={{ color: '#1c1917' }}>
                1人 30分〜1時間で、<br className="hidden sm:block" />体の変化を実感
              </h2>
              <p className="mt-4 text-base leading-8" style={{ color: '#78716c' }}>
                デスクワーク・現場作業どちらにも対応。肩こり・腰痛・疲労の予防から、日々のパフォーマンス維持まで、理学療法士が丁寧に対応します。
              </p>
              <p className="mt-4 text-sm leading-7" style={{ color: '#78716c' }}>
                時間配分は30分コース・60分コースなど、職場の運用に合わせて柔軟に調整可能です。
              </p>
              <div
                className="mt-6 rounded-2xl px-6 py-4"
                style={{ background: '#faf3e6', border: '1px solid #e0ceaa' }}
              >
                <p className="text-sm font-semibold" style={{ color: '#8a6d3e' }}>
                  ※ 本サービスは医療行為・治療目的ではなく、予防・健康支援として提供しています
                </p>
              </div>
            </div>

            {/* Right: Steps */}
            <div className="space-y-5">
              {SERVICE_STEPS.map((s) => (
                <div
                  key={s.num}
                  className="flex gap-5 rounded-[24px] p-6"
                  style={{
                    background: '#fff',
                    border: '1px solid #e5ddd0',
                    boxShadow: '0 4px 16px rgba(140,110,60,0.06)',
                  }}
                >
                  <div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl text-sm font-bold"
                    style={{ background: 'linear-gradient(135deg,#f0e4c8 0%,#e0ceaa 100%)', color: '#8a6d3e' }}
                  >
                    {s.num}
                  </div>
                  <div>
                    <h3 className="text-base font-bold" style={{ color: '#1c1917' }}>{s.title}</h3>
                    <p className="mt-2 text-sm leading-7" style={{ color: '#78716c' }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 画像プレースホルダー（全幅） */}
          <div
            className="flex aspect-[16/9] items-center justify-center rounded-[24px] text-center"
            style={{
              background: 'linear-gradient(160deg,#faf7f0 0%,#f0e9d8 100%)',
              border: '2px dashed #d4c4a0',
              boxShadow: '0 4px 16px rgba(140,110,60,0.06)',
            }}
          >
            <div>
              <div className="text-4xl opacity-20">📷</div>
              <p className="mt-2 text-sm font-semibold" style={{ color: '#a08060' }}>写真を後から挿入できます</p>
              <p className="mt-1 text-xs" style={{ color: '#b8a070' }}>施術シーンなどのイメージ写真</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SCHEDULE & PRICING ───────────────────────────── */}
      <section
        ref={addRef}
        className="section-fade mx-auto max-w-7xl px-6 py-16 md:px-10 lg:py-24"
      >
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">

          {/* Schedule */}
          <div>
            <span
              className="inline-block rounded-full px-4 py-1 text-sm font-semibold"
              style={{ background: '#f0e9d8', color: '#8a6d3e' }}
            >
              実施イメージ
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl" style={{ color: '#1c1917' }}>
              何名・何時間で<br className="hidden sm:block" />受けられる？
            </h2>
            <p className="mt-4 text-sm leading-7" style={{ color: '#78716c' }}>
              訪問時間と対応人数の目安です。職場の規模に合わせてプランをご相談ください。
            </p>

            <div
              className="mt-8 overflow-hidden rounded-[24px]"
              style={{ border: '1.5px solid #d4c4a0', boxShadow: '0 8px 28px rgba(140,110,60,0.08)' }}
            >
              {/* Table header */}
              <div
                className="grid grid-cols-[1fr_1fr_1fr] px-6 py-3 text-xs font-bold uppercase tracking-widest"
                style={{ background: 'linear-gradient(90deg,#f0e4c8,#e8d9b5)', color: '#8a6d3e' }}
              >
                <span>訪問時間</span>
                <span className="text-center">30分枠</span>
                <span className="text-center">60分枠</span>
              </div>
              {SCHEDULE_ROWS.map((row, i) => (
                <div
                  key={row.hours}
                  className="grid grid-cols-[1fr_1fr_1fr] items-center px-6 py-4"
                  style={{
                    background: i % 2 === 0 ? '#fff' : '#faf7f0',
                    borderTop: '1px solid #ede6d5',
                  }}
                >
                  <div>
                    <span className="text-sm font-bold" style={{ color: '#1c1917' }}>{row.hours}</span>
                    {row.note && (
                      <span className="ml-2 text-xs" style={{ color: '#a08060' }}>（{row.note}）</span>
                    )}
                  </div>
                  <div className="text-center">
                    <span
                      className="inline-block rounded-full px-3 py-1 text-sm font-bold"
                      style={{ background: '#faf3e6', color: '#8a6d3e', border: '1px solid #e0ceaa' }}
                    >
                      {row.min30}
                    </span>
                  </div>
                  <div className="text-center">
                    <span
                      className="inline-block rounded-full px-3 py-1 text-sm font-bold"
                      style={{ background: '#f0e9d8', color: '#7a5f30', border: '1px solid #d4c4a0' }}
                    >
                      {row.min60}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* 画像プレースホルダー */}
            <div
              className="mt-6 flex aspect-[16/9] items-center justify-center rounded-[24px] text-center"
              style={{
                background: 'linear-gradient(160deg,#faf7f0 0%,#f0e9d8 100%)',
                border: '2px dashed #d4c4a0',
                boxShadow: '0 4px 16px rgba(140,110,60,0.06)',
              }}
            >
              <div>
                <div className="text-4xl opacity-20">📷</div>
                <p className="mt-2 text-sm font-semibold" style={{ color: '#a08060' }}>写真を後から挿入できます</p>
                <p className="mt-1 text-xs" style={{ color: '#b8a070' }}>実施風景・会場イメージなど</p>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <span
              className="inline-block rounded-full px-4 py-1 text-sm font-semibold"
              style={{ background: '#f0e9d8', color: '#8a6d3e' }}
            >
              料金
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl" style={{ color: '#1c1917' }}>
              明快な<br className="hidden sm:block" />料金体系
            </h2>

            {/* Base rate card */}
            <div
              className="mt-8 rounded-[24px] p-7"
              style={{
                background: 'linear-gradient(160deg,#2c1f0e 0%,#1a130a 100%)',
                border: '1.5px solid rgba(212,173,114,0.35)',
                boxShadow: '0 12px 40px rgba(26,19,10,0.22)',
              }}
            >
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#e8cc88' }}>基本料金</p>
              <div className="mt-3 flex items-end gap-2">
                <span className="text-4xl font-bold" style={{ color: '#fff' }}>7,000</span>
                <span className="mb-1 text-base" style={{ color: 'rgba(255,255,255,0.65)' }}>円 / 時間（税込）</span>
              </div>
              <div
                className="mt-4 h-px w-full"
                style={{ background: 'rgba(212,173,114,0.25)' }}
              />
              <div className="mt-4 space-y-2">
                {[
                  { label: '3時間', price: '21,000円' },
                  { label: '4時間', price: '28,000円' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>{item.label}</span>
                    <span className="text-base font-bold" style={{ color: '#e8cc88' }}>{item.price}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="mt-4 rounded-2xl px-5 py-4"
              style={{ background: '#faf3e6', border: '1px solid #e0ceaa' }}
            >
              <p className="text-sm" style={{ color: '#78716c' }}>
                ※ 交通費は移動距離により応相談です。まずはお気軽にご連絡ください。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── WELFARE OPERATIONS ───────────────────────────── */}
      <section
        style={{ background: '#fff', borderTop: '1px solid #e5ddd0', borderBottom: '1px solid #e5ddd0' }}
      >
        <div
          ref={addRef}
          className="section-fade mx-auto max-w-7xl px-6 py-16 md:px-10 lg:py-24"
        >
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start">
            {/* Left */}
            <div>
              <span
                className="inline-block rounded-full px-4 py-1 text-sm font-semibold"
                style={{ background: '#f0e9d8', color: '#8a6d3e' }}
              >
                福利厚生として運用
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl" style={{ color: '#1c1917' }}>
                社内制度として<br className="hidden sm:block" />導入しやすい設計
              </h2>
              <p className="mt-4 text-base leading-8" style={{ color: '#78716c' }}>
                「福利厚生として全社員に公平に利用してもらいたい」というご要望に応えられるよう、運用しやすい形で設計しています。
              </p>

              {/* Operation table */}
              <div
                className="mt-8 overflow-hidden rounded-[24px]"
                style={{ border: '1.5px solid #d4c4a0', boxShadow: '0 6px 24px rgba(140,110,60,0.07)' }}
              >
                {WELFARE_ROWS.map((row, i) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-1 sm:grid-cols-[120px_1fr]"
                    style={{
                      background: i % 2 === 0 ? '#fff' : '#faf7f0',
                      borderBottom: i < WELFARE_ROWS.length - 1 ? '1px solid #ede6d5' : 'none',
                    }}
                  >
                    <dt
                      className="px-5 py-4 text-xs font-bold uppercase tracking-widest sm:border-r"
                      style={{ color: '#8a6d3e', borderColor: '#ede6d5' }}
                    >
                      {row.label}
                    </dt>
                    <dd className="px-5 py-4 text-sm leading-7" style={{ color: '#3d3530' }}>
                      {row.value}
                    </dd>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: 会社側で用意するもの */}
            <div>
              <span
                className="inline-block rounded-full px-4 py-1 text-sm font-semibold"
                style={{ background: '#f0e9d8', color: '#8a6d3e' }}
              >
                会社側でご用意いただくもの
              </span>
              <h2 className="mt-4 text-2xl font-bold tracking-tight md:text-3xl" style={{ color: '#1c1917' }}>
                準備の手間を<br />最小限に
              </h2>
              <p className="mt-4 text-base leading-8" style={{ color: '#78716c' }}>
                特別な設備や備品は不要です。シンプルな準備で始められます。
              </p>

              <div className="mt-8 space-y-4">
                {PREPARE_LIST.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 rounded-[20px] p-5"
                    style={{
                      background: 'linear-gradient(160deg,#fffdf8 0%,#faf7f0 100%)',
                      border: '1px solid #e8dfc8',
                      boxShadow: '0 2px 10px rgba(140,110,60,0.05)',
                    }}
                  >
                    <span
                      className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold"
                      style={{ background: 'linear-gradient(135deg,#d4ad72,#8a6d3e)', color: '#fff' }}
                    >
                      ✓
                    </span>
                    <p className="text-sm leading-7" style={{ color: '#57534e' }}>{item}</p>
                  </div>
                ))}
              </div>

              <div
                className="mt-6 rounded-2xl px-6 py-5"
                style={{ background: '#faf3e6', border: '1px solid #e0ceaa' }}
              >
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#8a6d3e' }}>導入前の確認推奨事項</p>
                <p className="text-sm leading-7" style={{ color: '#78716c' }}>
                  就業規則・福利厚生規程の確認、および顧問税理士へのご相談をおすすめしています。導入方法についてはご相談時に詳しくご説明します。
                </p>
              </div>

              {/* 画像プレースホルダー */}
              <div
                className="mt-6 flex aspect-[16/9] items-center justify-center rounded-[24px] text-center"
                style={{
                  background: 'linear-gradient(160deg,#faf7f0 0%,#f0e9d8 100%)',
                  border: '2px dashed #d4c4a0',
                  boxShadow: '0 4px 16px rgba(140,110,60,0.06)',
                }}
              >
                <div>
                  <div className="text-4xl opacity-20">📷</div>
                  <p className="mt-2 text-sm font-semibold" style={{ color: '#a08060' }}>写真を後から挿入できます</p>
                  <p className="mt-1 text-xs" style={{ color: '#b8a070' }}>導入オフィス・運用イメージなど</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AREA & PROFILE ───────────────────────────────── */}
      <section
        ref={addRef}
        className="section-fade mx-auto max-w-7xl px-6 py-16 md:px-10 lg:py-24"
      >
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start">

          {/* Area */}
          <div>
            <span
              className="inline-block rounded-full px-4 py-1 text-sm font-semibold"
              style={{ background: '#f0e9d8', color: '#8a6d3e' }}
            >
              対応エリア・時間
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl" style={{ color: '#1c1917' }}>
              岐阜・愛知エリアを<br className="hidden sm:block" />中心に対応
            </h2>
            <p className="mt-4 text-base leading-8" style={{ color: '#78716c' }}>
              下記エリアを中心に対応しています。記載エリア以外もお気軽にご相談ください。
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {AREAS.map((area) => (
                <span
                  key={area}
                  className="rounded-full px-4 py-2 text-sm font-semibold"
                  style={{
                    background: '#fff',
                    border: '1.5px solid #d4c4a0',
                    color: '#57534e',
                    boxShadow: '0 2px 8px rgba(140,110,60,0.07)',
                  }}
                >
                  {area}
                </span>
              ))}
              <span
                className="rounded-full px-4 py-2 text-sm font-semibold"
                style={{
                  background: '#faf3e6',
                  border: '1.5px solid #e0ceaa',
                  color: '#8a6d3e',
                }}
              >
                その他エリアも相談可
              </span>
            </div>

            <div
              className="mt-6 flex items-center gap-4 rounded-[20px] p-5"
              style={{
                background: 'linear-gradient(160deg,#fffdf8 0%,#faf7f0 100%)',
                border: '1px solid #e8dfc8',
              }}
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#8a6d3e' }}>対応時間</p>
                <p className="text-base font-bold" style={{ color: '#1c1917' }}>平日 昼 / 夜 対応可</p>
              </div>
            </div>

            {/* 画像プレースホルダー */}
            <div
              className="mt-6 flex aspect-[16/9] items-center justify-center rounded-[24px] text-center"
              style={{
                background: 'linear-gradient(160deg,#faf7f0 0%,#f0e9d8 100%)',
                border: '2px dashed #d4c4a0',
                boxShadow: '0 4px 16px rgba(140,110,60,0.06)',
              }}
            >
              <div>
                <div className="text-4xl opacity-20">📷</div>
                <p className="mt-2 text-sm font-semibold" style={{ color: '#a08060' }}>写真を後から挿入できます</p>
                <p className="mt-1 text-xs" style={{ color: '#b8a070' }}>対応エリアのイメージ写真など</p>
              </div>
            </div>
          </div>

          {/* Profile */}
          <div>
            <span
              className="inline-block rounded-full px-4 py-1 text-sm font-semibold"
              style={{ background: '#f0e9d8', color: '#8a6d3e' }}
            >
              担当プロフィール
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl" style={{ color: '#1c1917' }}>
              理学療法士が<br className="hidden sm:block" />直接担当します
            </h2>

            {/* プロフィール写真プレースホルダー */}
            <div
              className="mt-8 flex aspect-[4/3] items-center justify-center rounded-[24px] text-center"
              style={{
                background: 'linear-gradient(160deg,#f0e9d8 0%,#e5d8c0 100%)',
                border: '2px dashed #c9b48a',
                boxShadow: '0 4px 16px rgba(140,110,60,0.08)',
              }}
            >
              <div>
                <div className="text-4xl opacity-20">📷</div>
                <p className="mt-2 text-sm font-semibold" style={{ color: '#a08060' }}>プロフィール写真を後から挿入できます</p>
                <p className="mt-1 text-xs" style={{ color: '#b8a070' }}>担当者のお顔写真など</p>
              </div>
            </div>

            <div
              className="mt-6 overflow-hidden rounded-[28px]"
              style={{
                background: 'linear-gradient(160deg,#fffdf8 0%,#f5eedf 100%)',
                border: '1.5px solid #d4c4a0',
                boxShadow: '0 12px 40px rgba(140,110,60,0.10)',
              }}
            >
              <div
                className="px-7 py-5"
                style={{ background: 'linear-gradient(90deg,#2c1f0e,#3d2a12)', borderBottom: '1px solid rgba(212,173,114,0.20)' }}
              >
                <p
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: '#e8cc88' }}
                >
                  リラクゼーションPT
                </p>
                <p className="mt-1 text-lg font-bold" style={{ color: '#fff' }}>理学療法士</p>
              </div>
              <div className="divide-y px-7" style={{ borderColor: '#ede6d5' }}>
                {[
                  { label: '保有資格', value: '理学療法士' },
                  { label: '職歴', value: '整形外科 3年勤務' },
                  { label: '実績', value: '高校サッカー部 トレーナー' },
                  { label: '得意領域', value: '肩・腰・下肢のコンディショニング、姿勢・動作アドバイス' },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4 py-4">
                    <dt className="w-24 flex-shrink-0 text-xs font-bold" style={{ color: '#8a6d3e' }}>{item.label}</dt>
                    <dd className="text-sm leading-7" style={{ color: '#3d3530' }}>{item.value}</dd>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VOICES SLIDER ────────────────────────────────── */}
      <section
        ref={addRef}
        className="section-fade mx-auto max-w-7xl px-6 py-16 md:px-10 lg:py-24"
      >
        <div className="mx-auto max-w-3xl text-center">
          <span
            className="inline-block rounded-full px-4 py-1 text-sm font-semibold"
            style={{ background: '#f0e9d8', color: '#8a6d3e' }}
          >
            導入会社の声
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl" style={{ color: '#1c1917' }}>
            さまざまな業種で、<br className="hidden sm:block" />喜ばれています
          </h2>
          <p className="mt-4 text-base leading-8" style={{ color: '#78716c' }}>
            警備・IT・介護など、業種を問わず幅広い職場でご活用いただいています。
          </p>
        </div>

        {/* Slider */}
        <div className="mt-12 flex items-center gap-3 md:gap-5">

          {/* Prev button */}
          <button
            onClick={prevVoice}
            aria-label="前へ"
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full transition hover:scale-110 active:scale-95"
            style={{
              background: 'linear-gradient(135deg,#f5eedf 0%,#ede0c4 100%)',
              border: '1.5px solid #d4c4a0',
              boxShadow: '0 4px 16px rgba(140,110,60,0.14)',
              color: '#8a6d3e',
              fontSize: '22px',
              lineHeight: 1,
            }}
          >
            ‹
          </button>

          {/* Card */}
          <div
            key={voiceIndex}
            className="min-w-0 flex-1 overflow-hidden rounded-[32px]"
            style={{
              background: 'linear-gradient(160deg,#fffdf8 0%,#f5eedf 100%)',
              border: '1.5px solid #d4c4a0',
              boxShadow: '0 16px 56px rgba(140,110,60,0.13)',
              animation: 'voiceFadeIn 0.4s ease',
            }}
          >
            <div className="grid md:grid-cols-[1fr_1.3fr]">

              {/* Image placeholder — 16:9 on mobile, fills column height on desktop */}
              <div
                className="relative aspect-[16/9] overflow-hidden md:aspect-auto"
                style={{
                  background: 'linear-gradient(160deg,#f0e9d8 0%,#e5d8c0 100%)',
                  borderBottom: '1.5px solid #d4c4a0',
                }}
              >
                {/* desktop: right border instead of bottom border */}
                <div
                  className="pointer-events-none absolute inset-y-0 right-0 hidden w-px md:block"
                  style={{ background: '#d4c4a0' }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6">
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-full"
                    style={{
                      background: 'rgba(255,255,255,0.5)',
                      border: '2px dashed #c9ad80',
                    }}
                  >
                    <span className="text-3xl opacity-30">📷</span>
                  </div>
                  <p className="text-center text-xs font-semibold" style={{ color: '#a08060' }}>
                    画像は後から挿入します
                  </p>
                  <span
                    className="rounded-full px-3 py-1 text-xs font-bold"
                    style={{ background: 'rgba(255,255,255,0.65)', color: '#8a6d3e', border: '1px solid #d4c4a0' }}
                  >
                    {VOICES[voiceIndex].tag}
                  </span>
                </div>
              </div>

              {/* Text content */}
              <div className="flex flex-col justify-center p-8 md:p-10">
                <h3
                  className="text-xl font-bold tracking-tight md:text-2xl"
                  style={{ color: '#1c1917' }}
                >
                  {VOICES[voiceIndex].title}
                </h3>
                <div
                  className="mt-1 h-0.5 w-10 rounded-full"
                  style={{ background: 'linear-gradient(90deg,#d4ad72,#c9a96e)' }}
                />
                <p className="mt-5 text-sm leading-8 md:text-base" style={{ color: '#57534e' }}>
                  「{VOICES[voiceIndex].body}」
                </p>
                <p className="mt-5 text-xs font-semibold tracking-widest" style={{ color: '#8a6d3e' }}>
                  — {VOICES[voiceIndex].role}
                </p>
              </div>
            </div>
          </div>

          {/* Next button */}
          <button
            onClick={nextVoice}
            aria-label="次へ"
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full transition hover:scale-110 active:scale-95"
            style={{
              background: 'linear-gradient(135deg,#f5eedf 0%,#ede0c4 100%)',
              border: '1.5px solid #d4c4a0',
              boxShadow: '0 4px 16px rgba(140,110,60,0.14)',
              color: '#8a6d3e',
              fontSize: '22px',
              lineHeight: 1,
            }}
          >
            ›
          </button>
        </div>

        {/* Dots */}
        <div className="mt-7 flex items-center justify-center gap-2.5">
          {VOICES.map((_, i) => (
            <button
              key={i}
              onClick={() => setVoiceIndex(i)}
              aria-label={`スライド ${i + 1}`}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === voiceIndex ? '28px' : '10px',
                height: '10px',
                background: i === voiceIndex
                  ? 'linear-gradient(90deg,#d4ad72,#8a6d3e)'
                  : '#d4c4a0',
              }}
            />
          ))}
        </div>

        {/* Slide counter */}
        <p className="mt-3 text-center text-xs" style={{ color: '#b0a080' }}>
          {voiceIndex + 1} / {VOICES.length}
        </p>
      </section>

      <style>{`
        @keyframes voiceFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

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

            {/* Phone */}
            <a
              href="tel:09065960026"
              className="mt-5 flex items-center gap-3 rounded-2xl px-5 py-4 transition hover:opacity-80"
              style={{
                background: 'linear-gradient(135deg,#2c1f0e 0%,#1a130a 100%)',
                border: '1px solid rgba(212,173,114,0.30)',
              }}
            >
              <span
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-base"
                style={{ background: 'rgba(212,173,114,0.20)', color: '#e8cc88' }}
              >
                ☎
              </span>
              <div>
                <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.55)' }}>お電話でのご相談</p>
                <p className="text-lg font-bold tracking-wider" style={{ color: '#e8cc88' }}>090-6596-0026</p>
              </div>
            </a>

            <div className="mt-5 space-y-3">
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
            <Link href="/ofiraku-like/company" className="hover:underline" style={{ color: '#78716c' }}>会社概要</Link>
            <a href="#" className="hover:underline" style={{ color: '#78716c' }}>プライバシーポリシー</a>
            <a href="#contact" className="hover:underline" style={{ color: '#78716c' }}>お問い合わせ</a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
