// Each theme has: an Unsplash image, an accent color class + hex, and a label.
// Images chosen to be visually distinct and high-quality.

export const THEMES = [
  {
    id: "mountains",
    label: "Alpine",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=85&auto=format&fit=crop",
    accent: "#1d6fa8",
    accentLight: "#dbeafe",
    accentDark: "#1e3a5f",
    pill: "bg-blue-600",
    tag: "Peaks",
  },
  {
    id: "forest",
    label: "Forest",
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=85&auto=format&fit=crop",
    accent: "#2d6a4f",
    accentLight: "#d1fae5",
    accentDark: "#1b4332",
    pill: "bg-emerald-700",
    tag: "Grove",
  },
  {
    id: "desert",
    label: "Desert",
    image:
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200&q=85&auto=format&fit=crop",
    accent: "#c2680a",
    accentLight: "#fef3c7",
    accentDark: "#78350f",
    pill: "bg-amber-600",
    tag: "Dunes",
  },
  {
    id: "ocean",
    label: "Ocean",
    image:
      "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1200&q=85&auto=format&fit=crop",
    accent: "#0e7490",
    accentLight: "#cffafe",
    accentDark: "#164e63",
    pill: "bg-cyan-700",
    tag: "Waves",
  },
];

export const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Public holidays (US) for the current year — used as markers
export const HOLIDAYS = {
  "1-1": "New Year's Day",
  "7-4": "Independence Day",
  "12-25": "Christmas",
  "12-31": "New Year's Eve",
  "11-28": "Thanksgiving",
  "2-14": "Valentine's Day",
  "10-31": "Halloween",
  "3-17": "St. Patrick's Day",
};