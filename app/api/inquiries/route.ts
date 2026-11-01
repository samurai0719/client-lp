import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { normalizePhone } from "@/lib/utils/format";
import { isSupabaseAdminConfigured } from "@/lib/supabase/check";
import {
  findOrCreateCustomer,
  findRecentDuplicateLead,
  nameMismatchNote,
} from "@/lib/crm/customers";
import { parseJsonOrMultipart } from "@/lib/http/parseRequestBody";
import { uploadLeadImages } from "@/lib/storage/leadImages";
import { checkRateLimit, getClientIp } from "@/lib/security/rateLimit";
import { isReasonablePayload, isValidEmail } from "@/lib/security/publicForm";

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  let files: File[];
  try {
    ({ body, files } = await parseJsonOrMultipart<Record<string, unknown>>(request));
  } catch {
    return NextResponse.json({ error: "不正なリクエスト" }, { status: 400 });
  }

  // honeypot
  if (body.website) {
    return NextResponse.json({ success: true });
  }

  if (!isReasonablePayload(body)) {
    return NextResponse.json({ error: "入力内容が正しくありません" }, { status: 400 });
  }

  const {
    name, phone, email, postalCode, prefecture, city, address,
    workTypes, designStyle, inquiryMessage,
    utmSource, utmMedium, utmCampaign, utmContent, utmTerm,
    fbclid, gclid, ttclid, landingPage, referrer, deviceType,
  } = body as {
    name: string; phone: string; email?: string; postalCode?: string;
    prefecture?: string; city?: string; address?: string;
    workTypes: string[]; designStyle?: string; inquiryMessage?: string;
    utmSource?: string; utmMedium?: string; utmCampaign?: string;
    utmContent?: string; utmTerm?: string;
    fbclid?: string; gclid?: string; ttclid?: string;
    landingPage?: string; referrer?: string; deviceType?: string;
  };

  // バリデーション
  if (!name?.trim() || name.trim().length > 100) {
    return NextResponse.json({ error: "名前が不正です" }, { status: 400 });
  }
  if (!phone?.trim()) {
    return NextResponse.json({ error: "電話番号が必須です" }, { status: 400 });
  }
  if (email && !isValidEmail(email)) {
    return NextResponse.json({ error: "メールアドレスが不正です" }, { status: 400 });
  }
  if (!Array.isArray(workTypes)) {
    return NextResponse.json({ error: "工事内容が不正です" }, { status: 400 });
  }
  if (inquiryMessage && inquiryMessage.length > 2000) {
    return NextResponse.json({ error: "問い合わせ内容は2000文字以内" }, { status: 400 });
  }

  const phoneNormalized = normalizePhone(phone);

  const withinLimit =
    (await checkRateLimit("inquiries-ip", getClientIp(request), 5, 3600)).allowed &&
    (await checkRateLimit("inquiries-phone", phoneNormalized, 1, 300)).allowed;
  if (!withinLimit) {
    return NextResponse.json({ error: "送信制限に達しました。しばらく待ってから再度お試しください。" }, { status: 429 });
  }

  const source = utmSource ?? (fbclid ? "meta" : gclid ? "google" : ttclid ? "tiktok" : "organic");

  // Supabase 未設定の場合はメールのみ試みる
  if (!isSupabaseAdminConfigured()) {
    await sendEmails({ name, phone: phone.trim(), email, city, workTypes, inquiryMessage, source, utmCampaign });
    return NextResponse.json({ success: true, dev: true });
  }

  const { createAdminClient } = await import("@/lib/supabase/admin");
  const adminClient = createAdminClient();

  // 顧客の照合・作成（名前は上書きせず、メールは未登録時のみ補完する共通ロジック）
  const customerResult = await findOrCreateCustomer(adminClient, {
    name,
    phone,
    email,
    postalCode,
    prefecture,
    city,
    address,
  });

  if (!customerResult.ok) {
    console.error("[inquiries] customer insert error");
    return NextResponse.json({ error: "保存に失敗しました" }, { status: 500 });
  }
  const customerId = customerResult.customerId;

  // フォーム入力名が登録済みの顧客名と異なる場合は、上書きせず問い合わせ内容に記録する
  const mismatchNote = customerResult.matchedExisting
    ? nameMismatchNote(name, customerResult.existingName)
    : null;
  const leadMessage = [mismatchNote, inquiryMessage ?? null].filter(Boolean).join("\n") || null;

  // 二重送信（同じ内容の直近リード）は新規作成せず既存リードを返す
  const duplicateLeadId = await findRecentDuplicateLead(adminClient, customerId, workTypes, leadMessage);
  if (duplicateLeadId) {
    if (files.length > 0) {
      await uploadLeadImages(adminClient, duplicateLeadId, files, "original").catch((err) =>
        console.error("[inquiries] duplicate lead image upload failed:", err)
      );
    }
    return NextResponse.json({ success: true, leadId: duplicateLeadId, duplicate: true });
  }

  // リード作成
  const { data: newLead, error: leadErr } = await adminClient
    .from("leads")
    .insert({
      customer_id: customerId,
      status: "new",
      work_types: workTypes,
      design_style: designStyle ?? null,
      inquiry_message: leadMessage,
      source,
    })
    .select("id")
    .single();

  if (leadErr || !newLead) {
    console.error("[inquiries] lead insert error");
    return NextResponse.json({ error: "保存に失敗しました" }, { status: 500 });
  }

  const leadId = newLead.id;

  // 広告流入情報
  await adminClient.from("lead_attribution").insert({
    lead_id: leadId,
    utm_source: utmSource ?? null,
    utm_medium: utmMedium ?? null,
    utm_campaign: utmCampaign ?? null,
    utm_content: utmContent ?? null,
    utm_term: utmTerm ?? null,
    fbclid: fbclid ?? null,
    gclid: gclid ?? null,
    ttclid: ttclid ?? null,
    landing_page: landingPage ?? null,
    referrer: referrer ?? null,
    device_type: deviceType ?? null,
    user_agent: request.headers.get("user-agent") ?? null,
  });

  // フォームに添付された写真をアップロード
  if (files.length > 0) {
    await uploadLeadImages(adminClient, leadId, files, "original").catch((err) =>
      console.error("[inquiries] image upload failed:", err)
    );
  }

  // 活動ログ
  await adminClient.from("lead_activities").insert({
    lead_id: leadId,
    activity_type: "inquiry_received",
    content: "お問い合わせを受け付けました",
  });

  // メール通知（失敗しても保存成功）
  await sendEmails({ name, phone: phone.trim(), email, city, workTypes, inquiryMessage, source, utmCampaign });

  // プッシュ通知（失敗しても保存成功）
  sendPushNotification({ leadId, name, city, workTypes }).catch(() => {});

  return NextResponse.json({ success: true, leadId });
}

async function sendEmails(opts: {
  name: string; phone: string; email?: string; city?: string;
  workTypes: string[]; inquiryMessage?: string; source: string; utmCampaign?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const { name, phone: _, email, city, workTypes, inquiryMessage, source, utmCampaign } = opts;
  const now = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL ?? "";
  const fromEmail = process.env.MAIL_FROM_ADDRESS ?? "onboarding@resend.dev";

  const resend = new Resend(apiKey);

  const adminBody = [
    "【外構LP】新しいお問い合わせが入りました",
    "",
    `受付日時　：${now}`,
    `お名前　　：${name}`,
    `地域　　　：${city ?? "未選択"}`,
    `希望工事　：${workTypes.join("、") || "未選択"}`,
    `問い合わせ：${inquiryMessage ?? "なし"}`,
    `流入元　　：${source}`,
    `キャンペーン：${utmCampaign ?? "なし"}`,
    "",
    `管理画面：https://takanagakensetu.com/admin`,
    "",
    "※電話番号・メールアドレスは管理画面でご確認ください",
  ].join("\n");

  const customerBody = email
    ? [
        `${name} 様`,
        "",
        "このたびは高長建設へお問い合わせいただき、ありがとうございます。",
        "",
        "以下の内容でお問い合わせを受け付けました。",
        "",
        `希望工事：${workTypes.join("、") || "未選択"}`,
        `お問い合わせ内容：${inquiryMessage ?? "なし"}`,
        "",
        "内容を確認のうえ、担当者よりご連絡いたします。",
        "",
        "なお、このメールは自動送信です。",
        "",
        "━━━━━━━━━━━━━━━━━━━━━━━━",
        "高長建設",
        "https://takanagakensetu.com",
      ].join("\n")
    : null;

  await Promise.allSettled([
    adminEmail && resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: "【外構LP】新しいお問い合わせが入りました",
      text: adminBody,
    }),
    customerBody && email && resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "【高長建設】お問い合わせを受け付けました",
      text: customerBody,
    }),
  ]).then((results) => {
    results.forEach((r) => {
      if (r.status === "rejected") {
        console.error("[inquiries] email send failed");
      }
    });
  });
}

async function sendPushNotification(opts: {
  leadId: string; name: string; city?: string; workTypes: string[];
}) {
  const { leadId, name, city, workTypes } = opts;
  const namePart = name.split(/[\s　]/)[0]; // 名字のみ
  const body = `${city ?? ""}${namePart}様から「${workTypes[0] ?? "外構工事"}」のお問い合わせが入りました。`;

  await fetch(`${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}/api/push/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-cron-secret": process.env.CRON_SECRET ?? "",
    },
    body: JSON.stringify({
      title: "新しい外構のお問い合わせ",
      body,
      url: `/admin/leads/${leadId}`,
    }),
  }).catch(() => {});
}
