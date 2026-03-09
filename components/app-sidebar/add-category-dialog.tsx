"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { categorySchema } from "@/lib/validations";
import { toast } from "sonner";
import { z } from "zod";

interface CategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string) => void;
  isPending: boolean;
  initialName?: string;
  mode?: "add" | "edit";
}

export function CategoryDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  isPending,
  initialName = "",
  mode = "add",
}: CategoryDialogProps) {
  const [name, setName] = React.useState(initialName);

  React.useEffect(() => {
    if (isOpen) setName(initialName);
  }, [isOpen, initialName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validated = categorySchema.parse({ name: name.trim() });
      onSubmit(validated.name);
      setName("");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.issues[0].message);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="border-border/50 bg-background/95 rounded-3xl backdrop-blur-xl sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl tracking-widest uppercase">
              {mode === "edit" ? "Rename Category" : "New Category"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground/60 text-[10px] tracking-[0.1em] uppercase">
              {mode === "edit"
                ? "Update the category name for your notes."
                : "Create a new category to organize your notes."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-6">
            <div className="grid gap-3">
              <Label
                htmlFor="name"
                className="text-muted-foreground ml-1 text-[10px] tracking-[0.2em] uppercase"
              >
                Category Name
              </Label>
              <Input
                id="name"
                placeholder="e.g. Research, Archive, Personal"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                className="bg-background border-border/50 focus:ring-primary/10 w-full rounded-xl border px-4 py-3 text-sm font-medium shadow-inner transition-all focus:ring-4 focus:outline-none"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-border/50 h-11 rounded-xl px-6 text-[10px] tracking-[0.2em] uppercase"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                !name.trim() ||
                isPending ||
                (mode === "edit" && name.trim() === initialName)
              }
              className="h-11 rounded-xl px-8 text-[10px] tracking-[0.2em] uppercase transition-all"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "edit" ? "Update Category" : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
