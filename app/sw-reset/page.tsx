"use client";

import { useEffect, useState } from "react";

// 古いService Worker／キャッシュを確実に除去するための復旧ページ。
// スコープ(/admin/)の外に置くことで、壊れた旧SWに横取りされずに動作する。
export default function SwResetPage() {
  const [msg, setMsg] = useState("古いキャッシュを削除しています…");
  const [done, setDone] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        if ("serviceWorker" in navigator) {
          const regs = await navigator.serviceWorker.getRegistrations();
          await Promise.all(regs.map((r) => r.unregister()));
        }
        if ("caches" in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map((k) => caches.delete(k)));
        }
        setMsg("リセット完了しました。管理画面へ進んでください。");
      } catch {
        setMsg("リセットを試みました。管理画面へ進んでください。");
      } finally {
        setDone(true);
      }
    })();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8f6ef",
        padding: "24px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: 360, textAlign: "center" }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: "#174f3f",
            color: "#fff",
            fontWeight: 700,
            fontSize: 22,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          TN
        </div>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: "#10302a", marginBottom: 8 }}>
          管理画面 復旧
        </h1>
        <p style={{ fontSize: 14, color: "#6b7a73", marginBottom: 24 }}>{msg}</p>
        {done && (
          <a
            href="/admin/login"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              borderRadius: 12,
              background: "#174f3f",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            管理画面へ進む
          </a>
        )}
      </div>
    </div>
  );
}
