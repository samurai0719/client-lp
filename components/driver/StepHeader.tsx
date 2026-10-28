interface StepHeaderProps {
  /** 現在のステップ番号: 1〜totalSteps */
  currentStep: number;
  totalSteps: number;
  /** 前のステップへ戻る（回答は消さない）。未指定なら戻るボタンを出さない */
  onBack?: () => void;
  /** 登録完了後: 全ステップを完了表示にする */
  completed?: boolean;
}

export default function StepHeader({ currentStep, totalSteps, onBack, completed = false }: StepHeaderProps) {
  const pct = completed ? 100 : Math.round((currentStep / totalSteps) * 100);
  const remaining = totalSteps - currentStep;

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-20 shadow-sm">
      <div className="max-w-lg mx-auto">
        {/* 戻る + ロゴ + ステップカウンター */}
        <div className="px-4 pt-2 pb-1 flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 min-w-0">
            {onBack && !completed && (
              <button
                type="button"
                onClick={onBack}
                className="-ml-2 mr-0.5 flex h-8 items-center gap-0.5 rounded-lg px-2 text-xs font-bold text-slate-500 hover:bg-slate-100 active:bg-slate-200"
              >
                <span aria-hidden="true" className="text-base leading-none">‹</span>
                戻る
              </button>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/driver/logo-mark.png"
              alt=""
              width={512}
              height={512}
              className="h-5 w-5 object-contain block"
            />
            <span className="text-sm font-bold text-blue-800 tracking-wide">
              ドラテク
            </span>
          </span>
          <span className="shrink-0 text-xs font-semibold text-slate-500">
            STEP{' '}
            <span className="text-blue-600 text-sm">{currentStep}</span>
            {' '}/ {totalSteps}
          </span>
        </div>

        {/* プログレスバー */}
        <div className="mx-4 mb-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* ステップドット */}
        <div className="px-4 pb-2.5 flex items-center gap-0.5">
          {Array.from({ length: totalSteps }).map((_, i) => {
            const n = i + 1;
            const done = completed || n < currentStep;
            const active = !completed && n === currentStep;
            return (
              <div key={n} className="flex items-center gap-0.5">
                <div
                  className={
                    'w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold transition-all duration-300 shrink-0 ' +
                    (done
                      ? 'bg-blue-500 text-white'
                      : active
                      ? 'bg-blue-700 text-white ring-2 ring-blue-300 ring-offset-1'
                      : 'bg-slate-200 text-slate-400')
                  }
                >
                  {done ? '✓' : n}
                </div>
                {i < totalSteps - 1 && (
                  <div
                    className={
                      'h-0.5 w-2 min-[360px]:w-3 rounded-full transition-all duration-300 shrink-0 ' +
                      (done ? 'bg-blue-400' : 'bg-slate-200')
                    }
                  />
                )}
              </div>
            );
          })}
          <span className="ml-auto pl-1 whitespace-nowrap text-[11px] text-slate-400">
            {completed ? (
              <span className="font-semibold text-blue-500">登録完了</span>
            ) : remaining > 0 ? (
              <>
                あと <span className="font-semibold text-blue-500">{remaining}</span> ステップ
              </>
            ) : (
              <span className="font-semibold text-blue-500">最後のステップ</span>
            )}
          </span>
        </div>
      </div>
    </header>
  );
}
