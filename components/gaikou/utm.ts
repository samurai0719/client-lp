// CTAから診断LPへ遷移する際に引き継ぐ広告計測パラメータ一覧
export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "ttclid",
  "gclid",
] as const;

export function getUtmQueryString(): string {
  if (typeof window === "undefined") return "";
  const params = new URLSearchParams(window.location.search);
  const kept = new URLSearchParams();
  UTM_KEYS.forEach((key) => {
    const value = params.get(key);
    if (value) kept.set(key, value);
  });
  const query = kept.toString();
  return query ? `?${query}` : "";
}

export function getUtmRecord(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const record: Record<string, string> = {};
  UTM_KEYS.forEach((key) => {
    const value = params.get(key);
    if (value) record[key] = value;
  });
  return record;
}

export function buildDiagnosisHref(): string {
  return `/gaikou/diagnosis${getUtmQueryString()}`;
}
