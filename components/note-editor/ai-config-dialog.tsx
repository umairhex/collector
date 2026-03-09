"use client";

import * as React from "react";
import { Loader2, Key } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  useSettings,
  useUpdateSettings,
  useModels,
} from "@/hooks/use-settings";

interface AIConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AIConfigDialog({ open, onOpenChange }: AIConfigDialogProps) {
  const [apiKey, setApiKey] = React.useState("");
  const { data: settings } = useSettings();
  const updateSettings = useUpdateSettings();
  const { data: models = [], isLoading: isLoadingModels } = useModels();

  React.useEffect(() => {
    const savedKey = localStorage.getItem("openrouter_api_key");
    if (savedKey) setApiKey(savedKey);
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    localStorage.setItem("openrouter_api_key", apiKey.trim());

    updateSettings.mutate(
      { aiModel: settings?.aiModel },
      {
        onSuccess: () => {
          onOpenChange(false);
          toast.success("AI Configuration saved.");
        },
        onError: () => {
          toast.error("Failed to sync settings to cloud.");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            AI Configuration
          </DialogTitle>
          <DialogDescription>
            Configure your OpenRouter API key and preferred model to unlock AI
            features. Settings are stored securely in your browser&apos;s local
            storage.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSaveSettings} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">OpenRouter API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="border-border/50 bg-background focus:ring-primary/50 w-full rounded-xl border px-4 py-2 shadow-inner focus:ring-2 focus:outline-none"
              placeholder="sk-or-v1-..."
              autoFocus
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm font-medium">
              <span>Model Selection</span>
              {isLoadingModels && (
                <Loader2 className="text-muted-foreground h-3 w-3 animate-spin" />
              )}
            </div>
            <select
              value={settings?.aiModel || ""}
              onChange={(e) => {
                updateSettings.mutate({ aiModel: e.target.value });
              }}
              disabled={isLoadingModels || models.length === 0}
              className="border-border/50 bg-background focus:ring-primary/50 w-full appearance-none rounded-xl border px-4 py-2 shadow-inner focus:ring-2 focus:outline-none disabled:opacity-50"
            >
              {!settings?.aiModel && (
                <option value="">Select a model...</option>
              )}
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!apiKey.trim() || updateSettings.isPending}
            >
              {updateSettings.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save API Key
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
