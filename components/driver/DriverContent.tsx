'use client';

import { useState } from 'react';
import HeroSection from './HeroSection';
import StepHeader from './StepHeader';
import QuestionCard from './QuestionCard';
import LicenseQuestion from './LicenseQuestion';
import RegisterSection from './RegisterSection';
import { TOTAL_STEPS } from './questions';

/**
 * step:
 *   1 = ファーストビュー + Q1 (今のお気持ち)
 *   2 = Q2: 正社員経験年数
 *   3 = Q3: 在職中かどうか
 *   4 = Q4: 免許
 *   5 = Q5: 希望する働き方
 *   6 = Q6: 希望の勤務エリア
 *   7 = Q7: 希望年収 (最終質問)
 *   8 = 診断完了 + ドラテク無料登録フォーム
 */
type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export default function DriverContent() {
  const [step, setStep] = useState<Step>(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  /** 質問 n に回答して次のステップへ進む */
  const answer = (n: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [n]: value }));
    setStep((n + 1) as Step);
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
              Q1: ファーストビュー + 最初の質問
              回答後に step が 2 以上になり、HeroSection は非表示になります。
          ───────────────────────────────────────────────────────── */}
          {step === 1 && (
            <HeroSection onAnswer={(a) => answer(1, a)} />
          )}

          {/* ─────────────────────────────────────────────────────────
              Q2 以降: ステップヘッダー + 各質問カード
          ───────────────────────────────────────────────────────── */}
          {step >= 2 && step <= TOTAL_STEPS && (
            <>
              <StepHeader currentStep={step} totalSteps={TOTAL_STEPS} />

              {step === 2 && (
                <QuestionCard
                  stepNumber={2}
                  totalSteps={TOTAL_STEPS}
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
                  onSelect={(a) => answer(2, a)}
                  layout="grid"
                />
              )}

              {step === 3 && (
                <QuestionCard
                  stepNumber={3}
                  totalSteps={TOTAL_STEPS}
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
                  onSelect={(a) => answer(3, a)}
                  layout="grid"
                />
              )}

              {/* 免許区分・imageSrc は LicenseQuestion.tsx 内の LICENSE_CHOICES で管理しています。 */}
              {step === 4 && (
                <LicenseQuestion
                  stepNumber={4}
                  totalSteps={TOTAL_STEPS}
                  onSelect={(a) => answer(4, a)}
                />
              )}

              {step === 5 && (
                <QuestionCard
                  stepNumber={5}
                  totalSteps={TOTAL_STEPS}
                  question="希望する働き方を教えて下さい"
                  choices={[
                    /*
                     * 画像未用意のため imageSrc は未設定 (ChoiceButton のプレースホルダーが表示されます)。
                     * 画像を用意したら imageSrc: '/images/driver/work-day.png' のように追加してください。
                     */
                    { label: '日勤メイン', subLabel: '（朝〜夕方）' },
                    { label: '夜勤メイン', subLabel: '（夕方〜早朝）' },
                    { label: '長距離・泊まり', subLabel: '（高収入重視）' },
                    { label: '地場・近距離', subLabel: '（毎日自宅に帰りたい）' },
                    { label: 'こだわらない' },
                  ]}
                  onSelect={(a) => answer(5, a)}
                  layout="grid"
                />
              )}

              {step === 6 && (
                <QuestionCard
                  stepNumber={6}
                  totalSteps={TOTAL_STEPS}
                  question="希望の勤務エリアを教えて下さい"
                  choices={[
                    /*
                     * 画像未用意のため imageSrc は未設定。
                     * 画像を用意したら imageSrc: '/images/driver/area-kanto.png' のように追加してください。
                     */
                    { label: '北海道・東北' },
                    { label: '関東', subLabel: '（東京・神奈川・千葉・埼玉ほか）' },
                    { label: '中部・北陸' },
                    { label: '関西', subLabel: '（大阪・京都・兵庫ほか）' },
                    { label: '中国・四国' },
                    { label: '九州・沖縄' },
                  ]}
                  onSelect={(a) => answer(6, a)}
                  layout="grid"
                />
              )}

              {/* 最終質問: 回答すると診断完了 → ドラテクの無料登録フォームへ進みます */}
              {step === 7 && (
                <QuestionCard
                  stepNumber={7}
                  totalSteps={TOTAL_STEPS}
                  question="希望する年収を教えて下さい"
                  choices={[
                    /*
                     * 画像未用意のため imageSrc は未設定。
                     * 画像を用意したら imageSrc: '/images/driver/income-400.png' のように追加してください。
                     */
                    { label: '400万円未満' },
                    { label: '400〜500万円' },
                    { label: '500〜600万円' },
                    { label: '600万円以上' },
                    { label: 'まだ決めていない' },
                  ]}
                  onSelect={(a) => answer(7, a)}
                  isFinal
                  layout="grid"
                />
              )}
            </>
          )}

          {/* ─────────────────────────────────────────────────────────
              診断完了 → ドラテクの無料登録フォーム (サイト内で完結)
          ───────────────────────────────────────────────────────── */}
          {step === 8 && <RegisterSection answers={answers} />}

          {/* フッター */}
          <footer className="text-center py-10 text-xs text-slate-400 border-t border-slate-100 mt-4">
            <p>© 2026 ドラテク All Rights Reserved.</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
