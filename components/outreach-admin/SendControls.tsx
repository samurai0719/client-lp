"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertTriangle, CheckCircle2, Pause, Play, Send, Square } from "lucide-react";
import { TEST_BATCH_SIZE } from "@/lib/outreach/constants";

type Props = {
  id: string;
  status: string;
  resumeStatus: string | null;
  testEligible: number;
  restEligible: number;
  queued: number;
  readiness: { ready: boolean; problems: string[] };
};

type Confirm = { title: string; body: React.ReactNode; action: string; expected?: number; danger?: boolean; okLabel: string };

/**
 * 送信操作パネル。
 *   下書き → [テスト100件送信] → テスト送信中 → テスト送信完了（ここで必ず止まる）
 *   → 結果を確認 → [残りを送信]（確認画面あり）→ 一斉送信中 → 送信完了
 * 送信中はいつでも [一時停止] [送信中止] できる。
 */
export default function SendControls(p: Props) {
  const router = useRouter();
  const [confirm, setConfirm] = useState<Confirm | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(action: string, expected?: number) {
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/adofy-admin/outreach/campaigns/${p.id}/action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, expected }),
    });
    setBusy(false);
    setConfirm(null);
    if (!res.ok) {
      setError(((await res.json().catch(() => ({}))) as { error?: string }).error ?? "操作に失敗しました");
    }
    router.refresh();
  }

  const big = "inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-4 text-base font-black disabled:opacity-40 sm:w-auto";
  const sub = "inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-4 py-3 text-sm font-bold disabled:opacity-40 sm:flex-none";

  const pauseBtn = (
    <button type="button" disabled={busy} onClick={() => run("pause")} className={`${sub} border-amber-300 bg-amber-50 text-amber-800`}>
      <Pause className="h-4 w-4" /> 一時停止
    </button>
  );
  const cancelBtn = (
    <button
      type="button"
      disabled={busy}
      onClick={() =>
        setConfirm({
          title: "送信を中止しますか？",
          body: <>送信待ちのメールはすべて取り消され、このメールは再開できなくなります（送信済みのものは取り消せません）。</>,
          action: "cancel",
          danger: true,
          okLabel: "送信を中止する",
        })
      }
      className={`${sub} border-rose-300 bg-white text-rose-700`}
    >
      <Square className="h-4 w-4" /> 送信中止
    </button>
  );

  return (
    <section className="rounded-2xl border-2 border-slate-200 bg-white p-4">
      {!p.readiness.ready && ["draft", "test_completed", "paused", "sending", "test_sending"].includes(p.status) && (
        <div className="mb-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
          <p className="flex items-center gap-1.5 font-bold">
            <AlertTriangle className="h-4 w-4" /> 送信できません（設定が必要です）
          </p>
          <ul className="mt-1 list-disc pl-5 text-xs">
            {p.readiness.problems.map((x) => <li key={x}>{x}</li>)}
          </ul>
        </div>
      )}

      {p.status === "draft" && (
        <div>
          <p className="text-sm font-bold text-slate-900">ステップ1：テスト送信（最大{TEST_BATCH_SIZE}件）</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            目視確認で「送信OK」にした企業 <b className="text-slate-900">{p.testEligible}社</b> に送信します。
            {TEST_BATCH_SIZE}件送ったら自動で止まり、残りへは送りません。
            {p.testEligible < TEST_BATCH_SIZE && " 送信OKの企業を増やすと、テストの件数も増えます。"}
          </p>
          <button
            type="button"
            disabled={busy || !p.readiness.ready || p.testEligible === 0}
            onClick={() =>
              setConfirm({
                title: `テスト送信：${p.testEligible}件に送信します`,
                body: <>送信後は「テスト送信完了」で停止します。配信結果・エラー・返信・文面を確認してから、残りへの送信を判断してください。</>,
                action: "test",
                okLabel: "テスト送信を開始",
              })
            }
            className={`${big} mt-3 bg-blue-600 text-white`}
          >
            <Send className="h-5 w-5" /> テスト{TEST_BATCH_SIZE}件送信
          </button>
          {p.testEligible === 0 && <p className="mt-2 text-xs font-bold text-amber-700">送信OKの企業がありません。営業先企業の「確認待ち」から送信OKにしてください。</p>}
        </div>
      )}

      {(p.status === "test_sending" || p.status === "sending") && (
        <div>
          <p className="flex items-center gap-2 text-base font-black text-blue-700">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-blue-600" />
            {p.status === "test_sending" ? "テスト送信中" : "一斉送信中"}（送信待ち {p.queued.toLocaleString()}件）
          </p>
          <p className="mt-1 text-xs text-slate-500">設定した送信速度で順番に送っています。画面を開いている間、またはcronで進みます。</p>
          <div className="mt-3 flex gap-2">{pauseBtn}{cancelBtn}</div>
        </div>
      )}

      {p.status === "paused" && (
        <div>
          <p className="text-base font-black text-amber-700">一時停止中（送信待ち {p.queued.toLocaleString()}件）</p>
          <div className="mt-3 flex gap-2">
            <button type="button" disabled={busy} onClick={() => run("resume")} className={`${sub} border-emerald-300 bg-emerald-50 text-emerald-800`}>
              <Play className="h-4 w-4" /> {p.resumeStatus === "test_sending" ? "テスト送信を再開" : "送信を再開"}
            </button>
            {cancelBtn}
          </div>
        </div>
      )}

      {p.status === "test_completed" && (
        <div>
          <p className="flex items-center gap-1.5 text-base font-black text-emerald-700">
            <CheckCircle2 className="h-5 w-5" /> テスト送信完了 — 結果を確認してください
          </p>
          <ul className="mt-2 space-y-1 text-xs text-slate-600">
            <li>□ 下の「送信結果」でバウンス・エラーが多すぎないか</li>
            <li>□ 返信・配信停止の内容に問題がないか</li>
            <li>□ 「送信した文面」で差し込み・リンク・フッターが正しいか</li>
          </ul>
          <p className="mt-3 text-sm font-bold text-slate-900">ステップ2：残りへ送信（{p.restEligible.toLocaleString()}件）</p>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              disabled={busy || !p.readiness.ready || p.restEligible === 0}
              onClick={() =>
                setConfirm({
                  title: `残り${p.restEligible.toLocaleString()}件に送信します。`,
                  body: (
                    <>
                      本当に送信しますか？
                      <br />
                      <span className="text-xs text-slate-500">
                        設定した送信速度で順番に送信します。送信中はいつでも一時停止・中止できます。
                        確認待ち（未確認）の企業も含まれます。除外した企業・配信停止・バウンス・返信済みの企業には送りません。
                      </span>
                    </>
                  ),
                  action: "send_rest",
                  expected: p.restEligible,
                  danger: true,
                  okLabel: "送信開始",
                })
              }
              className={`${big} bg-[#0a1f4e] text-white`}
            >
              <Send className="h-5 w-5" /> 残りを送信
            </button>
            {cancelBtn}
          </div>
        </div>
      )}

      {p.status === "completed" && <p className="text-base font-black text-emerald-700">送信完了</p>}
      {p.status === "cancelled" && <p className="text-base font-black text-rose-700">送信を中止しました</p>}

      {error && <p className="mt-3 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

      {confirm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <p className="text-lg font-black text-slate-900">{confirm.title}</p>
            <div className="mt-2 text-sm leading-relaxed text-slate-700">{confirm.body}</div>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button type="button" disabled={busy} onClick={() => setConfirm(null)} className="rounded-xl border border-slate-300 py-3 font-bold text-slate-700">
                キャンセル
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => run(confirm.action, confirm.expected)}
                className={`rounded-xl py-3 font-black text-white disabled:opacity-50 ${confirm.danger ? "bg-rose-600" : "bg-blue-600"}`}
              >
                {busy ? "処理中…" : confirm.okLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
