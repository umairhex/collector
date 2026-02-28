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
  return (
    <SidebarGroup>
      <div className="flex items-center justify-between px-2 mb-2">
        <SidebarGroupLabel className="font-heading tracking-wider uppercase">
          Categories
        </SidebarGroupLabel>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 relative top-[2px]"
          onClick={onAddCategory}
          aria-label="Add new category"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <SidebarMenu>
        {isLoading ? (
          <div className="space-y-2 p-2 w-full">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded-md">
                <Skeleton className="h-4 w-4 bg-primary/10" />
                <Skeleton className="h-4 flex-1 bg-primary/10" />
                <Skeleton className="h-4 w-6 rounded-full bg-primary/10" />
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
                    <FolderOpen className="w-4 h-4" />
                  ) : (
                    <Hash className="w-4 h-4" />
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
