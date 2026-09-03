import type { Metadata } from "next";

// adofy専用の管理画面。高長建設(/admin)とは完全に別系統。
// 権限チェックは (app)/layout.tsx で行う。
// ログイン画面はこのガードの外に置く必要があるため階層を分けている。
export const metadata: Metadata = {
  title: "adofy 管理画面",
  description: "adofyの無料相談・顧客管理",
  robots: { index: false, follow: false },
};

export default function AdofyAdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
