import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Note {
  _id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

const fetchNotes = async () => {
  const response = await fetch("/api/notes");
  if (!response.ok) throw new Error("Failed to fetch notes");
  return response.json();
};

export function useNotes() {
  return useQuery<Note[]>({
    queryKey: ["notes"],
    queryFn: fetchNotes,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Custom hook to derive categories from notes
 */
export function useCategories() {
  return useQuery<Note[], Error, { id: string; name: string; count: number }[]>(
    {
      queryKey: ["notes"],
      queryFn: fetchNotes,
      staleTime: 1000 * 60 * 5,
      select: (notes) => {
        if (!notes) return [{ id: "all", name: "All Notes", count: 0 }];

        const catMap = new Map<string, number>();
        notes.forEach((note) => {
          const cat = note.category || "General";
          catMap.set(cat, (catMap.get(cat) || 0) + 1);
        });

        const dynamicCats = Array.from(catMap.entries()).map(
          ([name, count]) => ({
            id: name.toLowerCase(),
            name,
            count,
          }),
        );

        return [
          { id: "all", name: "All Notes", count: notes.length },
          ...dynamicCats.sort((a, b) => a.name.localeCompare(b.name)),
        ];
      },
    },
  );
}

/**
 * Custom hook to derive simple categories list
 */
export function useCategoriesList() {
  return useQuery<Note[], Error, string[]>({
    queryKey: ["notes"],
    queryFn: fetchNotes,
    staleTime: 1000 * 60 * 5,
    select: (notes) => {
      if (!notes) return ["Ideas", "Work", "General"];
      const cats = new Set(notes.map((n) => n.category || "General"));
      if (!cats.has("Ideas")) cats.add("Ideas");
      if (!cats.has("Work")) cats.add("Work");
      if (!cats.has("General")) cats.add("General");
      return Array.from(cats).sort();
    },
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newNote: Partial<Note>) => {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNote),
      });
      if (!response.ok) throw new Error("Failed to create note");
      return response.json() as Promise<Note>;
    },
    onMutate: async (newNote) => {
      await queryClient.cancelQueries({ queryKey: ["notes"] });
      const previousNotes = queryClient.getQueryData<Note[]>(["notes"]);

      const optimisticNote = {
        _id: `temp-${Date.now()}`,
        ...newNote,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Note;

      queryClient.setQueryData<Note[]>(["notes"], (old = []) => [
        optimisticNote,
        ...old,
      ]);

      return { previousNotes };
    },
    onSuccess: (newNote) => {
      queryClient.setQueryData<Note[]>(["notes"], (old = []) => {
        return old.map((n) => (n._id.startsWith("temp-") ? newNote : n));
      });
    },
    onError: (_err, _newNote, context) => {
      if (context?.previousNotes) {
        queryClient.setQueryData(["notes"], context.previousNotes);
      }
    },
    onSettled: () => {
      // Intentionally removed full invalidation to prevent redundant re-fetches (FLOW-004)
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
      const response = await fetch(`/api/notes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      if (!response.ok) throw new Error("Failed to update note");
      return response.json() as Promise<Note>;
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
    onSettled: () => {
      // Intentionally removed full invalidation to prevent redundant re-fetches (FLOW-004)
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete note");
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
    onSettled: () => {
      // Intentionally removed full invalidation to prevent redundant re-fetches (FLOW-004)
    },
  });
}
