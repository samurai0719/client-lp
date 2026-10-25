"use client";

import { createContext, useContext, type ReactNode } from "react";

/**
 * 「○人のドライバーが待機中」の人数を、ページ内のすべてのCTAへ配る。
 * 人数はサーバー側（app/driver/scout/page.tsx）で driver_candidates から数えて渡す。
 * null（取得できない）や 0 のときは表示しない。
 */
const WaitingCount = createContext<number | null>(null);

export function WaitingCountProvider({ count, children }: { count: number | null; children: ReactNode }) {
  return <WaitingCount.Provider value={count}>{children}</WaitingCount.Provider>;
}

export function useWaitingCount(): number | null {
  const count = useContext(WaitingCount);
  return typeof count === "number" && count > 0 ? count : null;
}

/** CTAの上に出す赤字の一文 */
export function WaitingLine() {
  const count = useWaitingCount();
  if (count === null) return null;
  return (
    <p className="ds-waiting" aria-live="polite">
      <span className="ds-waiting__dot" aria-hidden="true" />
      <b>{count.toLocaleString("ja-JP")}</b>人のドライバーが待機中
    </p>
  );
}
