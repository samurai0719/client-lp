"use client";

// 新築外構 無料診断（チャットボット形式のステップ式フォーム）
//
// UI・進行・バリデーション・履歴の挙動はリフォームLPの診断
// （app/gaikou/diagnosis/GaikouDiagnosis.tsx）を踏襲し、
// 質問内容と送信先（POST /api/new-exterior-contact）を新築外構向けに変更している。

import { Fragment, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ShieldCheck,
  CircleCheckBig,
  HandHeart,
  MapPinned,
  Clock,
  ChevronLeft,
  Calculator,
} from "lucide-react";
import "../../gaikou/gaikou.css";
import "../../gaikou/diagnosis/diagnosis.css";
import MotionConfigWrapper from "@/components/gaikou/MotionConfigWrapper";
import DiagnosisOptionCard from "@/components/gaikou/diagnosis/DiagnosisOptionCard";
import { BotMessage, TypingBubble, UserMessage } from "@/components/gaikou/diagnosis/chat/ChatBubbles";
import DiagnosisProgress from "@/components/new-exterior/diagnosis/DiagnosisProgress";
import DiagnosisContactForm from "@/components/new-exterior/diagnosis/DiagnosisContactForm";
import DiagnosisConfirmation from "@/components/new-exterior/diagnosis/DiagnosisConfirmation";
import DiagnosisResult from "@/components/new-exterior/diagnosis/DiagnosisResult";
import { answerLinesForStep, questionForStep } from "@/components/new-exterior/diagnosis/summary";
import { diagnosisQuestions } from "@/data/new-exterior/diagnosisQuestions";
import {
  initialDiagnosisAnswers,
  TOTAL_STEPS,
  type DiagnosisAnswers,
  type DiagnosisContact,
} from "@/components/new-exterior/diagnosis/types";
import { getUtmRecord } from "@/components/new-exterior/utm";
import { NEW_EXTERIOR_SIMULATOR_ESTIMATE_STORAGE_KEY } from "@/lib/calculate-exterior-estimate";
import { trackEvent } from "@/lib/analytics/track";

const STATE_STORAGE_KEY = "new-exterior-diagnosis-state-v1";
const UTM_STORAGE_KEY = "new-exterior-diagnosis-utm-v1";
const STARTED_FLAG_KEY = "new-exterior-diagnosis-started-v1";

type Phase = "question" | "confirm" | "result";

type PersistedState = {
  step: number;
  answers: DiagnosisAnswers;
};

// シミュレーターから引き継がれる概算価格
type SimulatorEstimateHandoff = {
  label: string;
  works: string[];
  at: number;
};

const TRUST_POINTS = [
  { icon: CircleCheckBig, text: "現地調査・見積もり無料" },
  { icon: ShieldCheck, text: "診断後の契約義務なし" },
  { icon: HandHeart, text: "強引な営業なし" },
  { icon: MapPinned, text: "東海3県対応" },
  { icon: Clock, text: "入力時間約30秒" },
];

const GREETING_LINES = [
  "こんにちは。\n新築外構の無料診断をご利用いただきありがとうございます。\nいくつかの質問に答えていただくと、新築のお住まいに合った外構プランと概算をご案内できます。",
  "それでは、外構について教えてください。",
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

function loadSimulatorEstimate(): SimulatorEstimateHandoff | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(NEW_EXTERIOR_SIMULATOR_ESTIMATE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SimulatorEstimateHandoff;
    if (!parsed.label || !Array.isArray(parsed.works)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export default function NewExteriorDiagnosis() {
  // sessionStorageの復元はuseState初期化関数内で行い、マウント後にsetStateし直さない
  const [step, setStep] = useState<number>(() => loadPersistedState()?.step ?? 1);
  const [phase, setPhase] = useState<Phase>("question");
  const [answers, setAnswers] = useState<DiagnosisAnswers>(() => ({
    ...initialDiagnosisAnswers,
    ...(loadPersistedState()?.answers ?? {}),
  }));
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [typing, setTyping] = useState(false);
  // シミュレーターからの概算価格（あれば問い合わせに添えて送信する）
  // sessionStorageの読み込みはuseState初期化関数内で行い、マウント後にsetStateし直さない
  const [simEstimate] = useState<SimulatorEstimateHandoff | null>(() => loadSimulatorEstimate());

  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const questionAnchorRef = useRef<HTMLDivElement>(null);
  const scrollArmedUntil = useRef(0);
  const historyArmed = useRef(false);
  const inquiryCompleted = useRef(false);
  const stepRef = useRef(step);
  const phaseRef = useRef(phase);
  stepRef.current = step;
  phaseRef.current = phase;

  // UTM・クリックIDはマウント時に一度だけ取得してsessionStorageへ保存する
  useEffect(() => {
    const utmFromUrl = getUtmRecord();
    if (Object.keys(utmFromUrl).length > 0) {
      window.sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utmFromUrl));
    }
  }, []);

  // 回答・質問番号が変わるたびにsessionStorageへ保存（送信完了前のみ）
  useEffect(() => {
    if (phase === "result") return;
    const payload: PersistedState = { step, answers };
    window.sessionStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(payload));
  }, [step, answers, phase]);

  // 計測: 診断開始（リロードでは二重送信しない）
  useEffect(() => {
    try {
      if (!window.sessionStorage.getItem(STARTED_FLAG_KEY)) {
        window.sessionStorage.setItem(STARTED_FLAG_KEY, "1");
        trackEvent("new_exterior_diagnosis_start");
      }
    } catch {
      // 計測不可でも診断は継続
    }
  }, []);

  // 計測: 質問表示（同一ステップの重複送信はしない）
  const lastViewedStep = useRef<number | null>(null);
  useEffect(() => {
    if (phase !== "question") return;
    if (lastViewedStep.current === step) return;
    lastViewedStep.current = step;
    trackEvent("new_exterior_diagnosis_step_view", { step });
  }, [step, phase]);

  // ステップが変わったら短い「入力中…」を挟んで次の質問を表示する
  const typedStep = useRef<number | null>(null);
  useEffect(() => {
    if (phase !== "question") return;
    if (typedStep.current === step) return;
    typedStep.current = step;
    setTyping(true);
    const timer = setTimeout(() => setTyping(false), 450);
    return () => clearTimeout(timer);
  }, [step, phase]);

  // ユーザー操作直後のみ自動スクロールする
  useEffect(() => {
    if (Date.now() > scrollArmedUntil.current) return;
    const id = requestAnimationFrame(() => {
      if (phase === "question") {
        questionAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    });
    return () => cancelAnimationFrame(id);
  }, [step, typing, phase, submitError]);

  useEffect(() => {
    return () => {
      if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    };
  }, []);

  // ブラウザの「戻る」を診断内の「ひとつ前の質問に戻る」に変換する
  useEffect(() => {
    const onPopState = () => {
      if (phaseRef.current === "result") return;
      if (phaseRef.current === "confirm") {
        setPhase("question");
        armScroll();
        window.history.pushState({ newExteriorDiagnosis: true }, "");
        return;
      }
      if (stepRef.current > 1) {
        goBack();
        window.history.pushState({ newExteriorDiagnosis: true }, "");
      } else {
        historyArmed.current = false;
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function armScroll() {
    scrollArmedUntil.current = Date.now() + 1400;
  }

  function armHistoryGuard() {
    if (!historyArmed.current) {
      window.history.pushState({ newExteriorDiagnosis: true }, "");
      historyArmed.current = true;
    }
  }

  function goNext() {
    armScroll();
    armHistoryGuard();
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  }

  function goBack() {
    armScroll();
    trackEvent("new_exterior_diagnosis_back", { step: stepRef.current });
    setStep((s) => Math.max(1, s - 1));
  }

  function scheduleAutoAdvance() {
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    autoAdvanceTimer.current = setTimeout(() => {
      goNext();
    }, 300);
  }

  function setSingleAndAdvance(
    field: "region" | "status" | "parkingCount" | "budget" | "timing",
    optionId: string
  ) {
    setAnswers((prev) => ({ ...prev, [field]: optionId }));
    trackEvent("new_exterior_diagnosis_answer", { step: stepRef.current, field });
    armScroll();
    armHistoryGuard();
    scheduleAutoAdvance();
  }

  function toggleConstructionType(optionId: string) {
    setAnswers((prev) => {
      const current = prev.constructionTypes;
      const next = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];
      return { ...prev, constructionTypes: next };
    });
  }

  function confirmStep(field: string) {
    trackEvent("new_exterior_diagnosis_answer", { step: stepRef.current, field });
    goNext();
  }

  function setContact(contact: DiagnosisContact) {
    setAnswers((prev) => ({ ...prev, contact }));
  }

  // 連絡先フォームのバリデーション通過後、最終確認へ進む
  function goToConfirmation() {
    trackEvent("new_exterior_diagnosis_answer", { step: 7, field: "contact" });
    trackEvent("inquiry_started");
    armScroll();
    setSubmitError("");
    setPhase("confirm");
  }

  function backToContactForm() {
    armScroll();
    setSubmitError("");
    setPhase("question");
  }

  async function handleFinalSubmit() {
    if (submitting) return;
    setSubmitting(true);
    setSubmitError("");

    const utm = (() => {
      try {
        const raw = window.sessionStorage.getItem(UTM_STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
      } catch {
        return {};
      }
    })();

    try {
      // lpType で新築外構LPからの問い合わせだと判別できるようにする
      const res = await fetch("/api/new-exterior-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lpType: "new_exterior",
          answers,
          utm,
          simulatorEstimate: simEstimate
            ? { label: simEstimate.label, works: simEstimate.works }
            : null,
        }),
      });
      if (!res.ok) throw new Error(`status ${res.status}`);

      window.sessionStorage.removeItem(STATE_STORAGE_KEY);
      if (!inquiryCompleted.current) {
        inquiryCompleted.current = true;
        trackEvent("inquiry_completed");
      }
      armScroll();
      setPhase("result");
    } catch (err) {
      console.error("[新築外構診断] API送信エラー:", err);
      // 入力済みの回答は保持したまま、再送信できるようにする
      setSubmitError("通信に失敗しました。時間をおいて再度お試しください。");
      armScroll();
    } finally {
      setSubmitting(false);
    }
  }

  const currentQuestion = diagnosisQuestions.find((q) => q.step === step);
  const completedSteps = phase === "confirm" ? 6 : step - 1;
  const showCurrentQuestion = phase === "question" && !typing;

  // ── 回答エリア（現在の質問の選択肢） ─────────────────────────────
  function renderAnswerPanel() {
    if (step === 1 && currentQuestion) {
      return (
        <div className="grid grid-cols-2 gap-2">
          {currentQuestion.options.map((option) => (
            <DiagnosisOptionCard
              key={option.id}
              label={option.label}
              selected={answers.region === option.id}
              onClick={() => setSingleAndAdvance("region", option.id)}
            />
          ))}
        </div>
      );
    }

    if (step === 2 && currentQuestion) {
      return (
        <div className="grid sm:grid-cols-2 gap-2">
          {currentQuestion.options.map((option) => (
            <DiagnosisOptionCard
              key={option.id}
              label={option.label}
              iconKey={option.iconKey}
              selected={answers.status === option.id}
              onClick={() => setSingleAndAdvance("status", option.id)}
            />
          ))}
        </div>
      );
    }

    if (step === 3 && currentQuestion) {
      return (
        <div className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-2">
            {currentQuestion.options.map((option) => (
              <DiagnosisOptionCard
                key={option.id}
                label={option.label}
                iconKey={option.iconKey}
                multi
                selected={answers.constructionTypes.includes(option.id)}
                onClick={() => toggleConstructionType(option.id)}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => confirmStep("constructionTypes")}
            disabled={answers.constructionTypes.length === 0}
            className="gaikou-cta-btn w-full disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="gaikou-cta-btn-inner">この内容で次へ</span>
          </button>
        </div>
      );
    }

    if (step === 4 && currentQuestion) {
      return (
        <div className="grid grid-cols-2 gap-2">
          {currentQuestion.options.map((option) => (
            <DiagnosisOptionCard
              key={option.id}
              label={option.label}
              selected={answers.parkingCount === option.id}
              onClick={() => setSingleAndAdvance("parkingCount", option.id)}
            />
          ))}
        </div>
      );
    }

    if (step === 5 && currentQuestion) {
      return (
        <div className="grid sm:grid-cols-2 gap-2">
          {currentQuestion.options.map((option) => (
            <DiagnosisOptionCard
              key={option.id}
              label={option.label}
              selected={answers.budget === option.id}
              onClick={() => setSingleAndAdvance("budget", option.id)}
            />
          ))}
        </div>
      );
    }

    if (step === 6 && currentQuestion) {
      return (
        <div className="grid sm:grid-cols-2 gap-2">
          {currentQuestion.options.map((option) => (
            <DiagnosisOptionCard
              key={option.id}
              label={option.label}
              selected={answers.timing === option.id}
              onClick={() => setSingleAndAdvance("timing", option.id)}
            />
          ))}
        </div>
      );
    }

    if (step === 7) {
      return (
        <DiagnosisContactForm
          contact={answers.contact}
          onChange={setContact}
          onBack={goBack}
          onSubmit={goToConfirmation}
          submitting={submitting}
          submitLabel="入力内容を確認する"
        />
      );
    }

    return null;
  }

  return (
    <div className="gaikou-lp min-h-screen w-full min-w-0 overflow-x-hidden bg-[#fdfbf6]">
      <h1 className="sr-only">新築外構 無料診断｜岐阜県・愛知県・三重県対応の新築外構相談フォーム</h1>

      <MotionConfigWrapper>
        {phase !== "result" && <DiagnosisProgress step={step} />}

        <div className="max-w-xl mx-auto px-4 sm:px-6 py-2">
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
                <li
                  key={point.text}
                  className="flex items-center gap-1 text-[10.5px] sm:text-[11px] text-[#6b7a73] font-medium"
                >
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

        <main className="max-w-xl mx-auto px-4 sm:px-6 pb-[calc(48px+env(safe-area-inset-bottom))]">
          {phase === "result" ? (
            <DiagnosisResult />
          ) : (
            <div className="space-y-2.5 sm:space-y-3 pt-2" aria-live="polite">
              {/* シミュレーターからの概算価格（送信内容に添えられる） */}
              {simEstimate && (
                <div className="rounded-xl bg-[#fff7ec] border border-[#e8a25a] px-4 py-3">
                  <p className="flex items-center gap-1.5 text-xs font-bold text-[#a85a1f]">
                    <Calculator className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    シミュレーションの概算費用：
                    <span className="text-[#d9601a]">{simEstimate.label}</span>
                  </p>
                  <p className="mt-1 text-[11px] text-[#8a7a55] leading-relaxed">
                    対象：{simEstimate.works.join("・")}／この概算を添えて送信されます。
                  </p>
                </div>
              )}

              {/* 最初の挨拶 */}
              <BotMessage showName>{GREETING_LINES[0]}</BotMessage>
              <BotMessage>{GREETING_LINES[1]}</BotMessage>

              {/* 回答済みの質問と回答（会話履歴） */}
              {Array.from({ length: completedSteps }, (_, i) => i + 1).map((s) => {
                const q = questionForStep(s);
                return (
                  <Fragment key={s}>
                    <BotMessage>
                      <span className="font-bold">{q.title}</span>
                      {q.description && (
                        <span className="block mt-1 text-[11px] text-[#8a9a90]">{q.description}</span>
                      )}
                    </BotMessage>
                    <UserMessage lines={answerLinesForStep(s, answers)} />
                  </Fragment>
                );
              })}

              {/* 現在の質問（アンカーは固定ヘッダーの高さぶん余白を確保） */}
              <div ref={questionAnchorRef} className="scroll-mt-[92px]" aria-hidden="true" />
              {phase === "question" && typing && <TypingBubble />}
              {showCurrentQuestion && (
                <BotMessage showName>
                  <span className="font-bold">{questionForStep(step).title}</span>
                  {questionForStep(step).description && (
                    <span className="block mt-1 text-[11px] text-[#8a9a90]">
                      {questionForStep(step).description}
                    </span>
                  )}
                </BotMessage>
              )}

              {/* 回答エリア */}
              {showCurrentQuestion && (
                <div className="gd-chat-appear pt-1">
                  {renderAnswerPanel()}
                  {step > 1 && step < 7 && (
                    <button
                      type="button"
                      onClick={goBack}
                      className="mx-auto mt-3 flex items-center justify-center gap-1 min-h-[44px] px-3 text-sm font-semibold text-[#6b7a73] hover:text-[#10302a] transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                      ひとつ前の質問に戻る
                    </button>
                  )}
                </div>
              )}

              {/* 最終確認 */}
              {phase === "confirm" && (
                <>
                  <BotMessage showName>
                    <span className="font-bold">ありがとうございます。入力内容をご確認ください。</span>
                    {"\n"}
                    よろしければ「無料で診断結果・見積もり相談を送信する」を押してください。
                  </BotMessage>
                  <div className="gd-chat-appear">
                    <DiagnosisConfirmation
                      answers={answers}
                      submitting={submitting}
                      submitError={submitError}
                      onEdit={backToContactForm}
                      onSubmit={handleFinalSubmit}
                    />
                  </div>
                </>
              )}

              <div ref={bottomRef} aria-hidden="true" />
            </div>
          )}
        </main>
      </MotionConfigWrapper>
    </div>
  );
}
