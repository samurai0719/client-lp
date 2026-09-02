"use client";

import { FEATURES } from "./config";
import { stagger, useInView, useScrollSteps } from "./motion";
import { BlueprintGrid, CheckIcon, SectionHeading } from "./ui";

const MOCK_STEPS = ["ファーストビュー", "施工事例", "CTA", "問い合わせ"] as const;

/**
 * 制作するホームページの特徴。
 * 右側のブラウザモックアップが、スクロールに合わせて
 * FV → 施工事例 → CTA → 問い合わせ通知 の順に組み上がり、
 * 「ホームページを作ることで集客導線が完成していく」ことを見せる。
 */
export default function FeaturesSection() {
  const { ref, step } = useScrollSteps<HTMLDivElement>(4);

  return (
    <section id="features" className="adf-section adf-sec-dark" aria-labelledby="adf-features-h">
      <BlueprintGrid tone="dark" opacity={0.4} />

      <div className="adf-container">
        <SectionHeading
          eyebrow="What we build"
          title="見た目だけではなく、問い合わせにつながるホームページへ。"
          id="adf-features-h"
        />

        <div ref={ref} className="adf-features__layout">
          <ul className="adf-checklist">
            {FEATURES.map((text, i) => (
              <CheckItem key={text} text={text} index={i} />
            ))}
          </ul>

          <div className="adf-mock-col">
            <div className="adf-mock">
              <BrowserMock step={step} />
              <p className="adf-mock__steps">
                {MOCK_STEPS.map((label, i) => (
                  <span key={label}>
                    {step > i ? <b>{`0${i + 1} ${label}`}</b> : `0${i + 1} ${label}`}
                    {i < MOCK_STEPS.length - 1 ? " ／ " : ""}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CheckItem({ text, index }: { text: string; index: number }) {
  const ref = useInView<HTMLLIElement>({ threshold: 0.4 });
  return (
    <li ref={ref} className="adf-check adf-reveal adf-reveal--left" style={stagger(index)}>
      <CheckIcon className="adf-check__box" size={22} />
      {text}
    </li>
  );
}

/** スクロールに応じて中身が組み上がるブラウザ画面 */
function BrowserMock({ step }: { step: number }) {
  const on = (n: number) => (step >= n ? "is-on" : "");

  return (
    <svg
      viewBox="0 0 520 424"
      role="img"
      aria-label="ホームページにファーストビュー、施工事例、CTA が順に加わり、問い合わせが届くまでの流れを示した図"
    >
      {/* ブラウザの枠 */}
      <rect width="520" height="424" fill="#071a30" />
      <rect width="520" height="34" fill="#0b2440" />
      <circle cx="20" cy="17" r="4" fill="#f26a1b" opacity="0.85" />
      <circle cx="36" cy="17" r="4" fill="#ffffff" opacity="0.22" />
      <circle cx="52" cy="17" r="4" fill="#ffffff" opacity="0.22" />
      <rect x="72" y="9" width="404" height="16" rx="8" fill="#ffffff" opacity="0.07" />
      <rect x="84" y="15" width="120" height="4" rx="2" fill="#ffffff" opacity="0.22" />

      {/* 01 ファーストビュー */}
      <g data-step="1" className={on(1)}>
        <rect x="16" y="46" width="488" height="122" rx="4" fill="#123457" />
        <rect x="16" y="46" width="488" height="122" rx="4" fill="url(#adf-mock-grad)" />
        <rect x="38" y="78" width="228" height="15" rx="3" fill="#ffffff" opacity="0.92" />
        <rect x="38" y="103" width="152" height="9" rx="3" fill="#ffffff" opacity="0.45" />
        <rect x="38" y="122" width="104" height="9" rx="3" fill="#ffffff" opacity="0.45" />
      </g>

      {/* 02 施工事例 */}
      <g data-step="2" className={on(2)}>
        <rect x="16" y="184" width="86" height="8" rx="3" fill="#f26a1b" />
        {[16, 184, 352].map((x, i) => (
          <g key={x}>
            <rect
              x={x}
              y="204"
              width="152"
              height="76"
              rx="4"
              fill="#0e2b4c"
              stroke="#ffffff"
              strokeOpacity="0.12"
            />
            <path
              d={`M${x + 20} 262 L${x + 56} 226 L${x + 88} 262 Z`}
              fill="#ffffff"
              opacity={0.16 + i * 0.04}
            />
            <circle cx={x + 116} cy="230" r="9" fill="#ffffff" opacity="0.12" />
          </g>
        ))}
      </g>

      {/* 03 CTAが目立つ状態になる */}
      <g data-step="3" className={on(3)}>
        <rect x="16" y="300" width="488" height="46" rx="4" fill="#ffffff" opacity="0.08" />
        <rect x="16" y="300" width="488" height="46" rx="4" fill="#f26a1b" />
        <rect x="196" y="318" width="128" height="10" rx="4" fill="#ffffff" opacity="0.95" />
        <path
          d="M338 323 h14 m-5 -5 l5 5 -5 5"
          stroke="#ffffff"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {step >= 3 ? (
          <rect
            className="adf-mock__pulse"
            x="16"
            y="300"
            width="488"
            height="46"
            rx="4"
            fill="none"
            stroke="#f26a1b"
            strokeWidth="2"
          />
        ) : null}
      </g>

      {/* 04 問い合わせ通知 */}
      <g data-step="4" className={on(4)}>
        <rect x="286" y="360" width="218" height="50" rx="6" fill="#ffffff" />
        <rect x="286" y="360" width="4" height="50" rx="2" fill="#f26a1b" />
        <circle cx="310" cy="385" r="9" fill="#f26a1b" opacity="0.16" />
        <path
          d="M305 385 l4 4 7 -8"
          stroke="#f26a1b"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <rect x="328" y="374" width="130" height="8" rx="3" fill="#0b2440" opacity="0.85" />
        <rect x="328" y="390" width="88" height="7" rx="3" fill="#0b2440" opacity="0.35" />
      </g>

      <defs>
        <linearGradient id="adf-mock-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1c4a76" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#071a30" stopOpacity="0.2" />
        </linearGradient>
      </defs>
    </svg>
  );
}
