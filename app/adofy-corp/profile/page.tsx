import { useId } from "react";
import Link from "next/link";
import {
  DotGrid,
  OrbitRings,
  TopographicLines,
} from "@/components/adofy-corp/decorations";
import { resolveLocalImage } from "@/lib/resolveLocalImage";
import MascotFigure from "@/components/adofy-corp/visuals/MascotFigure";

export default function ProfilePage() {
  const photoClipId = useId().replace(/:/g, "");
  const photoSrc = resolveLocalImage("images/profile", "representative");

  return (
    <main className="relative min-h-screen overflow-hidden bg-surface text-ink">
      <DotGrid
        className="absolute right-0 top-0 hidden h-[60%] w-[26rem] text-accent-blue sm:block"
        opacity={0.1}
      />

      <section className="relative px-5 py-20 md:px-10">
        <div className="mx-auto max-w-6xl">
          <Link href="/" className="text-sm font-bold text-accent-blue">
            ← トップページへ戻る
          </Link>

          <div className="mt-12 grid items-start gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="relative rounded-[2rem] border border-border-soft bg-mist-gray p-6 shadow-soft md:p-8">
              <OrbitRings
                className="pointer-events-none absolute -inset-12 -z-10 text-accent-blue"
                opacity={0.18}
                rings={3}
                accentColor="#f59e0b"
              />
              <TopographicLines
                className="pointer-events-none absolute -bottom-12 -left-12 h-56 w-56 text-accent-blue"
                opacity={0.1}
              />
              <svg
                viewBox="0 0 200 14"
                className="pointer-events-none absolute -bottom-4 right-6 h-4 w-40 rotate-3 text-accent-amber"
                aria-hidden="true"
                focusable="false"
                style={{ opacity: 0.5 }}
              >
                <path
                  d="M3 9C40 2 90 11 130 5C155 1 175 9 197 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
                <defs>
                  <clipPath id={`profile-photo-clip-${photoClipId}`} clipPathUnits="objectBoundingBox">
                    <path d="M0,0.1 C0,0.03 0.1,0 0.23,0 L0.77,0 C0.9,0 1,0.08 1,0.18 L1,0.87 C1,0.96 0.9,1 0.8,1 L0.2,1 C0.08,1 0,0.94 0,0.84 Z" />
                  </clipPath>
                </defs>
              </svg>
              <div
                className="relative aspect-[4/5] overflow-hidden bg-mist-blue"
                style={{ clipPath: `url(#profile-photo-clip-${photoClipId})` }}
              >
                {photoSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photoSrc} alt="塚本 隼平" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-ink-soft font-bold">
                    代表写真をここに配置
                  </div>
                )}
              </div>

              <div className="relative mt-6">
                <p className="text-sm text-ink-soft">Representative</p>
                <h1 className="mt-2 text-3xl font-black text-ink">塚本 隼平</h1>
                <p className="mt-2 text-ink-soft">株式会社adofy 代表</p>
              </div>
            </div>

            <div className="relative">
              <MascotFigure
                src="/images/mascots/cat-girl-peace-wink.png"
                alt="ウインクするadofyのマスコットキャラクター"
                trigger="scroll"
                delay={0.2}
                className="absolute -top-4 right-0 h-24 w-auto drop-shadow-lg sm:h-28"
              />
              <p className="text-sm font-black tracking-widest text-accent-blue">
                PROFILE
              </p>

              <h2 className="mb-[clamp(28px,4vw,36px)] mt-4 text-[22px] font-black leading-[1.18] tracking-tight text-ink md:text-5xl lg:text-[36px] xl:text-5xl">
                現場で数字を追い続けてきた、
                <br />
                成果重視のWebマーケター。
              </h2>

              <p className="max-w-[44rem] text-[clamp(1rem,2vw,1.2rem)] leading-[1.85] tracking-[0.01em] text-ink-soft">
                広告運用型アフィリエイト事業を中心に、Meta広告を活用した成果報酬型広告運用、
                LP改善、クリエイティブ制作を実践。看護師・薬剤師・ドライバー・施工管理・介護・ゴルフなど、
                複数ジャンルの広告運用に取り組み、実際の数字をもとに改善を重ねてきました。
              </p>

              <p className="mt-4 max-w-[44rem] text-[clamp(1rem,2vw,1.2rem)] leading-[1.85] tracking-[0.01em] text-ink-soft">
                広告を出して終わりではなく、訴求・クリエイティブ・LP・導線まで一気通貫で改善し、
                成果につながるWebマーケティングを追求しています。
              </p>

              <div className="mt-10 grid gap-5 md:grid-cols-2">
                <div className="rounded-3xl border border-border-soft bg-mist-blue p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-hover">
                  <p className="text-sm font-black text-accent-blue">
                    Strength 01
                  </p>
                  <h3 className="mt-3 text-xl font-black text-ink">
                    成果報酬型広告運用
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-ink-soft">
                    広告費に対して成果が合うかを重視し、LP・訴求・クリエイティブを改善しながら運用します。
                  </p>
                </div>

                <div className="rounded-3xl border border-border-soft bg-mist-blue p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-hover">
                  <p className="text-sm font-black text-accent-blue">
                    Strength 02
                  </p>
                  <h3 className="mt-3 text-xl font-black text-ink">
                    LP改善・導線設計
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-ink-soft">
                    広告からLP、CTAまでの流れを設計し、ユーザーが自然に行動しやすい導線を作ります。
                  </p>
                </div>

                <div className="rounded-3xl border border-amber-100 bg-mist-ivory p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-hover">
                  <p className="text-sm font-black text-accent-blue">
                    Strength 03
                  </p>
                  <h3 className="mt-3 text-xl font-black text-ink">
                    クリエイティブ検証
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-ink-soft">
                    画像・動画・コピーを複数検証し、数字を見ながら勝ちパターンを見つけます。
                  </p>
                </div>

                <div className="rounded-3xl border border-amber-100 bg-mist-ivory p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-hover">
                  <p className="text-sm font-black text-accent-blue">
                    Strength 04
                  </p>
                  <h3 className="mt-3 text-xl font-black text-ink">スピード改善</h3>
                  <p className="mt-3 text-sm leading-7 text-ink-soft">
                    配信結果を見ながら、訴求・デザイン・構成を素早く改善します。
                  </p>
                </div>
              </div>

              <div className="relative mt-10 overflow-hidden rounded-[2rem] border border-border-soft bg-white p-6 shadow-soft md:p-8">
                <DotGrid
                  className="absolute right-0 top-0 h-full w-1/2 text-accent-blue"
                  opacity={0.08}
                />
                <h3 className="relative text-2xl font-black text-ink">
                  主な実績・経験領域
                </h3>

                <ul className="relative mt-6 space-y-4 leading-7 text-ink-soft">
                  <li>
                    ・看護師、薬剤師、ドライバー、施工管理、介護、ゴルフなどの広告運用
                  </li>
                  <li>・Meta広告を中心とした成果報酬型広告運用</li>
                  <li>・LPのファーストビュー、CTA、訴求軸の改善</li>
                  <li>・広告クリエイティブの企画、制作、検証</li>
                  <li>・広告数値をもとにしたCVR改善、CPA改善、ROAS改善</li>
                  <li>・岐阜を拠点に全国対応のWebマーケティング支援を展開</li>
                </ul>
              </div>

              <div className="mt-10">
                <a
                  href="/contact"
                  className="inline-flex min-h-[62px] items-center justify-center rounded-full bg-accent-blue px-8 font-black text-white shadow-soft transition duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-hover"
                >
                  相談する
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
