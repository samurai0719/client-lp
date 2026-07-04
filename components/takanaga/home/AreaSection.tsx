import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { serviceAreas } from "@/data/takanaga/areas";
import AnimateOnScroll from "@/components/takanaga/common/AnimateOnScroll";

function JapanMapSVG() {
  return (
    <svg
      viewBox="0 0 200 280"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      style={{ width: "100%", height: "auto", display: "block" }}
      className="max-w-[180px] mx-auto opacity-90"
    >
      {/* 伊勢湾（背景） */}
      <path
        d="M112,148 L138,152 L155,168 L158,195 L148,215 L132,220 L118,205 L110,182 L112,160 Z"
        fill="rgba(219,234,254,0.6)"
        stroke="rgba(147,197,253,0.5)"
        strokeWidth="0.5"
      />

      {/* 岐阜県 — 北部・内陸、横広の形状 */}
      <path
        d="M45,22 L95,12 L148,18 L172,38 L178,68 L165,98 L140,118 L108,128 L72,120 L48,100 L36,72 L40,46 Z"
        fill="rgba(29,95,166,0.12)"
        stroke="rgba(29,95,166,0.55)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* 愛知県 — 中部、知多半島あり */}
      <path
        d="M72,120 L108,128 L140,118 L165,98 L178,68 L185,85 L188,112 L180,140 L168,158 L158,165 L148,155 L140,140 L128,136 L112,140 L100,148 L88,140 Z"
        fill="rgba(45,125,210,0.13)"
        stroke="rgba(45,125,210,0.55)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* 知多半島 */}
      <path
        d="M112,140 L120,155 L118,172 L110,178 L102,168 L100,152 Z"
        fill="rgba(45,125,210,0.10)"
        stroke="rgba(45,125,210,0.45)"
        strokeWidth="1"
        strokeLinejoin="round"
      />

      {/* 三重県 — 右側、南北に長い */}
      <path
        d="M140,118 L165,98 L178,68 L185,85 L188,112 L185,140 L180,168 L172,198 L162,228 L152,252 L142,255 L136,238 L138,210 L140,185 L142,162 L145,142 L140,128 Z"
        fill="rgba(29,95,166,0.10)"
        stroke="rgba(29,95,166,0.45)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* 県名ラベル */}
      <text x="108" y="72" textAnchor="middle" fontSize="10" fill="#1e40af" fontWeight="700" fontFamily="sans-serif">岐阜県</text>
      <text x="138" y="136" textAnchor="middle" fontSize="9" fill="#1e40af" fontWeight="700" fontFamily="sans-serif">愛知県</text>
      <text x="168" y="185" textAnchor="middle" fontSize="9" fill="#1e40af" fontWeight="700" fontFamily="sans-serif">三重県</text>

      {/* ピンマーカー */}
      <circle cx="108" cy="78" r="4" fill="#2d7dd2" opacity="0.9" />
      <circle cx="136" cy="142" r="4" fill="#2d7dd2" opacity="0.9" />
      <circle cx="165" cy="190" r="4" fill="#2d7dd2" opacity="0.9" />
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
            href="/area"
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
