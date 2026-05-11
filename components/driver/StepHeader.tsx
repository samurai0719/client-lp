interface StepHeaderProps {
  /** 現在のステップ番号: 1〜totalSteps */
  currentStep: number;
  totalSteps: number;
}

export default function StepHeader({ currentStep, totalSteps }: StepHeaderProps) {
  const pct = Math.round((currentStep / totalSteps) * 100);
  const remaining = totalSteps - currentStep + 1;

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-20 shadow-sm">
      <div className="max-w-lg mx-auto">
        {/* ロゴ + ステップカウンター */}
        <div className="px-4 pt-2 pb-1 flex items-center justify-between">
          <span className="text-sm font-bold text-blue-700 tracking-wide">
            ドライバー転職ナビ
          </span>
          <span className="text-xs font-semibold text-slate-500">
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
        <div className="px-4 pb-2.5 flex items-center gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => {
            const n = i + 1;
            const done = n < currentStep;
            const active = n === currentStep;
            return (
              <div key={n} className="flex items-center gap-1">
                <div
                  className={
                    'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ' +
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
                      'h-0.5 w-6 rounded-full transition-all duration-300 ' +
                      (done ? 'bg-blue-400' : 'bg-slate-200')
                    }
                  />
                )}
              </div>
            );
          })}
          <span className="ml-auto text-[11px] text-slate-400">
            あと <span className="font-semibold text-blue-500">{remaining}</span> 問
          </span>
        </div>
      </div>
    </header>
  );
}
