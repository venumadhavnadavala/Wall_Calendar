import React from "react";
import { format } from "date-fns";
import { HOLIDAYS } from "../utils/themes";

export default function DayCell({
  day,
  isStart,
  isEnd,
  isInRange,
  isToday,
  hasNote,
  theme,
  onMouseEnter,
  onClick,
  isOtherMonth = false,
}) {
  const dateNum = format(day, "d");
  const monthNum = format(day, "M");
  const holidayKey = `${monthNum}-${dateNum}`;
  const holiday = HOLIDAYS[holidayKey];
  const dow = day.getDay(); // 0=Sun
  const isWeekend = dow === 0 || dow === 6;

  // ── Determine visual state ────────────────────────────────────────────────
  const isSelected = isStart || isEnd;
  const isRangeEdge = isStart || isEnd;

  // Range highlight background (the band across)
  let rangeBg = "transparent";
  if (isInRange) rangeBg = theme.accentLight;
  else if (isStart && !isEnd) rangeBg = "transparent"; // single date

  // Range rounding: left cap for start, right cap for end, square middle
  let rangeRoundClass = "";
  if (isStart && isEnd) rangeRoundClass = "";
  else if (isStart) rangeRoundClass = "rounded-l-full";
  else if (isEnd) rangeRoundClass = "rounded-r-full";

  return (
    <div
      className="relative flex flex-col items-center"
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      {/* Range band (behind the circle) */}
      {(isInRange || (isStart && !isEnd) || (isEnd && !isStart)) && (
        <div
          className={`absolute inset-y-0 left-0 right-0 ${rangeRoundClass}`}
          style={{
            background: isInRange
              ? theme.accentLight
              : (isStart || isEnd) && !isStart !== !isEnd
              ? theme.accentLight
              : "transparent",
            top: "4px",
            bottom: "4px",
          }}
        />
      )}

      {/* Day number circle */}
      <button
        className={[
          "relative z-10 w-9 h-9 flex items-center justify-center rounded-full",
          "text-sm transition-all duration-150 select-none",
          "focus:outline-none focus-visible:ring-2",
          isSelected
            ? "text-white font-semibold shadow-md"
            : isToday
            ? "font-bold ring-2"
            : isOtherMonth
            ? "text-neutral-300 cursor-default"
            : isWeekend
            ? "font-medium"
            : "font-normal",
          !isSelected && !isOtherMonth
            ? "hover:bg-neutral-100 cursor-pointer"
            : "",
        ].join(" ")}
        style={{
          background: isSelected ? theme.accent : undefined,
          color: isSelected
            ? "white"
            : isOtherMonth
            ? "#d1c9c0"
            : isWeekend
            ? theme.accent
            : "#1a1a1a",
          ringColor: isToday ? theme.accent : undefined,
          boxShadow: isSelected
            ? `0 2px 8px ${theme.accent}55`
            : undefined,
        }}
        aria-label={format(day, "MMMM d, yyyy")}
        title={holiday || undefined}
      >
        {dateNum}
      </button>

      {/* Holiday dot */}
      {holiday && !isOtherMonth && (
        <div
          className="absolute bottom-0.5 w-1 h-1 rounded-full"
          style={{ background: isSelected ? "rgba(255,255,255,0.8)" : theme.accent }}
          title={holiday}
        />
      )}

      {/* Note indicator */}
      {hasNote && !isOtherMonth && (
        <div
          className="absolute top-0.5 right-1 w-1.5 h-1.5 rounded-full"
          style={{ background: theme.accent, opacity: 0.75 }}
        />
      )}
    </div>
  );
}