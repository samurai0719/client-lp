import type { Metadata } from 'next';
import Script from 'next/script';
import NurseSenkaHoumonContent from './NurseSenkaHoumonContent';

export const metadata: Metadata = {
  title: '施設訪問看護の求人を探す | ナース専科 転職',
  description:
    '夜勤・急変対応に疲れた看護師へ。施設訪問看護という働き方を知って、ナース専科 転職で今より働きやすい求人を探してみませんか。移動少なめ・日勤中心の求人が見つかる可能性があります。',
};

export default function Page() {
  return (
    <>
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '2308931502947268');
            fbq('track', 'PageView');
          `,
        }}
      />
      <NurseSenkaHoumonContent />
    </>
  );
}
