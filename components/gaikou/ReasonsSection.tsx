import { reasons } from "./data";
import SectionHeading from "./SectionHeading";
import ReasonCard from "./ReasonCard";
import SectionBackdrop from "./SectionBackdrop";

export default function ReasonsSection() {
  return (
    <section className="relative px-4 sm:px-6 py-16 md:py-24 overflow-hidden">
      <SectionBackdrop variant="diagonal" tone="beige" />
      <div className="relative z-10 max-w-4xl mx-auto">
        <SectionHeading eyebrow="REASON" title={"選ばれる理由"} />

        <div className="mt-10 md:mt-14 grid sm:grid-cols-2 gap-4 sm:gap-5">
          {reasons.map((reason, i) => (
            <ReasonCard key={reason.title} reason={reason} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
