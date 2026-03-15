"use client";

import * as React from "react";
import { Plus, Settings, LogOut } from "lucide-react";
import { useQueryState } from "nuqs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuthMutation } from "@/hooks/use-auth";
import { useAddNote, useCategories, useNotes } from "@/hooks/use-notes";
import { useCategoryActions } from "@/hooks/use-category-actions";
import { CategoryList } from "./app-sidebar/category-list";
import { NoteList } from "./app-sidebar/note-list";
import { CategoryDialog } from "./app-sidebar/add-category-dialog";
import { ChangeCodeDialog } from "./app-sidebar/change-code-dialog";
import { SearchInput } from "./search-input";
import { AuthResponse } from "@/types";

export function AppSidebar() {
  const router = useRouter();
  const [activeNoteId, setActiveNoteId] = useQueryState("noteId");
  const [activeCategory, setActiveCategory] = useQueryState("category", {
    defaultValue: "all",
  });
  const [searchQuery, setSearchQuery] = useQueryState("search", {
    defaultValue: "",
  });

  const {
    isAddOpen,
    setIsAddOpen,
    isEditOpen,
    setIsEditOpen,
    categoryToEdit,
    setCategoryToEdit,
    handleAdd,
    handleEdit,
    handleDelete,
    isPending: isCategoryPending,
  } = useCategoryActions();

  const [isAuthOpen, setIsAuthOpen] = React.useState(false);

  const auth = useAuthMutation();
  const addNote = useAddNote();
  const { data: notes = [] } = useNotes();
  const { data: categories = [] } = useCategories();

  const handleCreateNote = () => {
    const category = activeCategory === "all" ? "General" : activeCategory;
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    setActiveNoteId(tempId);

    addNote.mutate(
      { category, _id: tempId },
      {
        onSuccess: (note) => {
          console.log(
            "LOG: [app-sidebar] creation onSuccess data payload:",
            note,
          );
          if (!note?._id) {
            console.error(
              "LOG: [app-sidebar] FAIL - Received note without _id!",
            );
            toast.error("Failed to retrieve note identifier");
            return;
          }
          console.log(
            "LOG: [app-sidebar] Triggering setActiveNoteId with:",
            note._id,
          );
          setActiveNoteId(note._id);
          toast.success(`Note created in ${category}`);
        },
        onError: (error) => {
          console.error("LOG: [app-sidebar] creation onError:", error);
          toast.error("Failed to create note");
        },
      },
    );
  };

  return (
    <Sidebar
      collapsible="icon"
      className="bg-sidebar/50 border-r-0 backdrop-blur-xl"
    >
      <SidebarHeader className="border-sidebar-border/50 border-b p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex flex-col items-start px-1 transition-all group-data-[collapsible=icon]:justify-center">
              <div className="flex flex-col items-start whitespace-nowrap group-data-[collapsible=icon]:hidden">
                <span className="font-heading text-3xl leading-none font-semibold tracking-widest uppercase">
                  Collector
                </span>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-6 py-6">
        <SidebarGroup className="px-4 group-data-[collapsible=icon]:hidden">
          <SidebarGroupContent>
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              className="bg-background/50 border-sidebar-border/50 focus:ring-sidebar-ring/10 h-10 rounded-xl"
            />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="px-2">
          <SidebarGroupLabel className="text-[10px] tracking-[0.2em] uppercase">
            Categories
          </SidebarGroupLabel>
          <SidebarGroupAction
            onClick={() => setIsAddOpen(true)}
            title="Add Category"
          >
            <Plus className="h-3.5 w-3.5" />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <CategoryList
              categories={categories}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              onEdit={(category) => {
                setCategoryToEdit(category);
                setIsEditOpen(true);
              }}
              onDelete={handleDelete}
            />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="px-2 group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel className="text-[10px] tracking-[0.2em] uppercase">
            Notes
          </SidebarGroupLabel>
          <SidebarGroupAction onClick={handleCreateNote} title="New Note">
            <Plus className="h-3.5 w-3.5" />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <NoteList
              notes={notes}
              activeNoteId={activeNoteId}
              setActiveNoteId={setActiveNoteId}
              activeCategory={activeCategory}
              searchQuery={searchQuery}
            />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-sidebar-border/50 border-t p-2">
        <SidebarMenu className="gap-1">
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              onClick={() => setIsAuthOpen(true)}
              className="hover:bg-sidebar-accent/50 rounded-xl"
            >
              <Settings className="h-4 w-4" />
              <span className="text-[10px] font-medium tracking-[0.15em] uppercase group-data-[collapsible=icon]:hidden">
                Settings
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              onClick={() =>
                auth.mutate(
                  { action: "logout" },
                  {
                    onSuccess: (data: AuthResponse) => {
                      toast.success(data.message || "Logged out");
                      router.push("/login");
                    },
                    onError: (error) => {
                      toast.error(`Logout failed: ${error.message}`);
                    },
                  },
                )
              }
              className="hover:bg-destructive/10 hover:text-destructive rounded-xl"
              disabled={auth.isPending}
            >
              <LogOut className="h-4 w-4" />
              <span className="text-[10px] font-medium tracking-[0.15em] uppercase group-data-[collapsible=icon]:hidden">
                Logout
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />

      <CategoryDialog
        isOpen={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSubmit={handleAdd}
        isPending={isCategoryPending}
        mode="add"
      />

      <CategoryDialog
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSubmit={handleEdit}
        isPending={isCategoryPending}
        initialName={categoryToEdit?.name || ""}
        mode="edit"
      />

      <ChangeCodeDialog isOpen={isAuthOpen} onOpenChange={setIsAuthOpen} />
    </Sidebar>
  );
}
