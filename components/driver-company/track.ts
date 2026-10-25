"use client";

import { trackEvent } from "@/lib/analytics/track";

/**
 * ドラテク 企業向けLP（/company）の計測。
 *
 * ・GA4 / GTM: lib/analytics/track.ts を通す（未導入の環境では何もしない）
 * ・Meta Pixel: app/driver/layout.tsx が初期化している ドラテク用 Pixel にだけ送る。
 *   fbq('trackCustom') だと初期化済みの全Pixel（ルートレイアウトの別Pixelを含む）へ
 *   一斉送信されてしまうため、Pixel IDを指定する trackSingleCustom を使う。
 * ・PageView は既存のレイアウトが発火済み。ここでは重ねて送らない。
 *
 * パラメータには個人情報を一切入れないこと（会社名・担当者名・電話・メール等）。
 */

/** app/driver/layout.tsx で init しているドラテクの Pixel ID */
const DORATECH_PIXEL_ID = "1419823599748987";

export type CompanyEvent =
  | "company_lp_view"
  | "company_cta_click"
  /** 候補者の匿名プロフィール一覧（ドライバー採用サービス）の表示 */
  | "company_profiles_view"
  /** 匿名プロフィールで「連絡先の開示を依頼する」を押した */
  | "company_disclose_click"
  /** 求人登録フォームの表示 */
  | "company_register_view"
  /** 最初の項目に入力した時点で1回 */
  | "company_form_start"
  /** STEPを進めるたび（step番号をパラメータで送る） */
  | "company_form_step"
  /** 登録が成功した時点で1回 */
  | "company_form_submit";

type FbqFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    fbq?: FbqFn;
  }
}

export function trackCompany(
  event: CompanyEvent,
  params: Record<string, string | number> = {}
): void {
  if (typeof window === "undefined") return;

  trackEvent(event, params);

  try {
    if (typeof window.fbq === "function") {
      window.fbq("trackSingleCustom", DORATECH_PIXEL_ID, event, params);
    }
  } catch {
    // 計測失敗は握りつぶし、ユーザー操作を妨げない
  }
}
