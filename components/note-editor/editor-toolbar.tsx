"use client";

import * as React from "react";
import {
  ClipboardPaste,
  Trash2,
  Loader2,
  CheckCircle2,
  RefreshCcw,
  Save,
  Share2,
  Download,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EditorToolbarProps {
  noteTitle: string | undefined;
  isUpdating: boolean;
  isDeleting: boolean;
  onDelete: () => void;
  onPaste: () => Promise<void>;
  isAutoSave: boolean;
  onToggleAutoSave: () => void;
  onManualSave: () => void;
  onShare: () => void;
  onExport: (format: "txt" | "md") => void;
}

export const EditorToolbar = React.memo(function EditorToolbar({
  noteTitle,
  isUpdating,
  isDeleting,
  onDelete,
  onPaste,
  isAutoSave,
  onToggleAutoSave,
  onManualSave,
  onShare,
  onExport,
}: EditorToolbarProps) {
  return (
    <div className="bg-background/60 animate-in fade-in slide-in-from-top-4 border-border flex w-fit items-center gap-1.5 rounded-2xl border p-1.5 shadow-sm backdrop-blur-xl duration-700">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 w-8 rounded-xl p-0 transition-all duration-300 ${isAutoSave ? "text-primary hover:bg-primary/10" : "text-muted-foreground hover:bg-muted"}`}
            onClick={onToggleAutoSave}
            aria-label="Toggle Auto Save"
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="flex items-center gap-2 border-none bg-black/80 text-[10px] font-bold tracking-wider text-white backdrop-blur-md"
        >
          <span>{isAutoSave ? "AUTO SAVE: ON" : "AUTO SAVE: OFF"}</span>
        </TooltipContent>
      </Tooltip>

      {!isAutoSave && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-primary/10 text-primary h-8 w-8 rounded-xl p-0 transition-all duration-300"
              onClick={onManualSave}
              aria-label="Manual Save"
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            className="flex items-center gap-2 border-none bg-black/80 text-[10px] font-bold tracking-wider text-white backdrop-blur-md"
          >
            <span>MANUAL SAVE</span>
          </TooltipContent>
        </Tooltip>
      )}

      <div className="bg-border/30 mx-1 h-5 w-px" />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-primary/10 hover:text-primary h-8 w-8 rounded-xl p-0 transition-all duration-300"
            onClick={onPaste}
            aria-label="Paste from clipboard"
          >
            <ClipboardPaste className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="flex items-center gap-2 border-none bg-black/80 text-[10px] font-bold tracking-wider text-white backdrop-blur-md"
        >
          <span>INSTANT PASTE</span>
          <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono opacity-60">
            ALT V
          </kbd>
        </TooltipContent>
      </Tooltip>

      <div className="bg-border/30 mx-1 h-5 w-px" />

      <div className="flex h-8 w-8 items-center justify-center">
        {isUpdating ? (
          <Tooltip>
            <TooltipTrigger>
              <Loader2 className="text-primary h-4 w-4 animate-spin" />
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="text-[10px] font-bold tracking-wider"
            >
              SYNCING...
            </TooltipContent>
          </Tooltip>
        ) : typeof navigator !== "undefined" && !navigator.onLine ? (
          <Tooltip>
            <TooltipTrigger>
              <div className="h-2 w-2 animate-pulse rounded-full bg-amber-500/80" />
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="text-[10px] font-bold tracking-wider"
            >
              OFFLINE READY
            </TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger>
              <CheckCircle2 className="text-primary/80 h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="flex items-center gap-2 border-none bg-black/80 text-[10px] font-bold tracking-wider text-white backdrop-blur-md"
            >
              {" "}
              CLOUD SYNCED{" "}
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      <div className="bg-border/30 mx-1 h-5 w-px" />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-primary/10 hover:text-primary h-8 w-8 rounded-xl p-0 transition-all duration-300"
            onClick={onShare}
            aria-label="Share note"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="flex items-center gap-2 border-none bg-black/80 text-[10px] font-bold tracking-wider text-white backdrop-blur-md"
        >
          <span>COPY SHARE LINK</span>
        </TooltipContent>
      </Tooltip>

      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-primary/10 hover:text-primary h-8 w-8 rounded-xl p-0 transition-all duration-300"
                aria-label="Download options"
              >
                <Download className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            className="flex items-center gap-2 border-none bg-black/80 text-[10px] font-bold tracking-wider text-white backdrop-blur-md"
          >
            <span>EXPORT</span>
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="end" className="w-40 rounded-xl">
          <DropdownMenuItem
            onClick={() => onExport("md")}
            className="cursor-pointer rounded-lg"
          >
            Export as Markdown (.md)
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onExport("txt")}
            className="cursor-pointer rounded-lg"
          >
            Export as Plain Text (.txt)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="bg-border/30 mx-1 h-5 w-px" />

      <AlertDialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8 rounded-xl p-0 transition-all duration-300"
                aria-label="Delete note"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            className="bg-destructive text-destructive-foreground border-transparent text-[10px] font-bold tracking-wider"
          >
            DISCARD
          </TooltipContent>
        </Tooltip>
        <AlertDialogContent className="border-border/50 bg-background/95 rounded-3xl backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading text-3xl tracking-widest">
              Delete this masterpiece?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground font-sans text-base">
              This action is irreversible. The note &quot;
              {noteTitle || "Untitled"}&quot; will be permanently removed from
              your digital collection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2">
            <AlertDialogCancel className="border-border/50 rounded-xl">
              Preserve Note
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-xl"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Confirm Deletion"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
});
