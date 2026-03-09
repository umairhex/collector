import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Category from "@/models/Category";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
  const { isAuthorized, user } = await verifyAuth();
  if (!isAuthorized || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const categories = await Category.find({ userId: user._id })
      .sort({ name: 1 })
      .lean();
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch categories" },
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
    const { name } = await req.json();
    if (!name)
      return NextResponse.json({ error: "Name is required" }, { status: 400 });

    await connectToDatabase();

    const existing = await Category.findOne({
      userId: user._id,
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    if (existing)
      return NextResponse.json(
        { error: "Category already exists" },
        { status: 400 },
      );

    const category = await Category.create({
      userId: user._id,
      name,
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create category";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
