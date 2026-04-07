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

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [draftNote]);

  const rangeLabel =
    startDate && endDate
      ? `${format(startDate, "MMM d")} – ${format(endDate, "MMM d")}`
      : startDate
      ? format(startDate, "MMMM d, yyyy")
      : null;

  const handleSave = () => saveNote(draftNote);

  const handleDelete = (key) => {
    try {
      const raw = localStorage.getItem("wall-calendar-notes-v2");
      const notes = raw ? JSON.parse(raw) : {};
      delete notes[key];
      localStorage.setItem("wall-calendar-notes-v2", JSON.stringify(notes));
      window.location.reload(); 
    } catch {}
  };

  return (
    <div className="flex flex-col h-full px-6 py-6 gap-6">
      <div className="flex items-center gap-3">
        <PenLine size={18} style={{ color: theme.accent }} />
        <h3 className="font-display font-bold text-xl tracking-tight text-neutral-800">
          Notes
        </h3>
      </div>

      {noteKey ? (
        <div
          className="rounded-xl flex flex-col overflow-hidden shadow-[inset_0_2px_8px_rgba(0,0,0,0.03)] border transition-all duration-300"
          style={{ background: "#ffffff", borderColor: theme.accent + "33" }}
        >
          <div
            className="px-4 py-2 text-xs font-mono font-semibold tracking-wider border-b"
            style={{ background: theme.accentLight + "33", color: theme.accentDark, borderColor: theme.accent + "11" }}
          >
            ◎ {rangeLabel}
          </div>
          
          {/* Note Input */}
          <div className="p-4">
            <textarea
              ref={textareaRef}
              value={draftNote}
              onChange={(e) => setDraftNote(e.target.value)}
              placeholder="Jot something down..."
              className="w-full bg-transparent resize-none text-sm text-neutral-700 placeholder-neutral-400 focus:outline-none leading-relaxed font-body"
              rows={3}
              style={{ minHeight: 70 }}
            />
          </div>

          {/* FIX: Dedicated Action Bar to prevent button squishing */}
       {/* Action Bar */}
          <div className="px-4 pb-4 flex justify-end items-center relative z-10">
            <button
              onClick={handleSave}
              className="flex-none w-[110px] text-xs font-mono py-2.5 rounded-full text-white transition-all hover:opacity-90 active:scale-95 shadow-md flex items-center justify-center tracking-wide"
              style={{ background: theme.accent }}
            >
              Save note
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 gap-3 rounded-xl border border-dashed border-neutral-200 bg-neutral-50/50">
          <StickyNote size={24} className="text-neutral-300" />
          <p className="text-xs font-mono text-neutral-400 text-center leading-relaxed px-4">
            Select a date or range to add a note
          </p>
        </div>
      )}

      {savedNotesList.length > 0 && (
        <div className="flex flex-col gap-3 flex-1 overflow-y-auto notes-scroll">
          <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
            Saved ({savedNotesList.length})
          </p>
          {savedNotesList.map(({ key, text, dates }) => {
            const label = dates.length === 2
                ? `${format(dates[0], "MMM d")} – ${format(dates[1], "MMM d")}`
                : format(dates[0], "MMM d, yyyy");
            return (
              <div key={key} className="group relative rounded-xl p-4 border border-neutral-100 bg-white hover:border-neutral-300 transition-all shadow-sm">
                <div className="text-xs font-mono mb-2" style={{ color: theme.accent }}>{label}</div>
                <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">{text}</p>
                <button
                  onClick={() => handleDelete(key)}
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-neutral-300 hover:text-red-500 bg-white rounded-full p-1 shadow-sm"
                  title="Delete note"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}