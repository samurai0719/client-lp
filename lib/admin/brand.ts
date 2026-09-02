/*
  管理画面は高長建設のCRMと adofy の相談管理を兼ねているため、
  アクセス元のドメインで表示名を切り替える。
  判定はサーバー側で行うので、このファイルは "use client" を付けない
  （クライアント専用ファイル内の関数はサーバーから呼べないため）。
*/

export type AdminBrand = {
  /** サイドバー上段・ヘッダーに出す事業者名 */
  name: string;
  /** ロゴ代わりの短い文字 */
  initials: string;
  /** 画面の役割 */
  subtitle: string;
};

export const TAKANAGA_BRAND: AdminBrand = {
  name: "高長建設",
  initials: "TN",
  subtitle: "顧客管理",
};

export const ADOFY_BRAND: AdminBrand = {
  name: "adofy",
  initials: "ad",
  subtitle: "管理画面",
};

/** ドメインから表示ブランドを決める */
export function brandForHost(host: string | null): AdminBrand {
  if ((host ?? "").toLowerCase().includes("adofy")) return ADOFY_BRAND;
  return TAKANAGA_BRAND;
}
