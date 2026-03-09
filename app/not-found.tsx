import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="bg-background flex h-screen w-screen flex-col items-center justify-center px-4">
      <div className="flex w-full max-w-md flex-col items-center space-y-12 text-center">
        <h1 className="font-heading text-muted-foreground/20 text-6xl font-black tracking-widest uppercase">
          Collector
        </h1>

        <div className="space-y-4">
          <h2 className="font-heading text-3xl font-semibold tracking-wide uppercase">
            Page Not Found
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed font-medium tracking-widest uppercase opacity-60">
            The page you are looking for does not exist.
          </p>
        </div>

        <Button
          asChild
          variant="outline"
          className="border-sidebar-border/50 hover:bg-sidebar-accent/50 font-heading h-14 rounded-xl px-8 text-lg tracking-[0.2em] uppercase transition-all"
        >
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
