"use client";

import * as React from "react";
import TextareaAutosize from "react-textarea-autosize";
import { CategorySelector } from "./category-selector";
import { TiptapToolbar } from "./tiptap-toolbar";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import Image from "@tiptap/extension-image";

interface EditorCanvasProps {
  noteId: string;
  title: string;
  content: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  category: string;
  categoriesList: string[];
  onCategoryChange: (category: string) => void;
  updatedAt: string;
  toolbar?: React.ReactNode;
}

export function EditorCanvas({
  noteId,
  title,
  content,
  onTitleChange,
  onContentChange,
  category,
  categoriesList,
  onCategoryChange,
  updatedAt,
  toolbar,
}: EditorCanvasProps) {
  const titleRef = React.useRef<HTMLTextAreaElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({
        placeholder: "Start writing something extraordinary...",
        emptyEditorClass: "is-editor-empty",
      }),
      CharacterCount,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "placeholder:text-muted/20 w-full flex-1 resize-none border-none bg-transparent font-sans text-lg leading-relaxed shadow-none transition-colors duration-300 focus-visible:ring-0 md:text-xl focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
    },
  });

  React.useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [noteId, editor, content]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-1 flex-col duration-500">
      <div className="mb-8 shrink-0">
        <TextareaAutosize
          ref={titleRef}
          value={title}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            onTitleChange(e.target.value)
          }
          role="heading"
          aria-level={1}
          className="font-heading placeholder:text-muted/50 mb-6 w-full resize-none overflow-hidden border-none bg-transparent text-5xl tracking-tight transition-all duration-300 focus:ring-0 focus:outline-none lg:text-7xl"
          placeholder="Untitled Note"
        />

        <div className="flex flex-wrap items-center gap-4">
          <CategorySelector
            currentCategory={category}
            categoriesList={categoriesList}
            onCategoryChange={onCategoryChange}
          />
          <div className="bg-border/50 h-4 w-px" />
          <span className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">
            Last edited{" "}
            {new Date(updatedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {toolbar && (
            <>
              <div className="bg-border/50 h-4 w-px" />
              {toolbar}
            </>
          )}

          {editor && (
            <>
              <div className="bg-border/50 h-4 w-px" />
              <TiptapToolbar editor={editor} />
            </>
          )}
        </div>
      </div>

      <div className="group relative flex-1 pb-24">
        <EditorContent editor={editor} className="min-h-[500px]" />

        <div className="from-primary/20 via-primary/5 absolute top-0 bottom-0 left-[-1.5rem] hidden w-px bg-linear-to-b to-transparent lg:block" />

        {editor && (
          <div className="text-muted-foreground fixed right-6 bottom-6 flex items-center gap-4 text-[10px] font-semibold tracking-widest uppercase opacity-60 transition-opacity hover:opacity-100 lg:right-16">
            <span>
              {Math.ceil(editor.storage.characterCount.words() / 200)} Min Read
            </span>
            <div className="bg-border/50 h-3 w-px" />
            <span>{editor.storage.characterCount.words()} Words</span>
            <div className="bg-border/50 h-3 w-px" />
            <span>{editor.storage.characterCount.characters()} Characters</span>
          </div>
        )}
      </div>
    </div>
  );
}
