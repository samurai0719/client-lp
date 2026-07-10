"use client";

import { useEffect } from "react";

// LP Insight のコンバージョン送信。サンクスページ表示時に1回だけ発火する。
// トラッカー(tracker.js)は非同期読み込みのため、window.lpInsight が有効になるまで
// 少し待ってから track("conversion") を呼ぶ。最大10秒でタイムアウト。
type LpInsightApi = { track: (type: string, props?: Record<string, unknown>) => void };

export default function LpInsightConversion({
  name = "lead",
  value = 1,
}: {
  name?: string;
  value?: number;
}) {
  useEffect(() => {
    let fired = false;
    let tries = 0;
    const timer = setInterval(() => {
      tries += 1;
      const lp = (window as unknown as { lpInsight?: LpInsightApi }).lpInsight;
      if (lp && typeof lp.track === "function") {
        try {
          lp.track("conversion", { name, value });
        } catch {
          /* 計測失敗でページ動作に影響させない */
        }
        fired = true;
        clearInterval(timer);
      } else if (tries > 50) {
        clearInterval(timer);
      }
    }, 200);
    return () => {
      if (!fired) clearInterval(timer);
    };
  }, [name, value]);

  return null;
}
