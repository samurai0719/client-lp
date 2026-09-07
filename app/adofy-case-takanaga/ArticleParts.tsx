"use client";

import { useCallback, useEffect, useState } from "react";
import { CtaButton } from "@/components/adofy/ui";
import { CTA_NOTE, type ArticleImage, type ShowcaseItem } from "./content";

/**
 * 本文中の画像。
 *
 * ・文字入りの画像なので、トリミングせず全体を出す（width:100% / height:auto）。
 * ・タップすると拡大表示し、×ボタン・背景タップ・Escで閉じられる。
 * ・人物や施工風景はイメージ。実写真ではないため、画像の下に「イメージ」と添える。
 */
export function ZoomableImage({
  image,
  priority = false,
}: {
  image: ArticleImage;
  priority?: boolean;
}) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    // 拡大中は背後がスクロールしないようにする
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  return (
    <figure className="adf-case__figure">
      <button
        type="button"
        className="adf-case__figure-btn"
        onClick={() => setOpen(true)}
        aria-label={`画像を拡大する：${image.alt}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="adf-case__figure-img"
          src={image.src}
          alt={image.alt}
          width={image.w}
          height={image.h}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
        />
      </button>
      <figcaption className="adf-case__figure-cap">{image.caption}</figcaption>

      {open ? (
        <div
          className="adf-case__zoom"
          role="dialog"
          aria-modal="true"
          aria-label="画像の拡大表示"
          onClick={close}
        >
          <button type="button" className="adf-case__zoom-close" onClick={close}>
            閉じる
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="adf-case__zoom-img"
            src={image.src}
            alt={image.alt}
            width={image.w}
            height={image.h}
            decoding="async"
          />
        </div>
      ) : null}
    </figure>
  );
}

/**
 * 実際の画面のスクリーンショット。
 *
 * ・イメージ画像ではなく実物なので「イメージ」注記は付けない。
 * ・縦長のスマホ画面なので、PCでは最大420pxに抑えて中央に置く。
 * ・タップで拡大できる。拡大表示にも同じ加工済み画像を使う。
 * ・画像内のボタンはスクリーンショットの一部。記事のCTAと区別するため枠を付ける。
 */
export function ScreenShot({ item }: { item: ShowcaseItem }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  return (
    <figure className="adf-case__shot">
      <button
        type="button"
        className="adf-case__shot-btn"
        onClick={() => setOpen(true)}
        aria-label={`画面を拡大する：${item.alt}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="adf-case__shot-img"
          src={item.src}
          alt={item.alt}
          width={item.w}
          height={item.h}
          loading="lazy"
          decoding="async"
        />
      </button>
      <figcaption className="adf-case__shot-cap">
        <span className="adf-case__shot-text">{item.text}</span>
        {item.note ? <span className="adf-case__shot-note">{item.note}</span> : null}
      </figcaption>

      {open ? (
        <div
          className="adf-case__zoom"
          role="dialog"
          aria-modal="true"
          aria-label="画面の拡大表示"
          onClick={close}
        >
          <button type="button" className="adf-case__zoom-close" onClick={close}>
            閉じる
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="adf-case__zoom-img"
            src={item.src}
            alt={item.alt}
            width={item.w}
            height={item.h}
            decoding="async"
          />
        </div>
      ) : null}
    </figure>
  );
}

/**
 * スマートフォンの追従CTA。
 *
 * ・記事内の最初のCTAを通過してから出す（読む前から追いかけない）。
 * ・最終CTA、またはフッターが見えている間は隠す（それらを覆わないため）。
 */
export function StickyCta({
  firstCtaId,
  hideWhenVisibleIds,
}: {
  firstCtaId: string;
  /** これらが画面に入っている間は追従CTAを隠す（最終CTA・フッター） */
  hideWhenVisibleIds: readonly string[];
}) {
  const [passedFirst, setPassedFirst] = useState(false);
  const [blockedBy, setBlockedBy] = useState<readonly string[]>([]);

  useEffect(() => {
    const first = document.getElementById(firstCtaId);
    if (!first) return;

    const firstObserver = new IntersectionObserver(
      ([entry]) => {
        // 最初のCTAが画面より上へ流れたら「通過した」とみなす
        if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
          setPassedFirst(true);
        }
      },
      { threshold: 0 }
    );
    firstObserver.observe(first);

    const hideObserver = new IntersectionObserver(
      (entries) => {
        setBlockedBy((prev) => {
          const next = new Set(prev);
          for (const entry of entries) {
            const id = entry.target.id;
            if (entry.isIntersecting) next.add(id);
            else next.delete(id);
          }
          return [...next];
        });
      },
      { threshold: 0 }
    );
    for (const id of hideWhenVisibleIds) {
      const el = document.getElementById(id);
      if (el) hideObserver.observe(el);
    }

    return () => {
      firstObserver.disconnect();
      hideObserver.disconnect();
    };
  }, [firstCtaId, hideWhenVisibleIds]);

  const show = passedFirst && blockedBy.length === 0;

  return (
    <div className={`adf-case__sticky${show ? " is-on" : ""}`} aria-hidden={!show}>
      <CtaButton size="sm" />
      <p className="adf-case__sticky-note">{CTA_NOTE}</p>
    </div>
  );
}
