import type { Metadata } from 'next';
import Script from 'next/script';
import TaxiTenshokuContent from './TaxiTenshokuContent';

export const metadata: Metadata = {
  title: '東京・神奈川・千葉・埼玉・大阪で働ける方へ | レバジョブ',
  description:
    '未経験からタクシードライバーで月収50万円を目指せる求人も。普通免許から応募可能、二種免許取得サポートあり。月13回前後の出勤も可能。レバジョブで求人を無料確認。',
};

export default function Page() {
  return (
    <>
      <Script
        id="meta-pixel-taxi-tenshoku"
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
            fbq('init', '2481264155660530');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src="https://www.facebook.com/tr?id=2481264155660530&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>
      <TaxiTenshokuContent />
    </>
  );
}
