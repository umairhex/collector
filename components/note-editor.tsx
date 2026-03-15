"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { useQueryState } from "nuqs";

import { useNotes, useCategories } from "@/hooks/use-notes";
import { useNoteSync } from "@/hooks/use-note-sync";
import { useNoteActions } from "@/hooks/use-note-actions";
import { EditorHeader } from "./note-editor/editor-header";
import { EditorEmptyState } from "./note-editor/editor-empty-state";
import { EditorToolbar } from "./note-editor/editor-toolbar";
import { EditorCanvas } from "./note-editor/editor-canvas";
import { SearchInput } from "@/components/search-input";

export function NoteEditor() {
  const [activeNoteId, setActiveNoteId] = useQueryState("noteId");
  const [activeCategory] = useQueryState("category", {
    defaultValue: "all",
  });
  const [searchQuery, setSearchQuery] = useQueryState("search", {
    defaultValue: "",
  });

  const { data: notes, isLoading: isLoadingNotes } = useNotes();
  const { data: categories = [] } = useCategories();

  const {
    activeNote,
    localTitle,
    setLocalTitle,
    localContent,
    setLocalContent,
    handleManualSave,
    handleCategoryChange,
    isUpdating,
  } = useNoteSync(activeNoteId);

  const {
    handleDelete,
    handleExport,
    handleShare,
    handleToggleShare,
    handleCopy,
    handlePaste,
    isDeleting,
  } = useNoteActions(activeNoteId, setActiveNoteId);

  const categoriesList = React.useMemo(() => {
    return categories.filter((c) => c.id !== "all").map((c) => c.name);
  }, [categories]);

  const onPasteHandler = React.useCallback(async () => {
    await handlePaste((text) => {
      const nextContent = localContent ? `${localContent}\n${text}` : text;
      setLocalContent(nextContent);
    });
  }, [handlePaste, localContent, setLocalContent]);

  const onPasteHandlerRef = React.useRef(onPasteHandler);
  React.useEffect(() => {
    onPasteHandlerRef.current = onPasteHandler;
  }, [onPasteHandler]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "v") {
        e.preventDefault();
        onPasteHandlerRef.current();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
                  Loading Note
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
                }}
                onContentChange={(content) => {
                  setLocalContent(content);
                }}
                category={activeNote.category}
                categoriesList={categoriesList}
                onCategoryChange={handleCategoryChange}
                updatedAt={activeNote.updatedAt}
                toolbar={
                  <EditorToolbar
                    noteTitle={activeNote.title}
                    isUpdating={isUpdating}
                    isDeleting={isDeleting}
                    onDelete={() => handleDelete(notes || [], activeCategory)}
                    onPaste={onPasteHandler}
                    onManualSave={handleManualSave}
                    onExport={(format) =>
                      handleExport(localTitle, localContent, format)
                    }
                    onShare={handleShare}
                    onCopy={() => handleCopy(localTitle, localContent)}
                    isShareable={activeNote.shareable}
                    onToggleShare={() =>
                      handleToggleShare(activeNote.shareable)
                    }
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
