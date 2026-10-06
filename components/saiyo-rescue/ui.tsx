import { Fragment, type ReactNode } from "react";
import { ArrowRight, Zap } from "lucide-react";
import { CTA_HREF, CTA_LABEL, GUARANTEE_NOTE, type PlanId } from "./config";

/**
 * 相談フォーム（#contact）へのCTAボタン。
 * plan を渡すと、ContactForm 側がクリックを拾ってそのプランを選択済みにする。
 */
export function CtaButton({
  label = CTA_LABEL,
  plan,
  size = "lg",
  variant = "primary",
  location,
}: {
  label?: string;
  plan?: PlanId;
  size?: "sm" | "lg";
  variant?: "primary" | "gold";
  location: string;
}) {
  return (
    <a
      href={CTA_HREF}
      className={`sr-btn sr-btn--${size} sr-btn--${variant}`}
      data-sr-plan={plan}
      data-sr-cta={location}
    >
      <span>{label}</span>
      <ArrowRight className="sr-btn__arrow" aria-hidden="true" strokeWidth={2.6} />
    </a>
  );
}

/**
 * セクション途中のCTA。ボタンの上に後押しの一言、下に安心材料（返金保証の注記など）を添える。
 */
export function CtaBlock({
  location,
  lead,
  art,
  note = `相談無料｜全額返金保証は${GUARANTEE_NOTE.replace("※", "")}`,
}: {
  location: string;
  lead?: ReactNode;
  /** 後押しの一言に添える挿絵（線画SVG） */
  art?: ReactNode;
  note?: ReactNode;
}) {
  return (
    <div className="sr-ctablock">
      {art && <div className="sr-ctablock__art">{art}</div>}
      {lead && <p className="sr-ctablock__lead">{lead}</p>}
      <SpeedBadge />
      <CtaButton location={location} />
      {note && <p className="sr-ctablock__note">{note}</p>}
    </div>
  );
}

/** CTA直上に置く「最短2日で応募」バッジ */
export function SpeedBadge({ invert = false }: { invert?: boolean }) {
  return (
    <p className={`sr-speed${invert ? " sr-speed--invert" : ""}`}>
      <Zap aria-hidden="true" className="sr-speed__icon" strokeWidth={2.6} />
      <span>
        最短<b>2日</b>で応募
      </span>
    </p>
  );
}

/** セクション見出し（小見出し＋大見出し＋リード） */
export function SectionHead({
  eyebrow,
  title,
  lead,
  id,
  invert = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  id?: string;
  invert?: boolean;
}) {
  return (
    <header className={`sr-head${invert ? " sr-head--invert" : ""}`}>
      {eyebrow && <p className="sr-head__eyebrow">{eyebrow}</p>}
      <h2 className="sr-head__title" id={id}>
        {title}
      </h2>
      {lead && <p className="sr-head__lead">{lead}</p>}
    </header>
  );
}

/** 返金保証バッジ（FV・料金・最終CTAで共通） */
export function GuaranteeSeal({ note, compact = false }: { note: string; compact?: boolean }) {
  return (
    <div className={`sr-seal${compact ? " sr-seal--compact" : ""}`}>
      <span className="sr-seal__icon" aria-hidden="true">
        <svg viewBox="0 0 48 48" width="100%" height="100%">
          <path d="M24 3 6 10v12c0 11.5 7.7 20.6 18 23 10.3-2.4 18-11.5 18-23V10L24 3Z" fill="currentColor" />
          <path d="m15.5 24.5 6 6 11-12" fill="none" stroke="#fff" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="sr-seal__body">
        <span className="sr-seal__pre">求人の応募が来なければ</span>
        <span className="sr-seal__main">全額返金保証</span>
        <span className="sr-seal__note">{note}</span>
      </span>
    </div>
  );
}

/** "**強調**" 記法を <strong> に変換して表示する */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((p, i) => (i % 2 === 1 ? <strong key={i}>{p}</strong> : <Fragment key={i}>{p}</Fragment>))}
    </>
  );
}
