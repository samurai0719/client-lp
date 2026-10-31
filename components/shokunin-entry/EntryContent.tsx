"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Check } from "lucide-react";
import { PREFECTURES, birthYearOptions, isValidEmail, normalizeDriverPhone, normalizePostalCode } from "@/components/driver/questions";
import { fireAdofyLead } from "@/lib/analytics/adofyPixel";
import { ChoiceButton, EntryFooter, EntryHeader, NextButton, Question, QuestionHead, ServiceFlow, StepHeader } from "./parts";
import {
  AREA_PREFECTURES,
  CONTACT_TIMES,
  DESIRED_AREAS,
  DESIRED_SALARIES,
  DESIRED_TIMINGS,
  DESIRED_TRADES,
  EMPLOYMENT_STATUSES,
  EMPTY_ANSWERS,
  EMPTY_CONTACT,
  EXPERIENCED_TRADES,
  EXPERIENCE_YEARS,
  MOTIVATIONS,
  NEAR_HOME,
  NO_EXPERIENCE,
  NO_PREFERENCE,
  PRIORITIES,
  TOTAL_STEPS,
  UNDECIDED_AREA,
  isStepComplete,
  type EntryAnswers,
  type EntryContact,
} from "./questions";

/**
 * 建設職人の無料登録LP（全6ステップ・1ページ最大2問）。操作の流れはドラテクの求職者LP（components/driver/DriverContent）と同じ。
 *   1 = ファーストビュー + 今のお気持ち → 転職時期
 *   2 = 経験職種（複数） + 経験年数
 *   3 = 希望職種（複数） + 現在の状況
 *   4 = 住所 + 希望勤務エリア
 *   5 = 重視すること + 希望年収
 *   6 = 連絡先入力（無料登録）
 *
 * 回答が揃うと自動で次へ進む。戻る（画面の戻る・ブラウザの戻る）でも回答と入力内容は消さない。
 */
type Step = 1 | 2 | 3 | 4 | 5 | 6;
type MultiKey = "experiencedTrades" | "desiredTrades";

const EXCLUSIVE: Record<MultiKey, string> = { experiencedTrades: NO_EXPERIENCE, desiredTrades: NO_PREFERENCE };

/** 1ページに2問あるステップの、最初の質問のキー（答えたら2問目へ自動でスクロールする） */
const FIRST_QUESTION: Partial<Record<Step, keyof EntryAnswers>> = {
  2: "experiencedTrades",
  3: "desiredTrades",
  5: "topPriority",
};

const MULTI_SCROLL_DELAY = 450;
const SINGLE_SCROLL_DELAY = 30;

const MISSING_MESSAGE: Record<number, string> = {
  2: "経験した職種と経験年数を選んでください",
  3: "希望する仕事と現在の状況を選んでください",
};

const LEAD_SENT_KEY = "shokunin_entry_lead_sent";

/** 流入計測。最初に開いたときの URL から取る（ステップを進めても変わらない） */
function readAttribution() {
  const sp = new URLSearchParams(window.location.search);
  const utm = (k: string) => sp.get(k);
  return {
    utm_source: utm("utm_source"),
    utm_medium: utm("utm_medium"),
    utm_campaign: utm("utm_campaign"),
    utm_content: utm("utm_content"),
    utm_term: utm("utm_term"),
    fbclid: utm("fbclid"),
    referrer: document.referrer || null,
    landing_url: window.location.href,
    landedAt: Date.now(),
  };
}

function readCookie(name: string): string | null {
  const hit = document.cookie.split("; ").find((c) => c.startsWith(`${name}=`));
  return hit ? decodeURIComponent(hit.slice(name.length + 1)) : null;
}

/** Lead は新規登録の保存に成功したときだけ、1回だけ送る（再読み込みや再送信でも重複させない） */
function fireLeadOnce() {
  try {
    if (sessionStorage.getItem(LEAD_SENT_KEY)) return;
    sessionStorage.setItem(LEAD_SENT_KEY, "1");
  } catch {
    // 保存できない環境でも、1回の送信につき1回は送る
  }
  fireAdofyLead("shokunin-entry");
}

export default function EntryContent() {
  const [step, setStep] = useState<Step>(1);
  const [answers, setAnswers] = useState<EntryAnswers>(EMPTY_ANSWERS);
  const [contact, setContact] = useState<EntryContact>(EMPTY_CONTACT);
  const [done, setDone] = useState(false);
  const [stepError, setStepError] = useState<string | null>(null);
  const attribution = useRef<ReturnType<typeof readAttribution> | null>(null);
  const secondQuestion = useRef<HTMLDivElement>(null);
  const scrollTimer = useRef<number | undefined>(undefined);

  const scrollToSecond = useCallback((delay: number) => {
    window.clearTimeout(scrollTimer.current);
    scrollTimer.current = window.setTimeout(() => {
      secondQuestion.current?.scrollIntoView({ behavior: smoothScroll(), block: "start" });
    }, delay);
  }, []);

  useEffect(() => () => window.clearTimeout(scrollTimer.current), []);

  // ステップが変わったら、新しいページの一番上から表示する
  useLayoutEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [step, done]);

  useEffect(() => {
    attribution.current = readAttribution();
    window.history.replaceState({ ...window.history.state, entryStep: 1 }, "");
    const onPop = (e: PopStateEvent) => {
      const s = (e.state as { entryStep?: number } | null)?.entryStep;
      setStepError(null);
      window.clearTimeout(scrollTimer.current);
      setStep(s && s >= 1 && s <= TOTAL_STEPS ? (s as Step) : 1);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const goTo = useCallback((next: Step) => {
    window.clearTimeout(scrollTimer.current);
    setStepError(null);
    setStep(next);
    window.history.pushState({ ...window.history.state, entryStep: next }, "");
  }, []);

  const goBack = () => window.history.back();

  const answerOne = (key: keyof EntryAnswers, value: string) => {
    const next = { ...answers, [key]: value };
    setAnswers(next);
    setStepError(null);
    if (isStepComplete(step, next) && step < TOTAL_STEPS) goTo((step + 1) as Step);
    else if (FIRST_QUESTION[step] === key) scrollToSecond(SINGLE_SCROLL_DELAY);
  };

  /** 複数選択を切り替える。「建設業は未経験」「特に決めていない」は他と同時に選べない */
  const toggle = (key: MultiKey, value: string) => {
    setStepError(null);
    const current = answers[key];
    const only = EXCLUSIVE[key];
    let next: string[];
    if (current.includes(value)) next = current.filter((v) => v !== value);
    else if (value === only) next = [value];
    else next = [...current.filter((v) => v !== only), value];
    setAnswers((prev) => ({ ...prev, [key]: next }));
    if (FIRST_QUESTION[step] === key && next.includes(value)) {
      scrollToSecond(value === only ? SINGLE_SCROLL_DELAY : MULTI_SCROLL_DELAY);
    }
  };

  const tryNext = () => {
    if (isStepComplete(step, answers)) goTo((step + 1) as Step);
    else setStepError(MISSING_MESSAGE[step] ?? "未回答の質問があります");
  };

  const changeLocation = useCallback((patch: Partial<EntryAnswers>) => setAnswers((prev) => ({ ...prev, ...patch })), []);

  const submit = async (website: string) => {
    const a = attribution.current;
    // ブラウザに _fbc が無くても fbclid があれば同じ形式で組み立てる
    const fbc = readCookie("_fbc") ?? (a?.fbclid ? `fb.1.${a.landedAt}.${a.fbclid}` : null);
    const res = await fetch("/api/shokunin-entry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...contact, website, answers, attribution: { ...a, fbc, fbp: readCookie("_fbp") } }),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string; isNew?: boolean };
    if (!res.ok) throw new Error(data.error ?? "");
    if (data.isNew) fireLeadOnce();
    setDone(true);
    window.history.replaceState({ ...window.history.state, entryStep: TOTAL_STEPS }, "");
  };

  return (
    <div className="se-shell">
      <div className="se-card">
        <main>
          {step === 1 && !done && (
            <Hero
              motivation={answers.motivation}
              desiredTiming={answers.desiredTiming}
              onMotivation={(v) => setAnswers((prev) => ({ ...prev, motivation: v }))}
              onTiming={(v) => answerOne("desiredTiming", v)}
            />
          )}

          {(step >= 2 || done) && (
            <>
              <EntryHeader />
              <StepHeader step={done ? TOTAL_STEPS : step} total={TOTAL_STEPS} onBack={goBack} completed={done} />
            </>
          )}

          {done ? (
            <Complete />
          ) : (
            <>
              {step === 2 && (
                <StepBody>
                  <Question
                    index={1}
                    mode="multi"
                    question="これまで経験した職種を教えてください"
                    choices={EXPERIENCED_TRADES}
                    values={answers.experiencedTrades}
                    onToggle={(v) => toggle("experiencedTrades", v)}
                  />
                  <div ref={secondQuestion} className="se-anchor">
                    <Question
                      index={2}
                      question="建設業の経験はどのくらいありますか？"
                      choices={EXPERIENCE_YEARS}
                      value={answers.experienceYears}
                      onSelect={(v) => answerOne("experienceYears", v)}
                    />
                  </div>
                  <NextButton error={stepError} onClick={tryNext} />
                </StepBody>
              )}

              {step === 3 && (
                <StepBody>
                  <Question
                    index={1}
                    mode="multi"
                    question="希望する仕事を教えてください"
                    choices={DESIRED_TRADES}
                    values={answers.desiredTrades}
                    onToggle={(v) => toggle("desiredTrades", v)}
                  />
                  <div ref={secondQuestion} className="se-anchor">
                    <Question
                      index={2}
                      question="現在の状況を教えてください"
                      choices={EMPLOYMENT_STATUSES}
                      value={answers.employmentStatus}
                      onSelect={(v) => answerOne("employmentStatus", v)}
                    />
                  </div>
                  <NextButton error={stepError} onClick={tryNext} />
                </StepBody>
              )}

              {step === 4 && (
                <StepBody>
                  <LocationStep answers={answers} onChange={changeLocation} onNext={() => goTo(5)} />
                </StepBody>
              )}

              {step === 5 && (
                <StepBody>
                  <Question
                    index={1}
                    question="転職先で最も重視することを教えてください"
                    hint="ひとつ選んでください"
                    choices={PRIORITIES}
                    value={answers.topPriority}
                    onSelect={(v) => answerOne("topPriority", v)}
                  />
                  <div ref={secondQuestion} className="se-anchor">
                    <Question
                      index={2}
                      question="希望する年収を教えてください"
                      choices={DESIRED_SALARIES}
                      value={answers.desiredSalary}
                      onSelect={(v) => answerOne("desiredSalary", v)}
                    />
                  </div>
                </StepBody>
              )}

              {step === 6 && <RegisterForm contact={contact} onChange={(p) => setContact((prev) => ({ ...prev, ...p }))} onSubmit={submit} />}
            </>
          )}

          <EntryFooter />
        </main>
      </div>
    </div>
  );
}

function smoothScroll(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

function StepBody({ children }: { children: ReactNode }) {
  return <section className="se-step">{children}</section>;
}

const FV_POINTS = ["登録・利用は完全無料", "建設業に特化", "面接するかは自分で決められる"];

function Hero({
  motivation,
  desiredTiming,
  onMotivation,
  onTiming,
}: {
  motivation: string;
  desiredTiming: string;
  onMotivation: (v: string) => void;
  onTiming: (v: string) => void;
}) {
  const timingRef = useRef<HTMLDivElement>(null);
  const prevMotivation = useRef(motivation);

  useEffect(() => {
    if (motivation && motivation !== prevMotivation.current) {
      timingRef.current?.scrollIntoView({ behavior: smoothScroll(), block: "start" });
    }
    prevMotivation.current = motivation;
  }, [motivation]);

  return (
    <section>
      <EntryHeader />
      <div className="se-hero">
        {/* eslint-disable-next-line @next/next/no-img-element -- 画像全体を4:3で崩さず見せるFV。遅延読み込みしない */}
        <img src="/images/shokunin-entry/hero.webp" alt="建設現場で腕を組み、笑顔で上を見る職人" width={1200} height={900} fetchPriority="high" decoding="async" />
        <div className="se-hero__copy">
          <h1>
            <span className="se-hero__small">建設職人の</span>
            <span className="se-hero__main">転職に強い</span>
          </h1>
          <p>
            経験を活かして、
            <br />
            今より良い条件の会社へ。
          </p>
        </div>
      </div>
      <ul className="se-points">
        {FV_POINTS.map((p) => (
          <li key={p}>
            <Check aria-hidden="true" strokeWidth={3.4} />
            {p}
          </li>
        ))}
      </ul>

      <div className="se-about">
        <h2>企業から選ばれる、職人の転職サービス</h2>
        <p>
          職種・経験・資格・希望条件を無料登録。あなたの匿名プロフィールを見た建設会社が面接を希望した場合、adofyが企業の採用担当としてご連絡します。仕事内容と条件を確認してから、面接を受けるか自分で決められます。
        </p>
        <ul className="se-safe">
          <li>登録しただけで現在の勤務先に知られることはありません</li>
          <li>氏名・電話番号などの個人情報を、本人の同意なく求人企業へ公開しません</li>
        </ul>
        <ServiceFlow />
      </div>

      <div className="se-step se-step--first">
        <div className="se-q">
          <QuestionHead index={1} question="あなたの今のお気持ちは？" hint="あてはまるものを選んでください" />
          <p className="se-q__badge">
            STEP 1 / {TOTAL_STEPS}・あと{TOTAL_STEPS - 1}ステップ
          </p>
          <div className="se-feelings">
            {MOTIVATIONS.map((m, i) => (
              <button
                key={m}
                type="button"
                aria-pressed={motivation === m}
                onClick={() => onMotivation(m)}
                className={`se-feeling${i === 0 ? " is-primary" : ""}${motivation === m ? " is-on" : ""}`}
              >
                <span>{m}</span>
                <span aria-hidden="true">→</span>
              </button>
            ))}
          </div>
        </div>

        {motivation && (
          <div ref={timingRef} className="se-anchor se-q--next">
            <Question index={2} question="いつ頃の転職を考えていますか？" choices={DESIRED_TIMINGS} value={desiredTiming} onSelect={onTiming} />
          </div>
        )}
      </div>
    </section>
  );
}

/** STEP4：お住まい（郵便番号 → 都道府県・市区町村）と希望勤務エリア。処理はドラテクの LocationStep と同じ */
function LocationStep({
  answers,
  onChange,
  onNext,
}: {
  answers: EntryAnswers;
  onChange: (patch: Partial<EntryAnswers>) => void;
  onNext: () => void;
}) {
  const [postal, setPostal] = useState(answers.postalCode);
  const [lookup, setLookup] = useState<"idle" | "loading" | "found" | "not_found" | "error">(
    answers.postalCode && answers.currentPrefecture ? "found" : "idle",
  );
  const [manual, setManual] = useState(!answers.postalCode && Boolean(answers.currentPrefecture));
  const [error, setError] = useState<string | null>(null);
  const lastLooked = useRef(answers.postalCode);
  const secondQuestion = useRef<HTMLDivElement>(null);
  const scrollToSecond = () =>
    window.setTimeout(() => secondQuestion.current?.scrollIntoView({ behavior: smoothScroll(), block: "start" }), 30);

  useEffect(() => {
    const code = normalizePostalCode(postal);
    if (code.length !== 7 || code === lastLooked.current) return;
    lastLooked.current = code;
    let cancelled = false;
    setLookup("loading");
    fetch(`/api/postal-code?code=${code}`)
      .then(async (res) => {
        if (cancelled) return;
        if (res.status === 404) {
          setLookup("not_found");
          setManual(true);
          return;
        }
        if (!res.ok) throw new Error("lookup failed");
        const data = (await res.json()) as { prefecture: string; city: string };
        if (cancelled) return;
        onChange({ postalCode: code, currentPrefecture: data.prefecture, currentCity: data.city });
        setLookup("found");
        setManual(false);
        setError(null);
        scrollToSecond();
      })
      .catch(() => {
        if (cancelled) return;
        setLookup("error");
        setManual(true);
      });
    return () => {
      cancelled = true;
    };
  }, [postal, onChange]);

  const changePostal = (v: string) => {
    const code = normalizePostalCode(v).slice(0, 7);
    setPostal(code);
    if (code !== answers.postalCode) {
      if (!manual) onChange({ postalCode: "", currentPrefecture: "", currentCity: "" });
      else onChange({ postalCode: "" });
      lastLooked.current = "";
      setLookup("idle");
    }
  };

  const addressMissing = "お住まいの郵便番号を入力するか、都道府県を選んでください";

  const tryNext = () => {
    const m = !answers.currentPrefecture ? addressMissing : !answers.desiredArea ? "希望する勤務エリアを選んでください" : null;
    setError(m);
    if (!m) onNext();
  };

  const selectArea = (area: string) => {
    onChange({ desiredArea: area, desiredPrefecture: area === answers.desiredArea ? answers.desiredPrefecture : "" });
    if (area === NEAR_HOME || area === UNDECIDED_AREA) {
      if (answers.currentPrefecture) {
        setError(null);
        onNext();
      } else {
        setError(addressMissing);
      }
    }
  };

  const areaPrefectures = AREA_PREFECTURES[answers.desiredArea];

  return (
    <>
      <div className="se-q">
        <QuestionHead index={1} question="現在のお住まいを教えてください" hint="郵便番号から住所を確認します。市区町村以下は企業に公開されません" />
        <label className="se-postal">
          <span className="se-sr">郵便番号（ハイフンなし7桁）</span>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={8}
            value={postal}
            onChange={(e) => changePostal(e.target.value)}
            placeholder="例：5008833（ハイフンなし7桁）"
          />
        </label>
        <div className="se-postal__state">
          {lookup === "loading" && <p>住所を確認しています…</p>}
          {lookup === "found" && !manual && (
            <p className="is-found">
              {answers.currentPrefecture}
              {answers.currentCity}
            </p>
          )}
          {lookup === "not_found" && <p className="is-warn">郵便番号が見つかりませんでした。都道府県を選んでください。</p>}
          {lookup === "error" && <p className="is-warn">住所を確認できませんでした。都道府県を選んでください。</p>}
        </div>
        {!manual ? (
          <p className="se-postal__switch">
            <button type="button" onClick={() => setManual(true)}>
              郵便番号が分からない方はこちら
            </button>
          </p>
        ) : (
          <label className="se-field se-postal">
            <span className="se-field__label">お住まいの都道府県</span>
            <select
              value={answers.currentPrefecture}
              onChange={(e) => {
                onChange({ currentPrefecture: e.target.value, currentCity: answers.postalCode ? answers.currentCity : "" });
                setError(null);
                if (e.target.value) scrollToSecond();
              }}
            >
              <option value="">選択してください</option>
              {PREFECTURES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div ref={secondQuestion} className="se-anchor">
        <Question index={2} question="希望する勤務エリアを教えてください" choices={DESIRED_AREAS} value={answers.desiredArea} onSelect={selectArea} />
        {areaPrefectures && (
          <div className="se-prefs">
            <p>
              希望の都道府県も選べます<small>（任意）</small>
            </p>
            <div className="se-choices se-choices--3">
              {areaPrefectures.map((p) => (
                <ChoiceButton
                  key={p}
                  label={p}
                  selected={answers.desiredPrefecture === p}
                  onClick={() => onChange({ desiredPrefecture: answers.desiredPrefecture === p ? "" : p })}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <NextButton error={error} onClick={tryNext} />
    </>
  );
}

type FieldErrors = Partial<Record<keyof EntryContact, string>>;

function validate(c: EntryContact): FieldErrors {
  const e: FieldErrors = {};
  if (!c.name.trim()) e.name = "氏名を入力してください";
  if (!c.birthYear) e.birthYear = "生まれ年を選んでください";
  if (!c.phone.trim()) e.phone = "電話番号を入力してください";
  else if (!normalizeDriverPhone(c.phone)) e.phone = "電話番号は 0 から始まる10〜11桁の数字で入力してください";
  if (c.email.trim() && !isValidEmail(c.email)) e.email = "メールアドレスの形式をご確認ください";
  if (!c.privacyConsent) e.privacyConsent = "個人情報の取り扱いへの同意が必要です";
  return e;
}

/** STEP6：連絡先入力。送信に失敗しても入力内容と回答はそのまま残し、もう一度押せる */
function RegisterForm({
  contact,
  onChange,
  onSubmit,
}: {
  contact: EntryContact;
  onChange: (patch: Partial<EntryContact>) => void;
  onSubmit: (website: string) => Promise<void>;
}) {
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lock = useRef(false);
  const years = useMemo(() => birthYearOptions(), []);
  const errors = submitted ? validate(contact) : {};

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (lock.current) return;
    setSubmitted(true);
    setError(null);
    if (Object.keys(validate(contact)).length > 0) return;

    // 二重送信防止（state更新前の連打もrefで止める）
    lock.current = true;
    setSending(true);
    try {
      await onSubmit(String(new FormData(e.currentTarget).get("website") ?? ""));
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : "送信できませんでした。通信環境をご確認のうえ、もう一度お試しください。");
      lock.current = false;
      setSending(false);
    }
  };

  return (
    <section className="se-step">
      <div className="se-q__head">
        <h2>最後に連絡先を入力してください</h2>
      </div>
      <form onSubmit={handleSubmit} noValidate className="se-form">
        <Field label="氏名" required error={errors.name}>
          <input type="text" value={contact.name} onChange={(e) => onChange({ name: e.target.value })} autoComplete="name" placeholder="山田 太郎" maxLength={100} />
        </Field>
        <Field label="生まれ年" required error={errors.birthYear}>
          <select value={contact.birthYear} onChange={(e) => onChange({ birthYear: e.target.value })} autoComplete="bday-year">
            <option value="">選択してください</option>
            {years.map((y) => (
              <option key={y} value={String(y)}>
                {y}年
              </option>
            ))}
          </select>
        </Field>
        <Field label="電話番号" required error={errors.phone}>
          <input type="tel" value={contact.phone} onChange={(e) => onChange({ phone: e.target.value })} autoComplete="tel" inputMode="tel" placeholder="09012345678" maxLength={40} />
        </Field>
        <Field label="メールアドレス" error={errors.email}>
          <input type="email" value={contact.email} onChange={(e) => onChange({ email: e.target.value })} autoComplete="email" inputMode="email" placeholder="example@example.com" maxLength={200} />
        </Field>
        <Field label="連絡を希望する時間帯">
          <select value={contact.contactTime} onChange={(e) => onChange({ contactTime: e.target.value })}>
            <option value="">選択してください</option>
            {CONTACT_TIMES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
        <Field label="希望や質問">
          <textarea
            rows={3}
            value={contact.comment}
            onChange={(e) => onChange({ comment: e.target.value })}
            placeholder="保有資格や気になる点があればご記入ください"
            maxLength={2000}
          />
        </Field>

        <div className="se-consent">
          <label>
            <input type="checkbox" checked={contact.privacyConsent} onChange={(e) => onChange({ privacyConsent: e.target.checked })} />
            <span>
              <a href="/shokunin-entry/terms" target="_blank" rel="noopener">
                利用規約
              </a>
              と
              <a href="/shokunin-entry/privacy" target="_blank" rel="noopener">
                個人情報の取り扱い
              </a>
              に同意する
            </span>
            <em>必須</em>
          </label>
          {errors.privacyConsent && <p className="se-field__error">{errors.privacyConsent}</p>}
        </div>

        {/* スパム対策（人間には見えない） */}
        <div className="se-hp" aria-hidden="true">
          <label>
            URL
            <input name="website" type="text" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        {error && (
          <p role="alert" className="se-alert">
            {error}
          </p>
        )}

        <p className="se-free">登録・利用に料金は一切かかりません</p>
        <button type="submit" className="se-btn" disabled={sending}>
          <span>{sending ? "送信中…" : "無料で職人登録する"}</span>
          <span aria-hidden="true">→</span>
        </button>
      </form>
    </section>
  );
}

function Complete() {
  return (
    <section className="se-step se-done">
      <span className="se-done__icon">
        <Check aria-hidden="true" strokeWidth={3} />
      </span>
      <h2>無料登録を受け付けました</h2>
      <p>ご登録ありがとうございます。企業から面接希望があった場合、adofyからご入力いただいた電話番号へご連絡します。</p>
      <p className="se-done__note">登録しただけで転職や面接が確定することはありません。仕事内容と条件を確認してから、面接を受けるかご判断いただけます。</p>
    </section>
  );
}

function Field({ label, required = false, error, children }: { label: string; required?: boolean; error?: string; children: ReactNode }) {
  return (
    <label className="se-field">
      <span className="se-field__label">
        {label}
        <em className={required ? "" : "is-opt"}>{required ? "必須" : "任意"}</em>
      </span>
      {children}
      {error && <span className="se-field__error">{error}</span>}
    </label>
  );
}
