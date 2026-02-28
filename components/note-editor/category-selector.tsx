"use client";

import * as React from "react";
import { Hash, ChevronDown, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface CategorySelectorProps {
  currentCategory: string | undefined;
  categoriesList: string[];
  onCategoryChange: (category: string) => void;
}

export function CategorySelector({
  currentCategory,
  categoriesList,
  onCategoryChange,
}: CategorySelectorProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex items-center gap-3">
      <span className="text-muted-foreground text-sm font-medium">
        Category:
      </span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="bg-muted/30 border-border/50 h-8 justify-between gap-2 px-2.5 text-sm capitalize shadow-none"
          >
            <Hash className="text-muted-foreground h-3.5 w-3.5" />
            {currentCategory || "General"}
            <ChevronDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search or add category..." />
            <CommandList>
              <CommandEmpty>No category found.</CommandEmpty>
              <CommandGroup>
                {categoriesList.map((categoryItem) => (
                  <CommandItem
                    key={categoryItem}
                    value={categoryItem}
                    onSelect={(currentValue) => {
                      onCategoryChange(currentValue);
                      setOpen(false);
                    }}
                    className="cursor-pointer capitalize"
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        (currentCategory || "General").toLowerCase() ===
                        categoryItem.toLowerCase()
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    />
                    {categoryItem}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
