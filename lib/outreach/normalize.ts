import { PREFECTURE_NAMES } from "./constants";

/**
 * 営業先企業の重複判定・表示のための正規化。
 */

const CORP_TYPES = [
  "株式会社", "有限会社", "合同会社", "合資会社", "合名会社",
  "(株)", "（株）", "㈱", "(有)", "（有）", "㈲", "(同)", "（同）",
];

/** 全角英数・記号を半角へ */
export function toHalfWidth(s: string): string {
  return s
    .replace(/[！-～]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .replace(/　/g, " ");
}

/** 会社名の重複判定キー（法人格・空白・記号を除き、小文字化） */
export function nameKey(name: string | null | undefined): string {
  if (!name) return "";
  let s = toHalfWidth(name);
  for (const t of CORP_TYPES) s = s.split(toHalfWidth(t)).join("");
  return s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
}

/** 法人格が付いているか */
export function hasCorpType(name: string): boolean {
  const s = toHalfWidth(name);
  return CORP_TYPES.some((t) => s.includes(toHalfWidth(t)));
}

/** 電話番号の重複判定キー（数字のみ。短すぎるものは使わない） */
export function phoneKey(phone: string | null | undefined): string | null {
  if (!phone) return null;
  let d = toHalfWidth(phone).replace(/\D/g, "");
  if (d.startsWith("81") && d.length >= 11) d = "0" + d.slice(2);
  return d.length >= 10 && d.length <= 11 ? d : null;
}

/**
 * 無料ホームページサービス・SNS等、複数の会社が同じドメインを使うホスト。
 * これらはドメインによる重複判定に使わない。
 */
const SHARED_HOST_SUFFIXES = [
  "jimdo.com", "jimdofree.com", "jimdosite.com", "wixsite.com", "wix.com", "ameblo.jp", "fc2.com",
  "goope.jp", "crayonsite.net", "crayonsite.com", "localinfo.jp", "jp-hp.com", "hp.peraichi.com", "peraichi.com",
  "blogspot.com", "wordpress.com", "hatenablog.com", "facebook.com", "instagram.com", "twitter.com", "x.com",
  "line.me", "google.com", "sites.google.com", "business.site", "mapion.co.jp", "itp.ne.jp", "ekiten.jp",
  "indeed.com", "townwork.net", "en-japan.com", "doraever.jp", "driver-times.com", "mynavi.jp", "rikunabi.com",
  "studio.site", "strikingly.com", "weebly.com", "webnode.jp", "shopinfo.jp", "on.omisenomikata.jp",
  "ocn.ne.jp", "biglobe.ne.jp", "so-net.ne.jp", "nifty.com", "plala.or.jp", "dion.ne.jp", "infoseek.jp",
];

export function isSharedHost(host: string): boolean {
  const h = host.toLowerCase();
  return SHARED_HOST_SUFFIXES.some((s) => h === s || h.endsWith("." + s));
}

/** URL を http(s) の正規形にする。不正なら null */
export function normalizeUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let s = toHalfWidth(raw.trim());
  if (!s) return null;
  if (!/^https?:\/\//i.test(s)) s = "http://" + s;
  try {
    const u = new URL(s);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    if (!u.hostname.includes(".")) return null;
    u.hash = "";
    return u.toString();
  } catch {
    return null;
  }
}

/** ホスト名（www. を除く） */
export function hostOf(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
}

/** 重複判定に使うドメイン（共有ホストなら null） */
export function domainKey(url: string | null | undefined): string | null {
  const h = hostOf(url);
  if (!h || isSharedHost(h)) return null;
  return h;
}

export function normalizeEmail(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const s = toHalfWidth(raw.trim()).replace(/^mailto:/i, "").split("?")[0].trim().toLowerCase();
  return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(s) ? s : null;
}

/** 住所文字列から都道府県・市区町村を取り出す */
export function splitAddress(address: string | null | undefined): { prefecture: string | null; city: string | null } {
  if (!address) return { prefecture: null, city: null };
  const s = address.replace(/^〒?\s*\d{3}-?\d{4}\s*/, "").replace(/^日本[、,\s]*/, "").trim();
  const pref = PREFECTURE_NAMES.find((p) => s.startsWith(p)) ?? null;
  if (!pref) return { prefecture: null, city: null };
  const rest = s.slice(pref.length);
  // 「○○郡○○町」「○○市○○区」「○○市」「○○区」「○○町」「○○村」
  const m =
    rest.match(/^(.+?郡.+?[町村])/) ??
    rest.match(/^(.+?市.+?区)/) ??
    rest.match(/^(.+?[市区町村])/);
  return { prefecture: pref, city: m ? m[1] : null };
}

/** LIKE 検索用のエスケープ */
export function escapeLike(s: string): string {
  return s.replace(/[\\%_]/g, (c) => "\\" + c);
}

/** PostgREST の or() フィルタに入れる値をダブルクォートで囲む */
export function pgQuote(s: string): string {
  return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

/**
 * 文章から電話番号を探す（固定電話・携帯・フリーダイヤル）。
 * 「FAX」の直後にある番号は除く。見つかった順に、表示用の形と重複判定キーを返す。
 */
export function extractPhones(text: string): { display: string; key: string }[] {
  const t = toHalfWidth(text).replace(/[‐－―−ー]/g, "-").replace(/[（]/g, "(").replace(/[）]/g, ")");
  const out: { display: string; key: string }[] = [];
  const re = /(?<![\d-])(0\d{1,4})[-()\s]{0,2}(\d{1,4})[-()\s]{0,2}(\d{3,4})(?![\d-])/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(t))) {
    const before = t.slice(Math.max(0, m.index - 8), m.index);
    if (/fax|ファックス|ファクス/i.test(before)) continue;
    const key = phoneKey(m[0]);
    if (!key || out.some((o) => o.key === key) || isDummyPhone(key)) continue;
    // 区切りが書かれていない番号は、市外局番の桁数が分からないので数字のまま表示する
    const display = /[-()\s]/.test(m[0]) ? `${m[1]}-${m[2]}-${m[3]}` : key;
    out.push({ display, key });
  }
  return out;
}

/** フォームの入力例などに使われる架空の番号（0123456789・000-0000-0000・03-1234-5678 など） */
export function isDummyPhone(key: string): boolean {
  return (
    /^0?123456789/.test(key) || // 0123456789
    /^0(\d)\1+$/.test(key) || /^0+$/.test(key) || // 0000000000・0111111111
    /^0\d{0,4}0{4,}$/.test(key) || // 03-0000-0000
    /12345678$/.test(key) // 03-1234-5678・090-1234-5678
  );
}
