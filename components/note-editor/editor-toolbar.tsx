"use client";

import * as React from "react";
import {
  ClipboardPaste,
  Trash2,
  RefreshCcw,
  CheckCircle2,
  Save,
  Share2,
  Download,
  Copy,
  Loader2,
  Globe,
} from "lucide-react";

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

import { useIsMobile } from "@/hooks/use-mobile";
import { ToolbarButton } from "./toolbar-button";

interface EditorToolbarProps {
  noteTitle: string | undefined;
  isUpdating: boolean;
  isDeleting: boolean;
  onDelete: () => void;
  onPaste: () => Promise<void>;
  onManualSave: () => void;
  onShare: () => void;
  onExport: (format: "txt" | "md") => void;
  onCopy: () => void;
  isShareable: boolean;
  onToggleShare: () => void;
}

export const EditorToolbar = React.memo(function EditorToolbar({
  noteTitle,
  isUpdating,
  isDeleting,
  onDelete,
  onPaste,
  onManualSave,
  onShare,
  onExport,
  onCopy,
  isShareable,
  onToggleShare,
}: EditorToolbarProps) {
  const isMobile = useIsMobile();

  return (
    <div
      className={`bg-background/60 animate-in fade-in slide-in-from-top-4 border-border flex max-w-full flex-wrap items-center justify-center border shadow-sm backdrop-blur-xl duration-700 sm:w-fit ${isMobile ? "gap-0.5 rounded-xl p-1" : "gap-1.5 rounded-2xl p-1.5"}`}
    >
      <ToolbarButton
        icon={Save}
        label="Save Note"
        onClick={onManualSave}
        isLoading={isUpdating}
        loaderIcon={RefreshCcw}
      />

      {!isMobile && (
        <>
          <div className="bg-border/30 mx-1 hidden h-5 w-px sm:block" />
          <ToolbarButton
            icon={ClipboardPaste}
            label="Paste"
            shortcut="ALT V"
            onClick={onPaste}
          />
        </>
      )}

      <div className="bg-border/30 mx-1 hidden h-5 w-px sm:block" />

      <div className="flex h-8 w-8 items-center justify-center">
        {isUpdating ? (
          <Tooltip>
            <TooltipTrigger>
              <RefreshCcw className="text-primary h-4 w-4 animate-spin" />
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="hidden text-[10px] tracking-wider md:block"
            >
              Saving...
            </TooltipContent>
          </Tooltip>
        ) : typeof navigator !== "undefined" && !navigator.onLine ? (
          <Tooltip>
            <TooltipTrigger>
              <div className="h-2 w-2 animate-pulse rounded-full bg-amber-500/80" />
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="hidden text-[10px] tracking-wider md:block"
            >
              Working Offline
            </TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger>
              <CheckCircle2 className="text-primary/80 h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="hidden items-center gap-2 border-none bg-black/80 text-[10px] tracking-wider text-white backdrop-blur-md md:flex"
            >
              Saved
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      <div className="bg-border/30 mx-1 hidden h-5 w-px sm:block" />

      <ToolbarButton icon={Copy} label="Copy Note" onClick={onCopy} />

      <ToolbarButton
        icon={Globe}
        label={isShareable ? "Sharing: On" : "Sharing: Off"}
        active={isShareable}
        onClick={onToggleShare}
      />

      <div className="bg-border/30 mx-1 hidden h-5 w-px sm:block" />

      {!isMobile && (
        <>
          <ToolbarButton
            icon={Share2}
            label={isShareable ? "Copy Link" : "Enable sharing first"}
            disabled={!isShareable}
            onClick={onShare}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div>
                <ToolbarButton icon={Download} label="EXPORT" />
              </div>
            </DropdownMenuTrigger>
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
        </>
      )}

      <div className="bg-border/30 mx-1 hidden h-5 w-px sm:block" />

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <div>
            <ToolbarButton
              icon={Trash2}
              label="Delete"
              variant="destructive"
              className="hover:bg-destructive/10"
            />
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent className="border-border/50 bg-background/95 rounded-3xl backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading text-3xl tracking-widest">
              Delete this note?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground font-sans text-base">
              This action is irreversible. The note &quot;
              {noteTitle || "Untitled"}&quot; will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2">
            <AlertDialogCancel className="border-border/50 rounded-xl">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-xl"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete Note"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
});
