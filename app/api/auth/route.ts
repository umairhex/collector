import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/mongodb";
import Settings from "@/models/Settings";
import Note from "@/models/Note";
import Category from "@/models/Category";
import { verifyAuth } from "@/lib/auth";
import CryptoJS from "crypto-js";

function generateSecureSessionToken() {
  const randomValue = Math.random().toString(36) + Date.now().toString(36);
  return CryptoJS.SHA256(randomValue)
    .toString(CryptoJS.enc.Hex)
    .substring(0, 32);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password, action } = body;

    await connectToDatabase();

    if (action === "logout") {
      const cookieStore = await cookies();
      cookieStore.delete("session_auth");
      return NextResponse.json({ message: "Logged out successfully" });
    }

    if (action === "update") {
      const { isAuthorized, user } = await verifyAuth();
      if (!isAuthorized || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      if (!username || !password) {
        return NextResponse.json(
          { error: "New username and password required." },
          { status: 400 },
        );
      }

      const existingUser = await Settings.findOne({
        username,
        _id: { $ne: user._id },
      });
      if (existingUser) {
        return NextResponse.json(
          { error: "Username already taken." },
          { status: 400 },
        );
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const sessionToken = generateSecureSessionToken();

      user.username = username;
      user.passwordHash = passwordHash;
      user.sessionToken = sessionToken;
      await user.save();

      const cookieStore = await cookies();
      cookieStore.set("session_auth", sessionToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
      });

      return NextResponse.json({
        message: "Credentials updated successfully.",
      });
    }

    if (action === "setup") {
      if (!username || !password) {
        return NextResponse.json(
          { error: "Username and password are required." },
          { status: 400 },
        );
      }

      const { isAuthorized, user: currentUser } = await verifyAuth();
      if (isAuthorized && currentUser) {
        await Note.deleteMany({ userId: currentUser._id });
        await Category.deleteMany({ userId: currentUser._id });

        const passwordHash = await bcrypt.hash(password, 10);
        const sessionToken = generateSecureSessionToken();

        currentUser.username = username;
        currentUser.passwordHash = passwordHash;
        currentUser.sessionToken = sessionToken;
        await currentUser.save();

        const cookieStore = await cookies();
        cookieStore.set("session_auth", sessionToken, {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 30,
        });

        return NextResponse.json({
          message: "Vault reset and credentials updated.",
        });
      }

      const existingUser = await Settings.findOne({ username });
      if (existingUser) {
        return NextResponse.json(
          { error: "Username already taken." },
          { status: 400 },
        );
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const sessionToken = generateSecureSessionToken();

      await Settings.create({
        username,
        passwordHash,
        sessionToken,
      });

      const cookieStore = await cookies();
      cookieStore.set("session_auth", sessionToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
      });

      return NextResponse.json({ message: "Account created. Welcome!" });
    }

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required." },
        { status: 400 },
      );
    }

    const user = await Settings.findOne({ username });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 },
      );
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 },
      );
    }

    const cookieStore = await cookies();
    cookieStore.set("session_auth", user.sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });

    return NextResponse.json({ message: "Logged in successfully." });
  } catch (err) {
    console.error("Auth error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
