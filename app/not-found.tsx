import Link from "next/link";
import { BookX, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center text-center space-y-6 max-w-md">
        <div className="p-4 bg-muted text-muted-foreground rounded-2xl">
          <BookX className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-heading font-bold text-foreground">
            Page Not Found
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            The note or category you are looking for has either been deleted or
            the link is broken.
          </p>
        </div>

        <Button asChild className="gap-2 mt-4">
          <Link href="/">
            <ArrowLeft className="w-4 h-4" />
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
