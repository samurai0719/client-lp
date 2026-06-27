"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import { ChevronsLeftRight } from "lucide-react";

type BeforeAfterSliderProps = {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  className?: string;
};

// 外壁塗装LPのビフォーアフタースライダーと同じ「クリックで動くドラッグ式」操作感を採用
export default function BeforeAfterSlider({ beforeSrc, afterSrc, beforeAlt, afterAlt, className = "" }: BeforeAfterSliderProps) {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  function calcPos(clientX: number) {
    const el = containerRef.current;
    if (!el) return;
    const { left, width } = el.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - left) / width) * 100)));
  }

  function handlePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    dragging.current = true;
    calcPos(e.clientX);
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    calcPos(e.clientX);
  }

  function handlePointerUp(e: ReactPointerEvent<HTMLDivElement>) {
    dragging.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden select-none ${className}`}
      style={{ cursor: "col-resize", touchAction: "none" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      role="slider"
      aria-label="施工前・施工後の比較スライダー"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pos)}
    >
      <Image
        src={afterSrc}
        alt={afterAlt}
        fill
        sizes="(min-width: 1024px) 25vw, 50vw"
        className="object-cover pointer-events-none"
        draggable={false}
      />
      <div className="absolute inset-0 pointer-events-none" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Image
          src={beforeSrc}
          alt={beforeAlt}
          fill
          sizes="(min-width: 1024px) 25vw, 50vw"
          className="object-cover"
          draggable={false}
        />
      </div>

      <span
        className="absolute top-2 left-2 z-10 text-white text-[10px] sm:text-xs font-extrabold px-2 py-1 rounded-full bg-black/55 transition-opacity duration-150"
        style={{ opacity: Math.min(1, pos / 8) }}
      >
        BEFORE
      </span>
      <span
        className="absolute top-2 right-2 z-10 text-white text-[10px] sm:text-xs font-extrabold px-2 py-1 rounded-full bg-gradient-to-br from-[#2f7d5a] to-[#1f4d3d] transition-opacity duration-150"
        style={{ opacity: Math.min(1, (100 - pos) / 8) }}
      >
        AFTER
      </span>

      <div
        className="absolute inset-y-0 z-10 w-0.5 bg-white pointer-events-none"
        style={{ left: `${pos}%`, transform: "translateX(-50%)", boxShadow: "0 0 6px rgba(0,0,0,0.35)" }}
      />
      <div
        className="absolute z-10 top-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center pointer-events-none"
        style={{ left: `${pos}%`, transform: "translateX(-50%) translateY(-50%)", boxShadow: "0 3px 14px rgba(0,0,0,0.28)" }}
      >
        <ChevronsLeftRight className="w-4 h-4 text-[#1f4d3d]" aria-hidden="true" />
      </div>
    </div>
  );
}
