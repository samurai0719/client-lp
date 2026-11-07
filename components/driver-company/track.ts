"use client";

import { trackEvent } from "@/lib/analytics/track";
import { DORATECH_DIRECT_PIXEL_ID, isDoratechDirectPage } from "@/lib/analytics/doratechDirectPixel";

/**
 * ドラテク 企業向けLP（/company）の計測。
 *
 * ・GA4 / GTM: lib/analytics/track.ts を通す（未導入の環境では何もしない）
 * ・Meta Pixel: app/driver/company/layout.tsx 等が初期化している ドラテク用 Pixel にだけ送る。
 *   fbq('trackCustom') だと初期化済みの全Pixel（ルートレイアウトの別Pixelを含む）へ
 *   一斉送信されてしまうため、Pixel IDを指定する trackSingleCustom を使う。
 * ・PageView は既存のレイアウトが発火済み。ここでは重ねて送らない。
 *
 * パラメータには個人情報を一切入れないこと（会社名・担当者名・電話・メール等）。
 */

/** app/driver/company/layout.tsx・app/driver/scout/layout.tsx で init しているドラテク企業向けの Pixel ID */
import { DORATECH_PIXEL_ID } from "@/lib/analytics/doratechCompanyPixel";

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
    /** SingleMetaPixel が初期化を終えたPixel ID */
    __metaPixelReady?: Record<string, boolean>;
    /** 初期化前に送ろうとしたイベント（初期化後に SingleMetaPixel が送る） */
    __metaPixelPending?: Record<string, unknown[][]>;
  }
}

export function trackCompany(
  event: CompanyEvent,
  params: Record<string, string | number> = {}
): void {
  if (typeof window === "undefined") return;

  trackEvent(event, params);

  try {
    // /drivers のLPはそのページ専用のPixelにだけ送る
    const pixelId = isDoratechDirectPage(window.location.pathname) ? DORATECH_DIRECT_PIXEL_ID : DORATECH_PIXEL_ID;
    const args: unknown[] = ["trackSingleCustom", pixelId, event, params];
    if (window.__metaPixelReady?.[pixelId] && typeof window.fbq === "function") {
      window.fbq(...args);
    } else {
      // Pixelの初期化（afterInteractive）より先に呼ばれたときは溜めておき、初期化後に送る
      const pending = (window.__metaPixelPending ??= {});
      (pending[pixelId] ??= []).push(args);
    }
  } catch {
    // 計測失敗は握りつぶし、ユーザー操作を妨げない
  }
}
