// 匿名プロフィールをいきなり見せる1ページLP（scout.adofy-site.com/drivers、物理ルート /driver/scout-direct）専用のMeta Pixel。
// このLPではこのPixelだけを動かす（企業向けの他ページの 1419823599748987 は読み込まない）。

export const DORATECH_DIRECT_PIXEL_ID = "3711341419004077";

/** 今のページが /drivers のLPか（公開URLでも物理ルートでも判定する） */
export function isDoratechDirectPage(pathname: string): boolean {
  return pathname === "/drivers" || pathname.startsWith("/drivers/") || pathname.startsWith("/driver/scout-direct");
}
