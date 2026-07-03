"use client";

import { useId, useState, useEffect, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Calculator, Paperclip } from "lucide-react";
import { serviceAreas } from "./data";
import SectionHeading from "./SectionHeading";
import SectionBackdrop from "./SectionBackdrop";
import { captureUtm, loadUtm } from "@/lib/utm/storage";
import { SIMULATOR_ESTIMATE_STORAGE_KEY } from "@/lib/calculate-exterior-estimate";

// シミュレーターから引き継がれる概算価格
type SimulatorEstimateHandoff = {
  label: string;
  works: string[];
  at: number;
};

function loadSimulatorEstimate(): SimulatorEstimateHandoff | null {
  try {
    const raw = sessionStorage.getItem(SIMULATOR_ESTIMATE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SimulatorEstimateHandoff;
    if (!parsed.label || !Array.isArray(parsed.works)) return null;
    return parsed;
  } catch {
    return null;
  }
}

type FormErrors = {
  name?: string;
  phone?: string;
  email?: string;
  workTypes?: string;
};

const CURRENT_STATE_OPTIONS = ["砂利が多い・雑草が気になる", "駐車場が足りない", "庭木・庭石の管理が大変", "その他"];
const TIMING_OPTIONS = ["できるだけ早く", "1ヶ月以内", "3ヶ月以内", "まだ未定"];
const WORK_TYPE_OPTIONS = ["駐車場リフォーム", "雑草・庭管理対策", "エクステリア（カーポート・フェンスなど）", "その他"];
const OWNERSHIP_OPTIONS = ["持ち家", "賃貸", "その他"];

export default function ContactSection() {
  const baseId = useId();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [currentState, setCurrentState] = useState("");
  const [workTypes, setWorkTypes] = useState<string[]>([]);
  const [timing, setTiming] = useState("");
  const [ownership, setOwnership] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  // honeypot（スパム対策）
  const [website, setWebsite] = useState("");
  // シミュレーターの概算価格（あれば問い合わせ内容に添えて送信する）
  const [simEstimate, setSimEstimate] = useState<SimulatorEstimateHandoff | null>(null);

  // UTMをキャプチャ
  useEffect(() => {
    captureUtm();
  }, []);

  // シミュレーターからの概算価格を受け取る（初期表示＋CTAクリック時のイベント）
  useEffect(() => {
    const sync = () => setSimEstimate(loadSimulatorEstimate());
    sync();
    window.addEventListener("gaikou:simulator-estimate", sync);
    return () => window.removeEventListener("gaikou:simulator-estimate", sync);
  }, []);

  function toggleWorkType(option: string) {
    setWorkTypes((prev) => (prev.includes(option) ? prev.filter((v) => v !== option) : [...prev, option]));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors: FormErrors = {};
    if (!name.trim()) nextErrors.name = "お名前を入力してください";
    if (!phone.trim()) nextErrors.phone = "電話番号を入力してください";
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "正しいメールアドレスの形式で入力してください";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setSubmitError("");

    const utm = loadUtm() ?? {};

    // シミュレーターの概算価格を問い合わせ内容に添える（管理画面で確認できる）
    const inquiryMessage = [
      simEstimate
        ? `【シミュレーション概算】${simEstimate.label}（対象：${simEstimate.works.join("・")}）※現地調査後に正式見積もり`
        : null,
      note.trim() || null,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          city: city || undefined,
          workTypes,
          inquiryMessage: inquiryMessage || undefined,
          designStyle: currentState || undefined,
          utmSource: utm.utm_source,
          utmMedium: utm.utm_medium,
          utmCampaign: utm.utm_campaign,
          utmContent: utm.utm_content,
          utmTerm: utm.utm_term,
          fbclid: utm.fbclid,
          gclid: utm.gclid,
          ttclid: utm.ttclid,
          landingPage: utm.landing_page,
          referrer: utm.referrer,
          deviceType: utm.device_type,
          website, // honeypot
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setSubmitError(data.error ?? "送信に失敗しました。お手数ですがお電話でご連絡ください。");
        setSubmitting(false);
        return;
      }

      // 専用サンクスページへはフルページ遷移にする
      // （SPA遷移だとMeta PixelのPageViewが発火せず、URLベースのCV計測ができないため）
      window.location.assign("/gaikou/thanks");
    } catch {
      setSubmitError("通信エラーが発生しました。お手数ですがお電話でご連絡ください。");
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-[#dcd6c4] bg-white px-4 py-3.5 text-[15px] text-[#1c2b25] outline-none transition-colors focus:border-[#2f7d5a] focus:ring-2 focus:ring-[#2f7d5a]/20";
  const labelClass = "block text-sm font-semibold text-[#10302a] mb-1.5";

  return (
    <section id="contact" className="relative px-4 sm:px-6 py-16 md:py-24 overflow-hidden">
      <SectionBackdrop variant="triangle-up" tone="green" />
      <div className="relative z-10 max-w-2xl mx-auto">
        <SectionHeading eyebrow="CONTACT" title={"無料お問い合わせフォーム"} description={"写真を送るだけのご相談も可能です。まずはお気軽にご連絡ください"} />

        <motion.form
          noValidate
          onSubmit={handleSubmit}
          className="mt-10 md:mt-14 rounded-2xl border border-[#e7e3d8] bg-white p-5 sm:p-8 space-y-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* honeypot（非表示） */}
          <input
            type="text"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            tabIndex={-1}
            aria-hidden="true"
            className="sr-only"
            autoComplete="off"
          />

          {/* シミュレーターからの概算価格（送信内容に添えられる） */}
          {simEstimate && (
            <div className="rounded-xl bg-[#fff7ec] border border-[#e8a25a] px-4 py-3.5">
              <p className="flex items-center gap-1.5 text-xs font-bold text-[#a85a1f]">
                <Calculator className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                シミュレーションの概算費用
              </p>
              <p className="mt-0.5 text-lg font-extrabold tracking-tight text-[#d9601a]">{simEstimate.label}</p>
              <p className="mt-1 text-[12px] font-semibold text-[#a85a1f] leading-relaxed">
                シミュレーションからお問い合わせいただいた方のみ、この概算価格の範囲内で施工いたします。
              </p>
              <p className="mt-1 text-[11px] text-[#8a7a55] leading-relaxed">
                対象：{simEstimate.works.join("・")}／この概算を添えて送信されます。
                ※標準的な施工条件の場合。追加工事が必要なときは現地調査時に事前にご説明します。
              </p>
            </div>
          )}

          <div>
            <label htmlFor={`${baseId}-name`} className={labelClass}>
              お名前 <span className="text-[#d9601a]">*</span>
            </label>
            <input
              id={`${baseId}-name`}
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-required="true"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? `${baseId}-name-error` : undefined}
              placeholder="山田 太郎"
              className={inputClass}
            />
            {errors.name && (
              <p id={`${baseId}-name-error`} className="mt-1.5 text-xs text-[#c0392b]">
                {errors.name}
              </p>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor={`${baseId}-phone`} className={labelClass}>
                電話番号 <span className="text-[#d9601a]">*</span>
              </label>
              <input
                id={`${baseId}-phone`}
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                aria-required="true"
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? `${baseId}-phone-error` : undefined}
                placeholder="090-0000-0000"
                className={inputClass}
              />
              {errors.phone && (
                <p id={`${baseId}-phone-error`} className="mt-1.5 text-xs text-[#c0392b]">
                  {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label htmlFor={`${baseId}-email`} className={labelClass}>
                メールアドレス
              </label>
              <input
                id={`${baseId}-email`}
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? `${baseId}-email-error` : undefined}
                placeholder="example@email.com"
                className={inputClass}
              />
              {errors.email && (
                <p id={`${baseId}-email-error`} className="mt-1.5 text-xs text-[#c0392b]">
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor={`${baseId}-city`} className={labelClass}>
              市町村
            </label>
            <select id={`${baseId}-city`} value={city} onChange={(e) => setCity(e.target.value)} className={inputClass}>
              <option value="">選択してください</option>
              {serviceAreas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
              <option value="その他">その他（要相談）</option>
            </select>
          </div>

          <div>
            <label htmlFor={`${baseId}-current-state`} className={labelClass}>
              現在の状態
            </label>
            <select
              id={`${baseId}-current-state`}
              value={currentState}
              onChange={(e) => setCurrentState(e.target.value)}
              className={inputClass}
            >
              <option value="">選択してください</option>
              {CURRENT_STATE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <fieldset>
            <legend className={labelClass}>希望する工事（複数選択可）</legend>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {WORK_TYPE_OPTIONS.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2.5 rounded-xl border border-[#dcd6c4] px-4 py-3 text-sm text-[#3d4a45] cursor-pointer min-h-[44px]"
                >
                  <input
                    type="checkbox"
                    checked={workTypes.includes(option)}
                    onChange={() => toggleWorkType(option)}
                    className="w-4 h-4 accent-[#2f7d5a]"
                  />
                  {option}
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor={`${baseId}-timing`} className={labelClass}>
              工事希望時期
            </label>
            <select id={`${baseId}-timing`} value={timing} onChange={(e) => setTiming(e.target.value)} className={inputClass}>
              <option value="">選択してください</option>
              {TIMING_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <fieldset>
            <legend className={labelClass}>持ち家かどうか</legend>
            <div className="flex flex-wrap gap-2.5">
              {OWNERSHIP_OPTIONS.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2 rounded-full border border-[#dcd6c4] px-4 py-2.5 text-sm text-[#3d4a45] cursor-pointer min-h-[44px]"
                >
                  <input
                    type="radio"
                    name={`${baseId}-ownership`}
                    value={option}
                    checked={ownership === option}
                    onChange={() => setOwnership(option)}
                    className="w-4 h-4 accent-[#2f7d5a]"
                  />
                  {option}
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor={`${baseId}-photo`} className={labelClass}>
              写真添付（任意）
            </label>
            <label
              htmlFor={`${baseId}-photo`}
              className="flex items-center gap-2.5 rounded-xl border border-dashed border-[#bcc7c1] px-4 py-4 text-sm text-[#6b7a73] cursor-pointer"
            >
              <Paperclip className="w-4 h-4 shrink-0" aria-hidden="true" />
              気になる場所のお写真があれば添付してください
            </label>
            <input id={`${baseId}-photo`} type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only" />
          </div>

          <div>
            <label htmlFor={`${baseId}-note`} className={labelClass}>
              備考
            </label>
            <textarea
              id={`${baseId}-note`}
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={2000}
              placeholder="ご質問やご要望があればご記入ください"
              className={`${inputClass} resize-none`}
            />
          </div>

          {submitError && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3">
              <p className="text-sm text-red-700">{submitError}</p>
            </div>
          )}

          <div className="max-w-[26rem] mx-auto">
            <button
              type="submit"
              disabled={submitting}
              className="gaikou-cta-btn w-full disabled:opacity-70"
            >
              <span className="gaikou-cta-btn-inner">
                {submitting ? "送信しています…" : "無料で相談する"}
              </span>
            </button>
          </div>

          <p className="text-xs text-[#8a9a90] text-center leading-relaxed">
            ご入力いただいた情報は、お問い合わせ対応のみに使用します。
          </p>
        </motion.form>
      </div>
    </section>
  );
}
