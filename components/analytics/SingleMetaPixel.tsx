import Script from "next/script";

/**
 * 指定したMeta Pixelを読み込む。PageView は他のPixelへ混ざらないよう trackSingle で送る。
 * 初期化が終わったら window.__metaPixelReady[id] を立て、それまでに溜まったイベント
 * （components/driver-company/track.ts の trackCompany が溜める）を送る。
 */
export default function SingleMetaPixel({ id }: { id: string }) {
  return (
    <>
      <Script id={`meta-pixel-${id}`} strategy="afterInteractive">{`
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${id}');
        fbq('trackSingle', '${id}', 'PageView');
        window.__metaPixelReady=window.__metaPixelReady||{};
        window.__metaPixelReady['${id}']=true;
        var pend=window.__metaPixelPending&&window.__metaPixelPending['${id}'];
        if(pend){pend.forEach(function(a){fbq.apply(null,a);});delete window.__metaPixelPending['${id}'];}
      `}</Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
