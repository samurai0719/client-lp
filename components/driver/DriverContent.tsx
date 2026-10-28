'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import HeroSection from './HeroSection';
import StepHeader from './StepHeader';
import QuestionCard, { StepSection } from './QuestionCard';
import LicenseQuestion from './LicenseQuestion';
import LocationStep, { NextButton } from './LocationStep';
import RegisterSection, { RegisterComplete } from './RegisterSection';
import {
  DESIRED_JOB_TYPES,
  DESIRED_SALARIES,
  DRIVER_EXPERIENCES,
  EMPLOYMENT_STATUSES,
  EMPTY_ANSWERS,
  EMPTY_CONTACT,
  EXCLUSIVE_CHOICES,
  PRIORITIES,
  TOTAL_STEPS,
  isStepComplete,
  type DriverAnswers,
  type DriverContact,
} from './questions';

/**
 * step（全6ステップ・1ステップ1画面）:
 *   1 = ファーストビュー + 今のお気持ち → 転職時期
 *   2 = 免許（複数） + ドライバー経験
 *   3 = 希望する仕事（複数） + 現在の状況
 *   4 = 郵便番号（住所） + 希望勤務エリア
 *   5 = 転職先で最も重視すること + 希望年収
 *   6 = 診断完了 + 連絡先入力（無料登録）
 *
 * 単一選択だけのステップは、そのステップの回答が揃った時点で自動で次へ進む。
 * 複数選択・入力があるステップは「次へ進む」ボタン（または最後の単一選択）で進む。
 * 戻る（画面の戻る・ブラウザの戻る）でも回答と入力内容は消さない。
 */
type Step = 1 | 2 | 3 | 4 | 5 | 6;

type MultiKey = 'licenses' | 'desiredJobTypes';

/** 流入計測。最初に開いたときの URL から取る（ステップを進めても変わらない） */
type Attribution = {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  landingPage: string | null;
  referrer: string | null;
};

function readAttribution(): Attribution {
  const sp = new URLSearchParams(window.location.search);
  return {
    utmSource: sp.get('utm_source'),
    utmMedium: sp.get('utm_medium'),
    utmCampaign: sp.get('utm_campaign'),
    utmContent: sp.get('utm_content'),
    utmTerm: sp.get('utm_term'),
    landingPage: `${window.location.host}${window.location.pathname}${window.location.search}`,
    referrer: document.referrer || null,
  };
}

/** 1ページに2問あるステップの、最初の質問のキー（答えたら2問目へ自動でスクロールする） */
const FIRST_QUESTION: Partial<Record<Step, keyof DriverAnswers>> = {
  2: 'licenses',
  3: 'desiredJobTypes',
  5: 'topPriority',
};

/**
 * 2問目へ移るまでの待ち時間。単一選択はすぐ（描画を待つだけ）。
 * 複数選択は続けて選べるよう、最後に押してから少しだけ待つ（待っている間に押せば待ち直す）。
 */
const MULTI_SCROLL_DELAY = 450;
const SINGLE_SCROLL_DELAY = 30;

const MISSING_MESSAGE: Record<number, string> = {
  2: 'お持ちの免許とドライバー経験を選んでください',
  3: '希望する仕事と現在の状況を選んでください',
};

export default function DriverContent() {
  const [step, setStep] = useState<Step>(1);
  const [answers, setAnswers] = useState<DriverAnswers>(EMPTY_ANSWERS);
  const [contact, setContact] = useState<DriverContact>(EMPTY_CONTACT);
  const [done, setDone] = useState(false);
  const [stepError, setStepError] = useState<string | null>(null);
  const attribution = useRef<Attribution | null>(null);
  const secondQuestion = useRef<HTMLDivElement>(null);
  const scrollTimer = useRef<number | undefined>(undefined);

  /** 同じページの2問目へスクロールする（待っている間にもう一度呼ばれたら待ち直す） */
  const scrollToSecond = useCallback((delay: number) => {
    window.clearTimeout(scrollTimer.current);
    scrollTimer.current = window.setTimeout(() => {
      secondQuestion.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, delay);
  }, []);

  useEffect(() => () => window.clearTimeout(scrollTimer.current), []);

  /*
   * ステップが変わったら、新しいページの一番上から表示する。
   * 描画の前に一瞬で戻す（なめらかスクロールにすると、前のページで下までスクロールしていたとき
   * 新しいページの描画とぶつかって、ページの途中や下から始まってしまう）。
   * ブラウザの戻る/進むでも同じ。ブラウザ自身のスクロール位置の復元は止めておく。
   */
  useLayoutEffect(() => {
    window.history.scrollRestoration = 'manual';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [step, done]);

  useEffect(() => {
    attribution.current = readAttribution();
    window.history.replaceState({ ...window.history.state, driverStep: 1 }, '');
    // ブラウザの戻る/進むでもステップを移動する（回答は state に残っているので消えない）
    const onPop = (e: PopStateEvent) => {
      const s = (e.state as { driverStep?: number } | null)?.driverStep;
      setStepError(null);
      window.clearTimeout(scrollTimer.current);
      setStep(s && s >= 1 && s <= TOTAL_STEPS ? (s as Step) : 1);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const goTo = useCallback((next: Step) => {
    window.clearTimeout(scrollTimer.current);
    setStepError(null);
    setStep(next);
    window.history.pushState({ ...window.history.state, driverStep: next }, '');
  }, []);

  /** 画面の「戻る」。ブラウザ履歴を1つ戻す（popstate でステップが変わる） */
  const goBack = () => window.history.back();

  /** 単一選択に答える。そのステップの回答が揃ったら自動で次へ */
  const answerOne = (key: keyof DriverAnswers, value: string) => {
    const next = { ...answers, [key]: value };
    setAnswers(next);
    setStepError(null);
    if (isStepComplete(step, next) && step < TOTAL_STEPS) goTo((step + 1) as Step);
    else if (FIRST_QUESTION[step] === key) scrollToSecond(SINGLE_SCROLL_DELAY);
  };

  /** 複数選択を切り替える。「経験なし」「特に決めていない」は他と同時に選べない。重視することは最大3つ */
  const toggle = (key: MultiKey, value: string) => {
    setStepError(null);
    const current = answers[key];
    const exclusive = EXCLUSIVE_CHOICES[key as keyof typeof EXCLUSIVE_CHOICES];
    let next: string[];
    if (current.includes(value)) next = current.filter((v) => v !== value);
    else if (exclusive && value === exclusive) next = [value];
    else next = [...(exclusive ? current.filter((v) => v !== exclusive) : current), value];
    setAnswers((prev) => ({ ...prev, [key]: next }));

    // 1問目で選んだとき（外したときは動かさない）は2問目へ。
    // 「特に決めていない」はそれ以上選ばないので、すぐ移る
    if (FIRST_QUESTION[step] === key && next.includes(value)) {
      scrollToSecond(exclusive && value === exclusive ? SINGLE_SCROLL_DELAY : MULTI_SCROLL_DELAY);
    }
  };

  const tryNext = () => {
    if (isStepComplete(step, answers)) goTo((step + 1) as Step);
    else setStepError(MISSING_MESSAGE[step] ?? '未回答の質問があります');
  };

  const changeLocation = useCallback((patch: Partial<DriverAnswers>) => setAnswers((prev) => ({ ...prev, ...patch })), []);

  const submit = async () => {
    const a = attribution.current;
    const res = await fetch('/api/driver-register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...contact, answers, attribution: a }),
    });
    if (!res.ok) {
      const data: { error?: string } = await res.json().catch(() => ({}));
      throw new Error(data.error ?? '');
    }
    setDone(true);
    window.history.replaceState({ ...window.history.state, driverStep: TOTAL_STEPS }, '');
  };

  const options = (list: readonly string[]) => list.map((label) => ({ label }));

  return (
    /*
     * 外側: PC では bg-slate-100 がサイドに見え、LP がカードとして浮き上がる
     * モバイル (<520px) では max-w-[520px] が効かず全幅になるため bg-slate-100 は見えない
     */
    <div className="min-h-screen bg-slate-100 overflow-x-hidden">
      {/* ── PC版中央寄せコンテナ ──
           520px 以上の画面では中央に固定幅カードとして表示。
           モバイルでは full-width のまま。
      */}
      <div className="max-w-[520px] mx-auto bg-white min-h-screen
                      shadow-[0_0_60px_rgba(30,64,175,0.08)]">
        <main>
          {/* STEP1: ファーストビュー + 今のお気持ち → 転職時期 */}
          {step === 1 && !done && (
            <HeroSection
              motivation={answers.motivation}
              desiredTiming={answers.desiredTiming}
              onMotivation={(v) => setAnswers((prev) => ({ ...prev, motivation: v }))}
              onTiming={(v) => answerOne('desiredTiming', v)}
            />
          )}

          {(step >= 2 || done) && (
            <StepHeader currentStep={done ? TOTAL_STEPS : step} totalSteps={TOTAL_STEPS} onBack={goBack} completed={done} />
          )}

          {done ? (
            <RegisterComplete />
          ) : (
            <>
              {step === 2 && (
                <StepSection stepNumber={2} totalSteps={TOTAL_STEPS}>
                  <LicenseQuestion index={1} values={answers.licenses} onToggle={(v) => toggle('licenses', v)} />
                  <div ref={secondQuestion} className="scroll-mt-28">
                    <QuestionCard
                      index={2}
                      question="ドライバー経験はどのくらいありますか？"
                      choices={options(DRIVER_EXPERIENCES)}
                      value={answers.driverExperience}
                      onSelect={(v) => answerOne('driverExperience', v)}
                    />
                  </div>
                  <NextButton error={stepError} onClick={tryNext} />
                </StepSection>
              )}

              {step === 3 && (
                <StepSection stepNumber={3} totalSteps={TOTAL_STEPS}>
                  <QuestionCard
                    index={1}
                    mode="multi"
                    question="希望する仕事を教えてください"
                    hint="複数選択できます"
                    choices={options(DESIRED_JOB_TYPES)}
                    values={answers.desiredJobTypes}
                    onToggle={(v) => toggle('desiredJobTypes', v)}
                  />
                  <div ref={secondQuestion} className="scroll-mt-28">
                    <QuestionCard
                      index={2}
                      question="現在の状況を教えてください"
                      choices={options(EMPLOYMENT_STATUSES)}
                      value={answers.employmentStatus}
                      onSelect={(v) => answerOne('employmentStatus', v)}
                    />
                  </div>
                  <NextButton error={stepError} onClick={tryNext} />
                </StepSection>
              )}

              {step === 4 && (
                <StepSection stepNumber={4} totalSteps={TOTAL_STEPS}>
                  <LocationStep answers={answers} onChange={changeLocation} onNext={() => goTo(5)} />
                </StepSection>
              )}

              {step === 5 && (
                <StepSection stepNumber={5} totalSteps={TOTAL_STEPS}>
                  <QuestionCard
                    index={1}
                    question="転職先で最も重視することを教えてください"
                    hint="ひとつ選んでください"
                    choices={options(PRIORITIES)}
                    value={answers.topPriority}
                    onSelect={(v) => answerOne('topPriority', v)}
                  />
                  <div ref={secondQuestion} className="scroll-mt-28">
                    <QuestionCard
                      index={2}
                      question="希望する年収を教えてください"
                      choices={options(DESIRED_SALARIES)}
                      value={answers.desiredSalary}
                      onSelect={(v) => answerOne('desiredSalary', v)}
                    />
                  </div>
                </StepSection>
              )}

              {step === 6 && (
                <RegisterSection contact={contact} onChange={(p) => setContact((prev) => ({ ...prev, ...p }))} onSubmit={submit} />
              )}
            </>
          )}

          {/* フッター */}
          <footer className="text-center py-10 text-xs text-slate-400 border-t border-slate-100 mt-4">
            <p className="mb-2 flex justify-center gap-4">
              <a href="/driver/terms" className="hover:text-slate-600">利用規約</a>
              <a href="/driver/privacy" className="hover:text-slate-600">個人情報の取り扱い</a>
            </p>
            <p>© 2026 ドラテク All Rights Reserved.</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
