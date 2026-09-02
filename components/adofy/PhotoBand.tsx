"use client";

import { useInView } from "./motion";

/**
 * セクションの補強に使う横長写真。
 * 比率を実寸（16:9）で固定しているのでレイアウトシフトが起きず、
 * 画面外では読み込まない（loading="lazy"）。
 *
 * 写真は「サービスの進め方」を示す説明用の素材として扱う。
 * 特定の人物や案件を指す文言は付けない。
 */
export default function PhotoBand({
  src,
  alt,
  caption,
  tone = "light",
}: {
  src: string;
  alt: string;
  caption?: string;
  /** 暗色セクションに置く場合は dark を指定して枠線を調整する */
  tone?: "light" | "dark";
}) {
  const ref = useInView<HTMLElement>({ threshold: 0.15 });

  return (
    <figure
      ref={ref}
      className={`adf-photo adf-photo--${tone} adf-reveal adf-reveal--up`}
    >
      <span className="adf-photo__frame">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          width={1672}
          height={941}
          loading="lazy"
          decoding="async"
        />
      </span>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
