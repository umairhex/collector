import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchClient as fetch } from "@/lib/fetch-client";
import * as React from "react";
import { Note, Category, DisplayCategory } from "@/types";
import { DEFAULT_CATEGORIES } from "@/lib/utils";

const fetchNotes = async (): Promise<Note[]> => {
  const response = await fetch("/api/notes");
  return response.json();
};

const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch("/api/categories");
  return response.json();
};

export function useNotes() {
  return useQuery<Note[]>({
    queryKey: ["notes"],
    queryFn: fetchNotes,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCategories() {
  const { data: notes } = useNotes();
  const categoriesQuery = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5,
  });

  return React.useMemo(() => {
    const categories = categoriesQuery.data || [];
    const catMap = new Map<string, number>();

    notes?.forEach((note) => {
      const cat = note.category || "General";
      catMap.set(cat, (catMap.get(cat) || 0) + 1);
    });

    const displayCategories: DisplayCategory[] =
      categories.length > 0
        ? categories.map((c) => ({
            id: c.name.toLowerCase(),
            name: c.name,
            count: catMap.get(c.name) || 0,
            _id: c._id,
          }))
        : DEFAULT_CATEGORIES.map((name) => ({
            id: name.toLowerCase(),
            name,
            count: catMap.get(name) || 0,
          }));

    if (
      categories.length > 0 &&
      !displayCategories.some((c) => c.name === "General")
    ) {
      displayCategories.push({
        id: "general",
        name: "General",
        count: catMap.get("General") || 0,
      });
    }

    const sortedCategories = [
      { id: "all", name: "All Notes", count: notes?.length || 0 },
      ...displayCategories.sort((a, b) => a.name.localeCompare(b.name)),
    ];

    return {
      ...categoriesQuery,
      data: sortedCategories,
    };
  }, [categoriesQuery, notes]);
}

export { type Note, type Category, type DisplayCategory } from "@/types";

export function useFilteredNotes(
  activeCategory: string,
  searchQuery: string = "",
) {
  const { data: notes, ...queryInfo } = useNotes();

  const filteredNotes = React.useMemo(() => {
    if (!notes) return [];

    let result = notes;

    if (activeCategory !== "all") {
      result = result.filter(
        (n) => (n.category || "General").toLowerCase() === activeCategory,
      );
    }

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (n) =>
          n.title?.toLowerCase().includes(lowerQuery) ||
          n.content?.toLowerCase().includes(lowerQuery),
      );
    }

    return result;
  }, [notes, activeCategory, searchQuery]);

  return { ...queryInfo, data: filteredNotes };
}

export function useAddCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      await fetch(`/api/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/categories/${id}`, { method: "DELETE" });
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}

export function useAddNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newNote: Partial<Note>) => {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNote),
      });
      return response.json() as Promise<Note>;
    },
    onMutate: async (newNote) => {
      await queryClient.cancelQueries({ queryKey: ["notes"] });
      const previousNotes = queryClient.getQueryData<Note[]>(["notes"]);

      const tempId = `temp-${Date.now()}`;
      const optimisticNote = {
        _id: tempId,
        ...newNote,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Note;

      queryClient.setQueryData<Note[]>(["notes"], (old = []) => [
        optimisticNote,
        ...old,
      ]);

      return { previousNotes, tempId };
    },
    onSuccess: (newNote, _variables, context) => {
      queryClient.setQueryData<Note[]>(["notes"], (old = []) => {
        return old.map((n) => (n._id === context?.tempId ? newNote : n));
      });
    },
    onError: (_err, _newNote, context) => {
      if (context?.previousNotes) {
        queryClient.setQueryData(["notes"], context.previousNotes);
      }
    },
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updateData
    }: Partial<Note> & { id: string }) => {
      const res = await fetch(`/api/notes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      return res.json() as Promise<Note>;
    },
    onMutate: async (updatedNote) => {
      await queryClient.cancelQueries({ queryKey: ["notes"] });
      const previousNotes = queryClient.getQueryData<Note[]>(["notes"]);

      queryClient.setQueryData<Note[]>(["notes"], (old = []) =>
        old.map((note) =>
          note._id === updatedNote.id ? { ...note, ...updatedNote } : note,
        ),
      );

      return { previousNotes };
    },
    onSuccess: (updatedNote) => {
      queryClient.setQueryData<Note[]>(["notes"], (old = []) =>
        old.map((n) => (n._id === updatedNote._id ? updatedNote : n)),
      );
    },
    onError: (_err, _newNote, context) => {
      if (context?.previousNotes) {
        queryClient.setQueryData(["notes"], context.previousNotes);
      }
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/notes/${id}`, { method: "DELETE" });
      return id;
    },
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ["notes"] });
      const previousNotes = queryClient.getQueryData<Note[]>(["notes"]);

      queryClient.setQueryData<Note[]>(["notes"], (old = []) =>
        old.filter((note) => note._id !== deletedId),
      );

      return { previousNotes };
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData<Note[]>(["notes"], (old = []) =>
        old.filter((n) => n._id !== deletedId),
      );
    },
    onError: (_err, _newNote, context) => {
      if (context?.previousNotes) {
        queryClient.setQueryData(["notes"], context.previousNotes);
      }
    },
  });
}
export function useSyncNotes() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/notes/sync", {
        method: "POST",
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
