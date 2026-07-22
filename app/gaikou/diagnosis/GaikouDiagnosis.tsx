"use client";

// 外構プラン無料診断（チャットボット形式UI・4ステップ構成）
//
// STEP1: 地域（都道府県＋市区町村チップ）
// STEP2: 工事種別（新築外構/外構リフォーム）＋希望する工事内容
// STEP3: 施工予定の広さ＋工事希望時期（任意）
// STEP4: 概算価格の表示 → 連絡先入力 → 確認画面なしでそのまま送信
//
// 送信ペイロードは POST /api/gaikou-contact {answers, utm, eventId}。
// 送信成功後に Meta Pixel の Lead を両Pixelへ1回だけ発火する（fireMetaLead）。

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
import DiagnosisEstimateCard from "@/components/gaikou/diagnosis/DiagnosisEstimateCard";
import DiagnosisResult from "@/components/gaikou/diagnosis/DiagnosisResult";
import { BotMessage, TypingBubble, UserMessage } from "@/components/gaikou/diagnosis/chat/ChatBubbles";
import { answerLinesForStep, questionForStep } from "@/components/gaikou/diagnosis/chat/summary";
import {
  constructionOptionsForWorkType,
  sizeOptions,
  timingOptions,
  workTypeOptions,
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
import { fireMetaLead, generateLeadEventId } from "@/lib/analytics/metaLead";
import { fireLpInsightLead } from "@/components/analytics/lpInsightLead";
import { calculateDiagnosisEstimate } from "@/lib/gaikou-diagnosis-estimate";

// v4: 新築外構選択時の工事内容選択肢（nc-）を分離したためキーを更新（旧キーの途中状態は引き継がない）
const STATE_STORAGE_KEY = "gaikou-diagnosis-state-v4";
const UTM_STORAGE_KEY = "gaikou-diagnosis-utm-v1";
const STARTED_FLAG_KEY = "gaikou-diagnosis-started-v1";

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

// 案内役からの最初の挨拶
const GREETING_LINES = [
  "こんにちは。\n外構プラン診断をご利用いただきありがとうございます。\n4つのステップに答えていただくと、概算費用の目安とお客様に合った外構プランをご案内できます。",
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
  // 現場写真の実体。File はJSONへ変換できないため、sessionStorageへ保存されるanswersには
  // 含めず、別のstateとして保持する（送信時にのみ使用）
  const [contactPhotoFile, setContactPhotoFile] = useState<File | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  // 現在の質問の直前に置くアンカー。質問文が画面上部に見える位置へスクロールする
  const questionAnchorRef = useRef<HTMLDivElement>(null);
  // ユーザー操作直後だけ自動スクロールする（履歴を読んでいる最中に飛ばさない）
  const scrollArmedUntil = useRef(0);
  const historyArmed = useRef(false);
  // Lead・完了イベントの発火済み管理（二重クリック・再レンダリングでの重複発火防止）
  const inquiryCompleted = useRef(false);
  const leadFired = useRef(false);
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

  // 回答・質問番号が変わるたびにsessionStorageへ保存（送信完了前のみ・従来と同一キー体系）
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

  // 計測: ステップ表示（同一ステップの重複送信はしない）
  const lastViewedStep = useRef<number | null>(null);
  useEffect(() => {
    if (phase !== "question") return;
    if (lastViewedStep.current === step) return;
    lastViewedStep.current = step;
    trackEvent("diagnosis_step_view", { step });
    // 連絡先入力（STEP4）到達＝問い合わせ開始
    if (step === 4) trackEvent("inquiry_started");
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

  // ブラウザの「戻る」を診断内の「ひとつ前のステップに戻る」に変換する
  useEffect(() => {
    const onPopState = () => {
      if (phaseRef.current === "result") return;
      if (stepRef.current > 1) {
        goBack();
        window.history.pushState({ gaikouDiagnosis: true }, "");
      } else {
        // STEP1まで戻ったら、次の「戻る」でページを離れられるようにする
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

  function setPrefecture(prefecture: Prefecture) {
    armScroll();
    setAnswers((prev) => ({ ...prev, prefecture, municipality: null }));
  }

  function setMunicipality(municipality: string) {
    setAnswers((prev) => ({ ...prev, municipality }));
  }

  function setWorkType(optionId: string) {
    setAnswers((prev) => {
      // 工事内容の選択肢は種別ごとに異なるため、種別を切り替えたら
      // 新しい選択肢に存在しない選択を破棄する
      const validIds = new Set(constructionOptionsForWorkType(optionId).map((o) => o.id));
      return {
        ...prev,
        workType: optionId,
        constructionTypes: prev.constructionTypes.filter((id) => validIds.has(id)),
      };
    });
  }

  function toggleConstructionType(optionId: string) {
    setAnswers((prev) => {
      const current = prev.constructionTypes;
      const next = current.includes(optionId) ? current.filter((id) => id !== optionId) : [...current, optionId];
      return { ...prev, constructionTypes: next };
    });
  }

  function setSize(optionId: string) {
    setAnswers((prev) => ({ ...prev, size: optionId }));
  }

  function setTiming(optionId: string) {
    // 任意項目のため、同じ選択肢をもう一度押すと解除できる
    setAnswers((prev) => ({ ...prev, timing: prev.timing === optionId ? null : optionId }));
  }

  function setContact(contact: DiagnosisContact) {
    setAnswers((prev) => ({ ...prev, contact }));
  }

  function confirmStep(field: string) {
    trackEvent("diagnosis_answer", { step: stepRef.current, field });
    goNext();
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

    // 表示した概算をリードにも添付する（管理画面・CRMで確認できる）
    const estimate = calculateDiagnosisEstimate(answers);
    // CAPI併用時の重複除外用ID（PixelのeventIDと送信ペイロードで同じ値を使う）
    const eventId = generateLeadEventId();

    try {
      const payload = {
        answers,
        utm,
        eventId,
        // お客様に表示した金額（最安のみ）と同じ表記で保存する
        estimate: estimate ? { label: `約${estimate.minMan}万円〜`, works: estimate.works } : null,
      };

      // 現場写真が添付されている場合は multipart/form-data で1リクエストにまとめて送信する
      const fd = new FormData();
      fd.append("payload", JSON.stringify(payload));
      if (contactPhotoFile) fd.append("images", contactPhotoFile);

      const res = await fetch("/api/gaikou-contact", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) throw new Error(`status ${res.status}`);

      window.sessionStorage.removeItem(STATE_STORAGE_KEY);
      if (!inquiryCompleted.current) {
        inquiryCompleted.current = true;
        trackEvent("inquiry_completed");
      }
      // Meta Pixel Lead：APIレスポンス成功後に両Pixelへ1回だけ発火
      if (!leadFired.current) {
        leadFired.current = true;
        fireMetaLead(eventId, "gaikou-diagnosis");
        // LP Insight にもCVを送信（ヒートマップ側のコンバージョン計測）
        fireLpInsightLead("lead", 1);
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

  const completedSteps = step - 1;
  const showCurrentQuestion = phase === "question" && !typing;
  const estimate = step === 4 || phase === "result" ? calculateDiagnosisEstimate(answers) : null;

  // ── 回答エリア（現在のステップの入力パネル） ───────────────────────
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
            disabled={!answers.municipality?.trim()}
            className="gaikou-cta-btn w-full disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="gaikou-cta-btn-inner">次へ進む</span>
          </button>
        </div>
      );
    }

    if (step === 2) {
      return (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-[#10302a] mb-2">工事の種類</p>
            <div className="grid grid-cols-2 gap-2">
              {workTypeOptions.map((option) => (
                <DiagnosisOptionCard
                  key={option.id}
                  label={option.label}
                  iconKey={option.iconKey}
                  selected={answers.workType === option.id}
                  onClick={() => setWorkType(option.id)}
                />
              ))}
            </div>
          </div>

          {/* 工事内容は種別（新築外構/外構リフォーム）に合わせた選択肢を表示する */}
          {answers.workType && (
            <div className="gd-chat-appear">
              <p className="text-sm font-semibold text-[#10302a] mb-2">
                希望する工事内容 <span className="text-xs text-[#8a9a90] font-normal">（複数選択可）</span>
              </p>
              <div className="grid grid-cols-2 gap-2">
                {constructionOptionsForWorkType(answers.workType).map((option) => (
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
            </div>
          )}

          <button
            type="button"
            onClick={() => confirmStep("workType-constructionTypes")}
            disabled={!answers.workType || answers.constructionTypes.length === 0}
            className="gaikou-cta-btn w-full disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="gaikou-cta-btn-inner">次へ進む</span>
          </button>
        </div>
      );
    }

    if (step === 3) {
      return (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-[#10302a] mb-2">施工をご希望の広さ</p>
            <div className="grid grid-cols-2 gap-2">
              {sizeOptions.map((option) => (
                <DiagnosisOptionCard
                  key={option.id}
                  label={option.label}
                  iconKey={option.iconKey}
                  selected={answers.size === option.id}
                  onClick={() => setSize(option.id)}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-[#10302a] mb-2">
              工事のご希望時期 <span className="text-xs text-[#8a9a90] font-normal">（任意）</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              {timingOptions.map((option) => (
                <DiagnosisOptionCard
                  key={option.id}
                  label={option.label}
                  iconKey={option.iconKey}
                  selected={answers.timing === option.id}
                  onClick={() => setTiming(option.id)}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => confirmStep("size-timing")}
            disabled={!answers.size}
            className="gaikou-cta-btn w-full disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="gaikou-cta-btn-inner">概算の目安を見る</span>
          </button>
        </div>
      );
    }

    if (step === 4) {
      return (
        <div className="space-y-4">
          {/* 電話番号などの入力前に、選択内容に応じた概算価格帯を表示する */}
          <DiagnosisEstimateCard estimate={estimate} />

          {submitError && (
            <p role="alert" className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {submitError}
            </p>
          )}

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
            onSubmit={handleFinalSubmit}
            submitting={submitting}
            onPhotoFileChange={setContactPhotoFile}
          />
        </div>
      );
    }

    return null;
  }

  return (
    <div className="gaikou-lp min-h-screen w-full min-w-0 overflow-x-hidden bg-[#fdfbf6]">
      <h1 className="sr-only">外構プラン無料診断｜岐阜県・愛知県・三重県対応の外構工事 概算診断フォーム</h1>

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
            <DiagnosisResult
              workType={answers.workType}
              constructionTypes={answers.constructionTypes}
              estimate={estimate}
            />
          ) : (
            <div className="space-y-2.5 sm:space-y-3 pt-2" aria-live="polite">
              {/* 最初の挨拶 */}
              <BotMessage showName>{GREETING_LINES[0]}</BotMessage>
              <BotMessage>{GREETING_LINES[1]}</BotMessage>

              {/* 回答済みのステップと回答（会話履歴） */}
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

              {/* 現在のステップ（アンカーは固定ヘッダーの高さぶん余白を確保） */}
              <div ref={questionAnchorRef} className="scroll-mt-[124px]" aria-hidden="true" />
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
                  {step > 1 && step < 4 && (
                    <button
                      type="button"
                      onClick={goBack}
                      className="mx-auto mt-3 flex items-center justify-center gap-1 min-h-[44px] px-3 text-sm font-semibold text-[#6b7a73] hover:text-[#10302a] transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                      ひとつ前に戻る
                    </button>
                  )}
                </div>
              )}

              <div ref={bottomRef} aria-hidden="true" />
            </div>
          )}
        </main>
      </MotionConfigWrapper>
    </div>
  );
}
