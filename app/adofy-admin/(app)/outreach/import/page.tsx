import CsvImport from "@/components/outreach-admin/CsvImport";

export const metadata = { title: "CSV登録｜ドラテク営業" };

export default function ImportPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="mb-1 text-xl font-bold text-slate-900">CSV登録（補助）</h1>
      <p className="mb-4 text-sm leading-relaxed text-slate-600">
        手持ちの企業リスト・外部で取得したリスト・データ移行用です。営業先は「営業先の取得」から自動で集められるため、CSVは必須ではありません。
        メールアドレス・ドメイン・電話番号・会社名＋地域が一致する企業は自動で重複除外し、既存の空欄だけ補います。
        取り込んだ企業も「確認待ち」になり、目視確認するまで送信されません。
      </p>
      <CsvImport />
    </div>
  );
}
