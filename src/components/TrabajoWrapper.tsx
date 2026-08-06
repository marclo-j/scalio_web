"use client";

import { useState, useEffect, type CSSProperties } from "react";
import BlurCarousel from "./BlurCarousel";
import { projects } from "../data/projects";

const slides = projects.map((p) => ({
  image: { src: p.image, alt: p.alt || p.title },
  title: p.title,
}));

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [breakpoint]);
  return isMobile;
}

export default function TrabajoWrapper() {
  const [activeIndex, setActiveIndex] = useState(0);
  const project = projects[activeIndex];
  const isMobile = useIsMobile();

  useEffect(() => {
    const id = "trabajo-anim-styles";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
@keyframes trabajoSoftBlurIn {
  from { opacity: 0; filter: blur(12px); transform: translateY(16px); }
  to   { opacity: 1; filter: blur(0); transform: translateY(0); }
}
`;
    document.head.appendChild(style);
  }, []);

  if (isMobile) {
    return (
      <div style={mobileContainerStyle}>
        <div style={mobileCarouselPanelStyle}>
          <BlurCarousel
            slides={slides}
            cardWidth={343}
            cardHeight={220}
            onSlideChange={setActiveIndex}
          />
        </div>

        <div key={activeIndex} style={mobileTextOverlayStyle}>
          <span style={mobileCounterStyle}>
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(projects.length).padStart(2, "0")}
          </span>
          <h3 style={mobileTitleStyle}>{project.title}</h3>
          <p style={mobileDescStyle}>{project.description}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={textPanelStyle}>
        <span style={counterStyle}>
          {String(activeIndex + 1).padStart(2, "0")} /{" "}
          {String(projects.length).padStart(2, "0")}
        </span>

        <div key={activeIndex} style={textWrapperStyle}>
          <h3 style={titleStyle}>{project.title}</h3>
          <p style={descStyle}>{project.description}</p>
        </div>
      </div>

      <div style={carouselPanelStyle}>
        <BlurCarousel
          slides={slides}
          cardWidth={994}
          cardHeight={559}
          onSlideChange={setActiveIndex}
        />
      </div>
    </div>
  );
}

const containerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: 80,
  padding: "0 48px",
  width: "100%",
};

const textPanelStyle: CSSProperties = {
  flex: "0 0 500px",
};

const carouselPanelStyle: CSSProperties = {
  flex: "0 0 auto",
};

const counterStyle: CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: 14,
  fontWeight: 600,
  color: "#9CA3AF",
  letterSpacing: "0.08em",
  display: "block",
  marginBottom: 24,
};

const textWrapperStyle: CSSProperties = {
  animation: "trabajoSoftBlurIn 0.65s cubic-bezier(0.22, 1, 0.36, 1) both",
};

const titleStyle: CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: 60,
  fontWeight: 800,
  color: "#F9CC15",
  lineHeight: 1.1,
  letterSpacing: "-0.03em",
  margin: 0,
  marginBottom: 20,
};

const descStyle: CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: 16,
  fontWeight: 400,
  color: "#FFFFFF",
  lineHeight: 1.7,
  margin: 0,
};

const mobileContainerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 0,
  padding: "0 16px",
  width: "100%",
  boxSizing: "border-box",
  overflow: "hidden",
};

const mobileCarouselPanelStyle: CSSProperties = {
  width: "100%",
  display: "flex",
  justifyContent: "center",
  overflow: "hidden",
};

const mobileTextOverlayStyle: CSSProperties = {
  width: "100%",
  maxWidth: 343,
  margin: "16px auto 0",
  padding: "0 12px",
  animation: "trabajoSoftBlurIn 0.65s cubic-bezier(0.22, 1, 0.36, 1) both",
};

const mobileCounterStyle: CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: 12,
  fontWeight: 600,
  color: "#9CA3AF",
  letterSpacing: "0.08em",
  display: "block",
  marginBottom: 12,
};

const mobileTitleStyle: CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: 24,
  fontWeight: 800,
  color: "#F9CC15",
  lineHeight: 1.2,
  letterSpacing: "-0.02em",
  margin: 0,
  marginBottom: 8,
};

const mobileDescStyle: CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: 14,
  fontWeight: 400,
  color: "#FFFFFF",
  lineHeight: 1.5,
  margin: 0,
};
