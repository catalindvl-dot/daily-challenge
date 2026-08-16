import { createClient } from "@/utils/supabase/client";
import type {
  DailyChallengeHistoryEntry,
  StageResult,
} from "@/types/challenge";

export async function getChallengeHistoryFromSupabase(): Promise<
  DailyChallengeHistoryEntry[]
> {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return [];
  }

  const { data: challengeResults, error: challengeError } =
    await supabase
      .from("challenge_results")
      .select(`
        id,
        challenge_date,
        total_score,
        stage_results (
          stage_id,
          game_type,
          score
        )
      `)
      .eq("user_id", user.id)
      .order("challenge_date", { ascending: true });

  if (challengeError) {
    console.error("Failed to load challenge history:", challengeError);
    return [];
  }

  return challengeResults.map((entry) => ({
    date: entry.challenge_date,
    totalScore: entry.total_score,
    results: (entry.stage_results ?? []).map(
      (result): StageResult => ({
        stageId: result.stage_id,
        gameType: result.game_type,
        score: result.score,
      }),
    ),
  }));
}