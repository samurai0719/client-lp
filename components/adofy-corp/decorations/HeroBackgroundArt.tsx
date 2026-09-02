import DotGrid from "./DotGrid";
import DiagonalLines from "./DiagonalLines";
import OrbitRings from "./OrbitRings";
import GradientBlob from "./GradientBlob";
import WaveDivider from "./WaveDivider";

type HeroBackgroundArtProps = {
  className?: string;
  waveColor?: string;
};

/**
 * Composed first-view background: gradient blob (top right), dot grid (left),
 * a thin diagonal hatch (top corner), orbit rings (behind the right-side
 * visual), and a wave that hands off to the next section. Every layer is
 * pointer-events-none and sized with vw/clamp so it scales down on mobile.
 */
export default function HeroBackgroundArt({
  className = "",
  waveColor = "#ffffff",
}: HeroBackgroundArtProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* corner geometry, top-right */}
      <DiagonalLines
        className="absolute -top-10 right-0 h-[clamp(160px,28vw,320px)] w-[clamp(160px,28vw,320px)] text-accent-blue"
        opacity={0.08}
      />

      {/* large blob, top right */}
      <GradientBlob
        className="absolute -top-24 right-[-12%] w-[clamp(260px,46vw,620px)] aspect-square"
        from="#bfdcff"
        to="#ffd9a0"
        opacity={0.5}
      />

      {/* soft dot grid, left side */}
      <DotGrid
        className="absolute left-0 top-[18%] h-[55%] w-[clamp(160px,30vw,360px)] text-accent-blue hidden sm:block"
        opacity={0.14}
        spacing={26}
      />

      {/* orbit rings behind the right-side visual */}
      <OrbitRings
        className="absolute right-[4%] top-[20%] w-[clamp(220px,32vw,440px)] aspect-square text-accent-blue"
        accentColor="#f59e0b"
        opacity={0.18}
        rings={3}
      />

      {/* wave hand-off to the next section */}
      <WaveDivider
        className="absolute bottom-0 left-0"
        color={waveColor}
        opacity={1}
      />
    </div>
  );
}
