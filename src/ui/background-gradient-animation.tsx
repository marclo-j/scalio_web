import React from "react";

interface BackgroundGradientAnimationProps {
  children?: React.ReactNode;
  className?: string;
  extended?: boolean;
}

export function BackgroundGradientAnimation({
  children,
  className = "",
  extended = false,
}: BackgroundGradientAnimationProps) {
  return (
    <div className={`bg-gradient-root ${className} ${extended ? "bg-gradient-extended" : ""}`}>
      <div className="bg-gradient-canvas" />
      <div className="bg-gradient-content">{children}</div>

      <style>{`
        .bg-gradient-root {
          position: relative;
        }

        .bg-gradient-extended {
          margin-bottom: -300px;
          padding-bottom: 300px;
        }

        .bg-gradient-canvas {
          position: absolute;
          top: -80px;
          left: 0;
          width: 100%;
          bottom: 0;
          clip-path: polygon(0 0, 100% 0, 100% calc(100% - 5.24vw), 0 100%);
          background:
            radial-gradient(ellipse 800px 500px at 10% 12%, rgba(249,204,21,0.10) 0%, transparent 100%),
            radial-gradient(ellipse 600px 650px at 75% 25%, rgba(249,204,21,0.07) 0%, transparent 100%),
            radial-gradient(ellipse 700px 450px at 45% 50%, rgba(249,204,21,0.09) 0%, transparent 100%),
            radial-gradient(ellipse 500px 600px at 85% 72%, rgba(249,204,21,0.05) 0%, transparent 100%),
            radial-gradient(ellipse 650px 500px at 20% 78%, rgba(249,204,21,0.08) 0%, transparent 100%),
            radial-gradient(ellipse 800px 400px at 60% 92%, rgba(249,204,21,0.06) 0%, transparent 100%),
            #000000;
          pointer-events: none;
          z-index: 0;
        }

        .bg-gradient-content {
          position: relative;
          z-index: 1;
        }
      `}</style>
    </div>
  );
}
