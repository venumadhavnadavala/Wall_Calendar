import React from "react";
import { format, addMonths, subMonths, endOfMonth, startOfMonth } from "date-fns";
import { ChevronLeft, ChevronRight, CalendarDays, X } from "lucide-react";
import { DAYS_OF_WEEK, MONTHS, HOLIDAYS } from "../utils/themes";
import DayCell from "./DayCell";

export default function CalendarGrid({
  currentDate,
  today,
  theme,
  daysInMonth,
  prefixBlanks,
  startDate,
  endDate,
  slideDir,
  isStart,
  isEnd,
  isInRange,
  isToday,
  hasNote,
  hasMood,
  getMood,
  setHoverDate,
  handleDayClick,
  clearSelection,
  goNext,
  goPrev,
  goToToday,
}) {
  const year      = format(currentDate, "yyyy");
  const monthName = MONTHS[currentDate.getMonth()];

  const totalCells   = prefixBlanks + daysInMonth.length;
  const trailingCount = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);

  const prevMonthEnd  = endOfMonth(subMonths(currentDate, 1));
  const prevDays      = Array.from({ length: prefixBlanks }, (_, i) => {
    const d = new Date(prevMonthEnd);
    d.setDate(prevMonthEnd.getDate() - (prefixBlanks - 1 - i));
    return d;
  });

  const nextMonthStart = startOfMonth(addMonths(currentDate, 1));
  const nextDays       = Array.from({ length: trailingCount }, (_, i) => {
    const d = new Date(nextMonthStart);
    d.setDate(i + 1);
    return d;
  });

  const allCells = [...prevDays, ...daysInMonth, ...nextDays];

  const animClass =
    slideDir === "left"  ? "slide-in-left"  :
    slideDir === "right" ? "slide-in-right" : "";

  const rangeLabel =
    startDate && endDate
      ? `${format(startDate, "MMM d")} – ${format(endDate, "MMM d, yyyy")}`
      : startDate
      ? `${format(startDate, "MMM d, yyyy")} — pick end date`
      : null;

  const monthHolidays = daysInMonth.filter((d) => {
    const k = `${d.getMonth() + 1}-${d.getDate()}`;
    return HOLIDAYS[k];
  });

  return (
    <div className="flex flex-col px-5 py-4 gap-3">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className={animClass}>
          <div
            className="font-mono uppercase mb-0.5"
            style={{ color: theme.accent, letterSpacing: "0.15em", fontSize: "0.62rem" }}
          >
            {year}
          </div>
          <h2
            className="font-display font-black tracking-tight leading-none text-neutral-900"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}
          >
            {monthName}
          </h2>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={goToToday}
            className="font-mono rounded-full border transition-all hover:shadow-sm"
            style={{
              borderColor: theme.accent + "55",
              color: theme.accent,
              fontSize: "0.7rem",
              padding: "4px 10px",
              lineHeight: 1.4,
              whiteSpace: "nowrap",
            }}
          >
            Today
          </button>
          <button
            onClick={goPrev}
            className="flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors"
            style={{ width: 28, height: 28, color: "#b0a898", flexShrink: 0 }}
            aria-label="Previous month"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={goNext}
            className="flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors"
            style={{ width: 28, height: 28, color: "#b0a898", flexShrink: 0 }}
            aria-label="Next month"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* ── Selection banner ── */}
      {rangeLabel && (
        <div
          className="flex items-center gap-2 rounded-full"
          style={{
            background: theme.accentLight,
            color: theme.accentDark,
            padding: "5px 12px 5px 10px",
            border: `1px solid ${theme.accent}22`,
          }}
        >
          <CalendarDays size={11} style={{ flexShrink: 0 }} />
          <span className="flex-1 font-mono truncate" style={{ fontSize: "0.7rem" }}>
            {rangeLabel}
          </span>
          <button
            onClick={clearSelection}
            className="hover:opacity-70 transition-opacity flex-shrink-0"
          >
            <X size={11} />
          </button>
        </div>
      )}

      {/* ── Day-of-week headers ── */}
      <div className={`grid grid-cols-7 ${animClass}`}>
        {DAYS_OF_WEEK.map((d) => (
          <div
            key={d}
            className="text-center font-mono font-medium tracking-wider pb-1"
            style={{
              color: d === "Sat" || d === "Sun" ? theme.accent : "#c0b8ae",
              fontSize: "0.6rem",
              letterSpacing: "0.06em",
            }}
          >
            {d}
          </div>
        ))}

        {/* Day cells */}
        {allCells.map((day, i) => {
          const isOther = i < prefixBlanks || i >= prefixBlanks + daysInMonth.length;
          const moodKey = !isOther ? getMood(day) : null;
          return (
            <DayCell
              key={day.toISOString()}
              day={day}
              isStart={isStart(day)}
              isEnd={isEnd(day)}
              isInRange={isInRange(day)}
              isToday={isToday(day)}
              hasNote={hasNote(day)}
              hasMood={!isOther && hasMood(day)}
              moodKey={moodKey}
              theme={theme}
              isOtherMonth={isOther}
              onMouseEnter={() => !isOther && setHoverDate(day)}
              onClick={() => !isOther && handleDayClick(day)}
            />
          );
        })}
      </div>

      {/* ── Holidays ── */}
      {monthHolidays.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <div className="h-px flex-1" style={{ background: `${theme.accent}18` }} />
            <span
              className="font-mono uppercase tracking-widest px-1"
              style={{ color: theme.accent + "60", fontSize: "0.52rem" }}
            >
              This month
            </span>
            <div className="h-px flex-1" style={{ background: `${theme.accent}18` }} />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {monthHolidays.map((d) => {
              const k = `${d.getMonth() + 1}-${d.getDate()}`;
              const h = HOLIDAYS[k];
              return (
                <div
                  key={k}
                  className="flex items-center gap-1.5 rounded-full"
                  style={{
                    background: theme.accentLight,
                    border: `1px solid ${theme.accent}20`,
                    padding: "3px 10px 3px 5px",
                  }}
                >
                  <span
                    className="flex items-center justify-center rounded-full font-mono font-bold flex-shrink-0"
                    style={{
                      width: 18,
                      height: 18,
                      background: theme.accent,
                      color: "white",
                      fontSize: "0.5rem",
                    }}
                  >
                    {format(d, "d")}
                  </span>
                  <span
                    className="font-mono"
                    style={{ color: theme.accentDark, fontSize: "0.58rem" }}
                  >
                    {h.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Legend ── */}
      <div
        className="flex items-center justify-between pt-1.5 border-t"
        style={{ borderColor: `${theme.accent}12` }}
      >
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1" style={{ color: "#b0a898", fontSize: "0.6rem" }}>
            <span className="w-2 h-2 rounded-full" style={{ background: theme.accent }} />
            Weekend
          </span>
          <span className="flex items-center gap-1" style={{ color: "#b0a898", fontSize: "0.6rem" }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: theme.accent, opacity: 0.5 }} />
            Holiday
          </span>
          <span className="flex items-center gap-1" style={{ color: "#b0a898", fontSize: "0.6rem" }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#4caf78" }} />
            Mood
          </span>
        </div>
      </div>
    </div>
  );
}