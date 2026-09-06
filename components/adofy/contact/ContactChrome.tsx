"use client";

import { useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { LogoMark } from "../ui";
import { wasSubmitted, clearSubmitted } from "./formState";

/** フォーム入力に集中できる簡易ヘッダー */
export function ContactHeader() {
  return (
    <header className="adf-cheader">
      <div className="adf-cheader__inner">
        <Link href="/adofy" className="adf-logo" aria-label="adofy トップへ">
          <LogoMark className="adf-logo__mark" />
          <span className="adf-logo__text">
            adof<b>y</b>
          </span>
        </Link>
        <span className="adf-cheader__time">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5.5l3.5 2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          入力時間 約1分
        </span>
      </div>
    </header>
  );
}

/**
 * 送信完了ページの本文。
 * 直接開かれた（送信を経ていない）場合は、完了メッセージではなく案内を出す。
 */
export function ThanksBody() {
  /*
    送信済みかどうかは sessionStorage にしかない「ブラウザ側の状態」なので、
    描画時に直接読むと SSR の結果とズレる（hydration error）。
    useSyncExternalStore を使い、サーバーでは "checking"、
    ハイドレーション後にクライアントの実際の値を読む。
  */
  const state = useSyncExternalStore(
    () => () => {},                                  // 購読不要（変化しない）
    () => (wasSubmitted() ? "done" : "direct"),      // クライアント
    () => "checking" as const                        // サーバー
  );

  useEffect(() => {
    // 再読み込みで何度も完了扱いにならないよう、表示後にフラグを破棄する
    if (state === "done") clearSubmitted();
  }, [state]);

  if (state === "checking") {
    // 判定前は文言を出さない（誤った表示を一瞬でも見せない）
    return <div className="adf-thanks__placeholder" aria-hidden="true" />;
  }

  if (state === "direct") {
    return (
      <div className="adf-thanks">
        <div className="adf-thanks__icon adf-thanks__icon--info" aria-hidden="true">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5M12 7.5v.5" />
          </svg>
        </div>
        <h1 className="adf-thanks__title">このページは送信完了後に表示されます</h1>
        <p className="adf-thanks__text">
          無料相談のお申し込みがまだの場合は、相談フォームからお進みください。
          すでに送信済みの場合は、そのままお待ちいただければご連絡いたします。
        </p>
        <div className="adf-thanks__actions">
          <Link href="/contact" className="adf-btn adf-btn--primary">
            無料相談フォームへ
          </Link>
          <Link href="/adofy" className="adf-btn adf-btn--ghost">
            トップページへ戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="adf-thanks">
      <div className="adf-thanks__icon" aria-hidden="true">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12.5 9.5 18 20 6" />
        </svg>
      </div>
      <h1 className="adf-thanks__title">無料相談を受け付けました</h1>
      <p className="adf-thanks__text">
        お問い合わせいただきありがとうございます。
        内容を確認後、ご希望の連絡方法にてご連絡いたします。
      </p>
      <p className="adf-thanks__note">
        ご入力いただいたメールアドレスへ受付確認メールをお送りしています。
        メールが届かない場合は、迷惑メールフォルダもご確認ください。
      </p>
      <div className="adf-thanks__actions">
        <Link href="/adofy" className="adf-btn adf-btn--primary">
          トップページへ戻る
        </Link>
      </div>
    </div>
  );
}
