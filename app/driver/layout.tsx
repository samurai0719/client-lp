import Script from 'next/script';

export default function DriverLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1419823599748987');
          fbq('track', 'PageView');
        `}
      </Script>
      <Script
        id="ptengine"
        src="https://js.ptengine.jp/79j40dus.js"
        strategy="afterInteractive"
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src="https://www.facebook.com/tr?id=1419823599748987&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>
      {children}
    </>
  );
}
