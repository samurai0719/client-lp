const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid", "ttclid"] as const;
const STORAGE_KEY = "takanaga_utm";
const EXPIRY_DAYS = 30;

export interface UtmData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  gclid?: string;
  ttclid?: string;
  landing_page?: string;
  referrer?: string;
  device_type?: string;
  _expires?: number;
}

export function captureUtm(): void {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const hasNew = UTM_KEYS.some((k) => params.has(k));

  const existing = loadUtm();
  const data: UtmData = hasNew ? {} : (existing ?? {});

  UTM_KEYS.forEach((k) => {
    const v = params.get(k);
    if (v) (data as Record<string, string>)[k] = v;
  });

  if (hasNew || !existing) {
    data.landing_page = window.location.pathname + window.location.search;
    data.referrer = document.referrer || undefined;
    data.device_type = /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop";
  }

  data._expires = Date.now() + EXPIRY_DAYS * 86400000;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function loadUtm(): UtmData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data: UtmData = JSON.parse(raw);
    if (data._expires && Date.now() > data._expires) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}
