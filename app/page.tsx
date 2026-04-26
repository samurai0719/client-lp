import FaqAccordion from "./components/FaqAccordion";
import StickyCtaBar from "./components/StickyCtaBar";

// ── SVG Icons ────────────────────────────────────────────────────────────────

const IconArrow = ({ cls = "w-4 h-4" }: { cls?: string }) => (
  <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const IconCheck = ({ cls = "w-3.5 h-3.5" }: { cls?: string }) => (
  <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconStar = ({ filled = true }: { filled?: boolean }) => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const IconCoin = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v1m0 6v1M9.5 10a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5" />
  </svg>
);

const IconFrown = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
    <line x1="9" y1="9" x2="9.01" y2="9" />
    <line x1="15" y1="9" x2="15.01" y2="9" />
  </svg>
);

const IconClock = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconHeart = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const IconSun = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

const IconTrendUp = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const IconSearch = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconUsers = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconDocument = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const IconBuilding = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const IconLock = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IconShieldCheck = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const IconGift = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <polyline points="20 12 20 22 4 22 4 12" />
    <rect x="2" y="7" width="20" height="5" />
    <line x1="12" y1="22" x2="12" y2="7" />
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
  </svg>
);

const IconNurse = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
    <line x1="12" y1="11" x2="12" y2="16" />
    <line x1="9.5" y1="13.5" x2="14.5" y2="13.5" />
  </svg>
);

const IconThumb = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
    <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
  </svg>
);

// ── CTA Buttons ──────────────────────────────────────────────────────────────

function CtaPrimary({ label }: { label: string }) {
  return (
    <a
      href="#contact"
      className="cta-glow flex items-center justify-center gap-2.5 w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-bold rounded-2xl px-6 py-4 text-base transition-all duration-150 cursor-pointer"
    >
      <span>{label}</span>
      <IconArrow cls="w-4 h-4 shrink-0" />
    </a>
  );
}

function CtaSecondary({ label }: { label: string }) {
  return (
    <a
      href="#contact"
      className="flex items-center justify-center gap-2 w-full bg-white hover:bg-blue-50 active:scale-[0.98] border border-blue-200 text-blue-600 font-semibold rounded-2xl px-6 py-3.5 text-sm transition-all duration-150 cursor-pointer"
    >
      <span>{label}</span>
      <IconArrow cls="w-3.5 h-3.5 shrink-0" />
    </a>
  );
}

// ── Section Wrapper ──────────────────────────────────────────────────────────

function Section({
  id,
  bg = "bg-white",
  children,
}: {
  id?: string;
  bg?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`${bg} py-12 px-5 sm:py-16`}>
      <div className="max-w-xl mx-auto">{children}</div>
    </section>
  );
}

function SectionTitle({
  label,
  title,
  sub,
}: {
  label?: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="mb-8 text-center">
      {label && (
        <span className="inline-block text-[11px] font-semibold tracking-[0.14em] text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full mb-3 uppercase">
          {label}
        </span>
      )}
      <h2 className="text-[1.4rem] font-bold text-slate-900 leading-snug sm:text-[1.6rem]">
        {title}
      </h2>
      {sub && (
        <p className="mt-3 text-slate-500 text-sm leading-relaxed sm:text-base max-w-sm mx-auto">
          {sub}
        </p>
      )}
    </div>
  );
}

// ── Inline CTA Block ─────────────────────────────────────────────────────────

function InlineCta({ title, sub }: { title?: string; sub?: string }) {
  return (
    <section className="bg-slate-50 border-y border-slate-100 py-8 px-5">
      <div className="max-w-xl mx-auto text-center">
        {title && (
          <p className="font-semibold text-slate-800 text-base mb-1">{title}</p>
        )}
        {sub && <p className="text-slate-500 text-sm mb-4">{sub}</p>}
        <CtaPrimary label="無料で相談してみる" />
        <p className="mt-2.5 text-xs text-slate-400">
          登録2分・完全無料・しつこい連絡なし
        </p>
      </div>
    </section>
  );
}

// ── Star Rating ──────────────────────────────────────────────────────────────

function StarRating({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= Math.round(score) ? "text-amber-400" : "text-slate-200"}>
          <IconStar filled={i <= Math.round(score)} />
        </span>
      ))}
    </div>
  );
}

// ── Image Placeholder ────────────────────────────────────────────────────────

function ImagePlaceholder({ label, aspect = "aspect-[3/2]" }: { label: string; aspect?: string }) {
  return (
    <div className={`${aspect} bg-slate-100 rounded-xl flex flex-col items-center justify-center border border-slate-200 border-dashed gap-1`}>
      <svg className="w-6 h-6 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
      <span className="text-xs text-slate-400">{label}</span>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE
// ══════════════════════════════════════════════════════════════════════════════

export default function Page() {
  return (
    <>
      <StickyCtaBar />

      <div className="pb-20 sm:pb-0 bg-white text-slate-900">

        {/* ══ 1. ファーストビュー ══════════════════════════════════════════════ */}
        <section className="relative bg-gradient-to-b from-blue-600 via-blue-500 to-blue-400 pt-8 pb-0 px-5 overflow-hidden">
          {/* 背景装飾 */}
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.12)_0%,transparent_60%)] pointer-events-none" />
          <div aria-hidden className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />

          <div className="relative max-w-xl mx-auto text-center">
            {/* タグライン */}
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-5 border border-white/30">
              <IconNurse />
              看護師専門の転職サポート
            </div>

            {/* ヘッドライン */}
            <h1 className="text-[1.9rem] font-extrabold text-white leading-[1.2] tracking-tight sm:text-[2.3rem]">
              今の職場、限界を
              <br />
              感じていませんか？
            </h1>
            <p className="mt-3 text-blue-100 text-base leading-relaxed">
              年収アップ・人間関係・働き方——
              <br className="sm:hidden" />
              看護師専門アドバイザーが<span className="text-white font-semibold">無料</span>でサポートします。
            </p>

            {/* 信頼バッジ */}
            <div className="flex flex-wrap justify-center gap-2 my-5">
              {["登録2分・完全無料", "専任担当者つき", "全国9万件以上の求人"].map((badge) => (
                <span key={badge} className="flex items-center gap-1.5 text-xs font-medium text-white bg-white/20 border border-white/30 rounded-full px-3 py-1.5">
                  <IconCheck cls="w-3 h-3" />
                  {badge}
                </span>
              ))}
            </div>

            {/* CTAボタン */}
            <div id="hero-cta" className="flex flex-col gap-3">
              <a
                href="#contact"
                className="cta-glow flex items-center justify-center gap-2.5 w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-bold rounded-2xl px-6 py-4 text-lg transition-all duration-150 cursor-pointer shadow-lg"
              >
                無料で相談してみる
                <IconArrow cls="w-5 h-5 shrink-0" />
              </a>
              <p className="text-xs text-blue-200">登録2分・完全無料・しつこい連絡なし</p>
              <a
                href="#contact"
                className="flex items-center justify-center gap-2 w-full bg-white hover:bg-blue-50 active:scale-[0.98] text-blue-600 font-semibold rounded-2xl px-6 py-3.5 text-sm transition-all duration-150 cursor-pointer border border-white/80"
              >
                条件の良い求人を確認する
                <IconArrow cls="w-3.5 h-3.5 shrink-0" />
              </a>
            </div>

            {/* ヒーロー画像プレースホルダー */}
            <div className="mt-8 -mx-5">
              <ImagePlaceholder label="看護師イメージ画像（横幅フル）" aspect="aspect-[16/7]" />
            </div>
          </div>
        </section>

        {/* 統計バー */}
        <section className="bg-white border-b border-slate-100 py-5 px-5 shadow-sm">
          <div className="max-w-xl mx-auto grid grid-cols-3 gap-2 text-center">
            {[
              { num: "9万件+", desc: "求人数" },
              { num: "4.6 / 5", desc: "平均満足度" },
              { num: "10万人+", desc: "累計サポート実績" },
            ].map(({ num, desc }) => (
              <div key={desc} className="py-2">
                <div className="text-xl font-extrabold text-blue-600 tabular-nums leading-none">{num}</div>
                <div className="text-[11px] text-slate-500 mt-1.5">{desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ 2. 共感ブロック ══════════════════════════════════════════════════ */}
        <Section id="problems" bg="bg-slate-50">
          <SectionTitle
            label="TROUBLES"
            title="今の職場でこんな悩み、ありませんか？"
            sub="転職を考えた看護師さんが挙げる、よくあるお悩みです。"
          />
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {[
              { Icon: IconCoin, text: "夜勤が多いのに給料が上がらない" },
              { Icon: IconFrown, text: "人間関係のストレスで毎日がつらい" },
              { Icon: IconClock, text: "残業・サービス残業が当たり前になっている" },
              { Icon: IconHeart, text: "今の診療科より自分に向いた分野がある気がする" },
              { Icon: IconSun, text: "育児・家庭と両立できる働き方をしたい" },
              { Icon: IconTrendUp, text: "スキルアップできる環境に移りたい" },
            ].map(({ Icon, text }) => (
              <div key={text} className="flex items-center gap-3 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                <span className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-blue-50 text-blue-500">
                  <Icon />
                </span>
                <p className="text-sm text-slate-700 leading-snug font-medium">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 text-center">
            <p className="text-sm text-blue-800 leading-relaxed">
              <span className="font-semibold">一つでも当てはまる方へ。</span>
              <br />
              転職サービスを活用すれば、一人で悩まずプロに相談しながら解決策を見つけられます。
            </p>
          </div>
        </Section>

        {/* ══ 3. 転職サービスを使うメリット ═══════════════════════════════════ */}
        <Section id="benefits" bg="bg-white">
          <SectionTitle
            label="BENEFIT"
            title="看護師転職サービスを使うべき理由"
            sub="自分一人で求人を探すのと何が違うのか、具体的にご説明します。"
          />
          <div className="space-y-3">
            {[
              {
                Icon: IconSearch,
                title: "非公開求人にアクセスできる",
                body: "求人サイトに出回らない、好条件の非公開求人を紹介してもらえます。特に待遇の良い病院ほど非公開求人が多い傾向があります。",
                accent: "bg-emerald-50 text-emerald-600",
              },
              {
                Icon: IconUsers,
                title: "給与・条件交渉を代行してもらえる",
                body: "自分では交渉しにくい給与・残業・夜勤回数などの条件交渉を、アドバイザーが代わりに行ってくれます。",
                accent: "bg-emerald-50 text-emerald-600",
              },
              {
                Icon: IconDocument,
                title: "書類添削・面接対策のサポートがある",
                body: "志望動機の書き方から面接でよく聞かれる質問まで、内定率を高めるサポートを無料で受けられます。",
                accent: "bg-emerald-50 text-emerald-600",
              },
              {
                Icon: IconBuilding,
                title: "職場の内部情報を教えてもらえる",
                body: "実際の残業時間・職場の雰囲気・人間関係など、求人票では分からないリアルな情報をアドバイザーから事前に確認できます。",
                accent: "bg-emerald-50 text-emerald-600",
              },
            ].map(({ Icon, title, body, accent }) => (
              <div key={title} className="flex gap-4 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                <span className={`shrink-0 mt-0.5 w-10 h-10 flex items-center justify-center rounded-xl ${accent}`}>
                  <Icon />
                </span>
                <div>
                  <h3 className="font-semibold text-slate-900 text-base mb-1">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* CTA差し込み① */}
        <InlineCta title="まずは気軽に確認だけでも" sub="相談だけでも歓迎しています" />

        {/* ══ 4. おすすめサービス比較カード ════════════════════════════════════ */}
        <Section id="ranking" bg="bg-slate-50">
          <SectionTitle
            label="RANKING"
            title="看護師向け転職サービス おすすめ3選"
            sub="専門アドバイザーへの取材・実際の利用者の声をもとに選定しました。"
          />

          <div className="space-y-4">
            {/* ── Rank 1 ── */}
            <div className="relative bg-white rounded-2xl border-2 border-blue-500 shadow-md overflow-hidden">
              {/* おすすめバッジ */}
              <div className="absolute top-0 left-0 bg-blue-600 text-white text-[11px] font-bold px-3 py-1 rounded-br-xl">
                編集部 おすすめ No.1
              </div>

              <div className="pt-7 px-5 pb-5">
                {/* ランクとスコア */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white font-extrabold text-sm">1</span>
                    <div>
                      <p className="font-bold text-slate-900 text-lg leading-none">ナースジョブサポート</p>
                      <p className="text-xs text-slate-500 mt-0.5">看護師専門・非公開求人9万件</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-extrabold text-blue-600 tabular-nums leading-none">4.8</div>
                    <div className="text-[10px] text-slate-400">/ 5.0</div>
                  </div>
                </div>

                <StarRating score={4.8} />

                {/* 画像プレースホルダー */}
                <div className="mt-3 mb-4">
                  <ImagePlaceholder label="サービスイメージ画像" aspect="aspect-[16/6]" />
                </div>

                {/* 特徴リスト */}
                <ul className="space-y-1.5 mb-4">
                  {[
                    "看護師専門アドバイザーが担当",
                    "非公開求人9万件以上に対応",
                    "給与・条件交渉をフルサポート",
                    "転職後のフォローまで一貫対応",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-700">
                      <span className="shrink-0 w-4 h-4 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        <IconCheck cls="w-2.5 h-2.5" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                {/* スコア詳細 */}
                <div className="bg-slate-50 rounded-xl p-3 mb-4 space-y-2">
                  {[
                    { label: "求人数の豊富さ", score: 5 },
                    { label: "サポートの手厚さ", score: 5 },
                    { label: "アドバイザーの専門性", score: 5 },
                    { label: "使いやすさ", score: 4 },
                  ].map(({ label, score }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">{label}</span>
                      <div className="flex items-center gap-1">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className={`w-3 h-1.5 rounded-full ${i <= score ? "bg-blue-500" : "bg-slate-200"}`} />
                          ))}
                        </div>
                        <span className="text-xs font-semibold text-blue-600 tabular-nums w-5 text-right">{score}.0</span>
                      </div>
                    </div>
                  ))}
                </div>

                <CtaPrimary label="無料で相談してみる" />
                <p className="mt-2 text-xs text-slate-400 text-center">登録2分・完全無料・しつこい連絡なし</p>
              </div>
            </div>

            {/* ── Rank 2 ── */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 text-slate-600 font-extrabold text-sm">2</span>
                    <div>
                      <p className="font-bold text-slate-900 text-base leading-none">メディカルキャリアプラス</p>
                      <p className="text-xs text-slate-500 mt-0.5">幅広い求人・全国対応</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-extrabold text-slate-700 tabular-nums leading-none">4.2</div>
                    <div className="text-[10px] text-slate-400">/ 5.0</div>
                  </div>
                </div>

                <StarRating score={4.2} />

                <div className="mt-3 mb-4">
                  <ImagePlaceholder label="サービスイメージ画像" aspect="aspect-[16/5]" />
                </div>

                <ul className="space-y-1.5 mb-4">
                  {[
                    "全国の求人に幅広く対応",
                    "職種・診療科問わず紹介可能",
                    "オンライン面談に対応",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-700">
                      <span className="shrink-0 w-4 h-4 flex items-center justify-center rounded-full bg-slate-100 text-slate-500">
                        <IconCheck cls="w-2.5 h-2.5" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <CtaSecondary label="条件の良い求人を確認する" />
              </div>
            </div>

            {/* ── Rank 3 ── */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 text-slate-600 font-extrabold text-sm">3</span>
                    <div>
                      <p className="font-bold text-slate-900 text-base leading-none">ナーシングワーク</p>
                      <p className="text-xs text-slate-500 mt-0.5">施設・クリニック系に強い</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-extrabold text-slate-700 tabular-nums leading-none">3.9</div>
                    <div className="text-[10px] text-slate-400">/ 5.0</div>
                  </div>
                </div>

                <StarRating score={3.9} />

                <div className="mt-3 mb-4">
                  <ImagePlaceholder label="サービスイメージ画像" aspect="aspect-[16/5]" />
                </div>

                <ul className="space-y-1.5 mb-4">
                  {[
                    "クリニック・介護施設の求人が豊富",
                    "日勤・時短求人を多数保有",
                    "登録後の連絡が丁寧",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-700">
                      <span className="shrink-0 w-4 h-4 flex items-center justify-center rounded-full bg-slate-100 text-slate-500">
                        <IconCheck cls="w-2.5 h-2.5" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <CtaSecondary label="条件の良い求人を確認する" />
              </div>
            </div>
          </div>
        </Section>

        {/* ══ 5. サービスごとの特徴 ═════════════════════════════════════════════ */}
        <Section id="features" bg="bg-white">
          <SectionTitle
            label="FEATURES"
            title="各サービスの特徴を詳しく解説"
            sub="転職活動のスタイルや希望条件に合わせてサービスを選びましょう。"
          />

          <div className="space-y-8">
            {/* ── サービス1詳細 ── */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-600 text-white font-extrabold text-xs">1</span>
                <h3 className="text-lg font-bold text-slate-900">ナースジョブサポート</h3>
                <span className="ml-auto text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">おすすめ</span>
              </div>

              <div className="mb-4">
                <ImagePlaceholder label="サービス紹介画像" aspect="aspect-[16/6]" />
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                看護師の転職に特化した専任アドバイザーが、ヒアリングから内定後のフォローまで一貫してサポートします。
                非公開求人を含む9万件以上の求人情報にアクセスでき、給与交渉も代行対応。初めての転職活動でも安心して進められます。
              </p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                  <p className="text-xs font-semibold text-emerald-700 mb-2 flex items-center gap-1">
                    <IconThumb />
                    おすすめポイント
                  </p>
                  <ul className="space-y-1.5">
                    {[
                      "専任担当が最後まで対応",
                      "給与交渉を代行",
                      "転職後もフォロー継続",
                    ].map((p) => (
                      <li key={p} className="flex items-start gap-1.5 text-xs text-emerald-800">
                        <IconCheck cls="w-3 h-3 mt-0.5 shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <p className="text-xs font-semibold text-slate-600 mb-2">こんな人に向いている</p>
                  <ul className="space-y-1.5">
                    {[
                      "初めて転職する方",
                      "年収アップを目指す方",
                      "急いで転職したい方",
                    ].map((p) => (
                      <li key={p} className="flex items-start gap-1.5 text-xs text-slate-600">
                        <span className="text-blue-400 mt-0.5">▶</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* ユーザーの声 */}
              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-7 h-7 rounded-full bg-blue-200 flex items-center justify-center">
                    <IconNurse />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-blue-800">30代・女性（ICU経験3年）</p>
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <span key={i} className="text-amber-400"><IconStar filled /></span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-blue-800 leading-relaxed">
                  「アドバイザーさんがとても親身になってくれて、希望条件を整理するところから手伝ってもらえました。
                  給与交渉も代行してもらい、前職より月5万円アップの職場に転職できました。」
                </p>
              </div>

              <CtaPrimary label="無料で相談してみる" />
              <p className="mt-2 text-xs text-slate-400 text-center">登録2分・完全無料・しつこい連絡なし</p>
            </div>

            <hr className="border-slate-100" />

            {/* ── サービス2詳細 ── */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-300 text-slate-700 font-extrabold text-xs">2</span>
                <h3 className="text-lg font-bold text-slate-900">メディカルキャリアプラス</h3>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                全国の医療機関・施設の求人を幅広くカバーするサービスです。病院・クリニック・介護施設など、さまざまな職場から選びたい方に向いています。
                オンライン面談にも対応しており、地方在住の方にも使いやすい設計です。
              </p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                  <p className="text-xs font-semibold text-emerald-700 mb-2">向いている人</p>
                  <ul className="space-y-1.5">
                    {["幅広く比較したい", "地方在住", "職種を変えたい"].map((p) => (
                      <li key={p} className="flex items-start gap-1.5 text-xs text-emerald-800">
                        <IconCheck cls="w-3 h-3 mt-0.5 shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
                  <p className="text-xs font-semibold text-amber-700 mb-2">注意点</p>
                  <ul className="space-y-1.5">
                    {["看護師専門ではない", "給与交渉は自己対応"].map((p) => (
                      <li key={p} className="flex items-start gap-1.5 text-xs text-amber-800">
                        <span className="mt-0.5 shrink-0">△</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <CtaSecondary label="条件の良い求人を確認する" />
            </div>

            <hr className="border-slate-100" />

            {/* ── サービス3詳細 ── */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-300 text-slate-700 font-extrabold text-xs">3</span>
                <h3 className="text-lg font-bold text-slate-900">ナーシングワーク</h3>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                クリニックや介護施設・訪問看護など、急性期以外の職場への転職に強みを持つサービスです。
                日勤のみ・時短希望・残業少なめなど、ライフスタイルを重視した求人が豊富です。
              </p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                  <p className="text-xs font-semibold text-emerald-700 mb-2">向いている人</p>
                  <ul className="space-y-1.5">
                    {["日勤・時短を希望", "育児中の方", "クリニック希望"].map((p) => (
                      <li key={p} className="flex items-start gap-1.5 text-xs text-emerald-800">
                        <IconCheck cls="w-3 h-3 mt-0.5 shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
                  <p className="text-xs font-semibold text-amber-700 mb-2">注意点</p>
                  <ul className="space-y-1.5">
                    {["病院系求人は少なめ", "給与交渉サポートは限定的"].map((p) => (
                      <li key={p} className="flex items-start gap-1.5 text-xs text-amber-800">
                        <span className="mt-0.5 shrink-0">△</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <CtaSecondary label="条件の良い求人を確認する" />
            </div>
          </div>
        </Section>

        {/* ── 比較表 ── */}
        <Section id="comparison" bg="bg-slate-50">
          <SectionTitle
            label="COMPARISON"
            title="サービス比較表"
            sub="主要な項目を一覧で確認できます。"
          />

          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full min-w-[360px] text-sm border-collapse rounded-2xl overflow-hidden shadow-sm">
              <thead>
                <tr>
                  <th className="bg-slate-100 text-left px-4 py-3 font-semibold text-slate-500 text-xs border-b border-slate-200 w-[36%]">比較ポイント</th>
                  <th className="bg-blue-600 text-white text-center px-3 py-3 font-semibold text-xs border-b border-blue-500">
                    ナース<br />ジョブサポート
                  </th>
                  <th className="bg-slate-100 text-center px-3 py-3 font-semibold text-slate-500 text-[11px] border-b border-slate-200">
                    メディカル<br />キャリアプラス
                  </th>
                  <th className="bg-slate-100 text-center px-3 py-3 font-semibold text-slate-500 text-[11px] border-b border-slate-200">
                    ナーシング<br />ワーク
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {[
                  ["専任担当", "◎ 看護師専門", "○ 有り", "○ 有り"],
                  ["非公開求人", "◎ 9万件+", "○ 有り", "△ 少なめ"],
                  ["給与交渉", "◎ 完全代行", "△ 一部対応", "✕ 対応外"],
                  ["面接・書類対策", "◎ 有り", "○ 有り", "△ 限定的"],
                  ["利用料金", "無料", "無料", "無料"],
                  ["入職後フォロー", "◎ 継続対応", "△ 一部有り", "△ 一部有り"],
                ].map(([point, s1, s2, s3], i) => (
                  <tr key={point} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                    <td className="px-4 py-3 text-slate-600 font-medium text-xs border-b border-slate-100">{point}</td>
                    <td className="px-3 py-3 text-center font-semibold text-blue-700 bg-blue-50 border-b border-blue-50 text-xs">{s1}</td>
                    <td className="px-3 py-3 text-center text-slate-500 text-xs border-b border-slate-100">{s2}</td>
                    <td className="px-3 py-3 text-center text-slate-400 text-xs border-b border-slate-100">{s3}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[11px] text-slate-400 text-center">
            ※ 表の内容は各サービスの一般的な特徴に基づいた参考情報です。
          </p>
        </Section>

        {/* CTA差し込み② */}
        <section className="bg-blue-600 py-10 px-5">
          <div className="max-w-xl mx-auto text-center">
            <p className="text-white font-bold text-lg mb-2">
              悩んでいる時間が一番もったいない。
            </p>
            <p className="text-blue-100 text-sm leading-relaxed mb-6">
              無理に転職する必要はありません。
              <br />
              まずはプロに現状を話してみませんか？
            </p>
            <a
              href="#contact"
              className="cta-glow flex items-center justify-center gap-2.5 w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-bold rounded-2xl px-6 py-4 text-base transition-all duration-150 cursor-pointer"
            >
              無料で相談してみる
              <IconArrow cls="w-4 h-4 shrink-0" />
            </a>
            <p className="mt-2.5 text-xs text-blue-200">登録2分・完全無料・しつこい連絡なし</p>
          </div>
        </section>

        {/* ══ 6. 利用の流れ ════════════════════════════════════════════════════ */}
        <Section id="flow" bg="bg-white">
          <SectionTitle
            label="FLOW"
            title="利用の流れ"
            sub="登録から内定まで、すべて無料でサポートします。"
          />

          <div className="relative">
            <div aria-hidden className="absolute left-[17px] top-5 bottom-5 w-px bg-gradient-to-b from-blue-200 to-blue-100" />
            <div className="space-y-3">
              {[
                {
                  step: "1",
                  title: "無料登録（約2分）",
                  body: "氏名・連絡先などの基本情報を入力するだけ。履歴書は不要です。",
                  accent: "bg-blue-600",
                },
                {
                  step: "2",
                  title: "アドバイザーとの面談",
                  body: "電話・オンライン・対面からご希望の方法で、現状とご希望をお伺いします。",
                  accent: "bg-blue-600",
                },
                {
                  step: "3",
                  title: "求人のご紹介",
                  body: "希望条件に合う求人を厳選してご案内します。非公開求人も含まれます。",
                  accent: "bg-blue-600",
                },
                {
                  step: "4",
                  title: "応募・選考サポート",
                  body: "書類添削・面接対策を行い、選考をサポートします。",
                  accent: "bg-blue-600",
                },
                {
                  step: "5",
                  title: "内定・入職",
                  body: "条件交渉・入職日の調整も代行。入職後もフォローを継続します。",
                  accent: "bg-orange-500",
                },
              ].map(({ step, title, body, accent }) => (
                <div key={step} className="relative flex gap-4">
                  <span className={`shrink-0 z-10 w-9 h-9 flex items-center justify-center rounded-full text-white text-sm font-bold shadow-sm ${accent}`}>
                    {step}
                  </span>
                  <div className="flex-1 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <h3 className="font-semibold text-slate-900 text-base mb-1">{title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ══ 7. よくある質問 ══════════════════════════════════════════════════ */}
        <Section id="faq" bg="bg-slate-50">
          <SectionTitle
            label="FAQ"
            title="よくある質問"
            sub="転職前によく寄せられるご質問をまとめました。"
          />
          <FaqAccordion />
        </Section>

        {/* ══ 8. 最終CTA ════════════════════════════════════════════════════════ */}
        <section id="contact" className="bg-gradient-to-b from-blue-50 to-white py-12 px-5 sm:py-16">
          <div className="max-w-xl mx-auto">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-lg px-6 py-8 sm:p-10">
              {/* 信頼ラベル */}
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {[
                  { Icon: IconLock, label: "秘密厳守" },
                  { Icon: IconShieldCheck, label: "強引な勧誘なし" },
                  { Icon: IconGift, label: "完全無料" },
                ].map(({ Icon, label }) => (
                  <span key={label} className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1.5">
                    <Icon />
                    {label}
                  </span>
                ))}
              </div>

              {/* 見出し */}
              <h2 className="text-xl font-bold text-slate-900 text-center mb-2 leading-snug sm:text-2xl">
                まずは一歩、
                <br />
                <span className="text-blue-600">自分に合う職場を探してみませんか？</span>
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed text-center mb-6">
                今すぐ転職しなくても大丈夫です。
                <br />
                情報収集・相談だけでも、専任のアドバイザーが無料でサポートします。
              </p>

              {/* ソーシャルプルーフ */}
              <div className="bg-blue-50 rounded-2xl px-4 py-3.5 mb-6 flex items-center gap-3 border border-blue-100">
                <span className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <IconNurse />
                </span>
                <p className="text-sm text-blue-800 leading-snug">
                  <span className="font-semibold">相談受付中</span>
                  <br />
                  <span className="text-xs text-blue-600">
                    今の職場に不満を感じている看護師さんからのご相談が増えています。
                  </span>
                </p>
              </div>

              {/* CTAボタン */}
              <div className="flex flex-col gap-3">
                <CtaPrimary label="無料で相談してみる" />
                <p className="text-center text-xs text-slate-400">
                  登録2分・完全無料・しつこい連絡なし
                </p>
                <CtaSecondary label="条件の良い求人を確認する" />
              </div>

              {/* 注意書き */}
              <p className="mt-6 text-xs text-slate-400 leading-relaxed text-center">
                ※ 転職をお約束するものではありません。担当者が個別にご状況をお伺いし、
                最適な選択肢をご提案します。
              </p>
            </div>
          </div>
        </section>

        {/* フッター */}
        <footer className="bg-slate-900 text-slate-400 py-8 px-5 text-center text-xs">
          <p className="mb-2 font-semibold text-slate-200 text-sm">ナースジョブサポート</p>
          <div className="flex justify-center gap-5 mb-4">
            {["利用規約", "プライバシーポリシー", "運営会社"].map((link) => (
              <a key={link} href="#" className="hover:text-white transition-colors">
                {link}
              </a>
            ))}
          </div>
          <p>© 2024 NurseJobSupport. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}
