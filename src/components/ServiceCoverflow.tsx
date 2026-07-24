"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type CSSProperties,
} from "react";

interface ServiceItem {
  text: string;
  image: string;
  description: string;
}

interface Props {
  items: ServiceItem[];
  cardWidth?: number;
  cardHeight?: number;
  radius?: number;
  tilt?: number;
  sideTilt?: number;
  gap?: number;
  opacity?: number;
  transition?: Record<string, unknown>;
  style?: CSSProperties;
}

const PERSPECTIVE = 3000;
const SCALE_STEP = 0.16;
const MAX_VISIBLE = 2;
const DEPTH = 240;

function cssTransition(t: any): { dur: number; ease: string } {
  const dur = t && typeof t.duration === "number" ? t.duration : 0.6;
  let ease = "cubic-bezier(0.22, 1, 0.36, 1)";
  const e = t?.ease;
  if (Array.isArray(e) && e.length === 4) {
    ease = `cubic-bezier(${e[0]}, ${e[1]}, ${e[2]}, ${e[3]})`;
  } else if (typeof e === "string") {
    const map: Record<string, string> = {
      linear: "linear",
      easeIn: "ease-in",
      easeOut: "ease-out",
      easeInOut: "ease-in-out",
    };
    ease = map[e] || "ease";
  }
  return { dur, ease };
}

export default function ServiceCoverflow({
  items,
  cardWidth = 850,
  cardHeight = 640,
  radius = 0,
  tilt = 10,
  sideTilt = 6,
  gap = 7,
  opacity = 50,
  transition,
  style,
}: Props) {
  const list = items;
  const n = list.length;
  const loop = true;
  const [active, setActive] = useState(0);

  useEffect(() => {
    setActive((a) => Math.max(0, Math.min(n - 1, a)));
  }, [n]);

  const moveDur =
    transition && typeof transition.duration === "number"
      ? transition.duration
      : 0.6;
  const lockRef = useRef(false);
  const lock = useCallback(() => {
    lockRef.current = true;
    window.setTimeout(
      () => {
        lockRef.current = false;
      },
      Math.max(50, moveDur * 1000),
    );
  }, [moveDur]);

  const handleCardClick = useCallback(
    (i: number) => {
      if (lockRef.current) return;
      lock();
      setActive((a) => (i === a ? (a + 1) % n : i));
    },
    [n, lock],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleCardClick((active + 1) % n);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handleCardClick((active - 1 + n) % n);
      }
    },
    [active, n, handleCardClick],
  );

  const { dur, ease } = cssTransition(transition);
  const transitionCss = `transform ${dur}s ${ease}, opacity ${dur}s ${ease}`;

  const effectiveRadius =
    (Math.max(0, Math.min(20, radius)) / 20) *
    (Math.min(cardWidth, cardHeight) / 2);
  const dim = 1 - Math.max(0, Math.min(100, opacity)) / 100;

  return (
    <div
      style={{
        ...(style || {}),
        position: "relative",
        width: "100%",
        minWidth: 1100,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        outline: "none",
      }}
      tabIndex={0}
      role="group"
      aria-roledescription="carousel"
      onKeyDown={onKeyDown}
    >
      {/* Coverflow */}
      <div
        style={{
          perspective: `${PERSPECTIVE}px`,
          overflow: "hidden",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: cardHeight + 140,
          padding: "0 170px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            position: "relative",
            width: cardWidth,
            height: cardHeight,
            transformStyle: "preserve-3d",
          }}
        >
          {list.map((slide, i) => {
            let rel = i - active;
            if (loop) {
              if (rel > n / 2) rel -= n;
              if (rel < -n / 2) rel += n;
            }
            const ax = Math.abs(rel);
            const visible = ax <= MAX_VISIBLE;
            const isActive = rel === 0;
            const sc = Math.max(0.4, 1 - ax * SCALE_STEP);
            const tx = rel * (gap * 30);
            const tz = -ax * DEPTH;
            const ry = -rel * tilt;
            const rz = rel * sideTilt;

            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: cardWidth,
                  height: cardHeight,
                  borderRadius: effectiveRadius,
                  overflow: "hidden",
                  transformStyle: "preserve-3d",
                  transformOrigin: "center center",
                  transform: `translate(-50%, -50%) translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${sc})`,
                  transition: transitionCss,
                  opacity: visible ? 1 : 0,
                  cursor: isActive ? "default" : "pointer",
                  pointerEvents: visible ? "auto" : "none",
                  backgroundColor: "#1a1a1a",
                }}
                onClick={() => handleCardClick(i)}
                aria-hidden={!visible}
              >
                <img
                  src={slide.image}
                  alt={slide.text}
                  draggable={false}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    userSelect: "none",
                  }}
                />

                {/* Dim overlay for inactive cards */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "#000000",
                    opacity: isActive ? 0 : dim,
                    transition: `opacity ${dur}s ${ease}`,
                    pointerEvents: "none",
                  }}
                />

                {/* Bottom vignette + text */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    padding: "40px 32px",
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)",
                    pointerEvents: "none",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "var(--font-sans)",
                      color: "#F9CC15",
                      fontSize: "clamp(29px, 3.7vw, 42px)",
                      fontWeight: 800,
                      margin: 0,
                      marginBottom: 8,
                      lineHeight: 1.2,
                    }}
                  >
                    {slide.text}
                  </h3>
                  <p
                    style={{
                      color: "#FFFFFF",
                      fontSize: 17,
                      fontWeight: 500,
                      lineHeight: 1.5,
                      margin: 0,
                      maxWidth: "80%",
                    }}
                  >
                    {slide.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
