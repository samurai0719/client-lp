"use client";

import {
  Layers,
  CarFront,
  Trees,
  Warehouse,
  Sprout,
  Fence,
  TreeDeciduous,
  Grid3x3,
  Home,
  CircleHelp,
  Wind,
  CloudRain,
  Eye,
  Construction,
  Compass,
  Ellipsis,
  Check,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  layers: Layers,
  "car-front": CarFront,
  trees: Trees,
  warehouse: Warehouse,
  sprout: Sprout,
  fence: Fence,
  "tree-deciduous": TreeDeciduous,
  "grid-3x3": Grid3x3,
  home: Home,
  "circle-help": CircleHelp,
  wind: Wind,
  "cloud-rain": CloudRain,
  eye: Eye,
  construction: Construction,
  compass: Compass,
  ellipsis: Ellipsis,
};

type DiagnosisOptionCardProps = {
  label: string;
  iconKey?: string;
  selected: boolean;
  onClick: () => void;
  multi?: boolean;
};

export default function DiagnosisOptionCard({ label, iconKey, selected, onClick, multi = false }: DiagnosisOptionCardProps) {
  const Icon = iconKey ? ICONS[iconKey] : undefined;

  return (
    <button
      type="button"
      role={multi ? "checkbox" : "radio"}
      aria-checked={selected}
      onClick={onClick}
      className={`w-full min-h-[48px] flex items-center gap-2.5 rounded-xl border-2 px-3 py-2 text-left transition-colors duration-150 ${
        selected ? "border-[#2f7d5a] bg-[#eaf3ee]" : "border-[#e7e3d8] bg-white hover:border-[#cfe3d6]"
      }`}
    >
      {Icon && (
        <span
          className={`flex items-center justify-center w-7 h-7 rounded-full shrink-0 ${
            selected ? "bg-[#1f4d3d] text-white" : "bg-[#f3eee0] text-[#7a8a82]"
          }`}
        >
          <Icon className="w-[15px] h-[15px]" aria-hidden="true" />
        </span>
      )}
      <span className={`flex-1 min-w-0 text-[13px] sm:text-[14px] font-semibold leading-snug ${selected ? "text-[#10302a]" : "text-[#3d4a45]"}`}>
        {label}
      </span>
      <span
        className={`shrink-0 w-5 h-5 flex items-center justify-center border-2 transition-colors ${
          multi ? "rounded-md" : "rounded-full"
        } ${selected ? "bg-[#2f7d5a] border-[#2f7d5a] text-white" : "border-[#cbd5c9] text-transparent"}`}
        aria-hidden="true"
      >
        <Check className="w-3 h-3" />
      </span>
    </button>
  );
}
