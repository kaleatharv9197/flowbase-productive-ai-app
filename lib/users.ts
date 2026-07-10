import "server-only";

import { currentUser } from "@clerk/nextjs/server";
import { db, users } from "@/db";

export async function syncCurrentUserToDatabase() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  const email =
    clerkUser.primaryEmailAddress?.emailAddress ??
    clerkUser.emailAddresses[0]?.emailAddress;

  if (!email) {
    throw new Error("Cannot save a Clerk user without an email address.");
  }

  const name =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
    clerkUser.username ||
    null;

  const [savedUser] = await db
    .insert(users)
    .values({
      clerkUserId: clerkUser.id,
      email,
      name,
    })
    .onConflictDoUpdate({
      target: users.clerkUserId,
      set: {
        email,
        name,
        updatedAt: new Date(),
      },
    })
    .returning();

  return savedUser;
}
