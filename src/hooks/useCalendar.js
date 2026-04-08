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

const NOTES_KEY  = "wall-calendar-notes-v2";
const MOODS_KEY  = "wall-calendar-moods-v1";
const THEME_KEY  = "wall-calendar-theme";

function loadJSON(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveJSON(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
}

export function useCalendar() {
  const today = new Date();

  // ── Navigation ────────────────────────────────────────────────────────────
  const [currentDate, setCurrentDate] = useState(today);
  const [slideDir, setSlideDir]       = useState(null);

  // ── Theme ─────────────────────────────────────────────────────────────────
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

  // ── Date range ────────────────────────────────────────────────────────────
  const [startDate,  setStartDate]  = useState(null);
  const [endDate,    setEndDate]    = useState(null);
  const [hoverDate,  setHoverDate]  = useState(null);
  const [selecting,  setSelecting]  = useState(false);

  const handleDayClick = useCallback(
    (day) => {
      if (!selecting || !startDate) {
        setStartDate(day);
        setEndDate(null);
        setSelecting(true);
      } else {
        if (isSameDay(day, startDate)) {
          setStartDate(null);
          setEndDate(null);
          setSelecting(false);
          return;
        } else if (isBefore(day, startDate)) {
          setEndDate(startDate);
          setStartDate(day);
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

  const isStart   = useCallback((day) => startDate && isSameDay(day, startDate), [startDate]);
  const isEnd     = useCallback((day) => endDate   && isSameDay(day, endDate),   [endDate]);
  const isInRange = useCallback(
    (day) => {
      const effectiveEnd = endDate || (selecting ? hoverDate : null);
      if (!startDate || !effectiveEnd) return false;
      const [s, e] = isAfter(effectiveEnd, startDate)
        ? [startDate, effectiveEnd]
        : [effectiveEnd, startDate];
      return (
        isWithinInterval(day, { start: s, end: e }) &&
        !isSameDay(day, s) &&
        !isSameDay(day, e)
      );
    },
    [startDate, endDate, hoverDate, selecting]
  );

  const isToday = useCallback((day) => isSameDay(day, today), []);

  // ── Navigation ────────────────────────────────────────────────────────────
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

  useEffect(() => {
    if (slideDir) {
      const t = setTimeout(() => setSlideDir(null), 350);
      return () => clearTimeout(t);
    }
  }, [slideDir]);

  // ── Grid ──────────────────────────────────────────────────────────────────
  const monthStart   = startOfMonth(currentDate);
  const monthEnd     = endOfMonth(currentDate);
  const daysInMonth  = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDow     = getDay(monthStart);
  const prefixBlanks = startDow === 0 ? 6 : startDow - 1;

  // ── Notes ─────────────────────────────────────────────────────────────────
  const [allNotes, setAllNotes] = useState(() => loadJSON(NOTES_KEY));
  const [draftNote, setDraftNote] = useState("");

  const noteKey =
    startDate && endDate
      ? `${format(startDate, "yyyy-MM-dd")}__${format(endDate, "yyyy-MM-dd")}`
      : startDate
      ? format(startDate, "yyyy-MM-dd")
      : null;

  useEffect(() => {
    setDraftNote(noteKey ? allNotes[noteKey] ?? "" : "");
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
      saveJSON(NOTES_KEY, updated);
      setDraftNote(text);
    },
    [noteKey, allNotes]
  );

  const hasNote = useCallback(
    (day) => {
      const k = format(day, "yyyy-MM-dd");
      return Object.keys(allNotes).some(
        (key) => key === k || key.startsWith(k + "__") || key.endsWith("__" + k)
      );
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

  // ── Moods ─────────────────────────────────────────────────────────────────
  // Stored as { "yyyy-MM-dd": "great" | "good" | "ok" | "low" | "rough" }
  const [allMoods, setAllMoods] = useState(() => loadJSON(MOODS_KEY));

  const saveMood = useCallback(
    (day, moodKey) => {
      const dk = format(day, "yyyy-MM-dd");
      const updated = { ...allMoods };
      if (moodKey) {
        updated[dk] = moodKey;
      } else {
        delete updated[dk];
      }
      setAllMoods(updated);
      saveJSON(MOODS_KEY, updated);
    },
    [allMoods]
  );

  const getMood = useCallback(
    (day) => allMoods[format(day, "yyyy-MM-dd")] ?? null,
    [allMoods]
  );

  const hasMood = useCallback(
    (day) => !!allMoods[format(day, "yyyy-MM-dd")],
    [allMoods]
  );

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
    allMoods,
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
    saveMood,
    getMood,
    hasMood,
  };
}