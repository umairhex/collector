"use client";

import * as React from "react";
import { ClipboardPaste, Trash2, Loader2, CheckCircle2 } from "lucide-react";

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

interface EditorToolbarProps {
  noteTitle: string | undefined;
  isUpdating: boolean;
  isDeleting: boolean;
  onDelete: () => void;
  onPaste: () => Promise<void>;
}

export const EditorToolbar = React.memo(function EditorToolbar({
  noteTitle,
  isUpdating,
  isDeleting,
  onDelete,
  onPaste,
}: EditorToolbarProps) {
  return (
    <div className="pointer-events-none sticky right-0 bottom-8 left-0 z-10 mt-12 flex items-center justify-center">
      <div className="bg-background/60 animate-in fade-in slide-in-from-bottom-8 pointer-events-auto flex items-center gap-2 rounded-2xl border border-white/10 p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-xl duration-700">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-primary/10 hover:text-primary h-10 gap-2 rounded-xl px-4 transition-all duration-300"
              onClick={onPaste}
              aria-label="Paste from clipboard"
            >
              <ClipboardPaste className="h-4 w-4" />
              <span className="hidden text-xs font-semibold tracking-wider uppercase sm:inline">
                Paste
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            className="bg-popover text-popover-foreground border-border/50"
          >
            Paste Content
          </TooltipContent>
        </Tooltip>

        <div className="bg-border/30 mx-1 h-6 w-[1px]" />

        <div className="text-muted-foreground/80 flex min-w-[100px] items-center justify-center gap-2 rounded-xl px-4 py-2 text-[10px] font-bold tracking-[0.2em] uppercase">
          {isUpdating ? (
            <div className="flex items-center gap-2">
              <Loader2 className="text-primary h-3 w-3 animate-spin" />
              <span>Saving...</span>
            </div>
          ) : (
            <div className="text-primary/80 flex items-center gap-2">
              <CheckCircle2 className="h-3 w-3" />
              <span>Securely Synced</span>
            </div>
          )}
        </div>

        <div className="bg-border/30 mx-1 h-6 w-[1px]" />

        <AlertDialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive h-10 gap-2 rounded-xl px-4 transition-all duration-300"
                  aria-label="Delete note"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden text-xs font-semibold tracking-wider uppercase sm:inline">
                    Discard
                  </span>
                </Button>
              </AlertDialogTrigger>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="bg-destructive text-destructive-foreground border-transparent"
            >
              Delete Forever
            </TooltipContent>
          </Tooltip>
          <AlertDialogContent className="border-border/50 bg-background/95 rounded-3xl backdrop-blur-xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-heading text-3xl tracking-tight">
                Delete this masterpiece?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground font-sans text-base">
                This action is irreversible. The note &quot;
                {noteTitle || "Untitled"}&quot; will be permanently removed from
                your digital collection.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-4 gap-2 sm:gap-0">
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
    </div>
  );
});
