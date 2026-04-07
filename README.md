# 🗓 Wall Calendar — Interactive React Component

A polished, premium wall-calendar web app built with React, Tailwind CSS, date-fns, and Framer Motion.

## ✨ Features

| Feature | Details |
|---|---|
| **Wall Calendar Aesthetic** | Physical spiral-bound look with hero photography, Playfair Display typography, paper texture |
| **Date Range Selector** | Click start → hover for live preview → click end. Visual states for start, end, in-range, today |
| **Integrated Notes** | Attach notes to any date/range; auto-saved to `localStorage`; persists on refresh |
| **Image-Driven Theming** | 4 curated Unsplash images (Alpine, Forest, Desert, Ocean); accent colors cascade to the entire UI |
| **Responsive** | Two-column desktop (image + calendar/notes); single-column stacked mobile |
| **Month Navigation** | Slide animation between months; "Today" quick-jump button |
| **Holiday Markers** | Public holidays dot-marked on the grid |
| **Note indicators** | Days with notes show a dot badge |

## 🚀 Quick Start

```bash
npm install
npm start
```

Opens at `http://localhost:3000`

## 📦 Build for production

```bash
npm run build
```

## 🛠 Architecture

```
src/
├── hooks/
│   └── useCalendar.js        # ALL business logic: state, date math, localStorage
├── components/
│   ├── WallCalendar.jsx      # Root layout (desktop/mobile split)
│   ├── HeroVisual.jsx        # Image panel + theme switcher dots
│   ├── CalendarGrid.jsx      # Month grid, navigation header
│   ├── DayCell.jsx           # Individual day: all visual states
│   └── NotesPanel.jsx        # Notes input + saved list
├── utils/
│   └── themes.js             # Image URLs, accent colors, holidays
└── index.css                 # Spiral dots, paper texture, animations
```

## 🎨 Design Decisions

- **Playfair Display** for the month name — editorial, luxe feel
- **DM Sans + DM Mono** for body/labels — clean, modern contrast
- **Accent color** extracted per theme and cascaded down via props — cohesive magazine feel
- **Range highlighting** uses a band + rounded caps pattern (not box-select) for elegance
- **Slide animation** on month change uses pure CSS (`translateX` keyframes)
- **No UI library** — 100% custom Tailwind + CSS

## 📱 Responsive Behavior

- **≥ 768px**: Side-by-side — image left, calendar + notes right
- **< 768px**: Stacked — image → grid → notes, full touch-friendly tap targets

## 🔗 Tech Stack

- React 18
- Tailwind CSS 3
- date-fns 3
- lucide-react (icons)
- framer-motion (available for extension)