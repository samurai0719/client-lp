"use client";

// 新築外構シミュレーター。
// 更地・建築中の写真からは「新築住宅＋外構」をセットで、
// 建物完成済みの写真からは外構のみを生成する。
// UI・画像処理はリフォームLPのシミュレーター（components/gaikou/ExteriorSimulatorSection.tsx）を踏襲。

import { useState, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera, Upload, Check, ChevronRight, ChevronLeft,
  Loader2, Download, RefreshCw, AlertCircle,
  Layers, Umbrella, Package, Footprints, ShieldCheck,
  Sprout, TreeDeciduous, Home, LandPlot, House,
  SlidersHorizontal, Sun, Sunset,
  type LucideIcon,
} from "lucide-react";
import NeSectionHeading from "./NeSectionHeading";
import BeforeAfterIllust from "./svg/BeforeAfterIllust";
import {
  calculateNewExteriorSimulatorEstimate,
  NEW_EXTERIOR_SIMULATOR_ESTIMATE_STORAGE_KEY,
} from "@/lib/calculate-exterior-estimate";
import type { CarCount } from "@/config/exterior-pricing";
import { buildDiagnosisHref } from "./utm";

const SIMULATOR_FEATURES = [
  "更地からでも完成イメージを確認",
  "選択した工事内容から概算費用を算出",
  "そのまま無料見積もりを依頼可能",
];

// ─── Step type ────────────────────────────────────────────────────

type Step = "upload" | "worktype" | "style" | "generate";

const STEP_LABEL: Record<Step, string> = {
  upload:   "写真を撮影",
  worktype: "工事内容を選択",
  style:    "デザインを選択",
  generate: "シミュレート",
};

// ─── Site phase（敷地の状態） ─────────────────────────────────────

type SitePhase = "vacant" | "built";

const SITE_PHASE_OPTIONS: Array<{ id: SitePhase; label: string; description: string; Icon: LucideIcon }> = [
  { id: "vacant", label: "更地・建築中", description: "新築の建物と外構をセットで生成します", Icon: LandPlot },
  { id: "built",  label: "建物は完成している", description: "建物はそのままに外構だけ生成します", Icon: House },
];

// ─── Work types ───────────────────────────────────────────────────

type WorkType = { id: string; label: string; Icon: LucideIcon };
const WORK_TYPES: WorkType[] = [
  { id: "full-exterior",     label: "外構一式（おまかせ）", Icon: Home },
  { id: "parking-concrete",  label: "駐車場コンクリート",   Icon: Layers },
  { id: "carport",           label: "カーポート",           Icon: Umbrella },
  { id: "gate-mailbox",      label: "門柱・ポスト",         Icon: Package },
  { id: "entrance",          label: "アプローチ",           Icon: Footprints },
  { id: "fence",             label: "フェンス・目隠し",     Icon: ShieldCheck },
  { id: "artificial-grass",  label: "人工芝・庭",           Icon: Sprout },
  { id: "planting",          label: "植栽",                 Icon: TreeDeciduous },
];

const PARKING_WORK_IDS = ["parking-concrete", "carport"];

const PARKING_CAR_OPTIONS: Array<{ value: CarCount | null; label: string }> = [
  { value: 1, label: "1台分" },
  { value: 2, label: "2台分" },
  { value: 3, label: "3台分以上" },
  { value: null, label: "まだ決めていない" },
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
  { id: "auto",            name: "おまかせ",            description: "敷地や周辺環境に合うデザインを自動で提案",            image: "/images/simulator/auto.png",            fallback: "linear-gradient(135deg,#6a7c50,#3f4d33)" },
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
      className={`relative rounded-xl overflow-hidden border-2 text-left transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3f4d33] ${
        selected ? "border-[#3f4d33] bg-[#edeadd] shadow-md -translate-y-0.5" : "border-[#e2dcc9] bg-white hover:border-[#a8a68d]"
      }`}
      aria-pressed={selected}
      aria-label={`${s.name}を選択`}
    >
      <div className="aspect-square w-full relative overflow-hidden">
        {imgError
          ? <div className="absolute inset-0" style={{ background: s.fallback }} />
          // eslint-disable-next-line @next/next/no-img-element -- 小さなサムネイルのため最適化不要
          : <img src={s.image} alt={s.name} onError={() => setImgError(true)} className="absolute inset-0 w-full h-full object-cover" />
        }
      </div>
      {selected && (
        <span className="absolute top-1.5 right-1.5 flex items-center justify-center w-5 h-5 rounded-full bg-[#3f4d33] text-white">
          <Check className="w-3 h-3" aria-hidden="true" />
        </span>
      )}
      <div className="p-2 sm:p-2.5">
        <p className="text-[12px] sm:text-[13px] font-bold text-[#2f3527] leading-snug">{s.name}</p>
        <p className="text-[11px] sm:text-[12px] text-[#6f705f] leading-snug mt-0.5 hidden sm:block">{s.description}</p>
      </div>
    </button>
  );
}

// ─── Before/After Slider ─────────────────────────────────────────

function BeforeAfterSlider({ before, after }: { before: string; after: string }) {
  const [pos, setPos] = useState(50);
  return (
    <div className="relative w-full select-none overflow-hidden rounded-xl" style={{ aspectRatio: "1/1" }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- 生成画像(data URL)のため next/image 非対応 */}
      <img src={after} alt="シミュレーション後" className="absolute inset-0 w-full h-full object-cover" />
      {/* eslint-disable-next-line @next/next/no-img-element -- 生成画像(data URL)のため next/image 非対応 */}
      <img src={before} alt="元の写真" className="absolute inset-0 w-full h-full object-cover"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} />
      <div className="absolute top-0 bottom-0 pointer-events-none" style={{ left: `${pos}%`, transform: "translateX(-50%)" }}>
        <div className="w-0.5 h-full bg-white shadow-lg" />
        <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-md">
          <SlidersHorizontal className="w-4 h-4 text-[#3f4d33]" aria-hidden="true" />
        </div>
      </div>
      <span className="absolute bottom-2 left-2 text-[11px] font-bold text-white bg-black/50 rounded px-1.5 py-0.5 pointer-events-none">Before</span>
      <span className="absolute bottom-2 right-2 text-[11px] font-bold text-white bg-[#3f4d33]/80 rounded px-1.5 py-0.5 pointer-events-none">After</span>
      <input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(Number(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize" aria-label="Before/Afterスライダー" />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────

export default function NewExteriorSimulatorSection() {
  const [step, setStep] = useState<Step>("upload");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);

  const [sitePhase, setSitePhase] = useState<SitePhase>("vacant");
  const [selectedWorkTypes, setSelectedWorkTypes] = useState<string[]>([]);
  const [parkingCars, setParkingCars] = useState<CarCount | null>(null);
  const [selectedStyle, setSelectedStyle] = useState("auto");
  const [selectedTime, setSelectedTime] = useState("daytime");

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState<"slider" | "before" | "after">("slider");
  const [remaining, setRemaining] = useState(3);
  const [error, setError] = useState<string | null>(null);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef   = useRef<HTMLInputElement>(null);

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
      if (isRemoving && PARKING_WORK_IDS.includes(id) && !next.some((t) => PARKING_WORK_IDS.includes(t))) {
        setParkingCars(null);
      }
      return next;
    });
  };

  // ── Generate ──────────────────────────────────────────────────
  const generate = useCallback(async () => {
    if (!compressedBlob || isGenerating) return;

    setIsGenerating(true);
    setError(null);
    setStep("generate");

    try {
      const fd = new FormData();
      fd.append("image", compressedBlob, "image.jpg");
      fd.append("sitePhase", sitePhase);
      fd.append("workTypes", JSON.stringify(selectedWorkTypes));
      fd.append("style", selectedStyle);
      fd.append("timeOfDay", selectedTime);

      const res  = await fetch("/api/new-exterior-simulator", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "エラーが発生しました。");
      setGeneratedUrl(data.image);
      if (data.remaining !== undefined) setRemaining(data.remaining);
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました。");
      setStep("style");
    } finally {
      setIsGenerating(false);
    }
  }, [compressedBlob, isGenerating, sitePhase, selectedWorkTypes, selectedStyle, selectedTime]);

  // ── Reset ─────────────────────────────────────────────────────
  const reset = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setCompressedBlob(null);
    setSitePhase("vacant");
    setSelectedWorkTypes([]);
    setParkingCars(null);
    setSelectedStyle("auto");
    setSelectedTime("daytime");
    setGeneratedUrl(null);
    setError(null);
    setStep("upload");
    setCompareMode("slider");
  }, [previewUrl]);

  // 選択された工事内容からの概算価格（標準条件・税込の参考価格）
  const estimate = useMemo(
    () => calculateNewExteriorSimulatorEstimate(selectedWorkTypes, { parkingCars }),
    [selectedWorkTypes, parkingCars]
  );

  // 概算価格を診断フォームへ引き継いでから遷移する
  const requestQuote = () => {
    try {
      if (estimate) {
        sessionStorage.setItem(
          NEW_EXTERIOR_SIMULATOR_ESTIMATE_STORAGE_KEY,
          JSON.stringify({ label: estimate.label, works: estimate.works, at: Date.now() })
        );
      }
    } catch {
      // ストレージ不可の環境でも遷移は妨げない
    }
    window.location.href = buildDiagnosisHref();
  };

  const visibleSteps: Step[] = ["upload", "worktype", "style", "generate"];

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
                <div className={`flex items-center justify-center w-7 h-7 rounded-full text-[13px] font-bold transition-colors ${
                  done ? "bg-[#3f4d33] text-white" : active ? "bg-[#b0502f] text-white" : "bg-[#e2dcc9] text-[#a8a68d]"
                }`}>
                  {done ? <Check className="w-3.5 h-3.5" aria-hidden="true" /> : idx + 1}
                </div>
                <span className={`text-[9px] sm:text-[11px] font-medium whitespace-nowrap ${
                  active ? "text-[#3f4d33]" : done ? "text-[#6a7c50]" : "text-[#a8a68d]"
                }`}>
                  {STEP_LABEL[s]}
                </span>
              </div>
              {idx < visibleSteps.length - 1 && (
                <div className={`w-6 sm:w-10 h-px mx-1 mb-4 ${done ? "bg-[#3f4d33]" : "bg-[#e2dcc9]"}`} />
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
      <h3 className="text-base sm:text-lg font-bold text-[#2f3527] mb-1">土地・お住まいの写真を撮影またはアップロード</h3>
      <p className="text-[13px] sm:text-[15px] text-[#6f705f] mb-4">
        更地や建築中の写真でもOK。アップロードされた写真は、シミュレーションとお見積もり対応の目的でのみ使用します。
      </p>

      {/* 敷地の状態 */}
      <div className="grid sm:grid-cols-2 gap-2.5 mb-5">
        {SITE_PHASE_OPTIONS.map(({ id, label, description, Icon }) => {
          const sel = sitePhase === id;
          return (
            <button key={id} type="button" onClick={() => setSitePhase(id)} aria-pressed={sel}
              className={`flex items-start gap-2.5 rounded-xl border-2 px-3.5 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3f4d33] ${
                sel ? "border-[#3f4d33] bg-[#edeadd]" : "border-[#e2dcc9] bg-white hover:border-[#a8a68d]"
              }`}>
              <span className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${sel ? "bg-[#3f4d33] text-white" : "bg-[#edeadd] text-[#3f4d33]"}`}>
                <Icon className="w-4 h-4" aria-hidden="true" />
              </span>
              <span>
                <span className={`block text-[14px] sm:text-[15px] font-bold ${sel ? "text-[#2f3527]" : "text-[#45463a]"}`}>{label}</span>
                <span className="block text-[12px] text-[#6f705f] mt-0.5">{description}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="border-2 border-dashed border-[#d5cfb8] rounded-2xl bg-[#f6f3ea]/60 p-8 text-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#edeadd] mx-auto mb-4">
          <Camera className="w-8 h-8 text-[#3f4d33]" aria-hidden="true" />
        </div>
        <p className="font-bold text-[#2f3527] mb-1">写真を撮影・選択</p>
        <p className="text-[13px] text-[#6f705f] mb-5">スマホで撮った写真をそのままアップロードできます</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button type="button" onClick={() => cameraInputRef.current?.click()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#3f4d33] text-white text-[15px] font-semibold hover:bg-[#6a7c50] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3f4d33]">
            <Camera className="w-4 h-4" aria-hidden="true" /> カメラで撮影
          </button>
          <button type="button" onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border-2 border-[#3f4d33] text-[#3f4d33] text-[15px] font-semibold hover:bg-[#edeadd] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3f4d33]">
            <Upload className="w-4 h-4" aria-hidden="true" /> ファイルを選択
          </button>
        </div>
        <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="sr-only" onChange={onInputChange} aria-label="カメラで撮影" />
        <input ref={fileInputRef}   type="file" accept="image/*" className="sr-only" onChange={onInputChange} aria-label="ファイルを選択" />
      </div>

      {error && (
        <div role="alert" className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-[15px] text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" /> {error}
        </div>
      )}
    </motion.div>
  );

  // ── Work type selection (step: "worktype") ────────────────────
  const renderWorktype = () => {
    const hasParkingWork = selectedWorkTypes.some((t) => PARKING_WORK_IDS.includes(t));
    return (
      <motion.div key="worktype" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}>
        {previewUrl && (
          <div className="rounded-xl overflow-hidden mb-5 relative">
            {/* eslint-disable-next-line @next/next/no-img-element -- ローカルObjectURLのため next/image 非対応 */}
            <img src={previewUrl} alt="アップロードした写真" className="w-full h-auto block" />
            <button type="button" onClick={() => setStep("upload")}
              className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/50 text-white text-[13px] hover:bg-black/70 transition-colors">
              <RefreshCw className="w-3 h-3" aria-hidden="true" /> 撮り直す
            </button>
          </div>
        )}

        <h3 className="text-base sm:text-lg font-bold text-[#2f3527] mb-1">希望する工事内容を選択</h3>
        <p className="text-[13px] sm:text-[15px] text-[#6f705f] mb-4">複数選択できます。迷ったら「外構一式（おまかせ）」を選んでください。</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
          {WORK_TYPES.map(({ id, label, Icon }) => {
            const sel = selectedWorkTypes.includes(id);
            return (
              <button key={id} type="button" onClick={() => toggleWorkType(id)} aria-pressed={sel}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left text-[15px] font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3f4d33] ${
                  sel ? "border-[#3f4d33] bg-[#edeadd] text-[#3f4d33]" : "border-[#e2dcc9] bg-white text-[#45463a] hover:border-[#a8a68d]"
                }`}>
                <span className={`flex items-center justify-center w-7 h-7 rounded-full shrink-0 ${sel ? "bg-[#3f4d33] text-white" : "bg-[#edeadd] text-[#3f4d33]"}`}>
                  <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                </span>
                <span className="text-[13px] sm:text-[15px]">{label}</span>
                {sel && <Check className="w-4 h-4 ml-auto text-[#3f4d33] shrink-0" aria-hidden="true" />}
              </button>
            );
          })}
        </div>

        {/* Parking car count selector */}
        {hasParkingWork && (
          <div className="mb-4 rounded-xl border border-[#d5cfb8] bg-[#f7f4e8] p-4">
            <h4 className="text-[15px] font-bold text-[#2f3527] mb-1">駐車場・カーポートの台数</h4>
            <p className="text-[13px] text-[#6f705f] mb-3">分かる範囲で選択してください。概算費用に反映されます。</p>
            <div className="flex flex-wrap gap-2">
              {PARKING_CAR_OPTIONS.map(({ value, label }) => {
                const sel = parkingCars === value;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setParkingCars(value)}
                    aria-pressed={sel}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[13px] font-medium transition-all min-h-[36px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3f4d33] ${
                      sel ? "border-[#3f4d33] bg-[#3f4d33] text-white" : "border-[#d5cfb8] bg-white text-[#45463a] hover:border-[#a8a68d]"
                    }`}
                  >
                    {sel && <Check className="w-3 h-3 shrink-0" aria-hidden="true" />}
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Time selection */}
        <h3 className="text-base sm:text-lg font-bold text-[#2f3527] mb-1">時間帯</h3>
        <div className="flex gap-3 mb-6">
          {TIME_OPTIONS.map(({ id, label, Icon }) => (
            <button key={id} type="button" onClick={() => setSelectedTime(id)} aria-pressed={selectedTime === id}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-[15px] font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3f4d33] ${
                selectedTime === id ? "border-[#3f4d33] bg-[#edeadd] text-[#3f4d33]" : "border-[#e2dcc9] bg-white text-[#45463a] hover:border-[#a8a68d]"
              }`}>
              <Icon className="w-4 h-4" aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <button type="button" onClick={() => setStep("style")} disabled={selectedWorkTypes.length === 0}
          className="ne-cta-btn disabled:opacity-40 disabled:cursor-not-allowed">
          <span className="ne-cta-btn-inner">
            次へ：デザインを選択 <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </span>
        </button>
      </motion.div>
    );
  };

  // ── Style selection (step: "style") ───────────────────────────
  const renderStyle = () => (
    <motion.div key="style" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}>
      <h3 className="text-base sm:text-lg font-bold text-[#2f3527] mb-1">どんな雰囲気にしますか？</h3>
      <p className="text-[13px] sm:text-[15px] text-[#6f705f] mb-4">
        {sitePhase === "vacant"
          ? "建物と外構をこの雰囲気で生成します。お好みのデザインを1つ選択してください。"
          : "お好みの外構デザインを1つ選択してください。"}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6">
        {STYLE_OPTIONS.map((s) => (
          <StyleCard key={s.id} s={s} selected={selectedStyle === s.id} onSelect={() => setSelectedStyle(s.id)} />
        ))}
      </div>

      {error && (
        <div role="alert" className="mb-4 flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-[15px] text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" /> {error}
        </div>
      )}

      <div className="flex gap-3">
        <button type="button" onClick={() => setStep("worktype")}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 border-[#e2dcc9] text-[#6f705f] text-[15px] font-semibold hover:border-[#a8a68d] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3f4d33]">
          <ChevronLeft className="w-4 h-4" aria-hidden="true" /> 戻る
        </button>
        <button type="button" onClick={generate} disabled={isGenerating} className="ne-cta-btn flex-1" aria-busy={isGenerating}>
          <span className="ne-cta-btn-inner">
            完成イメージを生成する <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </span>
        </button>
      </div>
    </motion.div>
  );

  // ── Generate / Result (step: "generate") ─────────────────────
  const renderGenerate = () => {
    const styleName = STYLE_OPTIONS.find((s) => s.id === selectedStyle)?.name;

    return (
      <motion.div key="generate" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}>
        {isGenerating ? (
          <div className="text-center py-16" aria-live="polite" aria-busy="true">
            <Loader2 className="w-12 h-12 text-[#3f4d33] animate-spin mx-auto mb-6" aria-hidden="true" />
            <p className="text-base font-bold text-[#2f3527] mb-2">
              {sitePhase === "vacant" ? "新築住宅と外構の完成イメージを作成しています" : "外構完成後のイメージを作成しています"}
            </p>
            <p className="text-[15px] text-[#6f705f]">通常30秒〜1分程度かかります</p>
          </div>
        ) : generatedUrl ? (
          <>
            {/* Selected works + style */}
            <div className="rounded-xl border border-[#d5cfb8] bg-[#f7f4e8] p-4 mb-4">
              <p className="text-[13px] text-[#45463a] mb-1.5">
                <span className="font-bold text-[#2f3527]">敷地の状態：</span>
                {SITE_PHASE_OPTIONS.find((o) => o.id === sitePhase)?.label}
              </p>
              {selectedWorkTypes.length > 0 && (
                <>
                  <p className="text-[13px] font-bold text-[#2f3527] mb-1.5">選択した工事</p>
                  <ul className="space-y-1 mb-3">
                    {selectedWorkTypes.map((t) => {
                      const work = WORK_TYPES.find((w) => w.id === t);
                      return work ? (
                        <li key={t} className="flex items-center gap-2 text-[13px] text-[#45463a]">
                          <Check className="w-3.5 h-3.5 text-[#6a7c50] shrink-0" aria-hidden="true" />
                          {work.label}
                        </li>
                      ) : null;
                    })}
                  </ul>
                </>
              )}
              {parkingCars && (
                <p className="text-[13px] text-[#45463a] mb-1.5">
                  <span className="font-bold text-[#2f3527]">駐車場・カーポートの台数：</span>
                  {PARKING_CAR_OPTIONS.find((o) => o.value === parkingCars)?.label}
                </p>
              )}
              {styleName && (
                <p className="text-[13px] text-[#45463a]">
                  <span className="font-bold text-[#2f3527]">デザイン：</span>{styleName}
                </p>
              )}
            </div>

            {/* Compare mode toggle */}
            <div className="flex gap-2 mb-3">
              {(["slider", "before", "after"] as const).map((m) => (
                <button key={m} type="button" onClick={() => setCompareMode(m)} aria-pressed={compareMode === m}
                  className={`flex-1 py-1.5 rounded-lg text-[13px] font-semibold border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3f4d33] ${
                    compareMode === m ? "bg-[#3f4d33] text-white border-[#3f4d33]" : "border-[#e2dcc9] text-[#45463a] hover:border-[#a8a68d]"
                  }`}>
                  {m === "slider" ? "比較スライダー" : m === "before" ? "元の写真" : "完成イメージ"}
                </button>
              ))}
            </div>

            {/* Image */}
            <div className="rounded-xl overflow-hidden mb-4">
              {compareMode === "slider" && previewUrl && <BeforeAfterSlider before={previewUrl} after={generatedUrl} />}
              {/* eslint-disable-next-line @next/next/no-img-element -- ローカルObjectURLのため next/image 非対応 */}
              {compareMode === "before" && previewUrl && <img src={previewUrl} alt="元の写真" className="w-full block rounded-xl" />}
              {/* eslint-disable-next-line @next/next/no-img-element -- 生成画像(data URL)のため next/image 非対応 */}
              {compareMode === "after" && <img src={generatedUrl} alt="完成イメージ" className="w-full block rounded-xl" />}
            </div>

            {/* 概算費用（config/exterior-pricing.ts 基準の参考価格） */}
            <div className="rounded-xl border border-[#cdb98a] bg-[#f7f1df] p-4 sm:p-5 mb-4 text-center">
              <p className="text-[13px] sm:text-[14px] font-bold text-[#9c5732]">この外構工事の概算費用</p>
              {estimate ? (
                <>
                  <p className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#b0502f]">
                    {estimate.label}
                  </p>
                  <p className="mt-2 text-[12px] sm:text-[13px] text-[#8a7a55] leading-relaxed">
                    選択された外構工事の内容をもとに算出した参考価格です（建物の建築費は含みません）。
                    <br />
                    ※表示される金額は概算です。正式な金額は現地調査後に確定します。
                  </p>
                </>
              ) : (
                <p className="mt-1 text-[15px] font-semibold text-[#8a7a55] leading-relaxed">
                  お選びいただいた内容は現地確認が必要なため、概算費用は現地調査時にご案内します。
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2 mb-6">
              <a href={generatedUrl} download="new-exterior-simulation.png"
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#e2dcc9] text-[#45463a] text-[15px] font-semibold hover:border-[#a8a68d] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3f4d33]"
                aria-label="完成イメージを保存">
                <Download className="w-4 h-4" aria-hidden="true" /> 画像を保存
              </a>
              <button type="button" onClick={generate} disabled={remaining <= 0 || isGenerating}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#e2dcc9] text-[#45463a] text-[15px] font-semibold hover:border-[#a8a68d] disabled:opacity-40 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3f4d33]">
                <RefreshCw className="w-4 h-4" aria-hidden="true" /> 再生成
              </button>
              <button type="button"
                onClick={() => { setGeneratedUrl(null); setStep("style"); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#e2dcc9] text-[#45463a] text-[15px] font-semibold hover:border-[#a8a68d] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3f4d33]">
                デザインを変更して再生成
              </button>
              <button type="button" onClick={reset}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#e2dcc9] text-[#45463a] text-[15px] font-semibold hover:border-[#a8a68d] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3f4d33]">
                最初からやり直す
              </button>
            </div>

            {remaining <= 0 && <p className="text-[13px] text-[#b0502f] mb-4">生成回数の上限（3回）に達しました。</p>}

            {/* CTA */}
            <div className="rounded-2xl bg-[#edeadd] border border-[#d5cfb8] p-5 text-center mb-5">
              <p className="mb-3 text-[15px] sm:text-base font-bold text-[#2f3527] leading-relaxed">
                このイメージをもとに、
                <span className="text-[#b0502f]">無料で外構プランとお見積もり</span>をご提案できます。
              </p>
              <button type="button" onClick={requestQuote} className="ne-cta-btn inline-block">
                <span className="ne-cta-btn-inner">
                  この内容で無料見積もりを依頼する <ChevronRight className="w-5 h-5" aria-hidden="true" />
                </span>
              </button>
              <p className="mt-3 text-[13px] sm:text-[15px] text-[#5f5f52]">現地調査・正式なお見積もりは無料です。</p>
            </div>

            <p className="text-[12px] text-[#a8a68d] text-center leading-relaxed">
              この画像はシミュレーションによる完成イメージです。実際の建物・施工可否、寸法、色、商品、費用を保証するものではありません。現地調査後に正式なプランをご提案します。
            </p>
          </>
        ) : null}
      </motion.div>
    );
  };

  // ── Main render ───────────────────────────────────────────────
  return (
    <section className="relative px-4 sm:px-6 py-16 md:py-24 overflow-hidden bg-white" id="new-exterior-simulator">
      <div className="relative z-10 max-w-3xl mx-auto">
        <NeSectionHeading
          eyebrow="無料シミュレーション"
          title="新築×外構シミュレーター"
          description={"更地や建築中の写真から、\n新築の建物と外構が完成したイメージを無料で確認できます。"}
        />
        <p className="mt-3 text-[15px] text-[#6f705f] text-center leading-relaxed max-w-xl mx-auto">
          駐車場コンクリート、カーポート、門柱、アプローチ、フェンス、人工芝など、気になる外構をまとめてシミュレーションできます。
        </p>

        <BeforeAfterIllust className="mt-6 w-full max-w-md mx-auto block" />

        <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {SIMULATOR_FEATURES.map((feature) => (
            <li key={feature} className="flex items-center gap-1.5 text-[13.5px] sm:text-[14px] font-semibold text-[#3f4d33]">
              <Check className="w-3.5 h-3.5 text-[#6a7c50] shrink-0" aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[13px] text-[#93927e] text-center leading-relaxed max-w-xl mx-auto">
          選択した工事内容をもとに、参考となる外構工事の概算価格を表示します。
          <br />
          ※表示される金額は概算です。正式な金額は現地調査後に確定します。
        </p>

        <div className="mt-10 md:mt-14 bg-[#fbf9f2] rounded-2xl p-5 sm:p-7 shadow-[0_3px_16px_rgba(70,66,50,0.08)]">
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
