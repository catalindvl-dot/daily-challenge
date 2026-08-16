import { redirect } from "next/navigation";
import SetupProfileForm from "@/components/profile/SetupProfileForm";
import { createClient } from "@/utils/supabase/server";

export default async function SetupProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  if (profile?.username) {
    redirect("/profile");
  }

  return <SetupProfileForm />;
}