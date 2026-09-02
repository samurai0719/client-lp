"use client";

import { HERO_IMAGE } from "./config";
import { useInView } from "./motion";

/**
 * ファーストビュー。
 * 画像は config.ts の HERO_IMAGE で差し替える。
 * 画像の上にテキストやボタンは重ねない（クリエイティブをそのまま見せる）。
 *
 * クリエイティブに文字が入っているため、意図的にパララックスは掛けていない。
 * 動かすと端に隙間が出るか、拡大して画像内の文字が切れてしまうため、
 * 登場演出はマスク解除とわずかなズームアウト（最終状態は等倍）に留めている。
 */
export default function HeroSection() {
  const frameRef = useInView<HTMLDivElement>({ threshold: 0.05 });
  const hasImage = Boolean(HERO_IMAGE.pc || HERO_IMAGE.sp);

  return (
    <section className="adf-hero" aria-label="ファーストビュー">
      {/*
        LCP対象なので、HTMLの解析段階で読み込みを始めさせる。
        media を分けているため、実際に表示される1枚だけが先読みされる。
        （React 19 が <link> を <head> に巻き上げる）
      */}
      {HERO_IMAGE.pc ? (
        <link rel="preload" as="image" href={HERO_IMAGE.pc} media="(min-width: 768px)" />
      ) : null}
      {HERO_IMAGE.sp ? (
        <link rel="preload" as="image" href={HERO_IMAGE.sp} media="(max-width: 767px)" />
      ) : null}
      <div ref={frameRef} className="adf-hero__frame">
        {hasImage ? (
          <picture>
            {HERO_IMAGE.pc ? (
              <source
                media="(min-width: 768px)"
                srcSet={HERO_IMAGE.pc}
                width={HERO_IMAGE.pcW}
                height={HERO_IMAGE.pcH}
              />
            ) : null}
            <img
              className="adf-hero__img"
              src={(HERO_IMAGE.sp ?? HERO_IMAGE.pc) as string}
              alt={HERO_IMAGE.alt}
              width={HERO_IMAGE.spW}
              height={HERO_IMAGE.spH}
              // LCP要素なので優先的に読み込ませ、遅延読み込みはしない
              fetchPriority="high"
              loading="eager"
              decoding="async"
            />
          </picture>
        ) : (
          /* 画像未設定：高さだけ確保した白紙エリア（CLSを起こさない） */
          <div className="adf-hero__blank" />
        )}
      </div>

      <div className="adf-container">
        <p className="adf-scrollcue">
          <span className="adf-scrollcue__line" aria-hidden="true" />
          SCROLL
        </p>
      </div>
    </section>
  );
}
