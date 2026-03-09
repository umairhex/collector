import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Settings from "@/models/Settings";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
  const { isAuthorized, user } = await verifyAuth();
  if (!isAuthorized || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    return NextResponse.json({ aiModel: user.aiModel });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  const { isAuthorized, user } = await verifyAuth();
  if (!isAuthorized || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { aiModel } = await req.json();
    await connectToDatabase();

    await Settings.findByIdAndUpdate(user._id, { aiModel });

    return NextResponse.json({ message: "Settings updated" });
  } catch {
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 },
    );
  }
}
