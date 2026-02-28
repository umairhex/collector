"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { useQueryState } from "nuqs";
import { useDebouncedCallback } from "use-debounce";
import { toast } from "sonner";

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
    if (activeNote) {
      setLocalTitle((prev) =>
        activeNoteId !== lastIdRef.current || prev === ""
          ? activeNote.title || ""
          : prev,
      );
      setLocalContent((prev) =>
        activeNoteId !== lastIdRef.current || prev === ""
          ? activeNote.content || ""
          : prev,
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
      updateNote.mutate(
        { id: activeNoteId, ...updates },
        {
          onError: () => toast.error("Failed to sync changes"),
        },
      );
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
        setActiveNoteId(nextNoteId);
      },
      onError: () => {
        toast.error("Failed to delete note");
      },
    });
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setLocalContent((prev) => {
        const next = prev ? `${prev}\n${text}` : text;
        debouncedUpdate({ content: next });
        return next;
      });
      toast.success("Pasted from clipboard");
    } catch {
      toast.error("Clipboard permission denied or failed to read.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-background flex-1 overflow-hidden relative">
      <EditorHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />

      <div className="flex-1 overflow-y-auto relative scroll-smooth selection:bg-primary/20">
        <div className="flex flex-col p-6 lg:px-16 lg:py-12 max-w-4xl w-full mx-auto min-h-[calc(100vh-64px)]">
          {isLoadingNotes ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary opacity-50" />
                <p className="text-sm font-heading tracking-widest text-muted-foreground uppercase">
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
                className="mb-8 md:hidden rounded-2xl shadow-sm border border-border/50"
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
