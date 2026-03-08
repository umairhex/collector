import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import connectToDatabase from "@/lib/mongodb";
import Note from "@/models/Note";
import { updateNoteSchema } from "@/lib/validations";

export async function PATCH(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  try {
    const [{ id }, body] = await Promise.all([props.params, req.json()]);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Note ID" }, { status: 400 });
    }

    await connectToDatabase();

    const validated = updateNoteSchema.parse(body);

    const updatedNote = await Note.findByIdAndUpdate(id, validated, {
      returnDocument: "after",
      runValidators: true,
    }).lean();

    if (!updatedNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(updatedNote);
  } catch (error) {
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Note ID" }, { status: 400 });
    }

    await connectToDatabase();

    const deletedNote = await Note.findByIdAndDelete(id);

    if (!deletedNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Note deleted successfully" });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 },
    );
  }
}
