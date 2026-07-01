import { heroContent } from "@/data/gaiko-review/content";
import { VisuallyHiddenHeading } from "./ui";

// ファーストビューは完成画像をそのまま使用する。画像内にすでに文字が入っているため、
// 画像の上へ追加のタイトル・CTA・テキストは重ねない。トリミングもしない。
export default function Hero() {
  return (
    <section aria-label="ファーストビュー" className="bg-[#F8F4EC]">
      {/* 画像内テキストと重複しないSEO用の見出し（画面には表示しない） */}
      <VisuallyHiddenHeading as="h1">{heroContent.seoHeading}</VisuallyHiddenHeading>

      {/* aspect-ratioをブレークポイントごとに固定し、どちらの画像が選ばれてもCLSが発生しないようにする */}
      <div className="relative w-full aspect-[941/1672] md:aspect-[1672/941] md:max-w-6xl md:mx-auto">
        <picture>
          <source media="(min-width: 768px)" srcSet={heroContent.desktopImage} />
          <img
            src={heroContent.mobileImage}
            alt={heroContent.alt}
            className="absolute inset-0 w-full h-full object-contain"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
      </div>

      <p
        className="mx-auto max-w-[720px] px-5 sm:px-6 pt-3 pb-6 text-center text-xs leading-relaxed"
        style={{ color: "#879174" }}
      >
        {heroContent.priceDiffNote}
      </p>
    </section>
  );
}
