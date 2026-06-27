"use client";

import { useId, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Paperclip, Info } from "lucide-react";
import { serviceAreas } from "./data";
import SectionHeading from "./SectionHeading";
import SectionBackdrop from "./SectionBackdrop";

type FormErrors = {
  name?: string;
  phone?: string;
  email?: string;
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
  const [submitted, setSubmitted] = useState(false);

  function toggleWorkType(option: string) {
    setWorkTypes((prev) => (prev.includes(option) ? prev.filter((v) => v !== option) : [...prev, option]));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors: FormErrors = {};
    if (!name.trim()) nextErrors.name = "お名前を入力してください";
    if (!phone.trim()) nextErrors.phone = "電話番号を入力してください";
    if (!email.trim()) {
      nextErrors.email = "メールアドレスを入力してください";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "正しいメールアドレスの形式で入力してください";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true);
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
                メールアドレス <span className="text-[#d9601a]">*</span>
              </label>
              <input
                id={`${baseId}-email`}
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-required="true"
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
            <input id={`${baseId}-photo`} type="file" accept="image/*" multiple className="sr-only" />
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
              placeholder="ご質問やご要望があればご記入ください"
              className={`${inputClass} resize-none`}
            />
          </div>

          {submitted && (
            <div className="flex items-start gap-2.5 rounded-xl bg-[#eaf3ee] border border-[#bfe0cd] px-4 py-3.5">
              <Info className="w-4 h-4 text-[#1f4d3d] shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm font-semibold text-[#1f4d3d]">現在はテスト表示です。送信機能は後から接続します。</p>
            </div>
          )}

          <div className="max-w-[26rem] mx-auto">
            <button type="submit" className="gaikou-cta-btn w-full">
              <span className="gaikou-cta-btn-inner">無料で相談・お見積もりを依頼する</span>
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
