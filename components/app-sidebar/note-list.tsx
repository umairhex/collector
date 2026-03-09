import * as React from "react";
import { Search } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Note } from "@/types";

interface NoteListProps {
  notes: Note[];
  activeNoteId: string | null;
  setActiveNoteId: (id: string) => void;
  activeCategory: string;
  searchQuery: string;
}

export function NoteList({
  notes,
  activeNoteId,
  setActiveNoteId,
  activeCategory,
  searchQuery,
}: NoteListProps) {
  const filteredNotes = React.useMemo(() => {
    let result = notes;
    if (activeCategory !== "all") {
      result = result.filter(
        (n) => (n.category || "General").toLowerCase() === activeCategory,
      );
    }
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (n) =>
          n.title?.toLowerCase().includes(lowerQuery) ||
          n.content?.toLowerCase().includes(lowerQuery),
      );
    }
    return result;
  }, [notes, activeCategory, searchQuery]);

  if (filteredNotes.length === 0) {
    return (
      <div className="animate-in fade-in zoom-in flex flex-col items-center justify-center px-4 py-12 text-center duration-500">
        <div className="bg-sidebar-accent/50 mb-4 flex h-12 w-12 items-center justify-center rounded-2xl group-data-[collapsible=icon]:hidden">
          <Search className="text-muted-foreground/40 h-5 w-5" />
        </div>
        <p className="text-muted-foreground/60 text-[10px] font-bold tracking-[0.2em] uppercase group-data-[collapsible=icon]:hidden">
          {searchQuery ? "No Matches" : "No Notes"}
        </p>
        <p className="text-muted-foreground/40 mt-1 max-w-[140px] text-[10px] leading-relaxed group-data-[collapsible=icon]:hidden">
          {searchQuery
            ? `"${searchQuery}" not found`
            : "Create your first note"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5 p-1">
      {filteredNotes.map((note) => (
        <button
          key={note._id}
          onClick={() => setActiveNoteId(note._id)}
          className={`group/note relative flex w-full flex-col items-start gap-1 rounded-xl p-3 text-left transition-all duration-300 ${
            activeNoteId === note._id
              ? "bg-primary text-primary-foreground shadow-primary/20 shadow-lg"
              : "hover:bg-sidebar-accent/50 text-sidebar-foreground border-transparent"
          }`}
        >
          <div className="flex w-full items-center justify-between gap-2">
            <h4
              className={`truncate text-[11px] font-bold tracking-wide uppercase ${
                activeNoteId === note._id
                  ? "text-primary-foreground"
                  : "text-sidebar-foreground"
              }`}
            >
              {note.title || "Untitled Note"}
            </h4>
          </div>
          <div
            className={`flex items-center gap-2 text-[9px] font-medium tracking-widest opacity-60 ${
              activeNoteId === note._id
                ? "text-primary-foreground"
                : "text-muted-foreground"
            }`}
          >
            <span className="truncate">{note.category || "Personal"}</span>
            <span className="h-0.5 w-0.5 rounded-full bg-current opacity-40"></span>
            <span className="truncate">
              {formatDate(note.updatedAt || note.createdAt)}
            </span>
          </div>
          {activeNoteId === note._id && (
            <div className="bg-primary-foreground animate-in slide-in-from-left-1 absolute top-2 -left-1 h-8 w-0.5 rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
}
