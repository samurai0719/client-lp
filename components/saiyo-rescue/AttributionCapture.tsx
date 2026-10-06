"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/saiyoRescue/attribution";

/** LP表示時に流入元（UTM等）を保存する。描画は何もしない */
export default function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
