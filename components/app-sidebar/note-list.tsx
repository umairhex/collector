"use client";

import * as React from "react";
import { Plus, Loader2, Search } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

interface Note {
  _id: string;
  title: string;
  category: string;
  updatedAt: string;
  createdAt: string;
}

interface NoteListProps {
  notes: Note[];
  activeNoteId: string | null;
  onNoteSelect: (id: string) => void;
  onCreateNote: () => void;
  isCreating: boolean;
  isLoading: boolean;
  searchQuery: string;
}

export function NoteList({
  notes,
  activeNoteId,
  onNoteSelect,
  onCreateNote,
  isCreating,
  isLoading,
  searchQuery,
}: NoteListProps) {
  return (
    <SidebarGroup className="mt-4 flex-1">
      <div className="flex items-center justify-between px-2 mb-2">
        <SidebarGroupLabel className="font-heading tracking-wider uppercase">
          Notes
        </SidebarGroupLabel>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 relative top-[2px]"
          onClick={onCreateNote}
          disabled={isCreating}
          aria-label="Create new note"
        >
          {isCreating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </Button>
      </div>
      <ScrollArea className="flex-1 -mx-2 px-2 h-full">
        <div className="space-y-2 pb-4">
          {isLoading ? (
            <div className="space-y-3 p-2 w-full">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-2 p-3 rounded-lg border border-border/40"
                >
                  <Skeleton className="h-4 w-3/4 bg-primary/10" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-1/4 bg-primary/10" />
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/30"></span>
                    <Skeleton className="h-3 w-8 bg-primary/10" />
                  </div>
                </div>
              ))}
            </div>
          ) : notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300">
              <div className="p-3 bg-muted rounded-full mb-3">
                <Search className="w-5 h-5 text-muted-foreground opacity-50" />
              </div>
              <h3 className="text-sm font-medium text-foreground">
                No notes found
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-[150px]">
                {searchQuery
                  ? `No results for "${searchQuery}"`
                  : "Try creating a new note or changing category."}
              </p>
            </div>
          ) : (
            notes.map((note) => (
              <button
                key={note._id}
                onClick={() => onNoteSelect(note._id)}
                aria-label={`Select note: ${note.title || "Untitled"}`}
                style={{ contentVisibility: "auto" } as React.CSSProperties}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  activeNoteId === note._id
                    ? "bg-accent border-accent ring-1 ring-ring text-accent-foreground shadow-sm"
                    : "bg-transparent border-transparent hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                <h3 className="font-semibold text-sm truncate mb-1">
                  {note.title || "Untitled Note"}
                </h3>
                <div className="flex items-center gap-2 text-xs opacity-80">
                  <span>{note.category}</span>
                  <span className="w-1 h-1 rounded-full bg-current opacity-50"></span>
                  <span>{formatDate(note.updatedAt || note.createdAt)}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </SidebarGroup>
  );
}
