import type { Metadata } from "next";
import type React from "react";
import "../adofy/adofy.css";
import "./case.css";

import AdofyMetaPixel from "@/components/analytics/AdofyMetaPixel";
import LpInsightTracker, { ADOFY_LP_PROJECT_ID } from "@/components/analytics/LpInsightTracker";
import Footer from "@/components/adofy/Footer";
import { CtaButton, LogoMark } from "@/components/adofy/ui";
import { REFUND_DISCLOSURE, SITE } from "@/components/adofy/config";
import {
  COMPARE, DESCRIPTION, EDITOR_NOTE, HERO, LEAD, MID_CTA_NOTE, PR_LABEL,
  RESULT_CARDS, RESULT_NOTE, SECTIONS, SERVICE, TITLE_LINES, TITLE_PLAIN,
  WORK_PHOTOS, type Chunk, type Item,
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
 * ▼ 未確認の段落について
 *   content.ts の pending 付きチャンクは、まだ本人確認が取れていない仮原稿。
 *   既定（公開表示）では描画せず、?preview=1 のときだけ「確認待ち」と分かる形で出す。
 *   確認が取れた段落は content.ts 側で pending を外す。
 *
 * ▼ 計測
 *   /adofy と同じものを1つずつ置く（重複設置しない）。
 *   問い合わせの完了計測は /contact のフォーム送信成功時にのみ発火するため、
 *   このページのCTA（リンク）ではコンバージョンを送らない。
 */
export default async function AdofyCaseTakanagaPage({
  searchParams,
}: {
  searchParams: Promise<{ preview?: string }>;
}) {
  const preview = (await searchParams).preview === "1";

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

      {preview ? (
        <p className="adf-case__preview-bar">
          プレビュー表示です。オレンジの枠は<b>高長建設さまの確認待ち</b>の仮原稿で、公開表示には出ません。
        </p>
      ) : null}

      <article className="adf-case__article">
        {/* ファーストビュー。画像が入るまでは高さだけ確保した空白 */}
        <HeroMedia />

        <div className="adf-case__body">
          <h1 className="adf-case__title">
            {TITLE_LINES.map((line, i) => (
              <span key={line} className={i === 0 ? "adf-case__title-hit" : ""}>
                {line}
              </span>
            ))}
          </h1>

          <div className="adf-case__lead">
            <Chunks chunks={LEAD} preview={preview} />
          </div>

          {SECTIONS.map((section) => {
            /*
              確認待ちの段落を除いた結果、見出しだけが残る章は出さない。
              （確認が取れて pending が外れれば、自動的に表示される）
            */
            const visible = section.chunks.filter((c) => preview || !c.pending);
            if (visible.length === 0 && !SECTIONS_WITH_EXTRA.has(section.id)) return null;

            return (
            <section key={section.id} className="adf-case__section" aria-labelledby={`h-${section.id}`}>
              <h2 className="adf-case__h2" id={`h-${section.id}`}>
                <span className="adf-case__h2-no">{section.no}</span>
                {section.heading}
              </h2>

              <Chunks chunks={section.chunks} preview={preview} />

              {/* 01 の直後に、高長建設の施工写真を置く */}
              {section.id === "before" ? <WorkPhotos /> : null}

              {/* 04 の編集部補足。本文（高長建設の言葉）とは区別する */}
              {section.id === "tell" ? (
                <aside className="adf-case__editor">
                  <p className="adf-case__editor-label">{EDITOR_NOTE.label}</p>
                  <p className="adf-case__editor-text">{EDITOR_NOTE.text}</p>
                </aside>
              ) : null}

              {/* 05 の実績カード */}
              {section.id === "result" ? <ResultCards /> : null}

              {/* 06 の中間CTA */}
              {section.id === "after" ? (
                <div className="adf-case__cta">
                  <CtaButton />
                  <p className="adf-case__cta-note">{MID_CTA_NOTE}</p>
                </div>
              ) : null}

              {/* 07 の依頼前・依頼後カード */}
              {section.id === "review" ? <CompareCards /> : null}
            </section>
            );
          })}
        </div>
      </article>

      {/* ── 09 サービス案内（ここから先は高長建設の体験談ではない） ────── */}
      <section className="adf-case__service" aria-labelledby="h-service">
        <div className="adf-case__service-inner">
          <p className="adf-case__service-divider">{SERVICE.divider}</p>

          <h2 className="adf-case__service-title" id="h-service">
            {SERVICE.heading.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>

          {SERVICE.body.map((text) => (
            <p key={text} className="adf-case__service-body">
              {text}
            </p>
          ))}

          <div className="adf-case__offer">
            <p className="adf-case__offer-title">{SERVICE.offer}</p>

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
              <p className="adf-case__cta-note">{MID_CTA_NOTE}</p>
            </div>
          </div>

          <p className="adf-case__service-disclaimer">{SERVICE.disclaimer}</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/** 本文以外の要素（写真・カード・CTA）を持つ章。本文が空でも表示する */
const SECTIONS_WITH_EXTRA = new Set(["before", "tell", "result", "after", "review"]);

/* ── 本文のかたまり ───────────────────────────────────────────────────── */

/**
 * 未確認（pending）のチャンクは、公開表示では描画しない。
 * プレビューでは「確認待ち」と分かる枠で囲って出す。
 */
function Chunks({ chunks, preview }: { chunks: readonly Chunk[]; preview: boolean }) {
  return (
    <>
      {chunks.map((chunk, i) => {
        if (chunk.pending && !preview) return null;

        const body = chunk.items.map((item) => <ItemView key={keyOf(item)} item={item} />);

        if (!chunk.pending) return <div key={i}>{body}</div>;

        return (
          <div key={i} className="adf-case__pending">
            <p className="adf-case__pending-label">確認待ち：{chunk.pending.label}</p>
            {body}
          </div>
        );
      })}
    </>
  );
}

function ItemView({ item }: { item: Item }) {
  if ("list" in item) {
    return (
      <ul className="adf-case__list">
        {item.list.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    );
  }
  return <p>{emphasize(item.p, item.em)}</p>;
}

/**
 * 段落内の指定文字列にマーカー線を引く。
 * 本文は content.ts の文字列がそのまま出るだけで、強調の有無で文言は変わらない。
 */
function emphasize(text: string, em?: readonly string[]) {
  if (!em || em.length === 0) return text;

  let rest = text;
  const out: React.ReactNode[] = [];

  for (const phrase of em) {
    const at = rest.indexOf(phrase);
    // 本文に無い指定は無視する（文言を書き換えてまで強調しない）
    if (at === -1) continue;
    if (at > 0) out.push(rest.slice(0, at));
    out.push(
      <mark key={`${phrase}-${out.length}`} className="adf-case__em">
        {phrase}
      </mark>
    );
    rest = rest.slice(at + phrase.length);
  }
  out.push(rest);

  return out;
}

function keyOf(item: Item): string {
  return "list" in item ? item.list.join("|") : item.p;
}

/* ── 実績・比較カード ─────────────────────────────────────────────────── */

function ResultCards() {
  return (
    <>
      <div className="adf-case__cards">
        {RESULT_CARDS.map((card) => (
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
      <p className="adf-case__note">{RESULT_NOTE}</p>
    </>
  );
}

/** 依頼前 → 依頼後。PCは横並び、スマホは上下に並ぶ */
function CompareCards() {
  return (
    <div className="adf-case__compare">
      <div className="adf-case__compare-card">
        <p className="adf-case__card-term">{COMPARE.before.term}</p>
        <p className="adf-case__card-value">
          <span className="adf-case__card-label">{COMPARE.before.label}</span>
          <b>{COMPARE.before.value}</b>
          <span className="adf-case__card-unit">{COMPARE.before.unit}</span>
        </p>
      </div>

      <p className="adf-case__compare-bridge">
        <span aria-hidden="true" className="adf-case__compare-arrow" />
        {COMPARE.bridge}
      </p>

      <div className="adf-case__compare-card is-hit">
        <p className="adf-case__card-term">{COMPARE.after.term}</p>
        <p className="adf-case__card-value">
          <span className="adf-case__card-label">{COMPARE.after.label}</span>
          <b>{COMPARE.after.value}</b>
          <span className="adf-case__card-unit">{COMPARE.after.unit}</span>
        </p>
      </div>
    </div>
  );
}

/* ── 画像 ─────────────────────────────────────────────────────────────── */

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
