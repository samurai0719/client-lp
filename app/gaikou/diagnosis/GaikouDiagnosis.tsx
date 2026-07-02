"use client";

// 外構プラン無料診断（チャットボット形式UI）
//
// 質問内容・順番・選択肢・必須任意・バリデーション・送信ペイロード
// （POST /api/gaikou-contact {answers, utm}）は従来のステップ形式と同一。
// 変更したのは見た目と回答方法（チャット履歴形式）のみ。

import { Fragment, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ShieldCheck,
  CircleCheckBig,
  HandHeart,
  MapPinned,
  Clock,
  ChevronLeft,
} from "lucide-react";
import "../gaikou.css";
import "./diagnosis.css";
import MotionConfigWrapper from "@/components/gaikou/MotionConfigWrapper";
import DiagnosisProgress from "@/components/gaikou/diagnosis/DiagnosisProgress";
import DiagnosisOptionCard from "@/components/gaikou/diagnosis/DiagnosisOptionCard";
import AreaSelector from "@/components/gaikou/diagnosis/AreaSelector";
import DiagnosisContactForm from "@/components/gaikou/diagnosis/DiagnosisContactForm";
import DiagnosisResult from "@/components/gaikou/diagnosis/DiagnosisResult";
import { BotMessage, TypingBubble, UserMessage } from "@/components/gaikou/diagnosis/chat/ChatBubbles";
import DiagnosisConfirmation from "@/components/gaikou/diagnosis/chat/DiagnosisConfirmation";
import { answerLinesForStep, questionForStep } from "@/components/gaikou/diagnosis/chat/summary";
import {
  diagnosisQuestions,
  paymentMethodOptions,
} from "@/data/gaikou/diagnosisQuestions";
import type { Prefecture } from "@/data/gaikou/municipalities";
import {
  initialDiagnosisAnswers,
  TOTAL_STEPS,
  type DiagnosisAnswers,
  type DiagnosisContact,
} from "@/components/gaikou/diagnosis/types";
import { getUtmRecord } from "@/components/gaikou/utm";
import { trackEvent } from "@/lib/analytics/track";

const STATE_STORAGE_KEY = "gaikou-diagnosis-state-v1";
const UTM_STORAGE_KEY = "gaikou-diagnosis-utm-v1";
const STARTED_FLAG_KEY = "gaikou-diagnosis-started-v1";

type Phase = "question" | "confirm" | "result";

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

// 案内役からの最初の挨拶（1問目の質問文自体は変更していない）
const GREETING_LINES = [
  "こんにちは。\n外構プラン診断をご利用いただきありがとうございます。\nいくつかの質問に答えていただくと、お客様に合った外構リフォームプランをご案内できます。",
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

export default function GaikouDiagnosis() {
  // sessionStorageの復元はuseState初期化関数内で行い、マウント後にsetStateし直さない
  const [step, setStep] = useState<number>(() => loadPersistedState()?.step ?? 1);
  const [phase, setPhase] = useState<Phase>("question");
  const [answers, setAnswers] = useState<DiagnosisAnswers>(() => ({
    ...initialDiagnosisAnswers,
    ...(loadPersistedState()?.answers ?? {}),
  }));
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  // 次の質問を表示する前の「入力中…」表示
  const [typing, setTyping] = useState(false);

  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  // 現在の質問の直前に置くアンカー。質問文が画面上部に見える位置へスクロールする
  const questionAnchorRef = useRef<HTMLDivElement>(null);
  // ユーザー操作直後だけ自動スクロールする（履歴を読んでいる最中に飛ばさない）
  const scrollArmedUntil = useRef(0);
  const historyArmed = useRef(false);
  const inquiryCompleted = useRef(false);
  const stepRef = useRef(step);
  const phaseRef = useRef(phase);
  stepRef.current = step;
  phaseRef.current = phase;

  // UTM・クリックIDはマウント時に一度だけ取得してsessionStorageへ保存する（従来と同一）
  useEffect(() => {
    const utmFromUrl = getUtmRecord();
    if (Object.keys(utmFromUrl).length > 0) {
      window.sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utmFromUrl));
    }
  }, []);

  // 回答・質問番号が変わるたびにsessionStorageへ保存（送信完了前のみ・従来と同一キー）
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
        trackEvent("diagnosis_start");
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
    trackEvent("diagnosis_step_view", { step });
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

  // ユーザー操作直後のみ自動スクロールする。
  // 質問中は「現在の質問の先頭」へ合わせ、選択肢が多くても質問文が見える位置に保つ。
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
  }, [step, typing, phase, submitError, answers.prefecture]);

  useEffect(() => {
    return () => {
      if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    };
  }, []);

  // ブラウザの「戻る」を診断内の「ひとつ前の質問に戻る」に変換する
  // （回答済みの状態で誤ってLPへ戻ってしまうのを防ぐ）
  useEffect(() => {
    const onPopState = () => {
      if (phaseRef.current === "result") return;
      if (phaseRef.current === "confirm") {
        setPhase("question");
        armScroll();
        window.history.pushState({ gaikouDiagnosis: true }, "");
        return;
      }
      if (stepRef.current > 1) {
        goBack();
        window.history.pushState({ gaikouDiagnosis: true }, "");
      } else {
        // 1問目まで戻ったら、次の「戻る」でページを離れられるようにする
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
      window.history.pushState({ gaikouDiagnosis: true }, "");
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
    trackEvent("diagnosis_back", { step: stepRef.current });
    setStep((s) => Math.max(1, s - 1));
  }

  function scheduleAutoAdvance() {
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    autoAdvanceTimer.current = setTimeout(() => {
      goNext();
    }, 300);
  }

  function setPrefecture(prefecture: Prefecture) {
    armScroll();
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
    trackEvent("diagnosis_answer", { step: stepRef.current, field });
    armScroll();
    armHistoryGuard();
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

  function confirmStep(field: string) {
    trackEvent("diagnosis_answer", { step: stepRef.current, field });
    goNext();
  }

  // 連絡先フォームのバリデーション通過後、最終確認へ進む
  function goToConfirmation() {
    trackEvent("diagnosis_answer", { step: 7, field: "contact" });
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
      // 送信ペイロードは従来と同一（{answers, utm}）。API・CRM保存処理は変更しない。
      const res = await fetch("/api/gaikou-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, utm }),
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
      console.error("[外構診断] API送信エラー:", err);
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
    if (step === 1) {
      return (
        <div className="space-y-3">
          <AreaSelector
            prefecture={answers.prefecture}
            municipality={answers.municipality}
            onChangePrefecture={setPrefecture}
            onChangeMunicipality={setMunicipality}
          />
          <button
            type="button"
            onClick={() => confirmStep("area")}
            disabled={!answers.municipality}
            className="gaikou-cta-btn w-full disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="gaikou-cta-btn-inner">次の質問へ</span>
          </button>
        </div>
      );
    }

    if (step === 2 && currentQuestion) {
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
                onClick={() => toggleMulti("constructionTypes", option.id)}
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
                selected={answers.worries.includes(option.id)}
                onClick={() => toggleMulti("worries", option.id)}
              />
            ))}
          </div>
          {answers.worries.includes("other") && (
            <div className="gd-chat-appear">
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
            </div>
          )}
          <button
            type="button"
            onClick={() => confirmStep("worries")}
            disabled={answers.worries.length === 0}
            className="gaikou-cta-btn w-full disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="gaikou-cta-btn-inner">この内容で次へ</span>
          </button>
        </div>
      );
    }

    if (step === 4 && currentQuestion) {
      return (
        <div className="grid sm:grid-cols-2 gap-2">
          {currentQuestion.options.map((option) => (
            <DiagnosisOptionCard
              key={option.id}
              label={option.label}
              selected={answers.size === option.id}
              onClick={() => setSingleAndAdvance("size", option.id)}
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
              selected={answers.timing === option.id}
              onClick={() => setSingleAndAdvance("timing", option.id)}
            />
          ))}
        </div>
      );
    }

    if (step === 6 && currentQuestion) {
      return (
        <div className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-2">
            {currentQuestion.options.map((option) => (
              <DiagnosisOptionCard
                key={option.id}
                label={option.label}
                selected={answers.budget === option.id}
                onClick={() => setBudget(option.id)}
              />
            ))}
          </div>

          <div>
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

          <button
            type="button"
            onClick={() => confirmStep("budget")}
            disabled={!answers.budget}
            className="gaikou-cta-btn w-full disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="gaikou-cta-btn-inner">次の質問へ</span>
          </button>
        </div>
      );
    }

    if (step === 7) {
      return (
        <DiagnosisContactForm
          prefecture={answers.prefecture}
          municipality={answers.municipality}
          contact={answers.contact}
          onChange={setContact}
          onBackToArea={() => {
            armScroll();
            setStep(1);
          }}
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
      <h1 className="sr-only">外構プラン無料診断｜岐阜県・愛知県・三重県対応の外構リフォーム診断フォーム</h1>

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

        <main className="max-w-xl mx-auto px-4 sm:px-6 pb-[calc(48px+env(safe-area-inset-bottom))]">
          {phase === "result" ? (
            <DiagnosisResult worries={answers.worries} />
          ) : (
            <div className="space-y-2.5 sm:space-y-3 pt-2" aria-live="polite">
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
                    よろしければ「この内容で無料見積もりを依頼する」を押してください。
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
