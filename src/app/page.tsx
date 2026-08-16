import Landing from "@/components/landing";
import { createClient } from "@/utils/supabase/server";
import { getKaxiroDate } from "@/utils/date";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let hasCompletedToday = false;

  if (user) {
    const today = getKaxiroDate()

    const { data: completedResult } = await supabase
      .from("challenge_results")
      .select("id")
      .eq("user_id", user.id)
      .eq("challenge_date", today)
      .maybeSingle();

    hasCompletedToday = Boolean(completedResult);
  }

  return (
    <Landing
      isLoggedIn={Boolean(user)}
      hasCompletedToday={hasCompletedToday}
    />
  );
}