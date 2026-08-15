import { createClient } from "@/utils/supabase/client";
import type { StageResult } from "@/types/challenge";

export async function saveChallengeResult(
  date: string,
  results: StageResult[],
) {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return;
  }

  const totalScore = Math.round(
    results.reduce((sum, result) => sum + result.score, 0) /
      results.length,
  );

  const { data: challengeResult, error: challengeError } =
    await supabase
      .from("challenge_results")
      .insert({
        user_id: user.id,
        challenge_date: date,
        total_score: totalScore,
      })
      .select("id")
      .single();

  if (challengeError) {
    throw challengeError;
  }

  const stageResults = results.map((result) => ({
    challenge_result_id: challengeResult.id,
    stage_id: result.stageId,
    game_type: result.gameType,
    score: result.score,
  }));

  const { error: stageError } = await supabase
    .from("stage_results")
    .insert(stageResults);

  if (stageError) {
    throw stageError;
  }
}