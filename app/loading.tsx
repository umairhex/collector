export default function Loading() {
  return (
    <div className="bg-background flex h-screen w-screen flex-col items-center justify-center space-y-6">
      <div className="flex flex-col items-center gap-2">
        <h2 className="font-heading text-foreground animate-pulse text-5xl font-semibold tracking-widest uppercase">
          Collector
        </h2>
        <div className="mt-4 flex items-center gap-1.5">
          <div
            className="bg-primary/40 h-1.5 w-10 animate-pulse rounded-full"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="bg-primary/60 h-1.5 w-10 animate-pulse rounded-full"
            style={{ animationDelay: "200ms" }}
          />
          <div
            className="bg-primary h-1.5 w-10 animate-pulse rounded-full"
            style={{ animationDelay: "400ms" }}
          />
        </div>
      </div>
    </div>
  );
}
