"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera, Upload, Check, ChevronRight, ChevronLeft,
  Paintbrush2, Eraser, RotateCcw, Minus, Plus,
  Loader2, Download, RefreshCw, AlertCircle,
  Car, Layers, Sprout, Umbrella, ShieldCheck,
  TreeDeciduous, Home, ArrowUpRight, Package,
  HelpCircle, CheckCircle2, SlidersHorizontal, Sun, Sunset,
  type LucideIcon,
} from "lucide-react";
import SectionHeading from "./SectionHeading";
import SectionBackdrop from "./SectionBackdrop";

// ─── Constants ────────────────────────────────────────────────────

type WorkType = { id: string; label: string; Icon: LucideIcon };
const WORK_TYPES: WorkType[] = [
  { id: "concrete",          label: "土間コンクリート",    Icon: Layers },
  { id: "parking-expansion", label: "駐車場の拡張",        Icon: Car },
  { id: "artificial-grass",  label: "人工芝・防草対策",   Icon: Sprout },
  { id: "carport",           label: "カーポート",          Icon: Umbrella },
  { id: "fence",             label: "目隠しフェンス",      Icon: ShieldCheck },
  { id: "garden-clearance",  label: "庭木・庭石の撤去",   Icon: TreeDeciduous },
  { id: "entrance",          label: "玄関アプローチ",      Icon: Home },
  { id: "slope-handrail",    label: "スロープ・手すり",   Icon: ArrowUpRight },
  { id: "gate-mailbox",      label: "門柱・宅配ボックス", Icon: Package },
  { id: "other",             label: "その他",              Icon: HelpCircle },
];

type StyleOption = {
  id: string; name: string; description: string;
  image: string; fallback: string;
};
const STYLE_OPTIONS: StyleOption[] = [
  { id: "simple-modern",  name: "シンプルモダン",   description: "白・グレー・黒を中心にした、すっきりとしたデザイン",        image: "/images/simulator/simple-modern.webp",  fallback: "linear-gradient(135deg,#e8e8e8,#c0c0c0)" },
  { id: "japanese-modern",name: "和モダン",          description: "自然石・砂利・木目・植栽を取り入れた落ち着いたデザイン",    image: "/images/simulator/japanese-modern.webp", fallback: "linear-gradient(135deg,#c8a882,#8b7355)" },
  { id: "western",        name: "洋風",              description: "レンガ・乱形石・曲線を取り入れた温かみのあるデザイン",       image: "/images/simulator/western.webp",         fallback: "linear-gradient(135deg,#d4956a,#b87040)" },
  { id: "natural",        name: "ナチュラル",         description: "木目・植栽・人工芝などを使った自然で明るいデザイン",        image: "/images/simulator/natural.webp",         fallback: "linear-gradient(135deg,#7fad64,#5a8a45)" },
  { id: "luxury-modern",  name: "高級モダン",         description: "大判タイル・石材・間接照明を使った上質なデザイン",          image: "/images/simulator/luxury-modern.webp",   fallback: "linear-gradient(135deg,#4a4a4a,#2a2a2a)" },
  { id: "resort",         name: "リゾート風",         description: "明るいタイル・植栽・照明を使った開放感のあるデザイン",      image: "/images/simulator/resort.webp",          fallback: "linear-gradient(135deg,#87ceeb,#5bb8a0)" },
  { id: "scandinavian",   name: "北欧風",             description: "明るい色合いと木目を組み合わせた柔らかなデザイン",          image: "/images/simulator/scandinavian.webp",    fallback: "linear-gradient(135deg,#f0ebe0,#ddd5c5)" },
  { id: "auto",           name: "AIにおまかせ",       description: "住宅の外観や周辺環境に合うデザインをAIが提案",              image: "/images/simulator/auto.webp",            fallback: "linear-gradient(135deg,#2f7d5a,#1f4d3d)" },
];

const TIME_OPTIONS = [
  { id: "daytime", label: "昼間",           Icon: Sun },
  { id: "dusk",    label: "夕暮れ・ライトアップ", Icon: Sunset },
];

const STEP_LABELS = ["写真を撮影", "工事内容を選択", "デザインを選択", "範囲を指定", "AI生成"];
const MAX_BRUSH = 80;
const MIN_BRUSH = 8;

// ─── Helpers ──────────────────────────────────────────────────────

async function processImageFile(file: File): Promise<{ blob: Blob; url: string; w: number; h: number } | string> {
  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type))
    return "対応していないファイル形式です（JPEG・PNG・WebP）。";
  if (file.size > 10 * 1024 * 1024)
    return "ファイルサイズが大きすぎます（最大10MB）。";

  const objUrl = URL.createObjectURL(file);
  const img = await new Promise<HTMLImageElement>((res, rej) => {
    const el = new window.Image();
    el.onload = () => res(el);
    el.onerror = () => rej(new Error("画像の読み込みに失敗しました。"));
    el.src = objUrl;
  });
  URL.revokeObjectURL(objUrl);

  if (img.naturalWidth < 100 || img.naturalHeight < 100)
    return "画像が小さすぎます。より大きな画像をご使用ください。";

  const MAX_DIM = 1536;
  let w = img.naturalWidth, h = img.naturalHeight;
  if (w > MAX_DIM || h > MAX_DIM) {
    const r = Math.min(MAX_DIM / w, MAX_DIM / h);
    w = Math.round(w * r); h = Math.round(h * r);
  }
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
  const blob = await new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), "image/jpeg", 0.88));
  const url = URL.createObjectURL(blob);
  return { blob, url, w, h };
}

// ─── StyleCard ────────────────────────────────────────────────────

function StyleCard({ s, selected, onSelect }: { s: StyleOption; selected: boolean; onSelect: () => void }) {
  const [imgError, setImgError] = useState(false);
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative rounded-xl overflow-hidden border-2 text-left transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3d] ${
        selected
          ? "border-[#1f4d3d] bg-[#eaf3ee] shadow-md -translate-y-0.5"
          : "border-[#e7e3d8] bg-white hover:border-[#9bb3a8]"
      }`}
      aria-pressed={selected}
      aria-label={`${s.name}を選択`}
    >
      <div className="aspect-square w-full relative overflow-hidden">
        {imgError ? (
          <div className="absolute inset-0" style={{ background: s.fallback }} />
        ) : (
          <img
            src={s.image}
            alt={s.name}
            onError={() => setImgError(true)}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </div>
      {selected && (
        <span className="absolute top-1.5 right-1.5 flex items-center justify-center w-5 h-5 rounded-full bg-[#1f4d3d] text-white">
          <Check className="w-3 h-3" aria-hidden="true" />
        </span>
      )}
      <div className="p-2 sm:p-2.5">
        <p className="text-[11px] sm:text-xs font-bold text-[#10302a] leading-snug">{s.name}</p>
        <p className="text-[10px] sm:text-[11px] text-[#6b7f75] leading-snug mt-0.5 hidden sm:block">{s.description}</p>
      </div>
    </button>
  );
}

// ─── Before/After Slider ─────────────────────────────────────────

function BeforeAfterSlider({ before, after }: { before: string; after: string }) {
  const [pos, setPos] = useState(50);
  return (
    <div className="relative w-full select-none overflow-hidden rounded-xl" style={{ aspectRatio: "1/1" }}>
      {/* After */}
      <img src={after} alt="AI生成後" className="absolute inset-0 w-full h-full object-cover" />
      {/* Before clip */}
      <img
        src={before}
        alt="元の写真"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      />
      {/* Divider */}
      <div className="absolute top-0 bottom-0 pointer-events-none" style={{ left: `${pos}%`, transform: "translateX(-50%)" }}>
        <div className="w-0.5 h-full bg-white shadow-lg" />
        <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-md">
          <SlidersHorizontal className="w-4 h-4 text-[#1f4d3d]" aria-hidden="true" />
        </div>
      </div>
      {/* Labels */}
      <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white bg-black/50 rounded px-1.5 py-0.5 pointer-events-none">Before</span>
      <span className="absolute bottom-2 right-2 text-[10px] font-bold text-white bg-[#1f4d3d]/80 rounded px-1.5 py-0.5 pointer-events-none">After</span>
      {/* Range input overlay */}
      <input
        type="range" min={0} max={100} value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
        aria-label="Before/Afterスライダー"
      />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────

export default function ExteriorSimulatorSection() {
  // ── Step & image state ───────────────────────────────────────
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [imgDimensions, setImgDimensions] = useState<{ w: number; h: number } | null>(null);

  // ── Selection state ───────────────────────────────────────────
  const [selectedWorkTypes, setSelectedWorkTypes] = useState<string[]>([]);
  const [selectedStyle, setSelectedStyle] = useState("auto");
  const [selectedTime, setSelectedTime] = useState("daytime");

  // ── Mask canvas state ─────────────────────────────────────────
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<"brush" | "eraser">("brush");
  const [brushSize, setBrushSize] = useState(30);
  const historyRef = useRef<ImageData[]>([]);
  const [canUndo, setCanUndo] = useState(false);
  const [showAutoMaskConfirm, setShowAutoMaskConfirm] = useState(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  // ── Generate state ────────────────────────────────────────────
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState<"slider" | "before" | "after">("slider");
  const [remaining, setRemaining] = useState(3);
  const [error, setError] = useState<string | null>(null);

  // ── File inputs ───────────────────────────────────────────────
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Canvas init when entering step 4 ─────────────────────────
  useEffect(() => {
    if (step !== 4) return;
    const canvas = canvasRef.current;
    if (!canvas || !imgDimensions) return;
    canvas.width = imgDimensions.w;
    canvas.height = imgDimensions.h;
    const ctx = canvas.getContext("2d");
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    historyRef.current = [];
    setCanUndo(false);
  }, [step, imgDimensions]);

  // ── Image processing ──────────────────────────────────────────
  const handleFile = useCallback(async (file: File) => {
    setError(null);
    const result = await processImageFile(file);
    if (typeof result === "string") { setError(result); return; }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(result.url);
    setCompressedBlob(result.blob);
    setImgDimensions({ w: result.w, h: result.h });
    setStep(2);
  }, [previewUrl]);

  const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }, [handleFile]);

  // ── Work type toggle ──────────────────────────────────────────
  const toggleWorkType = (id: string) => {
    setSelectedWorkTypes((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  // ── Canvas drawing ────────────────────────────────────────────
  const saveHistory = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const snap = ctx.getImageData(0, 0, canvas.width, canvas.height);
    historyRef.current = [...historyRef.current.slice(-19), snap];
    setCanUndo(true);
  }, []);

  const drawAt = useCallback((x: number, y: number, fromX?: number, fromY?: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / rect.width;
    const sy = canvas.height / rect.height;
    const cx = x * sx, cy = y * sy;

    ctx.globalCompositeOperation = tool === "eraser" ? "destination-out" : "source-over";
    if (tool === "brush") ctx.fillStyle = "rgba(34,197,94,0.55)";

    if (fromX !== undefined && fromY !== undefined) {
      const px = fromX * sx, py = fromY * sy;
      const dist = Math.hypot(cx - px, cy - py);
      const steps = Math.max(1, Math.ceil(dist / (brushSize * sx * 0.3)));
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const ix = px + (cx - px) * t, iy = py + (cy - py) * t;
        ctx.beginPath();
        ctx.arc(ix, iy, (brushSize * sx) / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      ctx.beginPath();
      ctx.arc(cx, cy, (brushSize * sx) / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [tool, brushSize]);

  const getCanvasPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    saveHistory();
    const { x, y } = getCanvasPos(e);
    lastPosRef.current = { x, y };
    drawAt(x, y);
    setIsDrawing(true);
  }, [saveHistory, drawAt]);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const { x, y } = getCanvasPos(e);
    drawAt(x, y, lastPosRef.current?.x, lastPosRef.current?.y);
    lastPosRef.current = { x, y };
  }, [isDrawing, drawAt]);

  const onPointerUp = useCallback(() => {
    setIsDrawing(false);
    lastPosRef.current = null;
  }, []);

  const undo = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || historyRef.current.length === 0) return;
    const prev = historyRef.current[historyRef.current.length - 1];
    historyRef.current = historyRef.current.slice(0, -1);
    ctx.putImageData(prev, 0, 0);
    setCanUndo(historyRef.current.length > 0);
  }, []);

  const resetCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    saveHistory();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, [saveHistory]);

  // ── Mask export ───────────────────────────────────────────────
  const exportMask = useCallback(async (): Promise<Blob | null> => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let hasPaint = false;
    for (let i = 3; i < imgData.data.length; i += 4) {
      if (imgData.data[i] > 10) { hasPaint = true; break; }
    }
    if (!hasPaint) return null;

    // White = preserve, transparent = edit
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = canvas.width; maskCanvas.height = canvas.height;
    const mCtx = maskCanvas.getContext("2d")!;
    mCtx.fillStyle = "white";
    mCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
    const mData = mCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
    for (let i = 0; i < imgData.data.length; i += 4) {
      if (imgData.data[i + 3] > 10) mData.data[i + 3] = 0; // transparent = edit
    }
    mCtx.putImageData(mData, 0, 0);
    return new Promise((res) => maskCanvas.toBlob((b) => res(b), "image/png"));
  }, []);

  // ── Generate ──────────────────────────────────────────────────
  const generate = useCallback(async (autoMask = false) => {
    if (!compressedBlob || isGenerating) return;
    setShowAutoMaskConfirm(false);
    setIsGenerating(true);
    setError(null);
    setStep(5);

    try {
      const maskBlob = autoMask ? null : await exportMask();
      const fd = new FormData();
      fd.append("image", compressedBlob, "image.jpg");
      if (maskBlob) fd.append("mask", maskBlob, "mask.png");
      fd.append("workTypes", JSON.stringify(selectedWorkTypes));
      fd.append("style", selectedStyle);
      fd.append("timeOfDay", selectedTime);
      fd.append("autoMask", autoMask ? "true" : "false");

      const res = await fetch("/api/exterior-simulator", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "エラーが発生しました。");
      setGeneratedUrl(data.image);
      if (data.remaining !== undefined) setRemaining(data.remaining);
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました。");
      setStep(4);
    } finally {
      setIsGenerating(false);
    }
  }, [compressedBlob, isGenerating, exportMask, selectedWorkTypes, selectedStyle, selectedTime]);

  const handleGenerateClick = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const imgData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
    let hasPaint = false;
    if (imgData) {
      for (let i = 3; i < imgData.data.length; i += 4) {
        if (imgData.data[i] > 10) { hasPaint = true; break; }
      }
    }
    if (!hasPaint) { setShowAutoMaskConfirm(true); return; }
    await generate(false);
  }, [generate]);

  // ── Reset ─────────────────────────────────────────────────────
  const reset = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setCompressedBlob(null);
    setImgDimensions(null);
    setSelectedWorkTypes([]);
    setSelectedStyle("auto");
    setSelectedTime("daytime");
    setGeneratedUrl(null);
    setError(null);
    setStep(1);
    setCompareMode("slider");
    historyRef.current = [];
    setCanUndo(false);
  }, [previewUrl]);

  const scrollToContact = () => {
    const el = document.getElementById("gaikou-contact") ?? document.querySelector("form");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  // ── Render: Step indicator ────────────────────────────────────
  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-0 mb-8 md:mb-10 overflow-x-auto pb-1" aria-label="進行状況">
      {STEP_LABELS.map((label, idx) => {
        const n = idx + 1;
        const done = step > n;
        const active = step === n || (step === 5 && n === 5);
        return (
          <div key={n} className="flex items-center shrink-0">
            <div className="flex flex-col items-center gap-1">
              <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-colors ${
                done ? "bg-[#1f4d3d] text-white"
                : active ? "bg-[#d9601a] text-white"
                : "bg-[#e7e3d8] text-[#9bb3a8]"
              }`}>
                {done ? <Check className="w-3.5 h-3.5" aria-hidden="true" /> : n}
              </div>
              <span className={`text-[9px] sm:text-[10px] font-medium whitespace-nowrap ${active ? "text-[#1f4d3d]" : done ? "text-[#2f7d5a]" : "text-[#9bb3a8]"}`}>
                {label}
              </span>
            </div>
            {idx < STEP_LABELS.length - 1 && (
              <div className={`w-6 sm:w-8 h-px mx-1 mb-4 ${done || (active && n < 5) ? "bg-[#1f4d3d]" : "bg-[#e7e3d8]"}`} />
            )}
          </div>
        );
      })}
    </div>
  );

  // ── Render: Step 1 ────────────────────────────────────────────
  const renderStep1 = () => (
    <motion.div key="step1" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}>
      <h3 className="text-base sm:text-lg font-bold text-[#10302a] mb-1">外構・エクステリア写真を撮影またはアップロード</h3>
      <p className="text-xs sm:text-sm text-[#6b7f75] mb-5">アップロードされた写真は、シミュレーションとお見積もり対応の目的でのみ使用します。</p>

      <div className="border-2 border-dashed border-[#c8d8d0] rounded-2xl bg-[#f6f3ea]/60 p-8 text-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#eaf3ee] mx-auto mb-4">
          <Camera className="w-8 h-8 text-[#1f4d3d]" aria-hidden="true" />
        </div>
        <p className="font-bold text-[#10302a] mb-1">写真を撮影・選択</p>
        <p className="text-xs text-[#6b7f75] mb-5">対応形式：JPEG・PNG・WebP（最大10MB）</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#1f4d3d] text-white text-sm font-semibold hover:bg-[#2f7d5a] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3d]"
          >
            <Camera className="w-4 h-4" aria-hidden="true" /> カメラで撮影
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border-2 border-[#1f4d3d] text-[#1f4d3d] text-sm font-semibold hover:bg-[#eaf3ee] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3d]"
          >
            <Upload className="w-4 h-4" aria-hidden="true" /> ファイルを選択
          </button>
        </div>

        <input ref={cameraInputRef} type="file" accept="image/png,image/jpeg,image/webp" capture="environment" className="sr-only" onChange={onInputChange} aria-label="カメラで撮影" />
        <input ref={fileInputRef}   type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={onInputChange} aria-label="ファイルを選択" />
      </div>

      {error && (
        <div role="alert" className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
          {error}
        </div>
      )}
    </motion.div>
  );

  // ── Render: Step 2 ────────────────────────────────────────────
  const renderStep2 = () => (
    <motion.div key="step2" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}>
      {previewUrl && (
        <div className="rounded-xl overflow-hidden mb-5 max-h-48 sm:max-h-64 relative">
          <img src={previewUrl} alt="アップロードした写真" className="w-full object-cover max-h-48 sm:max-h-64" />
          <button type="button" onClick={() => setStep(1)} className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/50 text-white text-xs hover:bg-black/70 transition-colors">
            <RefreshCw className="w-3 h-3" aria-hidden="true" /> 撮り直す
          </button>
        </div>
      )}

      <h3 className="text-base sm:text-lg font-bold text-[#10302a] mb-1">希望する工事内容を選択</h3>
      <p className="text-xs sm:text-sm text-[#6b7f75] mb-4">複数選択できます。</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
        {WORK_TYPES.map(({ id, label, Icon }) => {
          const sel = selectedWorkTypes.includes(id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => toggleWorkType(id)}
              aria-pressed={sel}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3d] ${
                sel ? "border-[#1f4d3d] bg-[#eaf3ee] text-[#1f4d3d]" : "border-[#e7e3d8] bg-white text-[#3d4a45] hover:border-[#9bb3a8]"
              }`}
            >
              <span className={`flex items-center justify-center w-7 h-7 rounded-full shrink-0 ${sel ? "bg-[#1f4d3d] text-white" : "bg-[#eaf3ee] text-[#1f4d3d]"}`}>
                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
              </span>
              <span className="text-xs sm:text-sm">{label}</span>
              {sel && <Check className="w-4 h-4 ml-auto text-[#1f4d3d] shrink-0" aria-hidden="true" />}
            </button>
          );
        })}
      </div>

      <h3 className="text-base sm:text-lg font-bold text-[#10302a] mb-1">時間帯</h3>
      <div className="flex gap-3 mb-6">
        {TIME_OPTIONS.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setSelectedTime(id)}
            aria-pressed={selectedTime === id}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3d] ${
              selectedTime === id ? "border-[#1f4d3d] bg-[#eaf3ee] text-[#1f4d3d]" : "border-[#e7e3d8] bg-white text-[#3d4a45] hover:border-[#9bb3a8]"
            }`}
          >
            <Icon className="w-4 h-4" aria-hidden="true" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setStep(3)}
        className="gaikou-cta-btn"
      >
        <span className="gaikou-cta-btn-inner">
          次へ：デザインを選択
          <ChevronRight className="w-5 h-5" aria-hidden="true" />
        </span>
      </button>
    </motion.div>
  );

  // ── Render: Step 3 ────────────────────────────────────────────
  const renderStep3 = () => (
    <motion.div key="step3" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}>
      <h3 className="text-base sm:text-lg font-bold text-[#10302a] mb-1">どんな雰囲気にしますか？</h3>
      <p className="text-xs sm:text-sm text-[#6b7f75] mb-4">お好みの外構デザインを1つ選択してください。</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6">
        {STYLE_OPTIONS.map((s) => (
          <StyleCard
            key={s.id}
            s={s}
            selected={selectedStyle === s.id}
            onSelect={() => setSelectedStyle(s.id)}
          />
        ))}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setStep(2)}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 border-[#e7e3d8] text-[#6b7f75] text-sm font-semibold hover:border-[#9bb3a8] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3d]"
        >
          <ChevronLeft className="w-4 h-4" aria-hidden="true" /> 戻る
        </button>
        <button
          type="button"
          onClick={() => setStep(4)}
          disabled={!selectedStyle}
          className="gaikou-cta-btn flex-1"
        >
          <span className="gaikou-cta-btn-inner">
            次へ：範囲を指定
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </span>
        </button>
      </div>
    </motion.div>
  );

  // ── Render: Step 4 ────────────────────────────────────────────
  const renderStep4 = () => (
    <motion.div key="step4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}>
      <h3 className="text-base sm:text-lg font-bold text-[#10302a] mb-1">変更する範囲を指定</h3>
      <p className="text-xs sm:text-sm text-[#6b7f75] mb-4">指またはマウスで変更したい外構部分を塗ってください。塗らなくてもAIに自動判定させることもできます。</p>

      {error && (
        <div role="alert" className="mb-4 flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
          {error}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <button
          type="button"
          onClick={() => setTool("brush")}
          aria-pressed={tool === "brush"}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3d] ${tool === "brush" ? "bg-[#1f4d3d] text-white border-[#1f4d3d]" : "border-[#e7e3d8] text-[#3d4a45] hover:border-[#9bb3a8]"}`}
        >
          <Paintbrush2 className="w-3.5 h-3.5" aria-hidden="true" /> ブラシ
        </button>
        <button
          type="button"
          onClick={() => setTool("eraser")}
          aria-pressed={tool === "eraser"}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3d] ${tool === "eraser" ? "bg-[#1f4d3d] text-white border-[#1f4d3d]" : "border-[#e7e3d8] text-[#3d4a45] hover:border-[#9bb3a8]"}`}
        >
          <Eraser className="w-3.5 h-3.5" aria-hidden="true" /> 消しゴム
        </button>
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            type="button"
            onClick={() => setBrushSize((s) => Math.max(MIN_BRUSH, s - 8))}
            className="flex items-center justify-center w-7 h-7 rounded-lg border border-[#e7e3d8] text-[#3d4a45] hover:border-[#9bb3a8] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3d]"
            aria-label="ブラシサイズを小さく"
          >
            <Minus className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
          <span className="text-xs text-[#6b7f75] w-8 text-center">{brushSize}</span>
          <button
            type="button"
            onClick={() => setBrushSize((s) => Math.min(MAX_BRUSH, s + 8))}
            className="flex items-center justify-center w-7 h-7 rounded-lg border border-[#e7e3d8] text-[#3d4a45] hover:border-[#9bb3a8] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3d]"
            aria-label="ブラシサイズを大きく"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
        <button
          type="button"
          onClick={undo}
          disabled={!canUndo}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#e7e3d8] text-[#3d4a45] disabled:opacity-40 hover:border-[#9bb3a8] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3d]"
          aria-label="元に戻す"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" /> 戻す
        </button>
        <button
          type="button"
          onClick={resetCanvas}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#e7e3d8] text-[#3d4a45] hover:border-[#9bb3a8] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3d]"
          aria-label="全てリセット"
        >
          リセット
        </button>
      </div>

      {/* Canvas */}
      <div ref={imageContainerRef} className="relative rounded-xl overflow-hidden border border-[#e7e3d8] mb-4 touch-none">
        {previewUrl && (
          <img src={previewUrl} alt="アップロードした写真" className="w-full block" draggable={false} />
        )}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ cursor: tool === "brush" ? "crosshair" : "cell", touchAction: "none" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          aria-label="変更範囲を指定するキャンバス"
        />
      </div>

      <p className="text-[11px] text-[#9bb3a8] mb-4 text-center">緑色で塗られた部分がリフォームされます</p>

      {/* Auto mask confirm */}
      {showAutoMaskConfirm && (
        <div role="dialog" aria-modal="true" aria-label="変更範囲の確認" className="mb-4 rounded-xl border border-[#e7e3d8] bg-[#f9f7f1] p-4">
          <p className="text-sm font-semibold text-[#10302a] mb-3">変更範囲が指定されていません。AIに変更範囲を自動判定させますか？</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => generate(true)}
              className="flex-1 py-2.5 rounded-xl bg-[#1f4d3d] text-white text-sm font-semibold hover:bg-[#2f7d5a] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3d]"
            >
              AIに自動判定させる
            </button>
            <button
              type="button"
              onClick={() => setShowAutoMaskConfirm(false)}
              className="flex-1 py-2.5 rounded-xl border-2 border-[#e7e3d8] text-[#6b7f75] text-sm font-semibold hover:border-[#9bb3a8] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3d]"
            >
              範囲指定へ戻る
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setStep(3)}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 border-[#e7e3d8] text-[#6b7f75] text-sm font-semibold hover:border-[#9bb3a8] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3d]"
        >
          <ChevronLeft className="w-4 h-4" aria-hidden="true" /> 戻る
        </button>
        <button
          type="button"
          onClick={handleGenerateClick}
          disabled={isGenerating}
          className="gaikou-cta-btn flex-1"
          aria-busy={isGenerating}
        >
          <span className="gaikou-cta-btn-inner">
            完成イメージを生成する
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </span>
        </button>
      </div>
    </motion.div>
  );

  // ── Render: Step 5 (generating + result) ─────────────────────
  const renderStep5 = () => (
    <motion.div key="step5" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}>
      {isGenerating ? (
        <div className="text-center py-16" aria-live="polite" aria-busy="true">
          <div className="flex items-center justify-center mb-6">
            <Loader2 className="w-12 h-12 text-[#1f4d3d] animate-spin" aria-hidden="true" />
          </div>
          <p className="text-base font-bold text-[#10302a] mb-2">外構リフォーム後のイメージを作成しています</p>
          <p className="text-sm text-[#6b7f75]">通常30秒〜1分程度かかります</p>
        </div>
      ) : generatedUrl ? (
        <>
          {/* Summary */}
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedWorkTypes.length > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#eaf3ee] text-[#1f4d3d] text-xs font-semibold">
                <Check className="w-3 h-3" /> {selectedWorkTypes.map((t) => WORK_TYPES.find((w) => w.id === t)?.label).filter(Boolean).join("・")}
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#eaf3ee] text-[#1f4d3d] text-xs font-semibold">
              {STYLE_OPTIONS.find((s) => s.id === selectedStyle)?.name ?? selectedStyle}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#eaf3ee] text-[#1f4d3d] text-xs font-semibold">
              {TIME_OPTIONS.find((t) => t.id === selectedTime)?.label}
            </span>
          </div>

          {/* Compare mode */}
          <div className="flex gap-2 mb-3">
            {(["slider", "before", "after"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setCompareMode(m)}
                aria-pressed={compareMode === m}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3d] ${compareMode === m ? "bg-[#1f4d3d] text-white border-[#1f4d3d]" : "border-[#e7e3d8] text-[#3d4a45] hover:border-[#9bb3a8]"}`}
              >
                {m === "slider" ? "比較スライダー" : m === "before" ? "元の写真" : "完成イメージ"}
              </button>
            ))}
          </div>

          {/* Image display */}
          <div className="rounded-xl overflow-hidden mb-4">
            {compareMode === "slider" && previewUrl && (
              <BeforeAfterSlider before={previewUrl} after={generatedUrl} />
            )}
            {compareMode === "before" && previewUrl && (
              <img src={previewUrl} alt="元の写真" className="w-full block rounded-xl" />
            )}
            {compareMode === "after" && (
              <img src={generatedUrl} alt="AI生成完成イメージ" className="w-full block rounded-xl" />
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 mb-6">
            <a
              href={generatedUrl}
              download="exterior-simulation.png"
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#e7e3d8] text-[#3d4a45] text-sm font-semibold hover:border-[#9bb3a8] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3d]"
              aria-label="完成イメージを保存"
            >
              <Download className="w-4 h-4" aria-hidden="true" /> 画像を保存
            </a>
            <button
              type="button"
              onClick={() => generate(false)}
              disabled={remaining <= 0 || isGenerating}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#e7e3d8] text-[#3d4a45] text-sm font-semibold hover:border-[#9bb3a8] disabled:opacity-40 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3d]"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" /> 再生成
            </button>
            <button
              type="button"
              onClick={() => { setGeneratedUrl(null); setStep(3); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#e7e3d8] text-[#3d4a45] text-sm font-semibold hover:border-[#9bb3a8] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3d]"
            >
              デザインを変更して再生成
            </button>
            <button
              type="button"
              onClick={reset}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#e7e3d8] text-[#3d4a45] text-sm font-semibold hover:border-[#9bb3a8] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3d]"
            >
              最初からやり直す
            </button>
          </div>

          {remaining <= 0 && (
            <p className="text-xs text-[#d9601a] mb-4">生成回数の上限（3回）に達しました。</p>
          )}

          {/* CTA */}
          <div className="rounded-2xl bg-[#eaf3ee] border border-[#c8d8d0] p-5 text-center mb-5">
            <p className="font-bold text-[#10302a] mb-3">このイメージで実際の費用を確認してみませんか？</p>
            <button
              type="button"
              onClick={scrollToContact}
              className="gaikou-cta-btn inline-block"
            >
              <span className="gaikou-cta-btn-inner">
                この内容で無料見積もりを依頼する
                <ChevronRight className="w-5 h-5" aria-hidden="true" />
              </span>
            </button>
          </div>

          {/* Disclaimer */}
          <p className="text-[11px] text-[#9bb3a8] text-center leading-relaxed">
            この画像はAIによる完成イメージです。実際の施工可否、寸法、色、商品、費用を保証するものではありません。現地調査後に正式なプランをご提案します。
          </p>
        </>
      ) : error ? (
        <div className="text-center py-10">
          <div role="alert" className="inline-flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 text-left mb-6 max-w-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
            {error}
          </div>
          <div className="flex justify-center gap-3">
            <button type="button" onClick={() => setStep(4)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-[#e7e3d8] text-[#6b7f75] text-sm font-semibold hover:border-[#9bb3a8] transition-colors">
              <ChevronLeft className="w-4 h-4" /> 戻る
            </button>
          </div>
        </div>
      ) : null}
    </motion.div>
  );

  // ── Main render ───────────────────────────────────────────────
  return (
    <section className="relative px-4 sm:px-6 py-16 md:py-24 overflow-hidden" id="exterior-simulator">
      <SectionBackdrop variant="wave" tone="beige" />
      <div className="relative z-10 max-w-3xl mx-auto">
        <SectionHeading
          eyebrow="AI SIMULATION"
          title="AI外構リフォームシミュレーター"
          description={"自宅の写真を撮るだけ。\n外構リフォーム後のイメージをAIで確認できます。"}
        />
        <p className="mt-3 text-sm text-[#6b7f75] text-center leading-relaxed max-w-xl mx-auto">
          土間コンクリート、駐車場の拡張、人工芝、カーポート、目隠しフェンスなど、気になるリフォームを写真でシミュレーションできます。
        </p>

        <div className="mt-10 md:mt-14 bg-white rounded-2xl border border-[#e7e3d8] p-5 sm:p-7 shadow-sm">
          {renderStepIndicator()}

          <AnimatePresence mode="wait">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
            {step === 5 && renderStep5()}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
