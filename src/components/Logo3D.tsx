import React, { useEffect, useState } from "react";
import { SVG3D } from "3dsvg";

export default function Logo3D({ className, height = 400 }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const glow = {
    boxShadow: "0 0 30px rgba(249,204,21,0.3), 0 0 60px rgba(249,204,21,0.15)",
    filter: "drop-shadow(0 0 20px rgba(249,204,21,0.2))",
  };

  if (!mounted) {
    return (
      <div
        className={className}
        style={{
          width: height,
          height,
          borderRadius: "50%",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000",
          ...glow,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "3px solid rgba(249, 204, 21, 0.3)",
            borderTopColor: "#F9CC15",
            animation: "spinLogo 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spinLogo { to { transform: rotate(360deg) } }`}</style>
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        width: height,
        height,
        borderRadius: "50%",
        overflow: "hidden",
        ...glow,
      }}
    >
      <SVG3D
        svg="/logo.svg"
        material="gold"
        animate="swing"
        animateSpeed={0.7}
        depth={2.5}
        smoothness={0.4}
        color="#F9CC15"
        height={height}
        width={height}
        background="transparent"
        intro="zoom"
        introDuration={2}
        interactive={false}
        cursorOrbit={false}
        draggable={false}
        scrollZoom={false}
        lightPosition={[0, 2, 12]}
        lightIntensity={1.5}
        ambientIntensity={1.5}
        metalness={0.3}
        roughness={0.15}
      />
    </div>
  );
}
