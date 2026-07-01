import { flowContent } from "@/data/gaiko-review/content";
import { ArticleContainer, FadeUp, SectionHeading } from "./ui";
import { withEmphasis } from "./emphasis";

export default function FlowSection() {
  return (
    <section className="py-12 sm:py-16" style={{ backgroundColor: "#FFFDF9" }} aria-labelledby="flow-heading">
      <ArticleContainer className="sm:max-w-[720px] md:max-w-3xl">
        <FadeUp>
          <SectionHeading id="flow-heading">{flowContent.heading}</SectionHeading>
        </FadeUp>

        <FadeUp>
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {flowContent.steps.map((step) => (
              <li
                key={step.step}
                className="rounded-xl border p-5"
                style={{ backgroundColor: "#F8F4EC", borderColor: "#DDD3C2" }}
              >
                <span
                  className="gr-font-serif inline-flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold mb-3"
                  style={{ backgroundColor: "#566342", color: "#FFFDF9" }}
                  aria-hidden
                >
                  {step.step}
                </span>
                <p className="text-[16px] font-bold mb-1.5" style={{ color: "#2E2923" }}>
                  {step.title}
                </p>
                <p className="text-[14px] leading-relaxed" style={{ color: "#5c574d" }}>
                  {withEmphasis(step.description)}
                </p>
              </li>
            ))}
          </ol>
        </FadeUp>
      </ArticleContainer>
    </section>
  );
}
