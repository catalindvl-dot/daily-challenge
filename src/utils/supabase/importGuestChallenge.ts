import type { StageResult } from "@/types/challenge";
import { getExistingGuestStorageId } from "@/utils/guest";
import { createClient } from "@/utils/supabase/client";
import { saveChallengeResult } from "@/utils/supabase/saveChallengeResult";

export type GuestChallengeImportResult =
  | "none"
  | "partial"
  | "completed";

export async function importGuestChallenge(
  date: string,
): Promise<GuestChallengeImportResult> {
  const guestStorageId = getExistingGuestStorageId();

  if (!guestStorageId) {
    return "none";
  }

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return "none";
  }

  const guestResultsKey =
    `dailyChallengeResults:${guestStorageId}:${date}`;

  const userResultsKey =
    `dailyChallengeResults:${user.id}:${date}`;

  const guestStageKey =
    `dailyChallengeStage:${guestStorageId}:${date}`;

  const userStageKey =
    `dailyChallengeStage:${user.id}:${date}`;

  const guestCompletedKey =
    `dailyChallengeCompleted:${guestStorageId}:${date}`;

  const userCompletedKey =
    `dailyChallengeCompleted:${user.id}:${date}`;

  const storedGuestResults =
    localStorage.getItem(guestResultsKey);

  if (!storedGuestResults) {
    return "none";
  }

  let guestResults: StageResult[];

  try {
    guestResults = JSON.parse(
      storedGuestResults,
    ) as StageResult[];
  } catch {
    return "none";
  }

  if (guestResults.length === 0) {
    return "none";
  }

  const completed =
    localStorage.getItem(guestCompletedKey) === "true";

  /*
   * Fully completed guest challenge:
   * import the final result into Supabase as before.
   */
  if (completed) {
    const { data: existingResult } = await supabase
      .from("challenge_results")
      .select("id")
      .eq("user_id", user.id)
      .eq("challenge_date", date)
      .maybeSingle();

    if (!existingResult) {
      await saveChallengeResult(date, guestResults);
    }

    localStorage.removeItem(guestResultsKey);
    localStorage.removeItem(guestStageKey);
    localStorage.removeItem(guestCompletedKey);

    clearGuestDeadlines(
      guestStorageId,
      date,
    );

    localStorage.removeItem("kaxiroGuestId");

    return "completed";
  }

  /*
   * Partial guest challenge:
   * migrate the locally completed stages to the logged-in user's
   * local storage so Play can resume from the first incomplete stage.
   */

  let existingUserResults: StageResult[] = [];

  const storedUserResults =
    localStorage.getItem(userResultsKey);

  if (storedUserResults) {
    try {
      existingUserResults = JSON.parse(
        storedUserResults,
      ) as StageResult[];
    } catch {
      existingUserResults = [];
    }
  }

  /*
   * Merge by stageId.
   * Existing account progress takes precedence if both contain
   * a result for the same stage.
   */
  const mergedResults = [
    ...guestResults,
  ];

  for (const userResult of existingUserResults) {
    const existingIndex = mergedResults.findIndex(
      (result) =>
        result.stageId === userResult.stageId,
    );

    if (existingIndex >= 0) {
      mergedResults[existingIndex] = userResult;
    } else {
      mergedResults.push(userResult);
    }
  }

  mergedResults.sort(
    (a, b) => a.stageId - b.stageId,
  );

  localStorage.setItem(
    userResultsKey,
    JSON.stringify(mergedResults),
  );

  /*
   * Copy the stored stage position too.
   * Play will still independently calculate the first incomplete
   * stage from the results, which remains the source of truth.
   */
  const guestStage =
    localStorage.getItem(guestStageKey);

  if (
    guestStage &&
    !localStorage.getItem(userStageKey)
  ) {
    localStorage.setItem(
      userStageKey,
      guestStage,
    );
  }

  /*
   * Preserve any active stage deadline so signing in cannot reset
   * the timer.
   */
  migrateGuestDeadlines(
    guestStorageId,
    user.id,
    date,
  );

  /*
   * Remove the old guest progress after migration.
   */
  localStorage.removeItem(guestResultsKey);
  localStorage.removeItem(guestStageKey);
  localStorage.removeItem(guestCompletedKey);

  localStorage.removeItem(userCompletedKey);

  localStorage.removeItem("kaxiroGuestId");

  return "partial";
}

function migrateGuestDeadlines(
  guestStorageId: string,
  userId: string,
  date: string,
) {
  const guestPrefix =
    `dailyChallengeStageDeadline:${guestStorageId}:${date}:`;

  const keysToMove: string[] = [];

  for (let index = 0; index < localStorage.length; index++) {
    const key = localStorage.key(index);

    if (key?.startsWith(guestPrefix)) {
      keysToMove.push(key);
    }
  }

  for (const guestKey of keysToMove) {
    const deadline =
      localStorage.getItem(guestKey);

    if (!deadline) {
      continue;
    }

    const stageId =
      guestKey.slice(guestPrefix.length);

    const userKey =
      `dailyChallengeStageDeadline:${userId}:${date}:${stageId}`;

    if (!localStorage.getItem(userKey)) {
      localStorage.setItem(
        userKey,
        deadline,
      );
    }

    localStorage.removeItem(guestKey);
  }
}

function clearGuestDeadlines(
  guestStorageId: string,
  date: string,
) {
  const guestPrefix =
    `dailyChallengeStageDeadline:${guestStorageId}:${date}:`;

  const keysToRemove: string[] = [];

  for (let index = 0; index < localStorage.length; index++) {
    const key = localStorage.key(index);

    if (key?.startsWith(guestPrefix)) {
      keysToRemove.push(key);
    }
  }

  for (const key of keysToRemove) {
    localStorage.removeItem(key);
  }
}