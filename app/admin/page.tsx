import { redirect } from "next/navigation";

// ホーム（ダッシュボード）は廃止。/admin は顧客一覧へ転送する。
export default function AdminIndexPage() {
  redirect("/admin/leads");
}
