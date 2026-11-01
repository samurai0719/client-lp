import Script from "next/script";
import { SHOKUNIN_ENTRY_PIXEL_ID } from "@/lib/analytics/shokuninEntryPixel";

/** 職人採用エージェントのMeta Pixel（/shokunin-entry・/shokunin-agent）。PageView は他のPixelへ混ざらないよう trackSingle で送る */
export default function EntryPixel() {
  return (
    <>
      <Script id="meta-pixel-shokunin-entry" strategy="afterInteractive">{`
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${SHOKUNIN_ENTRY_PIXEL_ID}');
        fbq('trackSingle', '${SHOKUNIN_ENTRY_PIXEL_ID}', 'PageView');
      `}</Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${SHOKUNIN_ENTRY_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
