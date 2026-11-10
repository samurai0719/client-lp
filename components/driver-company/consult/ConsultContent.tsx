"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import ChoiceButton from "@/components/driver/ChoiceButton";
import { trackCompany } from "@/components/driver-company/track";
import { DORATECH_PIXEL_ID } from "@/lib/analytics/doratechCompanyPixel";
import { captureUtm, loadUtm } from "@/lib/utm/storage";
import {
  HIRING_COUNTS,
  HIRING_STATUSES,
  HIRING_TIMINGS,
  PLAN_INTERESTS,
  PREFECTURES,
  validateContact,
  type ConsultAnswers,
  type ConsultContact,
  type ConsultErrors,
} from "@/lib/types/driverCompanyConsult";

/**
 * ドラテク 企業向け「無料オンライン相談」LP の本体。
 * 求職者向けLP（driver.taxidriver-beginner.com）と同じ「FV画像＋選択式の質問」の形式。
 *
 * ・質問は1ページに上から順に追加表示する（答えると次の質問が下に出て、そこへ自動スクロール）
 * ・回答済みの質問は残り、押し直せば回答を変えられる
 * ・勤務地（STEP 4）は「次へ」で確定する。都道府県を変えたら市区町村と確定を取り消す（別の県の市区町村が残らないように）
 * ・料金は「成果報酬と月額を選べる」ことだけを伝え、金額・料率は載せない
 * ・送信は /api/driver-company-consult。保存か通知のどちらかが成功したときだけ完了画面を出す
 */

const TOTAL_STEPS = 6;

const FV_IMAGE = "/images/driver/company/consult-fv.webp";

const EMPTY_ANSWERS: ConsultAnswers = { hiringStatus: "", hiringCount: "", hiringTiming: "", prefecture: "", city: "", plan: "" };
const EMPTY_CONTACT: ConsultContact = { companyName: "", contactName: "", phone: "", email: "" };

/** 回答済みのステップ数（= いま答える STEP は done + 1）。前のステップが未回答なら、その先は数えない */
function answeredSteps(a: ConsultAnswers, locationDone: boolean): number {
  const done = [!!a.hiringStatus, !!a.hiringCount, !!a.hiringTiming, locationDone, !!a.plan];
  const firstOpen = done.indexOf(false);
  return firstOpen === -1 ? done.length : firstOpen;
}

/** 青グラデーションのヘッダー（求職者向けLPと同じ見た目） */
function TopHeader() {
  return (
    <header className="bg-gradient-to-r from-blue-800 to-blue-600 text-white">
      <div className="px-4 py-2.5 flex items-center gap-3">
        <p className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/driver/logo.png"
            alt="ドラテク"
            width={640}
            height={645}
            className="h-11 w-auto block bg-white rounded-lg p-1.5 shadow-sm"
          />
        </p>
        <div className="min-w-0">
          <p className="text-[9px] font-semibold tracking-widest text-blue-200 uppercase">Doratech for Business</p>
          <p className="text-[13px] font-bold leading-tight">運送会社向け ドライバー採用サービス</p>
        </div>
      </div>
    </header>
  );
}

/**
 * ファーストビュー。画像は運営者が作成したもの（キャッチコピー・実績バッジは画像に入っている）。
 * 画像に無い料金プランの一文だけ、画像の下に帯で出す。h1 は画像内のキャッチと同じ文言を読み上げ・検索用に持たせる。
 */
function FirstView() {
  return (
    <div className="w-full bg-blue-800">
      <h1 className="sr-only">売上を上げるための採用を。20〜30代のドライバーを採用したい運送会社へ</h1>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={FV_IMAGE}
        alt="売上を上げるための採用を。20〜30代のドライバーを採用したい運送会社へ。累計応募者数2,000人以上、元大型ドライバーが運営"
        width={1448}
        height={1086}
        className="block w-full h-auto"
        fetchPriority="high"
      />
      <p className="bg-gradient-to-r from-blue-800 to-blue-600 px-4 py-3 text-center text-[17px] min-[400px]:text-[19px] font-black leading-tight text-white">
        成果報酬・月額、<span className="text-amber-300">選べる2つのプラン</span>
      </p>
    </div>
  );
}

/** 質問の進み具合（質問エリアの上に固定表示） */
function Progress({ current, answered, completed }: { current: number; answered: number; completed: boolean }) {
  const pct = completed ? 100 : Math.round((answered / TOTAL_STEPS) * 100);
  const remaining = TOTAL_STEPS - current;
  return (
    <div className="sticky top-0 z-20 border-b border-slate-100 bg-white/95 px-4 py-2 shadow-sm backdrop-blur">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
        <span>
          STEP <span className="text-sm text-blue-600">{completed ? TOTAL_STEPS : current}</span> / {TOTAL_STEPS}
        </span>
        <span className="text-[11px] text-slate-400">
          {completed ? (
            <span className="font-semibold text-blue-500">申込み完了</span>
          ) : remaining > 0 ? (
            <>
              あと <span className="font-semibold text-blue-500">{remaining}</span> ステップ
            </>
          ) : (
            <span className="font-semibold text-blue-500">最後のステップ</span>
          )}
        </span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/** 1ステップ分の枠 */
function StepBlock({
  step,
  title,
  hint,
  children,
}: {
  step: number;
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <section id={`consult-block-${step}`} className="scroll-mt-16 border-t border-slate-100 px-5 pt-7 pb-8 first:border-t-0" aria-labelledby={`consult-step-${step}`}>
      <div className="mb-4 text-center">
        <p className="mb-1 inline-block rounded-full bg-blue-50 px-3 py-0.5 text-[11px] font-bold text-blue-600">
          STEP {step} / {TOTAL_STEPS}
        </p>
        <h2 id={`consult-step-${step}`} className="text-lg font-bold leading-snug text-slate-800">
          {title}
        </h2>
        <p className="mt-1.5 text-xs text-slate-400">{hint ?? "あてはまるものを選んでください"}</p>
      </div>
      {children}
    </section>
  );
}

/** STEP 1 の大きなボタン（求職者向けLPの最初の質問と同じ立体感） */
function BigChoice({ label, sub, primary, selected, dim, onClick }: { label: string; sub: string; primary: boolean; selected: boolean; dim: boolean; onClick: () => void }) {
  const tone = primary
    ? "bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 shadow-[0_6px_22px_rgba(29,78,216,0.38)] hover:shadow-[0_8px_28px_rgba(29,78,216,0.50)] py-6"
    : "bg-gradient-to-br from-sky-400 to-sky-600 hover:from-sky-300 hover:to-sky-500 shadow-[0_4px_16px_rgba(14,165,233,0.30)] hover:shadow-[0_6px_22px_rgba(14,165,233,0.44)] py-5";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group w-full rounded-2xl px-5 text-white transition-all duration-150 active:scale-[0.97] ${tone}${
        selected ? " ring-4 ring-blue-300 ring-offset-2" : dim ? " opacity-70" : ""
      }`}
    >
      <span className="flex items-center justify-between gap-3">
        <span className="text-left">
          <span className={`block font-extrabold leading-tight tracking-tight ${primary ? "text-[17px]" : "text-[15px]"}`}>{label}</span>
          <span className={`mt-1.5 block text-xs font-normal ${primary ? "text-blue-200" : "text-sky-100"}`}>{sub}</span>
        </span>
        <span className="shrink-0 text-2xl transition-transform duration-150 group-hover:translate-x-1.5" aria-hidden="true">
          {selected ? "✓" : "→"}
        </span>
      </span>
    </button>
  );
}

function Choices({ list, value, onSelect }: { list: readonly string[]; value: string; onSelect: (v: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {list.map((label, i) => (
        <ChoiceButton
          key={label}
          label={label}
          cardLayout="text"
          selected={value === label}
          className={list.length % 2 !== 0 && i === list.length - 1 ? "col-span-2" : ""}
          onClick={() => onSelect(label)}
        />
      ))}
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 text-base text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 aria-[invalid=true]:border-red-400";

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex items-center gap-2 text-sm font-bold text-slate-700">
        {label}
        <span className="rounded bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">必須</span>
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-bold text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

/** 申込み後の案内。日程はこちらから連絡して決める（予約システムは使っていない） */
function Complete({ contact }: { contact: ConsultContact }) {
  return (
    <section className="px-5 pt-8 pb-10" aria-labelledby="consult-done-title">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-2xl text-white shadow-[0_6px_18px_rgba(29,78,216,0.35)]" aria-hidden="true">
          ✓
        </div>
        <h2 id="consult-done-title" className="text-xl font-black text-blue-800">
          お申込みを受け付けました
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {contact.companyName} {contact.contactName} 様
          <br />
          お申込みありがとうございます。
        </p>
      </div>
      <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
        <p className="mb-3 text-sm font-bold text-blue-800">面談日程の決め方</p>
        <ol className="space-y-3 text-sm leading-relaxed text-slate-700">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">1</span>
            <span>ドラテクの担当者から、ご入力の電話番号またはメールアドレスへご連絡します。</span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">2</span>
            <span>ご都合のよい日時をうかがい、オンライン相談の日程を決めます。</span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">3</span>
            <span>オンライン相談で採用のご状況をうかがい、料金プランの詳しい内容をご案内します。</span>
          </li>
        </ol>
      </div>
    </section>
  );
}

export default function ConsultContent() {
  const [answers, setAnswers] = useState<ConsultAnswers>(EMPTY_ANSWERS);
  const [locationDone, setLocationDone] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [contact, setContact] = useState<ConsultContact>(EMPTY_CONTACT);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<ConsultErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const startedAt = useRef(0);
  const doneRef = useRef<HTMLDivElement>(null);
  const pendingScroll = useRef<number | null>(null);

  const answered = answeredSteps(answers, locationDone);
  const current = Math.min(answered + 1, TOTAL_STEPS);

  useEffect(() => {
    startedAt.current = Date.now();
    captureUtm();
    trackCompany("company_lp_view", { page: "consult" });
  }, []);

  // 新しく出た質問へスクロールする（描画が終わってから）
  useEffect(() => {
    const target = pendingScroll.current;
    if (target === null) return;
    pendingScroll.current = null;
    const id = window.setTimeout(() => {
      document.getElementById(`consult-block-${target}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
    return () => window.clearTimeout(id);
  }, [answered]);

  useEffect(() => {
    if (done) doneRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [done]);

  /** そのステップに初めて答えて次の質問が出るときだけ、次へスクロールする（回答の変更では動かさない） */
  const advanceFrom = (step: number, nextAnswered: number) => {
    if (nextAnswered > answered && nextAnswered >= step) {
      pendingScroll.current = nextAnswered + 1;
      trackCompany("company_form_step", { page: "consult", step: nextAnswered + 1 });
    }
  };

  const choose = (key: "hiringStatus" | "hiringCount" | "hiringTiming" | "plan", step: number) => (value: string) => {
    const next = { ...answers, [key]: value };
    setAnswers(next);
    advanceFrom(step, answeredSteps(next, locationDone));
  };

  const changePrefecture = (value: string) => {
    // 県を変えたら、前の県の市区町村は残さない
    setAnswers((prev) => (prev.prefecture === value ? prev : { ...prev, prefecture: value, city: "" }));
    if (value !== answers.prefecture) setLocationDone(false);
    setLocationError(null);
  };

  const changeCity = (value: string) => {
    setAnswers((prev) => ({ ...prev, city: value }));
    setLocationError(null);
    // 確定後に市区町村を空にしたら、未回答に戻す
    if (!value.trim()) setLocationDone(false);
  };

  const confirmLocation = () => {
    if (!answers.prefecture) return setLocationError("都道府県を選んでください");
    if (!answers.city.trim()) return setLocationError("市区町村を入力してください");
    setLocationError(null);
    setLocationDone(true);
    advanceFrom(4, answeredSteps(answers, true));
  };

  const setField = (key: keyof ConsultContact) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setContact((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    if (key === "companyName" && !contact.companyName && value) trackCompany("company_form_start", { page: "consult" });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSubmitError(null);
    const found = validateContact({ ...contact, privacyAgreed: agreed });
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = (["companyName", "contactName", "phone", "email"] as const).find((k) => found[k]);
      if (first) document.getElementById(`consult-${first}`)?.focus();
      return;
    }

    setSending(true);
    try {
      const utm = loadUtm();
      const res = await fetch("/api/driver-company-consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...answers,
          ...contact,
          privacyAgreed: agreed,
          websiteUrl: honeypot,
          elapsedMs: Date.now() - startedAt.current,
          utm: utm ?? {},
          referrer: utm?.referrer ?? (document.referrer || undefined),
          landingPage: utm?.landing_page ?? window.location.pathname + window.location.search,
        }),
      });
      const data: { success?: boolean; error?: string; errors?: ConsultErrors } = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        if (data.errors) setErrors(data.errors);
        throw new Error(data.error ?? "送信に失敗しました。お手数ですが、時間をおいて再度お試しください。");
      }
      setDone(true);
      trackCompany("company_form_submit", { page: "consult" });
      try {
        window.fbq?.("trackSingle", DORATECH_PIXEL_ID, "Lead", { content_name: "consult" });
      } catch {
        // 計測失敗は無視する
      }
    } catch (err) {
      setSubmitError(err instanceof Error && err.message ? err.message : "送信に失敗しました。お手数ですが、時間をおいて再度お試しください。");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-100">
      <div className="mx-auto min-h-screen max-w-[520px] bg-white shadow-[0_0_60px_rgba(30,64,175,0.08)]">
        <TopHeader />
        <main>
          <FirstView />

          {/* 画像下の短い説明 */}
          <div className="border-b border-blue-100 bg-gradient-to-b from-blue-50 to-white px-4 py-6 text-center">
            <p className="text-[19px] min-[400px]:text-[21px] font-black leading-snug tracking-tight text-blue-800">
              ドライバー不足で、
              <br />
              仕事を断っていませんか？
            </p>
            <p className="mt-3 text-[15px] min-[400px]:text-[16px] font-bold leading-relaxed text-slate-700">
              ドラテクが、売上を伸ばすための
              <br />
              <span className="bg-[linear-gradient(transparent_60%,#fde68a_60%)] px-0.5">若手ドライバー採用</span>をサポートします。
            </p>
          </div>

          <Progress current={current} answered={done ? TOTAL_STEPS : answered} completed={done} />

          {done ? (
            <div ref={doneRef} className="scroll-mt-16">
              <Complete contact={contact} />
            </div>
          ) : (
            <>
              <StepBlock step={1} title="現在の採用状況を教えてください">
                <div className="mx-auto flex max-w-[360px] flex-col gap-3">
                  <BigChoice
                    label={HIRING_STATUSES[0]}
                    sub="早めに人を増やしたい方はこちら"
                    primary
                    selected={answers.hiringStatus === HIRING_STATUSES[0]}
                    dim={!!answers.hiringStatus}
                    onClick={() => choose("hiringStatus", 1)(HIRING_STATUSES[0])}
                  />
                  <BigChoice
                    label={HIRING_STATUSES[1]}
                    sub="まずは話を聞いてみたい方はこちら"
                    primary={false}
                    selected={answers.hiringStatus === HIRING_STATUSES[1]}
                    dim={!!answers.hiringStatus}
                    onClick={() => choose("hiringStatus", 1)(HIRING_STATUSES[1])}
                  />
                </div>
              </StepBlock>

              {answered >= 1 && (
                <StepBlock step={2} title="採用したい人数は？">
                  <Choices list={HIRING_COUNTS} value={answers.hiringCount} onSelect={choose("hiringCount", 2)} />
                </StepBlock>
              )}

              {answered >= 2 && (
                <StepBlock step={3} title="採用したい時期は？">
                  <Choices list={HIRING_TIMINGS} value={answers.hiringTiming} onSelect={choose("hiringTiming", 3)} />
                </StepBlock>
              )}

              {answered >= 3 && (
                <StepBlock step={4} title="採用予定の勤務地は？" hint="都道府県を選び、市区町村を入力してください">
                  <div className="flex flex-col gap-4">
                    <div>
                      <label htmlFor="consult-prefecture" className="mb-1.5 block text-sm font-bold text-slate-700">
                        都道府県
                      </label>
                      <select
                        id="consult-prefecture"
                        value={answers.prefecture}
                        onChange={(e) => changePrefecture(e.target.value)}
                        className={`${inputCls} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22><path d=%22M1 1l5 5 5-5%22 stroke=%22%2364748b%22 stroke-width=%222%22 fill=%22none%22/></svg>')] bg-[length:12px_8px] bg-[right_1rem_center] bg-no-repeat pr-10`}
                      >
                        <option value="">選択してください</option>
                        {PREFECTURES.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="consult-city" className="mb-1.5 block text-sm font-bold text-slate-700">
                        市区町村
                      </label>
                      <input
                        id="consult-city"
                        type="text"
                        value={answers.city}
                        onChange={(e) => changeCity(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                            e.preventDefault();
                            confirmLocation();
                          }
                        }}
                        placeholder="例：名古屋市港区"
                        autoComplete="address-level2"
                        className={inputCls}
                      />
                    </div>
                    {locationError && (
                      <p className="text-center text-xs font-bold text-red-600" role="alert">
                        {locationError}
                      </p>
                    )}
                    {!locationDone && (
                      <button
                        type="button"
                        onClick={confirmLocation}
                        className="mx-auto w-full max-w-[360px] rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 py-4 text-base font-extrabold text-white shadow-[0_6px_22px_rgba(29,78,216,0.38)] transition-all duration-150 hover:from-blue-500 hover:to-blue-700 active:scale-[0.97]"
                      >
                        次へ進む →
                      </button>
                    )}
                  </div>
                </StepBlock>
              )}

              {answered >= 4 && (
                <StepBlock step={5} title="気になる料金プランは？">
                  <p className="mb-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-center text-[13px] font-bold leading-relaxed text-blue-800">
                    成果報酬と月額、2つのプランから選べます。
                    <br />
                    詳しい料金はオンライン面談でご案内します。
                  </p>
                  <Choices list={PLAN_INTERESTS} value={answers.plan} onSelect={choose("plan", 5)} />
                </StepBlock>
              )}

              {answered >= 5 && (
                <StepBlock step={6} title="無料オンライン相談の申込み" hint="ご担当者さまの連絡先を入力してください">
                  <form onSubmit={submit} noValidate className="flex flex-col gap-4">
                    <Field id="consult-companyName" label="会社名" error={errors.companyName}>
                      <input
                        id="consult-companyName"
                        type="text"
                        value={contact.companyName}
                        onChange={setField("companyName")}
                        autoComplete="organization"
                        placeholder="例：株式会社ドラテク運送"
                        aria-invalid={!!errors.companyName}
                        aria-describedby={errors.companyName ? "consult-companyName-error" : undefined}
                        className={inputCls}
                      />
                    </Field>
                    <Field id="consult-contactName" label="担当者名" error={errors.contactName}>
                      <input
                        id="consult-contactName"
                        type="text"
                        value={contact.contactName}
                        onChange={setField("contactName")}
                        autoComplete="name"
                        placeholder="例：山田 太郎"
                        aria-invalid={!!errors.contactName}
                        aria-describedby={errors.contactName ? "consult-contactName-error" : undefined}
                        className={inputCls}
                      />
                    </Field>
                    <Field id="consult-phone" label="電話番号" error={errors.phone}>
                      <input
                        id="consult-phone"
                        type="tel"
                        inputMode="tel"
                        value={contact.phone}
                        onChange={setField("phone")}
                        autoComplete="tel"
                        placeholder="例：052-123-4567"
                        aria-invalid={!!errors.phone}
                        aria-describedby={errors.phone ? "consult-phone-error" : undefined}
                        className={inputCls}
                      />
                    </Field>
                    <Field id="consult-email" label="メールアドレス" error={errors.email}>
                      <input
                        id="consult-email"
                        type="email"
                        inputMode="email"
                        value={contact.email}
                        onChange={setField("email")}
                        autoComplete="email"
                        placeholder="例：saiyo@example.co.jp"
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "consult-email-error" : undefined}
                        className={inputCls}
                      />
                    </Field>

                    {/* ボット対策（人には見えない） */}
                    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                      <label>
                        ウェブサイト
                        <input type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
                      </label>
                    </div>

                    <div>
                      <label className="flex items-start gap-2.5 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          checked={agreed}
                          onChange={(e) => {
                            setAgreed(e.target.checked);
                            if (errors.privacyAgreed) setErrors((prev) => ({ ...prev, privacyAgreed: undefined }));
                          }}
                          className="mt-0.5 h-5 w-5 shrink-0 accent-blue-600"
                        />
                        <span>
                          <a href="privacy" target="_blank" rel="noopener" className="font-bold text-blue-700 underline">
                            個人情報の取り扱い
                          </a>
                          に同意する
                        </span>
                      </label>
                      {errors.privacyAgreed && <p className="mt-1.5 text-xs font-bold text-red-600">{errors.privacyAgreed}</p>}
                    </div>

                    {submitError && (
                      <p className="rounded-xl bg-red-50 px-4 py-3 text-center text-sm font-bold text-red-700" role="alert">
                        {submitError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={sending}
                      className="mt-1 w-full rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 py-5 text-[17px] font-black text-white shadow-[0_6px_0_#c2410c,0_10px_24px_rgba(234,88,12,0.35)] transition-all duration-150 hover:from-orange-400 hover:to-orange-500 active:translate-y-[3px] active:shadow-[0_3px_0_#c2410c,0_6px_14px_rgba(234,88,12,0.3)] disabled:cursor-wait disabled:opacity-70"
                    >
                      {sending ? "送信しています…" : "無料オンライン相談を申し込む"}
                    </button>
                    <p className="text-center text-[11px] leading-relaxed text-slate-400">
                      送信後、担当者からご連絡し、面談の日程を決めます。
                    </p>
                  </form>
                </StepBlock>
              )}
            </>
          )}

          <footer className="mt-4 border-t border-slate-100 py-10 text-center text-xs text-slate-400">
            <p className="mb-2 flex justify-center gap-4">
              <a href="terms" className="hover:text-slate-600">
                利用規約
              </a>
              <a href="privacy" className="hover:text-slate-600">
                個人情報の取り扱い
              </a>
            </p>
            <p>© 2026 ドラテク All Rights Reserved.</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
