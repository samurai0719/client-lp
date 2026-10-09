"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** 送信先1件の「返信あり」記録（受信Webhookを使っていない場合の手動記録） */
export default function SendRowActions({ companyId }: { companyId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await fetch(`/api/adofy-admin/outreach/companies/${companyId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "replied" }),
        });
        setBusy(false);
        router.refresh();
      }}
      className="rounded-md border border-violet-200 px-2 py-1 text-xs font-bold text-violet-700 disabled:opacity-40"
    >
      返信あり
    </button>
  );
}
