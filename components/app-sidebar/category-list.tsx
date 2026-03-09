import { Hash, FolderOpen, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DisplayCategory as Category } from "@/types";

interface CategoryListProps {
  categories: Category[];
  activeCategory: string;
  setActiveCategory: (id: string) => void;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

export function CategoryList({
  categories,
  activeCategory,
  setActiveCategory,
  onEdit,
  onDelete,
}: CategoryListProps) {
  const isMobile = useIsMobile();

  return (
    <SidebarMenu>
      {categories.map((cat) => (
        <SidebarMenuItem key={cat.id}>
          <SidebarMenuButton
            isActive={activeCategory === cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className="group/btn hover:bg-sidebar-accent/50 relative h-9 w-full rounded-xl transition-all"
            tooltip={cat.name}
          >
            <div className="flex items-center gap-2.5">
              {cat.id === "all" ? (
                <FolderOpen className="h-4 w-4 shrink-0 transition-transform group-hover/btn:scale-110" />
              ) : (
                <Hash className="h-4 w-4 shrink-0 transition-transform group-hover/btn:scale-110" />
              )}
              <span className="truncate text-[11px] font-medium tracking-wide uppercase">
                {cat.name}
              </span>
            </div>
            <Badge
              variant={activeCategory === cat.id ? "secondary" : "outline"}
              className="bg-primary/5 group-data-[active=true]:bg-primary group-data-[active=true]:text-primary-foreground ml-auto flex h-4.5 min-w-8 items-center justify-center border-none px-1 text-[9px] font-bold group-hover/btn:opacity-0"
            >
              {cat.count}
            </Badge>
          </SidebarMenuButton>

          {cat.id !== "all" && cat._id && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction
                  showOnHover
                  className="hover:bg-primary/10 hover:text-primary rounded-lg"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Options</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
                className="border-border/50 bg-background/95 min-w-[140px] rounded-xl p-1.5 shadow-2xl backdrop-blur-xl"
              >
                <DropdownMenuItem
                  onClick={() => onEdit(cat)}
                  className="focus:bg-primary/5 focus:text-primary items-center gap-2 rounded-lg py-2.5 text-[10px] tracking-wider uppercase transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(cat._id!)}
                  className="focus:bg-destructive/10 focus:text-destructive text-destructive/80 items-center gap-2 rounded-lg py-2.5 text-[10px] tracking-wider uppercase transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
