"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Upload, X, Loader2, CheckCircle } from "lucide-react";
import PageHero from "@/components/takanaga/common/PageHero";

type FormState = "idle" | "submitting" | "success" | "error";

const WORKS = [
  { value: "parking", label: "駐車場・土間コンクリート" },
  { value: "carport", label: "カーポート・ガレージ" },
  { value: "fence", label: "フェンス・目隠し" },
  { value: "gate", label: "門柱・門扉" },
  { value: "approach", label: "玄関アプローチ" },
  { value: "grass", label: "人工芝・防草対策" },
  { value: "deck", label: "ウッドデッキ・テラス" },
  { value: "garden", label: "庭リフォーム" },
  { value: "gravel", label: "砂利敷き" },
  { value: "drainage", label: "排水・水たまり対策" },
  { value: "full", label: "外構全体のリフォーム" },
  { value: "other", label: "その他（お問い合わせ内容に記載）" },
];

const PREFECTURES = ["岐阜県", "愛知県", "三重県", "その他"];

const PREFERRED_TIMES = [
  { value: "morning", label: "午前中" },
  { value: "afternoon", label: "午後" },
  { value: "evening", label: "夕方以降" },
  { value: "any", label: "いつでも" },
];

const DESIRED_TIMINGS = [
  { value: "asap", label: "できるだけ早く" },
  { value: "within1month", label: "1ヶ月以内" },
  { value: "within3months", label: "3ヶ月以内" },
  { value: "within6months", label: "半年以内" },
  { value: "undecided", label: "未定" },
];

const MAX_FILES = 5;
const MAX_FILE_SIZE_MB = 10;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "application/pdf"];

export default function ContactPage() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [checkedWorks, setCheckedWorks] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const submitCountRef = useRef(0);

  const toggleWork = (value: string) => {
    setCheckedWorks((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    const valid = selected.filter((f) => {
      if (!ALLOWED_TYPES.includes(f.type)) return false;
      if (f.size > MAX_FILE_SIZE_MB * 1024 * 1024) return false;
      return true;
    });
    setFiles((prev) => [...prev, ...valid].slice(0, MAX_FILES));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 二重送信防止
    if (formState === "submitting") return;
    submitCountRef.current += 1;
    if (submitCountRef.current > 1) return;

    setFormState("submitting");
    setErrorMessage("");

    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      name: (data.get("name") as string).trim(),
      phone: (data.get("phone") as string).trim(),
      email: (data.get("email") as string).trim(),
      prefecture: data.get("prefecture") as string,
      city: (data.get("city") as string).trim(),
      address: (data.get("address") as string | null)?.trim() || undefined,
      desiredWork: checkedWorks,
      preferredContact: (data.get("preferredContact") as string) || undefined,
      preferredTime: (data.get("preferredTime") as string) || undefined,
      desiredTiming: (data.get("desiredTiming") as string) || undefined,
      budget: (data.get("budget") as string | null)?.trim() || undefined,
      message: (data.get("message") as string).trim(),
      privacyAgreed: true as const,
    };

    try {
      const res = await fetch("/api/takanaga-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error((json as { error?: string }).error ?? "送信に失敗しました");
      }

      setFormState("success");
      window.location.href = "/takanaga/contact/thanks";
    } catch (err) {
      setFormState("error");
      setErrorMessage(err instanceof Error ? err.message : "送信に失敗しました。もう一度お試しください。");
      submitCountRef.current = 0;
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="お問い合わせ・無料現地調査のご依頼"
        subtitle="現地調査・お見積もりは無料です。お気軽にご相談ください。"
        breadcrumbs={[{ label: "お問い合わせ" }]}
      />

      <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-(--tkn-bg)">
        <div className="mx-auto max-w-2xl">
          <form onSubmit={handleSubmit} noValidate aria-label="お問い合わせフォーム">
            <div className="space-y-6">
              {/* お名前 */}
              <div>
                <label className="tkn-label" htmlFor="name">
                  お名前<span className="tkn-required">必須</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="tkn-input"
                  required
                  autoComplete="name"
                  placeholder="山田 太郎"
                />
              </div>

              {/* 電話番号 */}
              <div>
                <label className="tkn-label" htmlFor="phone">
                  電話番号<span className="tkn-required">必須</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="tkn-input"
                  required
                  autoComplete="tel"
                  placeholder="090-1234-5678"
                />
              </div>

              {/* メールアドレス */}
              <div>
                <label className="tkn-label" htmlFor="email">
                  メールアドレス<span className="tkn-required">必須</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="tkn-input"
                  required
                  autoComplete="email"
                  placeholder="example@email.com"
                />
              </div>

              {/* 都道府県・市区町村 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="tkn-label" htmlFor="prefecture">
                    都道府県<span className="tkn-required">必須</span>
                  </label>
                  <select id="prefecture" name="prefecture" required className="tkn-input">
                    <option value="">選択してください</option>
                    {PREFECTURES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="tkn-label" htmlFor="city">
                    市区町村<span className="tkn-required">必須</span>
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    className="tkn-input"
                    required
                    placeholder="岐阜市"
                  />
                </div>
              </div>

              {/* 住所 */}
              <div>
                <label className="tkn-label" htmlFor="address">
                  住所<span className="tkn-optional">任意</span>
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  className="tkn-input"
                  autoComplete="street-address"
                  placeholder="丁目・番地（現地調査をご希望の場合）"
                />
              </div>

              {/* 希望する工事 */}
              <fieldset>
                <legend className="tkn-label mb-3">
                  希望する工事<span className="tkn-required">必須</span>
                  <span className="ml-2 text-xs font-normal text-(--tkn-text-muted)">（複数選択可）</span>
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {WORKS.map((w) => (
                    <label
                      key={w.value}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded border cursor-pointer text-sm transition-colors ${
                        checkedWorks.includes(w.value)
                          ? "bg-(--tkn-blue-light) border-(--tkn-blue-bright) text-(--tkn-navy-deep) font-semibold"
                          : "bg-white border-(--tkn-border) text-(--tkn-text) hover:border-(--tkn-blue-bright)"
                      }`}
                    >
                      <input
                        type="checkbox"
                        value={w.value}
                        checked={checkedWorks.includes(w.value)}
                        onChange={() => toggleWork(w.value)}
                        className="accent-(--tkn-blue)"
                      />
                      {w.label}
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* お問い合わせ内容 */}
              <div>
                <label className="tkn-label" htmlFor="message">
                  お問い合わせ内容<span className="tkn-required">必須</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="tkn-input resize-y"
                  placeholder="現在の状況やご要望をお聞かせください。（例：砂利の駐車場をコンクリートにしたい。2台分くらいのスペースです。）"
                />
              </div>

              {/* 希望連絡方法 */}
              <fieldset>
                <legend className="tkn-label mb-2">
                  希望連絡方法<span className="tkn-optional">任意</span>
                </legend>
                <div className="flex flex-wrap gap-3">
                  {[
                    { value: "email", label: "メール" },
                    { value: "phone", label: "電話" },
                    { value: "either", label: "どちらでも" },
                  ].map((opt) => (
                    <label key={opt.value} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="radio" name="preferredContact" value={opt.value} className="accent-(--tkn-blue)" />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* 連絡希望時間帯 */}
              <div>
                <label className="tkn-label" htmlFor="preferredTime">
                  連絡希望時間帯<span className="tkn-optional">任意</span>
                </label>
                <select id="preferredTime" name="preferredTime" className="tkn-input">
                  <option value="">指定なし</option>
                  {PREFERRED_TIMES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              {/* 工事希望時期 */}
              <div>
                <label className="tkn-label" htmlFor="desiredTiming">
                  工事希望時期<span className="tkn-optional">任意</span>
                </label>
                <select id="desiredTiming" name="desiredTiming" className="tkn-input">
                  <option value="">選択してください</option>
                  {DESIRED_TIMINGS.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              {/* 予算 */}
              <div>
                <label className="tkn-label" htmlFor="budget">
                  ご予算<span className="tkn-optional">任意</span>
                </label>
                <input
                  id="budget"
                  name="budget"
                  type="text"
                  className="tkn-input"
                  placeholder="例：50万円前後"
                />
              </div>

              {/* 写真アップロード */}
              <div>
                <p className="tkn-label mb-2">
                  現地写真・資料<span className="tkn-optional">任意</span>
                </p>
                <p className="text-xs text-(--tkn-text-muted) mb-3">
                  JPEG・PNG・WebP・PDF対応。1ファイル{MAX_FILE_SIZE_MB}MB以内、最大{MAX_FILES}枚まで。
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border border-(--tkn-border) rounded hover:border-(--tkn-blue-bright) hover:bg-(--tkn-blue-light) transition-colors"
                  disabled={files.length >= MAX_FILES}
                >
                  <Upload size={16} aria-hidden />
                  ファイルを選択 ({files.length}/{MAX_FILES})
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.webp,.heic,.pdf"
                  className="hidden"
                  onChange={handleFileChange}
                  aria-label="写真・資料のアップロード"
                />
                {files.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {files.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-(--tkn-text)">
                        <span className="truncate flex-1">{f.name}</span>
                        <span className="shrink-0 text-xs text-(--tkn-text-muted)">
                          ({(f.size / 1024 / 1024).toFixed(1)}MB)
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          className="shrink-0 text-(--tkn-text-muted) hover:text-red-500 transition-colors"
                          aria-label={`${f.name}を削除`}
                        >
                          <X size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* 個人情報の利用目的 */}
              <div className="p-4 bg-(--tkn-warm-gray) rounded-lg text-xs text-(--tkn-text-muted) leading-relaxed">
                <p>
                  入力いただいた情報および写真は、お問い合わせへの回答、現地調査、見積もり、施工提案のために利用します。
                  第三者への提供は行いません（顧客管理システムへの記録を除く）。
                  詳しくは{" "}
                  <Link
                    href="/takanaga/privacy"
                    className="text-(--tkn-blue-bright) underline hover:text-(--tkn-blue) transition-colors"
                    target="_blank"
                    rel="noopener"
                  >
                    プライバシーポリシー
                  </Link>{" "}
                  をご確認ください。
                </p>
              </div>

              {/* プライバシーポリシー同意 */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="privacyAgreed"
                  required
                  className="mt-0.5 accent-(--tkn-blue) w-4 h-4"
                />
                <span className="text-sm text-(--tkn-text)">
                  <Link
                    href="/takanaga/privacy"
                    className="text-(--tkn-blue-bright) underline hover:text-(--tkn-blue) transition-colors"
                    target="_blank"
                    rel="noopener"
                  >
                    プライバシーポリシー
                  </Link>
                  に同意する<span className="tkn-required ml-1">必須</span>
                </span>
              </label>

              {/* エラー表示 */}
              {formState === "error" && (
                <div role="alert" className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

              {/* 送信ボタン */}
              <button
                type="submit"
                disabled={formState === "submitting"}
                className="tkn-btn-primary w-full justify-center !text-base !py-4 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {formState === "submitting" ? (
                  <>
                    <Loader2 size={18} className="animate-spin" aria-hidden />
                    送信中...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} aria-hidden />
                    送信する
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
