import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import {
  CONTACT_TIMES,
  answersToLabeled,
  isValidEmail,
  normalizeDriverPhone,
  sanitizeAnswers,
} from '@/components/driver/questions';
import { saveDriverRegistration } from '@/lib/driverCandidates/register';

/**
 * ドラテク（ドライバー求人・転職サービス）の無料登録受付。
 * 診断7ステップの回答と連絡先を driver_candidates に保存し（企業には非公開の「確認待ち」）、運営宛にメール通知します。
 * 管理画面：/adofy-admin/doratech/candidates
 *
 * 必須はお名前と電話番号だけ（メールアドレス・生まれ年は任意扱い。画面側では生まれ年を必須にしている）。
 */

function text(v: unknown, max: number): string {
  return typeof v === 'string' ? v.replace(/\r\n?/g, '\n').replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, '').trim().slice(0, max) : '';
}

function attr(v: unknown): string | null {
  const s = text(v, 300);
  return s || null;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) return NextResponse.json({ error: '送信内容を読み取れませんでした' }, { status: 400 });

    const name = text(body.name, 100);
    const rawPhone = text(body.phone, 40);
    const email = text(body.email, 200).toLowerCase();
    const comment = text(body.comment, 2000);
    const contactTime = CONTACT_TIMES.includes(body.contactTime as (typeof CONTACT_TIMES)[number]) ? (body.contactTime as string) : '';
    const yearNow = new Date().getFullYear();
    const birthYearNum = Number(body.birthYear);
    const birthYear = Number.isInteger(birthYearNum) && birthYearNum >= yearNow - 90 && birthYearNum <= yearNow - 15 ? birthYearNum : null;

    if (!name || !rawPhone) {
      return NextResponse.json({ error: 'お名前と電話番号を入力してください' }, { status: 400 });
    }
    const phone = normalizeDriverPhone(rawPhone);
    if (!phone) {
      return NextResponse.json({ error: '電話番号は 0 から始まる10〜11桁の数字で入力してください' }, { status: 400 });
    }
    if (email && !isValidEmail(email)) {
      return NextResponse.json({ error: 'メールアドレスの形式をご確認ください' }, { status: 400 });
    }

    const answers = sanitizeAnswers(body.answers);
    const a = (body.attribution && typeof body.attribution === 'object' ? body.attribution : {}) as Record<string, unknown>;
    const attribution = {
      utmSource: attr(a.utmSource),
      utmMedium: attr(a.utmMedium),
      utmCampaign: attr(a.utmCampaign),
      utmContent: attr(a.utmContent),
      utmTerm: attr(a.utmTerm),
      landingPage: attr(a.landingPage),
      referrer: attr(a.referrer),
    };

    const db = await saveDriverRegistration({ name, phone, email, birthYear, contactTime, comment, answers, attribution });

    const now = new Date().toLocaleString('ja-JP', {
      timeZone: 'Asia/Tokyo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    const answersText = answersToLabeled(answers)
      .map(([label, value]) => `  ${label}：${value}`)
      .join('\n');
    const attributionText = [
      ['utm_source', attribution.utmSource],
      ['utm_medium', attribution.utmMedium],
      ['utm_campaign', attribution.utmCampaign],
      ['utm_content', attribution.utmContent],
      ['utm_term', attribution.utmTerm],
      ['ランディング', attribution.landingPage],
      ['参照元', attribution.referrer],
    ]
      .filter(([, v]) => v)
      .map(([k, v]) => `  ${k}：${v}`)
      .join('\n');

    const emailBody = [
      '【ドラテク】新規の無料登録が届きました。',
      '',
      '━━━━━━━━━━━━━━━━━━━━━━━━',
      '■ ご登録者情報',
      '━━━━━━━━━━━━━━━━━━━━━━━━',
      `お名前         ：${name}`,
      `生まれ年       ：${birthYear ? `${birthYear}年` : '未回答'}`,
      `電話番号       ：${phone}`,
      `メールアドレス ：${email || 'なし'}`,
      `連絡希望時間帯 ：${contactTime || '指定なし'}`,
      `ご希望・ご質問 ：${comment || 'なし'}`,
      '',
      '━━━━━━━━━━━━━━━━━━━━━━━━',
      '■ 診断回答内容',
      '━━━━━━━━━━━━━━━━━━━━━━━━',
      answersText || '  （回答なし）',
      '',
      '━━━━━━━━━━━━━━━━━━━━━━━━',
      '■ 流入元',
      '━━━━━━━━━━━━━━━━━━━━━━━━',
      attributionText || '  （記録なし）',
      '',
      '━━━━━━━━━━━━━━━━━━━━━━━━',
      `送信日時：${now}`,
      db.saved
        ? `管理画面：https://www.adofy-site.com/adofy-admin/doratech/candidates${db.existing ? '（登録済みの方の再登録）' : ''}`
        : '※ DBへの保存に失敗しました。この内容を管理画面へ手で登録してください。',
      '━━━━━━━━━━━━━━━━━━━━━━━━',
    ].join('\n');

    const notificationEmail = process.env.NOTIFICATION_EMAIL ?? 'samurai0719@outlook.jp';
    const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev';
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.warn('[driver-register] RESEND_API_KEY is not set — skipping email in dev');
      return NextResponse.json({ success: true, dev: true, saved: db.saved });
    }

    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: notificationEmail,
      subject: '【ドラテク】新規無料登録',
      text: emailBody,
    });

    if (error) {
      console.error('[driver-register] Resend error:', error);
      // DBに保存できていれば登録は受け付けられている（管理画面で確認できる）
      if (db.saved) return NextResponse.json({ success: true });
      return NextResponse.json({ error: '送信に失敗しました。時間をおいてもう一度お試しください。' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[driver-register] Unexpected error:', err);
    return NextResponse.json({ error: '予期しないエラーが発生しました' }, { status: 500 });
  }
}
