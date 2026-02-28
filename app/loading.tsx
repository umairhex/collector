import { BookOpen } from "lucide-react";

export default function Loading() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-background space-y-6">
      <div className="relative">
        <div className="p-4 bg-primary text-primary-foreground rounded-2xl shadow-xl animate-pulse">
          <BookOpen className="w-10 h-10" />
        </div>
        <div className="absolute -inset-1 bg-primary/20 rounded-2xl blur-xl -z-10 animate-pulse" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <h2 className="font-heading text-2xl font-semibold tracking-wide text-foreground">
          Collector
        </h2>
        <div className="flex gap-1.5 items-center">
          <div
            className="w-2 h-2 rounded-full bg-primary/40 animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="w-2 h-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
}
