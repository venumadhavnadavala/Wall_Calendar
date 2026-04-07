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
      className="min-h-screen relative flex items-center justify-center p-4 md:p-8 bg-[#faf9f6] overflow-hidden transition-colors duration-700"
    >
      {/* Ambient Dynamic Background Glows */}
      <div
        className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-60 transition-colors duration-1000 pointer-events-none"
        style={{ background: theme.accentLight }}
      />
      <div
        className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-[150px] opacity-40 transition-colors duration-1000 pointer-events-none"
        style={{ background: theme.accent }}
      />

      {/* Calendar card (Added backdrop-blur for a frosted glass effect and refined shadows) */}
      <div
        className="w-full paper-texture shadow-[0_50px_100px_-20px_rgba(50,50,93,0.15),0_30px_60px_-30px_rgba(0,0,0,0.1),inset_0_-2px_6px_rgba(0,0,0,0.02)] rounded-[2rem] border border-white/60 overflow-hidden relative z-10 backdrop-blur-xl"
        style={{ maxWidth: 1040 }}
      >
        {/* Refined Spiral Row */}
        <div
          className="relative z-20 flex justify-center items-center gap-3 bg-[#f4f1eb] border-b border-[#e5dfd3] shadow-[0_2px_4px_rgba(0,0,0,0.03)]"
          style={{ height: 32 }}
        >
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="spiral-dot" />
          ))}
        </div>

        {/* ── DESKTOP LAYOUT ───────────────────────────────────────────── */}
        <div className="hidden md:grid relative" style={{ gridTemplateColumns: "1fr 1fr", minHeight: 600 }}>
          
          {/* Left: Hero Image + Spine Shadow */}
          <div className="relative overflow-hidden shadow-[inset_-20px_0_30px_rgba(0,0,0,0.25)] z-10" style={{ minHeight: 460 }}>
            <HeroVisual theme={theme} themeIndex={cal.themeIndex} setTheme={cal.setTheme} />
            <div className="absolute bottom-6 right-6 text-right pointer-events-none drop-shadow-md">
              <div className="text-xs font-mono tracking-widest text-white/90 mb-1">
                {format(cal.currentDate, "yyyy")}
              </div>
              <div className="font-display font-black text-white leading-none" style={{ fontSize: "2.5rem" }}>
                {format(cal.currentDate, "MMMM").toUpperCase()}
              </div>
            </div>
          </div>

          {/* Right: Calendar + Left Inner Spine Shadow */}
          <div className="flex flex-col divide-y divide-neutral-100 shadow-[inset_15px_0_20px_rgba(0,0,0,0.02)] z-0 bg-white/60">
            <div className="flex-1">
              <CalendarGrid {...cal} />
            </div>
            <div style={{ maxHeight: 320, overflowY: "auto" }} className="notes-scroll">
              <NotesPanel {...cal} />
            </div>
          </div>
        </div>

        {/* ── MOBILE LAYOUT ────────────────────────────────────────────── */}
        <div className="md:hidden flex flex-col bg-white/60">
          <div className="relative" style={{ height: 240 }}>
            <HeroVisual theme={theme} themeIndex={cal.themeIndex} setTheme={cal.setTheme} />
            <div className="absolute bottom-4 right-4 text-right pointer-events-none drop-shadow-md">
              <div className="text-xs font-mono tracking-widest text-white/90 mb-0.5">
                {format(cal.currentDate, "yyyy")}
              </div>
              <div className="font-display font-black text-white leading-none" style={{ fontSize: "2rem" }}>
                {format(cal.currentDate, "MMMM").toUpperCase()}
              </div>
            </div>
          </div>
          <CalendarGrid {...cal} />
          <div className="border-t border-neutral-100">
            <NotesPanel {...cal} />
          </div>
        </div>
      </div>
    </div>
  );
}