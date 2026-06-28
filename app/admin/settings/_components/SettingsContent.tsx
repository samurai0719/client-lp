"use client";

import { useEffect, useState } from "react";
import { Smartphone, Bell, BellOff, BellRing, Send, CheckCircle2, AlertTriangle } from "lucide-react";

export default function SettingsContent() {
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
  const [pushPermission, setPushPermission] = useState<NotificationPermission>("default");
  const [pushMsg, setPushMsg] = useState("");
  const [testMsg, setTestMsg] = useState("");

  useEffect(() => {
    const ua = navigator.userAgent;
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true);
    setIsIOS(/iP(hone|ad|od)/.test(ua));
    setIsAndroid(/Android/.test(ua));
    if ("Notification" in window) {
      setPushPermission(Notification.permission);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstall() {
    if (!installPrompt) return;
    (installPrompt as Event & { prompt: () => void }).prompt();
    setInstallPrompt(null);
  }

  async function handleEnablePush() {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setPushMsg("このブラウザはプッシュ通知に対応していません");
      return;
    }
    const permission = await Notification.requestPermission();
    setPushPermission(permission);
    if (permission !== "granted") {
      setPushMsg("通知が拒否されました");
      return;
    }
    try {
      const reg = await navigator.serviceWorker.ready;
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidKey) {
        setPushMsg("VAPID公開鍵が未設定です（環境変数 NEXT_PUBLIC_VAPID_PUBLIC_KEY）");
        return;
      }
      const rawKey = urlBase64ToUint8Array(vapidKey);
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: rawKey as unknown as ArrayBuffer,
      });
      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: sub.endpoint,
          p256dh: arrayBufferToBase64(sub.getKey("p256dh")!),
          auth: arrayBufferToBase64(sub.getKey("auth")!),
          userAgent: navigator.userAgent,
        }),
      });
      if (res.ok) {
        setPushMsg("通知を有効にしました");
      } else {
        setPushMsg("通知登録に失敗しました");
      }
    } catch (err) {
      setPushMsg("通知の設定に失敗しました");
    }
  }

  async function handleDisablePush() {
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await fetch("/api/push/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setPushMsg("通知を無効にしました");
    } catch {
      setPushMsg("通知解除に失敗しました");
    }
  }

  async function handleTestPush() {
    setTestMsg("送信中…");
    const res = await fetch("/api/push/test", { method: "POST" });
    setTestMsg(res.ok ? "テスト通知を送信しました" : "送信に失敗しました");
    setTimeout(() => setTestMsg(""), 4000);
  }

  const sectionClass = "bg-white rounded-2xl border border-[#e7e3d8] p-5 space-y-4";

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold text-[#10302a]">設定</h1>

      {/* アプリ追加 */}
      <div className={sectionClass}>
        <h2 className="text-sm font-bold text-[#10302a] flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-[#174f3f]" />
          スマートフォンにアプリを追加
        </h2>
        <p className="text-xs text-[#6b7a73]">
          ホーム画面に追加すると、通常のアプリのように顧客管理画面を開けます。
        </p>

        {isStandalone ? (
          <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 rounded-xl px-3 py-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            アプリとして起動中です
          </div>
        ) : isIOS ? (
          <div className="bg-[#f8f6ef] rounded-xl p-4 space-y-2 text-xs text-[#3d4a45]">
            <p className="font-semibold">iPhoneでホーム画面に追加する方法：</p>
            {!isStandalone && (
              <p className="text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
                iPhoneで通知を利用するには、Safariの共有メニューから「ホーム画面に追加」した後、アプリを開いて通知を有効にしてください。
              </p>
            )}
            <ol className="list-decimal list-inside space-y-1">
              <li>Safari下部の共有ボタン（□↑）をタップ</li>
              <li>「ホーム画面に追加」を選択</li>
              <li>「追加」をタップして完了</li>
            </ol>
          </div>
        ) : isAndroid && installPrompt ? (
          <button
            onClick={handleInstall}
            className="w-full py-3 rounded-xl bg-[#174f3f] text-white text-sm font-semibold hover:bg-[#1f6450] transition-colors"
          >
            アプリをインストール
          </button>
        ) : !isIOS && (
          <div className="bg-[#f8f6ef] rounded-xl p-3 text-xs text-[#6b7a73]">
            <p className="font-semibold text-[#3d4a45]">Androidでホーム画面に追加する方法：</p>
            <ol className="list-decimal list-inside mt-1 space-y-1">
              <li>Chromeのメニュー（⋮）をタップ</li>
              <li>「ホーム画面に追加」を選択</li>
            </ol>
          </div>
        )}
      </div>

      {/* 通知設定 */}
      <div className={sectionClass}>
        <h2 className="text-sm font-bold text-[#10302a] flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#174f3f]" />
          通知設定
        </h2>

        {pushMsg && (
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs ${pushMsg.includes("失敗") || pushMsg.includes("拒否") || pushMsg.includes("未設定") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
            {pushMsg.includes("失敗") || pushMsg.includes("拒否") ? <AlertTriangle className="w-3 h-3 shrink-0" /> : <CheckCircle2 className="w-3 h-3 shrink-0" />}
            {pushMsg}
          </div>
        )}

        {pushPermission === "denied" && (
          <div className="px-3 py-2 rounded-xl bg-red-50 text-xs text-red-700 flex items-center gap-2">
            <BellOff className="w-4 h-4 shrink-0" />
            通知がブロックされています。端末の設定から通知を許可してください。
          </div>
        )}

        {pushPermission === "granted" ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-50 text-xs text-green-700">
              <BellRing className="w-4 h-4 shrink-0" />
              通知は有効です
            </div>
            <button
              onClick={handleDisablePush}
              className="w-full py-2.5 rounded-xl border border-[#dcd6c4] text-sm text-[#6b7a73] hover:bg-[#f0ece0] transition-colors"
            >
              通知を無効にする
            </button>
            <div>
              <button
                onClick={handleTestPush}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#174f3f] text-white text-sm font-medium hover:bg-[#1f6450] transition-colors"
              >
                <Send className="w-4 h-4" />
                テスト通知を送る
              </button>
              {testMsg && (
                <p className="text-xs text-[#6b7a73] mt-1.5">{testMsg}</p>
              )}
            </div>
          </div>
        ) : pushPermission !== "denied" && (
          <button
            onClick={handleEnablePush}
            className="w-full py-3 rounded-xl bg-[#174f3f] text-white text-sm font-semibold hover:bg-[#1f6450] transition-colors flex items-center justify-center gap-2"
          >
            <Bell className="w-4 h-4" />
            通知を有効にする
          </button>
        )}

        <div className="text-xs text-[#8a9a90] space-y-0.5">
          <p>・新規問い合わせ時に通知を受け取れます</p>
          <p>・次回対応予定と未対応案件の通知も届きます</p>
          <p>・通知本文に個人情報（電話番号・住所等）は含まれません</p>
        </div>
      </div>
    </div>
  );
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}
