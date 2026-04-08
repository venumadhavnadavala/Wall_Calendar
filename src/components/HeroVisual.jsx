import React, { useState, useEffect } from "react";
import { THEMES } from "../utils/themes";

export default function HeroVisual({ theme, themeIndex, setTheme, startDate, endDate }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [displayIndex, setDisplayIndex] = useState(themeIndex);

  useEffect(() => {
    if (displayIndex !== themeIndex) {
      setIsFlipping(true);
      const t1 = setTimeout(() => {
        setDisplayIndex(themeIndex);
        setImgLoaded(false);
      }, 180);
      const t2 = setTimeout(() => setIsFlipping(false), 400);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [themeIndex]);

  const displayTheme = THEMES[displayIndex];
  const hasMask = startDate && endDate;

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ minHeight: 220, perspective: "1200px" }}
    >
      {/* Flip container */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformStyle: "preserve-3d",
          transform: isFlipping ? "rotateY(-88deg)" : "rotateY(0deg)",
          transition: "transform 0.2s cubic-bezier(0.4,0,1,1)",
        }}
      >
        {/* Shimmer while loading */}
        {!imgLoaded && <div className="absolute inset-0 shimmer" />}

        {/* Hero image */}
        <img
          src={displayTheme.image}
          alt={displayTheme.label}
          onLoad={() => setImgLoaded(true)}
          onError={(e) => {
            // Fallback to a reliable placeholder if image fails
            e.target.src = `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80`;
            setImgLoaded(true);
          }}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: imgLoaded ? 1 : 0, transition: "opacity 0.4s ease" }}
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        {/* Immersive mask when range selected */}
        {hasMask && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-500"
            style={{ background: "rgba(0,0,0,0.25)", mixBlendMode: "multiply" }}
          />
        )}
      </div>

      {/* Page flip — new image flips in from right */}
      {isFlipping && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformStyle: "preserve-3d",
            transform: "rotateY(0deg)",
            transition: "transform 0.22s cubic-bezier(0,0,0.6,1)",
            background: "#f0ebe3",
          }}
        />
      )}

      {/* Tag badge */}
      <div className="absolute top-4 left-4 z-20">
        <span
          className="text-xs font-mono tracking-widest text-white px-2.5 py-1 rounded-full"
          style={{ background: "rgba(0,0,0,0.30)", backdropFilter: "blur(8px)" }}
        >
          ◉ {displayTheme.tag}
        </span>
      </div>

      {/* Page corner fold */}
      <div
        className="absolute top-0 right-0 z-20 pointer-events-none"
        style={{
          width: 0,
          height: 0,
          borderStyle: "solid",
          borderWidth: "0 30px 30px 0",
          borderColor: "transparent rgba(255,255,255,0.18) transparent transparent",
        }}
      />

      {/* Theme switcher dots */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
        {THEMES.map((t, i) => (
          <button
            key={t.id}
            onClick={() => i !== themeIndex && setTheme(i)}
            title={t.label}
            style={{
              width: i === themeIndex ? 26 : 14,
              height: 14,
              borderRadius: 7,
              background:
                i === themeIndex ? t.accent : "rgba(255,255,255,0.45)",
              border: `2px solid ${
                i === themeIndex ? "white" : "rgba(255,255,255,0.55)"
              }`,
              boxShadow:
                i === themeIndex ? `0 0 0 2.5px ${t.accent}55` : "none",
              transition: "all 0.25s ease",
              cursor: i === themeIndex ? "default" : "pointer",
            }}
            aria-label={`Switch to ${t.label} theme`}
          />
        ))}
      </div>
    </div>
  );
}