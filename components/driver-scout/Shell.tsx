import type { ReactNode } from "react";
import { Noto_Sans_JP } from "next/font/google";
import "@/app/driver/company/doratech-company.css";
import "@/app/driver/scout/scout.css";

import PageViewTracker from "@/components/driver-company/PageViewTracker";
import type { CompanyEvent } from "@/components/driver-company/track";
import { Footer } from "./Sections";
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

export default function ScoutShell({
  waiting,
  event,
  home = false,
  sticky = false,
  headerCta = true,
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
  children: ReactNode;
}) {
  return (
    <WaitingCountProvider count={waiting}>
      <div className={`dt-lp ds-lp${home ? " ds-home" : ""} ${gothic.variable}`}>
        <PageViewTracker event={event} />
        <Header home={home} cta={headerCta} />
        <main>{children}</main>
        <Footer />
        {sticky && <StickyCta />}
      </div>
    </WaitingCountProvider>
  );
}
