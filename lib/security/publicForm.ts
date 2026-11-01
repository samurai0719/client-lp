// 公開フォームの入力全体に上限をかける共通チェック。
// 項目ごとの必須チェックは各APIに残し、ここでは異常に大きい入力だけを弾く。

const MAX_STRING_LENGTH = 5000;
const MAX_ARRAY_LENGTH = 100;
const MAX_DEPTH = 6;

export function isReasonablePayload(value: unknown, depth = 0): boolean {
  if (depth > MAX_DEPTH) return false;
  if (typeof value === "string") return value.length <= MAX_STRING_LENGTH;
  if (Array.isArray(value)) {
    return value.length <= MAX_ARRAY_LENGTH && value.every((v) => isReasonablePayload(v, depth + 1));
  }
  if (value && typeof value === "object") {
    const values = Object.values(value);
    return values.length <= MAX_ARRAY_LENGTH && values.every((v) => isReasonablePayload(v, depth + 1));
  }
  return true;
}

export function isValidEmail(email: string): boolean {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
