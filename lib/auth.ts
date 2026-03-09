import { cookies } from "next/headers";
import connectToDatabase from "./mongodb";
import Settings from "@/models/Settings";

let hasExistingUsersInternal: boolean | null = null;

export async function verifyAuth() {
  await connectToDatabase();

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_auth")?.value;

  if (!sessionToken) {
    if (hasExistingUsersInternal === null) {
      const usersExist = await Settings.countDocuments();
      hasExistingUsersInternal = usersExist > 0;
    }

    return {
      isAuthorized: false,
      isSetupRequired: !hasExistingUsersInternal,
      user: null,
    };
  }

  const user = await Settings.findOne({ sessionToken });

  if (!user) {
    return { isAuthorized: false, isSetupRequired: false, user: null };
  }

  hasExistingUsersInternal = true;

  return { isAuthorized: true, isSetupRequired: false, user };
}
