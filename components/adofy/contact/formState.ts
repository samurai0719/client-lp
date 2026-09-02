"use client";

import { EMPTY_FORM, type FormData } from "./formConfig";
import { trackEvent } from "@/lib/analytics/track";

/* ═══════════════════════════════════════════════════════════════════════════
   入力内容の保持（sessionStorage）と、流入計測。
   個人情報を扱うため localStorage ではなく sessionStorage を使い、
   タブを閉じれば消えるようにする。送信完了時にも明示的に破棄する。
   ═══════════════════════════════════════════════════════════════════════════ */

const FORM_KEY = "adofy_consultation_form";
const STEP_KEY = "adofy_consultation_step";
const ATTR_KEY = "adofy_consultation_attribution";
const DONE_KEY = "adofy_consultation_done";

export type Attribution = {
  utm: Record<string, string>;
  referrer: string;
  landingPage: string;
};

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

/* ── 入力内容 ───────────────────────────────────────────────────────────── */

export function loadForm(): FormData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(FORM_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<FormData>;
    // 保存済みデータが古い形式でも壊れないように、既定値と合成する
    return { ...EMPTY_FORM, ...parsed };
  } catch {
    return null;
  }
}

export function saveForm(data: FormData): void {
  try {
    sessionStorage.setItem(FORM_KEY, JSON.stringify(data));
  } catch {
    // 保存できなくても入力は継続できる
  }
}

export function loadStep(): number {
  try {
    const raw = sessionStorage.getItem(STEP_KEY);
    const n = raw ? Number.parseInt(raw, 10) : 0;
    return Number.isFinite(n) && n >= 0 ? n : 0;
  } catch {
    return 0;
  }
}

export function saveStep(step: number): void {
  try {
    sessionStorage.setItem(STEP_KEY, String(step));
  } catch {
    /* noop */
  }
}

export function clearForm(): void {
  try {
    sessionStorage.removeItem(FORM_KEY);
    sessionStorage.removeItem(STEP_KEY);
  } catch {
    /* noop */
  }
}

/* ── 送信完了フラグ（完了ページの直接アクセス判定に使う） ───────────────── */

export function markSubmitted(): void {
  try {
    sessionStorage.setItem(DONE_KEY, "1");
  } catch {
    /* noop */
  }
}

export function wasSubmitted(): boolean {
  try {
    return sessionStorage.getItem(DONE_KEY) === "1";
  } catch {
    return false;
  }
}

export function clearSubmitted(): void {
  try {
    sessionStorage.removeItem(DONE_KEY);
  } catch {
    /* noop */
  }
}

/* ── 流入計測 ───────────────────────────────────────────────────────────── */

/**
 * UTM・referrer を取得して保持する。
 * 一度取得したら、フォーム内でページ遷移しても失われないよう sessionStorage に残す。
 * 新しい UTM 付きで来訪した場合のみ上書きする。
 */
export function captureAttribution(): Attribution {
  const fallback: Attribution = { utm: {}, referrer: "", landingPage: "" };
  if (typeof window === "undefined") return fallback;

  let stored: Attribution | null = null;
  try {
    const raw = sessionStorage.getItem(ATTR_KEY);
    if (raw) stored = JSON.parse(raw) as Attribution;
  } catch {
    stored = null;
  }

  const params = new URLSearchParams(window.location.search);
  const incoming: Record<string, string> = {};
  for (const k of UTM_KEYS) {
    const v = params.get(k);
    if (v) incoming[k] = v.slice(0, 200);
  }

  // 新しいUTMが無ければ、保存済みの情報をそのまま使う
  if (Object.keys(incoming).length === 0 && stored) return stored;

  const next: Attribution = {
    utm: Object.keys(incoming).length > 0 ? incoming : (stored?.utm ?? {}),
    referrer: stored?.referrer || document.referrer || "",
    landingPage: stored?.landingPage || window.location.pathname + window.location.search,
  };

  try {
    sessionStorage.setItem(ATTR_KEY, JSON.stringify(next));
  } catch {
    /* noop */
  }
  return next;
}

export function clearAttribution(): void {
  try {
    sessionStorage.removeItem(ATTR_KEY);
  } catch {
    /* noop */
  }
}

/* ── イベント計測 ───────────────────────────────────────────────────────── */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/** 同じイベントを二重に送らないための記録（ページ表示単位） */
const fired = new Set<string>();

/**
 * GA4 / GTM（既存の trackEvent 経由）と Meta Pixel の両方へ送る。
 * どちらも未導入なら何もしない。既存の計測設定には手を加えない。
 */
export function track(
  event: string,
  params: Record<string, unknown> = {},
  options: { once?: boolean; dedupeKey?: string } = {}
): void {
  if (typeof window === "undefined") return;

  const key = options.dedupeKey ?? event;
  if (options.once !== false) {
    if (fired.has(key)) return;
    fired.add(key);
  }

  trackEvent(event, params);

  try {
    if (typeof window.fbq === "function") {
      // 既存のPixel設定を壊さないよう、標準イベントではなくカスタムイベントで送る
      window.fbq("trackCustom", event, params);
    }
  } catch {
    /* 計測失敗はユーザー操作を妨げない */
  }
}

/** ステップ完了は毎回送るが、同じステップの重複は防ぐ */
export function trackStep(step: number, title: string): void {
  track(
    "consultation_step_complete",
    { step: step + 1, step_name: title },
    { dedupeKey: `step_${step}` }
  );
}
