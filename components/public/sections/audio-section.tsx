"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Music, Heart } from "lucide-react";
import type { SectionProps, AudioContent, AudioTrack, ThemeData } from "@/lib/types";
import { SectionContainer, EmptySectionFallback } from "./primitives";
import { useConvexQueryUrl } from "./audio-utils";
import { Reveal, MatIcon } from "../shared-primitives";

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function TrackCover({
  track,
  size = "large",
  theme,
}: {
  track: AudioTrack;
  size?: "large" | "small";
  theme: ThemeData;
}) {
  const coverUrl = useConvexQueryUrl(track.coverImage);
  const dim = size === "large" ? "w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56" : "w-10 h-10 sm:w-12 sm:h-12";

  if (!coverUrl && !track.coverImage) {
    return (
      <div
        className={`${dim} rounded-[2rem] flex items-center justify-center shrink-0`}
        style={{ backgroundColor: theme.colors.border }}
      >
        <Heart
          className="text-red-400"
          style={{ width: size === "large" ? 48 : 20, height: size === "large" ? 48 : 20 }}
          fill="currentColor"
        />
      </div>
    );
  }

  return (
    <img
      alt={track.title ? `${track.title} cover` : "Album cover"}
      className={`${dim} rounded-[2rem] object-cover shrink-0`}
      src={coverUrl || track.coverImage}
    />
  );
}

export function AudioSection({ content, theme }: SectionProps) {
  const c = content as AudioContent;
  const audioRef = useRef<HTMLAudioElement>(null);

  const enabledTracks = c.tracks.filter(
    (t) => t.enabled && (t.storageId || t.url)
  );

  const defaultTrack = c.tracks.find((t) => t.id === c.defaultTrackId);

  const [currentTrackId, setCurrentTrackId] = useState<string | null>(
    defaultTrack?.id || enabledTracks[0]?.id || null
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState(false);

  const currentTrack = enabledTracks.find((t) => t.id === currentTrackId) || null;

  const currentIndex = currentTrack
    ? enabledTracks.findIndex((t) => t.id === currentTrack.id)
    : -1;

  const currentAudioUrl = useConvexQueryUrl(
    currentTrack?.storageId || currentTrack?.url
  );

  const hasTracks = enabledTracks.length > 0;

  const play = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    el.play().catch(() => setIsPlaying(false));
  }, [setIsPlaying]);

  const pause = useCallback(() => {
    const el = audioRef.current;
    if (el) {
      el.pause();
      setIsPlaying(false);
    }
  }, [setIsPlaying]);

  const togglePlay = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, play, pause]);

  const playTrack = useCallback(
    (track: AudioTrack) => {
      setCurrentTrackId(track.id);
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setAudioError(false);
      requestAnimationFrame(() => {
        const el = audioRef.current;
        if (el) {
          el.currentTime = 0;
          el.play().catch(() => {});
        }
      });
    },
    [setCurrentTrackId, setIsPlaying, setCurrentTime, setDuration, setAudioError]
  );

  const nextTrack = useCallback(() => {
    if (enabledTracks.length === 0) return;
    const nextIndex =
      currentIndex < enabledTracks.length - 1 ? currentIndex + 1 : 0;
    playTrack(enabledTracks[nextIndex]);
  }, [currentIndex, enabledTracks, playTrack]);

  const prevTrack = useCallback(() => {
    if (enabledTracks.length === 0) return;
    const el = audioRef.current;
    if (el && el.currentTime > 3) {
      el.currentTime = 0;
      setCurrentTime(0);
      return;
    }
    const prevIndex =
      currentIndex > 0 ? currentIndex - 1 : enabledTracks.length - 1;
    playTrack(enabledTracks[prevIndex]);
  }, [currentIndex, enabledTracks, playTrack, setCurrentTime]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const onTimeUpdate = () => setCurrentTime(el.currentTime);
    const onDurationChange = () => setDuration(el.duration);
    const onEnded = () => {
      if (c.loop || currentIndex < enabledTracks.length - 1) {
        nextTrack();
      } else {
        setIsPlaying(false);
      }
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onError = () => setAudioError(true);

    el.addEventListener("timeupdate", onTimeUpdate);
    el.addEventListener("durationchange", onDurationChange);
    el.addEventListener("ended", onEnded);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("error", onError);

    return () => {
      el.removeEventListener("timeupdate", onTimeUpdate);
      el.removeEventListener("durationchange", onDurationChange);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("error", onError);
    };
  }, [c.loop, currentIndex, enabledTracks.length, nextTrack]);

  useEffect(() => {
    if (c.autoplay && currentTrack && audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  }, [c.autoplay, currentTrack]);

  if (!hasTracks) {
    return (
      <SectionContainer theme={theme}>
        <EmptySectionFallback message="No audio tracks configured" />
      </SectionContainer>
    );
  }

  return (
    <section className="py-20 md:py-32 px-4 md:px-6 bg-surface relative overflow-hidden" id="playlist">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] md:w-[800px] md:h-[800px] bg-primary-fixed/20 rounded-full blur-[60px] md:blur-[100px] -z-10" />
      <div className="max-w-2xl mx-auto text-center relative z-10">
        <audio
          ref={audioRef}
          src={currentAudioUrl || undefined}
          preload="metadata"
          loop={false}
          className="hidden"
        />
        <Reveal>
          <div className="festive-glass-strong p-6 sm:p-8 md:p-10 lg:p-12 rounded-[3rem] shadow-[0_20px_60px_rgba(244,172,183,0.2)] border border-primary-fixed/30 group">
            {c.playlistTitle && (
              <h2 className="font-headline-sm text-secondary tracking-widest uppercase text-xs sm:text-sm mb-6 md:mb-10">{c.playlistTitle}</h2>
            )}
            
            {currentTrack && (
              <>
                <div className="w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 mx-auto rounded-full overflow-hidden shadow-[0_10px_30px_rgba(244,172,183,0.3)] mb-6 md:mb-10 relative group-hover:scale-105 transition-transform duration-700">
                  <div className={`w-full h-full object-cover ${isPlaying ? 'animate-[spin_20s_linear_infinite]' : ''}`}>
                    <TrackCover track={currentTrack} size="large" theme={theme} />
                  </div>
                  <div className="absolute inset-0 border-4 border-surface/50 rounded-full" />
                </div>

                <h3 className="font-headline-md text-2xl sm:text-3xl md:text-3xl text-primary font-['Epilogue'] mb-1.5 md:mb-2">{currentTrack.title || "Untitled"}</h3>
                <p className="font-body-md text-on-surface-variant mb-6 md:mb-10 text-sm sm:text-base">{currentTrack.artist || "Unknown Artist"}</p>
              </>
            )}

            {c.showProgressBar && (
              <div className="w-full bg-surface-container h-1.5 rounded-full mb-6 md:mb-8 relative cursor-pointer" onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = ((e.clientX - rect.left) / rect.width);
                if (audioRef.current && duration) {
                   audioRef.current.currentTime = pos * duration;
                   setCurrentTime(pos * duration);
                }
              }}>
                <div className="bg-primary h-full rounded-full relative transition-all duration-200" style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : "0%" }}>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 bg-primary border-2 border-surface rounded-full shadow-md scale-0 group-hover:scale-100 transition-transform" />
                </div>
              </div>
            )}

            {c.showPlayer && (
              <div className="flex justify-center items-center gap-4 sm:gap-6 md:gap-8">
                <button className="text-on-surface-variant hover:text-primary transition-colors" onClick={prevTrack}>
                  <MatIcon name="skip_previous" className="text-2xl sm:text-3xl" decorative />
                </button>
                <button 
                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-primary text-on-primary flex items-center justify-center hover:scale-110 hover:shadow-[0_10px_20px_rgba(135,78,88,0.3)] transition-all duration-300"
                  onClick={togglePlay}
                >
                  <MatIcon name={isPlaying ? "pause" : "play_arrow"} className="text-3xl sm:text-4xl ml-1" decorative />
                </button>
                <button className="text-on-surface-variant hover:text-primary transition-colors" onClick={nextTrack}>
                  <MatIcon name="skip_next" className="text-2xl sm:text-3xl" decorative />
                </button>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
