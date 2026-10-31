import { NextResponse } from "next/server";
import { Resend } from "resend";
import { isValidEmail, normalizeDriverPhone } from "@/components/driver/questions";
import {
  ANSWER_LABELS,
  CONTACT_TIMES,
  TOTAL_STEPS,
  isStepComplete,
  sanitizeAnswers,
  type EntryAnswers,
} from "@/components/shokunin-entry/questions";
import { saveShokuninRegistration } from "@/lib/shokuninCandidates/save";

/**
 * 建設職人の無料登録受付。shokunin_candidates に保存してから運営へメール通知する。
 * 保存に失敗したら 500 を返す（画面は再試行を案内し、Lead も送らない）。
 * 応答の isNew は新規登録のときだけ true。画面はこの値を見て Lead を送る。
 */

const SAVE_ERROR = "登録できませんでした。入力内容は残っていますので、もう一度お試しください。";

function text(v: unknown, max: number): string {
  return typeof v === "string" ? v.replace(/\r\n?/g, "\n").replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, "").trim().slice(0, max) : "";
}

function attr(v: unknown, max = 300): string | null {
  return text(v, max) || null;
}

async function notify(lines: string[]) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[shokunin-entry] RESEND_API_KEY が未設定のためメールを送りません");
    return;
  }
  const to =
    process.env.SAIYO_RESCUE_NOTIFICATION_EMAIL ??
    process.env.ADOFY_NOTIFICATION_EMAIL ??
    process.env.NOTIFICATION_EMAIL ??
    "info@tenshoku-gpt.com";
  const { error } = await new Resend(apiKey).emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev",
    to,
    subject: "【職人採用エージェント】新規の職人登録",
    text: lines.join("\n"),
  });
  if (error) console.error("[shokunin-entry] Resend error:", error);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) return NextResponse.json({ error: "送信内容を読み取れませんでした" }, { status: 400 });

    // スパム対策（人間には見えない欄）。保存も計測もしない
    if (text(body.website, 200)) return NextResponse.json({ success: true, isNew: false });

    const name = text(body.name, 100);
    const phone = normalizeDriverPhone(text(body.phone, 40));
    const email = text(body.email, 200).toLowerCase();
    const comment = text(body.comment, 2000);
    const contactTime = CONTACT_TIMES.includes(body.contactTime as (typeof CONTACT_TIMES)[number]) ? (body.contactTime as string) : "";
    const yearNow = new Date().getFullYear();
    const birthYear = Number(body.birthYear);

    if (!name) return NextResponse.json({ error: "氏名を入力してください" }, { status: 400 });
    if (!Number.isInteger(birthYear) || birthYear < yearNow - 90 || birthYear > yearNow - 15) {
      return NextResponse.json({ error: "生まれ年を選んでください" }, { status: 400 });
    }
    if (!phone) return NextResponse.json({ error: "電話番号は 0 から始まる10〜11桁の数字で入力してください" }, { status: 400 });
    if (email && !isValidEmail(email)) return NextResponse.json({ error: "メールアドレスの形式をご確認ください" }, { status: 400 });
    if (body.privacyConsent !== true) return NextResponse.json({ error: "個人情報の取り扱いへの同意が必要です" }, { status: 400 });

    const answers = sanitizeAnswers(body.answers);
    for (let step = 1; step < TOTAL_STEPS; step++) {
      if (!isStepComplete(step, answers)) return NextResponse.json({ error: "未回答の質問があります" }, { status: 400 });
    }

    const a = (body.attribution && typeof body.attribution === "object" ? body.attribution : {}) as Record<string, unknown>;
    const attribution = {
      utm_source: attr(a.utm_source),
      utm_medium: attr(a.utm_medium),
      utm_campaign: attr(a.utm_campaign),
      utm_content: attr(a.utm_content),
      utm_term: attr(a.utm_term),
      fbclid: attr(a.fbclid, 500),
      fbc: attr(a.fbc, 500),
      fbp: attr(a.fbp, 200),
      referrer: attr(a.referrer, 1000),
      landing_url: attr(a.landing_url, 1000),
    };

    const { saved, isNew } = await saveShokuninRegistration({ name, phone, email, birthYear, contactTime, comment, answers, attribution });
    if (!saved) return NextResponse.json({ error: SAVE_ERROR }, { status: 500 });

    const answerLines = (Object.keys(ANSWER_LABELS) as (keyof EntryAnswers)[]).map((k) => {
      const v = answers[k];
      return `  ${ANSWER_LABELS[k]}：${(Array.isArray(v) ? v.join("、") : v) || "なし"}`;
    });
    const attributionLines = Object.entries(attribution)
      .filter(([, v]) => v)
      .map(([k, v]) => `  ${k}：${v}`);

    // 通知に失敗しても登録は保存済みなので、成功として返す
    await notify([
      `【職人採用エージェント】${isNew ? "新規の職人登録が届きました" : "登録済みの方が内容を更新しました"}。`,
      "",
      `氏名：${name}`,
      `生まれ年：${birthYear}年`,
      `電話番号：${phone}`,
      `メールアドレス：${email || "なし"}`,
      `連絡希望時間帯：${contactTime || "指定なし"}`,
      `ご希望・ご質問：${comment || "なし"}`,
      "",
      "■ 回答内容",
      ...answerLines,
      "",
      "■ 流入元",
      ...(attributionLines.length ? attributionLines : ["  （記録なし）"]),
      "",
      "保存先：Supabase shokunin_candidates（企業には非公開）",
    ]).catch((err) => console.error("[shokunin-entry] notify failed:", err));

    return NextResponse.json({ success: true, isNew });
  } catch (err) {
    console.error("[shokunin-entry] Unexpected error:", err);
    return NextResponse.json({ error: SAVE_ERROR }, { status: 500 });
  }
}
