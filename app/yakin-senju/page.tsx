import type { Metadata } from 'next';
import Script from 'next/script';
import YakinSenjuContent from './YakinSenjuContent';

export const metadata: Metadata = {
  title: '夜勤専従で働き方を変えたい看護師さんへ | レバウェル看護',
  description:
    '月収〜45万円を目指せる求人も、年間休日149日〜150日前後の求人例も。夜勤専従で収入・休み・人間関係を見直したい看護師向け。レバウェル看護で求人を無料確認。',
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
            fbq('init', '1263924312012938');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src="https://www.facebook.com/tr?id=1263924312012938&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>
      <YakinSenjuContent />
    </>
  );
}
