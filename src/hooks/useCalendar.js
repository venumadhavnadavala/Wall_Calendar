import { useState, useEffect, useCallback } from "react";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isWithinInterval,
  isAfter,
  isBefore,
  addMonths,
  subMonths,
  getDay,
  format,
} from "date-fns";
import { THEMES } from "../utils/themes";

const NOTES_KEY = "wall-calendar-notes-v2";
const THEME_KEY = "wall-calendar-theme";

function loadNotes() {
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveNotes(notes) {
  try {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  } catch {}
}

export function useCalendar() {
  const today = new Date();

  // ── Navigation state ──────────────────────────────────────────────────────
  const [currentDate, setCurrentDate] = useState(today);
  const [slideDir, setSlideDir] = useState(null); // "left" | "right"

  // ── Theme state ───────────────────────────────────────────────────────────
  const [themeIndex, setThemeIndex] = useState(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      return saved ? Number(saved) : 0;
    } catch {
      return 0;
    }
  });

  const theme = THEMES[themeIndex];

  const cycleTheme = useCallback(() => {
    setThemeIndex((i) => {
      const next = (i + 1) % THEMES.length;
      localStorage.setItem(THEME_KEY, String(next));
      return next;
    });
  }, []);

  const setTheme = useCallback((i) => {
    setThemeIndex(i);
    localStorage.setItem(THEME_KEY, String(i));
  }, []);

  // ── Date range state ──────────────────────────────────────────────────────
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);
  const [selecting, setSelecting] = useState(false); // mid-selection

  const handleDayClick = useCallback(
    (day) => {
      if (!selecting || !startDate) {
        // First click — set start
        setStartDate(day);
        setEndDate(null);
        setSelecting(true);
      } else {
        // Second click — set end
        if (isBefore(day, startDate)) {
          // Clicked before start — swap
          setEndDate(startDate);
          setStartDate(day);
        } else if (isSameDay(day, startDate)) {
          // Same day — deselect
          setStartDate(null);
          setEndDate(null);
          setSelecting(false);
          return;
        } else {
          setEndDate(day);
        }
        setSelecting(false);
        setHoverDate(null);
      }
    },
    [selecting, startDate]
  );

  const clearSelection = useCallback(() => {
    setStartDate(null);
    setEndDate(null);
    setHoverDate(null);
    setSelecting(false);
  }, []);

  const isStart = useCallback(
    (day) => startDate && isSameDay(day, startDate),
    [startDate]
  );

  const isEnd = useCallback(
    (day) => endDate && isSameDay(day, endDate),
    [endDate]
  );

  const isInRange = useCallback(
    (day) => {
      const effectiveEnd = endDate || (selecting ? hoverDate : null);
      if (!startDate || !effectiveEnd) return false;
      const [s, e] = isAfter(effectiveEnd, startDate)
        ? [startDate, effectiveEnd]
        : [effectiveEnd, startDate];
      return isWithinInterval(day, { start: s, end: e }) &&
        !isSameDay(day, s) &&
        !isSameDay(day, e);
    },
    [startDate, endDate, hoverDate, selecting]
  );

  const isToday = useCallback((day) => isSameDay(day, today), []);

  // ── Month navigation ──────────────────────────────────────────────────────
  const goNext = useCallback(() => {
    setSlideDir("left");
    setCurrentDate((d) => addMonths(d, 1));
  }, []);

  const goPrev = useCallback(() => {
    setSlideDir("right");
    setCurrentDate((d) => subMonths(d, 1));
  }, []);

  const goToToday = useCallback(() => {
    const isNext = isAfter(today, currentDate);
    setSlideDir(isNext ? "left" : "right");
    setCurrentDate(today);
  }, [currentDate]);

  // Reset slide dir after animation
  useEffect(() => {
    if (slideDir) {
      const t = setTimeout(() => setSlideDir(null), 350);
      return () => clearTimeout(t);
    }
  }, [slideDir]);

  // ── Build calendar grid ───────────────────────────────────────────────────
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // getDay: 0=Sun, 1=Mon … 6=Sat. We want Mon=0 offset.
  const startDow = getDay(monthStart); // 0(Sun)..6(Sat)
  const prefixBlanks = startDow === 0 ? 6 : startDow - 1;

  // ── Notes state ───────────────────────────────────────────────────────────
  const [allNotes, setAllNotes] = useState(loadNotes);
  const [draftNote, setDraftNote] = useState("");

  // Derive the key for the current selection
  const noteKey =
    startDate && endDate
      ? `${format(startDate, "yyyy-MM-dd")}__${format(endDate, "yyyy-MM-dd")}`
      : startDate
      ? format(startDate, "yyyy-MM-dd")
      : null;

  // Sync draft when selection changes
  useEffect(() => {
    if (noteKey) {
      setDraftNote(allNotes[noteKey] || "");
    } else {
      setDraftNote("");
    }
  }, [noteKey]);

  const saveNote = useCallback(
    (text) => {
      if (!noteKey) return;
      const updated = { ...allNotes };
      if (text.trim() === "") {
        delete updated[noteKey];
      } else {
        updated[noteKey] = text;
      }
      setAllNotes(updated);
      saveNotes(updated);
      setDraftNote(text);
    },
    [noteKey, allNotes]
  );

  const hasNote = useCallback(
    (day) => {
      const k = format(day, "yyyy-MM-dd");
      return Object.keys(allNotes).some((key) => key === k || key.startsWith(k + "__") || key.endsWith("__" + k));
    },
    [allNotes]
  );

  const savedNotesList = Object.entries(allNotes).map(([key, text]) => ({
    key,
    text,
    dates: key.includes("__")
      ? key.split("__").map((d) => new Date(d))
      : [new Date(key)],
  }));

  return {
    // State
    currentDate,
    today,
    theme,
    themeIndex,
    startDate,
    endDate,
    hoverDate,
    selecting,
    slideDir,
    daysInMonth,
    prefixBlanks,
    allNotes,
    noteKey,
    draftNote,
    savedNotesList,
    // Handlers
    setHoverDate,
    handleDayClick,
    clearSelection,
    isStart,
    isEnd,
    isInRange,
    isToday,
    goNext,
    goPrev,
    goToToday,
    cycleTheme,
    setTheme,
    saveNote,
    hasNote,
    setDraftNote,
  };
}