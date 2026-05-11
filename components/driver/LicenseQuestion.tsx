import ChoiceButton from './ChoiceButton';

const LICENSE_CHOICES = [
  {
    value: 'at-mt-normal',
    label: 'AT/MT普通',
    subLabel: '(H29/3以降)',
    imageSrc: 'https://static.wixstatic.com/media/5ebda9_1b40937d390f4c40bd3b01f9c487bec1~mv2.png',
  },
  {
    value: 'at-semi-mid-5t',
    label: 'AT準中型',
    subLabel: '(5t限定)',
    imageSrc: 'https://static.wixstatic.com/media/5ebda9_6177120472e6466c801931e292e20f3d~mv2.png',
  },
  {
    value: 'at-mid-8t',
    label: 'AT中型',
    subLabel: '(8t限定)',
    imageSrc: 'https://static.wixstatic.com/media/5ebda9_92dbd8da3a9c4f88be9f8561b4cdaa8e~mv2.png',
  },
  {
    value: 'mt-semi-mid-5t',
    label: 'MT準中型',
    subLabel: '(5t限定)',
    imageSrc: 'https://static.wixstatic.com/media/5ebda9_b2cdfd4e1f0446a7809fba3eb8e10c8e~mv2.png',
  },
  {
    value: 'semi-mid',
    label: '準中型免許',
    imageSrc: 'https://static.wixstatic.com/media/5ebda9_cb8f0d0787b34430bbbdf18d0313561d~mv2.png',
  },
  {
    value: 'mt-mid-8t',
    label: 'MT中型',
    subLabel: '(8t限定)',
    imageSrc: 'https://static.wixstatic.com/media/5ebda9_e41191b102a041a2a70ef914602699f4~mv2.png',
  },
  {
    value: 'mid',
    label: '中型免許',
    imageSrc: 'https://static.wixstatic.com/media/5ebda9_9c78e2426c274f158dbe958336166be8~mv2.png',
  },
  {
    value: 'large',
    label: '大型免許',
    imageSrc: 'https://static.wixstatic.com/media/5ebda9_e0bebf481ece4a009278382a9eff777f~mv2.png',
  },
];

interface LicenseQuestionProps {
  stepNumber: number;
  affiliateUrl: string;
}

export default function LicenseQuestion({ stepNumber, affiliateUrl }: LicenseQuestionProps) {
  return (
    <section className="px-5 py-8 animate-fade-in">

      <div className="text-center mb-6">
        <p className="text-[10px] font-bold tracking-[0.2em] text-blue-500 uppercase mb-2">
          STEP {stepNumber} / 3
        </p>
        <h2 className="text-xl font-bold text-slate-800 leading-snug">
          どんな免許をお持ちですか？
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {LICENSE_CHOICES.map((c) => (
          <ChoiceButton
            key={c.value}
            label={c.label}
            subLabel={c.subLabel}
            imageSrc={c.imageSrc}
            cardLayout="card"
            href={affiliateUrl}
          />
        ))}
      </div>

    </section>
  );
}
