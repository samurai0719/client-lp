import { serviceCategories } from "./data";
import SectionHeading from "./SectionHeading";
import ServiceCard from "./ServiceCard";
import SectionBackdrop from "./SectionBackdrop";

export default function ServicesSection() {
  return (
    <section className="relative px-4 sm:px-6 py-16 md:py-24 overflow-hidden">
      <SectionBackdrop variant="wave" tone="green" />
      <div className="relative z-10 max-w-5xl mx-auto">
        <SectionHeading
          eyebrow="SERVICE"
          title={"対応できる外構リフォーム"}
          description={"駐車場から雑草対策、エクステリアまで幅広く対応しています"}
        />

        <div className="mt-10 md:mt-14 grid sm:grid-cols-3 gap-5 sm:gap-6">
          {serviceCategories.map((category, i) => (
            <ServiceCard key={category.title} category={category} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
