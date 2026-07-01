import { concernsContent } from "@/data/gaiko-review/content";
import { ArticleContainer, BodyText, FadeUp, SectionHeading } from "./ui";

export default function ConcernsSection() {
  return (
    <section className="py-12 sm:py-16" style={{ backgroundColor: "#F8F4EC" }} aria-labelledby="concerns-heading">
      <ArticleContainer>
        <FadeUp>
          <SectionHeading id="concerns-heading">{concernsContent.heading}</SectionHeading>
        </FadeUp>

        <div className="space-y-6">
          {concernsContent.items.map((item) => (
            <FadeUp key={item.question}>
              <div className="border-l-2 pl-4" style={{ borderColor: "#B7812D" }}>
                <p className="text-[16px] sm:text-[17px] font-bold mb-1.5" style={{ color: "#2E2923" }}>
                  {item.question}
                </p>
                <BodyText>{item.answer}</BodyText>
              </div>
            </FadeUp>
          ))}
        </div>
      </ArticleContainer>
    </section>
  );
}
