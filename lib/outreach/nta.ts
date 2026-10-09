import { createInflateRaw } from "node:zlib";
import { Readable } from "node:stream";
import { createInterface } from "node:readline";

/**
 * 国税庁「法人番号公表サイト」の全件データ（都道府県別・CSV Unicode）から運送会社を抜き出す。
 * https://www.houjin-bangou.nta.go.jp/download/zenken/
 *
 * ・登記されている全法人が対象（gBizINFO の検索は活動情報のある法人だけなので、こちらの方が網羅的）
 * ・無料・登録不要。毎月末に更新され、ダウンロード用の番号も毎月変わるため、毎回ページから読み取る
 * ・ダウンロードはページのフォームと同じく、トークン付きの POST で行う
 * ・HPのURLは含まれないため、HPは別途（gBizINFO の法人詳細など）で補う
 */

const BASE = "https://www.houjin-bangou.nta.go.jp";
const PAGE = `${BASE}/download/zenken/index.html`;
const UA = "Mozilla/5.0 (compatible; DoratechSalesBot/1.0; +https://doratech.adofy-site.com/)";
const TOKEN_FIELD = "jp.go.nta.houjin_bangou.framework.web.common.CNSFWTokenProcessor.request.token";

/** 社名にこれらを含む会社を運送会社とみなす */
export const NTA_NAME_PATTERN = /運送|運輸|物流|急便|陸運|通運|輸送|ロジスティクス|トランスポート|配送|貨物|トラック/;

/** 法人種別：株式会社・有限会社・合名会社・合資会社・合同会社 */
const COMPANY_KINDS = new Set(["301", "302", "303", "304", "305"]);

export type NtaCompany = { n: string; name: string; pref: string; city: string; street: string };

type Session = { token: string; cookie: string; files: Map<string, string[]> };

/** ダウンロードページを開き、トークン・Cookie・「都道府県 → ファイル番号」の対応を読み取る */
async function openSession(): Promise<Session> {
  const res = await fetch(PAGE, { headers: { "User-Agent": UA, "Accept-Language": "ja" }, signal: AbortSignal.timeout(30_000) });
  if (!res.ok) throw new Error(`法人番号公表サイト HTTP ${res.status}`);
  const html = await res.text();
  const token = html.match(/request\.token" value="([^"]+)"/)?.[1];
  if (!token) throw new Error("法人番号公表サイトのページ形式が変わっています（トークンが見つかりません）");
  const cookie = (res.headers.getSetCookie?.() ?? [])
    .map((c) => c.split(";")[0])
    .join("; ");

  // 「CSV形式・Unicode」の表だけを対象にする（Shift_JIS / XML の表もある）
  const sections = [...html.matchAll(/CSV形式・Shift_JIS|CSV形式・Unicode|XML形式・Unicode/g)].map((m) => ({ at: m.index!, kind: m[0] }));
  const files = new Map<string, string[]>();
  const tokens: { at: number; pref?: string; id?: string }[] = [];
  for (const m of html.matchAll(/>\s*([^<>\s]{2,4}[都道府県])\s*</g)) tokens.push({ at: m.index!, pref: m[1] });
  for (const m of html.matchAll(/doDownload\((\d+)\)/g)) tokens.push({ at: m.index!, id: m[1] });
  tokens.sort((a, b) => a.at - b.at);
  let current: string | null = null;
  for (const t of tokens) {
    if (t.pref) {
      current = t.pref;
      continue;
    }
    const section = sections.filter((s) => s.at < t.at).at(-1)?.kind;
    if (section !== "CSV形式・Unicode" || !current) continue;
    files.set(current, [...(files.get(current) ?? []), t.id!]);
  }
  if (files.size < 40) throw new Error("法人番号公表サイトのページ形式が変わっています（ファイル一覧を読み取れません）");
  return { token, cookie, files };
}

/** zip の先頭のファイル（CSV）を取り出し、1行ずつ返す */
async function* zipFirstEntryLines(buf: Buffer): AsyncGenerator<string> {
  if (buf.readUInt32LE(0) !== 0x04034b50) throw new Error("zip 形式ではありません");
  const method = buf.readUInt16LE(8);
  const nameLen = buf.readUInt16LE(26);
  const extraLen = buf.readUInt16LE(28);
  const start = 30 + nameLen + extraLen;
  if (method !== 8) throw new Error(`未対応の圧縮形式です（${method}）`);
  const inflate = createInflateRaw();
  Readable.from([buf.subarray(start)]).pipe(inflate);
  const rl = createInterface({ input: inflate, crlfDelay: Infinity });
  for await (const line of rl) yield line;
}

/** CSV 1行を分解する（全件データは項目内に改行を含まない） */
function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else quoted = false;
      } else cur += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out;
}

/**
 * 指定した都道府県の全件データをダウンロードし、運送会社だけを返す。
 * 東京都などファイルが分割されている県は、すべてのファイルを順に読む。
 */
export async function fetchNtaTransportCompanies(prefecture: string): Promise<NtaCompany[]> {
  const s = await openSession();
  const ids = s.files.get(prefecture);
  if (!ids?.length) throw new Error(`${prefecture} のファイルが見つかりません`);

  const out: NtaCompany[] = [];
  for (const id of ids) {
    const body = new URLSearchParams({ [TOKEN_FIELD]: s.token, event: "download", selDlFileNo: id });
    const res = await fetch(PAGE, {
      method: "POST",
      headers: {
        "User-Agent": UA,
        "Content-Type": "application/x-www-form-urlencoded",
        Referer: `${BASE}/download/zenken/`,
        ...(s.cookie ? { Cookie: s.cookie } : {}),
      },
      body,
      signal: AbortSignal.timeout(180_000),
    });
    if (!res.ok) throw new Error(`法人番号公表サイト ダウンロード HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());

    for await (const line of zipFirstEntryLines(buf)) {
      // 社名で先に絞ってから分解する（全行を分解すると遅い）
      if (!NTA_NAME_PATTERN.test(line)) continue;
      const c = splitCsvLine(line);
      // 6:商号又は名称 8:法人種別 9:都道府県 10:市区町村 11:丁目番地 18:登記記録の閉鎖等年月日 23:最新履歴 29:検索対象除外
      if (!COMPANY_KINDS.has(c[8]) || c[18] !== "" || c[23] !== "1" || c[29] !== "0") continue;
      if (!NTA_NAME_PATTERN.test(c[6])) continue;
      out.push({ n: c[1], name: c[6], pref: c[9], city: c[10], street: c[11] });
    }
  }
  return out;
}
