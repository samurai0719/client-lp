import type { Metadata } from 'next';
import Script from 'next/script';
import ShisetsuHoumonContent from './ShisetsuHoumonContent';

export const metadata: Metadata = {
  title: '施設訪問看護で働きたい看護師へ | ナース専科 転職',
  description:
    '病院勤務に疲れた看護師へ。施設訪問看護という働き方を知っていますか？移動負担が少なめ・チームで働ける・スケジュールが安定しやすい求人も。ナース専科 転職で条件を確認してみませんか？',
};

export default function Page() {
  return (
    <>
      <Script
        id="meta-pixel-shisetsu-houmon"
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
      <ShisetsuHoumonContent />
    </>
  );
}
