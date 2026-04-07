import React, { useState } from "react";
import { THEMES } from "../utils/themes";

export default function HeroVisual({ theme, themeIndex, setTheme }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgKey, setImgKey] = useState(0);

  const handleSwitch = (i) => {
    if (i === themeIndex) return;
    setImgLoaded(false);
    setImgKey((k) => k + 1);
    setTheme(i);
  };

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ minHeight: 220 }}>
      {/* Shimmer placeholder */}
      {!imgLoaded && (
        <div className="absolute inset-0 shimmer" />
      )}

      {/* Hero image */}
      <img
        key={imgKey}
        src={theme.image}
        alt={theme.label}
        onLoad={() => setImgLoaded(true)}
        className="hero-img absolute inset-0 w-full h-full object-cover"
        style={{ opacity: imgLoaded ? 1 : 0 }}
      />

      {/* Gradient overlay — bottom fade for month label */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.0) 40%, rgba(0,0,0,0.55) 100%)`,
        }}
      />

      {/* Tag badge top-left */}
      <div className="absolute top-4 left-4 flex items-center gap-1.5">
        <span
          className="text-xs font-mono tracking-widest text-white px-2.5 py-1 rounded-full backdrop-blur-sm"
          style={{ background: "rgba(0,0,0,0.35)" }}
        >
          ◉ {theme.tag}
        </span>
      </div>

      {/* Theme switcher dots bottom-left */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2">
        {THEMES.map((t, i) => (
          <button
            key={t.id}
            onClick={() => handleSwitch(i)}
            title={t.label}
            className="transition-all duration-200 rounded-full border-2 border-white/60 hover:border-white hover:scale-110"
            style={{
              width: i === themeIndex ? 28 : 18,
              height: 18,
              background: i === themeIndex ? t.accent : "rgba(255,255,255,0.35)",
              borderColor: i === themeIndex ? "white" : "rgba(255,255,255,0.5)",
              boxShadow: i === themeIndex ? `0 0 0 2px ${t.accent}55` : "none",
            }}
            aria-label={`Switch to ${t.label} theme`}
          />
        ))}
      </div>

      {/* Spiral rings overlay — visible on desktop at top */}
      <div
        className="absolute top-0 left-0 right-0 flex justify-center items-center gap-5 pointer-events-none"
        style={{ height: 24, marginTop: -12 }}
      >
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className="spiral-dot flex-shrink-0" />
        ))}
      </div>
    </div>
  );
}