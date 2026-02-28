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
    <div className="flex-1 flex flex-col items-center justify-center -translate-y-16">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Search className="w-6 h-6 opacity-50" />
          </EmptyMedia>
          <EmptyTitle className="text-2xl font-heading font-semibold">
            No Note Selected
          </EmptyTitle>
          <EmptyDescription className="max-w-[250px] mx-auto">
            Select a note from the sidebar or click the plus to create a new
            one.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
