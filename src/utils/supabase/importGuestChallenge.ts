import type { StageResult } from "@/types/challenge";
import { getExistingGuestStorageId } from "@/utils/guest";
import { createClient } from "@/utils/supabase/client";
import { saveChallengeResult } from "@/utils/supabase/saveChallengeResult";

export async function importGuestChallenge(
  date: string,
): Promise<boolean> {
  const guestStorageId = getExistingGuestStorageId();

  if (!guestStorageId) {
    return false;
  }

  const completed =
    localStorage.getItem(
      `dailyChallengeCompleted:${guestStorageId}:${date}`,
    ) === "true";

  if (!completed) {
    return false;
  }

  const storedResults = localStorage.getItem(
    `dailyChallengeResults:${guestStorageId}:${date}`,
  );

  if (!storedResults) {
    return false;
  }

  let results: StageResult[];

  try {
    results = JSON.parse(storedResults) as StageResult[];
  } catch {
    return false;
  }

  if (results.length === 0) {
    return false;
  }

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  const { data: existingResult } = await supabase
    .from("challenge_results")
    .select("id")
    .eq("user_id", user.id)
    .eq("challenge_date", date)
    .maybeSingle();

  if (existingResult) {
    return false;
  }

  await saveChallengeResult(date, results);

  localStorage.removeItem(
    `dailyChallengeResults:${guestStorageId}:${date}`,
  );

  localStorage.removeItem(
    `dailyChallengeStage:${guestStorageId}:${date}`,
  );

  localStorage.removeItem(
    `dailyChallengeCompleted:${guestStorageId}:${date}`,
  );

  localStorage.removeItem("kaxiroGuestId");

  return true;
}