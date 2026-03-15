"use client";

import * as React from "react";
import { toast } from "sonner";
import { z } from "zod";
import { updateNoteSchema } from "@/lib/validations";
import { useUpdateNote, useNotes } from "@/hooks/use-notes";

export function useNoteState(activeNoteId: string | null) {
  const { data: notes } = useNotes();
  const updateNote = useUpdateNote();
  const [localTitle, setLocalTitle] = React.useState("");
  const [localContent, setLocalContent] = React.useState("");
  const [localCategory, setLocalCategory] = React.useState("");
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
      setLocalCategory((prev) =>
        !isSameNote && !wasOptimistic ? activeNote.category || "" : prev,
      );
      lastIdRef.current = activeNoteId;
    } else {
      setLocalTitle("");
      setLocalContent("");
      setLocalCategory("");
      lastIdRef.current = null;
    }
  }, [activeNote, activeNoteId]);

  const saveNote = React.useCallback(() => {
    if (!activeNoteId || !activeNote) {
      console.warn("LOG: Save attempted but no active note");
      return;
    }

    if (localTitle === "") {
      toast.error("Note title cannot be empty");
      console.warn("LOG: Save blocked - empty title");
      return;
    }

    try {
      const validated = updateNoteSchema.parse({
        title: localTitle,
        content: localContent,
        category: localCategory || activeNote.category,
      });

      if (activeNoteId.startsWith("temp-")) {
        console.warn(
          "LOG: [useNoteState] saveNote returned early due to temp- id",
          { activeNoteId },
        );
        toast.info("Creating note, please wait...");
        return;
      } else {
        updateNote.mutate(
          { id: activeNoteId, ...validated },
          {
            onSuccess: () => {
              toast.success("Note saved successfully");
            },
            onError: (error) => {
              console.error("ERROR: Failed to save note", error);
              toast.error("Failed to save note");
            },
          },
        );
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("ERROR: Validation error", error);
        toast.error(error.issues[0].message);
      }
    }
  }, [
    activeNoteId,
    activeNote,
    localTitle,
    localContent,
    localCategory,
    updateNote,
  ]);

  const handleManualSave = React.useCallback(() => {
    saveNote();
  }, [saveNote]);

  const handleCategoryChange = React.useCallback((newCategory: string) => {
    setLocalCategory(newCategory);
  }, []);

  return {
    activeNote,
    localTitle,
    setLocalTitle,
    localContent,
    setLocalContent,
    localCategory,
    setLocalCategory,
    handleManualSave,
    handleCategoryChange,
    isUpdating: updateNote.isPending,
  };
}
