import { NextResponse } from "next/server";
import { z } from "zod";
import connectToDatabase from "@/lib/mongodb";
import Note from "@/models/Note";
import Category from "@/models/Category";
import { noteSchema } from "@/lib/validations";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
  const { isAuthorized, user } = await verifyAuth();
  if (!isAuthorized || !user) {
    console.log("LOG: GET /api/notes unauthorized");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const notes = await Note.find({ userId: user._id })
      .sort({ updatedAt: -1 })
      .lean();
    console.log(
      "LOG: GET /api/notes found",
      notes.length,
      "notes",
      notes.map((n) => ({
        id: n._id,
        title: n.title,
        content: n.content?.substring(0, 20),
      })),
    );
    return NextResponse.json(notes);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const { isAuthorized, user } = await verifyAuth();
  if (!isAuthorized || !user) {
    console.log("LOG: POST /api/notes unauthorized");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    console.log("LOG: POST /api/notes received", body);
    const validated = noteSchema.parse(body);
    console.log("LOG: POST /api/notes validated schema", validated);

    validated.category = validated.category
      .trim()
      .split(" ")
      .map(
        (word: string) =>
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
      )
      .join(" ");

    console.log("LOG: POST /api/notes normalized category", validated.category);
    await connectToDatabase();

    const isFallback = ["General", "Ideas", "Work"].includes(
      validated.category,
    );
    if (!isFallback) {
      const categoryExists = await Category.findOne({
        userId: user._id,
        name: { $regex: new RegExp(`^${validated.category}$`, "i") },
      });
      if (!categoryExists) {
        console.log(
          "LOG: POST /api/notes category not found",
          validated.category,
        );
        return NextResponse.json(
          { error: "Invalid category" },
          { status: 400 },
        );
      }
    }

    const note = await Note.create({
      ...validated,
      userId: user._id,
    });

    console.log("LOG: POST /api/notes created note", note._id);
    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error("ERROR: POST /api/notes", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.format() }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 },
    );
  }
}
