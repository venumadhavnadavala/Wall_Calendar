import React from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { HOLIDAYS, getMoodColor } from "../utils/themes";

export default function DayCell({
  day,
  isStart,
  isEnd,
  isInRange,
  isToday,
  hasNote,
  hasMood,
  moodKey,
  theme,
  onMouseEnter,
  onClick,
  isOtherMonth = false,
}) {
  const dateNum  = format(day, "d");
  const monthNum = format(day, "M");
  const holiday  = HOLIDAYS[`${monthNum}-${dateNum}`];
  const dow      = day.getDay();
  const isWeekend = dow === 0 || dow === 6;
  const isSelected = isStart || isEnd;
  const moodColor  = moodKey ? getMoodColor(moodKey) : null;

  // Range band geometry
  let rangeLeft = "50%", rangeRight = "0";
  if (isStart && !isEnd) {
    rangeLeft = "50%"; rangeRight = "0";
  } else if (isEnd && !isStart) {
    rangeLeft = "0"; rangeRight = "50%";
  } else if (isInRange) {
    rangeLeft = "0"; rangeRight = "0";
  }

  const showBand = isInRange || (isStart && !isEnd) || (isEnd && !isStart);

  return (
    <div
      className="relative flex flex-col items-center justify-start"
      style={{ height: 44 }}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      {/* Range band */}
      {showBand && (
        <div
          className="absolute"
          style={{
            top: 4,
            left: rangeLeft,
            right: rangeRight,
            height: 36,
            background: theme.accentLight,
            borderRadius: 0,
            zIndex: 0,
          }}
        />
      )}

      {/* Day button */}
      <motion.button
        whileTap={!isOtherMonth ? { scale: 0.82 } : {}}
        transition={{ type: "spring", stiffness: 500, damping: 20 }}
        className="relative z-10 flex items-center justify-center rounded-full text-sm select-none focus:outline-none"
        style={{
          width: 36,
          height: 36,
          marginTop: 4,
          fontWeight: isSelected ? 700 : isToday ? 700 : isWeekend ? 500 : 400,
          fontFamily: "inherit",
          cursor: isOtherMonth ? "default" : "pointer",
          background: isSelected
            ? theme.accent
            : isToday
            ? "white"
            : "transparent",
          color: isSelected
            ? "white"
            : isOtherMonth
            ? "#ccc"
            : isWeekend
            ? theme.accent
            : "#1a1a1a",
          boxShadow: isSelected
            ? `0 3px 10px ${theme.accent}60`
            : isToday
            ? `0 0 0 2px ${theme.accent}`
            : "none",
          transition: "background 0.15s, box-shadow 0.15s, color 0.15s",
        }}
        aria-label={format(day, "MMMM d, yyyy")}
        title={holiday?.name}
      >
        {dateNum}
      </motion.button>

      {/* Holiday dot — top-right corner */}
      {holiday && !isOtherMonth && (
        <div
          className="absolute"
          style={{
            top: 3,
            right: 4,
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: theme.accent,
            opacity: 0.65,
            zIndex: 12,
          }}
        />
      )}

      {/* Mood dot — bottom centre (replaces fake productivity bar) */}
      {hasMood && !isOtherMonth && (
        <div
          style={{
            position: "absolute",
            bottom: 2,
            left: "50%",
            transform: "translateX(-50%)",
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: moodColor ?? theme.accentMid,
            border: "1.5px solid white",
            zIndex: 12,
          }}
        />
      )}

      {/* Note dot — shown when mood dot is absent */}
      {hasNote && !hasMood && !isOtherMonth && (
        <div
          style={{
            position: "absolute",
            bottom: 2,
            left: "50%",
            transform: "translateX(-50%)",
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: theme.accentDark,
            border: "1.5px solid white",
            zIndex: 12,
          }}
        />
      )}
    </div>
  );
}