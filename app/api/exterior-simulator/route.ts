import { NextRequest, NextResponse } from "next/server";
import OpenAI, { toFile } from "openai";
import type { ImageEditParams } from "openai/resources/images";

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
  "concrete", "parking-expansion", "artificial-grass", "carport",
  "fence", "garden-clearance", "entrance", "slope-handrail",
  "gate-mailbox", "other",
]);

const ALLOWED_STYLES = new Set([
  "simple-modern", "japanese-modern", "western", "natural",
  "luxury-modern", "resort", "scandinavian", "auto", "none",
]);

const ALLOWED_TIME = new Set(["daytime", "dusk"]);

const ALLOWED_FENCE_LOCATIONS = new Set([
  "road-side", "left-boundary", "right-boundary",
  "rear-boundary", "surround-garden", "auto",
]);

// ─── Per-work-type mandatory instructions ──────────────────────────
const WORK_TYPE_INSTRUCTIONS: Record<string, string> = {
  "concrete":
    "指定された地面を、現実的な勾配と排水を考慮した土間コンクリートへ変更する。",
  "parking-expansion":
    "指定された庭や障害物を撤去し、既存駐車場と自然につながる駐車スペースを増設する。",
  "artificial-grass":
    "指定範囲の雑草と不要な土を整理し、防草処理を行った上で、自然な色合いの人工芝を施工する。\n住宅、隣家、道路、窓、玄関、敷地の広さ、撮影位置は変更しない。",
  "carport":
    "指定された駐車スペースへ、住宅の外観と敷地寸法に合う現実的なカーポートを設置する。",
  "fence":
    "道路または隣地から庭や室内への視線を遮る位置に、十分な高さの目隠しフェンスを連続して設置する。部分的な短いフェンスではなく、選択された境界範囲を適切に覆う。",
  "garden-clearance":
    "指定された不要な庭木・低木・庭石を撤去し、撤去跡を安全で自然な状態に整地する。\n依頼されていないフェンス、カーポート、門柱、植栽などを勝手に追加しない。",
  "entrance":
    "玄関まで安全に歩ける、現実的な幅と勾配のアプローチを施工する。",
  "slope-handrail":
    "車椅子でも利用しやすい緩やかな勾配、十分な通路幅、方向転換できる踊り場、連続した手すりを備えた現実的なスロープを設置する。\n見た目よりも安全性と実際の施工可能性を優先する。",
  "gate-mailbox":
    "住宅の外観と調和した門柱と宅配ボックスを設置する。",
  "other":
    "外構全体を選択したデザインテイストに合わせて整備する。",
};

// ─── Fence location prompts ────────────────────────────────────────
const FENCE_LOCATION_PROMPTS: Record<string, string> = {
  "road-side":       "道路側の境界に沿って設置する",
  "left-boundary":   "写真を正面から見て左側の隣地境界に沿って設置する",
  "right-boundary":  "写真を正面から見て右側の隣地境界に沿って設置する",
  "rear-boundary":   "庭の奥側の境界に沿って設置する",
  "surround-garden": "庭のプライバシーを確保できるよう複数の境界に連続して設置する",
  "auto":            "道路や隣家から最も視線が入りやすい境界を判断して設置する",
};

// ─── Style prompts ─────────────────────────────────────────────────
const STYLE_PROMPTS: Record<string, string> = {
  "simple-modern":   "白、グレー、黒を基調にしたシンプルモダンな外構。直線的で整理された配置、余計な装飾を抑えたデザイン。",
  "japanese-modern": "自然石、化粧砂利、木目、控えめな植栽を取り入れた和モダンな外構。落ち着きがあり、日本の既存住宅に自然になじむデザイン。",
  "western":         "レンガ、ベージュ系の乱形石、曲線状の目地を取り入れた洋風の外構。温かみがあり、派手すぎない自然なデザイン。",
  "natural":         "木目、植栽、人工芝、自然石を取り入れたナチュラルな外構。明るく柔らかく、日常的に管理しやすいデザイン。",
  "luxury-modern":   "大判タイル、上質な石材、黒やダークグレー、間接照明を取り入れた高級モダンな外構。重厚感がありながら現実的に施工可能なデザイン。",
  "resort":          "明るいタイル、開放感のある植栽、柔らかな照明を取り入れたリゾート風の外構。日本の住宅地でも施工可能な現実的なデザイン。",
  "scandinavian":    "白、ライトグレー、明るい木目を中心にした北欧風の外構。シンプルで柔らかく、自然な植栽を取り入れたデザイン。",
  "auto":            "住宅の外壁、屋根、玄関、周辺環境に最も似合う外構デザインを自動で選択してください。",
};

const TIME_LABELS: Record<string, string> = {
  "daytime": "昼間（自然光）",
  "dusk":    "夕暮れ・ライトアップ（照明あり）",
};

// ─── Prompt builder ────────────────────────────────────────────────
function buildPrompt(
  workTypes: string[],
  style: string,
  timeLabel: string,
  fenceLocations: string[],
): string {
  // Mandatory works section
  let workSection: string;
  if (workTypes.length === 0) {
    workSection = "外構全体を選択したデザインテイストに合わせて整備する。";
  } else if (workTypes.length === 1) {
    const instruction = WORK_TYPE_INSTRUCTIONS[workTypes[0]] ?? "外構を整備する。";
    workSection = `必須工事：\n${instruction}`;
  } else {
    const items = workTypes
      .map((t, i) => `必須工事${i + 1}：\n${WORK_TYPE_INSTRUCTIONS[t] ?? "外構を整備する。"}`)
      .join("\n\n");
    workSection =
      `今回、以下の工事が複数選択されています。\n\n` +
      `これらは候補ではありません。\n` +
      `すべての工事を、1枚の完成イメージの中へ必ず反映してください。\n\n` +
      `${items}\n\n` +
      `${workTypes.length}つのうち1つでも省略しないでください。\n` +
      `一部だけを施工した画像にしないでください。\n` +
      `完成画像を生成する前に、すべての必須工事を反映できているか確認してください。`;
  }

  // Fence-specific section
  let fenceSection = "";
  if (workTypes.includes("fence")) {
    const locationDesc = fenceLocations.length > 0
      ? fenceLocations.map((l) => FENCE_LOCATION_PROMPTS[l] ?? l).join("、")
      : FENCE_LOCATION_PROMPTS["auto"];
    fenceSection = `\n目隠しフェンスの設置位置：${locationDesc}\n\n` +
      `目隠しフェンスは装飾目的の低いフェンスではありません。外部から庭や窓への視線を遮ることが目的です。\n` +
      `以下の条件を必ず満たしてください：\n` +
      `- 地面からおおむね1.6〜2.0m程度に見える高さ\n` +
      `- 指定された境界に沿って連続して設置\n` +
      `- 人の視線が通る大きな隙間を作らない\n` +
      `- 敷地や通行を不自然に塞がない\n` +
      `- 道路へはみ出さない\n` +
      `- 窓、玄関、室外機を塞がない\n` +
      `- 住宅の色と選択されたデザインに調和させる\n` +
      `- 一部分だけに短く設置して完了扱いにしない\n`;
  }

  // Style section — omit entirely when style is "none"
  const styleSection = style !== "none" && STYLE_PROMPTS[style]
    ? `希望するデザインテイスト：${STYLE_PROMPTS[style]}\n\n`
    : "";

  return `アップロードされた写真を基準画像として使用してください。

これは日本の既存住宅の外構リフォーム完成イメージです。

${workSection}
${fenceSection}
重要：
選択された工事は、デザイン上可能な範囲で採用する候補ではなく、すべて実行する必須条件です。
選択項目の一部を無視しないでください。
選択項目を別の工事へ置き換えないでください。

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

新築住宅へ変更しないでください。
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

  const imageFile       = formData.get("image") as File | null;
  const maskFile        = formData.get("mask") as File | null;
  const workTypesRaw    = formData.get("workTypes") as string | null;
  const styleRaw        = (formData.get("style") as string | null) ?? "auto";
  const timeOfDayRaw    = (formData.get("timeOfDay") as string | null) ?? "daytime";
  const fenceLocRaw     = formData.get("fenceLocations") as string | null;
  const autoMask        = formData.get("autoMask") === "true";

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

  let parsedFenceLocations: string[] = [];
  try {
    const raw = JSON.parse(fenceLocRaw ?? "[]");
    parsedFenceLocations = Array.isArray(raw)
      ? raw.filter((l: unknown) => typeof l === "string" && ALLOWED_FENCE_LOCATIONS.has(l))
      : [];
  } catch { parsedFenceLocations = []; }
  if (parsedFenceLocations.length === 0) parsedFenceLocations = ["auto"];

  const style     = ALLOWED_STYLES.has(styleRaw)    ? styleRaw    : "auto";
  const timeOfDay = ALLOWED_TIME.has(timeOfDayRaw)  ? timeOfDayRaw : "daytime";

  if (process.env.NODE_ENV !== "production") {
    console.log("[exterior-simulator] work types:", parsedWorkTypes);
    console.log("[exterior-simulator] style:", style, "| time:", timeOfDay);
    console.log("[exterior-simulator] fence locations:", parsedFenceLocations);
  }

  const prompt = buildPrompt(parsedWorkTypes, style, TIME_LABELS[timeOfDay], parsedFenceLocations);

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    const imagePng    = await toFile(imageBuffer, "image.png", { type: "image/png" });

    const maskBlob = (maskFile && !autoMask)
      ? await toFile(Buffer.from(await maskFile.arrayBuffer()), "mask.png", { type: "image/png" })
      : undefined;

    const editParams: ImageEditParams = {
      model: "gpt-image-2",
      image: imagePng,
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "medium",
      ...(maskBlob ? { mask: maskBlob } : {}),
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
    if (process.env.NODE_ENV !== "production") console.error("[exterior-simulator]", err);
    return NextResponse.json(
      { error: "画像の生成中にエラーが発生しました。しばらくしてから再度お試しください。" },
      { status: 500 }
    );
  }
}
