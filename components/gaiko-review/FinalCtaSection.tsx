import { ArticleContainer } from "./ui";
import CtaBlock from "./CtaBlock";

export default function FinalCtaSection() {
  return (
    <section className="py-14 sm:py-20" style={{ backgroundColor: "#566342" }} aria-label="無料相談CTA">
      <ArticleContainer>
        <CtaBlock placement="final" large />
      </ArticleContainer>
    </section>
  );
}
