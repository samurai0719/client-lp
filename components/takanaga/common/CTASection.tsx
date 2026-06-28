import Link from "next/link";
import { Phone, ArrowRight, Cpu } from "lucide-react";
import { siteConfig } from "@/data/takanaga/siteConfig";

export default function CTASection() {
  const { cta, contact, externalLinks, company } = siteConfig;

  return (
    <section
      className="relative overflow-hidden py-16 lg:py-20 px-4 sm:px-6 lg:px-8"
      style={{ background: "linear-gradient(135deg, #0f2744 0%, #1a3d6b 55%, #1d5fa6 100%)" }}
      aria-labelledby="cta-heading"
    >
      {/* 背景デコ */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="cta-dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1" fill="rgba(255,255,255,0.04)" />
          </pattern>
          <radialGradient id="cta-glow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="rgba(45,125,210,0.2)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#cta-dots)" />
        <rect width="100%" height="100%" fill="url(#cta-glow)" />
      </svg>

      <div className="relative mx-auto max-w-3xl text-center">
        <p className="tkn-eyebrow justify-center !text-(--tkn-blue-light) mb-3">
          Contact
        </p>
        <h2
          id="cta-heading"
          className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-4"
        >
          {cta.ctaSectionHeading}
        </h2>
        <p className="text-white/75 text-sm sm:text-base leading-relaxed mb-8">
          {cta.ctaSectionSubtext}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={contact.formPath}
            className="tkn-btn-primary !text-base !py-4 !px-8"
          >
            {cta.primary}
            <ArrowRight size={18} aria-hidden />
          </Link>

          {company.phone ? (
            <a
              href={`tel:${company.phone}`}
              className="tkn-btn-outline !text-white !border-white !text-base !py-4 !px-8"
            >
              <Phone size={18} aria-hidden />
              {cta.secondary}
            </a>
          ) : null}

          <Link
            href={externalLinks.simulatorUrl}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white/80 hover:text-white border border-white/30 hover:border-white/60 rounded-full transition-colors"
          >
            <Cpu size={18} aria-hidden />
            {cta.simulation}
          </Link>
        </div>
      </div>
    </section>
  );
}
