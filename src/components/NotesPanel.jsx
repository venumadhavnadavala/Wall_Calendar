import React, { useRef, useEffect } from "react";
import { format } from "date-fns";
import { PenLine, Trash2, StickyNote } from "lucide-react";

export default function NotesPanel({
  theme,
  startDate,
  endDate,
  noteKey,
  draftNote,
  saveNote,
  savedNotesList,
  setDraftNote,
}) {
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [draftNote]);

  const rangeLabel =
    startDate && endDate
      ? `${format(startDate, "MMM d")} – ${format(endDate, "MMM d")}`
      : startDate
      ? format(startDate, "MMMM d, yyyy")
      : null;

  const handleSave = () => {
    saveNote(draftNote);
  };

  const handleDelete = (key) => {
    // Pass empty string to delete
    const updatedAll = {};
    // We just call saveNote via direct localStorage manipulation
    try {
      const raw = localStorage.getItem("wall-calendar-notes-v2");
      const notes = raw ? JSON.parse(raw) : {};
      delete notes[key];
      localStorage.setItem("wall-calendar-notes-v2", JSON.stringify(notes));
      window.location.reload(); // Simple refresh to re-sync
    } catch {}
  };

  return (
    <div className="flex flex-col h-full px-6 py-5 gap-5">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <PenLine size={16} style={{ color: theme.accent }} />
        <h3
          className="font-display font-bold text-lg tracking-tight text-neutral-800"
        >
          Notes
        </h3>
        {savedNotesList.length > 0 && (
          <span
            className="ml-auto text-xs font-mono px-2 py-0.5 rounded-full"
            style={{ background: theme.accentLight, color: theme.accentDark }}
          >
            {savedNotesList.length} saved
          </span>
        )}
      </div>

      {/* Active selection note */}
      {noteKey ? (
        <div
          className="rounded-2xl p-4 flex flex-col gap-3 border"
          style={{
            borderColor: theme.accent + "33",
            background: theme.accentLight + "55",
          }}
        >
          <div
            className="text-xs font-mono font-medium tracking-wide"
            style={{ color: theme.accent }}
          >
            ◎ {rangeLabel}
          </div>
          <textarea
            ref={textareaRef}
            value={draftNote}
            onChange={(e) => setDraftNote(e.target.value)}
            placeholder="Jot something down for this date…"
            className="w-full bg-transparent resize-none text-sm text-neutral-700 placeholder-neutral-400 focus:outline-none leading-relaxed font-body"
            rows={3}
            style={{ minHeight: 72 }}
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={handleSave}
              className="text-xs font-mono px-4 py-1.5 rounded-full text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: theme.accent }}
            >
              Save note
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-6 gap-3 rounded-2xl border border-dashed border-neutral-200">
          <StickyNote size={24} className="text-neutral-300" />
          <p className="text-xs font-mono text-neutral-400 text-center leading-relaxed px-4">
            Select a date or range on the calendar to add a note
          </p>
        </div>
      )}

      {/* Saved notes list */}
      {savedNotesList.length > 0 && (
        <div className="flex flex-col gap-2 flex-1 overflow-y-auto notes-scroll">
          <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
            Saved
          </p>
          {savedNotesList.map(({ key, text, dates }) => {
            const label =
              dates.length === 2
                ? `${format(dates[0], "MMM d")} – ${format(dates[1], "MMM d")}`
                : format(dates[0], "MMM d, yyyy");
            return (
              <div
                key={key}
                className="group relative rounded-xl p-3.5 border border-neutral-100 bg-white hover:border-neutral-200 transition-all"
              >
                <div
                  className="text-xs font-mono mb-1.5"
                  style={{ color: theme.accent }}
                >
                  {label}
                </div>
                <p className="text-sm text-neutral-700 leading-relaxed line-clamp-3">
                  {text}
                </p>
                <button
                  onClick={() => handleDelete(key)}
                  className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity text-neutral-300 hover:text-red-400"
                  title="Delete note"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Decorative lines (empty paper feel) */}
      {savedNotesList.length === 0 && !noteKey && (
        <div className="flex-1 flex flex-col gap-0 mt-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="note-line" />
          ))}
        </div>
      )}
    </div>
  );
}