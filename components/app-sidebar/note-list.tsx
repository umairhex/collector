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
      <div className="mb-2 flex items-center justify-between px-2">
        <SidebarGroupLabel className="font-heading tracking-wider uppercase">
          Notes
        </SidebarGroupLabel>
        <Button
          variant="ghost"
          size="icon"
          className="relative top-[2px] h-6 w-6"
          onClick={onCreateNote}
          disabled={isCreating}
          aria-label="Create new note"
        >
          {isCreating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </Button>
      </div>
      <ScrollArea className="-mx-2 h-full flex-1 px-2">
        <div className="space-y-2 pb-4">
          {isLoading ? (
            <div className="w-full space-y-3 p-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="border-border/40 flex flex-col gap-2 rounded-lg border p-3"
                >
                  <Skeleton className="bg-primary/10 h-4 w-3/4" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="bg-primary/10 h-3 w-1/4" />
                    <span className="bg-muted-foreground/30 h-1 w-1 rounded-full"></span>
                    <Skeleton className="bg-primary/10 h-3 w-8" />
                  </div>
                </div>
              ))}
            </div>
          ) : notes.length === 0 ? (
            <div className="animate-in fade-in zoom-in flex flex-col items-center justify-center p-8 text-center duration-300">
              <div className="bg-muted mb-3 rounded-full p-3">
                <Search className="text-muted-foreground h-5 w-5 opacity-50" />
              </div>
              <h3 className="text-foreground text-sm font-medium">
                No notes found
              </h3>
              <p className="text-muted-foreground mt-1 max-w-[150px] text-xs">
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
                className={`w-full rounded-lg border p-3 text-left transition-all ${
                  activeNoteId === note._id
                    ? "bg-accent border-accent ring-ring text-accent-foreground shadow-sm ring-1"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground border-transparent bg-transparent"
                }`}
              >
                <h3 className="mb-1 truncate text-sm font-semibold">
                  {note.title || "Untitled Note"}
                </h3>
                <div className="flex items-center gap-2 text-xs opacity-80">
                  <span>{note.category}</span>
                  <span className="h-1 w-1 rounded-full bg-current opacity-50"></span>
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
