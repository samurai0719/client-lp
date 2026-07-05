// CRM修正の検証スクリプト（純関数部分）
// 実行: npx tsx scripts/verify-crm-fix.ts

import { formatPhone, normalizePhone } from "../lib/utils/format";
import { nameMismatchNote } from "../lib/crm/customers";

let failed = 0;
function check(name: string, cond: boolean, detail = "") {
  if (!cond) failed++;
  console.log(`[${cond ? "PASS" : "FAIL"}] ${name}${detail ? ` — ${detail}` : ""}`);
}

// ── normalizePhone ──
check("半角ハイフン付き", normalizePhone("090-1234-5678") === "09012345678");
check("スペース・括弧", normalizePhone("058 (237) 5050") === "0582375050");
check("全角数字（旧実装では空文字になっていた）", normalizePhone("０９０１２３４５６７８") === "09012345678");
check("全角ハイフン混在", normalizePhone("０９０-１２３４-５６７８") === "09012345678");
check("同じ番号の全角/半角が同一値に正規化される", normalizePhone("０９０-1234-5678") === normalizePhone("090-1234-5678"));
check("空文字", normalizePhone("") === "");
check("記号のみ", normalizePhone("---") === "");

// ── formatPhone（表示用整形） ──
check("携帯11桁", formatPhone("09000000000") === "090-0000-0000");
check("既にハイフン付きでも同じ結果", formatPhone("090-0000-0000") === "090-0000-0000");
check("全角入力も整形", formatPhone("０９０１２３４５６７８") === "090-1234-5678");
check("固定電話10桁（3-3-4）", formatPhone("0582375050") === "058-237-5050");
check("フリーダイヤル", formatPhone("0120123456") === "0120-123-456");
check("桁数不明はそのまま", formatPhone("123") === "123");
check("空はダッシュ", formatPhone("") === "—" && formatPhone(null) === "—");

// ── nameMismatchNote ──
check("同名なら注記なし", nameMismatchNote("山田 太郎", "山田 太郎") === null);
check("前後空白は無視", nameMismatchNote(" 山田 太郎 ", "山田 太郎") === null);
check(
  "別名なら更新注記を生成",
  nameMismatchNote("山田 花子", "山田 太郎") ===
    "【お名前を更新】山田 花子（以前の登録名：山田 太郎）"
);
check("入力名が空なら注記なし", nameMismatchNote("  ", "山田 太郎") === null);
check("既存名が無ければ注記なし", nameMismatchNote("山田 太郎", null) === null);

console.log("");
if (failed > 0) {
  console.error(`${failed} 件のテストが失敗しました`);
  process.exit(1);
}
console.log("すべてのテストに合格しました");
