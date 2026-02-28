import { BookOpen } from "lucide-react";

export default function Loading() {
  return (
    <div className="bg-background flex h-screen w-screen flex-col items-center justify-center space-y-6">
      <div className="relative">
        <div className="bg-primary text-primary-foreground animate-pulse rounded-2xl p-4 shadow-xl">
          <BookOpen className="h-10 w-10" />
        </div>
        <div className="bg-primary/20 absolute -inset-1 -z-10 animate-pulse rounded-2xl blur-xl" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <h2 className="font-heading text-foreground text-2xl font-semibold tracking-wide">
          Collector
        </h2>
        <div className="flex items-center gap-1.5">
          <div
            className="bg-primary/40 h-2 w-2 animate-bounce rounded-full"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="bg-primary/60 h-2 w-2 animate-bounce rounded-full"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="bg-primary h-2 w-2 animate-bounce rounded-full"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
}
