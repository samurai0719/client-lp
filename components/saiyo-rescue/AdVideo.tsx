"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

/**
 * 縦型の動画広告プレビュー。
 * ・preload="none" ＋ ポスター画像で、画面に入るまで動画を一切読み込まない（表示速度を落とさない）
 * ・半分以上見えている間だけミュートで自動再生し、外れたら止める
 * ・prefers-reduced-motion のときは自動再生せず、タップで再生する
 * ・音声はボタンで切り替え
 */
export default function AdVideo({ src, poster, label }: { src: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.5 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  const toggleSound = () => {
    const video = ref.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
    if (video.paused) video.play().catch(() => {});
  };

  return (
    <div className="sr-advideo">
      <video
        ref={ref}
        className="sr-advideo__video"
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
        onClick={toggleSound}
      />
      <button
        type="button"
        className="sr-advideo__sound"
        onClick={toggleSound}
        aria-label={muted ? "音声をオンにする" : "音声をオフにする"}
      >
        {muted ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}
      </button>
    </div>
  );
}
