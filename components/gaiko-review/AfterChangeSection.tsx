import Image from "next/image";
import { Check } from "lucide-react";
import { afterChangeContent } from "@/data/gaiko-review/content";
import type { GalleryImage } from "@/lib/gaikoReview/gallery";
import { ArticleContainer, FadeUp, SectionHeading } from "./ui";
import { withEmphasis } from "./emphasis";

export default function AfterChangeSection({ galleryImages }: { galleryImages: GalleryImage[] }) {
  return (
    <section className="py-12 sm:py-16" style={{ backgroundColor: "#F8F4EC" }} aria-labelledby="after-change-heading">
      <ArticleContainer>
        <FadeUp>
          <SectionHeading id="after-change-heading">{afterChangeContent.heading}</SectionHeading>

          <ul className="space-y-3">
            {afterChangeContent.items.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check size={18} className="shrink-0 mt-0.5" style={{ color: "#566342" }} aria-hidden />
                <span className="text-[15px] sm:text-base leading-relaxed" style={{ color: "#2E2923" }}>
                  {withEmphasis(item)}
                </span>
              </li>
            ))}
          </ul>
        </FadeUp>

        {/* 画像が存在する場合のみギャラリーを表示（ダミー画像は表示しない） */}
        {galleryImages.length > 0 && (
          <FadeUp className="mt-8">
            <h3 className="text-[15px] font-bold mb-3" style={{ color: "#566342" }}>
              {afterChangeContent.galleryHeading}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {galleryImages.map((img) => (
                <div
                  key={img.fileName}
                  className="relative aspect-[4/3] overflow-hidden rounded-lg border"
                  style={{ borderColor: "#DDD3C2" }}
                >
                  <Image
                    src={img.src}
                    alt="施工後の様子"
                    fill
                    loading="lazy"
                    className="object-cover"
                    sizes="(min-width: 640px) 33vw, 50vw"
                  />
                </div>
              ))}
            </div>
          </FadeUp>
        )}
      </ArticleContainer>
    </section>
  );
}
