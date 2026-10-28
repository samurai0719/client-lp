'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
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
  EMPLOYMENT_TYPES,
  EMPTY_ANSWERS,
  EMPTY_CONTACT,
  EXCLUSIVE_CHOICES,
  EXPERIENCED_VEHICLES,
  PRIORITIES,
  PRIORITIES_MAX,
  TOTAL_STEPS,
  isStepComplete,
  type DriverAnswers,
  type DriverContact,
} from './questions';

/**
 * step（全7ステップ・1ステップ1画面）:
 *   1 = ファーストビュー + 今のお気持ち → 転職時期
 *   2 = 免許（複数） + ドライバー経験
 *   3 = 運転経験のある車両（複数） + 希望する仕事（複数）
 *   4 = 現在の状況 + 希望する雇用形態
 *   5 = 郵便番号（住所） + 希望勤務エリア
 *   6 = 重視すること（最大3つ） + 希望年収
 *   7 = 診断完了 + 連絡先入力（無料登録）
 *
 * 単一選択だけのステップは、そのステップの回答が揃った時点で自動で次へ進む。
 * 複数選択・入力があるステップは「次へ進む」ボタン（または最後の単一選択）で進む。
 * 戻る（画面の戻る・ブラウザの戻る）でも回答と入力内容は消さない。
 */
type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;

type MultiKey = 'licenses' | 'experiencedVehicles' | 'desiredJobTypes' | 'priorities';

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

const MISSING_MESSAGE: Record<number, string> = {
  2: 'お持ちの免許とドライバー経験を選んでください',
  3: '運転経験のある車両と希望する仕事を選んでください',
  6: '重視することと希望年収を選んでください',
};

export default function DriverContent() {
  const [step, setStep] = useState<Step>(1);
  const [answers, setAnswers] = useState<DriverAnswers>(EMPTY_ANSWERS);
  const [contact, setContact] = useState<DriverContact>(EMPTY_CONTACT);
  const [done, setDone] = useState(false);
  const [stepError, setStepError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const attribution = useRef<Attribution | null>(null);

  useEffect(() => {
    attribution.current = readAttribution();
    window.history.replaceState({ ...window.history.state, driverStep: 1 }, '');
    // ブラウザの戻る/進むでもステップを移動する（回答は state に残っているので消えない）
    const onPop = (e: PopStateEvent) => {
      const s = (e.state as { driverStep?: number } | null)?.driverStep;
      setStepError(null);
      setStep(s && s >= 1 && s <= TOTAL_STEPS ? (s as Step) : 1);
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const goTo = useCallback((next: Step) => {
    setStepError(null);
    setNotice(null);
    setStep(next);
    window.history.pushState({ ...window.history.state, driverStep: next }, '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  /** 画面の「戻る」。ブラウザ履歴を1つ戻す（popstate でステップが変わる） */
  const goBack = () => window.history.back();

  /** 単一選択に答える。そのステップの回答が揃ったら自動で次へ */
  const answerOne = (key: keyof DriverAnswers, value: string) => {
    const next = { ...answers, [key]: value };
    setAnswers(next);
    setStepError(null);
    if (isStepComplete(step, next) && step < TOTAL_STEPS) goTo((step + 1) as Step);
  };

  /** 複数選択を切り替える。「経験なし」「特に決めていない」は他と同時に選べない。重視することは最大3つ */
  const toggle = (key: MultiKey, value: string) => {
    setStepError(null);
    setNotice(null);
    const current = answers[key];
    const exclusive = EXCLUSIVE_CHOICES[key as keyof typeof EXCLUSIVE_CHOICES];
    let next: string[];
    if (current.includes(value)) next = current.filter((v) => v !== value);
    else if (exclusive && value === exclusive) next = [value];
    else {
      const without = exclusive ? current.filter((v) => v !== exclusive) : current;
      if (key === 'priorities' && without.length >= PRIORITIES_MAX) {
        setNotice(`重視することは${PRIORITIES_MAX}つまで選べます`);
        return;
      }
      next = [...without, value];
    }
    setAnswers((prev) => ({ ...prev, [key]: next }));
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
                  <QuestionCard
                    index={2}
                    question="ドライバー経験はどのくらいありますか？"
                    choices={options(DRIVER_EXPERIENCES)}
                    value={answers.driverExperience}
                    onSelect={(v) => answerOne('driverExperience', v)}
                  />
                  <NextButton error={stepError} onClick={tryNext} />
                </StepSection>
              )}

              {step === 3 && (
                <StepSection stepNumber={3} totalSteps={TOTAL_STEPS}>
                  <QuestionCard
                    index={1}
                    mode="multi"
                    question="運転経験のある車両を教えてください"
                    hint="複数選択できます"
                    choices={options(EXPERIENCED_VEHICLES)}
                    values={answers.experiencedVehicles}
                    onToggle={(v) => toggle('experiencedVehicles', v)}
                  />
                  <QuestionCard
                    index={2}
                    mode="multi"
                    question="希望する仕事を教えてください"
                    hint="複数選択できます"
                    choices={options(DESIRED_JOB_TYPES)}
                    values={answers.desiredJobTypes}
                    onToggle={(v) => toggle('desiredJobTypes', v)}
                  />
                  <NextButton error={stepError} onClick={tryNext} />
                </StepSection>
              )}

              {step === 4 && (
                <StepSection stepNumber={4} totalSteps={TOTAL_STEPS}>
                  <QuestionCard
                    index={1}
                    question="現在の状況を教えてください"
                    choices={options(EMPLOYMENT_STATUSES)}
                    value={answers.employmentStatus}
                    onSelect={(v) => answerOne('employmentStatus', v)}
                  />
                  <QuestionCard
                    index={2}
                    question="希望する雇用形態を教えてください"
                    choices={options(EMPLOYMENT_TYPES)}
                    value={answers.desiredEmploymentType}
                    onSelect={(v) => answerOne('desiredEmploymentType', v)}
                  />
                </StepSection>
              )}

              {step === 5 && (
                <StepSection stepNumber={5} totalSteps={TOTAL_STEPS}>
                  <LocationStep answers={answers} onChange={changeLocation} onNext={() => goTo(6)} />
                </StepSection>
              )}

              {step === 6 && (
                <StepSection stepNumber={6} totalSteps={TOTAL_STEPS}>
                  <div>
                    <QuestionCard
                      index={1}
                      mode="multi"
                      question="転職先で重視することを教えてください"
                      hint={`${PRIORITIES_MAX}つまで選べます`}
                      choices={options(PRIORITIES)}
                      values={answers.priorities}
                      onToggle={(v) => toggle('priorities', v)}
                    />
                    {notice && <p role="status" className="mt-2 text-center text-xs font-bold text-orange-600">{notice}</p>}
                  </div>
                  <QuestionCard
                    index={2}
                    question="希望する年収を教えてください"
                    choices={options(DESIRED_SALARIES)}
                    value={answers.desiredSalary}
                    onSelect={(v) => answerOne('desiredSalary', v)}
                  />
                  <NextButton error={stepError} onClick={tryNext} />
                </StepSection>
              )}

              {step === 7 && (
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
