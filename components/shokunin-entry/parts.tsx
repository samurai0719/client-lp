import Link from "next/link";
import { HardHat } from "lucide-react";

/** ヘッダー。企業向けLP（/shokunin-agent）と同じロゴ */
export function EntryHeader({ href }: { href?: string }) {
  const logo = (
    <>
      <HardHat aria-hidden="true" strokeWidth={2.4} />
      <span className="se-header__text">
        <span className="se-header__name">
          職人採用<em>エージェント</em>
        </span>
        <span className="se-header__sub">建設職人の転職・仕事探し</span>
      </span>
    </>
  );
  return (
    <header className="se-header">
      {href ? (
        <Link href={href} className="se-header__logo">
          {logo}
        </Link>
      ) : (
        <div className="se-header__logo">{logo}</div>
      )}
    </header>
  );
}

export function EntryFooter() {
  return (
    <footer className="se-footer">
      <nav aria-label="フッター">
        <a href="/shokunin-entry/terms">利用規約</a>
        <a href="/shokunin-entry/privacy">個人情報の取り扱い</a>
        <a href="/shokunin-entry/operator">運営者情報</a>
      </nav>
      <a className="se-footer__company" href="/shokunin-agent">
        職人を採用したい企業の方はこちら
      </a>
      <p>© 2026 adofy All Rights Reserved.</p>
    </footer>
  );
}

/** 全ステップ共通のステップ表示（STEP2以降の上部に固定） */
export function StepHeader({ step, total, onBack, completed = false }: { step: number; total: number; onBack?: () => void; completed?: boolean }) {
  const pct = completed ? 100 : Math.round((step / total) * 100);
  const remaining = total - step;
  return (
    <div className="se-progress">
      <div className="se-progress__top">
        {onBack && !completed ? (
          <button type="button" className="se-progress__back" onClick={onBack}>
            <span aria-hidden="true">‹</span>戻る
          </button>
        ) : (
          <span />
        )}
        <span className="se-progress__count">
          STEP <b>{step}</b> / {total}
        </span>
        <span className="se-progress__left">
          {completed ? "登録完了" : remaining > 0 ? `あと${remaining}ステップ` : "最後のステップ"}
        </span>
      </div>
      <div
        className="se-progress__bar"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label="登録の進み具合"
      >
        <span style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function ChoiceButton({
  label,
  selected,
  onClick,
  className = "",
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button type="button" aria-pressed={selected} onClick={onClick} className={`se-choice${selected ? " is-on" : ""} ${className}`}>
      {label}
    </button>
  );
}

type QuestionProps = {
  index: number;
  question: string;
  hint?: string;
  choices: readonly string[];
} & ({ mode?: "single"; value: string; onSelect: (v: string) => void } | { mode: "multi"; values: string[]; onToggle: (v: string) => void });

/** 質問1問。単一選択は押すと onSelect（親が次へ進める）、複数選択は押すたびに onToggle */
export function Question(props: QuestionProps) {
  const isMulti = props.mode === "multi";
  const isOn = (v: string) => (isMulti ? props.values.includes(v) : props.value === v);
  const press = (v: string) => (isMulti ? props.onToggle(v) : props.onSelect(v));
  return (
    <div className="se-q">
      <QuestionHead
        index={props.index}
        question={props.question}
        hint={props.hint ?? (isMulti ? "複数選択できます" : "あてはまるものを選んでください")}
      />
      <div className="se-choices">
        {props.choices.map((c, i) => (
          <ChoiceButton
            key={c}
            label={c}
            selected={isOn(c)}
            onClick={() => press(c)}
            className={props.choices.length % 2 !== 0 && i === props.choices.length - 1 ? "is-wide" : ""}
          />
        ))}
      </div>
    </div>
  );
}

export function QuestionHead({ index, question, hint }: { index: number; question: string; hint?: string }) {
  return (
    <div className="se-q__head">
      <p className="se-q__no">質問 {index}</p>
      <h2>{question}</h2>
      {hint && <p className="se-q__hint">{hint}</p>}
    </div>
  );
}

export function NextButton({ onClick, error, label = "次へ進む" }: { onClick: () => void; error?: string | null; label?: string }) {
  return (
    <div className="se-next">
      {error && (
        <p role="alert" className="se-alert">
          {error}
        </p>
      )}
      <button type="button" className="se-btn" onClick={onClick}>
        <span>{label}</span>
        <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}

const ICONS = [
  <path key="0" d="M8 4h8v3H8zM6 5.5H4.5V21h15V5.5H18M8 12h8M8 16h5" />,
  <path key="1" d="M3 5h18v14H3zM12 15a2.5 2.5 0 1 0 0-.01M7 19c.6-2.2 2.6-3 5-3s4.4.8 5 3" />,
  <path key="2" d="M6 3h3l1.5 5-2 1.5a12 12 0 0 0 6 6l1.5-2 5 1.5v3c0 1-.8 2-2 2C10 20 4 13 4 5c0-1.2 1-2 2-2z" />,
  <path key="3" d="M4 12l5 5L20 6" />,
];

const FLOW = ["職種・経験・希望条件を登録", "企業が匿名プロフィールを確認", "面接希望が届いた場合にadofyから連絡", "条件を確認して面接するか決定"];

/** サービスの流れ（4つの小さなアイコン） */
export function ServiceFlow() {
  return (
    <ol className="se-flow" aria-label="サービスの流れ">
      {FLOW.map((t, i) => (
        <li key={t}>
          <span className="se-flow__icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              {ICONS[i]}
            </svg>
          </span>
          <span className="se-flow__text">
            <b>{i + 1}</b>
            {t}
          </span>
        </li>
      ))}
    </ol>
  );
}
