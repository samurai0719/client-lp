import type { ReactNode } from "react";
import "./entry.css";

export default function ShokuninEntryLayout({ children }: { children: ReactNode }) {
  return <div className="se-lp">{children}</div>;
}
