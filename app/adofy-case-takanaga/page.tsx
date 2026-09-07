import type { Metadata } from "next";
import type React from "react";
import "../adofy/adofy.css";
import "./case.css";

import AdofyMetaPixel from "@/components/analytics/AdofyMetaPixel";
import LpInsightTracker, { ADOFY_LP_PROJECT_ID } from "@/components/analytics/LpInsightTracker";
import Footer from "@/components/adofy/Footer";
import { CtaButton, LogoMark } from "@/components/adofy/ui";
import { REFUND_DISCLOSURE, SITE } from "@/components/adofy/config";
import { StickyCta, ZoomableImage } from "./ArticleParts";
import {
  CTA_LEADS, CTA_NOTE, DESCRIPTION, HERO, IMG_CONCERNS, IMG_CONSULTATION,
  IMG_SERVICE, LEAD, PR_LABEL, RESULT_CARDS, RESULT_NOTE, SECTIONS, SERVICE,
  TITLE, type Chunk, type Item,
} from "./content";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.lpUrl),
  title: `${TITLE}｜PR`,
  description: DESCRIPTION,
  openGraph: {
    type: "article",
    locale: "ja_JP",
    siteName: SITE.name,
    title: TITLE,
    description: DESCRIPTION,
    images: [HERO.pc],
  },
  // 広告の受け皿となるPR記事のため、検索結果には出さない（LP本体との重複を避ける）
  robots: { index: false, follow: true },
};

/** 記事内の最初のCTAと最終CTA。追従CTAの出し入れに使う */
const FIRST_CTA_ID = "cta-after-result";
const FINAL_CTA_ID = "cta-end";
const FOOTER_ID = "article-footer";
/** 追従CTAを隠す相手。最終CTAとフッターは絶対に覆わない */
const STICKY_HIDE_IDS = [FINAL_CTA_ID, FOOTER_ID] as const;

/** 本文以外の要素（画像・カード・CTA）を持つ章。本文が空でも表示する */
const SECTIONS_WITH_EXTRA = new Set(["before", "start", "result"]);

/**
 * 高長建設のPR記事（体験談型の記事LP）。
 *
 * 語り手は高長建設（「私たち」「当社」）。サービス案内の章から adofy の説明に切り替わる。
 * 原稿は content.ts に集約してあり、高長建設の確認・修正はそのファイルだけで完結する。
 *
 * ▼ 未確認の段落について
 *   content.ts の pending 付きチャンクは、まだ本人確認が取れていない仮原稿。
 *   既定（公開表示）では描画せず、?preview=1 のときだけ「確認待ち」と分かる形で出す。
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
        {/* ファーストビュー。画像に見出しが入っているため、h1は下に簡潔に置く */}
        <div className="adf-case__fv">
          <picture>
            <source media="(min-width: 768px)" srcSet={HERO.pc} width={HERO.pcW} height={HERO.pcH} />
            <img
              className="adf-case__fv-img"
              src={HERO.sp}
              alt={HERO.alt}
              width={HERO.spW}
              height={HERO.spH}
              fetchPriority="high"
              loading="eager"
              decoding="async"
            />
          </picture>
        </div>

        <div className="adf-case__body">
          <h1 className="adf-case__title">{TITLE}</h1>

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
                  {section.heading}
                </h2>

                <Chunks chunks={section.chunks} preview={preview} />

                {/* 悩みを読んだあとに、悩みの画像を出す */}
                {section.id === "before" ? <ZoomableImage image={IMG_CONCERNS} /> : null}

                {/* 相談から見せ方の話へ渡す位置 */}
                {section.id === "start" ? <ZoomableImage image={IMG_CONSULTATION} /> : null}

                {/* 実績と、その直下の注記、そして最初のCTA */}
                {section.id === "result" ? (
                  <>
                    <ResultCards />
                    <CtaBlock id={FIRST_CTA_ID} lead={CTA_LEADS.afterResult} />
                  </>
                ) : null}
              </section>
            );
          })}
        </div>
      </article>

      {/* ── サービス案内（ここから先は高長建設の体験談ではない） ────────── */}
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

          <ZoomableImage image={IMG_SERVICE} />

          {/* 画像に描かれた条件を、HTMLでも読める形で置く */}
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

            <CtaBlock lead={CTA_LEADS.service} />
          </div>

          <p className="adf-case__service-disclaimer">{SERVICE.disclaimer}</p>
        </div>
      </section>

      {/* ── 記事末尾のCTA ─────────────────────────────────────────────── */}
      <section className="adf-case__end" aria-label="無料相談">
        <div className="adf-case__end-inner">
          <CtaBlock id={FINAL_CTA_ID} lead={CTA_LEADS.end} />
        </div>
      </section>

      <StickyCta firstCtaId={FIRST_CTA_ID} hideWhenVisibleIds={STICKY_HIDE_IDS} />

      {/* 追従CTAがフッター（運営者情報・プライバシーポリシー）を覆わないようにする */}
      <div id={FOOTER_ID}>
        <Footer />
      </div>
    </div>
  );
}

/* ── CTA ──────────────────────────────────────────────────────────────── */

function CtaBlock({ id, lead }: { id?: string; lead: string }) {
  return (
    <div className="adf-case__cta" id={id}>
      <p className="adf-case__cta-lead">{lead}</p>
      <CtaButton />
      <p className="adf-case__cta-note">{CTA_NOTE}</p>
    </div>
  );
}

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
  return <p>{highlight(item.p, item.em, item.hit)}</p>;
}

function keyOf(item: Item): string {
  return "list" in item ? item.list.join("|") : item.p;
}

/**
 * 段落内の強調。
 *   em  … 淡い黄色のマーカーを敷く一文
 *   hit … オレンジで目立たせる要点（22件 など）
 * 本文に無い指定は無視する（文言を書き換えてまで強調しない）。
 */
function highlight(text: string, em?: readonly string[], hit?: readonly string[]) {
  const marks = [
    ...(em ?? []).map((phrase) => ({ phrase, cls: "adf-case__em" })),
    ...(hit ?? []).map((phrase) => ({ phrase, cls: "adf-case__hit" })),
  ];
  if (marks.length === 0) return text;

  // 長い指定から順に処理し、短い語が先に切り出されて入れ子になるのを防ぐ
  marks.sort((a, b) => b.phrase.length - a.phrase.length);

  type Part = string | React.ReactElement;
  let nodes: Part[] = [text];

  for (const { phrase, cls } of marks) {
    const next: Part[] = [];
    for (const [ni, node] of nodes.entries()) {
      if (typeof node !== "string") {
        next.push(node);
        continue;
      }
      const at = node.indexOf(phrase);
      if (at === -1) {
        next.push(node);
        continue;
      }
      if (at > 0) next.push(node.slice(0, at));
      next.push(
        <span key={`${cls}-${ni}-${phrase}`} className={cls}>
          {phrase}
        </span>
      );
      const tail = node.slice(at + phrase.length);
      if (tail) next.push(tail);
    }
    nodes = next;
  }
  return nodes;
}

/* ── 実績 ─────────────────────────────────────────────────────────────── */

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
