export function formatJst(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function pct(n: number, d: number): string {
  if (!d) return "—";
  return `${(Math.round((n / d) * 1000) / 10).toFixed(1)}%`;
}
