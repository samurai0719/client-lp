"use client";

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  useId,
} from "react";

// ─── Types ──────────────────────────────────────────────────────────────────
export interface ColorItem { name: string; hex: string }
type PaintPattern = "wall1" | "wall-twoTone" | "wall1-roof" | "wall-twoTone-roof" | "roof-only";
type TwoToneMethod = "floor12" | "topBottom" | "leftRight" | "balcony" | "entrance" | "indent" | "custom";
type SimStep = "upload" | "pattern" | "color" | "result";

export interface SimulationData {
  originalImage: string;
  generatedImage: string;
  wallColor1: ColorItem;
  wallColor2: ColorItem | null;
  roofColor: ColorItem | null;
  paintPattern: PaintPattern;
  twoToneMethod: TwoToneMethod;
  simulationId: string;
}

interface Props {
  onRequestQuote?: (data: SimulationData) => void;
  id?: string;
}

// ─── Color palette ───────────────────────────────────────────────────────────
interface ColorGroup { label: string; colors: ColorItem[] }
const COLOR_PALETTE: ColorGroup[] = [
  {
    label: "ホワイト系",
    colors: [
      { name: "ピュアホワイト", hex: "#F4F3EE" },
      { name: "クリーミーホワイト", hex: "#EDE9E0" },
      { name: "オフホワイト", hex: "#EBEBEB" },
    ],
  },
  {
    label: "アイボリー系",
    colors: [
      { name: "アイボリー", hex: "#E8DDC5" },
      { name: "クリームアイボリー", hex: "#E0D0AA" },
      { name: "ゴールドアイボリー", hex: "#D9C99E" },
    ],
  },
  {
    label: "ベージュ系",
    colors: [
      { name: "ライトベージュ", hex: "#CDBD9E" },
      { name: "サンドベージュ", hex: "#C4A882" },
      { name: "ウォームベージュ", hex: "#B89B79" },
    ],
  },
  {
    label: "ブラウン系",
    colors: [
      { name: "ライトブラウン", hex: "#A07850" },
      { name: "モカブラウン", hex: "#806953" },
      { name: "ダークブラウン", hex: "#5C3A1E" },
    ],
  },
  {
    label: "グレー系",
    colors: [
      { name: "ライトグレー", hex: "#A7A9AC" },
      { name: "ミディアムグレー", hex: "#7A7D80" },
      { name: "チャコールグレー", hex: "#4D5154" },
    ],
  },
  {
    label: "ブラック系",
    colors: [
      { name: "スレートブラック", hex: "#2E2E2E" },
      { name: "ブラック", hex: "#252525" },
    ],
  },
  {
    label: "ネイビー系",
    colors: [
      { name: "ネイビー", hex: "#28384C" },
      { name: "ダークネイビー", hex: "#1A2434" },
    ],
  },
  {
    label: "ブルー系",
    colors: [
      { name: "スモーキーブルー", hex: "#4A6B8A" },
      { name: "スチールブルー", hex: "#5B7A9D" },
    ],
  },
  {
    label: "グリーン系",
    colors: [
      { name: "セージグリーン", hex: "#6B8C6F" },
      { name: "フォレストグリーン", hex: "#3D5C47" },
      { name: "ダークグリーン", hex: "#314C40" },
    ],
  },
  {
    label: "レッド・ワイン系",
    colors: [
      { name: "テラコッタ", hex: "#8B4A35" },
      { name: "ワインレッド", hex: "#65373C" },
    ],
  },
];

const ALL_COLORS: ColorItem[] = COLOR_PALETTE.flatMap((g) => g.colors);

// ─── Paint patterns ──────────────────────────────────────────────────────────
const PAINT_PATTERNS: { id: PaintPattern; label: string; desc: string }[] = [
  { id: "wall1",             label: "外壁 1色",            desc: "外壁全体を1色で統一" },
  { id: "wall-twoTone",      label: "外壁 ツートン",        desc: "外壁を2色で塗り分け" },
  { id: "wall1-roof",        label: "外壁 1色 + 屋根",      desc: "外壁と屋根の色を指定" },
  { id: "wall-twoTone-roof", label: "外壁 ツートン + 屋根", desc: "外壁2色＋屋根を指定" },
  { id: "roof-only",         label: "屋根のみ",             desc: "屋根の色だけを変更" },
];

const TWO_TONE_METHODS: { id: TwoToneMethod; label: string }[] = [
  { id: "floor12",  label: "1階と2階で塗り分け" },
  { id: "topBottom",label: "上部と下部で塗り分け" },
  { id: "leftRight",label: "左側と右側で塗り分け" },
  { id: "balcony",  label: "ベランダ・バルコニー部分をアクセントカラーに" },
  { id: "entrance", label: "玄関まわりをアクセントカラーに" },
  { id: "indent",   label: "建物の凹凸部分をアクセントカラーに" },
  { id: "custom",   label: "自分で塗装範囲を指定する" },
];


// ─── Image processing ────────────────────────────────────────────────────────
function readOrientation(buffer: ArrayBuffer): number {
  try {
    const view = new DataView(buffer);
    if (view.byteLength < 4 || view.getUint16(0, false) !== 0xFFD8) return 1;
    let offset = 2;
    while (offset + 1 < view.byteLength) {
      const marker = view.getUint16(offset, false);
      offset += 2;
      if (marker === 0xFFE1) {
        if (offset + 14 > view.byteLength) break;
        if (view.getUint32(offset + 2, false) !== 0x45786966) break;
        const littleEndian = view.getUint16(offset + 8, false) === 0x4949;
        const ifdOffset = view.getUint32(offset + 12, littleEndian) + offset + 8;
        if (ifdOffset + 2 > view.byteLength) break;
        const entries = view.getUint16(ifdOffset, littleEndian);
        for (let i = 0; i < entries; i++) {
          const base = ifdOffset + 2 + i * 12;
          if (base + 10 > view.byteLength) break;
          if (view.getUint16(base, littleEndian) === 0x0112) {
            return view.getUint16(base + 8, littleEndian);
          }
        }
        break;
      }
      if ((marker & 0xFF00) !== 0xFF00) break;
      if (offset + 2 > view.byteLength) break;
      const segLen = view.getUint16(offset, false);
      if (segLen < 2) break;
      offset += segLen;
    }
  } catch {
    // malformed EXIF — ignore and use default orientation
  }
  return 1;
}

async function processUploadedFile(file: File): Promise<{
  dataUrl: string;
  warning: string | null;
}> {
  const isHeic = /\.(heic|heif)$/i.test(file.name) ||
    file.type === "image/heic" || file.type === "image/heif";

  let blob: Blob = file;

  if (isHeic) {
    try {
      const heic2any = (await import("heic2any")).default;
      const converted = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.9 });
      blob = Array.isArray(converted) ? converted[0] : converted;
    } catch {
      throw new Error("HEIC_UNSUPPORTED");
    }
  }

  const arrayBuffer = await blob.arrayBuffer();
  const orientation = readOrientation(arrayBuffer);

  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      try {
        const MAX = 2048;
        const { naturalWidth: w, naturalHeight: h } = img;
        const swap = orientation >= 5 && orientation <= 8;
        const srcW = swap ? h : w;
        const srcH = swap ? w : h;
        const scale = Math.min(1, MAX / Math.max(srcW, srcH));
        const cW = Math.round(srcW * scale);
        const cH = Math.round(srcH * scale);
        const canvas = document.createElement("canvas");
        canvas.width = cW; canvas.height = cH;
        const ctx = canvas.getContext("2d");
        if (!ctx) { reject(new Error("CANVAS_FAILED")); return; }
        ctx.save();
        ctx.translate(cW / 2, cH / 2);
        const rot = [0, 0, 180, 0, 90, 90, -90, -90][orientation - 1] ?? 0;
        const flipH = [2, 4, 5, 7].includes(orientation);
        if (flipH) ctx.scale(-1, 1);
        ctx.rotate((rot * Math.PI) / 180);
        ctx.drawImage(img, -w * scale / 2, -h * scale / 2, w * scale, h * scale);
        ctx.restore();

        let warning: string | null = null;
        try {
          const sample = ctx.getImageData(0, 0, Math.min(100, cW), Math.min(100, cH));
          let brightness = 0;
          for (let i = 0; i < sample.data.length; i += 4) {
            brightness += (sample.data[i] + sample.data[i + 1] + sample.data[i + 2]) / 3;
          }
          brightness /= (sample.data.length / 4);
          if (brightness < 40) {
            warning = "建物全体が正面から写っている、明るい時間帯の写真を使用すると、より自然な仕上がりになります。";
          }
        } catch { /* getImageData can fail in some environments — skip brightness check */ }

        resolve({ dataUrl: canvas.toDataURL("image/jpeg", 0.9), warning });
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("LOAD_FAILED")); };
    img.src = url;
  });
}

async function dataUrlToFile(dataUrl: string, filename: string): Promise<File> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type });
}

// ─── Inline BeforeAfter Slider ───────────────────────────────────────────────
function BeforeAfterSlider({ before, after }: { before: string; after: string }) {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  function calcPos(clientX: number) {
    const el = containerRef.current;
    if (!el) return;
    const { left, width } = el.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - left) / width) * 100)));
  }

  return (
    <div
      ref={containerRef}
      className="relative select-none overflow-hidden rounded-2xl"
      style={{ cursor: "col-resize", touchAction: "none", aspectRatio: "4/3" }}
      onPointerDown={(e) => {
        dragging.current = true;
        calcPos(e.clientX);
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => { if (dragging.current) calcPos(e.clientX); }}
      onPointerUp={(e) => { dragging.current = false; e.currentTarget.releasePointerCapture(e.pointerId); }}
    >
      {/* After (right) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={after} alt="シミュレーション後" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
      {/* Before (left, clipped) */}
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={before} alt="元の写真" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
      </div>
      {/* Labels */}
      <span className="absolute top-2 left-2 text-[11px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white">Before</span>
      <span className="absolute top-2 right-2 text-[11px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white">After</span>
      {/* Divider */}
      <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-md" style={{ left: `${pos}%` }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" /><polyline points="9 18 15 12 9 6" style={{ transform: "translateX(6px)" }} />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ─── Color Picker ─────────────────────────────────────────────────────────────
function ColorPicker({
  label,
  value,
  onChange,
}: { label: string; value: ColorItem; onChange: (c: ColorItem) => void }) {
  const [open, setOpen] = useState(false);
  const [customHex, setCustomHex] = useState(value.hex);
  const uid = useId();

  return (
    <div>
      <label className="block text-xs font-bold text-slate-600 mb-2">{label}</label>

      {/* Current color preview */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-3 w-full border-2 rounded-xl px-3 py-2.5 transition-colors"
        style={{ borderColor: open ? "#1e3a5f" : "#e2e8f0", background: "#fff" }}
        type="button"
      >
        <span className="w-7 h-7 rounded-lg border border-black/10 shrink-0" style={{ background: value.hex }} />
        <span className="text-sm font-semibold text-slate-800 flex-1 text-left">{value.name}</span>
        <span className="text-xs text-slate-400 font-mono">{value.hex}</span>
        <svg className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
      </button>

      {open && (
        <div className="mt-2 border border-slate-200 rounded-2xl bg-white shadow-lg p-3 space-y-3">
          {/* Pre-defined palette */}
          {COLOR_PALETTE.map((group) => (
            <div key={group.label}>
              <p className="text-[10px] font-bold text-slate-400 mb-1.5 tracking-wider uppercase">{group.label}</p>
              <div className="flex flex-wrap gap-2">
                {group.colors.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    title={`${c.name} ${c.hex}`}
                    onClick={() => { onChange(c); setCustomHex(c.hex); setOpen(false); }}
                    className="relative w-8 h-8 rounded-lg border-2 transition-all"
                    style={{
                      background: c.hex,
                      borderColor: value.hex === c.hex ? "#1e3a5f" : "transparent",
                      boxShadow: value.hex === c.hex ? "0 0 0 2px #1e3a5f" : "none",
                    }}
                  >
                    {value.hex === c.hex && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Custom color picker */}
          <div className="border-t border-slate-100 pt-3">
            <p className="text-[10px] font-bold text-slate-400 mb-2 tracking-wider uppercase">カスタムカラー</p>
            <div className="flex gap-2 items-center">
              <label htmlFor={uid} className="w-10 h-10 rounded-xl border-2 border-slate-200 overflow-hidden cursor-pointer">
                <input
                  id={uid}
                  type="color"
                  value={customHex}
                  onChange={(e) => {
                    setCustomHex(e.target.value);
                    onChange({ name: "カスタム", hex: e.target.value });
                  }}
                  className="w-full h-full cursor-pointer border-0 p-0"
                />
              </label>
              <input
                type="text"
                value={customHex}
                placeholder="#000000"
                onChange={(e) => {
                  const v = e.target.value;
                  setCustomHex(v);
                  if (/^#[0-9A-Fa-f]{6}$/.test(v)) onChange({ name: "カスタム", hex: v });
                }}
                className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono outline-none focus:border-[#1e3a5f]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Step indicator ───────────────────────────────────────────────────────────
const STEPS: { id: SimStep; label: string }[] = [
  { id: "upload",  label: "写真" },
  { id: "pattern", label: "パターン" },
  { id: "color",   label: "カラー" },
  { id: "result",  label: "結果" },
];

function StepIndicator({ current }: { current: SimStep }) {
  const idx = STEPS.findIndex((s) => s.id === current);
  return (
    <div className="flex items-center gap-0 w-full mb-6">
      {STEPS.map((s, i) => {
        const done    = i < idx;
        const active  = i === idx;
        return (
          <div key={s.id} className="flex items-center flex-1 min-w-0">
            <div className="flex flex-col items-center flex-1 min-w-0">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-extrabold shrink-0"
                style={{
                  background: done ? "#1e3a5f" : active ? "#f97316" : "#e2e8f0",
                  color: done || active ? "#fff" : "#94a3b8",
                }}
              >
                {done ? "✓" : i + 1}
              </div>
              <span
                className="text-[9px] mt-0.5 font-semibold truncate w-full text-center"
                style={{ color: active ? "#f97316" : done ? "#1e3a5f" : "#94a3b8" }}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="h-px flex-1 mx-1 shrink-0" style={{ background: i < idx ? "#1e3a5f" : "#e2e8f0" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Loading phases ───────────────────────────────────────────────────────────
const LOADING_PHASES = [
  "写真を確認しています",
  "外壁と屋根を判定しています",
  "選択したカラーを反映しています",
  "完成イメージを作成しています",
];

// ─── Main component ──────────────────────────────────────────────────────────
export default function GaihekiColorSimulator({ onRequestQuote, id }: Props) {
  const [step, setStep] = useState<SimStep>("upload");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [imageWarning, setImageWarning] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);

  const [paintPattern, setPaintPattern] = useState<PaintPattern>("wall1");
  const [twoToneMethod, setTwoToneMethod] = useState<TwoToneMethod>("floor12");

  const [wallColor1, setWallColor1] = useState<ColorItem>(ALL_COLORS[0]);
  const [wallColor2, setWallColor2] = useState<ColorItem>(ALL_COLORS[12]);
  const [roofColor,  setRoofColor]  = useState<ColorItem>(ALL_COLORS[14]);


  const [isGenerating, setIsGenerating]   = useState(false);
  const [loadingPhase, setLoadingPhase]   = useState(0);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [beforeImage, setBeforeImage]     = useState<string | null>(null);
  const [simulationId, setSimulationId]   = useState<string | null>(null);
  const [resultView, setResultView]       = useState<"before" | "after" | "slider">("slider");
  const generatingRef = useRef(false);
  const phaseTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const hasTwoTone = paintPattern === "wall-twoTone" || paintPattern === "wall-twoTone-roof";
  const hasRoof    = ["wall1-roof", "wall-twoTone-roof", "roof-only"].includes(paintPattern);
  const hasWall    = paintPattern !== "roof-only";

  // Loading phase cycling
  useEffect(() => {
    if (isGenerating) {
      setLoadingPhase(0);
      let i = 0;
      phaseTimerRef.current = setInterval(() => {
        i = Math.min(i + 1, LOADING_PHASES.length - 1);
        setLoadingPhase(i);
      }, 3000);
    } else {
      if (phaseTimerRef.current) clearInterval(phaseTimerRef.current);
    }
    return () => { if (phaseTimerRef.current) clearInterval(phaseTimerRef.current); };
  }, [isGenerating]);

  // ── File handling ────────────────────────────────────────────────────────
  const handleFileChange = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    const allowedExt = /\.(jpe?g|png|webp|heic|heif)$/i;
    if (!allowedExt.test(file.name) && !file.type.startsWith("image/")) {
      setUploadError("JPEG・PNG・WebP・HEICファイルをお選びください。");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setUploadError("ファイルサイズが50MBを超えています。");
      return;
    }

    setUploadError(null);
    setIsProcessingUpload(true);
    try {
      const { dataUrl, warning } = await processUploadedFile(file);
      setImageDataUrl(dataUrl);
      setImageWarning(warning);
      setImageFile(file);
      setGeneratedImage(null);
      setSimulationId(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg === "HEIC_UNSUPPORTED") {
        setUploadError("このブラウザではHEIC形式を変換できませんでした。カメラアプリの設定で「最高互換性」を選ぶか、JPEG形式で撮影してお試しください。");
      } else {
        setUploadError("画像の読み込みに失敗しました。別の写真でお試しください。");
      }
    } finally {
      setIsProcessingUpload(false);
    }
  }, []);

  // ── Generate (with user-selected colors) ─────────────────────────────────
  async function handleGenerate() {
    if (!imageDataUrl || isGenerating || generatingRef.current) return;
    generatingRef.current = true;
    setIsGenerating(true);
    setGenerateError(null);

    try {
      const fd = new FormData();
      const imgFile = await dataUrlToFile(imageDataUrl, "house.jpg");
      fd.append("image", imgFile);
      fd.append("useAutoMask", "true");
      fd.append("paintPattern", paintPattern);
      fd.append("twoToneMethod", twoToneMethod);
      fd.append("wallColor1", JSON.stringify(wallColor1));
      if (hasTwoTone) fd.append("wallColor2", JSON.stringify(wallColor2));
      if (hasRoof) fd.append("roofColor", JSON.stringify(roofColor));

      const res = await fetch("/api/gaiheki-paint-simulator", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok || !data.image) {
        throw new Error(data.error ?? "シミュレーション画像を作成できませんでした。");
      }

      setGeneratedImage(data.image);
      setBeforeImage(data.beforeImage ?? imageDataUrl);
      setSimulationId(data.simulationId ?? null);
      setStep("result");
      setResultView("slider");
      setTimeout(() => sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "シミュレーション画像を作成できませんでした。写真や通信環境を確認して、もう一度お試しください。";
      setGenerateError(msg);
    } finally {
      setIsGenerating(false);
      generatingRef.current = false;
    }
  }

  // ── Save image ────────────────────────────────────────────────────────────
  function handleSave() {
    if (!generatedImage) return;
    const a = document.createElement("a");
    a.href = generatedImage;
    a.download = `gaiheki-simulation-${simulationId ?? Date.now()}.png`;
    a.click();
  }

  // ── Request quote ─────────────────────────────────────────────────────────
  function handleRequestQuote() {
    if (!imageDataUrl || !generatedImage) return;
    onRequestQuote?.({
      originalImage: imageDataUrl,
      generatedImage,
      wallColor1,
      wallColor2: hasTwoTone ? wallColor2 : null,
      roofColor: hasRoof ? roofColor : null,
      paintPattern,
      twoToneMethod,
      simulationId: simulationId ?? "",
    });
  }

  // ── Generate (AI auto-selects colors) ────────────────────────────────────
  async function handleAiGenerate() {
    if (!imageDataUrl) {
      setStep("upload");
      return;
    }
    if (isGenerating || generatingRef.current) return;
    generatingRef.current = true;
    setIsGenerating(true);
    setGenerateError(null);

    try {
      const fd = new FormData();
      const imgFile = await dataUrlToFile(imageDataUrl, "house.jpg");
      fd.append("image", imgFile);
      fd.append("useAutoMask", "true");
      fd.append("aiChooseColor", "true");
      fd.append("paintPattern", "wall1");
      fd.append("twoToneMethod", "floor12");

      const res = await fetch("/api/gaiheki-paint-simulator", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || !data.image) throw new Error(data.error ?? "シミュレーション画像を作成できませんでした。");

      setGeneratedImage(data.image);
      setBeforeImage(data.beforeImage ?? imageDataUrl);
      setSimulationId(data.simulationId ?? null);
      setStep("result");
      setResultView("slider");
      setTimeout(() => sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "シミュレーション画像を作成できませんでした。写真や通信環境を確認して、もう一度お試しください。";
      setGenerateError(msg);
    } finally {
      setIsGenerating(false);
      generatingRef.current = false;
    }
  }

  // ── Navigation helpers ────────────────────────────────────────────────────
  const stepOrder: SimStep[] = ["upload", "pattern", "color", "result"];
  function goNext() {
    const i = stepOrder.indexOf(step);
    if (i < stepOrder.length - 1) setStep(stepOrder[i + 1]);
  }
  function goBack() {
    const i = stepOrder.indexOf(step);
    if (i > 0) setStep(stepOrder[i - 1]);
  }

  // CTA button style
  const ctaStyle: React.CSSProperties = {
    background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
    color: "#fff",
    boxShadow: "0 4px 16px rgba(249,115,22,0.35)",
    border: "none",
  };

  const navBtnStyle: React.CSSProperties = {
    background: "#1e3a5f",
    color: "#fff",
    border: "none",
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <section
      ref={sectionRef}
      id={id}
      className="py-12 px-5"
      style={{ background: "linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)" }}
    >
      <div className="max-w-lg mx-auto">
        {/* Section heading */}
        <div className="text-center mb-7">
          <span
            className="inline-block text-[11px] font-extrabold tracking-widest px-4 py-1.5 rounded-full mb-3"
            style={{ background: "#fff3e0", color: "#ea580c", border: "1px solid #fed7aa" }}
          >
            AI カラーシミュレーション
          </span>
          <h2 className="text-[1.4rem] font-extrabold text-[#1e3a5f] leading-snug tracking-tight">
            外壁・屋根カラーシミュレーション
          </h2>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            自宅写真をアップロードするだけで、<br />
            塗装後の完成イメージをAIが生成します
          </p>

        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5 mt-4">
          {step !== "result" && <StepIndicator current={step} />}

          {/* ══ STEP 1: Upload ══ */}
          {step === "upload" && (
            <div className="space-y-4">
              <h3 className="text-base font-extrabold text-slate-900">STEP 1：住宅写真をアップロード</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                正面から撮影した住宅外観写真を使用してください。<br />
                JPEG・PNG・WebP・HEIC対応。
              </p>

              <div className="grid grid-cols-2 gap-3">
                {/* Camera */}
                <label className="relative cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="sr-only"
                    onChange={(e) => handleFileChange(e.target.files)}
                  />
                  <div
                    className="flex flex-col items-center gap-2 py-5 rounded-2xl border-2 border-dashed transition-colors"
                    style={{ borderColor: "#1e3a5f", background: "#f0f5fb" }}
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="1.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                    <span className="text-sm font-bold text-[#1e3a5f]">写真を撮影する</span>
                    <span className="text-[10px] text-slate-400">カメラを起動</span>
                  </div>
                </label>

                {/* File select */}
                <label className="relative cursor-pointer">
                  <input
                    type="file"
                    accept="image/*,.heic,.heif"
                    className="sr-only"
                    onChange={(e) => handleFileChange(e.target.files)}
                  />
                  <div
                    className="flex flex-col items-center gap-2 py-5 rounded-2xl border-2 border-dashed transition-colors"
                    style={{ borderColor: "#e2e8f0", background: "#f8fafc" }}
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    <span className="text-sm font-bold text-slate-700">写真を選択する</span>
                    <span className="text-[10px] text-slate-400">ライブラリから選択</span>
                  </div>
                </label>
              </div>

              {isProcessingUpload && (
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                  <svg className="w-5 h-5 animate-spin text-blue-500" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  <span className="text-sm text-blue-700">写真を処理しています…</span>
                </div>
              )}

              {uploadError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                  ⚠ {uploadError}
                </div>
              )}

              {imageDataUrl && !isProcessingUpload && (
                <div className="space-y-3">
                  {/* Preview */}
                  <div className="rounded-2xl overflow-hidden border border-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageDataUrl} alt="プレビュー" className="w-full h-auto block" />
                  </div>

                  {imageWarning && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
                      💡 {imageWarning}
                    </div>
                  )}

                  <button
                    onClick={goNext}
                    className="w-full py-4 rounded-2xl font-extrabold text-base transition-all active:scale-[0.98]"
                    style={navBtnStyle}
                  >
                    この写真でシミュレーションする →
                  </button>
                </div>
              )}

              <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                建物全体が正面から写っている、明るい時間帯の写真を使用すると、より自然な仕上がりになります。
              </p>
            </div>
          )}

          {/* ══ STEP 2: Pattern ══ */}
          {step === "pattern" && (
            <div className="space-y-4">
              <h3 className="text-base font-extrabold text-slate-900">STEP 2：塗装パターンを選択</h3>

              <div className="space-y-2">
                {PAINT_PATTERNS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPaintPattern(p.id)}
                    className="w-full text-left flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all"
                    style={{
                      borderColor: paintPattern === p.id ? "#1e3a5f" : "#e2e8f0",
                      background: paintPattern === p.id ? "#1e3a5f" : "#fff",
                      color: paintPattern === p.id ? "#fff" : "#1e293b",
                    }}
                  >
                    <span
                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                      style={{
                        borderColor: paintPattern === p.id ? "#f97316" : "#cbd5e1",
                        background: paintPattern === p.id ? "#f97316" : "transparent",
                      }}
                    >
                      {paintPattern === p.id && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"><polyline points="20 6 9 17 4 12" /></svg>
                      )}
                    </span>
                    <div>
                      <p className="font-bold text-sm">{p.label}</p>
                      <p className="text-xs opacity-75">{p.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* TwoTone method sub-options */}
              {hasTwoTone && (
                <div className="bg-slate-50 rounded-2xl p-4 space-y-2">
                  <p className="text-sm font-bold text-slate-700">塗り分け方法を選択</p>
                  {TWO_TONE_METHODS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setTwoToneMethod(m.id)}
                      className="w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all text-sm"
                      style={{
                        borderColor: twoToneMethod === m.id ? "#f97316" : "#e2e8f0",
                        background: twoToneMethod === m.id ? "#fff7ed" : "#fff",
                        color: twoToneMethod === m.id ? "#ea580c" : "#475569",
                        fontWeight: twoToneMethod === m.id ? "700" : "400",
                      }}
                    >
                      <span
                        className="w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center"
                        style={{ borderColor: twoToneMethod === m.id ? "#f97316" : "#cbd5e1" }}
                      >
                        {twoToneMethod === m.id && <span className="w-2 h-2 rounded-full bg-orange-500" />}
                      </span>
                      {m.label}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button onClick={goBack} className="flex-1 py-3 rounded-2xl border-2 border-slate-200 text-slate-600 font-bold text-sm">
                  戻る
                </button>
                <button onClick={goNext} className="flex-[2] py-3 rounded-2xl font-extrabold text-sm transition-all" style={navBtnStyle}>
                  カラーを選択する →
                </button>
              </div>
            </div>
          )}

          {/* ══ STEP 3: Color ══ */}
          {step === "color" && (
            <div className="space-y-5">
              <h3 className="text-base font-extrabold text-slate-900">STEP 3：カラーを選択</h3>

              {hasWall && (
                <ColorPicker
                  label={hasTwoTone ? "外壁カラー 1（メインカラー）" : "外壁カラー"}
                  value={wallColor1}
                  onChange={setWallColor1}
                />
              )}

              {hasTwoTone && (
                <ColorPicker
                  label="外壁カラー 2（アクセントカラー）"
                  value={wallColor2}
                  onChange={setWallColor2}
                />
              )}

              {hasRoof && (
                <ColorPicker
                  label="屋根カラー"
                  value={roofColor}
                  onChange={setRoofColor}
                />
              )}

              <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-700 leading-relaxed">
                シミュレーション画像は仕上がりのイメージです。実際の色味は、塗料、外壁材、光の当たり方、周辺環境などによって異なります。
              </div>

              <button
                onClick={handleAiGenerate}
                disabled={isGenerating}
                className="w-full py-3.5 rounded-2xl font-extrabold text-base transition-all active:scale-[0.98] disabled:opacity-60"
                style={ctaStyle}
              >
                カラーをお任せでシミュレーションしてみる →
              </button>

              {generateError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                  ⚠ {generateError}
                </div>
              )}

              <div className="flex gap-2">
                <button onClick={goBack} disabled={isGenerating} className="flex-1 py-3 rounded-2xl border-2 border-slate-200 text-slate-600 font-bold text-sm disabled:opacity-50">
                  戻る
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="flex-[2] py-3 rounded-2xl font-extrabold text-sm transition-all active:scale-[0.98] disabled:opacity-60"
                  style={navBtnStyle}
                >
                  {isGenerating ? "生成中..." : "この色でシミュレーション →"}
                </button>
              </div>

              {/* Loading overlay */}
              {isGenerating && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
                  <div className="text-center p-8 max-w-xs">
                    <div className="relative w-16 h-16 mx-auto mb-5">
                      <svg className="w-16 h-16 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-20" cx="12" cy="12" r="10" stroke="#1e3a5f" strokeWidth="3" />
                        <path className="opacity-80" fill="#1e3a5f" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    </div>
                    <div className="space-y-2">
                      {LOADING_PHASES.map((phase, i) => (
                        <p
                          key={phase}
                          className="text-sm font-semibold transition-all duration-500"
                          style={{
                            color: i === loadingPhase ? "#1e3a5f" : i < loadingPhase ? "#22c55e" : "#cbd5e1",
                            fontWeight: i === loadingPhase ? "700" : "400",
                          }}
                        >
                          {i < loadingPhase ? "✓ " : i === loadingPhase ? "▶ " : "  "}
                          {phase}
                        </p>
                      ))}
                    </div>
                    <p className="text-xs text-slate-400 mt-5 leading-relaxed">
                      完成まで30秒〜2分かかることがあります。<br />
                      このまましばらくお待ちください。
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══ STEP 5: Result ══ */}
          {step === "result" && generatedImage && imageDataUrl && (
            <div className="space-y-5">
              <div className="text-center">
                <h3 className="text-lg font-extrabold text-slate-900 mb-1">シミュレーション完了！</h3>
                <p className="text-xs text-slate-500">左右にスライドしてBefore/Afterを比較できます</p>
              </div>

              {/* View toggle */}
              <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
                {(["slider", "before", "after"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setResultView(v)}
                    className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all"
                    style={{
                      background: resultView === v ? "#1e3a5f" : "transparent",
                      color: resultView === v ? "#fff" : "#64748b",
                    }}
                  >
                    {v === "slider" ? "比較" : v === "before" ? "Before" : "After"}
                  </button>
                ))}
              </div>

              {/* Image display */}
              {resultView === "slider" && (
                <BeforeAfterSlider before={beforeImage ?? imageDataUrl} after={generatedImage} />
              )}
              {resultView === "before" && (
                <div className="rounded-2xl overflow-hidden border border-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={beforeImage ?? imageDataUrl} alt="元の写真" className="w-full h-auto block" />
                  <p className="text-center text-xs text-slate-500 py-2 bg-slate-50">元の写真</p>
                </div>
              )}
              {resultView === "after" && (
                <div className="rounded-2xl overflow-hidden border border-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={generatedImage} alt="シミュレーション後" className="w-full h-auto block" />
                  <p className="text-center text-xs text-slate-500 py-2 bg-slate-50">シミュレーション後</p>
                </div>
              )}

              {/* Selected colors */}
              <div className="bg-slate-50 rounded-2xl p-4 space-y-2">
                <p className="text-xs font-bold text-slate-500 mb-2">選択したカラー</p>
                {hasWall && (
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md border border-black/10 shrink-0" style={{ background: wallColor1.hex }} />
                    <div>
                      <p className="text-xs text-slate-400">{hasTwoTone ? "外壁カラー 1" : "外壁カラー"}</p>
                      <p className="text-sm font-bold text-slate-800">{wallColor1.name} <span className="font-mono text-slate-400 text-xs">{wallColor1.hex}</span></p>
                    </div>
                  </div>
                )}
                {hasTwoTone && (
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md border border-black/10 shrink-0" style={{ background: wallColor2.hex }} />
                    <div>
                      <p className="text-xs text-slate-400">外壁カラー 2</p>
                      <p className="text-sm font-bold text-slate-800">{wallColor2.name} <span className="font-mono text-slate-400 text-xs">{wallColor2.hex}</span></p>
                    </div>
                  </div>
                )}
                {hasRoof && (
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md border border-black/10 shrink-0" style={{ background: roofColor.hex }} />
                    <div>
                      <p className="text-xs text-slate-400">屋根カラー</p>
                      <p className="text-sm font-bold text-slate-800">{roofColor.name} <span className="font-mono text-slate-400 text-xs">{roofColor.hex}</span></p>
                    </div>
                  </div>
                )}
                {hasTwoTone && (
                  <p className="text-xs text-slate-400 pt-1">
                    塗り分け：{TWO_TONE_METHODS.find((m) => m.id === twoToneMethod)?.label}
                  </p>
                )}
              </div>

              <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                シミュレーション画像は仕上がりのイメージです。実際の色味は、塗料、外壁材、光の当たり方、周辺環境などによって異なります。
              </p>

              {/* Action buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleRequestQuote}
                  className="w-full py-4 rounded-2xl font-extrabold text-base transition-all active:scale-[0.98]"
                  style={ctaStyle}
                >
                  無料見積もりを依頼する
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleSave}
                    className="py-3 rounded-2xl border-2 border-[#1e3a5f] text-[#1e3a5f] font-bold text-sm transition-all hover:bg-[#1e3a5f] hover:text-white"
                  >
                    画像を保存する
                  </button>
                  <button
                    onClick={() => {
                      setStep("color");
                      setGeneratedImage(null);
                    }}
                    className="py-3 rounded-2xl border-2 border-slate-200 text-slate-600 font-bold text-sm"
                  >
                    カラーを変更する
                  </button>
                </div>

                <button
                  onClick={() => {
                    setStep("upload");
                    setImageDataUrl(null);
                    setImageFile(null);
                    setGeneratedImage(null);
                    setSimulationId(null);
                  }}
                  className="w-full py-2.5 text-sm text-slate-400 hover:text-slate-600 transition-colors"
                >
                  別の写真で試す
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
