/** 送信履歴の「送信した文面」（折りたたみ表示） */
export default function SentMail({ mail }: { mail: { subject: string; body: string; reproduced: boolean } | null }) {
  if (!mail) return null;
  return (
    <details className="mt-1">
      <summary className="cursor-pointer text-xs text-blue-700">送信した文面</summary>
      <p className="mt-1 text-xs font-bold">{mail.subject}</p>
      <pre className="mt-1 whitespace-pre-wrap rounded bg-slate-50 p-2 text-xs text-slate-700">{mail.body}</pre>
      {mail.reproduced && (
        <p className="mt-1 text-[11px] text-slate-400">※ 容量節約のため本文は保存せず、テンプレートから再表示しています（フッターは現在の送信者設定）。</p>
      )}
    </details>
  );
}
