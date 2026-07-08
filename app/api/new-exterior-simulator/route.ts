import { NextRequest, NextResponse } from "next/server";
import OpenAI, { toFile } from "openai";
import type { ImageEditParams } from "openai/resources/images";

// 新築外構LP（/new-exterior）専用のシミュレーターAPI。
// リフォーム用（/api/exterior-simulator）と違い、更地・建築中の写真から
// 「新築住宅＋外構」の完成イメージをセットで生成できる。

// ─── Rate limiting ─────────────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const MAX_PER_WINDOW = 3;
const WINDOW_MS = 60 * 60 * 1000;

function getClientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_PER_WINDOW - 1 };
  }
  if (entry.count >= MAX_PER_WINDOW) return { allowed: false, remaining: 0 };
  entry.count++;
  return { allowed: true, remaining: MAX_PER_WINDOW - entry.count };
}

// ─── Validation allowlists ─────────────────────────────────────────
const ALLOWED_WORK_TYPES = new Set([
  "full-exterior", "parking-concrete", "carport", "gate-mailbox",
  "entrance", "fence", "artificial-grass", "planting",
]);

const ALLOWED_STYLES = new Set([
  "simple-modern", "japanese-modern", "western", "natural",
  "luxury-modern", "resort", "scandinavian", "auto",
]);

const ALLOWED_TIME = new Set(["daytime", "dusk"]);

// 敷地の状態：更地・建築中（建物ごと生成）／建物完成済み（外構のみ生成）
const ALLOWED_SITE_PHASES = new Set(["vacant", "built"]);

// ─── Per-work-type mandatory instructions ──────────────────────────
const WORK_TYPE_INSTRUCTIONS: Record<string, string> = {
  "full-exterior":
    "駐車場コンクリート、門柱・ポスト、玄関アプローチ、境界フェンス、植栽まで、新築住宅に合う外構一式を整備する。",
  "parking-concrete":
    "敷地内に、現実的な勾配と排水を考慮した駐車場コンクリートを施工する。乗用車が停められる十分な広さにする。",
  carport:
    "駐車スペースへ、住宅の外観と敷地寸法に合う現実的なカーポートを設置する。",
  "gate-mailbox":
    "住宅の外観と調和した門柱とポストを、玄関付近の自然な位置へ設置する。",
  entrance:
    "道路から玄関まで安全に歩ける、現実的な幅と勾配のアプローチを施工する。",
  fence:
    "敷地境界に沿って、住宅の色味と調和したフェンスを連続して設置する。道路へはみ出さず、通行を妨げない。",
  "artificial-grass":
    "庭部分へ自然な色合いの人工芝を施工し、管理しやすいお庭に仕上げる。",
  planting:
    "住宅と外構に合うシンボルツリーや低木の植栽を、管理しやすい量で配置する。",
};

// ─── Style prompts ─────────────────────────────────────────────────
const STYLE_PROMPTS: Record<string, string> = {
  "simple-modern":   "白、グレー、黒を基調にしたシンプルモダンなデザイン。直線的で整理された配置、余計な装飾を抑える。",
  "japanese-modern": "自然石、化粧砂利、木目、控えめな植栽を取り入れた和モダンなデザイン。落ち着きがあり、日本の住宅地に自然になじむ。",
  western:           "レンガ、ベージュ系の乱形石、曲線状の目地を取り入れた洋風デザイン。温かみがあり、派手すぎない。",
  natural:           "木目、植栽、人工芝、自然石を取り入れたナチュラルなデザイン。明るく柔らかく、日常的に管理しやすい。",
  "luxury-modern":   "大判タイル、上質な石材、黒やダークグレー、間接照明を取り入れた高級モダンなデザイン。重厚感がありながら現実的に施工可能。",
  resort:            "明るいタイル、開放感のある植栽、柔らかな照明を取り入れたリゾート風デザイン。日本の住宅地でも施工可能な現実的な範囲にする。",
  scandinavian:      "白、ライトグレー、明るい木目を中心にした北欧風デザイン。シンプルで柔らかく、自然な植栽を取り入れる。",
  auto:              "敷地や周辺環境に最も似合うデザインを自動で選択してください。",
};

const TIME_LABELS: Record<string, string> = {
  daytime: "昼間（自然光）",
  dusk:    "夕暮れ・ライトアップ（照明あり）",
};

// ─── Prompt builder ────────────────────────────────────────────────
function buildPrompt(
  sitePhase: string,
  workTypes: string[],
  style: string,
  timeLabel: string,
): string {
  const effectiveTypes = workTypes.length > 0 ? workTypes : ["full-exterior"];
  const items = effectiveTypes
    .map((t, i) => `必須工事${i + 1}：\n${WORK_TYPE_INSTRUCTIONS[t] ?? "外構を整備する。"}`)
    .join("\n\n");

  const workSection =
    `以下の外構工事を、1枚の完成イメージの中へ必ずすべて反映してください。\n\n` +
    `${items}\n\n` +
    `これらは候補ではなく必須条件です。1つも省略しないでください。\n` +
    `一部だけを施工した画像にしないでください。`;

  const styleSection = STYLE_PROMPTS[style]
    ? `希望するデザインテイスト：${STYLE_PROMPTS[style]}\n\n`
    : "";

  if (sitePhase === "vacant") {
    // 更地・建築中：新築住宅と外構をセットで生成する
    return `アップロードされた写真を基準画像として使用してください。

これは日本の分譲地・宅地の写真です。この土地に新築住宅を建て、外構工事まで完成した状態のイメージを生成してください。

まず、この敷地に収まる現実的な日本の新築戸建て住宅（2階建て程度）を建ててください。
住宅の外観は、選択されたデザインテイストと調和させてください。

${workSection}

${styleSection}選択された時間帯：${timeLabel}

以下は絶対に変更しないでください：
- 道路・歩道
- 隣家・隣接建物
- 電柱・電線
- カメラ位置・画角・遠近感・構図
- 敷地の広さ・形状

敷地からはみ出す建物や外構を作らないでください。
現実に施工できない構造を作らないでください。

実際の日本の新築外構工事で施工可能に見える、自然で写実的な完成イメージにしてください。
元画像と同じ道路・隣家・撮影位置を維持してください。

画像内に文字、Before、After、ロゴ、透かし、説明文は入れないでください。`;
  }

  // 建物完成済み：住宅は変えず、外構のみ生成する
  return `アップロードされた写真を基準画像として使用してください。

これは日本の新築住宅の写真です。引き渡し前後で外構がまだ整っていない状態から、外構工事が完成したイメージを生成してください。

${workSection}

${styleSection}選択された時間帯：${timeLabel}

以下は絶対に変更しないでください：
- 住宅本体、屋根、外壁の色・素材・形状
- 窓の数・大きさ・位置
- 玄関ドア
- 隣家・隣接建物
- 道路・歩道
- 電柱・電線
- カメラ位置・画角・遠近感・構図
- 敷地の広さ

家のデザインを作り直さないでください。
建物を増築しないでください。
存在しない空間を追加しないでください。
現実に施工できない構造を作らないでください。

実際の日本の外構工事で施工可能に見える、自然で写実的な完成イメージにしてください。
元画像と同じ住宅・隣家・道路・撮影位置を維持してください。

画像内に文字、Before、After、ロゴ、透かし、説明文は入れないでください。`;
}

// ─── Route handler ────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const { allowed, remaining } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "生成回数の上限（1時間に3回）に達しました。しばらくしてから再度お試しください。" },
      { status: 429 }
    );
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "画像生成機能がまだ設定されていません。" },
      { status: 503 }
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "リクエストの解析に失敗しました。" }, { status: 400 });
  }

  const imageFile    = formData.get("image") as File | null;
  const workTypesRaw = formData.get("workTypes") as string | null;
  const styleRaw     = (formData.get("style") as string | null) ?? "auto";
  const timeOfDayRaw = (formData.get("timeOfDay") as string | null) ?? "daytime";
  const sitePhaseRaw = (formData.get("sitePhase") as string | null) ?? "vacant";

  if (!imageFile) {
    return NextResponse.json({ error: "画像が添付されていません。" }, { status: 400 });
  }
  const ALLOWED_MIME = ["image/png", "image/jpeg", "image/webp", "image/heic", "image/heif"];
  if (!ALLOWED_MIME.includes(imageFile.type) && !imageFile.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "対応していないファイル形式です。カメラ写真またはJPEG・PNG・WebPをご使用ください。" },
      { status: 400 }
    );
  }
  if (imageFile.size > 50 * 1024 * 1024) {
    return NextResponse.json(
      { error: "ファイルサイズが大きすぎます。50MB以下の画像をご使用ください。" },
      { status: 400 }
    );
  }

  let parsedWorkTypes: string[] = [];
  try {
    const raw = JSON.parse(workTypesRaw ?? "[]");
    parsedWorkTypes = Array.isArray(raw)
      ? raw.filter((t: unknown) => typeof t === "string" && ALLOWED_WORK_TYPES.has(t))
      : [];
  } catch { parsedWorkTypes = []; }

  const style     = ALLOWED_STYLES.has(styleRaw) ? styleRaw : "auto";
  const timeOfDay = ALLOWED_TIME.has(timeOfDayRaw) ? timeOfDayRaw : "daytime";
  const sitePhase = ALLOWED_SITE_PHASES.has(sitePhaseRaw) ? sitePhaseRaw : "vacant";

  if (process.env.NODE_ENV !== "production") {
    console.log("[new-exterior-simulator] site phase:", sitePhase);
    console.log("[new-exterior-simulator] work types:", parsedWorkTypes);
    console.log("[new-exterior-simulator] style:", style, "| time:", timeOfDay);
  }

  const prompt = buildPrompt(sitePhase, parsedWorkTypes, style, TIME_LABELS[timeOfDay]);

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    const imagePng    = await toFile(imageBuffer, "image.png", { type: "image/png" });

    const editParams: ImageEditParams = {
      model: "gpt-image-2",
      image: imagePng,
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "medium",
    };

    const response  = await openai.images.edit(editParams);
    const imageData = response.data?.[0];
    if (!imageData) throw new Error("no data");

    const resultUrl = imageData.b64_json
      ? `data:image/png;base64,${imageData.b64_json}`
      : (imageData.url ?? null);
    if (!resultUrl) throw new Error("no result");

    return NextResponse.json({ image: resultUrl, remaining });
  } catch (err: unknown) {
    if (process.env.NODE_ENV !== "production") console.error("[new-exterior-simulator]", err);
    return NextResponse.json(
      { error: "画像の生成中にエラーが発生しました。しばらくしてから再度お試しください。" },
      { status: 500 }
    );
  }
}
