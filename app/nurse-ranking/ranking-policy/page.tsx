import type { Metadata } from "next";
import LegalPageShell from "@/components/nurse-ranking/LegalPageShell";
import { editorialBasisText, siteMeta } from "@/config/nurse-ranking";

const canonicalUrl = siteMeta.domain ? `https://${siteMeta.domain}/nurse-ranking/ranking-policy` : undefined;

export const metadata: Metadata = {
  title: "ランキング・編集方針｜看護師転職 比較ナビ",
  description: "当サイトの看護師転職サービスランキングにおける掲載順位の決定方針と編集ポリシーについて説明します。",
  alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
};

export default function RankingPolicyPage() {
  return (
    <LegalPageShell title="ランキング・編集方針">
      <section>
        <h2>掲載順位の決定方法</h2>
        <p>{editorialBasisText}</p>
      </section>

      <section>
        <h2>比較にあたっての方針</h2>
        <ul>
          <li>実在しない「利用者アンケート」「満足度◯%」等の数値は作成しません。</li>
          <li>出典のない「No.1」表現、必ず採用される表現、給与アップ保証などの表現は使用しません。</li>
          <li>公式サイト（または公式の広告素材）で確認できる情報を基本とし、求人数・利用者数などの数値は出典と時点を明記して掲載します。確認できない数値は掲載しません。</li>
          <li>他サイトの評価点・星評価は使用せず、当サイトでも点数・星評価は付けていません。</li>
          <li>各サービスの公式サイト・商標・ロゴの権利を尊重します。</li>
        </ul>
      </section>

      <section>
        <h2>広告について</h2>
        <p>
          当サイトはアフィリエイト広告を利用しています。広告主から成果報酬を受け取ることがありますが、
          報酬の有無によって評価内容を事実と異なるものにすることはありません。詳しくは
          「広告掲載ポリシー」をご確認ください。
        </p>
      </section>

      <section>
        <h2>ランキングの位置付け</h2>
        <p>
          掲載順位は当サイトが設定したおすすめ順です。本ランキングは当サイトの基準に基づく参考情報であり、利用者全員にとって最適な順位を保証するものではありません。
          最終的なサービス選択はご自身の状況・希望条件に照らしてご判断ください。
        </p>
      </section>

      <p className="text-xs text-slate-400">最終更新：{siteMeta.contentUpdatedAt}</p>
    </LegalPageShell>
  );
}
