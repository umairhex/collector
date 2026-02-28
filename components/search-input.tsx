"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string | null) => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onChange, placeholder = "Search Notes...", className }, ref) => {
    return (
      <div className={cn("relative w-full", className)}>
        <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2" />
        <Input
          ref={ref}
          type="text"
          placeholder={placeholder}
          className="bg-muted/50 h-9 w-full border-none pr-12 pl-8 focus-visible:ring-1"
          value={value}
          onChange={(e) => onChange(e.target.value || null)}
        />
        <div className="pointer-events-none absolute top-1/2 right-2.5 hidden -translate-y-1/2 items-center gap-1 rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white/40 ring-1 ring-white/10 transition-colors md:flex">
          <span className="text-xs">⌘</span>K
        </div>
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";
