type Variant = "triangle-down" | "triangle-up" | "diagonal" | "wave";
type Tone = "beige" | "green" | "cream" | "orange";

const TONE_COLORS: Record<Tone, string> = {
  beige: "#f3eee0",
  green: "#e9f3ec",
  cream: "#fbf7ed",
  orange: "#fdf0e0",
};

const CLIP_PATHS: Record<"triangle-down" | "triangle-up" | "diagonal", string> = {
  "triangle-down": "polygon(0% 0%, 100% 0%, 100% 58%, 50% 100%, 0% 58%)",
  "triangle-up": "polygon(0% 0%, 100% 0%, 100% 100%, 50% 64%, 0% 100%)",
  diagonal: "polygon(0% 0%, 100% 0%, 100% 68%, 0% 100%)",
};

const HEIGHT_CLASS = "h-44 sm:h-52 md:h-60";

// 見出し(eyebrow〜description)の背後だけに敷く控えめな装飾図形。本文・カード上には伸ばさない。
export default function SectionBackdrop({ variant, tone = "beige" }: { variant: Variant; tone?: Tone }) {
  const color = TONE_COLORS[tone];

  if (variant === "wave") {
    return (
      <div className={`absolute inset-x-0 top-0 ${HEIGHT_CLASS} overflow-hidden pointer-events-none`} aria-hidden="true">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 300" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="M0 0 H1440 V190 C 1120 240, 980 160, 760 195 C 540 230, 360 170, 180 205 C 100 220, 40 215, 0 228 Z"
            fill={color}
          />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`absolute inset-x-0 top-0 ${HEIGHT_CLASS} pointer-events-none`}
      style={{ background: color, clipPath: CLIP_PATHS[variant] }}
      aria-hidden="true"
    />
  );
}
