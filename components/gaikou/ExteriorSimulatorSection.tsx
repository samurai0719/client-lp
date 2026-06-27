"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera, Upload, Check, ChevronRight, ChevronLeft,
  Loader2, Download, RefreshCw, AlertCircle,
  Car, Layers, Sprout, Umbrella, ShieldCheck,
  TreeDeciduous, Home, ArrowUpRight, Package,
  HelpCircle, SlidersHorizontal, Sun, Sunset,
  type LucideIcon,
} from "lucide-react";
import SectionHeading from "./SectionHeading";
import SectionBackdrop from "./SectionBackdrop";

// ─── Step type ────────────────────────────────────────────────────

type Step = "upload" | "worktype" | "style" | "generate";

const STEP_LABEL: Record<Step, string> = {
  upload:   "写真を撮影",
  worktype: "工事内容を選択",
  style:    "デザインを選択",
  generate: "シミュレート",
};

// ─── Work types ───────────────────────────────────────────────────

type WorkType = { id: string; label: string; Icon: LucideIcon };
const WORK_TYPES: WorkType[] = [
  { id: "concrete",          label: "土間コンクリート",    Icon: Layers },
  { id: "parking-expansion", label: "駐車場の拡張",        Icon: Car },
  { id: "artificial-grass",  label: "人工芝・防草対策",    Icon: Sprout },
  { id: "carport",           label: "カーポート",          Icon: Umbrella },
  { id: "fence",             label: "目隠しフェンス",      Icon: ShieldCheck },
  { id: "garden-clearance",  label: "庭木・庭石の撤去",    Icon: TreeDeciduous },
  { id: "entrance",          label: "玄関アプローチ",      Icon: Home },
  { id: "slope-handrail",    label: "スロープ・手すり",    Icon: ArrowUpRight },
  { id: "gate-mailbox",      label: "門柱・宅配ボックス",  Icon: Package },
  { id: "other",             label: "その他",              Icon: HelpCircle },
];

// Work types where design style is relevant
const STYLE_APPLICABLE = new Set([
  "concrete", "parking-expansion", "carport", "fence", "entrance", "gate-mailbox",
]);

// ─── Fence location options ───────────────────────────────────────

const FENCE_LOCATION_OPTIONS = [
  { id: "road-side",       label: "道路側" },
  { id: "left-boundary",   label: "左側の隣地境界" },
  { id: "right-boundary",  label: "右側の隣地境界" },
  { id: "rear-boundary",   label: "庭の奥側" },
  { id: "surround-garden", label: "庭を囲う" },
  { id: "auto",            label: "おまかせ" },
];

// ─── Style options ────────────────────────────────────────────────

type StyleOption = { id: string; name: string; description: string; image: string; fallback: string };
const STYLE_OPTIONS: StyleOption[] = [
  { id: "simple-modern",   name: "シンプルモダン",  description: "白・グレー・黒を中心にした、すっきりとしたデザイン",     image: "/images/simulator/simple-modern.png",  fallback: "linear-gradient(135deg,#e8e8e8,#c0c0c0)" },
  { id: "japanese-modern", name: "和モダン",         description: "自然石・砂利・木目・植栽を取り入れた落ち着いたデザイン", image: "/images/simulator/japanese-modern.png", fallback: "linear-gradient(135deg,#c8a882,#8b7355)" },
  { id: "western",         name: "洋風",              description: "レンガ・乱形石・曲線を取り入れた温かみのあるデザイン",  image: "/images/simulator/western.png",         fallback: "linear-gradient(135deg,#d4956a,#b87040)" },
  { id: "natural",         name: "ナチュラル",         description: "木目・植栽・人工芝などを使った自然で明るいデザイン",   image: "/images/simulator/natural.png",         fallback: "linear-gradient(135deg,#7fad64,#5a8a45)" },
  { id: "luxury-modern",   name: "高級モダン",         description: "大判タイル・石材・間接照明を使った上質なデザイン",     image: "/images/simulator/luxury-modern.png",  fallback: "linear-gradient(135deg,#4a4a4a,#2a2a2a)" },
  { id: "resort",          name: "リゾート風",         description: "明るいタイル・植栽・照明を使った開放感のあるデザイン", image: "/images/simulator/resort.png",          fallback: "linear-gradient(135deg,#87ceeb,#5bb8a0)" },
  { id: "scandinavian",    name: "北欧風",             description: "明るい色合いと木目を組み合わせた柔らかなデザイン",     image: "/images/simulator/scandinavian.png",   fallback: "linear-gradient(135deg,#f0ebe0,#ddd5c5)" },
  { id: "auto",            name: "おまかせ",            description: "住宅の外観や周辺環境に合うデザインを自動で提案",      image: "/images/simulator/auto.png",            fallback: "linear-gradient(135deg,#2f7d5a,#1f4d3d)" },
];

const TIME_OPTIONS = [
  { id: "daytime", label: "昼間",               Icon: Sun },
  { id: "dusk",    label: "夕暮れ・ライトアップ", Icon: Sunset },
];

// ─── Helpers ──────────────────────────────────────────────────────

async function processImageFile(file: File): Promise<{ blob: Blob; url: string } | string> {
  const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/heic", "image/heif"];
  if (!ALLOWED_TYPES.includes(file.type) && !file.type.startsWith("image/"))
    return "対応していないファイル形式です（JPEG・PNG・WebP・HEIC）。";
  if (file.size > 50 * 1024 * 1024)
    return "ファイルサイズが大きすぎます（最大50MB）。";

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
  return { blob, url: URL.createObjectURL(blob) };
}

// ─── StyleCard ────────────────────────────────────────────────────

function StyleCard({ s, selected, onSelect }: { s: StyleOption; selected: boolean; onSelect: () => void }) {
  const [imgError, setImgError] = useState(false);
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative rounded-xl overflow-hidden border-2 text-left transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3d] ${
        selected ? "border-[#1f4d3d] bg-[#eaf3ee] shadow-md -translate-y-0.5" : "border-[#e7e3d8] bg-white hover:border-[#9bb3a8]"
      }`}
      aria-pressed={selected}
      aria-label={`${s.name}を選択`}
    >
      <div className="aspect-square w-full relative overflow-hidden">
        {imgError
          ? <div className="absolute inset-0" style={{ background: s.fallback }} />
          : <img src={s.image} alt={s.name} onError={() => setImgError(true)} className="absolute inset-0 w-full h-full object-cover" />
        }
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
      <img src={after} alt="シミュレーション後" className="absolute inset-0 w-full h-full object-cover" />
      <img src={before} alt="元の写真" className="absolute inset-0 w-full h-full object-cover"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} />
      <div className="absolute top-0 bottom-0 pointer-events-none" style={{ left: `${pos}%`, transform: "translateX(-50%)" }}>
        <div className="w-0.5 h-full bg-white shadow-lg" />
        <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-md">
          <SlidersHorizontal className="w-4 h-4 text-[#1f4d3d]" aria-hidden="true" />
        </div>
      </div>
      <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white bg-black/50 rounded px-1.5 py-0.5 pointer-events-none">Before</span>
      <span className="absolute bottom-2 right-2 text-[10px] font-bold text-white bg-[#1f4d3d]/80 rounded px-1.5 py-0.5 pointer-events-none">After</span>
      <input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(Number(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize" aria-label="Before/Afterスライダー" />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────

export default function ExteriorSimulatorSection() {
  const [step, setStep] = useState<Step>("upload");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);

  const [selectedWorkTypes, setSelectedWorkTypes] = useState<string[]>([]);
  const [fenceLocations, setFenceLocations] = useState<string[]>(["auto"]);
  const [useStyleForOther, setUseStyleForOther] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState("auto");
  const [selectedTime, setSelectedTime] = useState("daytime");

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState<"slider" | "before" | "after">("slider");
  const [remaining, setRemaining] = useState(3);
  const [error, setError] = useState<string | null>(null);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef   = useRef<HTMLInputElement>(null);

  // ── Derived: which work types require style selection ─────────
  const { shouldShowStyle, hasOnlyOther, visibleSteps } = useMemo(() => {
    const hasStyleApplicable = selectedWorkTypes.some((t) => STYLE_APPLICABLE.has(t));
    const onlyOther = selectedWorkTypes.length > 0 && !hasStyleApplicable && selectedWorkTypes.includes("other");
    const showStyle = hasStyleApplicable || (onlyOther && useStyleForOther);
    const steps: Step[] = showStyle
      ? ["upload", "worktype", "style", "generate"]
      : ["upload", "worktype", "generate"];
    return { shouldShowStyle: showStyle, hasOnlyOther: onlyOther, visibleSteps: steps };
  }, [selectedWorkTypes, useStyleForOther]);

  // ── Auto-reset style when style selector is toggled ───────────
  useEffect(() => {
    if (!shouldShowStyle) {
      setSelectedStyle("none");
    } else if (selectedStyle === "none") {
      setSelectedStyle("auto");
    }
  }, [shouldShowStyle, selectedStyle]);

  // ── Image processing ──────────────────────────────────────────
  const handleFile = useCallback(async (file: File) => {
    setError(null);
    const result = await processImageFile(file);
    if (typeof result === "string") { setError(result); return; }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(result.url);
    setCompressedBlob(result.blob);
    setStep("worktype");
  }, [previewUrl]);

  const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }, [handleFile]);

  // ── Work type toggle ──────────────────────────────────────────
  const toggleWorkType = (id: string) => {
    setSelectedWorkTypes((prev) => {
      const isRemoving = prev.includes(id);
      const next = isRemoving ? prev.filter((t) => t !== id) : [...prev, id];
      if (id === "fence" && isRemoving) setFenceLocations(["auto"]);
      if (id === "other" && isRemoving) setUseStyleForOther(false);
      return next;
    });
  };

  const toggleFenceLocation = (id: string) => {
    setFenceLocations((prev) => {
      if (id === "auto") return ["auto"];
      const withoutAuto = prev.filter((l) => l !== "auto");
      if (withoutAuto.includes(id)) {
        const next = withoutAuto.filter((l) => l !== id);
        return next.length === 0 ? ["auto"] : next;
      }
      return [...withoutAuto, id];
    });
  };

  // ── Generate ──────────────────────────────────────────────────
  const generate = useCallback(async () => {
    if (!compressedBlob || isGenerating) return;

    // Compute error fallback step from current state
    const hasStyleApplicable = selectedWorkTypes.some((t) => STYLE_APPLICABLE.has(t));
    const onlyOther = selectedWorkTypes.length > 0 && !hasStyleApplicable && selectedWorkTypes.includes("other");
    const styleVisible = hasStyleApplicable || (onlyOther && useStyleForOther);
    const errorStep: Step = styleVisible ? "style" : "worktype";

    setIsGenerating(true);
    setError(null);
    setStep("generate");

    try {
      const fd = new FormData();
      fd.append("image", compressedBlob, "image.jpg");
      fd.append("workTypes", JSON.stringify(selectedWorkTypes));
      fd.append("fenceLocations", JSON.stringify(fenceLocations));
      fd.append("style", selectedStyle);
      fd.append("timeOfDay", selectedTime);
      fd.append("autoMask", "true");

      const res  = await fetch("/api/exterior-simulator", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "エラーが発生しました。");
      setGeneratedUrl(data.image);
      if (data.remaining !== undefined) setRemaining(data.remaining);
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました。");
      setStep(errorStep);
    } finally {
      setIsGenerating(false);
    }
  }, [compressedBlob, isGenerating, selectedWorkTypes, fenceLocations, selectedStyle, selectedTime, useStyleForOther]);

  // ── Reset ─────────────────────────────────────────────────────
  const reset = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setCompressedBlob(null);
    setSelectedWorkTypes([]);
    setFenceLocations(["auto"]);
    setUseStyleForOther(false);
    setSelectedStyle("auto");
    setSelectedTime("daytime");
    setGeneratedUrl(null);
    setError(null);
    setStep("upload");
    setCompareMode("slider");
  }, [previewUrl]);

  const scrollToContact = () => {
    const el = document.getElementById("gaikou-contact") ?? document.querySelector("form");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  // ── Step indicator ────────────────────────────────────────────
  const renderStepIndicator = () => {
    const currentIdx = visibleSteps.indexOf(step);
    return (
      <div className="flex items-center justify-center gap-0 mb-8 md:mb-10 overflow-x-auto pb-1" aria-label="進行状況">
        {visibleSteps.map((s, idx) => {
          const done   = currentIdx > idx;
          const active = currentIdx === idx;
          return (
            <div key={s} className="flex items-center shrink-0">
              <div className="flex flex-col items-center gap-1">
                <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-colors ${
                  done ? "bg-[#1f4d3d] text-white" : active ? "bg-[#d9601a] text-white" : "bg-[#e7e3d8] text-[#9bb3a8]"
                }`}>
                  {done ? <Check className="w-3.5 h-3.5" aria-hidden="true" /> : idx + 1}
                </div>
                <span className={`text-[9px] sm:text-[10px] font-medium whitespace-nowrap ${
                  active ? "text-[#1f4d3d]" : done ? "text-[#2f7d5a]" : "text-[#9bb3a8]"
                }`}>
                  {STEP_LABEL[s]}
                </span>
              </div>
              {idx < visibleSteps.length - 1 && (
                <div className={`w-6 sm:w-10 h-px mx-1 mb-4 ${done ? "bg-[#1f4d3d]" : "bg-[#e7e3d8]"}`} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // ── Upload (step: "upload") ───────────────────────────────────
  const renderUpload = () => (
    <motion.div key="upload" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}>
      <h3 className="text-base sm:text-lg font-bold text-[#10302a] mb-1">外構・エクステリア写真を撮影またはアップロード</h3>
      <p className="text-xs sm:text-sm text-[#6b7f75] mb-5">アップロードされた写真は、シミュレーションとお見積もり対応の目的でのみ使用します。</p>

      <div className="border-2 border-dashed border-[#c8d8d0] rounded-2xl bg-[#f6f3ea]/60 p-8 text-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#eaf3ee] mx-auto mb-4">
          <Camera className="w-8 h-8 text-[#1f4d3d]" aria-hidden="true" />
        </div>
        <p className="font-bold text-[#10302a] mb-1">写真を撮影・選択</p>
        <p className="text-xs text-[#6b7f75] mb-5">スマホで撮った写真をそのままアップロードできます</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button type="button" onClick={() => cameraInputRef.current?.click()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#1f4d3d] text-white text-sm font-semibold hover:bg-[#2f7d5a] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3d]">
            <Camera className="w-4 h-4" aria-hidden="true" /> カメラで撮影
          </button>
          <button type="button" onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border-2 border-[#1f4d3d] text-[#1f4d3d] text-sm font-semibold hover:bg-[#eaf3ee] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3d]">
            <Upload className="w-4 h-4" aria-hidden="true" /> ファイルを選択
          </button>
        </div>
        <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="sr-only" onChange={onInputChange} aria-label="カメラで撮影" />
        <input ref={fileInputRef}   type="file" accept="image/*" className="sr-only" onChange={onInputChange} aria-label="ファイルを選択" />
      </div>

      {error && (
        <div role="alert" className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" /> {error}
        </div>
      )}
    </motion.div>
  );

  // ── Work type selection (step: "worktype") ────────────────────
  const renderWorktype = () => {
    const hasFence = selectedWorkTypes.includes("fence");
    return (
      <motion.div key="worktype" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}>
        {previewUrl && (
          <div className="rounded-xl overflow-hidden mb-5 relative">
            <img src={previewUrl} alt="アップロードした写真" className="w-full h-auto block" />
            <button type="button" onClick={() => setStep("upload")}
              className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/50 text-white text-xs hover:bg-black/70 transition-colors">
              <RefreshCw className="w-3 h-3" aria-hidden="true" /> 撮り直す
            </button>
          </div>
        )}

        <h3 className="text-base sm:text-lg font-bold text-[#10302a] mb-1">希望する工事内容を選択</h3>
        <p className="text-xs sm:text-sm text-[#6b7f75] mb-4">複数選択できます。</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
          {WORK_TYPES.map(({ id, label, Icon }) => {
            const sel = selectedWorkTypes.includes(id);
            return (
              <button key={id} type="button" onClick={() => toggleWorkType(id)} aria-pressed={sel}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3d] ${
                  sel ? "border-[#1f4d3d] bg-[#eaf3ee] text-[#1f4d3d]" : "border-[#e7e3d8] bg-white text-[#3d4a45] hover:border-[#9bb3a8]"
                }`}>
                <span className={`flex items-center justify-center w-7 h-7 rounded-full shrink-0 ${sel ? "bg-[#1f4d3d] text-white" : "bg-[#eaf3ee] text-[#1f4d3d]"}`}>
                  <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                </span>
                <span className="text-xs sm:text-sm">{label}</span>
                {sel && <Check className="w-4 h-4 ml-auto text-[#1f4d3d] shrink-0" aria-hidden="true" />}
              </button>
            );
          })}
        </div>

        {/* "その他" だけ選択時：デザインを使うか選択 */}
        {hasOnlyOther && (
          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer w-fit">
              <input
                type="checkbox"
                checked={useStyleForOther}
                onChange={(e) => setUseStyleForOther(e.target.checked)}
                className="w-4 h-4 accent-[#1f4d3d]"
              />
              <span className="text-sm text-[#3d4a45]">デザインの雰囲気も指定する</span>
            </label>
          </div>
        )}

        {/* Fence location selector */}
        {hasFence && (
          <div className="mb-4 rounded-xl border border-[#c8d8d0] bg-[#f6fbf8] p-4">
            <h4 className="text-sm font-bold text-[#10302a] mb-1">目隠しフェンスを設置したい場所</h4>
            <p className="text-xs text-[#6b7f75] mb-3">複数選択できます。</p>
            <div className="flex flex-wrap gap-2">
              {FENCE_LOCATION_OPTIONS.map(({ id, label }) => {
                const sel = fenceLocations.includes(id);
                return (
                  <button key={id} type="button" onClick={() => toggleFenceLocation(id)} aria-pressed={sel}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3d] ${
                      sel ? "border-[#1f4d3d] bg-[#1f4d3d] text-white" : "border-[#c8d8d0] bg-white text-[#3d4a45] hover:border-[#9bb3a8]"
                    }`}>
                    {sel && <Check className="w-3 h-3 shrink-0" aria-hidden="true" />}
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Time selection */}
        <h3 className="text-base sm:text-lg font-bold text-[#10302a] mb-1">時間帯</h3>
        <div className="flex gap-3 mb-6">
          {TIME_OPTIONS.map(({ id, label, Icon }) => (
            <button key={id} type="button" onClick={() => setSelectedTime(id)} aria-pressed={selectedTime === id}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3d] ${
                selectedTime === id ? "border-[#1f4d3d] bg-[#eaf3ee] text-[#1f4d3d]" : "border-[#e7e3d8] bg-white text-[#3d4a45] hover:border-[#9bb3a8]"
              }`}>
              <Icon className="w-4 h-4" aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Next button — changes based on whether style step is needed */}
        {shouldShowStyle ? (
          <button type="button" onClick={() => setStep("style")} className="gaikou-cta-btn">
            <span className="gaikou-cta-btn-inner">
              次へ：デザインを選択 <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </span>
          </button>
        ) : (
          <button type="button" onClick={generate} disabled={isGenerating} className="gaikou-cta-btn" aria-busy={isGenerating}>
            <span className="gaikou-cta-btn-inner">
              完成イメージを生成する <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </span>
          </button>
        )}
      </motion.div>
    );
  };

  // ── Style selection (step: "style") ───────────────────────────
  const renderStyle = () => (
    <motion.div key="style" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}>
      <h3 className="text-base sm:text-lg font-bold text-[#10302a] mb-1">どんな雰囲気にしますか？</h3>
      <p className="text-xs sm:text-sm text-[#6b7f75] mb-4">お好みの外構デザインを1つ選択してください。</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6">
        {STYLE_OPTIONS.map((s) => (
          <StyleCard key={s.id} s={s} selected={selectedStyle === s.id} onSelect={() => setSelectedStyle(s.id)} />
        ))}
      </div>

      {error && (
        <div role="alert" className="mb-4 flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" /> {error}
        </div>
      )}

      <div className="flex gap-3">
        <button type="button" onClick={() => setStep("worktype")}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 border-[#e7e3d8] text-[#6b7f75] text-sm font-semibold hover:border-[#9bb3a8] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3d]">
          <ChevronLeft className="w-4 h-4" aria-hidden="true" /> 戻る
        </button>
        <button type="button" onClick={generate} disabled={isGenerating} className="gaikou-cta-btn flex-1" aria-busy={isGenerating}>
          <span className="gaikou-cta-btn-inner">
            完成イメージを生成する <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </span>
        </button>
      </div>
    </motion.div>
  );

  // ── Generate / Result (step: "generate") ─────────────────────
  const renderGenerate = () => {
    const styleName = selectedStyle !== "none"
      ? STYLE_OPTIONS.find((s) => s.id === selectedStyle)?.name
      : null;

    return (
      <motion.div key="generate" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}>
        {isGenerating ? (
          <div className="text-center py-16" aria-live="polite" aria-busy="true">
            <Loader2 className="w-12 h-12 text-[#1f4d3d] animate-spin mx-auto mb-6" aria-hidden="true" />
            <p className="text-base font-bold text-[#10302a] mb-2">外構リフォーム後のイメージを作成しています</p>
            <p className="text-sm text-[#6b7f75]">通常30秒〜1分程度かかります</p>
          </div>
        ) : generatedUrl ? (
          <>
            {/* Selected works + style */}
            <div className="rounded-xl border border-[#c8d8d0] bg-[#f6fbf8] p-4 mb-4">
              {selectedWorkTypes.length > 0 && (
                <>
                  <p className="text-xs font-bold text-[#10302a] mb-1.5">選択した工事</p>
                  <ul className="space-y-1 mb-3">
                    {selectedWorkTypes.map((t) => {
                      const work = WORK_TYPES.find((w) => w.id === t);
                      return work ? (
                        <li key={t} className="flex items-center gap-2 text-xs text-[#3d4a45]">
                          <Check className="w-3.5 h-3.5 text-[#2f7d5a] shrink-0" aria-hidden="true" />
                          {work.label}
                          {t === "fence" && !fenceLocations.includes("auto") && fenceLocations.length > 0 && (
                            <span className="text-[#6b7f75]">
                              （{fenceLocations.map((l) => FENCE_LOCATION_OPTIONS.find((o) => o.id === l)?.label ?? l).join("・")}）
                            </span>
                          )}
                        </li>
                      ) : null;
                    })}
                  </ul>
                </>
              )}
              {styleName && (
                <p className="text-xs text-[#3d4a45]">
                  <span className="font-bold text-[#10302a]">デザイン：</span>{styleName}
                </p>
              )}
            </div>

            {/* Compare mode toggle */}
            <div className="flex gap-2 mb-3">
              {(["slider", "before", "after"] as const).map((m) => (
                <button key={m} type="button" onClick={() => setCompareMode(m)} aria-pressed={compareMode === m}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3d] ${
                    compareMode === m ? "bg-[#1f4d3d] text-white border-[#1f4d3d]" : "border-[#e7e3d8] text-[#3d4a45] hover:border-[#9bb3a8]"
                  }`}>
                  {m === "slider" ? "比較スライダー" : m === "before" ? "元の写真" : "完成イメージ"}
                </button>
              ))}
            </div>

            {/* Image */}
            <div className="rounded-xl overflow-hidden mb-4">
              {compareMode === "slider" && previewUrl && <BeforeAfterSlider before={previewUrl} after={generatedUrl} />}
              {compareMode === "before" && previewUrl && <img src={previewUrl} alt="元の写真" className="w-full block rounded-xl" />}
              {compareMode === "after" && <img src={generatedUrl} alt="完成イメージ" className="w-full block rounded-xl" />}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2 mb-6">
              <a href={generatedUrl} download="exterior-simulation.png"
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#e7e3d8] text-[#3d4a45] text-sm font-semibold hover:border-[#9bb3a8] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3d]"
                aria-label="完成イメージを保存">
                <Download className="w-4 h-4" aria-hidden="true" /> 画像を保存
              </a>
              <button type="button" onClick={generate} disabled={remaining <= 0 || isGenerating}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#e7e3d8] text-[#3d4a45] text-sm font-semibold hover:border-[#9bb3a8] disabled:opacity-40 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3d]">
                <RefreshCw className="w-4 h-4" aria-hidden="true" /> 再生成
              </button>
              <button type="button"
                onClick={() => { setGeneratedUrl(null); setStep(shouldShowStyle ? "style" : "worktype"); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#e7e3d8] text-[#3d4a45] text-sm font-semibold hover:border-[#9bb3a8] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3d]">
                {shouldShowStyle ? "デザインを変更して再生成" : "設定を変えて再生成"}
              </button>
              <button type="button" onClick={reset}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#e7e3d8] text-[#3d4a45] text-sm font-semibold hover:border-[#9bb3a8] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3d]">
                最初からやり直す
              </button>
            </div>

            {remaining <= 0 && <p className="text-xs text-[#d9601a] mb-4">生成回数の上限（3回）に達しました。</p>}

            {/* CTA */}
            <div className="rounded-2xl bg-[#eaf3ee] border border-[#c8d8d0] p-5 text-center mb-5">
              <p className="font-bold text-[#10302a] mb-3">このイメージで実際の費用を確認してみませんか？</p>
              <button type="button" onClick={scrollToContact} className="gaikou-cta-btn inline-block">
                <span className="gaikou-cta-btn-inner">
                  この内容で無料見積もりを依頼する <ChevronRight className="w-5 h-5" aria-hidden="true" />
                </span>
              </button>
            </div>

            <p className="text-[11px] text-[#9bb3a8] text-center leading-relaxed">
              この画像はシミュレーションによる完成イメージです。実際の施工可否、寸法、色、商品、費用を保証するものではありません。現地調査後に正式なプランをご提案します。
            </p>
          </>
        ) : null}
      </motion.div>
    );
  };

  // ── Main render ───────────────────────────────────────────────
  return (
    <section className="relative px-4 sm:px-6 py-16 md:py-24 overflow-hidden" id="exterior-simulator">
      <SectionBackdrop variant="wave" tone="beige" />
      <div className="relative z-10 max-w-3xl mx-auto">
        <SectionHeading
          eyebrow="SIMULATION"
          title="外構リフォームシミュレーター"
          description={"自宅の写真を撮るだけ。\n外構リフォーム後のイメージを確認できます。"}
        />
        <p className="mt-3 text-sm text-[#6b7f75] text-center leading-relaxed max-w-xl mx-auto">
          土間コンクリート、駐車場の拡張、人工芝、カーポート、目隠しフェンスなど、気になるリフォームを写真でシミュレーションできます。
        </p>

        <div className="mt-10 md:mt-14 bg-white rounded-2xl border border-[#e7e3d8] p-5 sm:p-7 shadow-sm">
          {renderStepIndicator()}

          <AnimatePresence mode="wait">
            {step === "upload"   && renderUpload()}
            {step === "worktype" && renderWorktype()}
            {step === "style"    && renderStyle()}
            {step === "generate" && renderGenerate()}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
