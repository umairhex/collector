"use client";

import * as React from "react";
import { useDebouncedCallback, useThrottledCallback } from "use-debounce";
import { toast } from "sonner";
import { z } from "zod";
import { updateNoteSchema } from "@/lib/validations";
import { useUpdateNote, useNotes } from "@/hooks/use-notes";

export function useNoteSync(activeNoteId: string | null) {
  const { data: notes } = useNotes();
  const updateNote = useUpdateNote();
  const [localTitle, setLocalTitle] = React.useState("");
  const [localContent, setLocalContent] = React.useState("");
  const [isAutoSave, setIsAutoSave] = React.useState(true);
  const lastIdRef = React.useRef<string | null>(null);

  const activeNote = React.useMemo(
    () => notes?.find((n) => n._id === activeNoteId) || null,
    [notes, activeNoteId],
  );

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
      if (!activeNoteId || !activeNote) return;

      const currentCacheNote = notes?.find((n) => n._id === activeNoteId);
      if (
        currentCacheNote &&
        new Date(currentCacheNote.updatedAt) > new Date(activeNote.updatedAt)
      ) {
        const isDataConflict =
          (updates.title !== undefined &&
            updates.title !== currentCacheNote.title) ||
          (updates.content !== undefined &&
            updates.content !== currentCacheNote.content);

        if (isDataConflict) {
          toast.error(
            "Conflict detected: This note has been updated elsewhere.",
            {
              description: "Please refresh to see the latest version.",
            },
          );
          return;
        }
      }

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
    [activeNoteId, activeNote, notes, updateNote],
  );

  const throttledUpdate = useThrottledCallback(sendUpdate, 1000, {
    leading: false,
    trailing: true,
  });
  const debouncedUpdate = useDebouncedCallback(sendUpdate, 500);

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

  const toggleAutoSave = React.useCallback(() => {
    setIsAutoSave((prev) => {
      const next = !prev;
      toast.success(next ? "Auto-save enabled" : "Auto-save disabled");
      return next;
    });
  }, []);

  const handleManualSave = React.useCallback(() => {
    sendUpdate({
      title: localTitle,
      content: localContent,
      category: activeNote?.category,
    });
    toast.success("Note saved manually");
  }, [sendUpdate, localTitle, localContent, activeNote]);

  return {
    activeNote,
    localTitle,
    setLocalTitle,
    localContent,
    setLocalContent,
    isAutoSave,
    toggleAutoSave,
    scheduleUpdate,
    handleManualSave,
    isUpdating: updateNote.isPending,
  };
}
