import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { QUESTION_LABELS } from '@/components/driver/questions';

/**
 * ドラテク（ドライバー求人・転職サービス）の無料登録受付。
 * 診断7問の回答とお客様情報を運営宛にメール通知します。
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
      '━━━━━━━━━━━━━━━━━━━━━━━━',
    ].join('\n');

    const notificationEmail = process.env.NOTIFICATION_EMAIL ?? 'samurai0719@outlook.jp';
    const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev';
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.warn('[driver-register] RESEND_API_KEY is not set — skipping email in dev');
      return NextResponse.json({ success: true, dev: true });
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
      return NextResponse.json({ error: 'メール送信に失敗しました' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[driver-register] Unexpected error:', err);
    return NextResponse.json({ error: '予期しないエラーが発生しました' }, { status: 500 });
  }
}
