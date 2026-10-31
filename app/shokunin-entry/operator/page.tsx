import type { Metadata } from "next";
import LegalPage from "@/components/shokunin-entry/LegalPage";
import { OPERATOR } from "@/components/saiyo-rescue/config";

export const metadata: Metadata = {
  title: "運営者情報｜職人採用エージェント",
  description: "職人採用エージェントの運営者情報です。",
};

const ITEMS = [
  ["サービス名", "職人採用エージェント"],
  ["運営者", OPERATOR.name],
  ["代表", OPERATOR.representative],
  ["所在地", OPERATOR.area],
  ["お問い合わせ", OPERATOR.email],
];

export default function ShokuninEntryOperatorPage() {
  return (
    <LegalPage title="運営者情報" lead="本サービスの運営者は次のとおりです。">
      <dl className="se-operator">
        {ITEMS.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </LegalPage>
  );
}
