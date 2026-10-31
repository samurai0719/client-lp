import type { ReactNode } from "react";
import { EntryFooter, EntryHeader } from "./parts";

export type Clause = { heading: string; body: (string | string[])[] };

/** 求職者向けの規約ページ（利用規約・個人情報の取り扱い）の共通レイアウト */
export default function LegalPage({
  title,
  lead,
  clauses,
  updatedAt,
  children,
}: {
  title: string;
  lead: string;
  clauses?: Clause[];
  updatedAt?: string;
  children?: ReactNode;
}) {
  return (
    <div className="se-shell">
      <div className="se-card">
        <EntryHeader href="/shokunin-entry" />
        <main className="se-legal">
          <h1>{title}</h1>
          <p>{lead}</p>
          {clauses?.map((c, i) => (
            <section key={c.heading}>
              <h2>
                第{i + 1}条（{c.heading}）
              </h2>
              {c.body.map((b, j) =>
                Array.isArray(b) ? (
                  <ul key={j}>
                    {b.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p key={j}>{b}</p>
                ),
              )}
            </section>
          ))}
          {children}
          {updatedAt && <p className="se-legal__date">制定日：{updatedAt}</p>}
        </main>
        <EntryFooter />
      </div>
    </div>
  );
}
