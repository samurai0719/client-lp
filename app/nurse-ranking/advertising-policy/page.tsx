import type { Metadata } from "next";
import LegalPageShell from "@/components/nurse-ranking/LegalPageShell";
import { siteMeta } from "@/config/nurse-ranking";

const canonicalUrl = siteMeta.domain ? `https://${siteMeta.domain}/nurse-ranking/advertising-policy` : undefined;

export const metadata: Metadata = {
  title: "広告掲載ポリシー｜看護師転職サイトおすすめランキング",
  description: "当サイトにおけるアフィリエイト広告の利用状況と、広告掲載に関する方針について説明します。",
  alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
};

export default function AdvertisingPolicyPage() {
  return (
    <LegalPageShell title="広告掲載ポリシー">
      <section>
        <h2>アフィリエイト広告について</h2>
        <p>
          当サイトはアフィリエイト広告を利用しています。掲載しているサービスへ登録・お申し込みいただいた場合、
          当サイトが提携する広告主から成果報酬を受け取ることがあります。
        </p>
      </section>

      <section>
        <h2>広告表記</h2>
        <p>
          広告を含むページには、ページ上部の見落としにくい位置に「PR」または「広告」の表記を行っています。
          広告枠として提供している箇所には「広告」ラベルを表示しています。
        </p>
      </section>

      <section>
        <h2>公平性についての考え方</h2>
        <ul>
          <li>広告主から受け取る報酬の有無によって、サービスの評価・説明内容を事実と異なるものにすることはありません。</li>
          <li>実在しないアンケート結果や満足度の数値、出典のないNo.1表現は使用しません。</li>
          <li>掲載順位の決定方針は「ランキング・編集方針」ページに記載しています。</li>
        </ul>
      </section>

      <section>
        <h2>商標・画像について</h2>
        <p>
          掲載している会社名・サービス名・商標・ロゴ等の権利は各社に帰属します。公式サイトの画像・ロゴの無断転載は行いません。
        </p>
      </section>

      <p className="text-xs text-slate-400">最終更新：{siteMeta.contentUpdatedAt}</p>
    </LegalPageShell>
  );
}
