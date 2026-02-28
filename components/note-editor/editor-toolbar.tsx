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
    <div className="mt-12 sticky bottom-8 left-0 right-0 z-10 flex items-center justify-center pointer-events-none">
      <div className="flex items-center gap-2 p-1.5 bg-background/60 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-2xl pointer-events-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-10 px-4 gap-2 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-300"
              onClick={onPaste}
              aria-label="Paste from clipboard"
            >
              <ClipboardPaste className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline">
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

        <div className="w-[1px] h-6 bg-border/30 mx-1" />

        <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] uppercase font-bold tracking-[0.2em] min-w-[100px] justify-center text-muted-foreground/80">
          {isUpdating ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-3 h-3 animate-spin text-primary" />
              <span>Saving...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-primary/80">
              <CheckCircle2 className="w-3 h-3" />
              <span>Securely Synced</span>
            </div>
          )}
        </div>

        <div className="w-[1px] h-6 bg-border/30 mx-1" />

        <AlertDialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 px-4 gap-2 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive transition-all duration-300"
                  aria-label="Delete note"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline">
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
          <AlertDialogContent className="rounded-3xl border-border/50 bg-background/95 backdrop-blur-xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-heading text-3xl tracking-tight">
                Delete this masterpiece?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base text-muted-foreground font-sans">
                This action is irreversible. The note &quot;
                {noteTitle || "Untitled"}&quot; will be permanently removed from
                your digital collection.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2 sm:gap-0 mt-4">
              <AlertDialogCancel className="rounded-xl border-border/50">
                Preserve Note
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-xl"
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
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
