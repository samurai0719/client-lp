"use client";

import { useEffect } from "react";
import { captureUtm } from "@/lib/utm/storage";
import { trackCompany, type CompanyEvent } from "./track";

/**
 * 企業向けページの表示計測。
 * ページ表示ごとに指定のイベントを1回だけ送り、あわせて流入情報を保存する
 * （保存した UTM は求人登録の送信時に一緒に送られる）。
 */
export default function PageViewTracker({ event }: { event: CompanyEvent }) {
  useEffect(() => {
    captureUtm();
    trackCompany(event);
  }, [event]);

  return null;
}
