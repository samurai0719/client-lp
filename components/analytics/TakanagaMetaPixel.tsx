import Script from "next/script";

// 高長建設関連ページ（/gaikou, /gaikou/diagnosis, /gaiko-review, /takanaga/**）専用のMeta Pixel。
// このリポジトリは他社のLPも同居しているため、共通の app/layout.tsx には追加せず
// 高長建設関連ページにのみ個別に読み込む。
const TAKANAGA_PIXEL_ID = "533491373010800";

export default function TakanagaMetaPixel() {
  return (
    <>
      <Script id="meta-pixel-takanaga" strategy="afterInteractive">{`
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${TAKANAGA_PIXEL_ID}');
        fbq('track', 'PageView');
      `}</Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${TAKANAGA_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
