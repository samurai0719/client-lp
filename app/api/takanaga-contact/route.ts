import { NextResponse } from "next/server";
import { Resend } from "resend";
import type { TakanagaContactInput } from "@/lib/types/takanagaContact";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/check";

const WORK_TYPE_MAP: Record<string, string> = {
  parking: "駐車場リフォーム",
  carport: "エクステリア（カーポート・フェンスなど）",
  fence: "フェンス・塀工事",
  gate: "フェンス・塀工事",
  approach: "駐車場リフォーム",
  grass: "雑草・庭管理対策",
  deck: "植栽工事",
  garden: "植栽工事",
  gravel: "雑草・庭管理対策",
  drainage: "駐車場リフォーム",
  full: "駐車場リフォーム",
};

const DESIRED_WORK_LABELS: Record<string, string> = {
  parking: "駐車場・土間コンクリート",
  carport: "カーポート・ガレージ",
  fence: "フェンス・目隠し",
  gate: "門柱・門扉",
  approach: "玄関アプローチ",
  grass: "人工芝・防草対策",
  deck: "ウッドデッキ・テラス",
  garden: "庭リフォーム",
  gravel: "砂利敷き",
  drainage: "排水・水たまり対策",
  full: "外構全体のリフォーム",
  other: "その他",
};

const PREFERRED_TIME_LABELS: Record<string, string> = {
  morning: "午前中",
  afternoon: "午後",
  evening: "夕方以降",
  any: "いつでも",
};

const DESIRED_TIMING_LABELS: Record<string, string> = {
  asap: "できるだけ早く",
  within1month: "1ヶ月以内",
  within3months: "3ヶ月以内",
  within6months: "半年以内",
  undecided: "未定",
};

function buildEmailBody(data: TakanagaContactInput, now: string): string {
  const works = data.desiredWork.map((w) => DESIRED_WORK_LABELS[w] ?? w).join("、");

  const lines = [
    "【高長建設 HP】新規お問い合わせが届きました。",
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━",
    "■ お客様情報",
    "━━━━━━━━━━━━━━━━━━━━━━━━",
    `お名前         ：${data.name}`,
    `電話番号       ：${data.phone}`,
    `メールアドレス ：${data.email}`,
    `所在地         ：${data.prefecture}${data.city}${data.address ? ` ${data.address}` : ""}`,
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━",
    "■ お問い合わせ内容",
    "━━━━━━━━━━━━━━━━━━━━━━━━",
    `希望工事       ：${works}`,
    `工事希望時期   ：${DESIRED_TIMING_LABELS[data.desiredTiming ?? ""] ?? "未入力"}`,
    `予算           ：${data.budget ?? "未入力"}`,
    `希望連絡方法   ：${data.preferredContact ?? "未入力"}`,
    `連絡希望時間帯 ：${PREFERRED_TIME_LABELS[data.preferredTime ?? ""] ?? "未入力"}`,
    "",
    "お問い合わせ内容：",
    data.message,
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━",
    `送信日時：${now}`,
    "━━━━━━━━━━━━━━━━━━━━━━━━",
  ];

  return lines.join("\n");
}

function buildAutoReplyBody(name: string): string {
  return [
    `${name} 様`,
    "",
    "この度は高長建設にお問い合わせいただきありがとうございます。",
    "",
    "お送りいただいた内容を確認の上、担当者よりご連絡いたします。",
    "返信には数日いただく場合がございます。",
    "",
    "なお、本メールは自動送信です。このメールへの返信はご利用いただけません。",
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━",
    "高長建設",
    `https://takanagakensetu.com`,
    "━━━━━━━━━━━━━━━━━━━━━━━━",
  ].join("\n");
}

async function saveToCrm(data: TakanagaContactInput): Promise<void> {
  if (!isSupabaseAdminConfigured()) return;
  try {
    const db = createAdminClient();
    const phoneNorm = data.phone.replace(/[^\d]/g, "");

    const { data: customer, error: custErr } = await db
      .from("customers")
      .upsert(
        {
          name: data.name,
          phone: data.phone,
          phone_normalized: phoneNorm,
          email: data.email || null,
          prefecture: data.prefecture,
          city: data.city,
          address: data.address || null,
        },
        { onConflict: "phone_normalized" }
      )
      .select("id")
      .single();

    if (custErr || !customer) {
      console.error("[takanaga-contact] Customer upsert failed:", custErr);
      return;
    }

    const workTypes = data.desiredWork
      .map((w) => WORK_TYPE_MAP[w])
      .filter((v): v is string => Boolean(v));
    const uniqueTypes = [...new Set(workTypes)];
    if (uniqueTypes.length === 0) uniqueTypes.push("その他");

    const { data: lead, error: leadErr } = await db
      .from("leads")
      .insert({
        customer_id: customer.id,
        status: "new",
        work_types: uniqueTypes,
        inquiry_message: data.message,
        source: "hp",
      })
      .select("id")
      .single();

    if (leadErr) {
      console.error("[takanaga-contact] Lead insert failed:", leadErr);
      return;
    }

    if (lead) {
      await db.from("lead_activities").insert({
        lead_id: lead.id,
        activity_type: "inquiry_received",
        content: "高長建設HPのお問い合わせフォームより受け付けました",
      });
    }
  } catch (err) {
    console.error("[takanaga-contact] CRM save error:", err);
  }
}

async function notifyCrmWebhook(data: TakanagaContactInput): Promise<void> {
  const webhookUrl = process.env.CRM_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "takanaga-hp-contact",
        timestamp: new Date().toISOString(),
        data,
      }),
    });
  } catch (err) {
    console.error("[takanaga-contact] CRM webhook failed:", err);
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as TakanagaContactInput;

    // 基本バリデーション
    if (!body.name || !body.phone || !body.email || !body.prefecture || !body.city) {
      return NextResponse.json({ error: "必須項目が不足しています" }, { status: 400 });
    }
    if (!body.privacyAgreed) {
      return NextResponse.json({ error: "プライバシーポリシーへの同意が必要です" }, { status: 400 });
    }
    if (!body.message || body.message.trim().length === 0) {
      return NextResponse.json({ error: "お問い合わせ内容を入力してください" }, { status: 400 });
    }

    const now = new Date().toLocaleString("ja-JP", {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    // CRM: Supabase に顧客・リードを保存（失敗しても続行）
    void saveToCrm(body);

    // CRM webhook（非同期、失敗しても続行）
    void notifyCrmWebhook(body);

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("[takanaga-contact] RESEND_API_KEY not set — logging to console in dev");
      console.log("[takanaga-contact] Form data:", JSON.stringify(body, null, 2));
      return NextResponse.json({ success: true, dev: true });
    }

    const notificationEmail = process.env.NOTIFICATION_EMAIL ?? "samurai0719@outlook.jp";
    const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
    const resend = new Resend(apiKey);

    // 管理者への通知メール
    const { error: notifyError } = await resend.emails.send({
      from: fromEmail,
      to: notificationEmail,
      subject: `【高長建設HP】${body.name} 様よりお問い合わせ`,
      text: buildEmailBody(body, now),
    });

    if (notifyError) {
      console.error("[takanaga-contact] Notify email failed:", notifyError);
      return NextResponse.json({ error: "送信に失敗しました" }, { status: 500 });
    }

    // ユーザーへの自動返信（失敗しても問い合わせ受付は成功とする）
    await resend.emails.send({
      from: fromEmail,
      to: body.email,
      subject: "【高長建設】お問い合わせを受け付けました",
      text: buildAutoReplyBody(body.name),
    }).catch((err) => {
      console.warn("[takanaga-contact] Auto-reply failed:", err);
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[takanaga-contact] Unexpected error:", err);
    return NextResponse.json({ error: "予期しないエラーが発生しました" }, { status: 500 });
  }
}
