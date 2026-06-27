type SectionDividerProps = {
  flip?: boolean;
  color?: string;
};

// セクション間をつなぐ曲線SVG。color はつなぎ先セクションの背景色。
export default function SectionDivider({ flip = false, color = "#ffffff" }: SectionDividerProps) {
  return (
    <div className={`gaikou-divider ${flip ? "gaikou-divider-flip" : ""}`} aria-hidden="true">
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" width="100%" height="56">
        <path
          d="M0 32 C 240 72, 480 0, 720 28 C 960 56, 1200 8, 1440 36 L1440 80 L0 80 Z"
          fill={color}
        />
      </svg>
    </div>
  );
}
