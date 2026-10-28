import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { QUESTION_LABELS } from '@/components/driver/questions';
import { saveDriverRegistration } from '@/lib/driverCandidates/register';

/**
 * ドラテク（ドライバー求人・転職サービス）の無料登録受付。
 * 診断7問の回答とお客様情報を driver_candidates に保存し（企業には非公開の「確認待ち」）、運営宛にメール通知します。
 * 管理画面：/adofy-admin/doratech/candidates
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, email, comment, answers } = body as {
      name?: string;
      phone?: string;
      email?: string;
      comment?: string;
      answers?: Record<string, string>;
    };

    if (!name?.trim() || !phone?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: 'お名前・電話番号・メールアドレスは必須です' },
        { status: 400 }
      );
    }

    const url = new URL(req.url);
    const referer = req.headers.get('referer');
    const refUrl = referer ? new URL(referer) : null;
    const db = await saveDriverRegistration({
      name,
      phone,
      email,
      comment,
      answers,
      utmSource: refUrl?.searchParams.get('utm_source') ?? url.searchParams.get('utm_source'),
      utmCampaign: refUrl?.searchParams.get('utm_campaign') ?? url.searchParams.get('utm_campaign'),
      landingPage: refUrl ? `${refUrl.host}${refUrl.pathname}` : null,
    });

    const answersText = Object.keys(QUESTION_LABELS)
      .map(Number)
      .sort((a, b) => a - b)
      .map((n) => `  Q${n}. ${QUESTION_LABELS[n]}：${answers?.[String(n)] || '未回答'}`)
      .join('\n');

    const now = new Date().toLocaleString('ja-JP', {
      timeZone: 'Asia/Tokyo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    const emailBody = [
      '【ドラテク】新規の無料登録が届きました。',
      '',
      '━━━━━━━━━━━━━━━━━━━━━━━━',
      '■ ご登録者情報',
      '━━━━━━━━━━━━━━━━━━━━━━━━',
      `お名前         ：${name}`,
      `電話番号       ：${phone}`,
      `メールアドレス ：${email}`,
      `ご希望・ご質問 ：${comment?.trim() || 'なし'}`,
      '',
      '━━━━━━━━━━━━━━━━━━━━━━━━',
      '■ 診断回答内容',
      '━━━━━━━━━━━━━━━━━━━━━━━━',
      answersText,
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
      return NextResponse.json({ error: 'メール送信に失敗しました' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[driver-register] Unexpected error:', err);
    return NextResponse.json({ error: '予期しないエラーが発生しました' }, { status: 500 });
  }
}
