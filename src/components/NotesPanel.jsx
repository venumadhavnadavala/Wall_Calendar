import React, { useRef, useEffect, useState } from "react";
import { format, eachDayOfInterval } from "date-fns";
import { PenLine, Trash2, StickyNote, TrendingUp, Check, Smile } from "lucide-react";
import { MOODS, getMoodColor, getMoodPct } from "../utils/themes";

export default function NotesPanel({
  theme,
  startDate,
  endDate,
  noteKey,
  draftNote,
  saveNote,
  savedNotesList,
  setDraftNote,
  // mood props
  allMoods,
  saveMood,
  getMood,
}) {
  const textareaRef = useRef(null);
  const [activeTab,    setActiveTab]    = useState("note");
  const [justSaved,    setJustSaved]    = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 150) + "px";
    }
  }, [draftNote]);

  // Reset tab & mood selection on date change
  useEffect(() => {
    setActiveTab("note");
    setSelectedMood(null);
  }, [noteKey]);

  const rangeLabel =
    startDate && endDate
      ? `${format(startDate, "MMM d")} – ${format(endDate, "MMM d")}`
      : startDate
      ? format(startDate, "MMMM d, yyyy")
      : null;

  // Only allow mood logging on a single day (not a range)
  const isSingleDay      = startDate && !endDate;
  const existingMoodKey  = isSingleDay ? getMood(startDate) : null;
  const activeMood       = selectedMood ?? existingMoodKey;

  const handleSaveNote = () => {
    saveNote(draftNote);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1600);
  };

  const handleSaveMood = () => {
    if (!isSingleDay || !activeMood) return;
    saveMood(startDate, activeMood);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1600);
  };

  const handleDelete = (key) => {
    try {
      const raw    = localStorage.getItem("wall-calendar-notes-v2");
      const notes  = raw ? JSON.parse(raw) : {};
      delete notes[key];
      localStorage.setItem("wall-calendar-notes-v2", JSON.stringify(notes));
      window.location.reload();
    } catch {}
  };

  // Range days for summary
  const rangeDays =
    startDate && endDate
      ? eachDayOfInterval({ start: startDate, end: endDate })
      : [];

  // Real mood data for summary
  const moodDays  = rangeDays.filter((d) => getMood(d));
  const avgScore  = moodDays.length
    ? Math.round(moodDays.reduce((s, d) => s + getMoodPct(getMood(d)), 0) / moodDays.length)
    : null;
  const bestMoodKey = moodDays.length
    ? Object.entries(
        moodDays.reduce((acc, d) => {
          const mk = getMood(d);
          acc[mk] = (acc[mk] ?? 0) + 1;
          return acc;
        }, {})
      ).sort((a, b) => b[1] - a[1])[0][0]
    : null;
  const bestMood = MOODS.find((m) => m.key === bestMoodKey);

  // Tabs available based on selection
  const tabs = startDate && endDate
    ? ["note", "summary"]
    : startDate
    ? ["note", "mood"]
    : [];

  return (
    <div style={{ padding: "16px 20px 20px", display: "flex", flexDirection: "column", gap: 14 }}>

      {/* ── Section header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <PenLine size={14} style={{ color: theme.accent, flexShrink: 0 }} />
          <h3
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 800,
              fontSize: "1.05rem",
              letterSpacing: "-0.01em",
              color: "#2a2520",
              margin: 0,
            }}
          >
            Notes
          </h3>
        </div>

        {tabs.length > 0 && (
          <div
            style={{
              display: "flex",
              borderRadius: 999,
              padding: 2,
              background: theme.accentLight,
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: activeTab === tab ? "white" : "transparent",
                  color: activeTab === tab ? theme.accentDark : theme.accent,
                  boxShadow: activeTab === tab ? "0 1px 3px rgba(0,0,0,0.10)" : "none",
                  fontWeight: activeTab === tab ? 600 : 400,
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.65rem",
                  padding: "3px 10px",
                  borderRadius: 999,
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.18s ease",
                  textTransform: "capitalize",
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Content ── */}
      {!noteKey ? (
        /* Empty state */
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px 16px",
            gap: 10,
            borderRadius: 16,
            border: `1.5px dashed ${theme.accent}28`,
            background: `${theme.accentLight}35`,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: theme.accentLight,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <StickyNote size={15} style={{ color: theme.accent }} />
          </div>
          <p
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.65rem",
              color: theme.accent + "90",
              textAlign: "center",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            Select a date or range
            <br />
            to add a note or log your mood
          </p>
        </div>
      ) : activeTab === "note" ? (
        /* ── Note editor ── */
        <div
          style={{
            borderRadius: 16,
            border: `1px solid ${theme.accent}28`,
            background: "white",
            boxShadow: `0 3px 18px ${theme.accent}0d, 0 1px 4px rgba(0,0,0,0.04)`,
            overflow: "hidden",
          }}
        >
          {/* Date label */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 14px",
              background: theme.accentLight,
              borderBottom: `1px solid ${theme.accent}18`,
            }}
          >
            <span
              style={{
                width: 7, height: 7, borderRadius: "50%",
                background: theme.accent, flexShrink: 0, display: "inline-block",
              }}
            />
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.68rem",
                fontWeight: 600,
                color: theme.accentDark,
                letterSpacing: "0.02em",
              }}
            >
              {rangeLabel}
            </span>
          </div>

          {/* Textarea */}
          <div style={{ padding: "10px 14px 6px" }}>
            <textarea
              ref={textareaRef}
              value={draftNote}
              onChange={(e) => setDraftNote(e.target.value)}
              placeholder="Jot something down..."
              style={{
                width: "100%",
                background: "transparent",
                resize: "none",
                border: "none",
                outline: "none",
                minHeight: 64,
                fontSize: "0.82rem",
                lineHeight: 1.65,
                color: "#3a3530",
                fontFamily: "'DM Sans', sans-serif",
                caretColor: theme.accent,
                display: "block",
                boxSizing: "border-box",
              }}
              rows={3}
            />
          </div>

          {/* Ruled lines */}
          <div style={{ padding: "0 14px 4px", display: "flex", flexDirection: "column", gap: 5 }}>
            {[0, 1].map((i) => (
              <div key={i} style={{ height: 1, background: `${theme.accent}10` }} />
            ))}
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 14px 12px",
              borderTop: `1px solid ${theme.accent}10`,
              gap: 8,
            }}
          >
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.62rem",
                color: theme.accent + "70",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                flex: "0 1 auto",
                minWidth: 0,
              }}
            >
              {draftNote.length > 0 ? `${draftNote.length} chars` : "Start typing..."}
            </span>

            <button
              onClick={handleSaveNote}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
                padding: "6px 16px",
                borderRadius: 999,
                background: justSaved ? "#22c55e" : theme.accent,
                color: "white",
                border: "none",
                cursor: "pointer",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.68rem",
                fontWeight: 600,
                letterSpacing: "0.03em",
                whiteSpace: "nowrap",
                flexShrink: 0,
                minWidth: 90,
                boxShadow: justSaved
                  ? "0 3px 12px rgba(34,197,94,0.4)"
                  : `0 3px 12px ${theme.accent}50`,
                transition: "background 0.2s, box-shadow 0.2s, transform 0.1s",
                transform: justSaved ? "scale(0.96)" : "scale(1)",
              }}
            >
              {justSaved ? (
                <><Check size={11} strokeWidth={3} /> Saved!</>
              ) : (
                <><PenLine size={10} /> Save note</>
              )}
            </button>
          </div>
        </div>
      ) : activeTab === "mood" && isSingleDay ? (
        /* ── Mood logger (single day only) ── */
        <div
          style={{
            borderRadius: 16,
            border: `1px solid ${theme.accent}28`,
            background: "white",
            overflow: "hidden",
            boxShadow: `0 3px 18px ${theme.accent}0d, 0 1px 4px rgba(0,0,0,0.04)`,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 14px",
              background: theme.accentLight,
              borderBottom: `1px solid ${theme.accent}18`,
            }}
          >
            <Smile size={12} style={{ color: theme.accent, flexShrink: 0 }} />
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.68rem",
                fontWeight: 600,
                color: theme.accentDark,
              }}
            >
              How was {format(startDate, "MMM d")}?
            </span>
          </div>

          {/* Mood options */}
          <div style={{ padding: "12px 14px" }}>
            <p
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.62rem",
                color: theme.accent + "80",
                marginBottom: 10,
              }}
            >
              Log your energy for this day
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {MOODS.map((mood) => {
                const isActive = activeMood === mood.key;
                return (
                  <button
                    key={mood.key}
                    onClick={() => setSelectedMood(mood.key)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "5px 12px",
                      borderRadius: 999,
                      border: `1px solid ${isActive ? mood.color : theme.accent + "25"}`,
                      background: isActive ? mood.color : "transparent",
                      color: isActive ? "white" : theme.accentDark,
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.65rem",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <span style={{ fontSize: "0.7rem" }}>{mood.emoji}</span>
                    {mood.label}
                  </button>
                );
              })}
            </div>

            {/* Save mood button */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
              <button
                onClick={handleSaveMood}
                disabled={!activeMood}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "6px 16px",
                  borderRadius: 999,
                  background: justSaved
                    ? "#22c55e"
                    : activeMood
                    ? theme.accent
                    : theme.accent + "40",
                  color: "white",
                  border: "none",
                  cursor: activeMood ? "pointer" : "default",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.68rem",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  minWidth: 90,
                  boxShadow: activeMood && !justSaved ? `0 3px 12px ${theme.accent}50` : "none",
                  transition: "background 0.2s, transform 0.1s",
                  transform: justSaved ? "scale(0.96)" : "scale(1)",
                }}
              >
                {justSaved ? (
                  <><Check size={11} strokeWidth={3} /> Logged!</>
                ) : (
                  <><Smile size={10} /> Log mood</>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : activeTab === "summary" && startDate && endDate ? (
        /* ── Summary (range, real mood data) ── */
        <div
          style={{
            borderRadius: 16,
            border: `1px solid ${theme.accent}28`,
            padding: 14,
            background: `linear-gradient(135deg, white 0%, ${theme.accentLight}55 100%)`,
            boxShadow: `0 3px 18px ${theme.accent}0d`,
          }}
        >
          {/* Top row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", fontWeight: 600, color: theme.accentDark }}>
              {rangeDays.length} day{rangeDays.length !== 1 ? "s" : ""} selected
            </span>
            {bestMood && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "3px 10px",
                  borderRadius: 999,
                  background: `${bestMood.color}18`,
                  border: `1px solid ${bestMood.color}30`,
                  color: bestMood.color,
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.62rem",
                }}
              >
                <TrendingUp size={9} />
                Most: {bestMood.label}
              </div>
            )}
          </div>

          {moodDays.length > 0 ? (
            <>
              {/* Bar chart — only real logged days have colour */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 3,
                  height: 56,
                  borderRadius: 10,
                  padding: "8px 10px 0",
                  background: `${theme.accentLight}70`,
                  overflow: "hidden",
                }}
              >
                {rangeDays.map((d) => {
                  const mk  = getMood(d);
                  const pct = mk ? getMoodPct(mk) : 0;
                  return (
                    <div
                      key={d.toISOString()}
                      title={`${format(d, "MMM d")}: ${mk ? MOODS.find((m) => m.key === mk)?.label : "no entry"}`}
                      style={{
                        flex: 1,
                        height: `${Math.max(pct, 4)}%`,
                        background: mk ? getMoodColor(mk) : `${theme.accent}18`,
                        borderRadius: "2px 2px 0 0",
                        minWidth: 3,
                        maxWidth: 20,
                        transition: "height 0.3s ease",
                        opacity: mk ? 1 : 0.4,
                      }}
                    />
                  );
                })}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, marginBottom: 10 }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: theme.accentDark, opacity: 0.5 }}>
                  {format(startDate, "MMM d")}
                </span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: theme.accentDark, opacity: 0.5 }}>
                  {format(endDate, "MMM d")}
                </span>
              </div>

              {/* Mood breakdown chips */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {MOODS.map((mood) => {
                  const count = rangeDays.filter((d) => getMood(d) === mood.key).length;
                  if (!count) return null;
                  return (
                    <div
                      key={mood.key}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "3px 10px 3px 6px",
                        borderRadius: 999,
                        background: `${mood.color}15`,
                        border: `1px solid ${mood.color}30`,
                      }}
                    >
                      <span
                        style={{
                          width: 7, height: 7, borderRadius: "50%",
                          background: mood.color, flexShrink: 0, display: "inline-block",
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: "0.58rem",
                          color: mood.color,
                        }}
                      >
                        {mood.label} × {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            /* No mood data yet */
            <div
              style={{
                textAlign: "center",
                padding: "20px 0",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.65rem",
                color: theme.accent + "70",
                lineHeight: 1.7,
              }}
            >
              No mood entries in this range yet.
              <br />
              Select a single day → Mood tab to start logging.
            </div>
          )}
        </div>
      ) : null}

      {/* ── Saved notes list ── */}
      {savedNotesList.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>

          <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "2px 0" }}>
            <div style={{ flex: 1, height: 1, background: `${theme.accent}18` }} />
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.52rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: theme.accent + "60",
              }}
            >
              Saved ({savedNotesList.length})
            </span>
            <div style={{ flex: 1, height: 1, background: `${theme.accent}18` }} />
          </div>

          {savedNotesList.map(({ key, text, dates }) => {
            const label =
              dates.length === 2
                ? `${format(dates[0], "MMM d")} – ${format(dates[1], "MMM d")}`
                : format(dates[0], "MMM d, yyyy");

            return (
              <div
                key={key}
                className="group"
                style={{
                  position: "relative",
                  borderRadius: 12,
                  border: `1px solid ${theme.accent}18`,
                  background: "white",
                  boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
                  overflow: "hidden",
                  display: "flex",
                }}
              >
                {/* Left accent stripe */}
                <div
                  style={{
                    width: 4,
                    flexShrink: 0,
                    background: theme.accentMid || theme.accent + "55",
                    borderRadius: "12px 0 0 12px",
                  }}
                />

                <div style={{ flex: 1, padding: "10px 36px 10px 12px", minWidth: 0 }}>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "2px 8px 2px 5px",
                      borderRadius: 999,
                      background: theme.accentLight,
                      marginBottom: 6,
                    }}
                  >
                    <span
                      style={{
                        width: 6, height: 6, borderRadius: "50%",
                        background: theme.accent, flexShrink: 0, display: "inline-block",
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.6rem",
                        fontWeight: 600,
                        color: theme.accentDark,
                        letterSpacing: "0.03em",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {label}
                    </span>
                  </div>

                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.78rem",
                      lineHeight: 1.6,
                      color: "#4a4540",
                      fontFamily: "'DM Sans', sans-serif",
                      wordBreak: "break-word",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {text}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(key)}
                  className="opacity-0 group-hover:opacity-100"
                  style={{
                    position: "absolute",
                    top: 8, right: 8,
                    width: 22, height: 22,
                    borderRadius: "50%",
                    background: "#fff5f5",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#e57373",
                    transition: "opacity 0.15s",
                    flexShrink: 0,
                  }}
                  title="Delete note"
                >
                  <Trash2 size={10} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}