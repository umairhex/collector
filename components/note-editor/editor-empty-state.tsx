"use client";

import * as React from "react";
import { Search } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function EditorEmptyState() {
  return (
    <div className="flex flex-1 -translate-y-16 flex-col items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Search className="h-6 w-6 opacity-50" />
          </EmptyMedia>
          <EmptyTitle className="font-heading text-2xl font-semibold">
            No Note Selected
          </EmptyTitle>
          <EmptyDescription className="mx-auto max-w-[250px]">
            Select a note from the sidebar or click the plus to create a new
            one.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
