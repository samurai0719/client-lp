"use client";

import { useId, useState } from "react";
import { Rich } from "../driver-company/lp/ui";

/**
 * よくある質問（開閉式）。押すと回答の高さが滑らかに変わり、＋が－になる。
 * 高さの変化は CSS の grid-template-rows（0fr → 1fr）で付ける。
 * JSが動かなくても読めるよう、最初の1問は開いた状態で描画する。
 */
export default function FaqList({ items }: { items: { q: string; a: string[] }[] }) {
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]));
  const base = useId();

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <div className="lp-faq">
      {items.map((f, i) => {
        const isOpen = open.has(i);
        const id = `${base}-${i}`;
        return (
          <div key={f.q} className={`lp-faq__item${isOpen ? " is-open" : ""}`}>
            <h3>
              <button type="button" className="lp-faq__q" aria-expanded={isOpen} aria-controls={id} onClick={() => toggle(i)}>
                <span className="lp-faq__mark" aria-hidden="true">
                  Q.
                </span>
                <span className="lp-faq__qt">{f.q}</span>
                <span className="lp-faq__icon" aria-hidden="true" />
              </button>
            </h3>
            <div className="lp-faq__panel" id={id} role="region" inert={!isOpen}>
              <div className="lp-faq__inner">
                {f.a.map((p) => (
                  <p key={p}>
                    <Rich text={p} />
                  </p>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
