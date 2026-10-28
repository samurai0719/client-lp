import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import AdofyAdminShell from "@/components/adofy-admin/AdofyAdminShell";
import DoratechNav from "@/components/doratech-admin/DoratechNav";
import { getAuthorizedLeadsDb } from "@/lib/saiyoRescue/adminAccess";
import CandidateForm from "../CandidateForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "ドラテク 求職者の登録｜adofy 管理画面" };

/** 電話・LINEなどで受けた求職者を、運営が手で登録する */
export default async function NewCandidatePage() {
  const auth = await getAuthorizedLeadsDb();
  if (!auth) notFound();

  return (
    <AdofyAdminShell>
      <div className="p-4 sm:p-6">
        <DoratechNav current="candidates" />
        <Link href="/adofy-admin/doratech/candidates" className="mb-3 inline-flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-slate-800">
          <ChevronLeft className="h-4 w-4" />
          求職者の一覧
        </Link>
        <h1 className="mb-4 text-xl font-bold text-slate-900">求職者を登録</h1>
        <CandidateForm />
      </div>
    </AdofyAdminShell>
  );
}
