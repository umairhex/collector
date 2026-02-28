"use client";

import * as React from "react";
import { BookOpen } from "lucide-react";
import { useQueryState } from "nuqs";
import { toast } from "sonner";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useNotes, useCreateNote, useCategories } from "@/hooks/use-notes";
import { CategoryList } from "./app-sidebar/category-list";
import { NoteList } from "./app-sidebar/note-list";
import { AddCategoryDialog } from "./app-sidebar/add-category-dialog";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [activeCategory, setActiveCategory] = useQueryState("category", {
    defaultValue: "all",
  });
  const [activeNoteId, setActiveNoteId] = useQueryState("noteId");
  const [searchQuery] = useQueryState("search", { defaultValue: "" });

  const { data: notes, isLoading } = useNotes();
  const { data: categories = [{ id: "all", name: "All Notes", count: 0 }] } =
    useCategories();
  const createNote = useCreateNote();

  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = React.useState(false);

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
          (n.title && n.title.toLowerCase().includes(lowerQuery)) ||
          (n.content && n.content.toLowerCase().includes(lowerQuery)),
      );
    }

    return result;
  }, [notes, activeCategory, searchQuery]);

  const handleCreateNote = () => {
    const defaultCategory =
      activeCategory === "all"
        ? "Ideas"
        : activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1);

    createNote.mutate(
      { title: "Untitled Note", content: "", category: defaultCategory },
      {
        onSuccess: (newNote) => {
          setActiveNoteId(newNote._id);
          if (activeCategory === "all") {
            setActiveCategory(defaultCategory.toLowerCase());
          }
          toast.success("Note created successfully");
        },
        onError: () => toast.error("Failed to create note"),
      },
    );
  };

  const handleAddCategory = (name: string) => {
    createNote.mutate(
      {
        title: `Welcome to ${name}`,
        content: `This is your first note in the ${name} category.`,
        category: name,
      },
      {
        onSuccess: (newNote) => {
          setIsCategoryDialogOpen(false);
          setActiveNoteId(newNote._id);
          setActiveCategory(name.toLowerCase());
          toast.success(`Category "${name}" created`);
        },
        onError: () => toast.error("Failed to create category"),
      },
    );
  };

  return (
    <>
      <Sidebar {...props}>
        <SidebarHeader className="border-border bg-muted/20 border-b px-4 py-4">
          <div className="font-heading flex items-center gap-3 text-2xl font-semibold tracking-wide">
            <div className="bg-primary text-primary-foreground rounded-lg p-2 shadow-sm">
              <BookOpen className="h-5 w-5" />
            </div>
            Collector
          </div>
        </SidebarHeader>

        <SidebarContent className="bg-muted/10">
          <CategoryList
            categories={categories}
            activeCategory={activeCategory}
            onCategorySelect={setActiveCategory}
            onAddCategory={() => setIsCategoryDialogOpen(true)}
            isLoading={isLoading}
          />

          <NoteList
            notes={filteredNotes}
            activeNoteId={activeNoteId}
            onNoteSelect={setActiveNoteId}
            onCreateNote={handleCreateNote}
            isCreating={createNote.isPending}
            isLoading={isLoading}
            searchQuery={searchQuery}
          />
        </SidebarContent>
        <SidebarRail />
      </Sidebar>

      <AddCategoryDialog
        isOpen={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
        onSubmit={handleAddCategory}
        isPending={createNote.isPending}
      />
    </>
  );
}
