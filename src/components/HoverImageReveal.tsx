"use client";

import { useRef, useState, type CSSProperties } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";

interface ServiceItem {
  text: string;
  image: string;
  description?: string;
}

interface HoverImageRevealProps {
  items: ServiceItem[];
  backgroundColor?: string;
  textColor?: string;
  dimColor?: string;
  imageWidth?: number;
  imageHeight?: number;
  rounded?: number;
  offsetX?: number;
  offsetY?: number;
  style?: CSSProperties;
}

export default function HoverImageReveal({
  items,
  backgroundColor = "#000000",
  textColor = "#F9CC15",
  dimColor = "#51565A",
  imageWidth = 360,
  imageHeight = 460,
  rounded = 20,
  offsetX = 280,
  offsetY = 0,
  style,
}: HoverImageRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 60, damping: 28, mass: 0.5 });
  const y = useSpring(rawY, { stiffness: 60, damping: 28, mass: 0.5 });

  const anyActive = hovered != null;

  const onMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set(e.clientX - rect.left + offsetX);
    rawY.set(e.clientY - rect.top + offsetY);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={onMove}
      onMouseLeave={() => setHovered(null)}
      style={{
        position: "relative",
        width: "100%",
        overflow: "visible",
        backgroundColor,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "32px",
        padding: 48,
        boxSizing: "border-box",
        cursor: "default",
        ...style,
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
          width: imageWidth,
          height: imageHeight,
          borderRadius: rounded,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 2,
        }}
        animate={{ opacity: anyActive ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 40, mass: 1 }}
      >
        {items.map((item, i) => {
          const yPos =
            hovered == null
              ? "100%"
              : i < hovered
                ? "-100%"
                : i > hovered
                  ? "100%"
                  : "0%";
          return (
            <motion.div
              key={i}
              initial={false}
              animate={{ y: yPos }}
              transition={{ type: "spring", stiffness: 400, damping: 40, mass: 1 }}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                overflow: "hidden",
              }}
            >
              <img
                src={item.image}
                alt={item.text}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              {item.description && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: "rgba(0,0,0,0.65)",
                    padding: "12px 16px",
                    color: "#ffffff",
                    fontSize: "14px",
                    lineHeight: "1.4",
                    textAlign: "center",
                  }}
                >
                  {item.description}
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      <div
        onMouseLeave={() => setHovered(null)}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "32px",
        }}
      >
        {items.map((item, i) => {
          const isHovered = hovered === i;
          const color = anyActive ? (isHovered ? textColor : dimColor) : textColor;
          const copyStyle: CSSProperties = {
            display: "block",
            color,
            fontSize: "clamp(42px, 6vw, 72px)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: "1.2em",
            transition: "color 0.2s ease",
            whiteSpace: "nowrap",
            textAlign: "center",
          };
          return (
            <div
              key={i}
              onMouseEnter={() => setHovered(i)}
              style={{
                overflow: "hidden",
                cursor: "default",
              }}
            >
              <motion.div
                style={{ position: "relative" }}
                animate={{ y: isHovered ? "-100%" : "0%" }}
                transition={{ type: "spring", stiffness: 400, damping: 40, mass: 1 }}
              >
                <span style={copyStyle}>{item.text}</span>
                <span
                  aria-hidden
                  style={{
                    ...copyStyle,
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    width: "100%",
                  }}
                >
                  {item.text}
                </span>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}