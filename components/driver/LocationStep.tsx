'use client';

import { useEffect, useRef, useState } from 'react';
import QuestionCard from './QuestionCard';
import ChoiceButton from './ChoiceButton';
import { AREA_PREFECTURES, DESIRED_AREAS, PREFECTURES, normalizePostalCode, type DriverAnswers } from './questions';

type LocationKeys = 'postalCode' | 'currentPrefecture' | 'currentCity' | 'desiredArea' | 'desiredPrefecture';

interface LocationStepProps {
  answers: Pick<DriverAnswers, LocationKeys>;
  onChange: (patch: Partial<Pick<DriverAnswers, LocationKeys>>) => void;
  /** 回答が揃っていれば親が STEP6 へ進める */
  onNext: () => void;
}

/** 都道府県の選択が要らない（＝選んだらすぐ次へ進める）勤務エリア */
const AREAS_WITHOUT_PREFECTURE = ['現在の住所周辺', '相談して決めたい'];

/**
 * STEP5：お住まい（郵便番号 → 都道府県・市区町村）と希望勤務エリア。
 * 郵便番号が分からない人・引けなかったときは都道府県を選べる。
 * 勤務エリアは地域を選んだあとにだけ、その地域の都道府県（任意）を出す。
 */
export default function LocationStep({ answers, onChange, onNext }: LocationStepProps) {
  const [postal, setPostal] = useState(answers.postalCode);
  const [lookup, setLookup] = useState<'idle' | 'loading' | 'found' | 'not_found' | 'error'>(
    answers.postalCode && answers.currentPrefecture ? 'found' : 'idle',
  );
  // 郵便番号が分からない人向けの都道府県選択（郵便番号なしで都道府県が入っている＝前に手で選んだ）
  const [manual, setManual] = useState(!answers.postalCode && Boolean(answers.currentPrefecture));
  const [error, setError] = useState<string | null>(null);
  const lastLooked = useRef(answers.postalCode);
  const secondQuestion = useRef<HTMLDivElement>(null);
  /** お住まいが決まったら、同じページの2問目（勤務エリア）へスクロールする */
  const scrollToSecond = () =>
    window.setTimeout(() => secondQuestion.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 30);

  // 7桁そろったら住所を引く
  useEffect(() => {
    const code = normalizePostalCode(postal);
    if (code.length !== 7 || code === lastLooked.current) return;
    lastLooked.current = code;
    let cancelled = false;
    setLookup('loading');
    fetch(`/api/postal-code?code=${code}`)
      .then(async (res) => {
        if (cancelled) return;
        if (res.status === 404) {
          setLookup('not_found');
          setManual(true);
          return;
        }
        if (!res.ok) throw new Error('lookup failed');
        const data = (await res.json()) as { prefecture: string; city: string };
        if (cancelled) return;
        onChange({ postalCode: code, currentPrefecture: data.prefecture, currentCity: data.city });
        setLookup('found');
        setManual(false);
        setError(null);
        scrollToSecond();
      })
      .catch(() => {
        if (cancelled) return;
        setLookup('error');
        setManual(true);
      });
    return () => {
      cancelled = true;
    };
  }, [postal, onChange]);

  const changePostal = (v: string) => {
    const code = normalizePostalCode(v).slice(0, 7);
    setPostal(code);
    if (code !== answers.postalCode) {
      // 郵便番号を打ち直したら、前に引いた住所は消す（手で選んだ都道府県は残す）
      if (!manual) onChange({ postalCode: '', currentPrefecture: '', currentCity: '' });
      else onChange({ postalCode: '' });
      lastLooked.current = '';
      setLookup('idle');
    }
  };

  const missing = () => {
    if (!answers.currentPrefecture) return 'お住まいの郵便番号を入力するか、都道府県を選んでください';
    if (!answers.desiredArea) return '希望する勤務エリアを選んでください';
    return null;
  };

  const tryNext = () => {
    const m = missing();
    setError(m);
    if (!m) onNext();
  };

  const selectArea = (area: string) => {
    onChange({ desiredArea: area, desiredPrefecture: area === answers.desiredArea ? answers.desiredPrefecture : '' });
    // 都道府県を選ばない勤務エリアは、住所が入っていればそのまま次へ
    if (AREAS_WITHOUT_PREFECTURE.includes(area)) {
      if (answers.currentPrefecture) {
        setError(null);
        onNext();
      } else {
        setError('お住まいの郵便番号を入力するか、都道府県を選んでください');
      }
    }
  };

  const areaPrefectures = AREA_PREFECTURES[answers.desiredArea];

  return (
    <>
      {/* 質問1：郵便番号 */}
      <div>
        <div className="text-center mb-4">
          <p className="text-[10px] font-bold tracking-widest text-blue-400 mb-1">質問 1</p>
          <h2 className="text-lg font-bold text-slate-800 leading-snug">お住まいの郵便番号を教えてください</h2>
          <p className="text-xs text-slate-400 mt-1.5">企業にはそのまま公開されません</p>
        </div>

        <label className="block max-w-[360px] mx-auto">
          <span className="sr-only">郵便番号（ハイフンなし7桁）</span>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={8}
            value={postal}
            onChange={(e) => changePostal(e.target.value)}
            placeholder="例：5008833（ハイフンなし7桁）"
            className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 text-center text-lg font-bold tracking-widest text-slate-800 placeholder:text-sm placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-300 shadow-sm focus:border-blue-500 focus:outline-none"
          />
        </label>

        <div className="mt-2 min-h-[1.5rem] text-center text-xs">
          {lookup === 'loading' && <p className="text-slate-400">住所を確認しています…</p>}
          {lookup === 'found' && !manual && (
            <p className="font-bold text-blue-700">
              {answers.currentPrefecture}
              {answers.currentCity}
            </p>
          )}
          {lookup === 'not_found' && <p className="text-orange-600">郵便番号が見つかりませんでした。都道府県を選んでください。</p>}
          {lookup === 'error' && <p className="text-orange-600">住所を確認できませんでした。都道府県を選んでください。</p>}
        </div>

        {!manual ? (
          <p className="text-center">
            <button type="button" onClick={() => setManual(true)} className="text-xs font-bold text-blue-600 underline underline-offset-2">
              郵便番号が分からない方はこちら
            </button>
          </p>
        ) : (
          <label className="mt-1 block max-w-[360px] mx-auto">
            <span className="mb-1.5 block text-center text-xs font-bold text-slate-600">お住まいの都道府県</span>
            <select
              value={answers.currentPrefecture}
              onChange={(e) => {
                onChange({ currentPrefecture: e.target.value, currentCity: answers.postalCode ? answers.currentCity : '' });
                setError(null);
                if (e.target.value) scrollToSecond();
              }}
              className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="">選択してください</option>
              {PREFECTURES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {/* 質問2：希望勤務エリア */}
      <div ref={secondQuestion} className="scroll-mt-28">
        <QuestionCard
          index={2}
          question="希望する勤務エリアを教えてください"
          choices={DESIRED_AREAS.map((label) => ({ label }))}
          value={answers.desiredArea}
          onSelect={selectArea}
        />

        {areaPrefectures && (
          <div className="mt-5 rounded-xl bg-slate-50 px-3 py-4">
            <p className="mb-3 text-center text-xs font-bold text-slate-600">
              都道府県も決まっていれば選んでください<span className="ml-1 font-normal text-slate-400">（任意）</span>
            </p>
            <div className="grid grid-cols-2 gap-2 min-[400px]:grid-cols-3">
              {areaPrefectures.map((p) => (
                <ChoiceButton
                  key={p}
                  label={p}
                  cardLayout="text"
                  selected={answers.desiredPrefecture === p}
                  onClick={() => onChange({ desiredPrefecture: answers.desiredPrefecture === p ? '' : p })}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <NextButton error={error} onClick={tryNext} />
    </>
  );
}

/** 複数選択・入力があるステップの「次へ」ボタン（全ステップ共通の見た目） */
export function NextButton({ onClick, error, label = '次へ進む' }: { onClick: () => void; error?: string | null; label?: string }) {
  return (
    <div className="max-w-[360px] w-full mx-auto">
      {error && (
        <p role="alert" className="mb-3 text-center text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      <button
        type="button"
        onClick={onClick}
        className="group w-full rounded-2xl transition-all duration-150 active:scale-[0.97]
          bg-gradient-to-br from-blue-600 to-blue-800
          hover:from-blue-500 hover:to-blue-700
          shadow-[0_6px_22px_rgba(29,78,216,0.38)]
          text-white px-5 py-5"
      >
        <span className="flex items-center justify-between gap-3">
          <span className="text-[17px] font-extrabold leading-tight">{label}</span>
          <span className="text-2xl shrink-0 group-hover:translate-x-1.5 transition-transform duration-150">→</span>
        </span>
      </button>
    </div>
  );
}
