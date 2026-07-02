"use client";

import { useState, type ReactNode } from "react";
import { Sprout } from "lucide-react";
import { CHAT_AGENT_IMAGE, CHAT_AGENT_NAME } from "./agent";

// ─── 案内役アイコン ──────────────────────────────────────────────────
// 画像が未配置・読み込み失敗でも崩れないよう、丸背景＋アイコンにフォールバックする。
export function ChatAvatar() {
  const [failed, setFailed] = useState(false);

  return (
    <span
      className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-[#eaf3ee] border border-[#cfe3d6] shrink-0"
      aria-hidden="true"
    >
      {!failed ? (
        // eslint-disable-next-line @next/next/no-img-element -- 48px固定の小画像のため最適化不要
        <img
          src={CHAT_AGENT_IMAGE}
          alt=""
          width={56}
          height={56}
          className="w-full h-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <Sprout className="w-5 h-5 text-[#1f4d3d]" aria-hidden="true" />
      )}
    </span>
  );
}

// ─── 案内役の吹き出し ────────────────────────────────────────────────
export function BotMessage({
  children,
  showName = false,
}: {
  children: ReactNode;
  showName?: boolean;
}) {
  return (
    <div className="gd-chat-appear flex items-start gap-2 sm:gap-2.5">
      <ChatAvatar />
      <div className="min-w-0 max-w-[85%]">
        {showName && (
          <p className="mb-0.5 text-[10px] font-semibold text-[#8a9a90]">{CHAT_AGENT_NAME}</p>
        )}
        <div className="rounded-2xl rounded-tl-md border border-[#e7e3d8] bg-white px-3.5 py-2.5 text-[13px] sm:text-[14px] leading-relaxed text-[#10302a] whitespace-pre-line">
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── ユーザーの吹き出し ──────────────────────────────────────────────
export function UserMessage({ lines }: { lines: string[] }) {
  const shown = lines.filter((line) => line.trim().length > 0);
  if (shown.length === 0) return null;

  return (
    <div className="gd-chat-appear flex justify-end">
      <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-[#1f4d3d] px-3.5 py-2.5 text-[13px] sm:text-[14px] leading-relaxed text-white">
        {shown.map((line, i) => (
          <p key={`${i}-${line}`}>{line}</p>
        ))}
      </div>
    </div>
  );
}

// ─── 入力中インジケーター ────────────────────────────────────────────
export function TypingBubble() {
  return (
    <div className="gd-chat-appear flex items-start gap-2 sm:gap-2.5" aria-label="次の質問を準備しています">
      <ChatAvatar />
      <div className="rounded-2xl rounded-tl-md border border-[#e7e3d8] bg-white px-3.5 py-3">
        <span className="gd-typing-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </div>
    </div>
  );
}
