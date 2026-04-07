import React from "react";
import { format, addMonths, subMonths, endOfMonth, eachDayOfInterval, startOfMonth } from "date-fns";
import { ChevronLeft, ChevronRight, CalendarDays, X } from "lucide-react";
import { DAYS_OF_WEEK, MONTHS } from "../utils/themes";
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
  setHoverDate,
  handleDayClick,
  clearSelection,
  goNext,
  goPrev,
  goToToday,
}) {
  const year = format(currentDate, "yyyy");
  const monthName = MONTHS[currentDate.getMonth()];

  // Trailing days from next month to fill last row
  const totalCells = prefixBlanks + daysInMonth.length;
  const trailingCount = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);

  const prevMonthEnd = endOfMonth(subMonths(currentDate, 1));
  const prevDays = Array.from({ length: prefixBlanks }, (_, i) => {
    const d = new Date(prevMonthEnd);
    d.setDate(prevMonthEnd.getDate() - (prefixBlanks - 1 - i));
    return d;
  });

  const nextMonthStart = startOfMonth(addMonths(currentDate, 1));
  const nextDays = Array.from({ length: trailingCount }, (_, i) => {
    const d = new Date(nextMonthStart);
    d.setDate(i + 1);
    return d;
  });

  const allCells = [...prevDays, ...daysInMonth, ...nextDays];

  const animClass = slideDir === "left"
    ? "slide-in-left"
    : slideDir === "right"
    ? "slide-in-right"
    : "";

  const rangeLabel =
    startDate && endDate
      ? `${format(startDate, "MMM d")} – ${format(endDate, "MMM d, yyyy")}`
      : startDate
      ? `${format(startDate, "MMM d, yyyy")} — click another day`
      : null;

  return (
    <div className="flex flex-col h-full px-6 py-5 gap-4">
      {/* Month/year header */}
      <div className="flex items-start justify-between">
        <div className={animClass}>
          <div
            className="text-xs font-mono tracking-widest uppercase mb-0.5"
            style={{ color: theme.accent }}
          >
            {year}
          </div>
          <h2
            className="font-display font-black tracking-tight leading-none text-neutral-900"
            style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}
          >
            {monthName}
          </h2>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-1 mt-1">
          <button
            onClick={goToToday}
            className="text-xs font-mono px-2.5 py-1 rounded-full border transition-all hover:shadow-sm"
            style={{
              borderColor: theme.accent + "66",
              color: theme.accent,
            }}
            title="Go to today"
          >
            Today
          </button>
          <button
            onClick={goPrev}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors text-neutral-500 hover:text-neutral-900"
            aria-label="Previous month"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={goNext}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors text-neutral-500 hover:text-neutral-900"
            aria-label="Next month"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Selection banner */}
      {rangeLabel && (
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono"
          style={{
            background: theme.accentLight,
            color: theme.accentDark,
          }}
        >
          <CalendarDays size={12} />
          <span className="flex-1">{rangeLabel}</span>
          <button
            onClick={clearSelection}
            className="hover:opacity-70 transition-opacity"
            aria-label="Clear selection"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Day-of-week headers */}
      <div className={`grid grid-cols-7 ${animClass}`}>
        {DAYS_OF_WEEK.map((d) => (
          <div
            key={d}
            className="text-center text-xs font-mono font-medium tracking-wider pb-2"
            style={{
              color:
                d === "Sat" || d === "Sun"
                  ? theme.accent
                  : "#9a9080",
            }}
          >
            {d}
          </div>
        ))}

        {/* Day cells */}
        {allCells.map((day, i) => {
          const isOther = i < prefixBlanks || i >= prefixBlanks + daysInMonth.length;
          return (
            <DayCell
              key={day.toISOString()}
              day={day}
              isStart={isStart(day)}
              isEnd={isEnd(day)}
              isInRange={isInRange(day)}
              isToday={isToday(day)}
              hasNote={hasNote(day)}
              theme={theme}
              isOtherMonth={isOther}
              onMouseEnter={() => !isOther && setHoverDate(day)}
              onClick={() => !isOther && handleDayClick(day)}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs font-mono mt-auto pt-2 border-t border-neutral-100">
        <span className="flex items-center gap-1.5 text-neutral-400">
          <span
            className="w-2.5 h-2.5 rounded-full inline-block"
            style={{ background: theme.accent }}
          />
          Weekend
        </span>
        <span className="flex items-center gap-1.5 text-neutral-400">
          <span
            className="w-2.5 h-2.5 rounded-full inline-block ring-2"
            style={{ background: "white", ringColor: theme.accent }}
          />
          Holiday
        </span>
        <span className="flex items-center gap-1.5 text-neutral-400">
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{ background: theme.accent, opacity: 0.7 }}
          />
          Has note
        </span>
      </div>
    </div>
  );
}