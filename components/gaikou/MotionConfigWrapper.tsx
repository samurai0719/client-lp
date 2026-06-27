"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

// LP全体の framer-motion アニメーションに prefers-reduced-motion を一括反映する
export default function MotionConfigWrapper({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
