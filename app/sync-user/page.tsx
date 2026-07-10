import { redirect } from "next/navigation";
import { syncCurrentUserToDatabase } from "@/lib/users";

export const dynamic = "force-dynamic";

export default async function SyncUserPage() {
  const savedUser = await syncCurrentUserToDatabase();

  if (!savedUser) {
    redirect("/sign-up");
  }

  redirect("/");
}
