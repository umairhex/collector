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
    <div className="bg-background flex h-screen w-screen flex-col items-center justify-center px-4">
      <div className="border-destructive/20 bg-destructive/5 flex max-w-md flex-col items-center space-y-6 rounded-3xl border p-8 text-center">
        <div className="bg-destructive text-destructive-foreground rounded-full p-4 shadow-sm">
          <AlertTriangle className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h2 className="font-heading text-foreground text-2xl font-black tracking-widest">
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
          className="hover:bg-destructive hover:text-destructive-foreground gap-2 font-medium transition-colors"
        >
          <RefreshCcw className="h-4 w-4" />
          Attempt Recovery
        </Button>
      </div>
    </div>
  );
}
