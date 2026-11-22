import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ナースジョブサポート | 看護師専門の転職サポート",
  description: "看護師専門のキャリアアドバイザーが転職活動を無料で全面サポート。9万件以上の求人から、あなたに合う職場を見つけます。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Meta Pixel — PageView only。ドラテク求職者ページと /drivers のLPでは読み込まない（専用Pixelだけにする） */}
        <Script id="meta-pixel" strategy="afterInteractive">{`
          var h=location.hostname,p=location.pathname;
          var seeker=(h==='driver.taxidriver-beginner.com'&&p!=='/company'&&p.indexOf('/company/')!==0)||
            ((p==='/driver'||p.indexOf('/driver/')===0)&&p.indexOf('/driver/company')!==0&&p.indexOf('/driver/scout/')!==0&&p!=='/driver/scout');
          // scout.adofy-site.com/drivers（物理ルート /driver/scout-direct）も専用Pixelだけにする
          if((h==='scout.adofy-site.com'||h==='scout.localhost')&&p==='/drivers')seeker=true;
          // 無料オンライン相談LP（driver.taxidriver-beginner.com/company・doratech.adofy-site.com/consult、物理ルート /driver/consult）も専用Pixel 3711 だけ
          if((h==='driver.taxidriver-beginner.com'&&p==='/company')||(h==='doratech.adofy-site.com'&&p==='/consult'))seeker=true;
          // 週休3日の看護師向けLP（/nurse-shukyu3）は既存LPから引き継いだ専用Pixel 1263924312012938 だけ
          if(p==='/nurse-shukyu3'||p.indexOf('/nurse-shukyu3/')===0)seeker=true;
          // レバジョブ（ドライバー）のアンケート型記事LP（/levjob-driver）は専用Pixel 1186966720393058 だけ
          if(p==='/levjob-driver'||p.indexOf('/levjob-driver/')===0)seeker=true;
          // レバジョブ（ドライバー）の選択型LP（/levjob-select）も同じ専用Pixel 1186966720393058 だけ
          if(p==='/levjob-select'||p.indexOf('/levjob-select/')===0)seeker=true;
          if(p==='/levjob-popup'||p.indexOf('/levjob-popup/')===0)seeker=true;
          // レバウェル看護の1画面LP（/levwell-popup）は専用Pixel 533491373010800 だけ
          if(p==='/levwell-popup'||p.indexOf('/levwell-popup/')===0)seeker=true;
          // www.tenshoku-gpt.com（看護師転職 比較ナビ）は全ページ Pixel 1263924312012938 だけ（各ページの SingleMetaPixel で読み込む）
          if(h==='www.tenshoku-gpt.com'||h==='tenshoku-gpt.com')seeker=true;
          if(!seeker){
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;
          n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window,document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init','818193851340214');
          fbq('track','PageView');
          }
        `}</Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=818193851340214&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

        {children}
      </body>
    </html>
  );
}
