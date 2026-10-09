"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { OPERATOR, PATHS, SERVICE, SHOW_NOTICE_NUMBER } from "@/config/driver-company";
import { trackCompany } from "../track";
import { CTA_LABEL } from "./content";
import { CtaButton } from "./ui";

/**
 * ヘッダー。広告流入LPのため、離脱につながるナビゲーションは置かずロゴとCTAだけにする。
 */
export function Header() {
  return (
    <header className="dt-header">
      <div className="dt-header__inner">
        <Link href={PATHS.lp} className="dt-logo" aria-label={`${SERVICE.name} 企業向けトップ`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={SERVICE.logo} alt="" width={640} height={645} className="dt-logo__img" />
          <span className="dt-logo__text">
            <span className="dt-logo__name">{SERVICE.name}</span>
            <span className="dt-logo__sub">運送会社向け ドライバー採用</span>
          </span>
        </Link>
        <CtaButton size="sm" location="header" label="無料で求人掲載" />
      </div>
    </header>
  );
}

/**
 * スマホ下部の固定CTA。
 * FVのCTAが見えている間と、最終CTAが見えている間は隠す（ボタンが二重に見えるため）。
 */
export function StickyCta() {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const targets = ["hero", "final-cta"]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;
    const visible = new Map<Element, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible.set(e.target, e.isIntersecting);
        setHidden([...visible.values()].some(Boolean));
      },
      // FVは下端のCTA付近が画面から外れたら出す
      { rootMargin: "0px 0px -35% 0px" },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <div className={`dt-sticky${hidden ? " is-hidden" : ""}`} aria-hidden={hidden}>
      <Link
        href={PATHS.register}
        className="dt-btn dt-btn--lg dt-sticky__btn"
        tabIndex={hidden ? -1 : 0}
        onClick={() => trackCompany("company_cta_click", { cta_location: "sticky" })}
      >
        <span className="dt-btn__body">
          <span className="dt-sticky__chip">採用できるまで0円</span>
          <span className="dt-btn__label">{CTA_LABEL}</span>
        </span>
        <ArrowRight className="dt-btn__arrow" aria-hidden="true" strokeWidth={2.8} />
      </Link>
    </div>
  );
}

/**
 * フッター。事業者情報は config/driver-company.ts に値が入っている項目だけ表示する
 * （特定募集情報等提供事業の届出受理番号も、正式に受理されて値が入るまで行ごと出さない）。
 */
export function Footer() {
  const rows: [string, string][] = [
    ["事業者名", OPERATOR.name],
    ["屋号", OPERATOR.tradeName],
    ["所在地", OPERATOR.address],
    ["電話番号", OPERATOR.phone],
    ["メールアドレス", OPERATOR.email],
  ];
  if (SHOW_NOTICE_NUMBER) rows.push(["特定募集情報等提供事業届出受理番号", OPERATOR.noticeNumber]);
  const shown = rows.filter(([, v]) => v);

  return (
    <footer className="dt-footer">
      <div className="dt-container">
        <div className="dt-footer__brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={SERVICE.logo} alt={SERVICE.name} width={640} height={645} />
          <p>
            {SERVICE.name}は、ドライバー求人に特化した募集情報等提供サービスです。
            企業から提供された求人情報を求職者へ掲載・提供します。人材紹介サービスではありません。
          </p>
        </div>

        {shown.length > 0 && (
          <dl className="dt-footer__info">
            {shown.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        )}

        <nav className="dt-footer__nav" aria-label="規約・ポリシー">
          <Link href={PATHS.terms}>企業向け利用規約</Link>
          <Link href={PATHS.refundPolicy}>早期退職時返金規程</Link>
          <Link href={PATHS.privacy}>プライバシーポリシー</Link>
          <a href={SERVICE.jobSeekerUrl}>ドライバーとしてお仕事をお探しの方はこちら</a>
        </nav>

        <p className="dt-footer__copy">© 2026 {SERVICE.name} All Rights Reserved.</p>
      </div>
    </footer>
  );
}
