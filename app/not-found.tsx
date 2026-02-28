import Link from "next/link";
import { BookX, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="bg-background flex h-screen w-screen flex-col items-center justify-center px-4">
      <div className="flex max-w-md flex-col items-center space-y-6 text-center">
        <div className="bg-muted text-muted-foreground rounded-2xl p-4">
          <BookX className="h-12 w-12" />
        </div>

        <div className="space-y-2">
          <h2 className="font-heading text-foreground text-3xl font-bold">
            Page Not Found
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            The note or category you are looking for has either been deleted or
            the link is broken.
          </p>
        </div>

        <Button asChild className="mt-4 gap-2">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
