import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const QUESTION_LABELS = [
  '現在の状況',
  'お住まいの地域',
  '建物の種類',
  '築年数',
  '気になる症状',
  '工事を考えている時期',
  '一番重視したいこと',
  'まず知りたいこと',
];

const SEGMENT_LABELS: Record<string, string> = {
  active: '顕在層（今すぐ動けるタイミング）',
  middle: '中間層（計画的に検討中）',
  passive: '潜在層（情報収集中）',
};

type AnswerValue = string | string[];

function formatAnswer(val: AnswerValue | undefined): string {
  if (val === undefined || val === null) return '未回答';
  if (Array.isArray(val)) return val.length > 0 ? val.join('、') : '未選択';
  return val;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, email, comment, answers, segment } = body as {
      name: string;
      phone: string;
      email: string;
      comment?: string;
      answers: Record<number, AnswerValue>;
      segment: string;
    };

    const answersText = QUESTION_LABELS.map(
      (label, i) => `  Q${i + 1}. ${label}：${formatAnswer(answers[i + 1])}`
    ).join('\n');

    const now = new Date().toLocaleString('ja-JP', {
      timeZone: 'Asia/Tokyo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    const segmentLabel = SEGMENT_LABELS[segment] ?? segment;

    const emailBody = [
      '【外壁塗装LP】新規お問い合わせが届きました。',
      '',
      '━━━━━━━━━━━━━━━━━━━━━━━━',
      '■ お客様情報',
      '━━━━━━━━━━━━━━━━━━━━━━━━',
      `お名前         ：${name}`,
      `電話番号       ：${phone}`,
      `メールアドレス ：${email}`,
      `コメント       ：${comment?.trim() || 'なし'}`,
      '',
      '━━━━━━━━━━━━━━━━━━━━━━━━',
      '■ 診断回答内容',
      '━━━━━━━━━━━━━━━━━━━━━━━━',
      answersText,
      '',
      `診断結果セグメント：${segmentLabel}`,
      '',
      '━━━━━━━━━━━━━━━━━━━━━━━━',
      `送信日時：${now}`,
      '━━━━━━━━━━━━━━━━━━━━━━━━',
    ].join('\n');

    const notificationEmail = process.env.NOTIFICATION_EMAIL ?? 'samurai0719@outlook.jp';
    const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev';
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.warn('[contact] RESEND_API_KEY is not set — skipping email in dev');
      return NextResponse.json({ success: true, dev: true });
    }

    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: notificationEmail,
      subject: '【外壁塗装LP】新規お問い合わせ',
      text: emailBody,
    });

    if (error) {
      console.error('[contact] Resend error:', error);
      return NextResponse.json({ error: 'メール送信に失敗しました' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[contact] Unexpected error:', err);
    return NextResponse.json({ error: '予期しないエラーが発生しました' }, { status: 500 });
  }
}
