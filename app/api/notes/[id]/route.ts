import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import connectToDatabase from "@/lib/mongodb";
import Note from "@/models/Note";
import Category from "@/models/Category";
import { updateNoteSchema } from "@/lib/validations";
import { verifyAuth } from "@/lib/auth";

export async function PATCH(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  try {
    const [{ id }, body] = await Promise.all([props.params, req.json()]);

    const { isAuthorized, user } = await verifyAuth();
    if (!isAuthorized || !user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Note ID" }, { status: 400 });
    }

    await connectToDatabase();

    const validated = updateNoteSchema.parse(body);

    if (validated.category) {
      validated.category = validated.category
        .trim()
        .split(" ")
        .map(
          (word: string) =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(" ");

      const isFallback = ["General", "Ideas", "Work"].includes(
        validated.category,
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
    }

    const updatedNote = await Note.findOneAndUpdate(
      { _id: id, userId: user._id },
      validated,
      {
        returnDocument: "after",
        runValidators: true,
      },
    ).lean();

    if (!updatedNote) {
      return NextResponse.json(
        { error: "Note not found or unauthorized" },
        { status: 404 },
      );
    }

    return NextResponse.json(updatedNote);
  } catch (error) {
    console.error("ERROR: PATCH /api/notes", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.format() }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await props.params;

    const { isAuthorized, user } = await verifyAuth();
    if (!isAuthorized || !user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Note ID" }, { status: 400 });
    }

    await connectToDatabase();

    const deletedNote = await Note.findOneAndDelete({
      _id: id,
      userId: user._id,
    });

    if (!deletedNote) {
      return NextResponse.json(
        { error: "Note not found or unauthorized" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Note deleted successfully" });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 },
    );
  }
}
