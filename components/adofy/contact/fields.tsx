"use client";

import { useId, type ReactNode } from "react";
import type { Choice } from "./formConfig";

/* ═══════════════════════════════════════════════════════════════════════════
   フォームの入力部品。
   - 選択状態は色だけでなく、チェックマークと太字・枠線でも示す
   - すべての入力に label を紐づける
   - スマホで拡大されないよう font-size は 16px 以上にする（CSS側で担保）
   ═══════════════════════════════════════════════════════════════════════════ */

/** 単一選択（大きなカード） */
export function ChoiceCards({
  name,
  choices,
  value,
  onChange,
  columns = 2,
  compact = false,
}: {
  name: string;
  choices: Choice[];
  value: string;
  onChange: (v: string) => void;
  columns?: 1 | 2;
  /** 選択肢が多い質問向け。スマートフォンでも2列に並べ、1画面に収まる量を増やす */
  compact?: boolean;
}) {
  return (
    <div
      className={`adf-choices adf-choices--col${columns}${compact ? " adf-choices--compact" : ""}`}
      role="radiogroup"
      aria-label={name}
    >
      {choices.map((c) => {
        const selected = value === c.value;
        return (
          <button
            key={c.value}
            type="button"
            role="radio"
            aria-checked={selected}
            className={`adf-choice${selected ? " is-selected" : ""}`}
            onClick={() => onChange(c.value)}
          >
            <span className="adf-choice__mark" aria-hidden="true" />
            <span className="adf-choice__body">
              <span className="adf-choice__label">{c.label}</span>
              {c.note ? <span className="adf-choice__note">{c.note}</span> : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** 複数選択 */
export function ChoiceChecks({
  name,
  choices,
  values,
  onToggle,
  columns = 1,
}: {
  name: string;
  choices: Choice[];
  values: string[];
  onToggle: (v: string) => void;
  columns?: 1 | 2;
}) {
  return (
    <div className={`adf-choices adf-choices--col${columns}`} role="group" aria-label={name}>
      {choices.map((c) => {
        const selected = values.includes(c.value);
        return (
          <button
            key={c.value}
            type="button"
            role="checkbox"
            aria-checked={selected}
            className={`adf-choice adf-choice--multi${selected ? " is-selected" : ""}`}
            onClick={() => onToggle(c.value)}
          >
            <span className="adf-choice__mark adf-choice__mark--box" aria-hidden="true" />
            <span className="adf-choice__body">
              <span className="adf-choice__label">{c.label}</span>
              {c.note ? <span className="adf-choice__note">{c.note}</span> : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** テキスト入力 */
export function TextField({
  label,
  value,
  onChange,
  required,
  type = "text",
  placeholder,
  autoComplete,
  inputMode,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: "text" | "tel" | "email" | "url";
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "text" | "tel" | "email" | "url" | "numeric";
  hint?: string;
}) {
  const id = useId();
  return (
    <div className="adf-field">
      <label className="adf-field__label" htmlFor={id}>
        {label}
        {required ? (
          <span className="adf-field__req">必須</span>
        ) : (
          <span className="adf-field__opt">任意</span>
        )}
      </label>
      {hint ? (
        <p className="adf-field__hint" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
      <input
        id={id}
        className="adf-input"
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-required={required}
        aria-describedby={hint ? `${id}-hint` : undefined}
      />
    </div>
  );
}

/** 複数行テキスト */
export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  required,
  rows = 5,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}) {
  const id = useId();
  return (
    <div className="adf-field">
      <label className="adf-field__label" htmlFor={id}>
        {label}
        {required ? (
          <span className="adf-field__req">必須</span>
        ) : (
          <span className="adf-field__opt">任意</span>
        )}
      </label>
      <textarea
        id={id}
        className="adf-input adf-textarea"
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-required={required}
      />
    </div>
  );
}

/** 都道府県のセレクト */
export function SelectField({
  label,
  value,
  onChange,
  options,
  required,
  autoComplete,
  placeholder = "選択してください",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <div className="adf-field">
      <label className="adf-field__label" htmlFor={id}>
        {label}
        {required ? (
          <span className="adf-field__req">必須</span>
        ) : (
          <span className="adf-field__opt">任意</span>
        )}
      </label>
      <div className="adf-select-wrap">
        <select
          id={id}
          className="adf-input adf-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          aria-required={required}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

/** 質問1つ分の枠 */
export function Question({
  step,
  total,
  title,
  description,
  children,
}: {
  step: number;
  total: number;
  title: string;
  description?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="adf-q">
      <p className="adf-q__count">
        STEP {String(step).padStart(2, "0")} <span>/ {total}</span>
      </p>
      <h2 className="adf-q__title">{title}</h2>
      {description ? <p className="adf-q__desc">{description}</p> : null}
      <div className="adf-q__body">{children}</div>
    </div>
  );
}
