"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { useQueryState } from "nuqs";
import { useDebouncedCallback, useThrottledCallback } from "use-debounce";
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
  const [isAutoSave, setIsAutoSave] = React.useState(true);

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

  const sendUpdate = React.useCallback(
    (updates: { title?: string; content?: string; category?: string }) => {
      if (!activeNoteId) return;

      if (updates.title !== undefined && updates.title === "") {
        return;
      }

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
    [activeNoteId, updateNote],
  );

  const throttledUpdate = useThrottledCallback(sendUpdate, 1000, {
    leading: false,
    trailing: true,
  });
  const debouncedUpdate = useDebouncedCallback(sendUpdate, 500);

  const handleManualSave = React.useCallback(() => {
    sendUpdate({
      title: localTitle,
      content: localContent,
      category: activeNote?.category,
    });
    toast.success("Note saved manually");
  }, [sendUpdate, localTitle, localContent, activeNote]);

  const toggleAutoSave = React.useCallback(() => {
    setIsAutoSave((prev) => {
      const next = !prev;
      toast.success(next ? "Auto-save enabled" : "Auto-save disabled");
      return next;
    });
  }, []);

  const scheduleUpdate = React.useCallback(
    (updates: { title?: string; content?: string; category?: string }) => {
      if (updates.title !== undefined && updates.title === "") {
        return;
      }

      if (!isAutoSave) return;

      throttledUpdate(updates);
      debouncedUpdate(updates);
    },
    [throttledUpdate, debouncedUpdate, isAutoSave],
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

  const handleExport = React.useCallback(
    (format: "txt" | "md") => {
      if (!localTitle && !localContent) return;
      const strippedContent = localContent.replace(/<[^>]*>?/gm, "");
      const textToSave =
        format === "md"
          ? `# ${localTitle}\n\n${localContent}`
          : `${localTitle}\n\n${strippedContent}`;
      const blob = new Blob([textToSave], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${localTitle || "note"}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Exported as .${format}`);
    },
    [localContent, localTitle],
  );

  const handleShare = React.useCallback(() => {
    if (!activeNoteId) return;
    const url = `${window.location.origin}/notes/${activeNoteId}`;
    try {
      navigator.clipboard.writeText(url);
      toast.success("Share link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  }, [activeNoteId]);

  const handlePaste = React.useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) return;

      setLocalContent((prev) => {
        const next = prev ? `${prev}\n${text}` : text;
        if (isAutoSave) scheduleUpdate({ content: next });
        return next;
      });
      toast.success("Pasted from clipboard");
    } catch {
      toast.error("Clipboard permission denied or failed to read.");
    }
  }, [scheduleUpdate, isAutoSave]);

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

      <div className="from-primary/5 pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] via-transparent to-transparent" />

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
                noteId={activeNote._id}
                title={localTitle}
                content={localContent}
                onTitleChange={(title) => {
                  setLocalTitle(title);
                  scheduleUpdate({ title });
                }}
                onContentChange={(content) => {
                  setLocalContent(content);
                  scheduleUpdate({ content });
                }}
                category={activeNote.category}
                categoriesList={categoriesList}
                onCategoryChange={(category) => scheduleUpdate({ category })}
                updatedAt={activeNote.updatedAt}
                toolbar={
                  <EditorToolbar
                    noteTitle={activeNote.title}
                    isUpdating={updateNote.isPending}
                    isDeleting={deleteNote.isPending}
                    onDelete={handleDelete}
                    onPaste={handlePaste}
                    isAutoSave={isAutoSave}
                    onToggleAutoSave={toggleAutoSave}
                    onManualSave={handleManualSave}
                    onExport={handleExport}
                    onShare={handleShare}
                  />
                }
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
