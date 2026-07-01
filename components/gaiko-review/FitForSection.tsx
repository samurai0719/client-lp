import { fitForContent, notFitForContent } from "@/data/gaiko-review/content";
import { ArticleContainer, BodyText, FadeUp, SectionHeading } from "./ui";

export default function FitForSection() {
  return (
    <section className="py-12 sm:py-16" style={{ backgroundColor: "#FFFDF9" }} aria-labelledby="fit-for-heading">
      <ArticleContainer>
        <FadeUp>
          <SectionHeading id="fit-for-heading">{fitForContent.heading}</SectionHeading>
          <ul className="space-y-3 mb-12">
            {fitForContent.items.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-[15px] sm:text-base leading-[1.8]"
                style={{ color: "#2E2923" }}
              >
                <span
                  className="shrink-0 mt-2 w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: "#B7812D" }}
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>
        </FadeUp>

        <FadeUp>
          <div className="rounded-2xl border p-5 sm:p-7" style={{ backgroundColor: "#F8F4EC", borderColor: "#DDD3C2" }}>
            <h3 className="text-[16px] sm:text-[18px] font-bold mb-3" style={{ color: "#2E2923" }}>
              {notFitForContent.heading}
            </h3>
            <div className="space-y-3">
              {notFitForContent.paragraphs.map((p) => (
                <BodyText key={p} className="!text-[15px] sm:!text-base">
                  {p}
                </BodyText>
              ))}
            </div>
          </div>
        </FadeUp>
      </ArticleContainer>
    </section>
  );
}
