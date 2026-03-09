import { notFound } from "next/navigation";
import connectToDatabase from "@/lib/mongodb";
import Note from "@/models/Note";
import mongoose from "mongoose";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) return { title: "Not Found" };

  await connectToDatabase();
  const note = await Note.findById(id).lean();

  if (!note || !note.shareable) return { title: "Private Note" };

  return {
    title: `${note.title || "Untitled Note"} | Collector`,
  };
}

export default async function SharedNotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return notFound();
  }

  await connectToDatabase();
  const note = await Note.findById(id).lean();

  if (!note || !note.shareable) {
    return notFound();
  }

  return (
    <div className="bg-background selection:bg-primary/20 relative flex min-h-screen flex-col overflow-hidden">
      <div className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-4xl flex-col p-6 lg:px-16 lg:py-12">
        <h1 className="font-heading mb-6 text-5xl tracking-widest lg:text-7xl">
          {note.title || "Untitled Note"}
        </h1>
        <div className="text-muted-foreground mb-8 flex items-center gap-4 text-xs font-semibold tracking-widest uppercase">
          <span>{note.category || "General"}</span>
          <div className="bg-border/50 h-4 w-px" />
          <span>
            Last edited{" "}
            {new Date(note.updatedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <div
          className="prose prose-invert max-w-none font-sans text-lg leading-relaxed md:text-xl"
          dangerouslySetInnerHTML={{ __html: note.content }}
        />
      </div>
    </div>
  );
}
