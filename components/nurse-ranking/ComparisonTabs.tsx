"use client";

import { useId, useState, type ReactNode } from "react";
import { destinationName, linkOf, services as defaultServices, tableNotes, type Service } from "@/config/nurse-ranking";
import { ExternalIcon, RankBadge, Rich } from "./ui";

/**
 * タブ付き比較表（サービスを縦に並べる形式）。上部と下部の2か所で使い、タブはそれぞれ独立して動く。
 *   総合         … 転職サイト名／オススメ度／求人数／特徴／詳細
 *   取り扱い求人 … 転職サイト名／求人職種／勤務形態／詳細
 *   サービス内容 … 転職サイト名／対応エリア／相談方法／詳細
 * 「詳細を見る」はページ内のランキング詳細カードへ移動する。サービス名のリンクは公式サイト（外部）へ。
 * 1位の行は金色の枠と淡い黄色の背景で目立たせる。
 */

type TabKey = "overall" | "jobs" | "service";

const TABS: { key: TabKey; label: string }[] = [
  { key: "overall", label: "総合" },
  { key: "jobs", label: "取り扱い求人" },
  { key: "service", label: "サービス内容" },
];

const JOB_BADGE: Record<Service["jobTypes"][number], { ch: string; cls: string }> = {
  正看護師: { ch: "正", cls: "bg-[#e5533d]" },
  准看護師: { ch: "准", cls: "bg-[#ef6fa0]" },
  保健師: { ch: "保", cls: "bg-[#7cb342]" },
  助産師: { ch: "助", cls: "bg-[#3d9be9]" },
};

const WORK_BADGE: Record<Service["workTypes"][number]["kind"], string> = {
  常: "bg-[#4a56a6]",
  日: "bg-[#ef7d3c]",
  夜: "bg-[#7e57c2]",
  非: "bg-[#26a69a]",
  派: "bg-[#8d99a6]",
};

function Badge({ ch, cls }: { ch: string; cls: string }) {
  return (
    <span className={`inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[4px] text-[11px] font-black leading-none text-white ${cls}`} aria-hidden="true">
      {ch}
    </span>
  );
}

/** ◎（二重丸） */
function DoubleCircle() {
  return (
    <svg viewBox="0 0 24 24" className="mx-auto h-7 w-7" aria-label="◎">
      <circle cx="12" cy="12" r="10" fill="none" stroke="#f08a2c" strokeWidth="3" />
      <circle cx="12" cy="12" r="4.8" fill="none" stroke="#f08a2c" strokeWidth="3" />
    </svg>
  );
}

/** 星（小数点以下は部分的に塗る） */
function Stars({ value }: { value: number }) {
  const sid = "st" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <span className="mx-auto flex w-[46px] flex-wrap justify-center min-[640px]:w-auto min-[640px]:flex-nowrap" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, value - i));
        return (
          <svg key={i} viewBox="0 0 20 20" className="h-[15px] w-[15px] min-[640px]:h-5 min-[640px]:w-5">
            <defs>
              <linearGradient id={`${sid}-${i}`}>
                <stop offset={`${fill * 100}%`} stopColor="#f6b71e" />
                <stop offset={`${fill * 100}%`} stopColor="#d6dbe1" />
              </linearGradient>
            </defs>
            <path
              d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 14.9l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8z"
              fill={`url(#${sid}-${i})`}
            />
          </svg>
        );
      })}
    </span>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" />
    </svg>
  );
}

function LineIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M12 3C6.5 3 2 6.6 2 11c0 3.9 3.5 7.2 8.3 7.9.3.1.8.2.9.5.1.3.1.7 0 1l-.1.9c0 .3-.2 1 .9.6 1.1-.5 6-3.5 8.2-6 1.5-1.6 2.2-3.3 2.2-5C22.4 6.6 17.5 3 12 3zM8.3 13.4H6.2c-.3 0-.6-.3-.6-.6V8.6c0-.3.3-.6.6-.6s.6.3.6.6v3.6h1.5c.3 0 .6.3.6.6s-.3.6-.6.6zm2.1-.6c0 .3-.3.6-.6.6s-.6-.3-.6-.6V8.6c0-.3.3-.6.6-.6s.6.3.6.6v4.2zm5 0c0 .3-.2.5-.4.6h-.2c-.2 0-.4-.1-.5-.2l-2.1-2.9v2.5c0 .3-.3.6-.6.6s-.6-.3-.6-.6V8.6c0-.3.2-.5.4-.6h.2c.2 0 .4.1.5.3l2.2 2.9V8.6c0-.3.3-.6.6-.6s.6.3.6.6v4.2zm3.4-2.7c.3 0 .6.3.6.6s-.3.6-.6.6h-1.5v.9h1.5c.3 0 .6.3.6.6s-.3.6-.6.6h-2.1c-.3 0-.6-.3-.6-.6V8.6c0-.3.3-.6.6-.6h2.1c.3 0 .6.3.6.6s-.3.6-.6.6h-1.5v.9h1.5z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

function FaceIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <circle cx="8" cy="8" r="3" />
      <circle cx="16" cy="8" r="3" />
      <path d="M2 19c0-3 2.7-5 6-5s6 2 6 5zM12.5 14.3c1-.2 2.2-.3 3.5-.3 3.3 0 6 2 6 5h-7" />
    </svg>
  );
}

/** 「詳細を見る」（ページ内のランキング詳細カードへ）／ action="official" のときは「公式サイト」（外部） */
function DetailButton({ s, action, href }: { s: Service; action: "detail" | "official"; href: string }) {
  if (action === "official") {
    return (
      <a
        href={href}
        target="_blank"
        rel="nofollow sponsored noopener"
        aria-label={`${destinationName(s, href)}の公式サイト（外部サイト）へ`}
        className="nr-shine flex min-h-[44px] w-full flex-col items-center justify-center rounded-lg bg-gradient-to-b from-[#2fbf5b] to-[#1e9e46] px-0.5 py-1.5 text-center text-[11px] font-black leading-tight text-white shadow-[0_3px_0_#16793a] transition active:translate-y-[2px] active:shadow-[0_1px_0_#16793a] min-[640px]:rounded-full min-[640px]:py-3 min-[640px]:text-[14px]"
      >
        <span className="whitespace-nowrap">
          公式
          <br className="min-[640px]:hidden" />
          サイト
        </span>
        <ExternalIcon className="mt-0.5 h-2.5 w-2.5 min-[640px]:h-3 min-[640px]:w-3" />
      </a>
    );
  }
  return (
    <a
      href={`#rank-${s.rank}`}
      className="nr-shine flex min-h-[44px] w-full flex-col items-center justify-center rounded-lg bg-gradient-to-b from-[#2fbf5b] to-[#1e9e46] px-0.5 py-1.5 text-center text-[11px] font-black leading-tight text-white shadow-[0_3px_0_#16793a] transition active:translate-y-[2px] active:shadow-[0_1px_0_#16793a] min-[640px]:flex-row min-[640px]:gap-1 min-[640px]:rounded-full min-[640px]:py-3 min-[640px]:text-[14px]"
    >
      <span>
        詳細を
        <br className="min-[640px]:hidden" />
        見る
      </span>
      <span className="mt-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white text-[10px] text-[#1e9e46] min-[640px]:mt-0" aria-hidden="true">
        ›
      </span>
    </a>
  );
}

/** 転職サイト名のセル：王冠・サービス名・公式サイトへのリンク */
function NameCell({ s, href }: { s: Service; href: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      {s.rank === 1 && <span className="mb-1 rounded-sm bg-[#e7b416] px-1.5 py-0.5 text-[10px] font-black leading-none text-white">おすすめ</span>}
      <RankBadge rank={s.rank} />
      {s.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={s.logo.src} width={s.logo.width} height={s.logo.height} alt={s.name} className="mt-1 h-auto max-h-[34px] w-[90%] max-w-[92px] object-contain min-[640px]:max-h-[52px] min-[640px]:max-w-[170px]" />
      ) : (
        <span className="mt-1 text-[11.5px] font-black leading-tight text-slate-900 [word-break:keep-all] min-[400px]:text-[12.5px] min-[640px]:text-[16px]">{s.name}</span>
      )}
      <a
        href={href}
        target="_blank"
        rel="nofollow sponsored noopener"
        className="mt-1 text-[11px] text-[#2a6fd6] underline underline-offset-2 min-[640px]:text-[12px]"
        aria-label={`${destinationName(s, href)}の公式サイト（外部サイト）へ`}
      >
        公式サイト
      </a>
    </div>
  );
}

const cell = "border border-[#f3c6d6] px-1.5 py-3 align-middle min-[640px]:px-3 min-[640px]:py-4";
const head = "border border-[#f3c6d6] bg-[#fff1f5] px-1 py-2 text-center text-[11px] font-bold text-[#a8335f] min-[640px]:text-[13px]";

function Row({ s, children, action, href }: { s: Service; children: ReactNode; action: "detail" | "official"; href: string }) {
  const first = s.rank === 1;
  return (
    <tr className={first ? "bg-[#fffbe6] outline outline-[3px] -outline-offset-[3px] outline-[#e7b416]" : ""}>
      <th scope="row" className={`${cell} !px-0.5 font-normal min-[640px]:!px-3`}>
        <NameCell s={s} href={href} />
      </th>
      {children}
      <td className={cell}>
        <DetailButton s={s} action={action} href={href} />
      </td>
    </tr>
  );
}

export default function ComparisonTabs({
  caption,
  list,
  notes = tableNotes,
  links,
  action = "detail",
  tabLabels,
}: {
  caption: string;
  /** LPごとの広告リンク（サービスid → URL）。無いサービスは設定ファイルの広告リンク→公式トップ */
  links?: Record<string, string>;
  /** 最終列のボタン："detail"=ページ内の詳細へ／"official"=公式サイトへ */
  action?: "detail" | "official";
  /** タブ名の上書き（例：取扱求人） */
  tabLabels?: Partial<Record<TabKey, string>>;
  /** 掲載する会社（省略時はランキングページの3社） */
  list?: Service[];
  /** 表の下の注記（省略時はランキングページ用） */
  notes?: string[];
}) {
  const services = list ?? defaultServices;
  const hrefOf = (s: Service) => links?.[s.id] ?? linkOf(s);
  const lastHead = action === "official" ? (
    <>
      公式
      <br className="min-[640px]:hidden" />
      サイト
    </>
  ) : (
    "詳細"
  );
  const [tab, setTab] = useState<TabKey>("overall");
  const uid = useId();

  return (
    <div>
      <div role="tablist" aria-label={`${caption}の切り替え`} className="flex items-end gap-1.5 min-[640px]:gap-3">
        {TABS.map((t) => {
          const active = t.key === tab;
          return (
            <button
              key={t.key}
              type="button"
              role="tab"
              id={`${uid}-tab-${t.key}`}
              aria-selected={active}
              aria-controls={`${uid}-panel`}
              onClick={() => setTab(t.key)}
              className={`relative flex-1 rounded-t-xl px-1 text-[13px] font-black transition min-[400px]:text-[14px] min-[640px]:text-[17px] ${
                active
                  ? "border-t-[3px] border-[#e8437a] bg-white py-3 text-[#e8437a] min-[640px]:py-4"
                  : "bg-gradient-to-b from-[#f7a8c4] to-[#e8437a] py-2.5 text-white shadow-[inset_0_-2px_0_rgba(0,0,0,0.08)] hover:brightness-105 min-[640px]:py-3.5"
              }`}
            >
              {tabLabels?.[t.key] ?? t.label}
              {active && (
                <span className="absolute bottom-1 left-1/2 h-0 w-0 -translate-x-1/2 border-x-[6px] border-t-[6px] border-x-transparent border-t-[#e8437a]" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>

      <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${tab}`} className="overflow-x-auto bg-white px-0 pb-1 pt-3 min-[640px]:px-4 min-[640px]:pt-5">
        <table className="w-full min-w-[351px] table-fixed border-collapse text-left">
          <caption className="sr-only">
            {caption}（{tabLabels?.[tab] ?? TABS.find((t) => t.key === tab)?.label}）
          </caption>

          {tab === "overall" && (
            <>
              <colgroup>
                <col className="w-[25%]" />
                <col className="w-[17%]" />
                <col className="w-[17%]" />
                <col />
                <col className={action === "official" ? "w-[17%]" : "w-[15%]"} />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col" className={head}>転職<br className="min-[640px]:hidden" />サイト名</th>
                  <th scope="col" className={`${head} whitespace-nowrap !px-0 text-[10px]`}>オススメ度</th>
                  <th scope="col" className={head}>求人数</th>
                  <th scope="col" className={head}>特徴</th>
                  <th scope="col" className={head}>{lastHead}</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <Row key={s.id} s={s} action={action} href={hrefOf(s)}>
                    <td className={`${cell} text-center`}>
                      <Stars value={s.rating} />
                      <span className="sr-only">オススメ度 5点中{s.rating}点（当サイト独自の評価）</span>
                      <p className="mt-0.5 text-[18px] font-black leading-none text-[#e5533d] underline decoration-2 underline-offset-2 min-[640px]:text-[26px]" aria-hidden="true">
                        {s.rating.toFixed(1)}
                      </p>
                    </td>
                    <td className={`${cell} text-center`}>
                      {s.jobCount.mark !== false && <DoubleCircle />}
                      <p className={`mt-1 font-bold leading-tight min-[640px]:text-[15px] ${s.jobCount.mark === false ? "text-[11px] text-slate-500" : "text-[11px] text-slate-800"}`}>
                        {s.jobCount.value}
                        <span className="align-top text-[9px] font-normal text-slate-400">{s.jobCount.note}</span>
                      </p>
                    </td>
                    <td className={`${cell} text-center text-[11px] leading-relaxed text-slate-700 min-[640px]:text-[14px]`}>
                      <Rich text={s.tableFeature} />
                    </td>
                  </Row>
                ))}
              </tbody>
            </>
          )}

          {tab === "jobs" && (
            <>
              <colgroup>
                <col className="w-[25%]" />
                <col className="w-[30%]" />
                <col />
                <col className={action === "official" ? "w-[17%]" : "w-[15%]"} />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col" className={head}>転職<br className="min-[640px]:hidden" />サイト名</th>
                  <th scope="col" className={head}>求人職種</th>
                  <th scope="col" className={head}>勤務形態</th>
                  <th scope="col" className={head}>{lastHead}</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <Row key={s.id} s={s} action={action} href={hrefOf(s)}>
                    <td className={cell}>
                      <ul className="space-y-1">
                        {s.jobTypes.map((j) => (
                          <li key={j} className="flex items-center gap-1 whitespace-nowrap text-[12px] text-slate-800 min-[640px]:gap-1.5 min-[640px]:text-[15px]">
                            <Badge ch={JOB_BADGE[j].ch} cls={JOB_BADGE[j].cls} />
                            {j}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className={cell}>
                      <ul className="space-y-1">
                        {s.workTypes.map((w) => (
                          <li key={w.label} className="flex items-start gap-1.5 text-[11px] leading-tight text-slate-800 min-[640px]:text-[14px]">
                            <Badge ch={w.kind} cls={WORK_BADGE[w.kind]} />
                            <span className="pt-[2px]">{w.label}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  </Row>
                ))}
              </tbody>
            </>
          )}

          {tab === "service" && (
            <>
              <colgroup>
                <col className="w-[25%]" />
                <col />
                <col />
                <col className={action === "official" ? "w-[17%]" : "w-[15%]"} />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col" className={head}>転職<br className="min-[640px]:hidden" />サイト名</th>
                  <th scope="col" className={head}>対応エリア</th>
                  <th scope="col" className={head}>相談方法</th>
                  <th scope="col" className={head}>{lastHead}</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <Row key={s.id} s={s} action={action} href={hrefOf(s)}>
                    <td className={`${cell} text-center`}>
                      <DoubleCircle />
                      <p className="mt-1 text-[13px] font-bold text-slate-800 min-[640px]:text-[16px]">{s.area}</p>
                    </td>
                    <td className={`${cell} text-center`}>
                      <ul className="inline-flex flex-col items-start gap-1.5">
                        {s.consultMethods.map((m) => (
                          <li
                            key={m}
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[12px] font-bold text-white min-[640px]:text-[14px] ${
                              { LINE: "bg-[#06c755]", 電話: "bg-[#e8437a]", メール: "bg-[#3d8bd9]", 対面: "bg-[#8e6ac8]" }[m]
                            }`}
                          >
                            {m === "LINE" ? <LineIcon /> : m === "電話" ? <PhoneIcon /> : m === "メール" ? <MailIcon /> : <FaceIcon />}
                            {m}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </Row>
                ))}
              </tbody>
            </>
          )}
        </table>
      </div>
      <div className="mt-2 space-y-0.5 text-[10.5px] leading-relaxed text-slate-500 min-[640px]:text-[11px]">
        {notes.map((n) => (
          <p key={n}>{n}</p>
        ))}
      </div>
    </div>
  );
}
