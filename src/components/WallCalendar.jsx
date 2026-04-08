import React from "react";
import HeroVisual from "./HeroVisual";
import CalendarGrid from "./CalendarGrid";
import NotesPanel from "./NotesPanel";
import { useCalendar } from "../hooks/useCalendar";
import { format } from "date-fns";

export default function WallCalendar() {
  const cal = useCalendar();
  const { theme } = cal;

  return (
    <div
      className="min-h-screen relative flex items-center justify-center overflow-hidden transition-colors duration-700"
      style={{
        background: theme.bg || "#faf9f6",
        padding: "clamp(16px, 3vw, 40px)",
      }}
    >
      {/* Ambient glows */}
      <div
        className="absolute top-[-15%] left-[-10%] w-[55vw] h-[55vw] rounded-full pointer-events-none"
        style={{
          background: theme.accentLight,
          filter: "blur(100px)",
          opacity: 0.7,
          mixBlendMode: "multiply",
          transition: "background 0.8s ease",
        }}
      />
      <div
        className="absolute bottom-[-15%] right-[-10%] w-[45vw] h-[45vw] rounded-full pointer-events-none"
        style={{
          background: theme.accentMid || theme.accent,
          filter: "blur(130px)",
          opacity: 0.3,
          mixBlendMode: "multiply",
          transition: "background 0.8s ease",
        }}
      />

      {/* ── Calendar card ── */}
      {/* 
        KEY FIX: We do NOT use overflow-hidden on the outer card wrapper.
        Instead, each inner section clips itself. This lets the rounded-[2rem]
        corners be fully visible without being cut off by the viewport.
        We use a clip-path trick on the inner content areas instead.
      */}
      <div
        className="w-full paper-texture relative z-10"
        style={{
          maxWidth: 1040,
          /* Constrain height so it fits viewport with padding */
          maxHeight: "calc(100vh - clamp(32px, 6vw, 80px))",
          borderRadius: "2rem",
          border: "1px solid rgba(255,255,255,0.6)",
          boxShadow:
            "0 40px 80px -20px rgba(50,50,93,0.14), 0 20px 50px -20px rgba(0,0,0,0.08), inset 0 -2px 6px rgba(0,0,0,0.02)",
          backdropFilter: "blur(20px)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden", /* needs to be here for border-radius to clip children */
        }}
      >
        {/* Spiral binding row */}
        <div
          className="relative z-20 flex justify-center items-center gap-3 border-b flex-shrink-0"
          style={{
            height: 32,
            background: "#f3efe8",
            borderColor: "#e5dfd3",
            boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
          }}
        >
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="spiral-dot" />
          ))}
        </div>

        {/* ── DESKTOP ── */}
        <div
          className="hidden md:grid flex-1 min-h-0"
          style={{ gridTemplateColumns: "1fr 1fr" }}
        >
          {/* Left: Hero — fills full height */}
          <div
            className="relative overflow-hidden"
            style={{ boxShadow: "inset -18px 0 28px rgba(0,0,0,0.22)" }}
          >
            <HeroVisual
              theme={theme}
              themeIndex={cal.themeIndex}
              setTheme={cal.setTheme}
              startDate={cal.startDate}
              endDate={cal.endDate}
            />
            <div className="absolute bottom-5 right-5 text-right pointer-events-none">
              <div className="text-xs font-mono tracking-widest text-white/80 mb-0.5">
                {format(cal.currentDate, "yyyy")}
              </div>
              <div
                className="font-display font-black text-white leading-none"
                style={{ fontSize: "2.2rem", textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}
              >
                {format(cal.currentDate, "MMMM").toUpperCase()}
              </div>
            </div>
          </div>

          {/* Right: Calendar grid + Notes — scrollable as a unit */}
          <div
            className="flex flex-col min-h-0"
            style={{
              background: "rgba(255,255,255,0.68)",
              boxShadow: "inset 14px 0 18px rgba(0,0,0,0.02)",
              overflowY: "auto",
            }}
          >
            {/* Calendar grid — fixed, no scroll */}
            <div className="flex-shrink-0">
              <CalendarGrid {...cal} />
            </div>

            {/* Divider */}
            <div
              className="flex-shrink-0 mx-5"
              style={{ height: 1, background: "rgba(0,0,0,0.06)" }}
            />

            {/* Notes — grows to fill remaining space */}
            <div className="flex-1 min-h-0">
              <NotesPanel {...cal} />
            </div>
          </div>
        </div>

        {/* ── MOBILE ── */}
        <div
          className="md:hidden flex flex-col flex-1 min-h-0 overflow-y-auto notes-scroll"
          style={{ background: "rgba(255,255,255,0.7)" }}
        >
          <div className="relative flex-shrink-0" style={{ height: 220 }}>
            <HeroVisual
              theme={theme}
              themeIndex={cal.themeIndex}
              setTheme={cal.setTheme}
              startDate={cal.startDate}
              endDate={cal.endDate}
            />
            <div className="absolute bottom-4 right-4 text-right pointer-events-none">
              <div className="text-xs font-mono tracking-widest text-white/80 mb-0.5">
                {format(cal.currentDate, "yyyy")}
              </div>
              <div
                className="font-display font-black text-white leading-none"
                style={{ fontSize: "1.8rem" }}
              >
                {format(cal.currentDate, "MMMM").toUpperCase()}
              </div>
            </div>
          </div>
          <div className="flex-shrink-0">
            <CalendarGrid {...cal} />
          </div>
          <div
            className="flex-shrink-0 mx-5"
            style={{ height: 1, background: "rgba(0,0,0,0.06)" }}
          />
          <div className="flex-1">
            <NotesPanel {...cal} />
          </div>
        </div>
      </div>
    </div>
  );
}