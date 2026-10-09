import type { Metadata } from "next";
import Link from "next/link";
import CompanyShell from "@/components/driver-company/CompanyShell";
import { PATHS, PRICING, SERVICE } from "@/config/driver-company";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/check";
import { completionBody, completionSubject } from "@/lib/driverCompany/mail";
import { adminAddress, sendMail } from "@/lib/driverCompany/send";

/**
 * 求人登録のメール認証。
 *
 * 登録時に送った認証URL（?token=...）を開くと、ここで
 *   ・企業のメールアドレスを確認済みにする
 *   ・その企業の「認証待ち」求人を公開状態にする
 *   ・求人登録完了メールを送る
 * を行う。認証が済むまで求人は掲載も配信もされない。
 *
 * メールのリンクは GET で開かれるため、この処理は GET で状態を変える。
 * トークンは1回使うと消えるので、二重に実行されても結果は変わらない。
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `メールアドレスの確認｜${SERVICE.name}`,
  robots: { index: false, follow: false },
};

type Outcome =
  | { kind: "ok"; companyName: string; jobTitle: string; mailed: boolean }
  | { kind: "already" }
  | { kind: "expired" }
  | { kind: "invalid" }
  | { kind: "unavailable" };

async function verify(token: string): Promise<Outcome> {
  if (!isSupabaseAdminConfigured()) {
    console.error("[driver-company-verify] Supabase admin is not configured");
    return { kind: "unavailable" };
  }

  const db = createAdminClient();

  const { data: company, error } = await db
    .from("driver_companies")
    .select("id, company_name, notification_email, verification_expires_at, email_verified_at")
    .eq("verification_token", token)
    .maybeSingle();

  if (error) {
    console.error("[driver-company-verify] lookup failed:", error.code, error.message);
    return { kind: "unavailable" };
  }
  if (!company) {
    // トークンが使用済み（認証後に消している）か、そもそも存在しない
    return { kind: "invalid" };
  }

  const expiresAt = company.verification_expires_at
    ? new Date(company.verification_expires_at as string)
    : null;
  if (expiresAt && expiresAt.getTime() < Date.now()) {
    return { kind: "expired" };
  }

  const now = new Date().toISOString();

  const { error: updateError } = await db
    .from("driver_companies")
    .update({
      email_verified_at: company.email_verified_at ?? now,
      status: "active",
      verification_token: null,
      verification_expires_at: null,
      updated_at: now,
    })
    .eq("id", company.id);

  if (updateError) {
    console.error("[driver-company-verify] update failed:", updateError.code, updateError.message);
    return { kind: "unavailable" };
  }

  // 認証待ちの求人を公開する
  const { data: jobs, error: jobError } = await db
    .from("driver_job_postings")
    .update({ status: "published", published_at: now, updated_at: now })
    .eq("company_id", company.id)
    .eq("status", "pending_verification")
    .select("job_title");

  if (jobError) {
    console.error("[driver-company-verify] publish failed:", jobError.code, jobError.message);
  }

  const jobTitle = (jobs?.[0]?.job_title as string | undefined) ?? "ご登録の求人";

  if (!jobs || jobs.length === 0) {
    // 既に認証済みで、公開待ちの求人が無い状態
    return { kind: "already" };
  }

  const mailed = await sendMail({
    to: company.notification_email as string,
    subject: completionSubject(),
    text: completionBody({
      companyName: company.company_name as string,
      jobTitle,
      registeredAt: new Date(),
    }),
    replyTo: adminAddress(),
  });

  return {
    kind: "ok",
    companyName: company.company_name as string,
    jobTitle,
    mailed,
  };
}

function Panel({
  tone,
  title,
  children,
}: {
  tone: "ok" | "warn";
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-[#0d2b52]/10 bg-white p-6 text-center shadow-[0_10px_30px_rgba(13,43,82,0.08)] sm:p-10">
      <div
        className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${
          tone === "ok" ? "bg-[#ffc400]" : "bg-[#0d2b52]/10"
        }`}
      >
        <span className="text-2xl font-bold text-[#0d2b52]">{tone === "ok" ? "✓" : "！"}</span>
      </div>
      <h1 className="text-xl font-bold text-[#0d2b52] sm:text-2xl">{title}</h1>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-[#0d2b52]/75">{children}</div>
    </div>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const raw = (await searchParams).token;
  const token = typeof raw === "string" ? raw : "";

  const outcome: Outcome = token ? await verify(token) : { kind: "invalid" };

  return (
    <CompanyShell>
      <main className="bg-[#f5f8fc] py-14 sm:py-20">
        <div className="mx-auto w-full max-w-5xl px-5 sm:px-6">
          {outcome.kind === "ok" && (
            <Panel tone="ok" title="求人の掲載を開始しました">
              <p>
                {outcome.companyName} さまの求人「{outcome.jobTitle}」の登録が完了しました。
              </p>
              <p>
                登録条件に一致する登録ドライバーへ求人情報をお届けします。応募が発生した場合は、
                ご登録のメールアドレスへ応募者情報を自動送信します。
              </p>
              <p className="text-sm text-[#0d2b52]/60">
                {outcome.mailed
                  ? "登録完了メールをお送りしました。"
                  : "登録は完了していますが、完了メールの送信に失敗しました。内容はこの画面のとおりです。"}
              </p>
              <p className="text-sm text-[#0d2b52]/60">
                料金は{PRICING.successFeeUnit} {PRICING.successFee}
                {PRICING.taxNote}の成果報酬のみです。{PRICING.condition}
              </p>
            </Panel>
          )}

          {outcome.kind === "already" && (
            <Panel tone="ok" title="このメールアドレスは確認済みです">
              <p>すでに確認が完了しています。追加のお手続きは必要ありません。</p>
            </Panel>
          )}

          {outcome.kind === "expired" && (
            <Panel tone="warn" title="確認URLの有効期限が切れています">
              <p>お手数ですが、求人情報を再度ご登録ください。</p>
              <p>
                <Link
                  href={PATHS.register}
                  className="inline-block rounded-xl bg-[#ffc400] px-6 py-3 font-bold text-[#0d2b52]"
                >
                  求人情報を無料で登録する
                </Link>
              </p>
            </Panel>
          )}

          {outcome.kind === "invalid" && (
            <Panel tone="warn" title="確認URLが見つかりません">
              <p>
                URLが途中で切れているか、すでに確認が完了している可能性があります。
                メール本文のURL全体をブラウザのアドレス欄に貼り付けてお試しください。
              </p>
            </Panel>
          )}

          {outcome.kind === "unavailable" && (
            <Panel tone="warn" title="ただいま確認処理を行えません">
              <p>
                システム側の問題で確認を完了できませんでした。お手数ですが、時間をおいて再度URLを開いてください。
              </p>
            </Panel>
          )}
        </div>
      </main>
    </CompanyShell>
  );
}
