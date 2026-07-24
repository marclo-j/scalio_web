"use client";

import { useState, useEffect, type CSSProperties } from "react";
import BlurCarousel from "./BlurCarousel";
import { projects } from "../data/projects";

const slides = projects.map((p) => ({
  image: { src: p.image, alt: p.alt || p.title },
  title: p.title,
}));

export default function TrabajoWrapper() {
  const [activeIndex, setActiveIndex] = useState(0);
  const project = projects[activeIndex];

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
