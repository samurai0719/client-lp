import Image from "next/image";
import { publicImageExists } from "@/lib/nurse-ranking/publicImage";
import { siteMeta } from "@/config/nurse-ranking";

const HERO_IMAGE = "/images/nurse-ranking-hero.jpg";

// この画像には見出し・ラベル・「登録・相談はすべて無料」バッジがデザインとして
// 焼き込み済み（クライアント提供の完成バナー）。そのため画面上にHTMLの見出しを
// 重ねて表示することはしない。SEO・スクリーンリーダー向けに、同内容のH1のみ
// 視覚的に隠した状態（sr-only）でDOM上に残す。alt文にも同内容を記述している。
const HERO_IMAGE_ALT =
  "2026年最新版 看護師転職サイトおすすめランキング。希望の働き方に合う転職サービスを比較。登録・相談はすべて無料。院内でクリップボードを持ち微笑む女性看護師。";

function formatUpdatedAt(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return dateStr;
  return `${y}年${m}月${d}日`;
}

export default function HeroSection() {
  const hasHeroImage = publicImageExists(HERO_IMAGE);

  return (
    <section className="relative w-full bg-white">
      {/* 画像内に見出しが焼き込まれているため、SEO・読み上げ用のH1のみ非表示で残す */}
      <h1 className="sr-only">看護師転職サイト おすすめランキング</h1>

      <div className="relative aspect-[1717/916] w-full bg-slate-100">
        {hasHeroImage ? (
          <Image
            src={HERO_IMAGE}
            alt={HERO_IMAGE_ALT}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 border border-dashed border-slate-300 bg-gradient-to-br from-teal-50 to-slate-100 text-slate-400">
            <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span className="text-xs font-medium">
              ヒーロー画像未配置（public/images/nurse-ranking-hero.jpg）
            </span>
          </div>
        )}
      </div>

      {/* 画像には含まれていないCTA・更新日のみHTMLで配置（画像の見出し列に揃えて左寄せ） */}
      <div className="bg-gradient-to-b from-teal-50/50 to-white px-5 py-6 sm:px-8 sm:py-7 lg:px-14 lg:py-8">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col items-start gap-2.5">
            <a
              id="hero-cta-anchor"
              href="#ranking"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-teal-600 px-7 py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-teal-700 active:scale-[0.98] sm:px-9 sm:py-4 sm:text-base"
            >
              ランキングを見る
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
            <p className="text-[11px] text-slate-400 sm:text-xs">
              最終更新：{formatUpdatedAt(siteMeta.contentUpdatedAt)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
