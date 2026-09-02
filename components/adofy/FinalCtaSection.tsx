"use client";

import { useInView } from "./motion";
import { CtaBlock } from "./ui";

/**
 * 最終CTA。CTA_HREF の初期値（#contact）の着地点でもある。
 * フォームやLINEへ切り替える場合は config.ts の CTA_HREF を変更するだけでよい。
 */
export default function FinalCtaSection() {
  const ref = useInView<HTMLDivElement>({ threshold: 0.2 });

  return (
    <section id="contact" className="adf-section adf-final" aria-labelledby="adf-final-h">
      <div className="adf-container">
        <div ref={ref} className="adf-reveal adf-reveal--up">
          <h2 className="adf-final__title" id="adf-final-h">
            下請けに依存し続ける経営から、
            <br />
            <em>自社で仕事を獲得できる経営へ。</em>
          </h2>
          <p className="adf-final__lead">
            まずは現在の集客状況や、これから受注したい工事についてお聞かせください。
            ホームページが必要かどうかも含めて、無料でご相談いただけます。
          </p>
        </div>

        <CtaBlock guide />
      </div>
    </section>
  );
}
