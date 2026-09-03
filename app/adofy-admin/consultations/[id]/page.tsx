import { notFound, redirect } from "next/navigation";
import AdofyAdminShell from "@/components/adofy-admin/AdofyAdminShell";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdofyAccess } from "@/lib/auth/adofyCheck";
import ConsultationDetail from "./_components/ConsultationDetail";
import type { Consultation } from "../_lib/labels";

/*
  データはサーバー側で取得して初期表示に含める。
  クライアントから取りに行くと、表示 → 読み込み中 → 表示 の待ちが挟まるため。
*/
export default async function ConsultationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const admin = await requireAdofyAccess(supabase);
  if (!admin) redirect("/admin/login");

  const db = createAdminClient();
  const [{ data: consultation }, { data: activities }] = await Promise.all([
    db.from("consultations").select("*").eq("id", id).single(),
    db
      .from("consultation_activities")
      .select("*")
      .eq("consultation_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (!consultation) notFound();

  return (
    <AdofyAdminShell>
      <ConsultationDetail
        initial={consultation as Consultation}
        initialActivities={activities ?? []}
      />
    </AdofyAdminShell>
  );
}
