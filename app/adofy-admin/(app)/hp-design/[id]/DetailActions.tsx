"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Mail, Save } from "lucide-react";

type Props = {
  id: string;
  email: string;
  initialMemo: string;
  initialPreviewUrl: string;
  designEmailStatus: string;
  designEmailSentAt: string | null;
  designEmailCount: number;
  designEmailError: string | null;
};

/** 管理メモ・プレビューURL・デザイン送付メール */
export default function DetailActions(p: Props) {
  const router = useRouter();
  const [memo, setMemo] = useState(p.initialMemo);
  const [previewUrl, setPreviewUrl] = useState(p.initialPreviewUrl);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState<"" | "memo" | "url" | "send">("");
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);

  const patch = async (body: Record<string, unknown>, kind: "memo" | "url") => {
    setSaving(kind);
    setNotice(null);
    try {
      const res = await fetch(`/api/adofy-admin/hp-design/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const j = await res.json().catch(() => ({}));
      setNotice(res.ok ? { ok: true, text: "保存しました" } : { ok: false, text: j.error ?? "保存に失敗しました" });
      if (res.ok) router.refresh();
    } catch {
      setNotice({ ok: false, text: "通信エラーで保存できませんでした" });
    } finally {
      setSaving("");
    }
  };

  const alreadySent = p.designEmailStatus === "sent";

  const send = async () => {
    if (!previewUrl.trim()) {
      setNotice({ ok: false, text: "プレビューURLを入力してください" });
      return;
    }
    const confirmText = alreadySent
      ? `このお客様にはデザインを送付済みです（${p.designEmailCount}回）。\n${p.email} へもう一度送りますか？`
      : `${p.email} へデザインのプレビューURLを送信します。よろしいですか？`;
    if (!window.confirm(confirmText)) return;

    setSaving("send");
    setNotice(null);
    try {
      const res = await fetch(`/api/adofy-admin/hp-design/${p.id}/send-design`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ previewUrl, message, resend: alreadySent }),
      });
      const j = await res.json().catch(() => ({}));
      if (res.ok) {
        setNotice({ ok: true, text: "メールを送信し、ステータスを「送付済み」にしました" });
        setMessage("");
      } else {
        setNotice({ ok: false, text: j.error ?? "送信に失敗しました。もう一度お試しください。" });
      }
      router.refresh();
    } catch {
      setNotice({ ok: false, text: "通信エラーで送信結果を確認できませんでした。画面を再読み込みして送信状況を確認してください。" });
    } finally {
      setSaving("");
    }
  };

  return (
    <>
      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-bold text-slate-900">デザインの送付</h2>

        <label className="block text-xs font-bold text-slate-500" htmlFor="preview-url">プレビューURL</label>
        <div className="mt-1 flex gap-2">
          <input
            id="preview-url"
            type="url"
            value={previewUrl}
            onChange={(e) => setPreviewUrl(e.target.value)}
            placeholder="https://..."
            className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-base outline-none focus:border-slate-500"
          />
          <button
            type="button"
            onClick={() => patch({ previewUrl }, "url")}
            disabled={saving !== ""}
            className="inline-flex flex-none items-center gap-1 rounded-lg border border-slate-300 px-3 text-sm font-bold text-slate-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            保存
          </button>
        </div>

        <label className="mt-3 block text-xs font-bold text-slate-500" htmlFor="design-message">メールに添える一言（任意）</label>
        <textarea
          id="design-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          maxLength={1000}
          placeholder="例）トップページの写真は仮の画像を使用しています。"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-base outline-none focus:border-slate-500"
        />

        <div className="mt-3 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
          {p.designEmailStatus === "sent" && (
            <p className="flex items-center gap-1 font-bold text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              送付済み（{p.designEmailSentAt}・計{p.designEmailCount}回）
            </p>
          )}
          {p.designEmailStatus === "failed" && (
            <p className="font-bold text-rose-700">前回の送信に失敗しました。内容を確認して再送してください。{p.designEmailError ? `（${p.designEmailError}）` : ""}</p>
          )}
          {p.designEmailStatus === "sending" && <p className="font-bold text-amber-700">送信処理中です。しばらくしてから再読み込みしてください。</p>}
          {p.designEmailStatus === "none" && <p>まだ送付していません。</p>}
          <p className="mt-1">メールには「このデザインで購入を希望する」ボタンが入ります。料金は記載されません。</p>
        </div>

        <button
          type="button"
          onClick={send}
          disabled={saving !== "" || p.designEmailStatus === "sending"}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0b2440] py-3 text-sm font-bold text-white disabled:opacity-50"
        >
          <Mail className="h-4 w-4" />
          {saving === "send" ? "送信中…" : alreadySent ? "デザインをメールで再送する" : p.designEmailStatus === "failed" ? "デザインをメールで再送する" : "デザインをメール送付"}
        </button>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-bold text-slate-900">管理用メモ</h2>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          rows={6}
          maxLength={5000}
          placeholder="制作メモ・やりとりの記録など（お客様には表示されません）"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base outline-none focus:border-slate-500"
        />
        <button
          type="button"
          onClick={() => patch({ adminMemo: memo }, "memo")}
          disabled={saving !== ""}
          className="mt-2 inline-flex items-center gap-1 rounded-lg bg-slate-800 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving === "memo" ? "保存中…" : "メモを保存"}
        </button>
      </section>

      {notice && (
        <p className={`rounded-lg px-4 py-3 text-sm font-bold ${notice.ok ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"}`} role="status">
          {notice.text}
        </p>
      )}
    </>
  );
}
