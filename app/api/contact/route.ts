import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { checkRateLimit, getClientIp } from '@/lib/security/rateLimit';
import { isReasonablePayload, isValidEmail } from '@/lib/security/publicForm';

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
    // 連続送信・スパム対策（他の公開フォームと同じく1時間5件まで）
    if (!(await checkRateLimit('contact', getClientIp(req), 5, 3600)).allowed) {
      return NextResponse.json({ error: '送信回数の上限に達しました。しばらくしてから再度お試しください。' }, { status: 429 });
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object' || !isReasonablePayload(body)) {
      return NextResponse.json({ error: '入力内容が正しくありません' }, { status: 400 });
    }
    const raw = body as Record<string, unknown>;
    const text = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
    const name = text(raw.name, 100);
    const phone = text(raw.phone, 30);
    const email = text(raw.email, 254);
    const comment = text(raw.comment, 2000);
    const segment = text(raw.segment, 20);
    const answers = (raw.answers && typeof raw.answers === 'object' ? raw.answers : {}) as Record<number, AnswerValue>;

    // 必須項目と形式のチェック（電話番号は全角・半角の数字が9桁以上あればよい。表記ゆれで問い合わせを落とさない）
    const phoneDigits = phone.replace(/[^0-9０-９]/g, '').length;
    if (!name || phoneDigits < 9 || (email && !isValidEmail(email))) {
      return NextResponse.json({ error: '入力内容をご確認ください' }, { status: 400 });
    }

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
