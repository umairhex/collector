import * as React from "react";
import { Loader2, Bot } from "lucide-react";
import { type Editor } from "@tiptap/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/hooks/use-settings";
import { AIConfigDialog } from "./ai-config-dialog";

interface AIFixButtonProps {
  editor: Editor;
}

const DEFAULT_MODEL = "google/gemini-2.0-flash-001";

export function AIFixButton({ editor }: AIFixButtonProps) {
  const [isFixing, setIsFixing] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const { data: settings } = useSettings();

  const handleFix = async () => {
    const apiKey = localStorage.getItem("openrouter_api_key");
    if (!apiKey) {
      setIsDialogOpen(true);
      return;
    }

    const { from, to, empty } = editor.state.selection;
    const textToFix = empty
      ? editor.getText()
      : editor.state.doc.textBetween(from, to, "\n");

    if (!textToFix.trim()) {
      toast.error("No text to fix.");
      return;
    }

    setIsFixing(true);
    let fixedText = "";

    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
            "HTTP-Referer": window.location.origin,
            "X-Title": "Collector App",
          },
          body: JSON.stringify({
            model: settings?.aiModel || DEFAULT_MODEL,
            messages: [
              {
                role: "system",
                content:
                  "You are an expert editor for 'Collector', a premium note-taking app. Your task is to fix grammar, enhance clarity, and improve the flow of the provided note content while maintaining its original core meaning and intent. Correct any technical inaccuracies or logical inconsistencies. Use polished, professional language suitable for permanent records. CRITICAL: ONLY output the revised text. NO preamble, NO explanations, NO quotes, NO titles. Return exactly the text that should replace the input.",
              },
              {
                role: "user",
                content: textToFix,
              },
            ],
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to fix grammar");
      }

      fixedText = data.choices?.[0]?.message?.content || "";

      if (empty) {
        editor.commands.setContent(fixedText.trim());
      } else {
        editor.chain().focus().insertContent(fixedText.trim()).run();
      }

      toast.success("Text improved successfully!");
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || "Something went wrong.");
      if (
        err.message?.toLowerCase().includes("unauthorized") ||
        err.message?.toLowerCase().includes("invalid") ||
        err.message?.toLowerCase().includes("credit")
      ) {
        setIsDialogOpen(true);
      }
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleFix}
        disabled={isFixing}
        className="text-primary hover:bg-primary/10 flex h-8 items-center gap-1.5 rounded-xl px-2 text-xs font-medium transition-all"
      >
        {isFixing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Bot className="h-4 w-4" />
        )}
      </Button>

      <AIConfigDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  );
}
