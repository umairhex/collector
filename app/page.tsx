import * as React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { NoteEditor } from "@/components/note-editor";
import { SidebarProvider } from "@/components/ui/sidebar";
import { verifyAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const { isAuthorized, isSetupRequired } = await verifyAuth();

  if (!isAuthorized && !isSetupRequired) {
    redirect("/login");
  } else if (isSetupRequired) {
    redirect("/login?setup=true");
  }

  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <NoteEditor />
    </SidebarProvider>
  );
}
