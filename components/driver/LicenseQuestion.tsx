import QuestionCard, { type Choice } from './QuestionCard';
import { LICENSES } from './questions';

/**
 * 免許の選択肢と画像。表示順と保存する値は questions.ts の LICENSES に合わせる。
 * 画像未用意の免許（けん引・フォークリフト・第二種・その他）は ChoiceButton のプレースホルダー表示。
 * 画像を用意したら imageSrc: '/images/driver/license-towing.png' のように追加してください。
 */
const LICENSE_IMAGES: Partial<Record<(typeof LICENSES)[number], Omit<Choice, 'label'>>> = {
  '普通免許（AT）': { imageSrc: 'https://static.wixstatic.com/media/5ebda9_1b40937d390f4c40bd3b01f9c487bec1~mv2.png' },
  '普通免許（MT）': { imageSrc: 'https://static.wixstatic.com/media/5ebda9_1b40937d390f4c40bd3b01f9c487bec1~mv2.png' },
  準中型5t限定: { imageSrc: 'https://static.wixstatic.com/media/5ebda9_6177120472e6466c801931e292e20f3d~mv2.png' },
  準中型免許: { imageSrc: 'https://static.wixstatic.com/media/5ebda9_cb8f0d0787b34430bbbdf18d0313561d~mv2.png' },
  中型8t限定: { imageSrc: 'https://static.wixstatic.com/media/5ebda9_92dbd8da3a9c4f88be9f8561b4cdaa8e~mv2.png' },
  中型免許: { imageSrc: 'https://static.wixstatic.com/media/5ebda9_9c78e2426c274f158dbe958336166be8~mv2.png' },
  大型免許: { imageSrc: 'https://static.wixstatic.com/media/5ebda9_e0bebf481ece4a009278382a9eff777f~mv2.png' },
};

const LICENSE_CHOICES: Choice[] = LICENSES.map((label) => ({ label, ...LICENSE_IMAGES[label] }));

interface LicenseQuestionProps {
  index?: number;
  values: string[];
  onToggle: (license: string) => void;
}

/** 免許（複数選択）。従来の画像つき免許カードの見た目のまま、押すたびに選択/解除する */
export default function LicenseQuestion({ index, values, onToggle }: LicenseQuestionProps) {
  return (
    <QuestionCard
      index={index}
      mode="multi"
      question="お持ちの免許を教えてください"
      hint="複数選択できます"
      choices={LICENSE_CHOICES}
      variant="card"
      values={values}
      onToggle={onToggle}
    />
  );
}
