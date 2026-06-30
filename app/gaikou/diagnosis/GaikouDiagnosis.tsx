"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import {
  ShieldCheck,
  CircleCheckBig,
  HandHeart,
  MapPinned,
  Clock,
} from "lucide-react";
import "../gaikou.css";
import "./diagnosis.css";
import MotionConfigWrapper from "@/components/gaikou/MotionConfigWrapper";
import DiagnosisProgress from "@/components/gaikou/diagnosis/DiagnosisProgress";
import DiagnosisQuestion from "@/components/gaikou/diagnosis/DiagnosisQuestion";
import DiagnosisOptionCard from "@/components/gaikou/diagnosis/DiagnosisOptionCard";
import AreaSelector from "@/components/gaikou/diagnosis/AreaSelector";
import DiagnosisContactForm from "@/components/gaikou/diagnosis/DiagnosisContactForm";
import DiagnosisResult from "@/components/gaikou/diagnosis/DiagnosisResult";
import {
  diagnosisQuestions,
  paymentMethodOptions,
} from "@/data/gaikou/diagnosisQuestions";
import type { Prefecture } from "@/data/gaikou/municipalities";
import { initialDiagnosisAnswers, TOTAL_STEPS, type DiagnosisAnswers, type DiagnosisContact } from "@/components/gaikou/diagnosis/types";
import { getUtmRecord } from "@/components/gaikou/utm";

const STATE_STORAGE_KEY = "gaikou-diagnosis-state-v1";
const UTM_STORAGE_KEY = "gaikou-diagnosis-utm-v1";

type Direction = "forward" | "backward";
type Phase = "question" | "result";

type PersistedState = {
  step: number;
  answers: DiagnosisAnswers;
};

const TRUST_POINTS = [
  { icon: CircleCheckBig, text: "現地調査・見積もり無料" },
  { icon: ShieldCheck, text: "診断後の契約義務なし" },
  { icon: HandHeart, text: "強引な営業なし" },
  { icon: MapPinned, text: "東海3県対応" },
  { icon: Clock, text: "入力時間約1分" },
];

function loadPersistedState(): PersistedState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STATE_STORAGE_KEY);
    if (!raw) return null;
    const parsed: PersistedState = JSON.parse(raw);
    if (parsed.step >= 1 && parsed.step <= TOTAL_STEPS) return parsed;
  } catch {
    // 復元失敗時はnullを返し初期状態を使う
  }
  return null;
}

export default function GaikouDiagnosis() {
  // sessionStorageの復元はuseState初期化関数内で行い、マウント後にsetStateし直さない
  const [step, setStep] = useState<number>(() => loadPersistedState()?.step ?? 1);
  const [direction, setDirection] = useState<Direction>("forward");
  const [phase, setPhase] = useState<Phase>("question");
  const [answers, setAnswers] = useState<DiagnosisAnswers>(() => ({
    ...initialDiagnosisAnswers,
    ...(loadPersistedState()?.answers ?? {}),
  }));
  const [submitting, setSubmitting] = useState(false);
  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // UTM・クリックIDはマウント時に一度だけ取得してsessionStorageへ保存する（Reactの状態は更新しない）
  useEffect(() => {
    const utmFromUrl = getUtmRecord();
    if (Object.keys(utmFromUrl).length > 0) {
      window.sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utmFromUrl));
    }
  }, []);

  // 回答・質問番号が変わるたびにsessionStorageへ保存（診断完了前のみ）
  useEffect(() => {
    if (phase !== "question") return;
    const payload: PersistedState = { step, answers };
    window.sessionStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(payload));
  }, [step, answers, phase]);

  useEffect(() => {
    return () => {
      if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    };
  }, []);

  function goNext() {
    setDirection("forward");
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  }

  function goBack() {
    setDirection("backward");
    setStep((s) => Math.max(1, s - 1));
  }

  function scheduleAutoAdvance() {
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    autoAdvanceTimer.current = setTimeout(() => {
      goNext();
    }, 300);
  }

  function setPrefecture(prefecture: Prefecture) {
    setAnswers((prev) => ({ ...prev, prefecture, municipality: null }));
  }

  function setMunicipality(municipality: string) {
    setAnswers((prev) => ({ ...prev, municipality }));
  }

  function toggleMulti(field: "constructionTypes" | "worries", optionId: string) {
    setAnswers((prev) => {
      const current = prev[field];
      const next = current.includes(optionId) ? current.filter((id) => id !== optionId) : [...current, optionId];
      return { ...prev, [field]: next };
    });
  }

  function setSingleAndAdvance(field: "size" | "timing", optionId: string) {
    setAnswers((prev) => ({ ...prev, [field]: optionId }));
    scheduleAutoAdvance();
  }

  function setBudget(optionId: string) {
    setAnswers((prev) => ({ ...prev, budget: optionId }));
  }

  function setPaymentMethod(optionId: string) {
    setAnswers((prev) => ({ ...prev, paymentMethod: prev.paymentMethod === optionId ? null : optionId }));
  }

  function setWorriesOther(text: string) {
    setAnswers((prev) => ({ ...prev, worriesOther: text }));
  }

  function setContact(contact: DiagnosisContact) {
    setAnswers((prev) => ({ ...prev, contact }));
  }

  async function handleFinalSubmit() {
    setSubmitting(true);

    const utm = (() => {
      try {
        const raw = window.sessionStorage.getItem(UTM_STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
      } catch {
        return {};
      }
    })();

    try {
      await fetch("/api/gaikou-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, utm }),
      });
    } catch (err) {
      console.error("[外構診断] API送信エラー:", err);
    }

    window.sessionStorage.removeItem(STATE_STORAGE_KEY);
    setSubmitting(false);
    setPhase("result");
  }

  const currentQuestion = diagnosisQuestions.find((q) => q.step === step);

  return (
    <div className="gaikou-lp min-h-screen w-full min-w-0 overflow-x-hidden bg-[#fdfbf6]">
      <h1 className="sr-only">外構プラン無料診断｜岐阜県・愛知県・三重県対応の外構リフォーム診断フォーム</h1>

      <MotionConfigWrapper>
        {phase === "question" && <DiagnosisProgress step={step} />}

        <div className="max-w-xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-center gap-3">
            <Image
              src="/images/gaikou/mascot-worry-male.png"
              alt=""
              width={120}
              height={120}
              aria-hidden="true"
              className="w-10 h-10 object-contain select-none pointer-events-none -rotate-6"
            />
            <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              {TRUST_POINTS.map((point) => (
                <li key={point.text} className="flex items-center gap-1 text-[10.5px] sm:text-[11px] text-[#6b7a73] font-medium">
                  <point.icon className="w-3 h-3 text-[#2f7d5a]" aria-hidden="true" />
                  {point.text}
                </li>
              ))}
            </ul>
            <Image
              src="/images/gaikou/mascot-worry-female.png"
              alt=""
              width={120}
              height={120}
              aria-hidden="true"
              className="w-10 h-10 object-contain select-none pointer-events-none rotate-6"
            />
          </div>
        </div>

        <main className="max-w-xl mx-auto px-4 sm:px-6 pb-16">
          <AnimatePresence mode="wait" custom={direction}>
            {phase === "question" && step === 1 && (
              <DiagnosisQuestion
                key="step-1"
                direction={direction}
                title="工事をご希望の地域を教えてください"
                description="現在は東海3県に対応しています"
                showBack={false}
                onNext={goNext}
                nextDisabled={!answers.municipality}
              >
                <AreaSelector
                  prefecture={answers.prefecture}
                  municipality={answers.municipality}
                  onChangePrefecture={setPrefecture}
                  onChangeMunicipality={setMunicipality}
                />
              </DiagnosisQuestion>
            )}

            {phase === "question" && step === 2 && currentQuestion && (
              <DiagnosisQuestion
                key="step-2"
                direction={direction}
                title={currentQuestion.title}
                showBack
                onBack={goBack}
                onNext={goNext}
                nextDisabled={answers.constructionTypes.length === 0}
              >
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {currentQuestion.options.map((option) => (
                    <DiagnosisOptionCard
                      key={option.id}
                      label={option.label}
                      iconKey={option.iconKey}
                      multi
                      selected={answers.constructionTypes.includes(option.id)}
                      onClick={() => toggleMulti("constructionTypes", option.id)}
                    />
                  ))}
                </div>
              </DiagnosisQuestion>
            )}

            {phase === "question" && step === 3 && currentQuestion && (
              <DiagnosisQuestion
                key="step-3"
                direction={direction}
                title={currentQuestion.title}
                showBack
                onBack={goBack}
                onNext={goNext}
                nextDisabled={answers.worries.length === 0}
              >
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {currentQuestion.options.map((option) => (
                    <DiagnosisOptionCard
                      key={option.id}
                      label={option.label}
                      iconKey={option.iconKey}
                      multi
                      selected={answers.worries.includes(option.id)}
                      onClick={() => toggleMulti("worries", option.id)}
                    />
                  ))}
                </div>
                {answers.worries.includes("other") && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-3">
                    <label htmlFor="worries-other" className="block text-sm font-semibold text-[#10302a] mb-1.5">
                      具体的にご記入ください
                    </label>
                    <textarea
                      id="worries-other"
                      rows={2}
                      value={answers.worriesOther}
                      onChange={(e) => setWorriesOther(e.target.value)}
                      className="w-full rounded-xl border border-[#dcd6c4] bg-white px-4 py-3 text-[15px] outline-none focus:border-[#2f7d5a] focus:ring-2 focus:ring-[#2f7d5a]/20 resize-none"
                    />
                  </motion.div>
                )}
              </DiagnosisQuestion>
            )}

            {phase === "question" && step === 4 && currentQuestion && (
              <DiagnosisQuestion key="step-4" direction={direction} title={currentQuestion.title} showBack onBack={goBack}>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {currentQuestion.options.map((option) => (
                    <DiagnosisOptionCard
                      key={option.id}
                      label={option.label}
                      selected={answers.size === option.id}
                      onClick={() => setSingleAndAdvance("size", option.id)}
                    />
                  ))}
                </div>
              </DiagnosisQuestion>
            )}

            {phase === "question" && step === 5 && currentQuestion && (
              <DiagnosisQuestion key="step-5" direction={direction} title={currentQuestion.title} showBack onBack={goBack}>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {currentQuestion.options.map((option) => (
                    <DiagnosisOptionCard
                      key={option.id}
                      label={option.label}
                      selected={answers.timing === option.id}
                      onClick={() => setSingleAndAdvance("timing", option.id)}
                    />
                  ))}
                </div>
              </DiagnosisQuestion>
            )}

            {phase === "question" && step === 6 && currentQuestion && (
              <DiagnosisQuestion
                key="step-6"
                direction={direction}
                title={currentQuestion.title}
                showBack
                onBack={goBack}
                onNext={goNext}
                nextDisabled={!answers.budget}
              >
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {currentQuestion.options.map((option) => (
                    <DiagnosisOptionCard
                      key={option.id}
                      label={option.label}
                      selected={answers.budget === option.id}
                      onClick={() => setBudget(option.id)}
                    />
                  ))}
                </div>

                <div className="mt-6">
                  <p className="text-sm font-semibold text-[#10302a] mb-2">
                    支払い方法について <span className="text-xs text-[#8a9a90] font-normal">（任意）</span>
                  </p>
                  <div className="grid sm:grid-cols-3 gap-2">
                    {paymentMethodOptions.map((option) => (
                      <DiagnosisOptionCard
                        key={option.id}
                        label={option.label}
                        selected={answers.paymentMethod === option.id}
                        onClick={() => setPaymentMethod(option.id)}
                      />
                    ))}
                  </div>
                  <p className="mt-2.5 text-[11px] text-[#8a9a90] leading-relaxed">
                    ローンの審査や契約は各金融機関とお客様との間で行われます。
                    <br />
                    申請に必要な見積書や工事関係書類をご用意します。
                  </p>
                </div>
              </DiagnosisQuestion>
            )}

            {phase === "question" && step === 7 && (
              <DiagnosisContactForm
                key="step-7"
                prefecture={answers.prefecture}
                municipality={answers.municipality}
                contact={answers.contact}
                onChange={setContact}
                onBackToArea={() => {
                  setDirection("backward");
                  setStep(1);
                }}
                onBack={goBack}
                onSubmit={handleFinalSubmit}
                submitting={submitting}
              />
            )}

            {phase === "result" && <DiagnosisResult key="result" worries={answers.worries} />}
          </AnimatePresence>
        </main>
      </MotionConfigWrapper>
    </div>
  );
}
