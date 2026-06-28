import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { serviceAreas } from "@/data/takanaga/areas";
import AnimateOnScroll from "@/components/takanaga/common/AnimateOnScroll";

// シンプルな日本地図アウトライン (東海地方フォーカス)
function JapanMapSVG() {
  return (
    <svg
      viewBox="0 0 300 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="w-full max-w-xs mx-auto opacity-80"
    >
      {/* 岐阜県 */}
      <path
        d="M105 60 L125 50 L145 55 L150 75 L140 90 L120 85 L105 75 Z"
        fill="rgba(29,95,166,0.15)"
        stroke="rgba(29,95,166,0.5)"
        strokeWidth="1.5"
      />
      <text x="127" y="72" textAnchor="middle" fontSize="8" fill="#1a3d6b" fontWeight="600">岐阜県</text>

      {/* 愛知県 */}
      <path
        d="M120 90 L145 85 L165 90 L170 110 L155 125 L135 120 L118 108 Z"
        fill="rgba(45,125,210,0.15)"
        stroke="rgba(45,125,210,0.5)"
        strokeWidth="1.5"
      />
      <text x="143" y="108" textAnchor="middle" fontSize="8" fill="#1a3d6b" fontWeight="600">愛知県</text>

      {/* 三重県 */}
      <path
        d="M155 100 L175 95 L185 115 L180 140 L165 150 L150 135 L148 115 Z"
        fill="rgba(29,95,166,0.10)"
        stroke="rgba(29,95,166,0.4)"
        strokeWidth="1.5"
      />
      <text x="167" y="128" textAnchor="middle" fontSize="8" fill="#1a3d6b" fontWeight="600">三重県</text>

      {/* 海 */}
      <path
        d="M135 120 L155 125 L165 150 L160 170 L140 175 L125 160 L130 140 Z"
        fill="rgba(240,245,252,0.5)"
        stroke="rgba(200,216,234,0.5)"
        strokeWidth="0.5"
        strokeDasharray="3,2"
      />

      {/* マーカー */}
      <circle cx="127" cy="73" r="4" fill="#2d7dd2" />
      <circle cx="143" cy="108" r="4" fill="#2d7dd2" />
      <circle cx="167" cy="128" r="4" fill="#2d7dd2" />
    </svg>
  );
}

export default function AreaSection() {
  return (
    <section
      className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-(--tkn-warm-gray) tkn-section-alt"
      aria-labelledby="area-heading"
    >
      <div className="mx-auto max-w-5xl">
        <AnimateOnScroll variant="up" className="text-center mb-10">
          <p className="tkn-eyebrow justify-center mb-3">Service Area</p>
          <h2
            id="area-heading"
            className="text-2xl sm:text-3xl font-bold text-(--tkn-navy-deep) leading-tight"
          >
            対応地域
          </h2>
          <span className="tkn-heading-line mx-auto mt-3 mb-4" />
          <p className="text-(--tkn-text-muted) text-sm sm:text-base max-w-xl mx-auto">
            岐阜県・愛知県・三重県の東海エリアを中心に対応しています。
          </p>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* 地図 */}
          <AnimateOnScroll variant="scale" className="lg:col-span-1 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-6 border border-(--tkn-border) shadow-sm w-full">
              <JapanMapSVG />
              <p className="text-center text-xs text-(--tkn-text-muted) mt-2">東海エリア</p>
            </div>
          </AnimateOnScroll>

          {/* 県ごとのカード */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {serviceAreas.map((area, i) => (
              <AnimateOnScroll key={area.prefecture} variant="up" delay={i * 100}>
                <div className="tkn-card p-5 h-full">
                  <div className="flex items-center gap-2 mb-4">
                    <div
                      className="w-8 h-8 rounded-md flex items-center justify-center"
                      style={{ background: "var(--tkn-blue-light)" }}
                    >
                      <MapPin size={16} className="text-(--tkn-blue)" aria-hidden />
                    </div>
                    <h3 className="text-base font-bold text-(--tkn-navy-deep)">
                      {area.prefecture}
                    </h3>
                  </div>
                  {area.note && (
                    <p className="text-xs text-(--tkn-text-muted) mb-3">{area.note}</p>
                  )}
                  <ul className="flex flex-wrap gap-1.5">
                    {area.cities.map((city) => (
                      <li
                        key={city}
                        className="text-xs bg-(--tkn-sky) text-(--tkn-text) px-2.5 py-1 rounded border border-(--tkn-border)"
                      >
                        {city}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>

        <AnimateOnScroll variant="fade" delay={100} className="text-center mt-6">
          <p className="text-xs text-(--tkn-text-muted) mb-4">
            上記以外のエリアについては、まずはお問い合わせください。
          </p>
          <Link
            href="/takanaga/area"
            className="inline-flex items-center gap-2 text-sm font-semibold text-(--tkn-blue-bright) hover:text-(--tkn-navy) transition-colors"
          >
            対応地域の詳細を見る
            <ArrowRight size={16} aria-hidden />
          </Link>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
