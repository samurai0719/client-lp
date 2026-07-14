"use client";

import type { ComponentType, SVGProps } from "react";
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
  Mailbox,
  Footprints,
  CalendarClock,
  CalendarDays,
  CalendarRange,
  Calculator,
  Coins,
  Wallet,
  Banknote,
  Landmark,
  LandPlot,
  MessagesSquare,
  Zap,
  KeyRound,
  FileText,
  Check,
  type LucideIcon,
} from "lucide-react";

// lucideと同じ24px・stroke2・線画テイストで揃えたカスタムアイコン
function iconSvgProps(props: SVGProps<SVGSVGElement>) {
  return {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    width: 24,
    height: 24,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...props,
  };
}

// 新築外構：新しい住まい（キラッと光る新築マーク付き）と整えた外まわり
function NewExteriorIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconSvgProps(props)}>
      <path d="M2 21h20" />
      <path d="M5 21v-8.5" />
      <path d="M15 21v-8.5" />
      <path d="M3 13.5 10 7l7 6.5" />
      <path d="M8.5 21v-4h3v4" />
      <path d="M19.5 3v5" />
      <path d="M17 5.5h5" />
    </svg>
  );
}

// 外構リフォーム：既存の住まいの外まわりをハンマーで手直しする様子
function RenovationIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconSvgProps(props)}>
      <path d="M2 21h20" />
      <path d="M4 21v-8.5" />
      <path d="M14 21v-8.5" />
      <path d="M2 13.5 9 7l7 6.5" />
      <path d="m15.5 21 3.1-5.4" />
      <path d="m17.4 13 4.3 2.5-1.5 2.6-4.3-2.5z" />
    </svg>
  );
}

type IconComponent = LucideIcon | ComponentType<SVGProps<SVGSVGElement>>;

const ICONS: Record<string, IconComponent> = {
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
  // 新築外構診断（/new-exterior/diagnosis）用に追加
  mailbox: Mailbox,
  footprints: Footprints,
  "calendar-clock": CalendarClock,
  "key-round": KeyRound,
  "file-text": FileText,
  // 工事種別（新築外構/外構リフォーム）用のカスタムアイコン
  "new-exterior": NewExteriorIcon,
  renovation: RenovationIcon,
  // 広さ・時期・予算・支払い方法の選択肢用に追加
  "land-plot": LandPlot,
  zap: Zap,
  "calendar-days": CalendarDays,
  "calendar-range": CalendarRange,
  calculator: Calculator,
  coins: Coins,
  wallet: Wallet,
  banknote: Banknote,
  landmark: Landmark,
  "messages-square": MessagesSquare,
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
      className={`w-full min-h-[48px] flex items-center gap-2 sm:gap-2.5 rounded-xl border-2 px-2.5 sm:px-3 py-2 text-left transition-colors duration-150 ${
        selected ? "border-[#2f7d5a] bg-[#eaf3ee]" : "border-[#e7e3d8] bg-white hover:border-[#cfe3d6]"
      }`}
    >
      {Icon && (
        <span
          className={`flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full shrink-0 ${
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
        className={`shrink-0 w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center border-2 transition-colors ${
          multi ? "rounded-md" : "rounded-full"
        } ${selected ? "bg-[#2f7d5a] border-[#2f7d5a] text-white" : "border-[#cbd5c9] text-transparent"}`}
        aria-hidden="true"
      >
        <Check className="w-3 h-3" />
      </span>
    </button>
  );
}
