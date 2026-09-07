import type { Metadata } from "next";
import "../adofy/adofy.css";
import "./case.css";

import AdofyMetaPixel from "@/components/analytics/AdofyMetaPixel";
import LpInsightTracker, { ADOFY_LP_PROJECT_ID } from "@/components/analytics/LpInsightTracker";
import Footer from "@/components/adofy/Footer";
import { CtaButton, LogoMark } from "@/components/adofy/ui";
import { REFUND_DISCLOSURE, SITE } from "@/components/adofy/config";
import {
  DESCRIPTION, HERO, LEAD_PARAGRAPHS, PR_LABEL, SECTION_1, SECTION_2,
  SECTION_3, SECTION_4, SERVICE, TITLE_LINES, TITLE_PLAIN, WORK_PHOTOS,
} from "./content";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.lpUrl),
  title: TITLE_PLAIN,
  description: DESCRIPTION,
  openGraph: {
    type: "article",
    locale: "ja_JP",
    siteName: SITE.name,
    title: TITLE_PLAIN,
    description: DESCRIPTION,
  },
  // 広告の受け皿となるPR記事のため、検索結果には出さない（LP本体との重複を避ける）
  robots: { index: false, follow: true },
};

/**
 * 高長建設のPR記事。
 *
 * 語り手は高長建設（「私たち」「当社」）。adofy側からの事例紹介ではない。
 * 原稿は content.ts に集約してあり、高長建設の確認・修正はそのファイルだけで完結する。
 *
 * 計測は /adofy と同じものを1つずつ置く（重複設置しない）。
 * 問い合わせの完了計測は /contact のフォーム送信成功時にのみ発火するため、
 * このページのCTA（リンク）ではコンバージョンを送らない。
 */
export default function AdofyCaseTakanagaPage() {
  return (
    <div className="adf-lp adf-case">
      <AdofyMetaPixel />
      <LpInsightTracker projectId={ADOFY_LP_PROJECT_ID} />

      <header className="adf-case__header">
        <a href="/adofy" className="adf-logo" aria-label="adofy トップへ">
          <LogoMark className="adf-logo__mark" />
          <span className="adf-logo__text">
            adof<b>y</b>
          </span>
        </a>
      </header>

      {/* 広告であることを記事の先頭で明示する */}
      <p className="adf-case__pr">{PR_LABEL}</p>

      <article className="adf-case__article">
        {/* ファーストビュー。画像が入るまでは高さだけ確保した空白 */}
        <HeroMedia />

        <div className="adf-case__body">
          <h1 className="adf-case__title">
            {TITLE_LINES.map((line, i) => (
              <span key={line} className={i === TITLE_LINES.length - 1 ? "adf-case__title-hit" : ""}>
                {line}
              </span>
            ))}
          </h1>

          <div className="adf-case__lead">
            {LEAD_PARAGRAPHS.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>

          {/* ── 1. 依頼の経緯 ─────────────────────────────────────────── */}
          <section className="adf-case__section" aria-labelledby="case-h1">
            <h2 className="adf-case__h2" id="case-h1">{SECTION_1.heading}</h2>
            {SECTION_1.body.map((text) => (
              <p key={text}>{text}</p>
            ))}
            <WorkPhotos />
          </section>

          {/* ── 2. 結果 ───────────────────────────────────────────────── */}
          <section className="adf-case__section" aria-labelledby="case-h2">
            <h2 className="adf-case__h2" id="case-h2">{SECTION_2.heading}</h2>
            {SECTION_2.body.map((text) => (
              <p key={text}>{text}</p>
            ))}

            <div className="adf-case__cards">
              {SECTION_2.cards.map((card) => (
                <div
                  key={card.term}
                  className={`adf-case__card${"emphasis" in card && card.emphasis ? " is-hit" : ""}`}
                >
                  <p className="adf-case__card-term">{card.term}</p>
                  <p className="adf-case__card-value">
                    <span className="adf-case__card-label">{card.label}</span>
                    <b>{card.value}</b>
                    <span className="adf-case__card-unit">{card.unit}</span>
                  </p>
                </div>
              ))}
            </div>

            <p className="adf-case__note">{SECTION_2.note}</p>
          </section>

          {/* ── 3. 数字の但し書き ─────────────────────────────────────── */}
          <section className="adf-case__section" aria-labelledby="case-h3">
            <h2 className="adf-case__h2" id="case-h3">{SECTION_3.heading}</h2>
            {SECTION_3.body.map((text) => (
              <p key={text}>{text}</p>
            ))}

            <div className="adf-case__cta">
              <CtaButton />
            </div>
          </section>

          {/* ── 4. 読者へ ─────────────────────────────────────────────── */}
          <section className="adf-case__section" aria-labelledby="case-h4">
            <h2 className="adf-case__h2" id="case-h4">{SECTION_4.heading}</h2>
            {SECTION_4.body.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </section>
        </div>
      </article>

      {/* ── 5. サービス案内（ここから先は高長建設の体験談ではない） ────── */}
      <section className="adf-case__service" aria-labelledby="case-service-h">
        <div className="adf-case__service-inner">
          <p className="adf-case__service-eyebrow">{SERVICE.eyebrow}</p>
          <p className="adf-case__service-target">{SERVICE.target}</p>
          <h2 className="adf-case__service-title" id="case-service-h">{SERVICE.headline}</h2>

          <dl className="adf-case__price">
            <dt>{SERVICE.priceLabel}</dt>
            <dd>{SERVICE.price}</dd>
          </dl>
          <p className="adf-case__price-note">※ {SERVICE.priceNote}</p>

          <p className="adf-case__guarantee">{SERVICE.guarantee}</p>
          {/* 保証表示のすぐ下から、適用条件を読めるようにする */}
          <p className="adf-case__guarantee-note">
            {REFUND_DISCLOSURE}
            <a href="/adofy#refund">適用条件を見る</a>
          </p>

          <div className="adf-case__cta">
            <CtaButton />
          </div>

          <p className="adf-case__service-disclaimer">{SERVICE.disclaimer}</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/**
 * ファーストビュー。
 * 画像が未設定の間は、比率で高さを確保した空白を出す（差し替え時にレイアウトが動かない）。
 */
function HeroMedia() {
  const hasImage = Boolean(HERO.pc || HERO.sp);

  return (
    <div className="adf-case__fv">
      {hasImage ? (
        <picture>
          {HERO.pc ? (
            <source media="(min-width: 768px)" srcSet={HERO.pc} width={HERO.pcW} height={HERO.pcH} />
          ) : null}
          <img
            className="adf-case__fv-img"
            src={(HERO.sp ?? HERO.pc) as string}
            alt={HERO.alt}
            width={HERO.spW}
            height={HERO.spH}
            fetchPriority="high"
            loading="eager"
            decoding="async"
          />
        </picture>
      ) : (
        <div className="adf-case__fv-blank" />
      )}
    </div>
  );
}

/**
 * 高長建設の施工写真。
 * 確認済みの写真を受け取るまでは空白の枠だけを置く。
 * 架空の画像を実績として掲載しないため、ここに仮画像を入れないこと。
 */
function WorkPhotos() {
  return (
    <div className="adf-case__photos">
      {WORK_PHOTOS.map((photo, i) =>
        photo.src ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={photo.src}
            className="adf-case__photo"
            src={photo.src}
            alt={photo.alt}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div key={`blank-${i}`} className="adf-case__photo adf-case__photo--blank" />
        )
      )}
    </div>
  );
}
