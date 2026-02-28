"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    if (!error) return;
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center text-center space-y-6 max-w-md border border-destructive/20 bg-destructive/5 rounded-3xl p-8">
        <div className="p-4 bg-destructive text-destructive-foreground rounded-full shadow-sm">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-heading font-black text-foreground">
            Something went wrong!
          </h2>
          <p className="text-muted-foreground text-sm">
            We encountered a critical error processing your request. The engine
            has halted gracefully.
          </p>
        </div>

        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="gap-2 font-medium hover:bg-destructive hover:text-destructive-foreground transition-colors"
        >
          <RefreshCcw className="w-4 h-4" />
          Attempt Recovery
        </Button>
      </div>
    </div>
  );
}
