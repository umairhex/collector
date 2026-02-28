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
          className="font-heading placeholder:text-muted/50 mb-6 w-full resize-none overflow-hidden border-none bg-transparent text-5xl tracking-tight transition-all duration-300 focus:ring-0 focus:outline-none lg:text-7xl"
          placeholder="Untitled Note"
        />

        <div className="flex items-center gap-4">
          <CategorySelector
            currentCategory={category}
            categoriesList={categoriesList}
            onCategoryChange={onCategoryChange}
          />
          <div className="bg-border/50 h-4 w-[1px]" />
          <span className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">
            Last edited{" "}
            {new Date(updatedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      <div className="group relative">
        <Textarea
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          spellCheck={false}
          data-gramm="false"
          className="placeholder:text-muted/20 min-h-[500px] w-full flex-1 resize-none border-none bg-transparent px-0 px-3 pb-32 font-sans text-lg leading-relaxed shadow-none transition-colors duration-300 focus-visible:ring-0 md:text-xl"
          placeholder="Start writing something extraordinary..."
        />

        <div className="from-primary/20 via-primary/5 absolute top-0 bottom-0 left-[-1.5rem] hidden w-[1px] bg-gradient-to-b to-transparent lg:block" />
      </div>
    </div>
  );
}
