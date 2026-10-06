"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { CTA_HREF, CTA_LABEL } from "./config";

/**
 * スマホ下部の固定CTA。
 * ファーストビューから常に表示し、相談フォーム（#contact）が見えている間だけ隠す
 * （フォームの送信ボタンと重なって入力の邪魔になるため）。
 */
export default function StickyCta() {
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const form = document.getElementById("contact");
    if (!form) return;
    const io = new IntersectionObserver(([entry]) => setFormVisible(entry.isIntersecting), { threshold: 0.05 });
    io.observe(form);
    return () => io.disconnect();
  }, []);

  return (
    <div className={`sr-sticky${formVisible ? " is-hidden" : ""}`} aria-hidden={formVisible}>
      <a href={CTA_HREF} className="sr-btn sr-btn--lg sr-btn--primary sr-sticky__btn" data-sr-cta="sticky" tabIndex={formVisible ? -1 : 0}>
        <span className="sr-sticky__chip">最短2日で応募</span>
        <span>{CTA_LABEL}</span>
        <ArrowRight className="sr-btn__arrow" aria-hidden="true" strokeWidth={2.6} />
      </a>
    </div>
  );
}
