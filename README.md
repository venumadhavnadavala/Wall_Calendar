# 🗓 Wall Calendar — Interactive React Component

[cite_start]A polished, high-fidelity wall-calendar web app built with React, Tailwind CSS, and Framer Motion[cite: 3, 27]. [cite_start]This project was developed as a **Frontend Engineering Challenge**, translating a static wall-calendar design into a highly functional, responsive digital component[cite: 3, 4, 46].

## ✨ Features

[cite_start]Your implementation covers all core requirements and several bonus features mentioned in the challenge[cite: 24, 25, 36]:

| Feature | Details |
|---|---|
| **Wall Calendar Aesthetic** | [cite_start]Features a dedicated space for a hero image as a visual anchor, paired with an authentic spiral-binding design and paper-texture UI[cite: 7, 26, 27]. |
| **Day Range Selector** | Users can select a start and end date across the grid. [cite_start]Includes clear visual states for start, end, and in-range dates[cite: 28, 29]. |
| **Integrated Notes** | [cite_start]Functional area to jot down general memos or attach notes to specific date ranges; auto-saved to `localStorage`[cite: 30, 48]. |
| **Responsive Design** | [cite_start]Adapts flawlessly to different screen sizes: side-by-side arrangement for desktop and a stacked vertical layout for mobile[cite: 31, 32, 35]. |
| **Interactive Themes** | [cite_start]Immersive theme switching (e.g., Sakura, Desert, Forest) that updates the hero imagery and cascades accent colors throughout the UI[cite: 37]. |
| **Mood Tracker** | [cite_start]Extra feature allowing users to log daily energy/mood, visualized via color-coded badges and a range summary chart[cite: 36, 37]. |
| **Holiday Markers** | [cite_start]Public holidays are automatically identified and dot-marked on the calendar grid[cite: 37]. |

## 🚀 Quick Start

```bash
npm install
npm run dev
```

The app is built using **Vite** and typically opens at `http://localhost:5173`.

## 📦 Data Persistence
[cite_start]Following the challenge guidelines to focus strictly on frontend engineering, this application utilizes client-side storage[cite: 46, 47]:
* [cite_start]**localStorage**: All notes, mood logs, and theme preferences are saved locally and persist through page refreshes[cite: 48].

## 🛠 Architecture

```
src/
├── hooks/
│   └── useCalendar.js      # Core logic: Navigation, range selection, mood/note persistence
├── components/
│   ├── WallCalendar.jsx    # Main Layout: Handles desktop/mobile responsive split & spiral binding
│   ├── HeroVisual.jsx      # Image panel, theme flip animations, and theme switcher
│   ├── CalendarGrid.jsx    # Date math for grid, navigation, and holiday identification
│   ├── DayCell.jsx         # Individual day: Handles range bands, holiday dots, and mood badges
│   └── NotesPanel.jsx      # Multi-tab UI: Note Editor, Mood Logger, and Range Summary
├── utils/
│   └── themes.js           # Configuration: Theme colors, Image URLs, Holiday data, Mood metadata
└── index.css               # Design System: Spiral binding CSS, paper texture, and animations
```

## 🎨 Design Decisions

* **Editorial Typography**: Uses **Playfair Display** for headings and **DM Mono** for metadata to achieve a high-end luxury feel.
* **Cohesive Accents**: Theme colors are extracted per theme and cascaded down via props for a cohesive magazine aesthetic.
* [cite_start]**Custom UI**: Built with 100% custom Tailwind + CSS to avoid generic UI library limitations and ensure pixel-perfect design translation[cite: 49, 50].
* [cite_start]**Range Highlighting**: Uses an elegant band + rounded caps pattern (rather than a simple box-select) for a more organic feel[cite: 29].

## 📱 Responsive Behavior

* [cite_start]**Desktop (≥ 768px)**: Side-by-side arrangement — hero image on the left, calendar and notes on the right[cite: 32, 34].
* [cite_start]**Mobile (< 768px)**: Stacked vertically — image → grid → notes, with full touch-friendly tap targets[cite: 35].

## 🔗 Submission Links

* [cite_start]**Live Demo**: [wall-calendar-two.vercel.app](https://wall-calendar-two.vercel.app/) [cite: 44]
* [cite_start]**Video Demonstration**: [Insert Link to Loom/YouTube] [cite: 42, 43]

## 🛠 Tech Stack

* [cite_start]React 18 [cite: 3]
* Tailwind CSS 4
* date-fns 3
* lucide-react (icons)
* [cite_start]framer-motion (animations) [cite: 37]