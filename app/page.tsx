import * as React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { NoteEditor } from "@/components/note-editor";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Page() {
  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <NoteEditor />
    </SidebarProvider>
  );
}
