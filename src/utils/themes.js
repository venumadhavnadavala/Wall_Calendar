// ── THEMES ────────────────────────────────────────────────────────────────────
export const THEMES = [
  {
    id: "sakura",
    label: "Sakura Spring",
    tag: "Spring",
    image: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&q=80",
    accent: "#c0737a",
    accentLight: "#fce8ea",
    accentDark: "#8a3a40",
    accentMid: "#e8a0a6",
    bg: "#fff8f8",
    season: "spring",
  },
  {
    id: "desert",
    label: "Desert Canyon",
    tag: "Desert",
    image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80",
    accent: "#c47a2b",
    accentLight: "#fdf0dc",
    accentDark: "#7a4a10",
    accentMid: "#e8b070",
    bg: "#fdf8f0",
    season: "desert",
  },
  {
    id: "ocean",
    label: "Ocean Mist",
    tag: "Coast",
    image: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80",
    accent: "#2e7ab4",
    accentLight: "#deeef9",
    accentDark: "#1a4f78",
    accentMid: "#7ab4de",
    bg: "#f0f7fd",
    season: "winter",
  },
  {
    id: "forest",
    label: "Forest Canopy",
    tag: "Forest",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80",
    accent: "#3a7a4a",
    accentLight: "#dff0e4",
    accentDark: "#1e4e2a",
    accentMid: "#7aaa84",
    bg: "#f3f9f4",
    season: "summer",
  },
  {
    id: "autumn",
    label: "Autumn Embers",
    tag: "Autumn",
    image: "https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?w=800&q=80",
    accent: "#c05a1a",
    accentLight: "#fdeede",
    accentDark: "#7a3208",
    accentMid: "#e0986a",
    bg: "#fdf6f0",
    season: "autumn",
  },
];

export const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

// Key: "M-D" (no zero-padding)
export const HOLIDAYS = {
  "1-1":   { name: "New Year's Day" },
  "1-26":  { name: "Republic Day" },
  "2-14":  { name: "Valentine's Day" },
  "3-8":   { name: "Women's Day" },
  "3-29":  { name: "Good Friday" },
  "3-31":  { name: "Easter Sunday" },
  "4-14":  { name: "Ambedkar Jayanti" },
  "4-18":  { name: "Good Friday" },
  "5-1":   { name: "Labour Day" },
  "6-21":  { name: "Summer Solstice" },
  "8-15":  { name: "Independence Day" },
  "10-2":  { name: "Gandhi Jayanti" },
  "10-24": { name: "Dussehra" },
  "11-1":  { name: "Diwali" },
  "12-25": { name: "Christmas" },
  "12-31": { name: "New Year's Eve" },
};

// ── MOOD SYSTEM ───────────────────────────────────────────────────────────────
// Replaces the old fake getDayScore() function.
// Mood entries are stored in localStorage keyed by "yyyy-M-d".
// Each entry is one of the MOOD_KEYS below.

export const MOODS = [
  { key: "great", label: "Great",  emoji: "✦", color: "#4caf78" },
  { key: "good",  label: "Good",   emoji: "◆", color: "#7ab4de" },
  { key: "ok",    label: "Okay",   emoji: "◇", color: "#e8a0a6" },
  { key: "low",   label: "Low",    emoji: "▽", color: "#e0a070" },
  { key: "rough", label: "Rough",  emoji: "▼", color: "#b0a898" },
];

// Maps mood key → a 0-100 percentage used for the bar chart in Summary
export const MOOD_PCT = {
  great: 100,
  good:  80,
  ok:    55,
  low:   35,
  rough: 15,
};

export function getMoodColor(moodKey) {
  return MOODS.find((m) => m.key === moodKey)?.color ?? "#e8a0a6";
}

export function getMoodPct(moodKey) {
  return MOOD_PCT[moodKey] ?? 0;
}