import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import Category from "@/models/Category";
import Note from "@/models/Note";
import { verifyAuth } from "@/lib/auth";

export async function PATCH(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await props.params;
    const { name } = await req.json();

    const { isAuthorized, user } = await verifyAuth();
    if (!isAuthorized || !user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid Category ID" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const oldCategory = await Category.findOne({ _id: id, userId: user._id });
    if (!oldCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    const oldName = oldCategory.name;

    if (name.toLowerCase() !== oldName.toLowerCase()) {
      const existing = await Category.findOne({
        userId: user._id,
        name: { $regex: new RegExp(`^${name}$`, "i") },
      });
      if (existing) {
        return NextResponse.json(
          { error: "Category with this name already exists" },
          { status: 400 },
        );
      }
    }

    oldCategory.name = name;
    await oldCategory.save();

    await Note.updateMany(
      { userId: user._id, category: oldName },
      { category: name },
    );

    return NextResponse.json(oldCategory);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update";
    return NextResponse.json({ error: message }, { status: 500 });
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
      return NextResponse.json(
        { error: "Invalid Category ID" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const category = await Category.findOne({ _id: id, userId: user._id });
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    const categoryName = category.name;

    await Note.updateMany(
      { userId: user._id, category: categoryName },
      { category: "General" },
    );

    await Category.findByIdAndDelete(id);

    return NextResponse.json({ message: "Category deleted" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
