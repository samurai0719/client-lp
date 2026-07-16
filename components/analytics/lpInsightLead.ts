// LP Insight へのコンバージョン送信（フォーム完了時などに1回呼ぶ）。
// tracker.js は非同期読み込みのため、window.lpInsight が使えるようになるまで
// ポーリングして送信する。最大10秒で諦める（計測失敗でページ動作に影響させない）。
type LpInsightApi = { track: (type: string, props?: Record<string, unknown>) => void };

export function fireLpInsightLead(name = "lead", value = 1) {
  if (typeof window === "undefined") return;
  let tries = 0;
  const timer = setInterval(() => {
    tries += 1;
    const lp = (window as unknown as { lpInsight?: LpInsightApi }).lpInsight;
    if (lp && typeof lp.track === "function") {
      try {
        lp.track("conversion", { name, value });
      } catch {
        /* noop */
      }
      clearInterval(timer);
    } else if (tries > 50) {
      clearInterval(timer);
    }
  }, 200);
}
