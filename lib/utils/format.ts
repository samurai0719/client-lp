export function formatCurrency(amount: number | null | undefined): string {
  if (amount == null) return "—";
  return `${amount.toLocaleString("ja-JP")}円`;
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateOnly(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function normalizePhone(phone: string): string {
  return phone.replace(/[^\d]/g, "");
}

export function isPast(dateStr: string | null | undefined): boolean {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
}

export function minutesAgo(dateStr: string): number {
  return (Date.now() - new Date(dateStr).getTime()) / 60000;
}
