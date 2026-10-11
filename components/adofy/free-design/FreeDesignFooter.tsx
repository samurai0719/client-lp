/**
 * 「ホームページを無料で作る」ページのフッター（運営者情報・プライバシーポリシー）。
 *
 * 運営者情報は、採用レスキューLP（components/saiyo-rescue/config.ts の OPERATOR）で
 * すでに公開している内容と同じものを使う。変更する場合は両方をそろえること。
 */

const OPERATOR = {
  name: "adofy",
  representative: "塚本 隼平",
  area: "岐阜県（全国対応）",
  email: "info@tenshoku-gpt.com",
  siteUrl: "https://adofy-site.com",
  profileUrl: "https://adofy-site.com/profile",
  business:
    "ホームページ・LP制作、成果報酬型広告運用、広告クリエイティブ制作、採用支援、トラックドライバー向け転職支援サービス「ドラテク」の運営",
} as const;

type Item = { term: string; desc: string; href?: string };

const SECTIONS: { id: string; title: string; items: Item[] }[] = [
  {
    id: "operator",
    title: "運営者情報",
    items: [
      { term: "サービス名", desc: "ホームページを無料で作る（集客・求人できるHP制作）" },
      { term: "運営者", desc: OPERATOR.name },
      { term: "代表者", desc: OPERATOR.representative },
      { term: "所在地", desc: OPERATOR.area },
      { term: "事業内容", desc: OPERATOR.business },
      { term: "メールアドレス", desc: OPERATOR.email, href: `mailto:${OPERATOR.email}` },
      { term: "ホームページ", desc: OPERATOR.siteUrl, href: OPERATOR.siteUrl },
      { term: "代表プロフィール", desc: OPERATOR.profileUrl, href: OPERATOR.profileUrl },
    ],
  },
  {
    id: "privacy",
    title: "プライバシーポリシー",
    items: [
      { term: "事業者", desc: `${OPERATOR.name}（代表：${OPERATOR.representative}）` },
      {
        term: "取得する情報",
        desc: "会社名・店舗名、ご担当者名、メールアドレス、電話番号（任意）、チャットでのご回答内容、アップロードいただいた写真・ロゴ、流入元・端末の種類などのアクセス情報",
      },
      {
        term: "利用目的",
        desc: "ホームページのデザイン案の制作、完成したデザインのご案内、本サービスに関するご連絡のために利用します。",
      },
      {
        term: "写真・ロゴの取り扱い",
        desc: "アップロードいただいた写真・ロゴは、ホームページの制作にのみ使用し、公開されない保存領域で管理します。",
      },
      {
        term: "アクセス解析・広告計測",
        desc: "サービス改善と広告効果測定のため、Meta Pixel等の計測ツールおよび広告パラメータ（utm等）を利用しています。",
      },
      {
        term: "外部サービスの利用",
        desc: "データの保管・メールの配信には外部のクラウドサービスを利用しています。",
      },
      { term: "第三者提供", desc: "法令に基づく場合を除き、ご本人の同意なく第三者へ提供することはありません。" },
      {
        term: "開示・訂正・削除",
        desc: "ご本人からのご請求があった場合は、本人確認のうえ遅滞なく対応します。下記の窓口までご連絡ください。",
      },
      { term: "お問い合わせ窓口", desc: OPERATOR.email, href: `mailto:${OPERATOR.email}` },
    ],
  },
];

export default function FreeDesignFooter() {
  return (
    <footer className="fd-footer">
      <div className="fd-footer__inner">
        {SECTIONS.map((s) => (
          <section key={s.id} id={s.id} className="fd-footer__sec">
            <h2>{s.title}</h2>
            <dl>
              {s.items.map((it) => (
                <div key={it.term}>
                  <dt>{it.term}</dt>
                  <dd>
                    {it.href ? (
                      <a href={it.href} {...(it.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                        {it.desc}
                      </a>
                    ) : (
                      it.desc
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}

        <nav className="fd-footer__links" aria-label="関連リンク">
          <a href="#operator">運営者情報</a>
          <a href="#privacy">プライバシーポリシー</a>
          <a href={`mailto:${OPERATOR.email}`}>お問い合わせ</a>
          <a href={OPERATOR.siteUrl}>adofy 公式サイト</a>
        </nav>
        <p className="fd-footer__copy">© {new Date().getFullYear()} {OPERATOR.name}</p>
      </div>
    </footer>
  );
}
