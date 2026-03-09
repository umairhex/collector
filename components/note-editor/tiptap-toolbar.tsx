import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Undo,
  Redo,
  Quote,
  Code,
} from "lucide-react";
import { type Editor } from "@tiptap/react";
import { AIFixButton } from "./ai-fix-button";
import { ToolbarButton } from "./toolbar-button";

interface TiptapToolbarProps {
  editor: Editor;
}

export function TiptapToolbar({ editor }: TiptapToolbarProps) {
  if (!editor) return null;

  return (
    <div className="bg-background/60 animate-in fade-in slide-in-from-top-4 border-border flex max-w-full flex-wrap items-center justify-center gap-0.5 rounded-2xl border p-1 shadow-sm backdrop-blur-xl duration-700 sm:w-fit">
      <ToolbarButton
        icon={Bold}
        label="BOLD"
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
      />
      <ToolbarButton
        icon={Italic}
        label="ITALIC"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
      />
      <ToolbarButton
        icon={Heading1}
        label="HEADING 1"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        active={editor.isActive("heading", { level: 1 })}
      />
      <ToolbarButton
        icon={Heading2}
        label="HEADING 2"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive("heading", { level: 2 })}
      />
      <ToolbarButton
        icon={Heading3}
        label="HEADING 3"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive("heading", { level: 3 })}
      />

      <div className="bg-border/30 mx-1 hidden h-5 w-px sm:block" />

      <ToolbarButton
        icon={List}
        label="BULLET LIST"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
      />
      <ToolbarButton
        icon={ListOrdered}
        label="ORDERED LIST"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
      />
      <ToolbarButton
        icon={Quote}
        label="BLOCKQUOTE"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive("blockquote")}
      />
      <ToolbarButton
        icon={Code}
        label="CODE"
        onClick={() => editor.chain().focus().toggleCode().run()}
        active={editor.isActive("code")}
      />

      <div className="bg-border/30 mx-1 hidden h-5 w-px sm:block" />

      <ToolbarButton
        icon={Undo}
        label="UNDO"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      />
      <ToolbarButton
        icon={Redo}
        label="REDO"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      />

      <div className="bg-border/30 mx-1 hidden h-5 w-px sm:block" />
      <AIFixButton editor={editor} />
    </div>
  );
}
