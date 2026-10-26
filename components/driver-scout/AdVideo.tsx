"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

/** 再生するのは最初の5秒だけ（それより長い動画に差し替えても、5秒で頭に戻る） */
const PLAY_SECONDS = 5;

/**
 * 縦型の動画広告プレビュー（採用レスキューLPの AdVideo と同じ作り）。
 * ・preload="none" ＋ ポスター画像で、画面に入るまで動画を読み込まない（表示速度を落とさない）
 * ・半分以上見えている間だけミュートで自動再生し、外れたら止める
 * ・最初の5秒だけをくり返す
 * ・「動きを減らす」設定のときは自動再生せず、タップで再生する
 */
export default function AdVideo({ src, poster, label }: { src: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const limit = () => {
      if (video.currentTime >= PLAY_SECONDS) {
        video.currentTime = 0;
        if (!video.paused) video.play().catch(() => {});
      }
    };
    video.addEventListener("timeupdate", limit);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => video.removeEventListener("timeupdate", limit);
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.5 },
    );
    io.observe(video);
    return () => {
      io.disconnect();
      video.removeEventListener("timeupdate", limit);
    };
  }, []);

  const toggleSound = () => {
    const video = ref.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
    if (video.paused) video.play().catch(() => {});
  };

  return (
    <div className="ds-advideo">
      <video
        ref={ref}
        className="ds-advideo__video"
        src={`${src}#t=0,${PLAY_SECONDS}`}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
        onClick={toggleSound}
      />
      <button type="button" className="ds-advideo__sound" onClick={toggleSound} aria-label={muted ? "音声をオンにする" : "音声をオフにする"}>
        {muted ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}
      </button>
    </div>
  );
}
