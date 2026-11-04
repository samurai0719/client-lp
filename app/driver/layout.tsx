import Script from 'next/script';

/**
 * ドラテク配下の共通レイアウト。
 * Meta Pixel はページごとに分けている:
 *   求職者向け（/driver・/driver/terms・/driver/privacy）→ lib/analytics/doratechSeekerPixel.ts
 *   企業向け（/driver/company・/driver/scout）          → 各 layout.tsx
 */
export default function DriverLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="ptengine"
        src="https://js.ptengine.jp/79j40dus.js"
        strategy="afterInteractive"
      />
      {children}
    </>
  );
}
