import { Headset, Lock, UserRound } from "lucide-react";
import type { AnonymousProfile } from "@/lib/driverCandidates/profiles";
import { HIDDEN_FIELDS, SAMPLE_PROFILE } from "./content";
import { Breakable } from "../driver-company/lp/ui";
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
          氏名・連絡先は表示されません。本人の同意なく企業に開示することはありません。
        </p>
        <p className="ds-disclose__note">
          <Headset aria-hidden="true" />
          <Breakable text="ドラテクが|連絡し、|面接の|希望を|確認します" />
        </p>
        <DiscloseButton no={p.no} />
      </div>
    </article>
  );
}

/**
 * 公開中のプロフィールが0件のときに出す、架空の表示イメージ。
 * 実在の登録者と誤認されないよう「表示イメージ（架空）」と明記し、番号も伏せる。
 * ボタンは本物のカードと同じ「この方と面接を希望する」。押すと、表示例のため依頼できない旨と会社の無料登録フォームを出す。
 */
export function SampleProfileCard() {
  return (
    <article className="ds-pcard is-sample" aria-labelledby="ds-pc-sample">
      <header className="ds-pcard__head">
        <span className="ds-pcard__avatar" aria-hidden="true">
          <UserRound />
        </span>
        <div>
          <h2 className="ds-pcard__no" id="ds-pc-sample">
            候補者 No.＊＊＊＊
          </h2>
          <p className="ds-pcard__sample">表示イメージ（架空の例です）</p>
        </div>
      </header>
      <dl className="ds-pcard__rows">
        {SAMPLE_PROFILE.filter(([k]) => k !== "更新日").map(([k, v]) => (
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
          氏名・連絡先は表示されません。本人の同意なく企業に開示することはありません。
        </p>
        <p className="ds-disclose__note">
          <Headset aria-hidden="true" />
          <Breakable text="ドラテクが|連絡し、|面接の|希望を|確認します" />
        </p>
        <DiscloseButton />
      </div>
    </article>
  );
}
