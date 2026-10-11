"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  BadgeQuestionMark, BedDouble, Crown, Baby, Boxes, Briefcase, Building2, Camera, Car, Check, CircleOff, Clock,
  Dumbbell, Ellipsis, Factory, Gem, Globe, GraduationCap, Hammer, Hand, HandHeart, HeartHandshake, House,
  ImageOff, Images, Landmark, Laptop, Lightbulb, Link, Mail, MessageSquareQuote, Package, PawPrint, PenTool,
  Plane, Printer, Scale, Scissors, ShieldCheck, ShoppingCart, Smile, Sparkles, SprayCan, Sprout, Stamp,
  Stethoscope, Store, Tag, Truck, UserPlus, Users, UtensilsCrossed, WandSparkles, X, Zap,
  type LucideIcon,
} from "lucide-react";
import DesignSample from "./DesignSample";
import { captureAttribution } from "../contact/formState";
import { createClient } from "@/lib/supabase/client";
import { fireAdofyLead, fireAdofyPurchase } from "@/lib/analytics/adofyPixel";
import { fireLpInsightLead } from "@/components/analytics/lpInsightLead";
import {
  ALLOWED_UPLOAD_TYPES, ASSET_CHOICES, ASSET_CHOICES_WITH_UPLOAD, COLORS, CONTENTS, INDUSTRIES,
  INDUSTRY_GROUPS, INDUSTRY_SUBS, LIMITS, MAX_UPLOAD_FILES, MAX_UPLOAD_SIZE, PRIVACY_POLICY_HREF, PURPOSES, PURPOSE_OF_USE,
  REFERENCE_CHOICES, STYLES, UPLOAD_BUCKET, WEBSITE_CHOICES,
  colorText, industryText, labelOf, labelsOf,
} from "@/lib/hpDesign/options";
import {
  isValidEmail, isValidPhone, normalizePhone, normalizeUrl,
  type HpDesignAnswers, type UploadedFile,
} from "@/lib/hpDesign/validate";

/* ═══════════════════════════════════════════════════════════════════════════
   adofy 無料ホームページデザイン — チャット形式の申し込み。

   ・質問は1問ずつ。回答済みの質問は「修正」から戻って答え直せる
   ・回答は localStorage に保存し、同じ端末なら再読み込み・離脱後も続きから再開できる
     （担当者名・メール・電話は端末に残さない）
   ・料金は表示しない（料金・正式公開の条件は運営者が後日メールで案内する）
   ═══════════════════════════════════════════════════════════════════════════ */

const QUESTION_STEPS = [
  "industry", "company", "purposes", "style", "color",
  "contents", "website", "reference", "assets", "requests",
] as const;
type QuestionStep = (typeof QUESTION_STEPS)[number];
type Step = QuestionStep | "contact";

const STORAGE_KEY = "adofy_free_design_v4";
const STORAGE_TTL = 30 * 24 * 60 * 60 * 1000;

const EMPTY: HpDesignAnswers = {
  industry: "", industryOther: "", industryDetail: "",
  companyName: "", companyUndecided: false,
  purposes: [], purposeOther: "",
  designStyle: "",
  mainColor: "", colorOther: "",
  contents: [], contentOther: "",
  hasWebsite: "", websiteUrl: "",
  referenceChoice: "", referenceUrls: [""],
  assetsChoice: "", uploads: [],
  otherRequests: "",
  contactName: "", email: "", phone: "",
};

type Saved = {
  submissionId: string;
  startedAt: number;
  started: boolean;
  answers: HpDesignAnswers;
  done: QuestionStep[];
  current: Step;
  savedAt: number;
};

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  // 古いブラウザ向けのフォールバック（UUID v4 形式）
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function loadSaved(): Saved | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Saved;
    if (!s.submissionId || Date.now() - (s.savedAt ?? 0) > STORAGE_TTL) return null;
    return { ...s, answers: { ...EMPTY, ...s.answers, contactName: "", email: "", phone: "" } };
  } catch {
    return null;
  }
}

function persist(s: Saved): void {
  try {
    // 個人情報（担当者名・メール・電話）は端末に残さない
    const answers = { ...s.answers, contactName: "", email: "", phone: "" };
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...s, answers, savedAt: Date.now() }));
  } catch {
    /* 保存できなくても回答は続けられる */
  }
}

function clearSaved(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* noop */
  }
}

/* ── 質問文と、回答の吹き出しに出す文言 ─────────────────────────────── */

const QUESTIONS: Record<Step, string> = {
  industry: "まず、どのようなお仕事をされていますか？",
  company: "会社名または店舗名を教えてください。",
  purposes: "ホームページを作る一番の目的は何ですか？\n（いくつでも選べます）",
  style: "どのような雰囲気のホームページが好みですか？",
  color: "ホームページのメインカラーは何色がいいですか？",
  contents: "ホームページにはどのような情報を載せたいですか？\n（いくつでも選べます）",
  website: "現在、ホームページはありますか？",
  reference: "参考にしたいホームページはありますか？",
  assets: "ホームページに使用したい写真やロゴはありますか？\n\n写真やロゴがなければ、仮のものをこちらで制作しますのでご安心ください。",
  requests: "ホームページについて、ほかに希望することはありますか？",
  contact:
    "ご回答ありがとうございます！\n\nいただいた内容をもとに、あなたの会社専用のホームページを無料で作成します。\n\n完成したホームページをお届けするメールアドレスを教えてください。",
};

function answerText(step: QuestionStep, a: HpDesignAnswers): string {
  switch (step) {
    case "industry": return industryText(a.industry, a.industryOther, a.industryDetail);
    case "company": return a.companyUndecided ? "未定" : a.companyName;
    case "purposes": return labelsOf(PURPOSES, a.purposes, a.purposeOther);
    case "style": return labelOf(STYLES, a.designStyle);
    case "color": return colorText(a.mainColor, a.colorOther);
    case "contents": return labelsOf(CONTENTS, a.contents, a.contentOther);
    case "website":
      return a.hasWebsite === "yes" && a.websiteUrl ? `ある（${a.websiteUrl}）` : labelOf(WEBSITE_CHOICES, a.hasWebsite);
    case "reference": {
      const urls = a.referenceUrls.filter((u) => u.trim());
      return a.referenceChoice === "yes" && urls.length ? `ある\n${urls.join("\n")}` : labelOf(REFERENCE_CHOICES, a.referenceChoice);
    }
    case "assets": {
      const n = a.uploads.length;
      return `${labelOf(ASSET_CHOICES, a.assetsChoice)}${n ? `（画像${n}点）` : ""}`;
    }
    case "requests": return a.otherRequests || "特になし";
  }
}

/* ── 選択肢のアイコン（キーは「質問:選択肢id」） ───────────────────────── */

const ICONS: Record<string, LucideIcon> = {
  "industry:construction": Hammer, "industry:real_estate": House, "industry:restaurant": UtensilsCrossed,
  "industry:retail": Store, "industry:ec": ShoppingCart, "industry:hotel": BedDouble,
  "industry:salon": Scissors, "industry:clinic": Stethoscope, "industry:dental": Smile,
  "industry:bodycare": Hand, "industry:fitness": Dumbbell, "industry:care": HeartHandshake,
  "industry:school": GraduationCap, "industry:childcare": Baby, "industry:wedding": Gem,
  "industry:photo": Camera, "industry:pet": PawPrint, "industry:cleaning": SprayCan,
  "industry:auto": Car, "industry:travel": Plane, "industry:professional": Scale,
  "industry:consulting": Lightbulb, "industry:it": Laptop, "industry:creative": PenTool,
  "industry:staffing": Users, "industry:finance": Landmark, "industry:security": ShieldCheck,
  "industry:manufacturing": Factory, "industry:logistics": Truck, "industry:wholesale": Boxes,
  "industry:agriculture": Sprout, "industry:energy": Zap, "industry:printing": Printer,
  "industry:organization": HandHeart, "industry:other": Ellipsis,
  "purposes:customers": Users, "purposes:trust": ShieldCheck, "purposes:recruit": UserPlus,
  "purposes:products": Package, "purposes:stylish": Sparkles, "purposes:other": Ellipsis,
  "contents:company": Building2, "contents:services": Briefcase, "contents:works": Images,
  "contents:pricing": Tag, "contents:voices": MessageSquareQuote, "contents:recruit": UserPlus,
  "contents:staff": Users, "contents:contact": Mail, "contents:other": Ellipsis, "contents:omakase": WandSparkles,
  "website:yes": Globe, "website:no": CircleOff,
  "reference:yes": Link, "reference:no": X, "reference:omakase": WandSparkles,
  "assets:both": Images, "assets:photos": Camera, "assets:logo": Stamp, "assets:none": ImageOff, "assets:later": Clock,
  "company:undecided": BadgeQuestionMark,
  "requests:none": Check,
};

function OptionInner({ k, label, check }: { k: string; label: string; check?: boolean }) {
  const Icon = ICONS[k];
  return (
    <>
      {Icon && (
        <span className="fd-ico" aria-hidden="true">
          <Icon strokeWidth={2} />
        </span>
      )}
      <span className="fd-option__label">{label}</span>
      {check && <span className="fd-check" aria-hidden="true" />}
    </>
  );
}

/** 条件で開いた入力欄を、画面内まで自動でスクロールする */
function useRevealScroll<T extends HTMLElement>(block: ScrollLogicalPosition = "center") {
  const ref = useRef<T>(null);
  useEffect(() => {
    const t = window.setTimeout(() => ref.current?.scrollIntoView({ behavior: "smooth", block }), 60);
    return () => window.clearTimeout(t);
  }, [block]);
  return ref;
}

const BOT_FACE = "/images/adofy/free-design/robot-face.webp";

/* ═══════════════════════════════════════════════════════════════════════════ */

export default function FreeDesignChat() {
  const [hydrated, setHydrated] = useState(false);
  const [submissionId, setSubmissionId] = useState("");
  const [startedAt, setStartedAt] = useState(0);
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<HpDesignAnswers>(EMPTY);
  const [done, setDone] = useState<QuestionStep[]>([]);
  const [current, setCurrent] = useState<Step>("industry");
  const [resumed, setResumed] = useState(false);
  const [typing, setTyping] = useState(false);
  const [completed, setCompleted] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const questionRef = useRef<HTMLDivElement>(null);

  /*
    localStorage はブラウザにしか無いため、描画中に読むと hydration error になる。
    ハイドレーション後に一度だけ state へ流し込む（初回マウント時のみ）。
  */
  useEffect(() => {
    const saved = loadSaved();
    /* eslint-disable react-hooks/set-state-in-effect -- 上記の理由により意図的 */
    if (saved) {
      setSubmissionId(saved.submissionId);
      setStartedAt(saved.startedAt);
      setStarted(saved.started);
      setAnswers(saved.answers);
      setDone(saved.done.filter((s) => (QUESTION_STEPS as readonly string[]).includes(s)));
      setCurrent(saved.current);
      setResumed(saved.started);
    } else {
      setSubmissionId(newId());
      setStartedAt(Date.now());
    }
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
    captureAttribution();
  }, []);

  // 途中から再開したときは、いま答える質問まで移動する
  useEffect(() => {
    if (hydrated && resumed) {
      const t = window.setTimeout(() => questionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 250);
      return () => window.clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 再開直後の1回だけ
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated || completed) return;
    persist({ submissionId, startedAt, started, answers, done, current, savedAt: Date.now() });
  }, [hydrated, completed, submissionId, startedAt, started, answers, done, current]);

  const scrollToEnd = useCallback(() => {
    requestAnimationFrame(() => endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }));
  }, []);

  /** 次の質問へ。「入力中…」の演出をはさむ */
  const goTo = useCallback(
    (step: Step) => {
      setTyping(true);
      setCurrent(step);
      scrollToEnd();
      window.setTimeout(() => {
        setTyping(false);
        // 新しい質問が画面の上に来るよう自動でスクロールする（選択肢が下に続いて見える）
        requestAnimationFrame(() =>
          requestAnimationFrame(() => questionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }))
        );
      }, 550);
    },
    [scrollToEnd]
  );

  const update = useCallback((patch: Patch) => {
    setAnswers((a) => ({ ...a, ...(typeof patch === "function" ? patch(a) : patch) }));
  }, []);

  /** 回答を確定して、まだ答えていない最初の質問（無ければ連絡先）へ進む */
  const commit = useCallback(
    (step: QuestionStep, patch: Partial<HpDesignAnswers> = {}) => {
      if (Object.keys(patch).length) update(patch);
      const nextDone = done.includes(step) ? done : [...done, step];
      setDone(nextDone);
      const next = QUESTION_STEPS.find((s) => !nextDone.includes(s)) ?? "contact";
      goTo(next);
    },
    [done, goTo, update]
  );

  const start = () => {
    setStarted(true);
    goTo(QUESTION_STEPS.find((s) => !done.includes(s)) ?? "contact");
  };

  const restart = () => {
    clearSaved();
    setSubmissionId(newId());
    setStartedAt(Date.now());
    setStarted(false);
    setAnswers(EMPTY);
    setDone([]);
    setCurrent("industry");
    setResumed(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const order: Step[] = [...QUESTION_STEPS, "contact"];
  const currentIndex = order.indexOf(current);
  const prevStep = currentIndex > 0 ? order[currentIndex - 1] : null;
  // 現在の質問より前で、回答済みのもの（修正で戻った場合、後ろの回答は一時的に隠す）
  const history = QUESTION_STEPS.filter((s) => done.includes(s) && order.indexOf(s) < currentIndex);
  const progress = completed ? 100 : Math.round((done.length / QUESTION_STEPS.length) * 100);

  const onCompleted = () => {
    clearSaved();
    setCompleted(true);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => questionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }))
    );
  };

  return (
    <div className="fd-chat">
      <div className="fd-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} aria-label="回答の進み具合">
        <div className="fd-progress__bar" style={{ width: `${progress}%` }} />
        <span className="fd-progress__label">
          {completed ? "お申し込み完了" : current === "contact" && started ? "あと少しで完了です" : started ? `${Math.min(done.length + 1, QUESTION_STEPS.length)} / ${QUESTION_STEPS.length} 問` : "約2分で完了"}
        </span>
      </div>

      <div className="fd-thread" aria-live="polite">
        <Welcome />
        <Achievements />
        <Bot name>adofyの集客・求人できるHP制作サービスです。</Bot>
        <Bot>
          {"あなたの会社にぴったりのホームページを無料で作ってみませんか？\n\nこれからいくつか質問をさせていただきます。\n\nご回答をもとに、あなたの会社専用のホームページを作成します。\n\nまずはお気軽にお試しください！"}
        </Bot>
        <FreeScopeNote />

        {!hydrated ? null : !started ? (
          <div className="fd-panel fd-panel--start">
            <button type="button" className="fd-btn fd-btn--primary fd-btn--xl" onClick={start}>
              無料作成をはじめる
            </button>
            <p className="fd-micro">質問は全部で10問・選ぶだけでOKです</p>
          </div>
        ) : (
          <>
            <User>無料作成をはじめる</User>

            {resumed && (
              <div className="fd-resume">
                前回の続きから再開しました。
                <button type="button" onClick={restart}>最初からやり直す</button>
              </div>
            )}

            {history.map((s) => (
              <div key={s} className="fd-group">
                <Bot>{QUESTIONS[s]}</Bot>
                <User onEdit={completed ? undefined : () => goTo(s)}>{answerText(s, answers)}</User>
              </div>
            ))}

            {completed ? (
              <>
                <Bot>{QUESTIONS.contact}</Bot>
                <User>{answers.email}</User>
                <div ref={questionRef} className="fd-anchor" />
                <Completed />
              </>
            ) : (
              <>
                <div ref={questionRef} className="fd-anchor" />
                {typing ? <Typing /> : <Bot key={current} name>{QUESTIONS[current]}</Bot>}
                {!typing && (
                  <div className="fd-panel" key={`panel-${current}`}>
                    <StepInput
                      step={current}
                      answers={answers}
                      update={update}
                      commit={commit}
                      submissionId={submissionId}
                      startedAt={startedAt}
                      onCompleted={onCompleted}
                    />
                    {prevStep && (
                      <button type="button" className="fd-back" onClick={() => goTo(prevStep)}>
                        ← ひとつ前の質問に戻る
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}
        <div ref={endRef} className="fd-end" />
      </div>
    </div>
  );
}

/* ── 吹き出し ─────────────────────────────────────────────────────────── */

function BotAvatar() {
  return (
    <span className="fd-avatar" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={BOT_FACE} alt="" width={96} height={96} decoding="async" />
    </span>
  );
}

function Bot({ children, name }: { children: ReactNode; name?: boolean }) {
  return (
    <div className="fd-msg fd-msg--bot">
      <BotAvatar />
      <div className="fd-msg__body">
        {name && <span className="fd-name">adofy デザイン担当</span>}
        <div className="fd-bubble fd-bubble--bot">{children}</div>
      </div>
    </div>
  );
}

/** 実績（adofy の公開済みの数値。/contact の診断画像と同じ内容） */
const ACHIEVEMENTS = [
  { label: "集客支援実績", value: "100", unit: "社以上" },
  { label: "累計集客数", value: "2,000", unit: "人以上" },
] as const;

function Achievements() {
  return (
    <div className="fd-achv">
      <ul className="fd-achv__list">
        {ACHIEVEMENTS.map((a) => (
          <li key={a.label} className="fd-achv__item">
            <Crown className="fd-achv__crown" aria-hidden="true" fill="currentColor" strokeWidth={1.5} />
            <span className="fd-achv__label">{a.label}</span>
            <span className="fd-achv__value">
              <b>{a.value}</b>
              {a.unit}
            </span>
          </li>
        ))}
      </ul>
      <p className="fd-achv__note">※adofyの支援実績です。成果を保証するものではありません。</p>
    </div>
  );
}

function Welcome() {
  return (
    <div className="fd-welcome">
      <div className="fd-welcome__text">
        <p className="fd-welcome__badges">
          <span className="fd-welcome__eyebrow">どんな業種でもOK</span>
          <span className="fd-welcome__eyebrow fd-welcome__eyebrow--alt">個人事業主の方でもOK！</span>
        </p>
        <p className="fd-welcome__title">
          ホームページを
          <br />
          <span>
            ワクワクしながら
            <br />
            無料で作ろう！
          </span>
        </p>
        <ul className="fd-welcome__chips">
          <li>選ぶだけ</li>
          <li>約2分</li>
          <li>無料で作成</li>
        </ul>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="fd-welcome__img" src="/images/adofy/free-design/robot-full.webp" alt="" width={152} height={200} fetchPriority="high" />
    </div>
  );
}

function User({ children, onEdit }: { children: ReactNode; onEdit?: () => void }) {
  return (
    <div className="fd-msg fd-msg--user">
      {onEdit && (
        <button type="button" className="fd-edit" onClick={onEdit}>
          修正
        </button>
      )}
      <div className="fd-bubble fd-bubble--user">{children}</div>
    </div>
  );
}

function Typing() {
  return (
    <div className="fd-msg fd-msg--bot">
      <BotAvatar />
      <div className="fd-bubble fd-bubble--bot fd-typing" aria-label="入力中">
        <span /><span /><span />
      </div>
    </div>
  );
}

function FreeScopeNote() {
  return (
    <p className="fd-scope">
      ※無料でご提供するのは、<b>ホームページのデザイン案の作成とご確認</b>までです。
    </p>
  );
}

function Completed() {
  return (
    <div className="fd-done">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="fd-done__chara" src="/images/adofy/free-design/robot-full.webp" alt="" width={114} height={150} />
      <p className="fd-done__title">お申し込みありがとうございます！</p>
      <p className="fd-done__text">
        ご回答いただいた内容をもとに、ホームページを制作いたします。
        <br />
        <br />
        完成しましたら、メールでお知らせいたします。
        <br />
        <br />
        楽しみにお待ちください！
      </p>
      <div className="fd-mailnote">
        <p className="fd-mailnote__title">📩 メールが届かないときは</p>
        <p>
          完成したホームページは、ご登録のメールアドレスに<b>メールでお送りします</b>。
          お使いのメールの設定によっては、<b>迷惑メールフォルダ</b>や「プロモーション」タブに振り分けられることがあります。
        </p>
        <p>
          届かない場合はそちらもご確認いただき、adofyからのメールを「迷惑メールではない」に設定してください。
          本日、受付確認メールもお送りしています。
        </p>
      </div>
    </div>
  );
}

/* ── 各質問の入力欄 ───────────────────────────────────────────────────── */

type Patch = Partial<HpDesignAnswers> | ((a: HpDesignAnswers) => Partial<HpDesignAnswers>);

type InputProps = {
  step: Step;
  answers: HpDesignAnswers;
  update: (patch: Patch) => void;
  commit: (step: QuestionStep, patch?: Partial<HpDesignAnswers>) => void;
  submissionId: string;
  startedAt: number;
  onCompleted: () => void;
};

function StepInput(p: InputProps) {
  switch (p.step) {
    case "industry": return <IndustryInput {...p} />;
    case "company": return <CompanyInput {...p} />;
    case "purposes": return <MultiInput {...p} step="purposes" />;
    case "style": return <StyleInput {...p} />;
    case "color": return <ColorInput {...p} />;
    case "contents": return <MultiInput {...p} step="contents" />;
    case "website": return <WebsiteInput {...p} />;
    case "reference": return <ReferenceInput {...p} />;
    case "assets": return <AssetsInput {...p} />;
    case "requests": return <RequestsInput {...p} />;
    case "contact": return <ContactInput {...p} />;
  }
}

function RevealSub({ children }: { children: ReactNode }) {
  const ref = useRevealScroll<HTMLDivElement>();
  return <div ref={ref} className="fd-sub">{children}</div>;
}

/** 開いた内容の先頭を画面上部に合わせる（長い選択肢一覧向け） */
function RevealTop({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRevealScroll<HTMLDivElement>("start");
  return <div ref={ref} className={className}>{children}</div>;
}

function RevealInline({ children }: { children: ReactNode }) {
  const ref = useRevealScroll<HTMLDivElement>();
  return <div ref={ref} className="fd-inline">{children}</div>;
}

function ErrorText({ children }: { children: ReactNode }) {
  return children ? <p className="fd-error" role="alert">{children}</p> : null;
}

function IndustryInput({ answers, update, commit }: InputProps) {
  const [error, setError] = useState("");
  // 業種を選んだ後は一覧を畳み、詳しい種類の選択に進む（「選び直す」で一覧に戻れる）
  const [picking, setPicking] = useState(!answers.industry);
  const industry = INDUSTRIES.find((o) => o.id === answers.industry);
  const subs = INDUSTRY_SUBS[answers.industry] ?? [];
  const detailIsOther = Boolean(answers.industryDetail) && !subs.includes(answers.industryDetail);
  const [otherDetail, setOtherDetail] = useState(detailIsOther);

  const pick = (id: string) => {
    if (id !== answers.industry) update({ industry: id, industryDetail: "", industryOther: "" });
    setOtherDetail(false);
    setPicking(false);
    setError("");
  };

  const button = (o: (typeof INDUSTRIES)[number]) => (
    <button
      key={o.id}
      type="button"
      className={`fd-option ${answers.industry === o.id ? "is-selected" : ""}`}
      aria-pressed={answers.industry === o.id}
      onClick={() => pick(o.id)}
    >
      <OptionInner k={`industry:${o.id}`} label={o.label} />
    </button>
  );

  if (picking || !industry) {
    return (
      <>
        {INDUSTRY_GROUPS.map((g) => (
          <div key={g.id} className="fd-group-block">
            <p className="fd-group-label">{g.label}</p>
            <div className="fd-options fd-options--2">{INDUSTRIES.filter((o) => o.group === g.id).map(button)}</div>
          </div>
        ))}
      </>
    );
  }

  return (
    <RevealTop key={industry.id} className="fd-picked-wrap">
      <div className="fd-picked">
        <span className="fd-ico" aria-hidden="true">
          {(() => {
            const Icon = ICONS[`industry:${industry.id}`];
            return Icon ? <Icon strokeWidth={2} /> : null;
          })()}
        </span>
        <span className="fd-picked__label">{industry.label}</span>
        <button type="button" className="fd-picked__change" onClick={() => setPicking(true)}>
          選び直す
        </button>
      </div>

      {industry.id === "other" ? (
        <RevealInline>
          <input
            className="fd-input"
            value={answers.industryOther}
            onChange={(e) => update({ industryOther: e.target.value })}
            placeholder="例）占い、リサイクルショップ など"
            maxLength={LIMITS.short}
            autoFocus
          />
          <button
            type="button"
            className="fd-btn fd-btn--primary"
            onClick={() => (answers.industryOther.trim() ? commit("industry") : setError("業種を入力してください"))}
          >
            次へ
          </button>
          <ErrorText>{error}</ErrorText>
        </RevealInline>
      ) : (
        <div className="fd-sub">
          <p className="fd-sub__q">どのような{industry.label}ですか？</p>
          <div className="fd-chips">
            {subs.map((label) => (
              <button
                key={label}
                type="button"
                className={`fd-chip ${answers.industryDetail === label ? "is-selected" : ""}`}
                aria-pressed={answers.industryDetail === label}
                onClick={() => commit("industry", { industryDetail: label })}
              >
                {label}
              </button>
            ))}
            <button
              type="button"
              className={`fd-chip ${otherDetail ? "is-selected" : ""}`}
              aria-pressed={otherDetail}
              onClick={() => {
                setOtherDetail(true);
                if (subs.includes(answers.industryDetail)) update({ industryDetail: "" });
              }}
            >
              その他
            </button>
          </div>
          {otherDetail && (
            <RevealInline>
              <input
                className="fd-input"
                value={answers.industryDetail}
                onChange={(e) => update({ industryDetail: e.target.value })}
                placeholder="詳しい内容を入力"
                maxLength={LIMITS.short}
                autoFocus
              />
              <button
                type="button"
                className="fd-btn fd-btn--primary"
                onClick={() => (answers.industryDetail.trim() ? commit("industry") : setError("内容を入力してください"))}
              >
                次へ
              </button>
              <ErrorText>{error}</ErrorText>
            </RevealInline>
          )}
        </div>
      )}
    </RevealTop>
  );
}

function CompanyInput({ answers, update, commit }: InputProps) {
  const [error, setError] = useState("");
  return (
    <>
      <div className="fd-inline">
        <input
          className="fd-input"
          value={answers.companyUndecided ? "" : answers.companyName}
          onChange={(e) => update({ companyName: e.target.value, companyUndecided: false })}
          placeholder="例）株式会社adofy工業"
          maxLength={LIMITS.short}
          autoComplete="organization"
          enterKeyHint="next"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.nativeEvent.isComposing && answers.companyName.trim()) commit("company");
          }}
        />
        <button
          type="button"
          className="fd-btn fd-btn--primary"
          onClick={() => (answers.companyName.trim() && !answers.companyUndecided ? commit("company") : setError("会社名・店舗名を入力するか「未定」を選んでください"))}
        >
          次へ
        </button>
      </div>
      <ErrorText>{error}</ErrorText>
      <button type="button" className="fd-option fd-option--sub" onClick={() => commit("company", { companyName: "", companyUndecided: true })}>
        <OptionInner k="company:undecided" label="まだ決まっていない（未定）" />
      </button>
    </>
  );
}

function MultiInput({ answers, update, commit, step }: InputProps & { step: "purposes" | "contents" }) {
  const [error, setError] = useState("");
  const list = step === "purposes" ? PURPOSES : CONTENTS;
  const selected = step === "purposes" ? answers.purposes : answers.contents;
  const otherKey = step === "purposes" ? "purposeOther" : "contentOther";
  const otherValue = answers[otherKey];

  const toggle = (id: string) => {
    let next = selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id];
    // 「おまかせ」と個別の選択は両立させない
    if (id === "omakase" && next.includes("omakase")) next = ["omakase"];
    else if (id !== "omakase") next = next.filter((x) => x !== "omakase");
    update(step === "purposes" ? { purposes: next } : { contents: next });
    setError("");
  };

  return (
    <>
      <div className="fd-options fd-options--2">
        {list.map((o) => {
          const on = selected.includes(o.id);
          return (
            <button key={o.id} type="button" className={`fd-option fd-option--check ${on ? "is-selected" : ""}`} aria-pressed={on} onClick={() => toggle(o.id)}>
              <OptionInner k={`${step}:${o.id}`} label={o.label} check />
            </button>
          );
        })}
      </div>
      {selected.includes("other") && (
        <RevealInline>
          <input
            className="fd-input fd-input--block"
            value={otherValue}
            onChange={(e) => update({ [otherKey]: e.target.value } as Partial<HpDesignAnswers>)}
            placeholder="その他の内容（任意）"
            maxLength={LIMITS.short}
          />
        </RevealInline>
      )}
      <ErrorText>{error}</ErrorText>
      {/* 選んだあとすぐ押せるよう、次へボタンは画面下に追従させる */}
      <button
        type="button"
        className="fd-btn fd-btn--primary fd-btn--block fd-btn--sticky"
        onClick={() => (selected.length ? commit(step) : setError("1つ以上選んでください"))}
      >
        {selected.length ? `${selected.length}件を選んで次へ` : "選んで次へ"}
      </button>
    </>
  );
}

function StyleInput({ answers, commit }: InputProps) {
  return (
    <div className="fd-options fd-options--cards">
      {STYLES.map((o) => (
        <button
          key={o.id}
          type="button"
          className={`fd-card ${answers.designStyle === o.id ? "is-selected" : ""}`}
          aria-pressed={answers.designStyle === o.id}
          onClick={() => commit("style", { designStyle: o.id })}
        >
          <DesignSample style={o.id} industry={answers.industry || "construction"} />
          <span className="fd-card__label">{o.label}</span>
        </button>
      ))}
    </div>
  );
}

function ColorInput({ answers, update, commit }: InputProps) {
  return (
    <>
      <div className="fd-options fd-options--4">
        {COLORS.map((o) => (
          <button
            key={o.id}
            type="button"
            className={`fd-color ${answers.mainColor === o.id ? "is-selected" : ""}`}
            aria-pressed={answers.mainColor === o.id}
            onClick={() => (o.id === "other" ? update({ mainColor: "other" }) : commit("color", { mainColor: o.id, colorOther: "" }))}
          >
            <span
              className={`fd-color__dot ${o.id === "other" ? "is-rainbow" : ""} ${o.id === "omakase" ? "is-omakase" : ""}`}
              style={o.swatch ? { background: o.swatch } : undefined}
              aria-hidden="true"
            >
              {o.id === "omakase" ? "?" : null}
            </span>
            <span className="fd-color__label">{o.label}</span>
          </button>
        ))}
      </div>
      {answers.mainColor === "other" && (
        <RevealInline>
          <input
            className="fd-input"
            value={answers.colorOther}
            onChange={(e) => update({ colorOther: e.target.value })}
            placeholder="例）オレンジ、紺色、会社のロゴの色"
            maxLength={LIMITS.short}
            autoFocus
          />
          <button type="button" className="fd-btn fd-btn--primary" onClick={() => commit("color")}>
            次へ
          </button>
        </RevealInline>
      )}
    </>
  );
}

function WebsiteInput({ answers, update, commit }: InputProps) {
  const [error, setError] = useState("");
  const next = () => {
    if (answers.websiteUrl.trim() && !normalizeUrl(answers.websiteUrl)) {
      setError("URLの形式が正しくありません（分からない場合は空欄のまま進めます）");
      return;
    }
    commit("website");
  };
  return (
    <>
      <div className="fd-options fd-options--2">
        {WEBSITE_CHOICES.map((o) => (
          <button
            key={o.id}
            type="button"
            className={`fd-option ${answers.hasWebsite === o.id ? "is-selected" : ""}`}
            aria-pressed={answers.hasWebsite === o.id}
            onClick={() => (o.id === "yes" ? update({ hasWebsite: "yes" }) : commit("website", { hasWebsite: "no", websiteUrl: "" }))}
          >
            <OptionInner k={`website:${o.id}`} label={o.label} />
          </button>
        ))}
      </div>
      {answers.hasWebsite === "yes" && (
        <RevealSub>
          <p className="fd-sub__q">現在のホームページのURLを教えてください。（任意）</p>
          <input
            className="fd-input fd-input--block"
            type="url"
            inputMode="url"
            value={answers.websiteUrl}
            onChange={(e) => { update({ websiteUrl: e.target.value }); setError(""); }}
            placeholder="https://example.com"
            maxLength={LIMITS.url}
          />
          <ErrorText>{error}</ErrorText>
          <div className="fd-row">
            <button type="button" className="fd-btn fd-btn--ghost" onClick={() => commit("website", { websiteUrl: "" })}>
              スキップ
            </button>
            <button type="button" className="fd-btn fd-btn--primary" onClick={next}>
              次へ
            </button>
          </div>
        </RevealSub>
      )}
    </>
  );
}

function ReferenceInput({ answers, update, commit }: InputProps) {
  const [error, setError] = useState("");
  const urls = answers.referenceUrls.length ? answers.referenceUrls : [""];
  const setUrl = (i: number, v: string) => {
    update({ referenceUrls: urls.map((u, j) => (j === i ? v : u)) });
    setError("");
  };
  const next = () => {
    const filled = urls.map((u) => u.trim()).filter(Boolean);
    if (filled.some((u) => !normalizeUrl(u))) {
      setError("URLの形式が正しくありません");
      return;
    }
    commit("reference", { referenceUrls: filled.length ? filled : [""] });
  };
  return (
    <>
      <div className="fd-options fd-options--3">
        {REFERENCE_CHOICES.map((o) => (
          <button
            key={o.id}
            type="button"
            className={`fd-option ${answers.referenceChoice === o.id ? "is-selected" : ""}`}
            aria-pressed={answers.referenceChoice === o.id}
            onClick={() => (o.id === "yes" ? update({ referenceChoice: "yes" }) : commit("reference", { referenceChoice: o.id, referenceUrls: [""] }))}
          >
            <OptionInner k={`reference:${o.id}`} label={o.label} />
          </button>
        ))}
      </div>
      {answers.referenceChoice === "yes" && (
        <RevealSub>
          <p className="fd-sub__q">参考にしたいホームページのURLを教えてください。</p>
          {urls.map((u, i) => (
            <div key={i} className="fd-url-row">
              <input
                className="fd-input fd-input--block"
                type="url"
                inputMode="url"
                value={u}
                onChange={(e) => setUrl(i, e.target.value)}
                placeholder="https://example.com"
                maxLength={LIMITS.url}
                aria-label={`参考URL ${i + 1}`}
              />
              {urls.length > 1 && (
                <button type="button" className="fd-icon-btn" aria-label={`参考URL ${i + 1} を削除`} onClick={() => update({ referenceUrls: urls.filter((_, j) => j !== i) })}>
                  ×
                </button>
              )}
            </div>
          ))}
          {urls.length < LIMITS.referenceUrls && (
            <button type="button" className="fd-add" onClick={() => update({ referenceUrls: [...urls, ""] })}>
              ＋ URLを追加する
            </button>
          )}
          <ErrorText>{error}</ErrorText>
          <div className="fd-row">
            <button type="button" className="fd-btn fd-btn--ghost" onClick={() => commit("reference", { referenceUrls: [""] })}>
              スキップ
            </button>
            <button type="button" className="fd-btn fd-btn--primary" onClick={next}>
              次へ
            </button>
          </div>
        </RevealSub>
      )}
    </>
  );
}

/* ── 写真・ロゴ ──────────────────────────────────────────────────────── */

function guessType(file: File): string {
  if (file.type) return file.type.toLowerCase();
  // iPhone の HEIC などで type が空になることがある
  const ext = file.name.split(".").pop()?.toLowerCase();
  return ext === "heic" ? "image/heic" : ext === "heif" ? "image/heif" : "";
}

function AssetsInput({ answers, update, commit, submissionId }: InputProps) {
  const [busy, setBusy] = useState(0);
  const [error, setError] = useState("");
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const objectUrls = useRef<string[]>([]);
  const showUpload = (ASSET_CHOICES_WITH_UPLOAD as readonly string[]).includes(answers.assetsChoice);

  // プレビュー用のURLは、この入力欄を閉じるときにまとめて解放する
  useEffect(() => {
    const urls = objectUrls.current;
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, []);

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setError("");
    const room = MAX_UPLOAD_FILES - answers.uploads.length;
    const list = Array.from(files).slice(0, Math.max(room, 0));
    if (files.length > room) setError(`アップロードできるのは${MAX_UPLOAD_FILES}枚までです`);

    const supabase = createClient();
    for (const file of list) {
      const type = guessType(file);
      if (!ALLOWED_UPLOAD_TYPES[type]) {
        setError("JPEG・PNG・WebP・HEIC形式の画像を選んでください");
        continue;
      }
      if (file.size > MAX_UPLOAD_SIZE) {
        setError(`「${file.name}」は10MBを超えているためアップロードできません`);
        continue;
      }
      setBusy((n) => n + 1);
      try {
        const res = await fetch("/api/free-design/upload-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ submissionId, type, size: file.size }),
        });
        const j = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(j.error ?? "アップロードに失敗しました");
        const { error: upErr } = await supabase.storage
          .from(UPLOAD_BUCKET)
          .uploadToSignedUrl(j.path, j.token, file, { contentType: type });
        if (upErr) throw new Error("アップロードに失敗しました");
        const entry: UploadedFile = { path: j.path, name: file.name.slice(0, 200), size: file.size, type };
        update((a) => ({ uploads: [...a.uploads, entry].slice(0, MAX_UPLOAD_FILES) }));
        if (type !== "image/heic" && type !== "image/heif") {
          const url = URL.createObjectURL(file);
          objectUrls.current.push(url);
          setPreviews((p) => ({ ...p, [entry.path]: url }));
        }
      } catch (e) {
        setError(`${e instanceof Error ? e.message : "アップロードに失敗しました"}（写真がなくてもお申し込みいただけます）`);
      } finally {
        setBusy((n) => n - 1);
      }
    }
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <>
      <div className="fd-options fd-options--2">
        {ASSET_CHOICES.map((o) => (
          <button
            key={o.id}
            type="button"
            className={`fd-option ${answers.assetsChoice === o.id ? "is-selected" : ""}`}
            aria-pressed={answers.assetsChoice === o.id}
            onClick={() =>
              (ASSET_CHOICES_WITH_UPLOAD as readonly string[]).includes(o.id)
                ? update({ assetsChoice: o.id })
                : commit("assets", { assetsChoice: o.id, uploads: [] })
            }
          >
            <OptionInner k={`assets:${o.id}`} label={o.label} />
          </button>
        ))}
      </div>
      {showUpload && (
        <RevealSub>
          <p className="fd-sub__q">よろしければ、写真やロゴをアップロードしてください。（任意）</p>
          <p className="fd-micro">JPEG・PNG・WebP・HEIC／1枚10MBまで・最大{MAX_UPLOAD_FILES}枚。後からメールで送っていただくこともできます。足りない写真やロゴは、仮のものをこちらで制作します。</p>
          <label className={`fd-drop ${busy ? "is-busy" : ""}`}>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
              multiple
              onChange={(e) => onFiles(e.target.files)}
              disabled={busy > 0 || answers.uploads.length >= MAX_UPLOAD_FILES}
            />
            {busy ? "アップロード中…" : "＋ 画像を選ぶ"}
          </label>
          {answers.uploads.length > 0 && (
            <ul className="fd-files">
              {answers.uploads.map((f) => (
                <li key={f.path}>
                  {previews[f.path] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={previews[f.path]} alt="" />
                  ) : (
                    <span className="fd-files__ph" aria-hidden="true">IMG</span>
                  )}
                  <span className="fd-files__name">{f.name}</span>
                  <button type="button" aria-label={`${f.name} を取り消す`} onClick={() => update((a) => ({ uploads: a.uploads.filter((x) => x.path !== f.path) }))}>
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
          <ErrorText>{error}</ErrorText>
          <button type="button" className="fd-btn fd-btn--primary fd-btn--block" disabled={busy > 0} onClick={() => commit("assets")}>
            {answers.uploads.length ? "次へ" : "アップロードせずに次へ"}
          </button>
        </RevealSub>
      )}
    </>
  );
}

function RequestsInput({ answers, update, commit }: InputProps) {
  return (
    <>
      <textarea
        className="fd-input fd-textarea"
        value={answers.otherRequests}
        onChange={(e) => update({ otherRequests: e.target.value })}
        placeholder={"例）\nお問い合わせを増やしたい\nスマホで見やすくしたい\n写真を大きく表示したい\n同業他社よりかっこよくしたい"}
        maxLength={LIMITS.text}
        rows={5}
      />
      <div className="fd-row">
        <button type="button" className="fd-btn fd-btn--ghost" onClick={() => commit("requests", { otherRequests: "" })}>
          <Check className="fd-btn__ico" aria-hidden="true" />
          特になし
        </button>
        <button type="button" className="fd-btn fd-btn--primary" disabled={!answers.otherRequests.trim()} onClick={() => commit("requests")}>
          次へ
        </button>
      </div>
    </>
  );
}

/* ── 連絡先・送信 ────────────────────────────────────────────────────── */

function ContactInput({ answers, update, submissionId, startedAt, onCompleted }: InputProps) {
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const sendingRef = useRef(false);

  const fieldErrors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!answers.contactName.trim()) e.contactName = "ご担当者名を入力してください";
    if (!answers.email.trim()) e.email = "メールアドレスを入力してください";
    else if (!isValidEmail(answers.email.trim())) e.email = "メールアドレスの形式が正しくありません";
    if (answers.phone.trim() && !isValidPhone(normalizePhone(answers.phone))) e.phone = "電話番号の形式が正しくありません（空欄でも送信できます）";
    if (!agreed) e.agreed = "個人情報の取り扱いに同意してください";
    return e;
  }, [answers.contactName, answers.email, answers.phone, agreed]);

  const submit = async () => {
    // 二重送信防止（state の反映を待たずに止める）
    if (sendingRef.current) return;
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length) return;

    sendingRef.current = true;
    setSending(true);
    setServerError("");
    try {
      const attr = captureAttribution();
      const res = await fetch("/api/free-design/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...answers,
          submissionId,
          privacyAgreed: true,
          website2: honeypot,
          elapsedMs: Date.now() - startedAt,
          utm: {
            ...attr.utm,
            referrer: attr.referrer,
            landing_page: attr.landingPage,
            device_type: /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop",
          },
        }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        setServerError(j.error ?? "送信に失敗しました。時間をおいて再度お試しください。");
        return;
      }
      if (!j.duplicate) {
        fireAdofyLead("free_design_chat");
        fireAdofyPurchase("free_design_chat", submissionId);
        fireLpInsightLead("lead", 1);
      }
      onCompleted();
    } catch {
      setServerError("通信エラーで送信できませんでした。電波の良い場所で、もう一度「ホームページを無料で作る」を押してください。");
    } finally {
      sendingRef.current = false;
      setSending(false);
    }
  };

  const err = (k: string) => errors[k] && fieldErrors[k];

  return (
    <form
      className="fd-form"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
    >
      <label className="fd-field">
        <span className="fd-field__label">ご担当者名<em>必須</em></span>
        <input className="fd-input fd-input--block" value={answers.contactName} onChange={(e) => update({ contactName: e.target.value })} autoComplete="name" maxLength={LIMITS.short} placeholder="例）山田 太郎" aria-invalid={Boolean(err("contactName"))} />
        <ErrorText>{err("contactName")}</ErrorText>
      </label>
      <label className="fd-field">
        <span className="fd-field__label">メールアドレス<em>必須</em></span>
        <input className="fd-input fd-input--block" type="email" inputMode="email" value={answers.email} onChange={(e) => update({ email: e.target.value })} autoComplete="email" maxLength={254} placeholder="例）info@example.com" aria-invalid={Boolean(err("email"))} />
        <ErrorText>{err("email")}</ErrorText>
      </label>
      <label className="fd-field">
        <span className="fd-field__label">電話番号<em className="is-optional">任意</em></span>
        <input className="fd-input fd-input--block" type="tel" inputMode="tel" value={answers.phone} onChange={(e) => update({ phone: e.target.value })} autoComplete="tel" maxLength={20} placeholder="例）090-1234-5678" aria-invalid={Boolean(err("phone"))} />
        <ErrorText>{err("phone")}</ErrorText>
      </label>

      {/* ハニーポット：人間には見えない。値が入っていればボットとみなす */}
      <input className="fd-hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} name="website2" />

      <div className="fd-privacy">
        <p className="fd-privacy__title">個人情報の利用目的</p>
        <p>{PURPOSE_OF_USE}</p>
        <a href={PRIVACY_POLICY_HREF}>プライバシーポリシーを見る（ページ下部）</a>
      </div>
      <label className={`fd-agree ${err("agreed") ? "is-error" : ""}`}>
        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
        <span>個人情報の利用目的とプライバシーポリシーに同意する</span>
      </label>
      <ErrorText>{err("agreed")}</ErrorText>

      <FreeScopeNote />
      {serverError && <p className="fd-error fd-error--box" role="alert">{serverError}</p>}

      <button type="submit" className="fd-btn fd-btn--primary fd-btn--xl fd-btn--block" disabled={sending}>
        {sending ? "送信中…" : "ホームページを無料で作る"}
      </button>
    </form>
  );
}
