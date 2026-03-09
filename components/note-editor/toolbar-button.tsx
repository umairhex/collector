"use client";

import * as React from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ToolbarButtonProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  className?: string;
  iconClassName?: string;
  shortcut?: string;
  variant?: "ghost" | "destructive" | "default";
  isLoading?: boolean;
  loaderIcon?: LucideIcon;
}

export function ToolbarButton({
  icon: Icon,
  label,
  onClick,
  active,
  disabled,
  className,
  iconClassName,
  shortcut,
  variant = "ghost",
  isLoading,
  loaderIcon: LoaderIcon,
}: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={active ? "default" : variant}
          size="sm"
          className={cn(
            "h-8 w-8 rounded-xl p-0 transition-all duration-300",
            active && "text-primary bg-primary/10 hover:bg-primary/20",
            !active &&
              variant === "ghost" &&
              "text-muted-foreground hover:bg-muted",
            className,
          )}
          onClick={onClick}
          disabled={disabled || isLoading}
          aria-label={label}
        >
          {isLoading && LoaderIcon ? (
            <LoaderIcon className={cn("h-4 w-4 animate-spin", iconClassName)} />
          ) : (
            <Icon className={cn("h-4 w-4", iconClassName)} />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="hidden items-center gap-2 border-none bg-black/80 text-[10px] tracking-wider text-white backdrop-blur-md md:flex"
      >
        <span>{label}</span>
        {shortcut && (
          <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono opacity-60">
            {shortcut}
          </kbd>
        )}
      </TooltipContent>
    </Tooltip>
  );
}
