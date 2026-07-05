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
  // 全角数字を半角へ変換してから数字以外を除去する。
  // （旧実装は全角数字ごと除去してしまい、全角入力同士が空文字で
  //   一致して別人の顧客と誤って結合される事故があった）
  return phone
    .replace(/[０-９]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 0xfee0))
    .replace(/[^\d]/g, "");
}

// 電話番号を表示用にハイフン区切りへ整形する（例: 09000000000 → 090-0000-0000）
// 保存値は従来どおり（正規化はnormalizePhone）で、表示時のみ使用する。
export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return "—";
  const digits = normalizePhone(phone);
  // 携帯・11桁（090/080/070/050等）: 3-4-4
  if (digits.length === 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }
  // フリーダイヤル: 0120-XXX-XXX
  if (digits.length === 10 && digits.startsWith("0120")) {
    return `${digits.slice(0, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  // 固定電話10桁（東海圏の市外局番3桁を想定）: 3-3-4
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  // 桁数が想定外の場合は入力値のまま表示
  return phone;
}

export function isPast(dateStr: string | null | undefined): boolean {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
}

export function minutesAgo(dateStr: string): number {
  return (Date.now() - new Date(dateStr).getTime()) / 60000;
}
