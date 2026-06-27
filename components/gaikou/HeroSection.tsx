import { getImageProps } from "next/image";

// ファーストビュー：画像内に文言・価格がすべて含まれているため、HTML側で文字を重ねない。
// <picture> による Art Direction で、画面幅に応じて該当する1枚のみを読み込む。
export default function HeroSection() {
  const common = {
    alt: "外構リフォーム職人による駐車場コンクリート工事の様子と、岐阜県対応・現地調査無料、駐車場コンクリート10㎡10万円からの料金案内",
    sizes: "100vw",
    quality: 85,
  };

  const { props: desktopProps } = getImageProps({
    ...common,
    src: "/images/gaikou/hero-desktop.png",
    width: 1672,
    height: 941,
  });

  const { props: mobileProps } = getImageProps({
    ...common,
    src: "/images/gaikou/hero-mobile.png",
    width: 941,
    height: 1672,
    priority: true,
  });

  return (
    <section className="relative w-full bg-white" aria-label="ファーストビュー">
      <picture>
        <source media="(min-width: 1024px)" srcSet={desktopProps.srcSet} />
        <img
          {...mobileProps}
          alt={mobileProps.alt}
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </picture>
    </section>
  );
}
