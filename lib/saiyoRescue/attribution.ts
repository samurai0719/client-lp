/**
 * 採用レスキューLPの流入元（UTM・ランディングページ・参照元・端末）をブラウザに保持する。
 *
 * ・LPに着地した時点で captureAttribution() を呼ぶ
 * ・新しいUTM付きで来たら上書き（＝最後に広告をクリックした流入を記録）。UTMなしの再訪では上書きしない
 * ・保持期間は30日。フォーム送信時に loadAttribution() の値をAPIへ送る
 */

const KEY = "saiyo_rescue_attr";
const TTL_MS = 30 * 24 * 60 * 60 * 1000;
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  landing_page?: string;
  referrer?: string;
  deviceType?: "pc" | "smartphone" | "tablet";
  _exp?: number;
};

export function detectDevice(): "pc" | "smartphone" | "tablet" {
  const ua = navigator.userAgent;
  const iPadOS = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;
  if (/iPad|Tablet/i.test(ua) || iPadOS || (/Android/i.test(ua) && !/Mobile/i.test(ua))) return "tablet";
  if (/iPhone|iPod|Android.*Mobile|Mobile/i.test(ua)) return "smartphone";
  return "pc";
}

function read(): Attribution | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const a = JSON.parse(raw) as Attribution;
    if (a._exp && Date.now() > a._exp) return null;
    return a;
  } catch {
    return null;
  }
}

export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const hasUtm = UTM_KEYS.some((k) => params.get(k)) || params.has("fbclid") || params.has("gclid");
  const existing = read();
  if (existing && !hasUtm) return;

  const ref = document.referrer && !document.referrer.startsWith(window.location.origin) ? document.referrer : undefined;
  const data: Attribution = {
    landing_page: (window.location.pathname + window.location.search).slice(0, 500),
    referrer: ref?.slice(0, 500),
    deviceType: detectDevice(),
    _exp: Date.now() + TTL_MS,
  };
  for (const k of UTM_KEYS) {
    const v = params.get(k);
    if (v) data[k] = v.slice(0, 100);
  }
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // 保存できない環境（プライベートモード等）では送信時に現在のページ情報を使う
  }
}

/** フォーム送信用。保存が無ければ現在のページから組み立てる */
export function loadAttribution(): Omit<Attribution, "_exp"> {
  const saved = read();
  if (saved) {
    const { _exp, ...rest } = saved;
    void _exp;
    return { ...rest, deviceType: detectDevice() };
  }
  const params = new URLSearchParams(window.location.search);
  const out: Attribution = {
    landing_page: window.location.pathname + window.location.search,
    referrer: document.referrer || undefined,
    deviceType: detectDevice(),
  };
  for (const k of UTM_KEYS) {
    const v = params.get(k);
    if (v) out[k] = v;
  }
  return out;
}
