import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Profile from "@/components/profile/Profile";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Profile",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <Profile />;
}