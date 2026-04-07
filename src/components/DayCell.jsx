import React from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
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
  const holiday = HOLIDAYS[`${monthNum}-${dateNum}`];
  const dow = day.getDay();
  const isWeekend = dow === 0 || dow === 6;
  // ── Determine visual state ────────────────────────────────────────────────
  const isSelected = isStart || isEnd;

  // Determine exactly how the background band stretches
  let rangeClasses = "";
  if (isStart && isEnd) {
    rangeClasses = "hidden"; // No band needed for a single day, just the circle
  } else if (isStart) {
    rangeClasses = "rounded-l-full left-1/2 right-0"; // Start from center, stretch to right edge
  } else if (isEnd) {
    rangeClasses = "rounded-r-full right-1/2 left-0"; // Stretch from left edge to center
  } else if (isInRange) {
    rangeClasses = "left-0 right-0"; // Stretch fully edge-to-edge
  }

  return (
    <div
      className="relative flex items-center justify-center h-10 w-full"
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      {/* PERFECTLY SEAMLESS RANGE BAND */}
      {(isInRange || (isStart && !isEnd) || (isEnd && !isStart)) && (
        <div
          className={`absolute h-9 ${rangeClasses}`}
          style={{
            background: theme.accentLight,
            zIndex: 0
          }}
        />
      )}

      {/* DAY BUTTON */}
      <motion.button
        whileTap={!isOtherMonth ? { scale: 0.85 } : {}}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className={[
          "relative z-10 w-9 h-9 flex items-center justify-center rounded-full text-sm transition-colors duration-150 select-none",
          "focus:outline-none focus-visible:ring-2",
          isSelected ? "text-white font-semibold shadow-md" 
            : isToday ? "font-bold ring-2 bg-white"
            : isOtherMonth ? "text-neutral-300 cursor-default"
            : isWeekend ? "font-medium bg-transparent" : "font-normal bg-transparent",
          !isSelected && !isOtherMonth ? "hover:bg-neutral-100 cursor-pointer" : "",
        ].join(" ")}
        style={{
          background: isSelected ? theme.accent : isToday ? "white" : undefined,
          color: isSelected ? "white" : isOtherMonth ? "#d1c9c0" : isWeekend ? theme.accent : "#1a1a1a",
          ringColor: isToday ? theme.accent : undefined,
          boxShadow: isSelected ? `0 4px 12px ${theme.accent}55` : undefined,
        }}
        aria-label={format(day, "MMMM d, yyyy")}
        title={holiday || undefined}
      >
        {dateNum}
      </motion.button>

      {/* INDICATORS (Positioned so they don't overlap) */}
      {holiday && !isOtherMonth && (
        <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full" style={{ background: theme.accent }} />
      )}
      {hasNote && !isOtherMonth && (
        <div className="absolute bottom-0.5 w-1 h-1 rounded-full ring-2 ring-white" style={{ background: theme.accentDark }} />
      )}
    </div>
  );
}