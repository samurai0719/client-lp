"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import ChoiceButton from "@/components/driver/ChoiceButton";
import StepHeader from "@/components/driver/StepHeader";
import { trackCompany } from "@/components/driver-company/track";
import { DORATECH_PIXEL_ID } from "@/lib/analytics/doratechCompanyPixel";
import { captureUtm, loadUtm } from "@/lib/utm/storage";
import {
  HIRING_COUNTS,
  HIRING_STATUSES,
  HIRING_TIMINGS,
  PLAN_INTERESTS,
  PREFECTURES,
  TALENT_EXCLUSIVE,
  TALENT_TYPES,
  validateContact,
  type ConsultAnswers,
  type ConsultContact,
  type ConsultErrors,
} from "@/lib/types/driverCompanyConsult";

/**
 * ドラテク 企業向け「無料オンライン相談」LP の本体。
 * 求職者向けLP（driver.taxidriver-beginner.com）と同じ「FV画像＋選択式の質問」の形式。
 *
 * ・1ステップ1画面（参考LPと同じ）。STEP 1 はファーストビューの下、STEP 2 以降は上部にステップ表示＋戻るボタン
 * ・単一選択と都道府県は、選んだらすぐ次のページへ。複数選択（採用したい人材）は「次へ進む」で進む
 * ・戻る（画面の戻る・ブラウザの戻る）でも回答は消えず、選択済みの見た目で残るので変更できる
 * ・後のステップは前のステップがすべて答え済みのときだけ開ける（ブラウザの進むで飛ばせない）
 * ・料金は「成果報酬と月額を選べる」ことだけを伝え、金額・料率は載せない
 * ・送信は /api/driver-company-consult。保存か通知のどちらかが成功したときだけ完了画面を出す
 */

const TOTAL_STEPS = 7;

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;

const FV_IMAGE = "/images/driver/company/consult-fv.webp";

const EMPTY_ANSWERS: ConsultAnswers = {
  hiringStatus: "",
  hiringCount: "",
  talentTypes: [],
  hiringTiming: "",
  prefecture: "",
  plan: "",
};
const EMPTY_CONTACT: ConsultContact = {
  companyName: "",
  contactName: "",
  phone: "",
  email: "",
};

/** 答え済みのステップ数（先頭から連続して答えている数）。これ+1 より先のステップには進めない */
function answeredSteps(a: ConsultAnswers): number {
  const done = [
    !!a.hiringStatus,
    !!a.hiringCount,
    a.talentTypes.length > 0,
    !!a.hiringTiming,
    !!a.prefecture,
    !!a.plan,
  ];
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
          <p className="text-[9px] font-semibold tracking-widest text-blue-200 uppercase">
            Doratech for Business
          </p>
          <p className="text-[13px] font-bold leading-tight">
            運送会社向け ドライバー採用サービス
          </p>
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
      <h1 className="sr-only">
        売上を上げるための採用を。20〜30代のドライバーを採用したい運送会社へ
      </h1>
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
        成果報酬・月額、
        <span className="text-amber-300">選べる2つのプラン</span>
      </p>
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
    <section
      id={`consult-block-${step}`}
      className="px-5 pt-6 pb-8"
      aria-labelledby={`consult-step-${step}`}
    >
      <div className="mb-4 text-center">
        <p className="mb-1 inline-block rounded-full bg-blue-50 px-3 py-0.5 text-[11px] font-bold text-blue-600">
          STEP {step} / {TOTAL_STEPS}
        </p>
        <h2
          id={`consult-step-${step}`}
          className="text-lg font-bold leading-snug text-slate-800"
        >
          {title}
        </h2>
        <p className="mt-1.5 text-xs text-slate-400">
          {hint ?? "あてはまるものを選んでください"}
        </p>
      </div>
      {children}
    </section>
  );
}

/** STEP 1 の大きなボタン（求職者向けLPの最初の質問と同じ立体感） */
function BigChoice({
  label,
  sub,
  primary,
  selected,
  dim,
  onClick,
}: {
  label: string;
  sub: string;
  primary: boolean;
  selected: boolean;
  dim: boolean;
  onClick: () => void;
}) {
  const tone = primary
    ? "bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 shadow-[0_6px_22px_rgba(29,78,216,0.38)] hover:shadow-[0_8px_28px_rgba(29,78,216,0.50)] py-6"
    : "bg-gradient-to-br from-sky-400 to-sky-600 hover:from-sky-300 hover:to-sky-500 shadow-[0_4px_16px_rgba(14,165,233,0.30)] hover:shadow-[0_6px_22px_rgba(14,165,233,0.44)] py-5";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group w-full rounded-2xl px-5 text-white transition-all duration-150 active:scale-[0.97] ${tone}${
        selected
          ? " ring-4 ring-blue-300 ring-offset-2"
          : dim
            ? " opacity-70"
            : ""
      }`}
    >
      <span className="flex items-center justify-between gap-3">
        <span className="text-left">
          <span
            className={`block font-extrabold leading-tight tracking-tight ${primary ? "text-[17px]" : "text-[15px]"}`}
          >
            {label}
          </span>
          <span
            className={`mt-1.5 block text-xs font-normal ${primary ? "text-blue-200" : "text-sky-100"}`}
          >
            {sub}
          </span>
        </span>
        <span
          className="shrink-0 text-2xl transition-transform duration-150 group-hover:translate-x-1.5"
          aria-hidden="true"
        >
          {selected ? "✓" : "→"}
        </span>
      </span>
    </button>
  );
}

function Choices({
  list,
  value,
  onSelect,
}: {
  list: readonly string[];
  value: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {list.map((label, i) => (
        <ChoiceButton
          key={label}
          label={label}
          cardLayout="text"
          selected={value === label}
          className={
            list.length % 2 !== 0 && i === list.length - 1 ? "col-span-2" : ""
          }
          onClick={() => onSelect(label)}
        />
      ))}
    </div>
  );
}

function MultiChoices({
  list,
  values,
  onToggle,
}: {
  list: readonly string[];
  values: string[];
  onToggle: (v: string) => void;
}) {
  // 選択肢の文言が長いので1列にする（2列だと「ドライバ／ー」のように途中で折り返すため）
  return (
    <div className="grid grid-cols-1 gap-2">
      {list.map((label) => (
        <ChoiceButton
          key={label}
          label={label}
          cardLayout="text"
          selected={values.includes(label)}
          onClick={() => onToggle(label)}
        />
      ))}
    </div>
  );
}

/** 「次へ進む」（複数選択のステップ用。参考LPの次へボタンと同じ見た目） */
function NextButton({
  error,
  onClick,
}: {
  error: string | null;
  onClick: () => void;
}) {
  return (
    <div className="mt-6 flex flex-col items-center gap-2">
      {error && (
        <p className="text-center text-xs font-bold text-red-600" role="alert">
          {error}
        </p>
      )}
      <button
        type="button"
        onClick={onClick}
        className="w-full max-w-[360px] rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 py-4 text-base font-extrabold text-white shadow-[0_6px_22px_rgba(29,78,216,0.38)] transition-all duration-150 hover:from-blue-500 hover:to-blue-700 active:scale-[0.97]"
      >
        次へ進む →
      </button>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 text-base text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 aria-[invalid=true]:border-red-400";

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 flex items-center gap-2 text-sm font-bold text-slate-700"
      >
        {label}
        <span className="rounded bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
          必須
        </span>
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
        <div
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-2xl text-white shadow-[0_6px_18px_rgba(29,78,216,0.35)]"
          aria-hidden="true"
        >
          ✓
        </div>
        <h2
          id="consult-done-title"
          className="text-xl font-black text-blue-800"
        >
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
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              1
            </span>
            <span>
              ドラテクの担当者から、ご入力の電話番号またはメールアドレスへご連絡します。
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              2
            </span>
            <span>
              ご都合のよい日時をうかがい、オンライン相談の日程を決めます。
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              3
            </span>
            <span>
              オンライン相談で採用のご状況をうかがい、料金プランの詳しい内容をご案内します。
            </span>
          </li>
        </ol>
      </div>
    </section>
  );
}

export default function ConsultContent() {
  const [step, setStep] = useState<Step>(1);
  const [answers, setAnswers] = useState<ConsultAnswers>(EMPTY_ANSWERS);
  const [stepError, setStepError] = useState<string | null>(null);
  const [contact, setContact] = useState<ConsultContact>(EMPTY_CONTACT);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<ConsultErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const startedAt = useRef(0);
  /** popstate から最新の回答を見るため（ブラウザの進むで未回答のステップへ飛ばないように） */
  const answersRef = useRef(answers);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    startedAt.current = Date.now();
    captureUtm();
    trackCompany("company_lp_view", { page: "consult" });
    window.history.replaceState(
      { ...window.history.state, consultStep: 1 },
      "",
    );
    // ブラウザの戻る/進むでもステップを移動する（回答は state に残っているので消えない）
    const onPop = (e: PopStateEvent) => {
      const s = (e.state as { consultStep?: number } | null)?.consultStep ?? 1;
      const max = answeredSteps(answersRef.current) + 1;
      setStepError(null);
      setStep(Math.max(1, Math.min(s, max, TOTAL_STEPS)) as Step);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  /*
   * ステップが変わったら、新しいページの一番上から表示する（参考LPと同じ）。
   * 描画の前に一瞬で戻す。ブラウザ自身のスクロール位置の復元は止めておく。
   */
  useLayoutEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [step, done]);

  const goTo = useCallback((next: Step) => {
    setStepError(null);
    setStep(next);
    window.history.pushState(
      { ...window.history.state, consultStep: next },
      "",
    );
    trackCompany("company_form_step", { page: "consult", step: next });
  }, []);

  /** 画面の「戻る」。ブラウザ履歴を1つ戻す（popstate でステップが変わる） */
  const goBack = () => window.history.back();

  /** 単一選択（と都道府県）。選んだらすぐ次のページへ */
  const choose =
    (
      key:
        "hiringStatus" | "hiringCount" | "hiringTiming" | "prefecture" | "plan",
    ) =>
    (value: string) => {
      setAnswers((prev) => ({ ...prev, [key]: value }));
      if (step < TOTAL_STEPS) goTo((step + 1) as Step);
    };

  /** 採用したい人材（複数選択）。「相談して決めたい」は他と同時に選べない */
  const toggleTalent = (value: string) => {
    setStepError(null);
    setAnswers((prev) => {
      const cur = prev.talentTypes;
      let next: string[];
      if (cur.includes(value)) next = cur.filter((v) => v !== value);
      else if (value === TALENT_EXCLUSIVE) next = [value];
      else next = [...cur.filter((v) => v !== TALENT_EXCLUSIVE), value];
      return { ...prev, talentTypes: next };
    });
  };

  const nextFromTalent = () => {
    if (answers.talentTypes.length === 0)
      return setStepError("採用したい人材を1つ以上選んでください");
    goTo(4);
  };

  const setField =
    (key: keyof ConsultContact) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setContact((prev) => ({ ...prev, [key]: value }));
      if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
      if (key === "companyName" && !contact.companyName && value)
        trackCompany("company_form_start", { page: "consult" });
    };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSubmitError(null);
    const found = validateContact({ ...contact, privacyAgreed: agreed });
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = (
        ["companyName", "contactName", "phone", "email"] as const
      ).find((k) => found[k]);
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
          landingPage:
            utm?.landing_page ??
            window.location.pathname + window.location.search,
        }),
      });
      const data: {
        success?: boolean;
        error?: string;
        errors?: ConsultErrors;
      } = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        if (data.errors) setErrors(data.errors);
        throw new Error(
          data.error ??
            "送信に失敗しました。お手数ですが、時間をおいて再度お試しください。",
        );
      }
      setDone(true);
      trackCompany("company_form_submit", { page: "consult" });
      try {
        window.fbq?.("trackSingle", DORATECH_PIXEL_ID, "Lead", {
          content_name: "consult",
        });
      } catch {
        // 計測失敗は無視する
      }
    } catch (err) {
      setSubmitError(
        err instanceof Error && err.message
          ? err.message
          : "送信に失敗しました。お手数ですが、時間をおいて再度お試しください。",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-100">
      <div className="mx-auto min-h-screen max-w-[520px] bg-white shadow-[0_0_60px_rgba(30,64,175,0.08)]">
        {step === 1 && !done && <TopHeader />}
        {(step >= 2 || done) && (
          <StepHeader
            currentStep={done ? TOTAL_STEPS : step}
            totalSteps={TOTAL_STEPS}
            onBack={goBack}
            completed={done}
            completedLabel="申込み完了"
          />
        )}
        <main>
          {step === 1 && !done && (
            <>
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
                  <span className="bg-[linear-gradient(transparent_60%,#fde68a_60%)] px-0.5">
                    若手ドライバー採用
                  </span>
                  をサポートします。
                </p>
              </div>
            </>
          )}

          {done ? (
            <Complete contact={contact} />
          ) : (
            <>
              {step === 1 && (
                <StepBlock step={1} title="現在の採用状況を教えてください">
                  <div className="mx-auto flex max-w-[360px] flex-col gap-3">
                    <BigChoice
                      label={HIRING_STATUSES[0]}
                      sub="早めに人を増やしたい方はこちら"
                      primary
                      selected={answers.hiringStatus === HIRING_STATUSES[0]}
                      dim={!!answers.hiringStatus}
                      onClick={() => choose("hiringStatus")(HIRING_STATUSES[0])}
                    />
                    <BigChoice
                      label={HIRING_STATUSES[1]}
                      sub="まずは話を聞いてみたい方はこちら"
                      primary={false}
                      selected={answers.hiringStatus === HIRING_STATUSES[1]}
                      dim={!!answers.hiringStatus}
                      onClick={() => choose("hiringStatus")(HIRING_STATUSES[1])}
                    />
                  </div>
                </StepBlock>
              )}

              {step === 2 && (
                <StepBlock step={2} title="採用したい人数は？">
                  <Choices
                    list={HIRING_COUNTS}
                    value={answers.hiringCount}
                    onSelect={choose("hiringCount")}
                  />
                </StepBlock>
              )}

              {step === 3 && (
                <StepBlock
                  step={3}
                  title="どのような人材を採用したいですか？"
                  hint="複数選択できます"
                >
                  <MultiChoices
                    list={TALENT_TYPES}
                    values={answers.talentTypes}
                    onToggle={toggleTalent}
                  />
                  <NextButton error={stepError} onClick={nextFromTalent} />
                </StepBlock>
              )}

              {step === 4 && (
                <StepBlock step={4} title="採用したい時期は？">
                  <Choices
                    list={HIRING_TIMINGS}
                    value={answers.hiringTiming}
                    onSelect={choose("hiringTiming")}
                  />
                </StepBlock>
              )}

              {step === 5 && (
                <StepBlock
                  step={5}
                  title="採用予定の勤務地は？"
                  hint="都道府県を選んでください"
                >
                  <label htmlFor="consult-prefecture" className="sr-only">
                    都道府県
                  </label>
                  <select
                    id="consult-prefecture"
                    value={answers.prefecture}
                    onChange={(e) =>
                      e.target.value && choose("prefecture")(e.target.value)
                    }
                    className={`${inputCls} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22><path d=%22M1 1l5 5 5-5%22 stroke=%22%2364748b%22 stroke-width=%222%22 fill=%22none%22/></svg>')] bg-[length:12px_8px] bg-[right_1rem_center] bg-no-repeat pr-10`}
                  >
                    <option value="" disabled>
                      都道府県を選択してください
                    </option>
                    {PREFECTURES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </StepBlock>
              )}

              {step === 6 && (
                <StepBlock step={6} title="気になる料金プランは？">
                  <p className="mb-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-center text-[13px] font-bold leading-relaxed text-blue-800">
                    成果報酬と月額、2つのプランから選べます。
                  </p>
                  <Choices
                    list={PLAN_INTERESTS}
                    value={answers.plan}
                    onSelect={choose("plan")}
                  />
                </StepBlock>
              )}

              {step === 7 && (
                <StepBlock
                  step={7}
                  title="無料オンライン相談の申込み"
                  hint="ご担当者さまの連絡先を入力してください"
                >
                  <form
                    onSubmit={submit}
                    noValidate
                    className="flex flex-col gap-4"
                  >
                    <Field
                      id="consult-companyName"
                      label="会社名"
                      error={errors.companyName}
                    >
                      <input
                        id="consult-companyName"
                        type="text"
                        value={contact.companyName}
                        onChange={setField("companyName")}
                        autoComplete="organization"
                        placeholder="例：株式会社ドラテク運送"
                        aria-invalid={!!errors.companyName}
                        aria-describedby={
                          errors.companyName
                            ? "consult-companyName-error"
                            : undefined
                        }
                        className={inputCls}
                      />
                    </Field>
                    <Field
                      id="consult-contactName"
                      label="担当者名"
                      error={errors.contactName}
                    >
                      <input
                        id="consult-contactName"
                        type="text"
                        value={contact.contactName}
                        onChange={setField("contactName")}
                        autoComplete="name"
                        placeholder="例：山田 太郎"
                        aria-invalid={!!errors.contactName}
                        aria-describedby={
                          errors.contactName
                            ? "consult-contactName-error"
                            : undefined
                        }
                        className={inputCls}
                      />
                    </Field>
                    <Field
                      id="consult-phone"
                      label="電話番号"
                      error={errors.phone}
                    >
                      <input
                        id="consult-phone"
                        type="tel"
                        inputMode="tel"
                        value={contact.phone}
                        onChange={setField("phone")}
                        autoComplete="tel"
                        placeholder="例：052-123-4567"
                        aria-invalid={!!errors.phone}
                        aria-describedby={
                          errors.phone ? "consult-phone-error" : undefined
                        }
                        className={inputCls}
                      />
                    </Field>
                    <Field
                      id="consult-email"
                      label="メールアドレス"
                      error={errors.email}
                    >
                      <input
                        id="consult-email"
                        type="email"
                        inputMode="email"
                        value={contact.email}
                        onChange={setField("email")}
                        autoComplete="email"
                        placeholder="例：saiyo@example.co.jp"
                        aria-invalid={!!errors.email}
                        aria-describedby={
                          errors.email ? "consult-email-error" : undefined
                        }
                        className={inputCls}
                      />
                    </Field>

                    {/* ボット対策（人には見えない） */}
                    <div
                      aria-hidden="true"
                      className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
                    >
                      <label>
                        ウェブサイト
                        <input
                          type="text"
                          tabIndex={-1}
                          autoComplete="off"
                          value={honeypot}
                          onChange={(e) => setHoneypot(e.target.value)}
                        />
                      </label>
                    </div>

                    <div>
                      <label className="flex items-start gap-2.5 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          checked={agreed}
                          onChange={(e) => {
                            setAgreed(e.target.checked);
                            if (errors.privacyAgreed)
                              setErrors((prev) => ({
                                ...prev,
                                privacyAgreed: undefined,
                              }));
                          }}
                          className="mt-0.5 h-5 w-5 shrink-0 accent-blue-600"
                        />
                        <span>
                          <a
                            href="privacy"
                            target="_blank"
                            rel="noopener"
                            className="font-bold text-blue-700 underline"
                          >
                            個人情報の取り扱い
                          </a>
                          に同意する
                        </span>
                      </label>
                      {errors.privacyAgreed && (
                        <p className="mt-1.5 text-xs font-bold text-red-600">
                          {errors.privacyAgreed}
                        </p>
                      )}
                    </div>

                    {submitError && (
                      <p
                        className="rounded-xl bg-red-50 px-4 py-3 text-center text-sm font-bold text-red-700"
                        role="alert"
                      >
                        {submitError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={sending}
                      className="mt-1 w-full rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 py-5 text-[17px] font-black text-white shadow-[0_6px_0_#c2410c,0_10px_24px_rgba(234,88,12,0.35)] transition-all duration-150 hover:from-orange-400 hover:to-orange-500 active:translate-y-[3px] active:shadow-[0_3px_0_#c2410c,0_6px_14px_rgba(234,88,12,0.3)] disabled:cursor-wait disabled:opacity-70"
                    >
                      {sending
                        ? "送信しています…"
                        : "無料オンライン相談を申し込む"}
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
