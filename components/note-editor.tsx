"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { useQueryState } from "nuqs";
import { useDebouncedCallback } from "use-debounce";
import { toast } from "sonner";
import { z } from "zod";
import { updateNoteSchema } from "@/lib/validations";

import {
  useNotes,
  useUpdateNote,
  useDeleteNote,
  useCategoriesList,
} from "@/hooks/use-notes";
import { EditorHeader } from "./note-editor/editor-header";
import { EditorEmptyState } from "./note-editor/editor-empty-state";
import { EditorToolbar } from "./note-editor/editor-toolbar";
import { EditorCanvas } from "./note-editor/editor-canvas";
import { SearchInput } from "@/components/search-input";
import { DEFAULT_CATEGORIES } from "@/lib/utils";

export function NoteEditor() {
  const [activeNoteId, setActiveNoteId] = useQueryState("noteId");
  const [activeCategory, setActiveCategory] = useQueryState("category", {
    defaultValue: "all",
  });
  const [searchQuery, setSearchQuery] = useQueryState("search", {
    defaultValue: "",
  });

  const { data: notes, isLoading: isLoadingNotes } = useNotes();
  const { data: categoriesList = [...DEFAULT_CATEGORIES] } =
    useCategoriesList();
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();

  const [localTitle, setLocalTitle] = React.useState("");
  const [localContent, setLocalContent] = React.useState("");

  const activeNote = React.useMemo(
    () => notes?.find((n) => n._id === activeNoteId) || null,
    [notes, activeNoteId],
  );

  const lastIdRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    const isSameNote = activeNoteId === lastIdRef.current;
    if (activeNote) {
      setLocalTitle((prev) =>
        !isSameNote || prev === "" ? activeNote.title || "" : prev,
      );
      setLocalContent((prev) =>
        !isSameNote || prev === "" ? activeNote.content || "" : prev,
      );
      lastIdRef.current = activeNoteId;
    } else {
      setLocalTitle("");
      setLocalContent("");
      lastIdRef.current = null;
    }
  }, [activeNote, activeNoteId]);

  const debouncedUpdate = useDebouncedCallback(
    (updates: { title?: string; content?: string; category?: string }) => {
      if (!activeNoteId) return;

      try {
        const validated = updateNoteSchema.parse(updates);
        updateNote.mutate(
          { id: activeNoteId, ...validated },
          {
            onError: () => toast.error("Failed to sync changes"),
          },
        );
      } catch (error) {
        if (error instanceof z.ZodError) {
          toast.error(error.issues[0].message);
        }
      }
    },
    500,
  );

  const handleDelete = () => {
    if (!activeNoteId || !notes) return;

    const currentCategory = activeNote?.category || "all";
    const filteredNotes = notes.filter(
      (n) => activeNoteId === "all" || n.category === currentCategory,
    );
    const currentIndex = filteredNotes.findIndex((n) => n._id === activeNoteId);
    let nextNoteId: string | null = null;

    if (filteredNotes.length > 1) {
      const nextNote =
        filteredNotes[currentIndex + 1] || filteredNotes[currentIndex - 1];
      if (nextNote) nextNoteId = nextNote._id;
    }

    deleteNote.mutate(activeNoteId, {
      onSuccess: () => {
        toast.success("Note deleted successfully");
        if (nextNoteId) {
          const nextNote = notes.find((n) => n._id === nextNoteId);
          if (nextNote && nextNote.category.toLowerCase() !== activeCategory) {
            setActiveCategory(nextNote.category.toLowerCase());
          }
        }
        setActiveNoteId(nextNoteId);
      },
      onError: () => {
        toast.error("Failed to delete note");
      },
    });
  };

  const handlePaste = React.useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) return;

      setLocalContent((prev) => {
        const next = prev ? `${prev}\n${text}` : text;
        debouncedUpdate({ content: next });
        return next;
      });
      toast.success("Pasted from clipboard");
    } catch {
      toast.error("Clipboard permission denied or failed to read.");
    }
  }, [debouncedUpdate]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "v") {
        e.preventDefault();
        handlePaste();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePaste]);

  return (
    <div className="bg-background relative flex h-full flex-1 flex-col overflow-hidden">
      <EditorHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="from-primary/5 pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] via-transparent to-transparent" />

      <div className="selection:bg-primary/20 relative flex-1 overflow-y-auto scroll-smooth">
        <div className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-4xl flex-col p-6 lg:px-16 lg:py-12">
          {isLoadingNotes ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="text-primary h-10 w-10 animate-spin opacity-50" />
                <p className="font-heading text-muted-foreground text-sm tracking-widest uppercase">
                  Loading Canvas
                </p>
              </div>
            </div>
          ) : !activeNote ? (
            <EditorEmptyState />
          ) : (
            <>
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                className="border-border/50 mb-8 rounded-2xl border shadow-sm md:hidden"
              />

              <EditorCanvas
                title={localTitle}
                content={localContent}
                onTitleChange={(title) => {
                  setLocalTitle(title);
                  debouncedUpdate({ title });
                }}
                onContentChange={(content) => {
                  setLocalContent(content);
                  debouncedUpdate({ content });
                }}
                category={activeNote.category}
                categoriesList={categoriesList}
                onCategoryChange={(category) => debouncedUpdate({ category })}
                updatedAt={activeNote.updatedAt}
              />

              <EditorToolbar
                noteTitle={activeNote.title}
                isUpdating={updateNote.isPending}
                isDeleting={deleteNote.isPending}
                onDelete={handleDelete}
                onPaste={handlePaste}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
