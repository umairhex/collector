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
      <span className="text-sm font-medium text-muted-foreground">
        Category:
      </span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-8 justify-between bg-muted/30 capitalize gap-2 text-sm px-2.5 shadow-none border-border/50"
          >
            <Hash className="w-3.5 h-3.5 text-muted-foreground" />
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
                    className="capitalize cursor-pointer"
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
