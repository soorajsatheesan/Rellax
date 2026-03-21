"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Slide = {
  title: string;
  focus?: string;
  bullets: string[];
  speakerNotes: string;
  narration: string;
  takeaway?: string;
  visualCue?: string;
  imageUrl?: string;
  imageSourceUrl?: string;
  imageCaption?: string;
  layoutVariant?: string;
  approxDurationSec: number;
  audioUrl?: string;
  audioChunks?: string[];
};

type Props = {
  slides: Slide[];
};

const SPEEDS = [1, 1.25, 1.5, 2] as const;

// ── Keyframe animations injected once ────────────────────────────────────────
const STYLE_ID = "rellax-player-styles";
const CSS = `
@keyframes rellax-bar1 { 0%,100%{height:4px} 50%{height:14px} }
@keyframes rellax-bar2 { 0%,100%{height:8px} 50%{height:18px} }
@keyframes rellax-bar3 { 0%,100%{height:6px} 50%{height:12px} }
@keyframes rellax-bar4 { 0%,100%{height:10px} 50%{height:16px} }
@keyframes rellax-pulse { 0%,100%{opacity:.75;transform:scale(1)} 50%{opacity:1;transform:scale(1.06)} }
`;
function injectStyles() {
  if (typeof document !== "undefined" && !document.getElementById(STYLE_ID)) {
    const s = document.createElement("style");
    s.id = STYLE_ID;
    s.textContent = CSS;
    document.head.appendChild(s);
  }
}

// ── Audio wave bars (shown inside thumbnail when playing) ─────────────────────
// ── Dot grid background pattern for the visual thumbnail ──────────────────────
function DotGrid() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage:
          "radial-gradient(circle, rgba(61,107,79,0.35) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
        pointerEvents: "none",
      }}
    />
  );
}

function SlideImage({
  slide,
  compact = false,
}: {
  slide: Slide;
  compact?: boolean;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const proxiedImageUrl = slide.imageUrl
    ? slide.imageUrl.startsWith("/")
      ? slide.imageUrl
      : `/api/image-proxy?url=${encodeURIComponent(slide.imageUrl)}${slide.imageSourceUrl ? `&source=${encodeURIComponent(slide.imageSourceUrl)}` : ""}&title=${encodeURIComponent(slide.title)}&caption=${encodeURIComponent(slide.imageCaption || slide.visualCue || slide.title)}`
    : "";

  if (slide.imageUrl && !imageFailed) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: compact ? "0.95rem" : "1rem",
            aspectRatio: "16 / 9",
            minHeight: compact ? "220px" : "260px",
            border: "1px solid rgba(19,28,33,0.08)",
            background: "#e8ece8",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={proxiedImageUrl}
            alt={slide.imageCaption || slide.title}
            onError={() => setImageFailed(true)}
            style={{
              width: "100%",
              height: "100%",
              minHeight: compact ? "220px" : "260px",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.75rem",
            flexWrap: "wrap",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "var(--db-text-soft)",
              fontSize: "0.8rem",
              lineHeight: 1.5,
              flex: 1,
            }}
          >
            {slide.imageCaption || slide.visualCue || slide.title}
          </p>
          {slide.imageSourceUrl ? (
            <a
              href={slide.imageSourceUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                color: "var(--rellax-sage)",
                fontSize: "0.68rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontFamily: "var(--font-mono)",
                textDecoration: "none",
              }}
            >
              Source
            </a>
          ) : null}
        </div>
      </div>
    );
  }

  return <SlideVisual slide={slide} />;
}

function getLayoutVariant(slide: Slide) {
  if (
    slide.layoutVariant === "media-right" ||
    slide.layoutVariant === "hero-top" ||
    slide.layoutVariant === "focus-split"
  ) {
    return slide.layoutVariant;
  }

  return "media-left";
}

// ── Left visual thumbnail — the "video" frame for each slide ──────────────────
function SlideVisual({
  slide,
}: {
  slide: Slide;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", height: "100%" }}>
      <div
        style={{
          position: "relative",
          background:
            "radial-gradient(circle at top, rgba(61,107,79,0.35), transparent 48%), linear-gradient(150deg, #0b0d10 0%, #111722 52%, #0b0d10 100%)",
          borderRadius: "1rem",
          overflow: "hidden",
          aspectRatio: "16/9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 18px 36px rgba(0,0,0,0.22)",
          minHeight: "260px",
        }}
      >
        <DotGrid />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.08) 38%, rgba(0,0,0,0.5) 100%)",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "left",
            padding: "1.35rem",
            width: "100%",
            alignSelf: "stretch",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            height: "100%",
          }}
        >
          <p
            style={{
              color: "#fff",
              fontWeight: 800,
              fontSize: "clamp(1rem, 2vw, 1.55rem)",
              lineHeight: 1.08,
              margin: 0,
              textShadow: "0 2px 12px rgba(0,0,0,0.6)",
              maxWidth: "18ch",
            }}
          >
            {slide.title}
          </p>
        </div>

      </div>
    </div>
  );
}

// ── Right content area ────────────────────────────────────────────────────────
function SlideContent({ slide }: { slide: Slide }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", height: "100%" }}>
      <div>
        <h3
          style={{
            color: "#131c21",
            fontWeight: 800,
            fontSize: "clamp(1rem, 1.6vw, 1.3rem)",
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {slide.focus || "Key Points"}
        </h3>
      </div>

      <ul
        style={{
          margin: 0,
          padding: 0,
          listStyle: "none",
          display: "flex",
          flexDirection: "column",
          gap: "0.7rem",
        }}
      >
        {slide.bullets.map((b, i) => (
          <li key={i} style={{ display: "flex", gap: "0.7rem", alignItems: "flex-start" }}>
            <span
              style={{
                width: "1.4rem",
                height: "1.4rem",
                borderRadius: "999px",
                background: "rgba(61,107,79,0.12)",
                border: "1px solid rgba(61,107,79,0.24)",
                color: "#3d6b4f",
                fontWeight: 800,
                fontSize: "0.72rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {i + 1}
            </span>
            <span
              style={{
                color: "#4f5b66",
                fontSize: "clamp(0.84rem, 1.1vw, 0.96rem)",
                lineHeight: 1.65,
              }}
            >
              {b}
            </span>
          </li>
        ))}
      </ul>

      {/* Takeaway highlight box — gold from design system */}
      {slide.takeaway && (
        <div
          style={{
            background: "linear-gradient(180deg, #fff8ea 0%, #f8efd9 100%)",
            border: "1px solid rgba(156,122,60,0.28)",
            borderRadius: "0.9rem",
            padding: "1rem 1rem 0.95rem",
            marginTop: "auto",
          }}
        >
          <p
            style={{
              color: "#9c7a3c",
              fontWeight: 700,
              fontSize: "0.62rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              margin: "0 0 0.22rem",
              textAlign: "center",
            }}
          >
            Key Takeaway
          </p>
          <p
            style={{
              color: "#9c7a3c",
              fontSize: "clamp(0.84rem, 1.08vw, 0.96rem)",
              margin: 0,
              lineHeight: 1.55,
              textAlign: "left",
            }}
          >
            {slide.takeaway}
          </p>
        </div>
      )}
    </div>
  );
}

// ── White slide card ──────────────────────────────────────────────────────────
function SlideCard({
  slide,
}: {
  slide: Slide;
}) {
  return (
    <div
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(250,247,241,0.98))",
        borderRadius: "1.2rem",
        boxShadow: "0 30px 70px rgba(0,0,0,0.16)",
        border: "1px solid rgba(19,28,33,0.08)",
        padding: "clamp(1rem, 2.6vw, 1.5rem)",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        margin: "0 clamp(0.5rem, 1.2vw, 1rem)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
        <h2
          style={{
            color: "#131c21",
            fontWeight: 800,
            fontSize: "clamp(1.15rem, 2vw, 1.6rem)",
            margin: 0,
            lineHeight: 1.1,
            fontFamily: "var(--font-display)",
            maxWidth: "28ch",
          }}
        >
          {slide.title}
        </h2>
      </div>

      <div
        style={{
          height: "2px",
          background: "var(--rellax-sage)",
          borderRadius: "1px",
          opacity: 0.7,
        }}
      />

      {getLayoutVariant(slide) === "media-right" ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 1.05fr)",
            gap: "clamp(1rem, 2vw, 1.5rem)",
            alignItems: "start",
          }}
        >
          <SlideContent slide={slide} />
          <SlideImage slide={slide} />
        </div>
      ) : getLayoutVariant(slide) === "hero-top" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          <SlideImage slide={slide} compact />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.2fr) minmax(260px, 0.8fr)",
              gap: "1rem",
              alignItems: "start",
            }}
          >
            <SlideContent slide={slide} />
            {slide.focus ? (
              <div
                style={{
                  background: "linear-gradient(180deg, rgba(61,107,79,0.08), rgba(61,107,79,0.02))",
                  borderRadius: "0.9rem",
                  padding: "1rem",
                  border: "1px solid rgba(61,107,79,0.2)",
                  color: "#4f5b66",
                  fontSize: "0.95rem",
                  lineHeight: 1.7,
                  fontStyle: "italic",
                }}
              >
                {slide.focus}
              </div>
            ) : null}
          </div>
        </div>
      ) : getLayoutVariant(slide) === "focus-split" ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(260px, 0.85fr) minmax(0, 1.15fr)",
            gap: "1rem",
            alignItems: "stretch",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <SlideImage slide={slide} compact />
            {slide.focus ? (
              <div
                style={{
                  background: "#f4efe4",
                  border: "1px solid rgba(19,28,33,0.08)",
                  borderRadius: "0.9rem",
                  padding: "1rem",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color: "#6f7781",
                    fontSize: "0.62rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  Core idea
                </p>
                <p
                  style={{
                    margin: "0.55rem 0 0",
                    color: "#131c21",
                    fontSize: "1rem",
                    lineHeight: 1.7,
                    fontWeight: 600,
                  }}
                >
                  {slide.focus}
                </p>
              </div>
            ) : null}
          </div>
          <SlideContent slide={slide} />
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(280px, 1.05fr) minmax(0, 1fr)",
            gap: "clamp(1rem, 2vw, 1.5rem)",
            alignItems: "start",
          }}
        >
          <SlideImage slide={slide} />
          <SlideContent slide={slide} />
        </div>
      )}
    </div>
  );
}

// ── Main video player ─────────────────────────────────────────────────────────
export function ModuleVideoPlayer({ slides }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  // Stable refs (never cause stale closures)
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeIdxRef = useRef(0);
  const playingRef = useRef(false);
  const slidesRef = useRef(slides);
  const rafRef = useRef<number | null>(null);
  const chunkIdxRef = useRef(0);
  const speechActiveRef = useRef(false);
  const onEndedRef = useRef<() => void>(() => undefined);

  useEffect(() => { slidesRef.current = slides; }, [slides]);

  // Render state
  const [displayIdx, setDisplayIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [ended, setEnded] = useState(false);
  const [speed, setSpeed] = useState<(typeof SPEEDS)[number]>(1);
  const [playbackMode, setPlaybackMode] = useState<"tts" | "speech" | "silent">("silent");
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const hasGeneratedAudio = slides.some(
    (s) => (s.audioChunks?.length ?? 0) > 0 || Boolean(s.audioUrl),
  );
  const hasNarration = slides.some((s) => Boolean(s.narration?.trim()));
  const hasPlayableNarration = hasGeneratedAudio || hasNarration;
  const activeSlide = slides[displayIdx] ?? {
    title: "",
    bullets: [],
    speakerNotes: "",
    narration: "",
    approxDurationSec: 0,
  };

  useEffect(() => { injectStyles(); }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const getSlideAudioSources = useCallback((index: number): string[] => {
    const slide = slidesRef.current[index];
    if (!slide) {
      return [];
    }

    if ((slide.audioChunks?.length ?? 0) > 0) {
      return slide.audioChunks ?? [];
    }

    if (slide.audioUrl) {
      return [slide.audioUrl];
    }

    return [];
  }, []);

  // RAF progress loop
  const stopTracking = useCallback(() => {
    if (rafRef.current !== null) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
  }, []);

  const startTracking = useCallback(() => {
    stopTracking();
    const tick = () => {
      const a = audioRef.current;
      if (a && !a.paused && !a.ended) {
        setCurrentTime(a.currentTime);
        if (!isNaN(a.duration)) setDuration(a.duration);
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [stopTracking]);

  const stopSpeech = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      return;
    }

    speechActiveRef.current = false;
    window.speechSynthesis.cancel();
  }, []);

  const stopAllMedia = useCallback(() => {
    const a = audioRef.current;
    if (a) {
      a.pause();
      a.src = "";
    }
    stopSpeech();
    stopTracking();
  }, [stopSpeech, stopTracking]);

  const loadAudio = useCallback((index: number) => {
    const a = audioRef.current;
    if (!a) return;
    const slide = slidesRef.current[index];
    const audioSources = getSlideAudioSources(index);
    const firstSource = audioSources[0];
    chunkIdxRef.current = 0;
    a.src = firstSource ?? "";
    a.playbackRate = speed;
    if (firstSource) a.load();
    setCurrentTime(0);
    setDuration(slide?.approxDurationSec ?? 0);
  }, [getSlideAudioSources, speed]);

  function finishCurrentSlide() {
    const idx = activeIdxRef.current;
    if (idx < slidesRef.current.length - 1) {
      transitionToSlide(idx + 1, playingRef.current);
    } else {
      playingRef.current = false;
      setIsPlaying(false);
      setEnded(true);
    }
  }

  function startSpeechFallback(narration: string) {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setPlaybackMode("silent");
      setPlaybackError("Audio could not be played on this device.");
      playingRef.current = false;
      setIsPlaying(false);
      return;
    }

    stopSpeech();
    const utterance = new SpeechSynthesisUtterance(narration);
    utterance.rate = Math.min(speed, 2);
    setPlaybackMode("speech");
    setPlaybackError(null);
    speechActiveRef.current = true;
    setCurrentTime(0);
    setDuration(slidesRef.current[activeIdxRef.current]?.approxDurationSec ?? 0);
    utterance.onend = () => {
      speechActiveRef.current = false;
      finishCurrentSlide();
    };
    utterance.onerror = () => {
      speechActiveRef.current = false;
      setPlaybackMode("silent");
      setPlaybackError("Browser speech playback failed for this slide.");
      playingRef.current = false;
      setIsPlaying(false);
    };
    window.speechSynthesis.speak(utterance);
  }

  function fallbackToSpeechForActiveSlide(reason: string) {
    const slide = slidesRef.current[activeIdxRef.current];
    stopTracking();

    if (slide?.narration?.trim()) {
      startSpeechFallback(slide.narration);
      return;
    }

    setPlaybackMode("silent");
    setPlaybackError(reason);
    playingRef.current = false;
    setIsPlaying(false);
  }

  function playCurrentMedia() {
    const a = audioRef.current;
    const audioSources = getSlideAudioSources(activeIdxRef.current);

    if (a && audioSources.length > 0) {
      const source = audioSources[chunkIdxRef.current] ?? audioSources[0];
      if (!source) {
        fallbackToSpeechForActiveSlide("Audio file could not be played.");
        return;
      }
      a.src = source;
      a.playbackRate = speed;
      a.load();
      a
        .play()
        .then(() => {
          setPlaybackMode("tts");
          setPlaybackError(null);
          startTracking();
        })
        .catch(() => {
          fallbackToSpeechForActiveSlide("Audio file could not be played.");
        });
      return;
    }

    fallbackToSpeechForActiveSlide("No narration is available for this slide.");
  }

  const transitionToSlide = (index: number, thenPlay: boolean) => {
    if (index < 0 || index >= slidesRef.current.length) return;
    stopAllMedia();
    setIsFading(true);
    setPlaybackError(null);
    setTimeout(() => {
      activeIdxRef.current = index;
      setDisplayIdx(index);
      if (getSlideAudioSources(index).length > 0) {
        loadAudio(index);
      } else {
        const a = audioRef.current;
        if (a) {
          a.src = "";
        }
        setCurrentTime(0);
        setDuration(slidesRef.current[index]?.approxDurationSec ?? 0);
      }
      setIsFading(false);
      if (thenPlay) {
        setTimeout(() => {
          playCurrentMedia();
        }, 80);
      }
    }, 220);
  };

  const onEnded = () => {
    stopTracking();
    const audioSources = getSlideAudioSources(activeIdxRef.current);

    if (audioSources.length > 1 && chunkIdxRef.current < audioSources.length - 1) {
      chunkIdxRef.current += 1;
      playCurrentMedia();
      return;
    }

    finishCurrentSlide();
  };
  onEndedRef.current = onEnded;

  useEffect(() => {
    const a = new Audio();
    a.preload = "auto";
    audioRef.current = a;
    const onMeta = () => { if (!isNaN(a.duration)) setDuration(a.duration); };
    const handleEnded = () => onEndedRef.current();
    const handleError = () => {
      if (!playingRef.current) {
        return;
      }

      const slide = slidesRef.current[activeIdxRef.current];
      stopTracking();

      if (slide?.narration?.trim()) {
        startSpeechFallback(slide.narration);
        return;
      }

      setPlaybackMode("silent");
      setPlaybackError("Audio file failed to load.");
      playingRef.current = false;
      setIsPlaying(false);
    };
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("ended", handleEnded);
    a.addEventListener("error", handleError);
    return () => {
      stopAllMedia();
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("ended", handleEnded);
      a.removeEventListener("error", handleError);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = speed;
  }, [speed]);

  const handlePlayPause = () => {
    const a = audioRef.current;
    if (playingRef.current) {
      if (speechActiveRef.current) {
        stopSpeech();
      }
      if (a) {
        a.pause();
      }
      stopTracking();
      setPlaybackMode("silent");
      setPlaybackError(null);
      playingRef.current = false; setIsPlaying(false);
    } else {
      if (ended) {
        setEnded(false); playingRef.current = true; setIsPlaying(true);
        transitionToSlide(0, true); return;
      }
      playingRef.current = true; setIsPlaying(true);
      if (a && !a.src) loadAudio(activeIdxRef.current);
      playCurrentMedia();
    }
  };

  const goToSlide = (index: number) => {
    setEnded(false);
    transitionToSlide(index, playingRef.current);
  };

  const handleReplay = () => {
    setEnded(false);
    setPlaybackMode("silent");
    setPlaybackError(null);
    stopAllMedia();
    playingRef.current = true; setIsPlaying(true);
    transitionToSlide(0, true);
  };

  const cycleSpeed = useCallback(() => {
    setSpeed((prev) => SPEEDS[(SPEEDS.indexOf(prev) + 1) % SPEEDS.length]);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    if (document.fullscreenElement === container) {
      await document.exitFullscreen();
      return;
    }

    await container.requestFullscreen();
  }, []);

  useEffect(() => () => { stopAllMedia(); }, [stopAllMedia]);

  const fmt = (s: number) =>
    `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
  const slideNum = String(displayIdx + 1).padStart(2, "0");

  if (slides.length === 0) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      style={{
        background:
          "linear-gradient(180deg, #0d0f12 0%, #13171d 16%, #0d0f12 100%)",
        borderRadius: isFullscreen ? "0" : "1.6rem",
        overflow: "hidden",
        boxShadow: "0 28px 70px rgba(8,8,9,0.2)",
        border: "1px solid rgba(17,23,29,0.1)",
        minHeight: isFullscreen ? "100vh" : undefined,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: isFullscreen ? "center" : undefined,
      }}
    >
      {isFullscreen ? (
        <div
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            zIndex: 3,
          }}
        >
          <button
            type="button"
            onClick={() => {
              void toggleFullscreen();
            }}
            style={{
              borderRadius: "999px",
              padding: "0.42rem 0.75rem",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.74)",
              fontSize: "0.58rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontFamily: "var(--font-mono)",
              cursor: "pointer",
            }}
          >
            Exit full screen
          </button>
        </div>
      ) : (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.9rem",
          padding: "1rem 1.15rem 0.6rem",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0))",
        }}
      >
          <div
            style={{
              display: "flex",
            alignItems: "center",
            gap: "0.55rem",
            flexWrap: "wrap",
          }}
        >
          <span
            title={
              playbackMode === "tts"
                ? "AI audio active"
                : playbackMode === "speech"
                ? "Browser voice active"
                : hasPlayableNarration
                ? "Narration ready"
                : "No narration"
            }
            style={{
              width: "0.6rem",
              height: "0.6rem",
              borderRadius: "999px",
              background:
                playbackMode === "tts"
                  ? "#7de2a8"
                  : playbackMode === "speech"
                  ? "#f5d89b"
                  : hasPlayableNarration
                  ? "rgba(255,255,255,0.42)"
                  : "rgba(255,255,255,0.18)",
              boxShadow:
                  playbackMode === "tts"
                  ? "0 0 14px rgba(125,226,168,0.65)"
                  : playbackMode === "speech"
                  ? "0 0 14px rgba(245,216,155,0.55)"
              : "none",
            }}
          />
          <button
            type="button"
            onClick={() => {
              void toggleFullscreen();
            }}
            style={{
              borderRadius: "999px",
              padding: "0.42rem 0.75rem",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.74)",
              fontSize: "0.58rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontFamily: "var(--font-mono)",
              cursor: "pointer",
            }}
          >
            {isFullscreen ? "Exit full screen" : "Full screen"}
          </button>
        </div>
      </div>
      )}

      {/* ── Slide area ────────────────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          padding: isFullscreen ? "3.8rem 1rem 1rem" : "1rem 0 0.8rem",
          flex: isFullscreen ? 1 : undefined,
          display: "flex",
          alignItems: isFullscreen ? "center" : undefined,
        }}
      >
        <div style={{ opacity: isFading ? 0 : 1, transition: "opacity 0.22s ease", position: "relative", zIndex: 1 }}>
          <SlideCard slide={activeSlide} />
        </div>
      </div>

      {!isFullscreen && playbackError ? (
        <div
          style={{
            margin: "0 1rem 0.85rem",
            padding: "0.8rem 1rem",
            borderRadius: "0.85rem",
            background: "rgba(239,68,68,0.12)",
            border: "1px solid rgba(239,68,68,0.22)",
            color: "#fecaca",
            fontSize: "0.88rem",
            lineHeight: 1.6,
          }}
        >
          {playbackError}
        </div>
      ) : null}

      {/* ── Chapter progress segments ──────────────────────────────────────── */}
      {hasPlayableNarration && (
        <div style={{ padding: "0 clamp(1rem, 3vw, 2rem)" }}>
          <div style={{ display: "flex", gap: "6px", marginBottom: "0.45rem" }}>
            {slides.map((_, i) => {
              const fill =
                i < displayIdx ? 100
                : i === displayIdx && duration > 0
                ? Math.min((currentTime / duration) * 100, 100)
                : 0;
              return (
                <div
                  key={i}
                  onClick={() => goToSlide(i)}
                  title={slides[i]?.title ?? `Slide ${i + 1}`}
                  style={{
                    flex: 1, height: "6px",
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: "999px", cursor: "pointer",
                    overflow: "hidden", position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute", left: 0, top: 0,
                      height: "100%", width: `${fill}%`,
                      background: "var(--rellax-sage)",
                      borderRadius: "999px",
                    }}
                  />
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.15rem" }}>
            <span style={{ color: "rgba(255,255,255,0.56)", fontSize: "0.58rem", fontFamily: "var(--font-mono)" }}>
              {fmt(currentTime)}
            </span>
            <span style={{ color: "rgba(255,255,255,0.56)", fontSize: "0.58rem", fontFamily: "var(--font-mono)" }}>
              {fmt(duration || activeSlide.approxDurationSec)}
            </span>
          </div>
        </div>
      )}

      {/* ── Controls bar ──────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "clamp(0.6rem, 1.5vw, 0.95rem)",
          padding: "0.85rem 1rem",
          background: "rgba(255,255,255,0.03)",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <span
          style={{
            color: "rgba(255,255,255,0.54)",
            fontSize: "0.58rem",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            fontFamily: "var(--font-mono)",
          }}
        >
          Slide {slideNum}
        </span>

        <button
          type="button"
          onClick={cycleSpeed}
          style={{
            color: "rgba(255,255,255,0.84)",
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "999px",
            cursor: "pointer",
            fontFamily: "var(--font-mono)",
            fontSize: "0.58rem",
            fontWeight: 700,
            padding: "0.42rem 0.75rem",
            letterSpacing: "0.08em",
          }}
          aria-label="Playback speed"
        >
          {speed}x
        </button>

        {/* Prev */}
        <button
          type="button"
          onClick={() => goToSlide(displayIdx - 1)}
          disabled={displayIdx === 0}
          style={{ color: "rgba(255,255,255,0.72)", background: "none", border: "none", cursor: displayIdx === 0 ? "not-allowed" : "pointer", opacity: displayIdx === 0 ? 0.3 : 1, display: "flex", alignItems: "center", padding: 0 }}
          aria-label="Previous slide"
        >
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
            <path d="M10.5 4L6 8.5l4.5 4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Play / Pause — primary action */}
        <button
          type="button"
          onClick={handlePlayPause}
          style={{
            width: "3.2rem",
            height: "3.2rem",
            borderRadius: "50%",
            border: "none",
            background: "var(--rellax-sage)",
            color: "#fff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 12px 26px rgba(61,107,79,0.42)",
          }}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor">
              <rect x="2" y="1.5" width="3.5" height="10" rx="1"/>
              <rect x="7.5" y="1.5" width="3.5" height="10" rx="1"/>
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor">
              <path d="M3 2l9 4.5L3 11V2z"/>
            </svg>
          )}
        </button>

        {/* Next */}
        <button
          type="button"
          onClick={() => goToSlide(displayIdx + 1)}
          disabled={displayIdx === slides.length - 1}
          style={{ color: "rgba(255,255,255,0.72)", background: "none", border: "none", cursor: displayIdx === slides.length - 1 ? "not-allowed" : "pointer", opacity: displayIdx === slides.length - 1 ? 0.3 : 1, display: "flex", alignItems: "center", padding: 0 }}
          aria-label="Next slide"
        >
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
            <path d="M6.5 4L11 8.5 6.5 13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Replay */}
        <button
          type="button"
          onClick={handleReplay}
          style={{ color: "rgba(255,255,255,0.62)", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: 0 }}
          aria-label="Restart from beginning"
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M2 7.5a5.5 5.5 0 1 0 1.1-3.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            <path d="M2 3v4.5h4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* ── Transcript / caption bar ───────────────────────────────────────── */}
      {!isFullscreen && activeSlide.narration ? (
        <details
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.16))",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "0.9rem 1.1rem 1rem",
          }}
        >
          <summary
            style={{
              cursor: "pointer",
              color: "rgba(255,255,255,0.68)",
              fontSize: "0.62rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              fontFamily: "var(--font-mono)",
            }}
          >
            Narration
          </summary>
          <p
            style={{
              margin: "0.85rem 0 0",
              color: "rgba(255,255,255,0.9)",
              fontSize: "clamp(0.92rem, 1.15vw, 1rem)",
              lineHeight: 1.8,
              maxWidth: "74ch",
            }}
          >
            {activeSlide.narration}
          </p>
        </details>
      ) : null}
    </div>
  );
}
