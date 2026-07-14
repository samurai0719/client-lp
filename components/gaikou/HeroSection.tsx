import { getImageProps } from "next/image";

// ファーストビュー：画像内に文言・価格がすべて含まれているため、HTML側で文字を重ねない。
// <picture> による Art Direction で、画面幅に応じて該当する1枚のみを読み込む。
// 画像を差し替えるときは同名上書きせず、新しいファイル名（-2, -3…）で追加して
// パスを変更する（Vercelの画像キャッシュが旧画像を返し続けるのを防ぐため）。
export default function HeroSection() {
  const common = {
    sizes: "100vw",
    quality: 85,
  };

  const { props: desktopProps } = getImageProps({
    ...common,
    alt: "外構リフォーム職人による駐車場コンクリート工事の様子と、岐阜県対応・現地調査無料、駐車場コンクリート10㎡10万円からの料金案内",
    src: "/images/gaikou/hero-desktop-2.png",
    width: 1672,
    height: 941,
  });

  const { props: mobileProps } = getImageProps({
    ...common,
    alt: "外構リフォーム職人による駐車場コンクリート工事の様子と、岐阜県対応・現地調査無料、駐車場コンクリート10㎡10万円からの料金案内",
    src: "/images/gaikou/hero-mobile-5.png",
    width: 1024,
    height: 1536,
    priority: true,
  });

  return (
    <section className="relative w-full bg-white" aria-label="ファーストビュー">
      <picture>
        <source media="(min-width: 1024px)" srcSet={desktopProps.srcSet} />
        {/* デスクトップでは直下のCTAが初期表示に収まるよう、FVの高さを画面の75%までに抑える
            （object-contain のため画像は切れず、左右に余白が出るだけ） */}
        <img
          {...mobileProps}
          alt={mobileProps.alt}
          style={{ width: "100%", height: "auto", display: "block" }}
          className="lg:max-h-[70vh] lg:object-contain lg:mx-auto"
        />
      </picture>
    </section>
  );
}
