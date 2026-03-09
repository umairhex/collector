"use client";

import { useEffect } from "react";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="bg-background flex h-screen w-screen flex-col items-center justify-center px-4">
      <div className="flex w-full max-w-md flex-col items-center space-y-12 text-center">
        <h1 className="font-heading text-muted-foreground/20 text-6xl font-black tracking-widest uppercase">
          Collector
        </h1>

        <div className="space-y-4">
          <h2 className="font-heading text-3xl font-semibold tracking-wide uppercase">
            Application Error
          </h2>
          <p className="text-muted-foreground text-sm tracking-widest uppercase opacity-60">
            A critical error has occurred. Please try again.
          </p>
        </div>

        <Button
          onClick={() => reset()}
          variant="outline"
          className="border-sidebar-border/50 hover:bg-sidebar-accent/50 font-heading h-14 rounded-xl px-8 text-lg tracking-[0.2em] uppercase transition-all"
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Reboot System
        </Button>
      </div>
    </div>
  );
}
