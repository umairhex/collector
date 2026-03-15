"use client";

import * as React from "react";
import { toast } from "sonner";
import { z } from "zod";
import { updateNoteSchema } from "@/lib/validations";
import { useUpdateNote, useNotes } from "@/hooks/use-notes";

export function useNoteSync(activeNoteId: string | null) {
  const { data: notes } = useNotes();
  const updateNote = useUpdateNote();
  const [localTitle, setLocalTitle] = React.useState("");
  const [localContent, setLocalContent] = React.useState("");
  const lastIdRef = React.useRef<string | null>(null);

  const activeNote = React.useMemo(
    () => notes?.find((n) => n._id === activeNoteId) || null,
    [notes, activeNoteId],
  );

  React.useEffect(() => {
    const isSameNote = activeNoteId === lastIdRef.current;
    const wasOptimistic =
      lastIdRef.current?.startsWith("temp-") &&
      !activeNoteId?.startsWith("temp-");

    if (activeNote) {
      setLocalTitle((prev) =>
        !isSameNote && !wasOptimistic ? activeNote.title || "" : prev,
      );
      setLocalContent((prev) =>
        !isSameNote && !wasOptimistic ? activeNote.content || "" : prev,
      );
      lastIdRef.current = activeNoteId;
    } else {
      setLocalTitle("");
      setLocalContent("");
      lastIdRef.current = null;
    }
  }, [activeNote, activeNoteId]);

  const saveNote = React.useCallback(
    (overrideCategory?: string, isAutoSave = false) => {
      if (!activeNoteId || !activeNote) {
        console.warn("LOG: Save attempted but no active note");
        return;
      }

      if (localTitle === "") {
        if (!isAutoSave) toast.error("Note title cannot be empty");
        console.warn("LOG: Save blocked - empty title");
        return;
      }

      try {
        const validated = updateNoteSchema.parse({
          title: localTitle,
          content: localContent,
          category: overrideCategory || activeNote.category,
        });

        console.log("LOG: Save triggered", {
          noteId: activeNoteId,
          isTemp: activeNoteId.startsWith("temp-"),
          title: localTitle,
          contentLength: localContent.length,
          category: validated.category,
          isAutoSave,
        });

        if (activeNoteId.startsWith("temp-")) {
          if (!isAutoSave) toast.info("Creating note, please wait...");
          return;
        } else {
          console.log("LOG: Updating existing note", { id: activeNoteId });
          updateNote.mutate(
            { id: activeNoteId, ...validated },
            {
              onSuccess: (updatedNote) => {
                console.log("LOG: Note saved successfully", {
                  id: updatedNote._id,
                  title: updatedNote.title,
                });
                if (!isAutoSave) toast.success("Note saved successfully");
              },
              onError: (error) => {
                console.error("ERROR: Failed to save note", error);
                if (!isAutoSave) toast.error("Failed to save note");
              },
            },
          );
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error("ERROR: Validation error", error);
          if (!isAutoSave) toast.error(error.issues[0].message);
        }
      }
    },
    [activeNoteId, activeNote, localTitle, localContent, updateNote],
  );

  const handleManualSave = React.useCallback(() => {
    saveNote();
  }, [saveNote]);

  const handleCategoryChange = React.useCallback(
    (newCategory: string) => {
      saveNote(newCategory);
    },
    [saveNote],
  );

  React.useEffect(() => {
    if (!activeNoteId || activeNoteId.startsWith("temp-")) return;

    if (
      localTitle === activeNote?.title &&
      localContent === activeNote?.content
    ) {
      return;
    }

    const timer = setTimeout(() => {
      saveNote(undefined, true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [
    localTitle,
    localContent,
    activeNoteId,
    saveNote,
    activeNote?.title,
    activeNote?.content,
  ]);

  return {
    activeNote,
    localTitle,
    setLocalTitle,
    localContent,
    setLocalContent,
    handleManualSave,
    handleCategoryChange,
    isUpdating: updateNote.isPending,
  };
}
