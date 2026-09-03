import Script from "next/script";

import { ADOFY_PIXEL_ID } from "@/lib/analytics/adofyPixel";

// adofy関連ページ（/adofy, /contact, /contact/thanks）専用のMeta Pixel。
// このリポジトリは他社のLPも同居しているため、共通の app/layout.tsx には追加せず
// adofy関連ページにのみ個別に読み込む。
//
// PageView は fbq('track') ではなく trackSingle で送る。
// app/layout.tsx が別Pixel（818193851340214）を init しているため、
// track だと両方のPixelへ一斉送信されてしまい、計測が混ざる。
export default function AdofyMetaPixel() {
  return (
    <>
      <Script id="meta-pixel-adofy" strategy="afterInteractive">{`
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${ADOFY_PIXEL_ID}');
        fbq('trackSingle', '${ADOFY_PIXEL_ID}', 'PageView');
      `}</Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${ADOFY_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
