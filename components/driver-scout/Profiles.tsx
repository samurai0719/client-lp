import { Lock, UserRound } from "lucide-react";
import type { AnonymousProfile } from "@/lib/driverCandidates/profiles";
import { HIDDEN_FIELDS } from "./content";
import { DiscloseButton } from "./ui";

/**
 * 匿名プロフィールのカード一覧（/driver/scout/profiles）。
 * 個人を特定できる情報はデータとして受け取っていない。伏せ字の欄は見た目だけのダミー。
 */

const dateFmt = new Intl.DateTimeFormat("ja-JP", { timeZone: "Asia/Tokyo", month: "numeric", day: "numeric" });

export function ProfileCard({ p }: { p: AnonymousProfile }) {
  const rows: [string, string | null][] = [
    ["年齢", p.ageBand],
    ["希望勤務地", p.area],
    ["希望年収帯", p.salaryBand],
    ["免許・資格", p.licenses.join("・") || null],
    ["運転経験", p.experience],
    ["希望職種", p.jobTypes.join("・") || null],
    ["転職希望時期", p.changeTiming],
    ["更新日", dateFmt.format(new Date(p.updatedAt))],
  ];
  return (
    <article className="ds-pcard" aria-labelledby={`ds-pc-${p.no}`}>
      <header className="ds-pcard__head">
        <span className="ds-pcard__avatar" aria-hidden="true">
          <UserRound />
        </span>
        <div>
          <h2 className="ds-pcard__no" id={`ds-pc-${p.no}`}>
            候補者 No.{p.no}
          </h2>
          <p className="ds-pcard__tag">連絡を待っています</p>
        </div>
      </header>

      <dl className="ds-pcard__rows">
        {rows
          .filter((r): r is [string, string] => Boolean(r[1]))
          .map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
      </dl>

      <div className="ds-disclose">
        <dl className="ds-disclose__masked" aria-label="非公開の情報">
          {HIDDEN_FIELDS.map((f) => (
            <div key={f}>
              <dt>{f}</dt>
              <dd aria-hidden="true">●●●●●●</dd>
            </div>
          ))}
        </dl>
        <p className="ds-disclose__lock">
          <Lock aria-hidden="true" />
          連絡先は、候補者本人が貴社と求人内容を確認し、同意した場合にだけ開示されます。
        </p>
        <DiscloseButton no={p.no} />
      </div>
    </article>
  );
}
