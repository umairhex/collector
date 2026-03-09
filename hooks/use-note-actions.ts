"use client";

import * as React from "react";
import { toast } from "sonner";
import { useDeleteNote, useUpdateNote } from "@/hooks/use-notes";
import { Note } from "@/types";

export function useNoteActions(
  activeNoteId: string | null,
  setActiveNoteId: (id: string | null) => void,
) {
  const deleteNote = useDeleteNote();
  const updateNote = useUpdateNote();

  const handleDelete = React.useCallback(
    (notes: Note[], activeCategory: string) => {
      if (!activeNoteId || !notes) return;

      const currentList = notes.filter(
        (n) =>
          activeCategory === "all" ||
          n.category.toLowerCase() === activeCategory,
      );

      const currentIndex = currentList.findIndex((n) => n._id === activeNoteId);
      let nextNoteId: string | null = null;

      if (currentList.length > 1) {
        const nextNote =
          currentList[currentIndex + 1] || currentList[currentIndex - 1];
        if (nextNote) nextNoteId = nextNote._id;
      }

      deleteNote.mutate(activeNoteId, {
        onSuccess: () => {
          toast.success("Note deleted");
          setActiveNoteId(nextNoteId);
        },
        onError: () => {
          toast.error("Failed to delete note");
        },
      });
    },
    [activeNoteId, deleteNote, setActiveNoteId],
  );

  const handleExport = React.useCallback(
    (title: string, content: string, format: "txt" | "md") => {
      if (!title && !content) return;
      const strippedContent = content.replace(/<[^>]*>?/gm, "");
      const textToSave =
        format === "md"
          ? `# ${title}\n\n${content}`
          : `${title}\n\n${strippedContent}`;
      const blob = new Blob([textToSave], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title || "note"}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Exported as .${format}`);
    },
    [],
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

  const handleToggleShare = React.useCallback(
    (isCurrentlyShareable: boolean) => {
      if (!activeNoteId) return;
      const nextShareable = !isCurrentlyShareable;
      updateNote.mutate(
        { id: activeNoteId, shareable: nextShareable },
        {
          onSuccess: () => {
            toast.success(
              nextShareable
                ? "Public access enabled"
                : "Public access disabled",
            );
          },
          onError: () => toast.error("Failed to update sharing settings"),
        },
      );
    },
    [activeNoteId, updateNote],
  );

  const handleCopy = React.useCallback(
    async (title: string, content: string) => {
      try {
        const textToCopy = title ? `# ${title}\n\n${content}` : content;
        if (!textToCopy) return;
        await navigator.clipboard.writeText(textToCopy);
        toast.success("Note copied to clipboard");
      } catch {
        toast.error("Failed to copy note");
      }
    },
    [],
  );

  const handlePaste = React.useCallback(
    async (callback: (text: string) => void) => {
      try {
        const text = await navigator.clipboard.readText();
        if (!text) return;
        callback(text);
        toast.success("Pasted from clipboard");
      } catch {
        toast.error("Clipboard permission denied or failed to read.");
      }
    },
    [],
  );

  return {
    handleDelete,
    handleExport,
    handleShare,
    handleToggleShare,
    handleCopy,
    handlePaste,
    isDeleting: deleteNote.isPending,
  };
}
