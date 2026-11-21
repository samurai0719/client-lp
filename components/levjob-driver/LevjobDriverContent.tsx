"use client";

import { useRef, useState } from "react";
import {
  A8_BEACON,
  CTA_LABEL,
  CTA_LIMITED,
  CTA_SUB,
  CTA_URL,
  FAQS,
  FEATURES,
  FV_IMAGE,
  OPERATOR,
  QUESTIONS,
  STEPS,
  TIPS,
  type Answer,
  type QuestionId,
  type Tip,
} from "./config";

/** 回答してから次へスクロールするまでの間（選んだ状態を一瞬見せる） */
const SCROLL_DELAY_MS = 280;
/** スクロール後、次の要素の上に空ける余白 */
const SCROLL_GAP = 10;

function scrollToEl(el: HTMLElement | null) {
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({
    top: el.getBoundingClientRect().top + window.scrollY - SCROLL_GAP,
    behavior: reduce ? "auto" : "smooth",
  });
}

function Cta({ location }: { location: string }) {
  if (!CTA_URL) {
    return (
      <div className="lj-cta">
        <p className="lj-cta__limited">
          {CTA_LIMITED.replace("限定、", "限定、\u200b")}
        </p>
        <span className="lj-cta__btn is-pending" aria-disabled="true">
          {CTA_LABEL}
          <small>（リンク準備中）</small>
        </span>
      </div>
    );
  }
  return (
    <div className="lj-cta">
      <p className="lj-cta__limited">
        {CTA_LIMITED.replace("限定、", "限定、\u200b")}
      </p>
      <a
        className="lj-cta__btn"
        href={CTA_URL}
        target="_blank"
        rel="sponsored noopener"
        data-cta={location}
      >
        {CTA_LABEL}
        <span aria-hidden="true">›</span>
      </a>
      <p className="lj-cta__sub">{CTA_SUB}</p>
    </div>
  );
}

function Question({
  index,
  text,
  value,
  onAnswer,
  innerRef,
}: {
  index: number;
  text: string;
  value?: Answer;
  onAnswer: (a: Answer) => void;
  innerRef?: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div className={`lj-q${value ? " is-done" : ""}`} ref={innerRef}>
      <p className="lj-q__no">
        <span>Q{index}</span>
        {index} / {QUESTIONS.length}問
      </p>
      <h2 className="lj-q__text">{text}</h2>
      <div className="lj-q__btns" role="group" aria-label={`Q${index}の回答`}>
        {(["yes", "no"] as const).map((a) => (
          <button
            key={a}
            type="button"
            className={`lj-q__btn is-${a}${value === a ? " is-on" : ""}`}
            aria-pressed={value === a}
            onClick={() => onAnswer(a)}
          >
            {value === a && (
              <span className="lj-q__check" aria-hidden="true">
                ✓
              </span>
            )}
            {a === "yes" ? "はい" : "いいえ"}
          </button>
        ))}
      </div>
    </div>
  );
}

/** 豆知識。登録画面の画像に、選ぶ場所を赤丸で重ねる */
function TipBox({ tip }: { tip: Tip }) {
  const { image, circle } = tip;
  return (
    <aside className="lj-tip" aria-label="豆知識">
      <p className="lj-tip__label">
        <span aria-hidden="true">💡</span>豆知識
      </p>
      <div className="lj-tip__figure">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.src}
          width={image.width}
          height={image.height}
          alt={image.alt}
          loading="lazy"
          decoding="async"
        />
        <span
          className="lj-tip__circle"
          aria-hidden="true"
          style={{
            left: `${circle.left}%`,
            top: `${circle.top}%`,
            width: `${circle.width}%`,
            height: `${circle.height}%`,
            borderRadius: circle.radius,
          }}
        />
      </div>
      <p className="lj-tip__text">
        <strong>{tip.em}</strong>
        {tip.text}
      </p>
    </aside>
  );
}

export default function LevjobDriverContent() {
  const [answers, setAnswers] = useState<Partial<Record<QuestionId, Answer>>>(
    {},
  );
  const qRefs = useRef<(HTMLDivElement | null)[]>([]);
  const resultRef = useRef<HTMLElement>(null);
  const done = QUESTIONS.every((q) => answers[q.id]);

  function answer(i: number, a: Answer) {
    setAnswers((prev) => ({ ...prev, [QUESTIONS[i].id]: a }));
    // 最後の質問のあとは記事本文へ。結果の描画を待ってからスクロールする
    window.setTimeout(
      () =>
        scrollToEl(
          i + 1 < QUESTIONS.length ? qRefs.current[i + 1] : resultRef.current,
        ),
      SCROLL_DELAY_MS,
    );
  }

  return (
    <div className="lj">
      <p className="lj-pr">
        【PR】本ページはプロモーション（アフィリエイト広告）を含みます
      </p>

      {/* ── ファーストビュー：画像＋見出し＋導入文＋Q1（スマホの1画面に収める） ── */}
      {/* FV＋1問目で1画面ぶんの高さを取り、最初の画面に2問目が入らないようにする */}
      <div className="lj-first">
        <header className="lj-fv">
          <div className="lj-fv__visual">
            {FV_IMAGE ? (
              // 見出しは画像に入っているので、画像の上に文字は重ねない
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={FV_IMAGE.src}
                width={FV_IMAGE.width}
                height={FV_IMAGE.height}
                alt={FV_IMAGE.alt}
                fetchPriority="high"
                decoding="async"
              />
            ) : (
              <div className="lj-fv__placeholder" aria-hidden="true">
                <span>🚚</span>
              </div>
            )}
          </div>
          <h1 className="lj-fv__h1">
            <span>ドライバーの転職</span>簡単3問アンケート
          </h1>
          <p className="lj-fv__lead">
            <b>簡単3問のアンケート</b>に答えていただいた方限定で、
            <b>好条件の求人を紹介してくれる転職サイト</b>をご紹介します。
          </p>
        </header>
        <div className="lj-quiz lj-quiz--first">
          <Question
            index={1}
            text={QUESTIONS[0].text}
            value={answers.q1}
            onAnswer={(a) => answer(0, a)}
            innerRef={(el) => (qRefs.current[0] = el)}
          />
        </div>
      </div>

      <section className="lj-quiz" aria-label="アンケートの続き">
        {/* 2問目と豆知識で1画面ぶんの高さを取り、2問目を上端に送ったとき3問目が画面に入らないようにする */}
        <div className="lj-step2">
          <Question
            index={2}
            text={QUESTIONS[1].text}
            value={answers.q2}
            onAnswer={(a) => answer(1, a)}
            innerRef={(el) => (qRefs.current[1] = el)}
          />
          <TipBox tip={TIPS.timing} />
        </div>
        <Question
          index={3}
          text={QUESTIONS[2].text}
          value={answers.q3}
          onAnswer={(a) => answer(2, a)}
          innerRef={(el) => (qRefs.current[2] = el)}
        />
        <TipBox tip={TIPS.area} />
        {/* 回答前でも、各質問を画面上部まで送れるだけの高さを確保する */}
        {!done && <div className="lj-quiz__spacer" aria-hidden="true" />}
      </section>

      {done && (
        <article
          className="lj-article"
          ref={resultRef}
          aria-labelledby="lj-result-title"
        >
          <div className="lj-result">
            <p className="lj-result__thanks">
              アンケートの回答
              <wbr />
              ありがとうございます！
            </p>
            <h2 id="lj-result-title" className="lj-result__title">
              そんなあなたにおすすめの
              <wbr />
              転職サイトは
              <br />
              <em>レバジョブ</em>です
            </h2>
            <p className="lj-result__by">運営：レバレジーズ株式会社</p>
          </div>

          <div className="lj-body">
            <p>
              「今の会社を辞めたい」「給料が上がらない」と感じていても、仕事をしながら求人を探して比べるのは大変です。
              <b>レバジョブ</b>
              なら、専任のキャリアアドバイザーに希望を伝えるだけで、条件に合う求人を紹介してもらえます。
            </p>
          </div>

          <Cta location="result" />

          <h3 className="lj-h3">レバジョブをおすすめする理由</h3>
          <ol className="lj-features">
            {FEATURES.map((f, i) => (
              <li key={f.title}>
                <span className="lj-features__no">{i + 1}</span>
                <div>
                  <h4>{f.title}</h4>
                  <p>{f.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <h3 className="lj-h3">登録から求人紹介までの流れ</h3>
          <ol className="lj-steps">
            {STEPS.map((s, i) => (
              <li key={s.title}>
                <span className="lj-steps__no">STEP{i + 1}</span>
                <h4>{s.title}</h4>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>

          <h3 className="lj-h3">よくある質問</h3>
          <dl className="lj-faq">
            {FAQS.map((f) => (
              <div key={f.q}>
                <dt>{f.q}</dt>
                <dd>{f.a}</dd>
              </div>
            ))}
          </dl>

          <div className="lj-final">
            <p className="lj-final__lead">
              まずは無料で、どんなドライバー求人があるか確認してみましょう。
            </p>
            <Cta location="final" />
          </div>
        </article>
      )}

      <footer className="lj-footer">
        <p className="lj-footer__note">
          本ページはアフィリエイト広告です。掲載内容は、レバレジーズ株式会社が提供する「レバジョブ」の情報等をもとに作成しています。サービス内容・条件は変更される場合があるため、最新かつ正確な情報は必ず公式サイトでご確認ください。
        </p>
        <dl className="lj-footer__op">
          <div>
            <dt>運営者</dt>
            <dd>{OPERATOR.name}</dd>
          </div>
          <div>
            <dt>所在地</dt>
            <dd>{OPERATOR.address}</dd>
          </div>
          <div>
            <dt>連絡先</dt>
            <dd>
              {OPERATOR.phone}／{OPERATOR.email}
            </dd>
          </div>
          <div>
            <dt>紹介サービス</dt>
            <dd>レバジョブ（運営：レバレジーズ株式会社）</dd>
          </div>
        </dl>
        {/* A8.net の表示計測ビーコン */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img width={1} height={1} src={A8_BEACON} alt="" style={{ display: "none" }} />
      </footer>
    </div>
  );
}
