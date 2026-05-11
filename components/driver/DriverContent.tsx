'use client';

import { useState } from 'react';
import HeroSection from './HeroSection';
import StepHeader from './StepHeader';
import QuestionCard from './QuestionCard';
import LicenseQuestion from './LicenseQuestion';

interface DriverContentProps {
  /** app/driver/page.tsx の AFFILIATE_URL から受け取ります */
  affiliateUrl: string;
}

export default function DriverContent({ affiliateUrl }: DriverContentProps) {
  /**
   * step:
   *   0 = ファーストビュー + Q1 表示
   *   1 = Q2: 正社員経験年数
   *   2 = Q3: 在職中かどうか
   *   3 = Q4: 免許 (最終 → アフィリエイトへ遷移)
   */
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);

  const advance = (next: 1 | 2 | 3) => {
    setStep(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    /*
     * 外側: PC では bg-slate-100 がサイドに見え、LP がカードとして浮き上がる
     * モバイル (<520px) では max-w-[520px] が効かず全幅になるため bg-slate-100 は見えない
     */
    <div className="min-h-screen bg-slate-100">
      {/* ── PC版中央寄せコンテナ ──
           520px 以上の画面では中央に固定幅カードとして表示。
           モバイルでは full-width のまま。
      */}
      <div className="max-w-[520px] mx-auto bg-white min-h-screen
                      shadow-[0_0_60px_rgba(30,64,175,0.08)]">
        <main>
          {/* ─────────────────────────────────────────────────────────
              ファーストビュー + Q1
              1問目の回答後に step が 1 以上になり、HeroSection は非表示になります。
          ───────────────────────────────────────────────────────── */}
          {step === 0 && (
            <HeroSection onAnswer={() => advance(1)} />
          )}

          {/* ─────────────────────────────────────────────────────────
              Q2 以降: ステップヘッダー + 各質問カード
          ───────────────────────────────────────────────────────── */}
          {step >= 1 && (
            <>
              <StepHeader currentStep={step} totalSteps={3} />

              {step === 1 && (
                <QuestionCard
                  stepNumber={1}
                  question="正社員での就業経験年数を教えて下さい"
                  choices={[
                    /*
                     * 画像差し替え方法:
                     *   現在は Wixstatic URL を直接参照しています。
                     *   ローカルに差し替える場合は imageSrc を
                     *   '/images/driver/exp-none.png' などに変更し、
                     *   public/images/driver/ にファイルを配置してください。
                     */
                    {
                      label: '経験なし',
                      imageSrc: 'https://static.wixstatic.com/media/5ebda9_c324d6caf48e43b99b64a1e7e82db4f2~mv2.png',
                    },
                    {
                      label: '1年以内',
                      imageSrc: 'https://static.wixstatic.com/media/5ebda9_7274bdbb009b4b2f91433713af422b8e~mv2.png',
                    },
                    {
                      label: '3年以内',
                      imageSrc: 'https://static.wixstatic.com/media/5ebda9_739b49b0c6bc4478a46c0f00ad5fb594~mv2.png',
                    },
                    {
                      label: '5年以内',
                      imageSrc: 'https://static.wixstatic.com/media/5ebda9_f7ef8be2baf643249c1d66a3f349395e~mv2.png',
                    },
                    {
                      label: '5年以上',
                      imageSrc: 'https://static.wixstatic.com/media/5ebda9_4b33e0398e3a42a5bea1cbabf80b432a~mv2.png',
                    },
                  ]}
                  onSelect={() => advance(2)}
                  layout="grid"
                />
              )}

              {step === 2 && (
                <QuestionCard
                  stepNumber={2}
                  question="現在在職中ですか？"
                  choices={[
                    /*
                     * 画像差し替え方法:
                     *   現在は Wixstatic URL を直接参照しています。
                     *   ローカルに差し替える場合は imageSrc を
                     *   '/images/driver/status-employed.png' などに変更し、
                     *   public/images/driver/ にファイルを配置してください。
                     */
                    {
                      label: '在職中',
                      imageSrc: 'https://static.wixstatic.com/media/5ebda9_4b33e0398e3a42a5bea1cbabf80b432a~mv2.png',
                    },
                    {
                      label: '離職中',
                      subLabel: '（アルバイト、派遣、学生含む）',
                      imageSrc: 'https://static.wixstatic.com/media/5ebda9_5079ccdffbca4d9794940ba5078d5f72~mv2.png',
                    },
                  ]}
                  onSelect={() => advance(3)}
                  layout="grid"
                />
              )}

              {/* 最終質問: 免許複数選択 → 最終CTAボタンでアフィリエイトへ遷移
                   免許区分・imageSrc は LicenseQuestion.tsx 内の LICENSE_CHOICES で管理しています。
              */}
              {step === 3 && (
                <LicenseQuestion
                  stepNumber={3}
                  affiliateUrl={affiliateUrl}
                />
              )}
            </>
          )}

          {/* フッター */}
          <footer className="text-center py-10 text-xs text-slate-400 border-t border-slate-100 mt-4">
            <p>© 2024 ドライバー転職ナビ All Rights Reserved.</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
