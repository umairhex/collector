"use client";

import * as React from "react";
import { FolderOpen, Hash, Plus } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Category {
  id: string;
  name: string;
  count: number;
}

interface CategoryListProps {
  categories: Category[];
  activeCategory: string;
  onCategorySelect: (id: string) => void;
  onAddCategory: () => void;
  isLoading: boolean;
}

export function CategoryList({
  categories,
  activeCategory,
  onCategorySelect,
  onAddCategory,
  isLoading,
}: CategoryListProps) {
  const isMobile = useIsMobile();
  return (
    <SidebarGroup>
      <div className="mb-2 flex items-center justify-between px-2">
        <SidebarGroupLabel className="font-heading tracking-wider uppercase">
          Categories
        </SidebarGroupLabel>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative top-[2px] h-6 w-6"
              onClick={onAddCategory}
              aria-label="Add new category"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side={isMobile ? "bottom" : "right"}
            className="flex items-center gap-2 border-none bg-black/80 text-[10px] font-bold tracking-wider text-white backdrop-blur-md"
          >
            <span>NEW CATEGORY</span>
            <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono opacity-60">
              ALT C
            </kbd>
          </TooltipContent>
        </Tooltip>
      </div>
      <SidebarMenu>
        {isLoading ? (
          <div className="w-full space-y-2 p-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2 rounded-md p-2">
                <Skeleton className="bg-primary/10 h-4 w-4" />
                <Skeleton className="bg-primary/10 h-4 flex-1" />
                <Skeleton className="bg-primary/10 h-4 w-6 rounded-full" />
              </div>
            ))}
          </div>
        ) : (
          categories.map((cat) => (
            <SidebarMenuItem key={cat.id}>
              <SidebarMenuButton
                isActive={activeCategory === cat.id}
                onClick={() => onCategorySelect(cat.id)}
                className="justify-between"
                tooltip={cat.name}
              >
                <div className="flex items-center gap-2">
                  {cat.id === "all" ? (
                    <FolderOpen className="h-4 w-4" />
                  ) : (
                    <Hash className="h-4 w-4" />
                  )}
                  <span>{cat.name}</span>
                </div>
                <Badge
                  variant={activeCategory === cat.id ? "secondary" : "outline"}
                  className={
                    activeCategory === cat.id
                      ? "bg-primary-foreground/20 text-primary-foreground border-transparent"
                      : "bg-transparent"
                  }
                >
                  {cat.count}
                </Badge>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
