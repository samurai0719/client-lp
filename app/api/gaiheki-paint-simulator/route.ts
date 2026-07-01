import { NextRequest, NextResponse } from "next/server";
import OpenAI, { toFile } from "openai";
import type { ImageEditParams } from "openai/resources/images";
import sharp from "sharp";

// ─── Rate limiting ──────────────────────────────────────────────────────────
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

// ─── Types ──────────────────────────────────────────────────────────────────
interface ColorData { name: string; hex: string }

type PaintPattern = "wall1" | "wall-twoTone" | "wall1-roof" | "wall-twoTone-roof" | "roof-only";
type TwoToneMethod = "floor12" | "topBottom" | "leftRight" | "balcony" | "entrance" | "indent" | "custom";
type MaskType = "wall1" | "wall2" | "roof";

// ─── Validation allowlists ──────────────────────────────────────────────────
const ALLOWED_PATTERNS = new Set<string>([
  "wall1", "wall-twoTone", "wall1-roof", "wall-twoTone-roof", "roof-only",
]);
const ALLOWED_TWO_TONE = new Set<string>([
  "floor12", "topBottom", "leftRight", "balcony", "entrance", "indent", "custom",
]);
const ALLOWED_MIME = new Set([
  "image/png", "image/jpeg", "image/jpg", "image/webp", "image/heic", "image/heif",
]);

// ─── Twoton placement instructions ─────────────────────────────────────────
function twoToneInstruction(
  method: TwoToneMethod,
  c1: ColorData,
  c2: ColorData,
  forMask: MaskType | null,
): string {
  const instructions: Record<TwoToneMethod, string> = {
    floor12: forMask === "wall1"
      ? `Use ${c1.name} (${c1.hex}) for the first-floor exterior walls only. Preserve the original boundary between floors.`
      : forMask === "wall2"
      ? `Use ${c2.name} (${c2.hex}) for the second-floor exterior walls only. Preserve the original boundary between floors.`
      : `Use ${c1.name} (${c1.hex}) for the first-floor exterior walls.\nUse ${c2.name} (${c2.hex}) for the second-floor exterior walls.\nPreserve the original boundary between the first and second floors.`,
    topBottom: forMask === "wall1"
      ? `Use ${c1.name} (${c1.hex}) for the upper portion of exterior walls. Preserve the horizontal division line.`
      : forMask === "wall2"
      ? `Use ${c2.name} (${c2.hex}) for the lower portion of exterior walls. Preserve the horizontal division line.`
      : `Use ${c1.name} (${c1.hex}) for the upper portion of exterior walls.\nUse ${c2.name} (${c2.hex}) for the lower portion of exterior walls.`,
    leftRight: forMask === "wall1"
      ? `Use ${c1.name} (${c1.hex}) for the right side exterior walls.`
      : forMask === "wall2"
      ? `Use ${c2.name} (${c2.hex}) for the left side exterior walls.`
      : `Use ${c1.name} (${c1.hex}) for the right side exterior walls.\nUse ${c2.name} (${c2.hex}) for the left side exterior walls.`,
    balcony: forMask === "wall1"
      ? `Use ${c1.name} (${c1.hex}) for the main exterior wall surfaces.`
      : forMask === "wall2"
      ? `Use ${c2.name} (${c2.hex}) only for the exterior wall surfaces of the balcony and projecting accent sections.`
      : `Use ${c1.name} (${c1.hex}) for the main exterior walls.\nUse ${c2.name} (${c2.hex}) only for the exterior wall surfaces of the balcony and projecting accent section.`,
    entrance: forMask === "wall1"
      ? `Use ${c1.name} (${c1.hex}) for the main exterior wall surfaces.`
      : forMask === "wall2"
      ? `Use ${c2.name} (${c2.hex}) only for the wall surfaces immediately surrounding the entrance area.`
      : `Use ${c1.name} (${c1.hex}) for the main exterior walls.\nUse ${c2.name} (${c2.hex}) only for the wall surfaces around the entrance area.`,
    indent: forMask === "wall1"
      ? `Use ${c1.name} (${c1.hex}) for the main flat exterior wall surfaces.`
      : forMask === "wall2"
      ? `Use ${c2.name} (${c2.hex}) for the recessed or projecting accent wall sections.`
      : `Use ${c1.name} (${c1.hex}) for the main flat exterior wall surfaces.\nUse ${c2.name} (${c2.hex}) for the recessed or projecting accent wall sections.`,
    custom: forMask === "wall1"
      ? `Use ${c1.name} (${c1.hex}) for the exterior wall areas indicated in the mask.`
      : forMask === "wall2"
      ? `Use ${c2.name} (${c2.hex}) for the accent wall areas indicated in the mask.`
      : `Use ${c1.name} (${c1.hex}) for wall areas marked as color 1.\nUse ${c2.name} (${c2.hex}) for wall areas marked as color 2.`,
  };
  return instructions[method] ?? instructions["custom"];
}

// ─── Prompt builder ─────────────────────────────────────────────────────────
function buildPrompt(
  pattern: PaintPattern,
  twoToneMethod: TwoToneMethod,
  wallColor1: ColorData,
  wallColor2: ColorData | null,
  roofColor: ColorData | null,
  forMask: MaskType | null,
): string {
  const hasTwoTone = pattern === "wall-twoTone" || pattern === "wall-twoTone-roof";
  const hasWall = pattern !== "roof-only";
  const hasRoof = ["wall1-roof", "wall-twoTone-roof", "roof-only"].includes(pattern);

  let colorSpec = "";
  if (forMask === "wall1" || (!forMask && hasWall)) {
    colorSpec += `  - Exterior wall color 1: ${wallColor1.name} (${wallColor1.hex})\n`;
  }
  if ((forMask === "wall2" || (!forMask && hasTwoTone)) && wallColor2) {
    colorSpec += `  - Exterior wall color 2: ${wallColor2.name} (${wallColor2.hex})\n`;
  }
  if ((forMask === "roof" || (!forMask && hasRoof)) && roofColor) {
    colorSpec += `  - Roof color: ${roofColor.name} (${roofColor.hex})\n`;
  }

  let applicationLines = "";
  if (pattern === "roof-only") {
    const roofSpec = roofColor ? `${roofColor.name} (${roofColor.hex})` : "the specified roof color";
    applicationLines = `- PAINT the entire visible roof surface (all roof tiles, panels, or covering material) with ${roofSpec}. This is mandatory — the roof MUST be recolored.\n- Leave all exterior walls completely unchanged.`;
  } else if (hasTwoTone && wallColor2) {
    applicationLines = twoToneInstruction(twoToneMethod, wallColor1, wallColor2, forMask);
    if (forMask === "roof" || (!forMask && hasRoof && roofColor)) {
      const roofSpec = roofColor ? `${roofColor.name} (${roofColor.hex})` : "the specified roof color";
      applicationLines += `\n- PAINT the entire visible roof surface (all roof tiles, panels, or covering material) with ${roofSpec}. This is mandatory — the roof MUST be recolored.`;
    }
  } else {
    applicationLines = `- Recolor all visible painted exterior wall surfaces to ${wallColor1.name} (${wallColor1.hex}).`;
    if (hasRoof && roofColor && (forMask === "roof" || !forMask)) {
      applicationLines += `\n- PAINT the entire visible roof surface (all roof tiles, panels, or covering material) with ${roofColor.name} (${roofColor.hex}). This is mandatory — the roof MUST be recolored.`;
    }
  }

  return `This is a SURFACE REPAINTING simulation task, not image generation. You must preserve the original photograph almost entirely and only tint the specified surfaces to the new color.

== ABSOLUTE PRESERVATION RULES (never violate) ==
- The house shape, silhouette, roofline, proportions, and position in the frame must remain PIXEL-IDENTICAL to the original photo.
- The output image must have EXACTLY the same crop, framing, field of view, zoom level, and subject positioning as the input image. Do not recompose, zoom in, zoom out, shift, or rotate the scene in any way.
- Every architectural element must stay in its exact original position, size, and appearance: windows, window frames, glass, entrance door, balcony railing, gutters, downpipes, eaves, fascias, soffits, pillars, garage door, fences, outdoor equipment.
- The entire background (sky, clouds, trees, garden, plants, driveway, pavement, vehicles, neighboring buildings, street) must remain completely unchanged.
- Original lighting direction, shadow placement, reflections, and weather conditions must be preserved.
- CRITICAL — MATERIAL AND TEXTURE: The surface material and micro-texture of every wall and roof surface must remain IDENTICAL to the original. Do NOT smooth, roughen, replace, or alter the material in any way. Only the color/hue changes — the physical texture, bump, grain, and surface relief must be pixel-accurate to the original. Think of this as a "hue shift" on the existing material, not a material replacement.
- Do NOT add, remove, relocate, resize, or alter any part of the building structure or surroundings.
- Do NOT repaint windows, glass, door panels, metal frames, gutters, downpipes, eave soffits, fences, pavement, or any surface that is NOT listed in the COLOR CHANGE TASK below.
- If any element is not visible in the original photo, do not invent or reveal it.

== COLOR CHANGE TASK ==
Apply the following paint colors. Every surface listed below MUST be recolored — do not skip any of them:
${colorSpec}
${applicationLines}

The final image must look exactly like a professional photograph of the same house taken from the same angle after exterior repainting — identical building, identical material textures, identical surroundings, only the specified surfaces recolored.`;
}

// ─── Image processing ───────────────────────────────────────────────────────
async function normalizeToPng(buffer: Buffer): Promise<Buffer> {
  // Pad to 1024×1024 square with white background so input and output share the same
  // aspect ratio — this makes the Before/After slider pixel-accurate in framing.
  return sharp(buffer)
    .rotate()
    .resize(1024, 1024, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 255 },
      withoutEnlargement: false,
    })
    .png()
    .toBuffer();
}

async function normalizeMask(maskBuffer: Buffer, width: number, height: number): Promise<Buffer> {
  return sharp(maskBuffer)
    .resize(width, height, { fit: "fill" })
    .ensureAlpha()
    .png()
    .toBuffer();
}

// ─── Route handler ──────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const { allowed, remaining } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "生成回数の上限（1時間に3回）に達しました。しばらくしてから再度お試しください。" },
      { status: 429 }
    );
  }

  // Mock mode for development
  if (!process.env.OPENAI_API_KEY) {
    if (process.env.NODE_ENV !== "production" || process.env.PAINT_SIM_MOCK === "true") {
      await new Promise((r) => setTimeout(r, 2500));
      return NextResponse.json({
        image: `data:image/svg+xml;base64,${Buffer.from(
          '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="#4D5154"/><text x="200" y="150" text-anchor="middle" fill="white" font-size="20" font-family="sans-serif">Mock Simulation</text></svg>'
        ).toString("base64")}`,
        simulationId: "mock-" + Date.now(),
        remaining,
      });
    }
    return NextResponse.json({ error: "画像生成機能がまだ設定されていません。" }, { status: 503 });
  }

  let fd: FormData;
  try { fd = await req.formData(); }
  catch { return NextResponse.json({ error: "リクエストの解析に失敗しました。" }, { status: 400 }); }

  const imageFile    = fd.get("image") as File | null;
  const maskWall1F   = fd.get("maskWall1") as File | null;
  const maskWall2F   = fd.get("maskWall2") as File | null;
  const maskRoofF    = fd.get("maskRoof") as File | null;
  const patternRaw   = (fd.get("paintPattern") as string | null) ?? "wall1";
  const twoToneRaw   = (fd.get("twoToneMethod") as string | null) ?? "floor12";
  const wc1Raw       = fd.get("wallColor1") as string | null;
  const wc2Raw       = fd.get("wallColor2") as string | null;
  const rcRaw        = fd.get("roofColor") as string | null;
  const useAutoMask    = fd.get("useAutoMask") !== "false";
  const aiChooseColor  = fd.get("aiChooseColor") === "true";

  if (!imageFile) return NextResponse.json({ error: "画像が添付されていません。" }, { status: 400 });

  const mime = imageFile.type.toLowerCase();
  if (!ALLOWED_MIME.has(mime) && !mime.startsWith("image/"))
    return NextResponse.json({ error: "対応していないファイル形式です。" }, { status: 400 });
  if (imageFile.size > 50 * 1024 * 1024)
    return NextResponse.json({ error: "ファイルサイズが大きすぎます（50MB以下）。" }, { status: 400 });

  const paintPattern = ALLOWED_PATTERNS.has(patternRaw) ? (patternRaw as PaintPattern) : "wall1";
  const twoToneMethod = ALLOWED_TWO_TONE.has(twoToneRaw) ? (twoToneRaw as TwoToneMethod) : "floor12";

  let wallColor1: ColorData = { name: "ピュアホワイト", hex: "#F4F3EE" };
  let wallColor2: ColorData | null = null;
  let roofColor: ColorData | null = null;
  try { if (wc1Raw) wallColor1 = JSON.parse(wc1Raw); } catch { /* keep default */ }
  try { if (wc2Raw) wallColor2 = JSON.parse(wc2Raw); } catch { /* */ }
  try { if (rcRaw) roofColor = JSON.parse(rcRaw); } catch { /* */ }

  const hasTwoTone = paintPattern === "wall-twoTone" || paintPattern === "wall-twoTone-roof";
  const hasRoof    = ["wall1-roof", "wall-twoTone-roof", "roof-only"].includes(paintPattern);

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const model = process.env.OPENAI_IMAGE_MODEL ?? "gpt-image-2";

    const rawBuffer = Buffer.from(await imageFile.arrayBuffer());
    const normalizedBuffer = await normalizeToPng(rawBuffer);
    // Return the normalized before-image so client Before/After uses same framing as output
    const beforeImageB64 = normalizedBuffer.toString("base64");
    const W = 1024;
    const H = 1024;

    // Build sequential call list
    type CallSpec = { maskType: MaskType | null; maskFile: File | null };
    const calls: CallSpec[] = [];

    if (paintPattern === "roof-only") {
      calls.push({ maskType: "roof", maskFile: maskRoofF });
    } else if (!hasTwoTone && !hasRoof) {
      calls.push({ maskType: "wall1", maskFile: maskWall1F });
    } else if (!hasTwoTone && hasRoof) {
      calls.push({ maskType: "wall1", maskFile: maskWall1F });
      if (roofColor) calls.push({ maskType: "roof", maskFile: maskRoofF });
    } else if (hasTwoTone && !hasRoof) {
      calls.push({ maskType: "wall1", maskFile: maskWall1F });
      if (wallColor2) calls.push({ maskType: "wall2", maskFile: maskWall2F });
    } else {
      calls.push({ maskType: "wall1", maskFile: maskWall1F });
      if (wallColor2) calls.push({ maskType: "wall2", maskFile: maskWall2F });
      if (roofColor) calls.push({ maskType: "roof", maskFile: maskRoofF });
    }

    const aiAutoPrompt = `This is a SURFACE REPAINTING simulation task, not image generation.

Automatically select the most beautiful, suitable, and popular exterior paint color scheme for this Japanese residential house. Choose colors that complement the architectural style and are popular in Japanese residential exterior painting.

MANDATORY TASK — you MUST do both of these:
1. PAINT all visible exterior wall surfaces with your chosen wall color.
2. PAINT the entire visible roof surface (all roof tiles, panels, or covering material) with your chosen roof color.
Both the walls AND the roof must be visibly recolored in the final image.

== ABSOLUTE PRESERVATION RULES (never violate) ==
- The house shape, silhouette, roofline, proportions, and position in the frame must remain PIXEL-IDENTICAL to the original photo.
- The output image must have EXACTLY the same crop, framing, field of view, zoom level, and subject positioning as the input image. Do not recompose, zoom in, zoom out, shift, or rotate the scene in any way.
- Every architectural element must stay in its exact original position, size, and appearance: windows, window frames, glass, entrance door, balcony railing, gutters, downpipes, eaves, fascias, soffits, pillars, garage door, fences, outdoor equipment.
- The entire background (sky, clouds, trees, garden, plants, driveway, pavement, vehicles, neighboring buildings, street) must remain completely unchanged.
- Original lighting direction, shadow placement, reflections, and weather conditions must be preserved.
- CRITICAL — MATERIAL AND TEXTURE: The surface material and micro-texture of every wall and roof surface must remain IDENTICAL to the original. Only the color/hue changes — the physical texture, bump, grain, and surface relief must be pixel-accurate to the original. Think of this as a "hue shift" on the existing material.
- Do NOT repaint windows, glass, door panels, metal frames, gutters, downpipes, eave soffits, fences, or pavement.

The final image must look exactly like a professional photograph of the same house after beautiful exterior repainting — walls and roof both visibly recolored, everything else unchanged.`;

    let currentBuf = normalizedBuffer;

    for (const call of calls) {
      const prompt = aiChooseColor
        ? aiAutoPrompt
        : buildPrompt(paintPattern, twoToneMethod, wallColor1, wallColor2, roofColor, call.maskType);

      const imgFile = await toFile(currentBuf, "image.png", { type: "image/png" });

      let editParams: ImageEditParams;

      if (!useAutoMask && call.maskFile) {
        // Manual mask provided by user — use it for targeted inpainting
        const rawMask = Buffer.from(await call.maskFile.arrayBuffer());
        const maskBuf = await normalizeMask(rawMask, W, H);
        const maskFile2 = await toFile(maskBuf, "mask.png", { type: "image/png" });
        editParams = {
          model,
          image: imgFile,
          mask: maskFile2,
          prompt,
          n: 1,
          size: "1024x1024",
          quality: "medium",
        };
      } else {
        // Auto mode — no mask, rely on prompt-guided editing to preserve structure
        editParams = {
          model,
          image: imgFile,
          prompt,
          n: 1,
          size: "1024x1024",
          quality: "medium",
        };
      }

      const response = await openai.images.edit(editParams);

      const imgData = response.data?.[0];
      if (!imgData) throw new Error("no data from OpenAI");

      if (imgData.b64_json) {
        currentBuf = Buffer.from(imgData.b64_json, "base64");
      } else if (imgData.url) {
        const fetched = await fetch(imgData.url);
        currentBuf = Buffer.from(await fetched.arrayBuffer());
      } else {
        throw new Error("no result image");
      }
    }

    const resultB64 = currentBuf.toString("base64");
    const simulationId = `sim-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    return NextResponse.json({
      image: `data:image/png;base64,${resultB64}`,
      beforeImage: `data:image/png;base64,${beforeImageB64}`,
      simulationId,
      remaining,
    });
  } catch (err: unknown) {
    if (process.env.NODE_ENV !== "production") console.error("[gaiheki-paint-simulator]", err);
    return NextResponse.json(
      { error: "シミュレーション画像を作成できませんでした。写真や通信環境を確認して、もう一度お試しください。" },
      { status: 500 }
    );
  }
}
