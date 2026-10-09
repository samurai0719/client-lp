import type { Metadata } from "next";
import LegalPage, { type Clause } from "@/components/driver-company/LegalPage";
import {
  PRICING,
  REFUND_ELIGIBLE,
  REFUND_INELIGIBLE,
  REFUND_PROCESS,
  REFUND_TIERS,
  SERVICE,
} from "@/config/driver-company";

/**
 * 早期退職時返金規程。
 * 返金率・対象・対象外・手続きはすべて config/driver-company.ts の値から組み立てており、
 * LPの表示と必ず一致する。数値や条件を直接書かないこと。
 */

const TITLE = `早期退職時返金規程｜${SERVICE.name}`;

export const metadata: Metadata = {
  metadataBase: new URL(SERVICE.siteUrl),
  title: TITLE,
  description: `${SERVICE.name}の早期退職時返金規程です。返金率、返金対象・対象外、申請手続きについて定めています。`,
  alternates: { canonical: `${SERVICE.siteUrl}/company/refund-policy` },
};

const CLAUSES: Clause[] = [
  {
    heading: "目的",
    body: [
      `本規程は、${SERVICE.name}（以下「本サービス」といいます）を通じて採用した者が早期に退職した場合における、成果報酬の返金について定めるものです。`,
      "本規程は企業向け利用規約の一部を構成します。",
    ],
  },
  {
    heading: "返金率",
    body: [
      "返金額は、入社日から退職日までの在籍日数に応じて、次のとおりとします。",
      REFUND_TIERS.map((t) => `${t.label}：${t.refund}`),
      `返金額は、掲載企業が実際に支払った成果報酬額（採用1名につき${PRICING.successFee}${PRICING.taxNote}）を上限とします。`,
      "請求前に退職が確認された場合は、返金ではなく請求額の減額または請求の取消として処理します。",
    ],
  },
  {
    heading: "返金の対象となる場合",
    body: ["次のいずれかに該当する退職を返金の対象とします。", [...REFUND_ELIGIBLE]],
  },
  {
    heading: "返金の対象とならない場合",
    body: [
      "次のいずれかに該当する場合は、返金の対象外とします。",
      [...REFUND_INELIGIBLE],
      "上記のうち、求人情報と実際の労働条件が異なっていた場合、賃金未払い、違法な長時間労働、ハラスメントその他の労働関係法令への違反があった場合は、退職の時期にかかわらず返金を行いません。",
    ],
  },
  {
    heading: "申請期限",
    body: [
      "返金の申請は、退職日から14日以内に行うものとします。当該期限を経過した場合、返金の対象外となります。",
    ],
  },
  {
    heading: "申請手続き",
    body: ["返金の申請は、次の手順により行います。", [...REFUND_PROCESS]],
  },
  {
    heading: "提出書類",
    body: [
      "返金の申請にあたっては、退職の事実および退職日を確認できる書類の提出を求めます。書類が提出されない場合、返金の対象外となります。",
      "当社は、申請内容の確認のために追加の資料の提出を求めることがあります。",
    ],
  },
  {
    heading: "審査と返金",
    body: [
      "当社は、申請内容および提出書類を確認のうえ、返金の可否および返金額を決定します。",
      "返金額の確定後30日以内に、掲載企業が指定する口座へ返金します。振込手数料の負担については、返金の案内時にご連絡します。",
      "成果報酬が未払いの場合、返金は行わず、請求額の調整により処理します。",
    ],
  },
  {
    heading: "本規程の変更",
    body: [
      "当社は、必要と判断した場合、本規程を変更することがあります。変更後の規程は、本サービス上に掲示した時点から効力を生じます。",
      "既に発生した返金請求については、当該請求の時点で有効であった規程を適用します。",
    ],
  },
];

export default function Page() {
  return (
    <LegalPage
      title="早期退職時返金規程"
      lead="本サービスを通じて採用した方が早期に退職された場合の、成果報酬の返金について定めています。返金には適用条件がありますので、求人登録の前に必ずお読みください。"
      clauses={CLAUSES}
      updatedAt="2026年9月22日"
    />
  );
}
