import { getImageProps } from "next/image";

// ファーストビュー：画像内に文言がすべて含まれているため、HTML側で文字を重ねない。
// <picture> による Art Direction で、画面幅に応じて該当する1枚のみを読み込む。
// 画像を差し替えるときは同名上書きせず、新しいファイル名（-2, -3…）で追加して
// パスを変更する（Vercelの画像キャッシュが旧画像を返し続けるのを防ぐため）。
export default function HeroSection() {
  const common = {
    sizes: "100vw",
    quality: 85,
  };

  const alt =
    "ハウスメーカーの新築外構、高すぎませんか？外構専門店に直接相談で費用を抑えやすい。駐車場・門柱・アプローチ・フェンス・庭までまとめて対応。東海3県対応・現地調査・お見積り無料";

  const { props: desktopProps } = getImageProps({
    ...common,
    alt,
    src: "/images/new-exterior/hero-desktop.png",
    width: 1672,
    height: 941,
  });

  const { props: mobileProps } = getImageProps({
    ...common,
    alt,
    src: "/images/new-exterior/hero-mobile.png",
    width: 941,
    height: 1672,
    priority: true,
  });

  return (
    <section className="relative w-full bg-[#f7f4ea]" aria-label="ファーストビュー">
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
