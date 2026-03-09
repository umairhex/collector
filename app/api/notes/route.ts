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
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const notes = await Note.find({ userId: user._id })
      .sort({ updatedAt: -1 })
      .lean();
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
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validated = noteSchema.parse(body);
    await connectToDatabase();

    const isFallback = ["general", "ideas", "work"].includes(
      validated.category.toLowerCase(),
    );
    if (!isFallback) {
      const categoryExists = await Category.findOne({
        userId: user._id,
        name: { $regex: new RegExp(`^${validated.category}$`, "i") },
      });
      if (!categoryExists) {
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

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.format() }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 },
    );
  }
}
