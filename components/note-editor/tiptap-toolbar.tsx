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
import { Button } from "@/components/ui/button";
import { type Editor } from "@tiptap/react";

interface TiptapToolbarProps {
  editor: Editor;
}

export function TiptapToolbar({ editor }: TiptapToolbarProps) {
  if (!editor) return null;

  return (
    <div className="bg-background/60 animate-in fade-in slide-in-from-top-4 border-border flex w-fit items-center gap-0.5 rounded-2xl border p-1 shadow-sm backdrop-blur-xl duration-700">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`h-8 w-8 rounded-xl p-0 transition-all ${
          editor.isActive("bold")
            ? "text-primary hover:bg-primary/10 bg-primary/10"
            : "text-muted-foreground hover:bg-muted"
        }`}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`h-8 w-8 rounded-xl p-0 transition-all ${
          editor.isActive("italic")
            ? "text-primary hover:bg-primary/10 bg-primary/10"
            : "text-muted-foreground hover:bg-muted"
        }`}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`h-8 w-8 rounded-xl p-0 transition-all ${
          editor.isActive("heading", { level: 1 })
            ? "text-primary hover:bg-primary/10 bg-primary/10"
            : "text-muted-foreground hover:bg-muted"
        }`}
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`h-8 w-8 rounded-xl p-0 transition-all ${
          editor.isActive("heading", { level: 2 })
            ? "text-primary hover:bg-primary/10 bg-primary/10"
            : "text-muted-foreground hover:bg-muted"
        }`}
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`h-8 w-8 rounded-xl p-0 transition-all ${
          editor.isActive("heading", { level: 3 })
            ? "text-primary hover:bg-primary/10 bg-primary/10"
            : "text-muted-foreground hover:bg-muted"
        }`}
      >
        <Heading3 className="h-4 w-4" />
      </Button>
      <div className="bg-border/30 mx-1 h-5 w-px" />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`h-8 w-8 rounded-xl p-0 transition-all ${
          editor.isActive("bulletList")
            ? "text-primary hover:bg-primary/10 bg-primary/10"
            : "text-muted-foreground hover:bg-muted"
        }`}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`h-8 w-8 rounded-xl p-0 transition-all ${
          editor.isActive("orderedList")
            ? "text-primary hover:bg-primary/10 bg-primary/10"
            : "text-muted-foreground hover:bg-muted"
        }`}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`h-8 w-8 rounded-xl p-0 transition-all ${
          editor.isActive("blockquote")
            ? "text-primary hover:bg-primary/10 bg-primary/10"
            : "text-muted-foreground hover:bg-muted"
        }`}
      >
        <Quote className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`h-8 w-8 rounded-xl p-0 transition-all ${
          editor.isActive("code")
            ? "text-primary hover:bg-primary/10 bg-primary/10"
            : "text-muted-foreground hover:bg-muted"
        }`}
      >
        <Code className="h-4 w-4" />
      </Button>

      <div className="bg-border/30 mx-1 h-5 w-px" />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="text-muted-foreground hover:bg-muted h-8 w-8 rounded-xl p-0 disabled:opacity-50"
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="text-muted-foreground hover:bg-muted h-8 w-8 rounded-xl p-0 disabled:opacity-50"
      >
        <Redo className="h-4 w-4" />
      </Button>
    </div>
  );
}
