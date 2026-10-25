import type { ReactNode } from "react";
import { Noto_Sans_JP, Shippori_Mincho_B1 } from "next/font/google";
import "@/app/driver/company/doratech-company.css";
import "@/app/driver/scout/scout.css";
import "@/app/driver/scout/scout-lp.css";

import PageViewTracker from "@/components/driver-company/PageViewTracker";
import type { CompanyEvent } from "@/components/driver-company/track";
import { Footer } from "./Sections";
import Motion from "./Motion";
import { Header, StickyCta } from "./ui";
import { WaitingCountProvider } from "./waiting";

/**
 * ドライバー採用サービスの各ページ（LP・匿名プロフィール一覧・無料登録）の共通の外枠。
 * フォント・スタイル・ヘッダー・フッターと、「○人のドライバーが待機中」の人数をまとめて渡す。
 */
const gothic = Noto_Sans_JP({
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--dt-font",
  fallback: ["Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", "sans-serif"],
});

/** LPの大きな見出し用の明朝（FVの見出しと同じ系統） */
const mincho = Shippori_Mincho_B1({
  weight: ["600", "800"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--lp-mincho-font",
  fallback: ["Hiragino Mincho ProN", "Yu Mincho", "YuMincho", "serif"],
});

/**
 * LPの演出を有効にする印（<html> の ds-motion）。本文より先に同期で実行し、表示前に付ける。
 * 「動きを減らす」設定では付けないので、最初からすべて表示される。
 */
const MOTION_SCRIPT =
  "try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('ds-motion')}catch(e){}";

export default function ScoutShell({
  waiting,
  event,
  home = false,
  sticky = false,
  headerCta = true,
  lp = false,
  children,
}: {
  waiting: number | null;
  /** ページ表示時に送る計測イベント名 */
  event: CompanyEvent;
  /** LP（ロゴを押すとページ先頭へ）かどうか。サブページではロゴでLPへ戻る */
  home?: boolean;
  /** スマホ下部の固定CTAを出すか（LPだけ） */
  sticky?: boolean;
  /** ヘッダーのCTAを出すか（行き先の一覧ページ自身では出さない） */
  headerCta?: boolean;
  /** LP（新デザイン・演出あり）かどうか */
  lp?: boolean;
  children: ReactNode;
}) {
  return (
    <WaitingCountProvider count={waiting}>
      {lp && <script dangerouslySetInnerHTML={{ __html: MOTION_SCRIPT }} />}
      <div className={`dt-lp ds-lp${lp ? " lp" : ""} ${gothic.variable} ${mincho.variable}`}>
        <PageViewTracker event={event} />
        <Header home={home} cta={headerCta} />
        <main>{children}</main>
        <Footer />
        {sticky && <StickyCta />}
        {lp && <Motion />}
      </div>
    </WaitingCountProvider>
  );
}
