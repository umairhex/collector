"use client";

import * as React from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Textarea } from "@/components/ui/textarea";
import { CategorySelector } from "./category-selector";

interface EditorCanvasProps {
  title: string;
  content: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  category: string;
  categoriesList: string[];
  onCategoryChange: (category: string) => void;
  updatedAt: string;
}

export function EditorCanvas({
  title,
  content,
  onTitleChange,
  onContentChange,
  category,
  categoriesList,
  onCategoryChange,
  updatedAt,
}: EditorCanvasProps) {
  const titleRef = React.useRef<HTMLTextAreaElement>(null);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex-shrink-0">
        <TextareaAutosize
          ref={titleRef}
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          role="heading"
          aria-level={1}
          className="w-full text-5xl lg:text-7xl font-heading tracking-tight bg-transparent border-none focus:outline-none focus:ring-0 mb-6 placeholder:text-muted/50 transition-all duration-300 resize-none overflow-hidden"
          placeholder="Untitled Note"
        />

        <div className="flex items-center gap-4">
          <CategorySelector
            currentCategory={category}
            categoriesList={categoriesList}
            onCategoryChange={onCategoryChange}
          />
          <div className="h-4 w-[1px] bg-border/50" />
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
            Last edited{" "}
            {new Date(updatedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      <div className="relative group">
        <Textarea
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          spellCheck={false}
          data-gramm="false"
          className="flex-1 min-h-[500px] w-full bg-transparent border-none focus-visible:ring-0 resize-none text-lg leading-relaxed md:text-xl shadow-none px-0 font-sans placeholder:text-muted/20 pb-32 transition-colors duration-300 px-3"
          placeholder="Start writing something extraordinary..."
        />

        {/* Subtle visual guide Line */}
        <div className="absolute left-[-1.5rem] top-0 bottom-0 w-[1px] bg-gradient-to-b from-primary/20 via-primary/5 to-transparent hidden lg:block" />
      </div>
    </div>
  );
}
