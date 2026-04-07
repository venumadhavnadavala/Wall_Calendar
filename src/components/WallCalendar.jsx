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
      className="min-h-screen flex items-center justify-center p-4 md:p-8 transition-colors duration-700"
      style={{
        background: `radial-gradient(ellipse at 60% 40%, ${theme.accentLight}88 0%, #f5f0eb 55%)`,
      }}
    >
      {/* Calendar card */}
      <div
        className="w-full paper-texture shadow-2xl rounded-3xl overflow-hidden relative"
        style={{
          maxWidth: 960,
          boxShadow: `0 32px 80px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.06)`,
        }}
      >
        {/* Spiral dots row — top of calendar */}
        <div
          className="relative z-20 flex justify-center items-center gap-4 bg-neutral-100"
          style={{ height: 28, background: "rgba(200,184,162,0.25)" }}
        >
          {Array.from({ length: 22 }).map((_, i) => (
            <div key={i} className="spiral-dot" />
          ))}
        </div>

        {/* ── DESKTOP LAYOUT ───────────────────────────────────────────── */}
        <div className="hidden md:grid" style={{ gridTemplateColumns: "1fr 1fr", minHeight: 560 }}>
          {/* Left: Hero Image */}
          <div className="relative overflow-hidden" style={{ minHeight: 420 }}>
            <HeroVisual
              theme={theme}
              themeIndex={cal.themeIndex}
              setTheme={cal.setTheme}
            />

            {/* Month overlay on image — bottom right */}
            <div
              className="absolute bottom-5 right-5 text-right pointer-events-none"
            >
              <div
                className="text-xs font-mono tracking-widest text-white/80 mb-0.5"
              >
                {format(cal.currentDate, "yyyy")}
              </div>
              <div
                className="font-display font-black text-white leading-none drop-shadow-lg"
                style={{ fontSize: "2.2rem" }}
              >
                {format(cal.currentDate, "MMMM").toUpperCase()}
              </div>
            </div>
          </div>

          {/* Right panel: Calendar + Notes stacked */}
          <div className="flex flex-col divide-y divide-neutral-100">
            <div className="flex-1">
              <CalendarGrid
                currentDate={cal.currentDate}
                today={cal.today}
                theme={theme}
                daysInMonth={cal.daysInMonth}
                prefixBlanks={cal.prefixBlanks}
                startDate={cal.startDate}
                endDate={cal.endDate}
                slideDir={cal.slideDir}
                isStart={cal.isStart}
                isEnd={cal.isEnd}
                isInRange={cal.isInRange}
                isToday={cal.isToday}
                hasNote={cal.hasNote}
                setHoverDate={cal.setHoverDate}
                handleDayClick={cal.handleDayClick}
                clearSelection={cal.clearSelection}
                goNext={cal.goNext}
                goPrev={cal.goPrev}
                goToToday={cal.goToToday}
              />
            </div>
            <div style={{ maxHeight: 280, overflowY: "auto" }} className="notes-scroll">
              <NotesPanel
                theme={theme}
                startDate={cal.startDate}
                endDate={cal.endDate}
                noteKey={cal.noteKey}
                draftNote={cal.draftNote}
                saveNote={cal.saveNote}
                savedNotesList={cal.savedNotesList}
                setDraftNote={cal.setDraftNote}
              />
            </div>
          </div>
        </div>

        {/* ── MOBILE LAYOUT ────────────────────────────────────────────── */}
        <div className="md:hidden flex flex-col">
          {/* Hero image — fixed height */}
          <div className="relative" style={{ height: 220 }}>
            <HeroVisual
              theme={theme}
              themeIndex={cal.themeIndex}
              setTheme={cal.setTheme}
            />
            {/* Month overlay */}
            <div className="absolute bottom-4 right-4 text-right pointer-events-none">
              <div className="text-xs font-mono tracking-widest text-white/70 mb-0.5">
                {format(cal.currentDate, "yyyy")}
              </div>
              <div
                className="font-display font-black text-white leading-none drop-shadow-lg"
                style={{ fontSize: "1.75rem" }}
              >
                {format(cal.currentDate, "MMMM").toUpperCase()}
              </div>
            </div>
          </div>

          {/* Calendar grid */}
          <CalendarGrid
            currentDate={cal.currentDate}
            today={cal.today}
            theme={theme}
            daysInMonth={cal.daysInMonth}
            prefixBlanks={cal.prefixBlanks}
            startDate={cal.startDate}
            endDate={cal.endDate}
            slideDir={cal.slideDir}
            isStart={cal.isStart}
            isEnd={cal.isEnd}
            isInRange={cal.isInRange}
            isToday={cal.isToday}
            hasNote={cal.hasNote}
            setHoverDate={cal.setHoverDate}
            handleDayClick={cal.handleDayClick}
            clearSelection={cal.clearSelection}
            goNext={cal.goNext}
            goPrev={cal.goPrev}
            goToToday={cal.goToToday}
          />

          {/* Notes */}
          <div className="border-t border-neutral-100">
            <NotesPanel
              theme={theme}
              startDate={cal.startDate}
              endDate={cal.endDate}
              noteKey={cal.noteKey}
              draftNote={cal.draftNote}
              saveNote={cal.saveNote}
              savedNotesList={cal.savedNotesList}
              setDraftNote={cal.setDraftNote}
            />
          </div>
        </div>
      </div>

      {/* Subtle footer credit */}
      <div className="fixed bottom-3 left-0 right-0 flex justify-center pointer-events-none">
        <span className="text-xs font-mono text-neutral-400/60 tracking-widest">
          WALL CALENDAR ✦ {format(new Date(), "yyyy")}
        </span>
      </div>
    </div>
  );
}