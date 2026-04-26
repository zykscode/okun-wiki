import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProfileIndexPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  // Redirect to their specific profile page
  redirect(`/profile/${session.user.id}`);
}
