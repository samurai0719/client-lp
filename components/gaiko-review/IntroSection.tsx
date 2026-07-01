import { introContent, problemsContent } from "@/data/gaiko-review/content";
import { ArticleContainer, BodyText, FadeUp, SectionHeading } from "./ui";

export default function IntroSection() {
  return (
    <section className="py-12 sm:py-16" style={{ backgroundColor: "#FFFDF9" }} aria-labelledby="intro-heading">
      <ArticleContainer>
        <FadeUp>
          <SectionHeading id="intro-heading">{introContent.heading}</SectionHeading>
          <div className="space-y-5">
            {introContent.paragraphs.map((p) => (
              <BodyText key={p}>{p}</BodyText>
            ))}
          </div>
        </FadeUp>

        <FadeUp className="mt-10 sm:mt-12">
          <h3
            className="gr-font-serif text-[1.15rem] sm:text-[1.3rem] font-medium mb-5"
            style={{ color: "#2E2923" }}
          >
            {problemsContent.heading}
          </h3>
          <ol className="space-y-3">
            {problemsContent.items.map((item, i) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-xl border px-4 py-3.5"
                style={{ backgroundColor: "#F8F4EC", borderColor: "#DDD3C2" }}
              >
                <span
                  className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold"
                  style={{ backgroundColor: "#566342", color: "#FFFDF9" }}
                  aria-hidden
                >
                  {i + 1}
                </span>
                <span className="text-[15px] sm:text-base leading-relaxed pt-0.5" style={{ color: "#2E2923" }}>
                  {item}
                </span>
              </li>
            ))}
          </ol>
        </FadeUp>
      </ArticleContainer>
    </section>
  );
}
