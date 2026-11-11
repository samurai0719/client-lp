// 次のLP専用のMeta Pixel（このPixelだけを動かす。企業向けの他ページの 1419823599748987 は読み込まない）。
//   ・プロフィールをいきなり見せる1ページLP（scout.adofy-site.com/drivers、物理ルート /driver/scout-direct）
//   ・質問形式の無料オンライン相談LP（driver.taxidriver-beginner.com/company・doratech.adofy-site.com/consult、物理ルート /driver/consult）
// このLPではこのPixelだけを動かす（企業向けの他ページの 1419823599748987 は読み込まない）。

export const DORATECH_DIRECT_PIXEL_ID = "3711341419004077";

/** 今のページがこのPixelを使うLPか（公開URLでも物理ルートでも判定する） */
export function isDoratechDirectPage(pathname: string, hostname = ""): boolean {
  if (pathname === "/drivers" || pathname.startsWith("/drivers/") || pathname.startsWith("/driver/scout-direct")) return true;
  if (pathname === "/driver/consult") return true;
  if (hostname === "driver.taxidriver-beginner.com" && pathname === "/company") return true;
  if (hostname === "doratech.adofy-site.com" && pathname === "/consult") return true;
  return false;
}
