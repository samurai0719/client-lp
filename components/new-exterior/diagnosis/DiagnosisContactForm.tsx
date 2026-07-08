"use client";

import { useId, useState, type FormEvent, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import type { DiagnosisContact } from "./types";

type DiagnosisContactFormProps = {
  contact: DiagnosisContact;
  onChange: (contact: DiagnosisContact) => void;
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
  submitLabel?: string;
};

type FormErrors = {
  name?: string;
  phone?: string;
  agreePrivacy?: string;
};

function preventEnterSubmit(e: KeyboardEvent<HTMLInputElement>) {
  if (e.key === "Enter") e.preventDefault();
}

export default function DiagnosisContactForm({
  contact,
  onChange,
  onBack,
  onSubmit,
  submitting,
  submitLabel = "入力内容を確認する",
}: DiagnosisContactFormProps) {
  const baseId = useId();
  const [errors, setErrors] = useState<FormErrors>({});

  function set<K extends keyof DiagnosisContact>(key: K, value: DiagnosisContact[K]) {
    onChange({ ...contact, [key]: value });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors: FormErrors = {};
    if (!contact.name.trim()) nextErrors.name = "お名前を入力してください";
    if (!contact.phone.trim()) nextErrors.phone = "電話番号を入力してください";
    if (!contact.agreePrivacy) nextErrors.agreePrivacy = "プライバシーポリシーへの同意が必要です";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) onSubmit();
  }

  const inputClass =
    "w-full rounded-xl border border-[#dcd6c4] bg-white px-4 py-3.5 text-[15px] text-[#1c2b25] outline-none transition-colors focus:border-[#2f7d5a] focus:ring-2 focus:ring-[#2f7d5a]/20";
  const labelClass = "block text-sm font-semibold text-[#10302a] mb-1.5";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <form noValidate onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor={`${baseId}-name`} className={labelClass}>
            お名前 <span className="text-[#d9601a]">*</span>
          </label>
          <input
            id={`${baseId}-name`}
            type="text"
            autoComplete="name"
            value={contact.name}
            onChange={(e) => set("name", e.target.value)}
            onKeyDown={preventEnterSubmit}
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

        <div>
          <label htmlFor={`${baseId}-phone`} className={labelClass}>
            電話番号 <span className="text-[#d9601a]">*</span>
          </label>
          <input
            id={`${baseId}-phone`}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={contact.phone}
            onChange={(e) => set("phone", e.target.value)}
            onKeyDown={preventEnterSubmit}
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
            メールアドレス <span className="text-xs text-[#8a9a90] font-normal">（任意）</span>
          </label>
          <input
            id={`${baseId}-email`}
            type="email"
            autoComplete="email"
            value={contact.email}
            onChange={(e) => set("email", e.target.value)}
            onKeyDown={preventEnterSubmit}
            placeholder="example@email.com"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor={`${baseId}-address`} className={labelClass}>
            住所または市区町村 <span className="text-xs text-[#8a9a90] font-normal">（任意）</span>
          </label>
          <input
            id={`${baseId}-address`}
            type="text"
            autoComplete="street-address"
            value={contact.address}
            onChange={(e) => set("address", e.target.value)}
            onKeyDown={preventEnterSubmit}
            placeholder="例：岐阜市◯◯町1-2-3（新築地の住所）"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor={`${baseId}-note`} className={labelClass}>
            備考 <span className="text-xs text-[#8a9a90] font-normal">（任意）</span>
          </label>
          <textarea
            id={`${baseId}-note`}
            rows={3}
            value={contact.note}
            onChange={(e) => set("note", e.target.value)}
            placeholder="引き渡し予定時期や、ハウスメーカー見積もりの有無などがあればご記入ください"
            className={`${inputClass} resize-none`}
          />
        </div>

        <div>
          <label className="flex items-start gap-2.5 text-sm text-[#3d4a45] cursor-pointer min-h-[44px]">
            <input
              type="checkbox"
              checked={contact.agreePrivacy}
              onChange={(e) => set("agreePrivacy", e.target.checked)}
              aria-required="true"
              aria-invalid={Boolean(errors.agreePrivacy)}
              aria-describedby={errors.agreePrivacy ? `${baseId}-privacy-error` : undefined}
              className="w-4 h-4 mt-0.5 accent-[#2f7d5a] shrink-0"
            />
            プライバシーポリシーに同意する <span className="text-[#d9601a]">*</span>
          </label>
          {errors.agreePrivacy && (
            <p id={`${baseId}-privacy-error`} className="mt-1.5 text-xs text-[#c0392b]">
              {errors.agreePrivacy}
            </p>
          )}
        </div>

        <div className="space-y-2 pt-1">
          <button type="submit" disabled={submitting} className="gaikou-cta-btn w-full disabled:opacity-60">
            <span className="gaikou-cta-btn-inner">{submitting ? "送信しています…" : submitLabel}</span>
          </button>
          <button
            type="button"
            onClick={onBack}
            className="mx-auto flex items-center justify-center gap-1 min-h-[44px] px-3 text-sm font-semibold text-[#6b7a73] hover:text-[#10302a] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            ひとつ前の質問に戻る
          </button>
        </div>
      </form>
    </motion.div>
  );
}
