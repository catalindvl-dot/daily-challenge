"use client";

import { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { getDailyChallenge } from "@/data/dailyChallenge";
import type { StageResult } from "@/types/challenge";
import type { StreakData } from "@/utils/streak";
import { createClient } from "@/utils/supabase/client";
import { getChallengeHistoryFromSupabase } from "@/utils/supabase/getChallengeHistory";
import { calculateSupabaseStreak } from "@/utils/supabase/calculateSupabaseStreak";
import { getGuestStorageId } from "@/utils/guest";
import { getKaxiroDate } from "@/utils/date";

export default function Summary() {
  const today = getKaxiroDate();
  const challenge = getDailyChallenge(today);
  const dailyChallenge = challenge?.stages ?? [];

  const [results, setResults] = useState<StageResult[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [streak, setStreak] = useState<StreakData>({
    currentStreak: 0,
    bestStreak: 0,
    lastCompletedDate: null,
  });

  const [shareStatus, setShareStatus] = useState<
    "idle" | "copied"
  >("idle");

  useEffect(() => {
    const supabase = createClient();

    async function loadSummary() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setIsLoggedIn(true);

        const { data: challengeResult, error: challengeError } =
          await supabase
            .from("challenge_results")
            .select(`
              id,
              total_score,
              stage_results (
                stage_id,
                game_type,
                score
              )
            `)
            .eq("user_id", user.id)
            .eq("challenge_date", today)
            .maybeSingle();

        if (challengeError) {
          console.error(
            "Failed to load summary result:",
            challengeError,
          );
        }

        if (challengeResult) {
          setResults(
            (challengeResult.stage_results ?? []).map((result) => ({
              stageId: result.stage_id,
              gameType: result.game_type,
              score: result.score,
            })),
          );
        }

        const history = await getChallengeHistoryFromSupabase();

        setStreak(calculateSupabaseStreak(history, today));
      } else {
        setIsLoggedIn(false);

        const guestStorageId = getGuestStorageId();

        const storedResults = localStorage.getItem(
          `dailyChallengeResults:${guestStorageId}:${today}`,
        );

        if (storedResults) {
          try {
            setResults(JSON.parse(storedResults));
          } catch {
            setResults([]);
          }
        }
      }

      setIsLoading(false);
    }

    loadSummary();
  }, [today]);

  const totalScore = useMemo(() => {
    if (results.length === 0) return 0;

    const sum = results.reduce(
      (total, result) => total + result.score,
      0,
    );

    return Math.round(sum / results.length);
  }, [results]);

  const getScoreSquare = (score: number) => {
    if (score >= 90) return "🟩";
    if (score >= 70) return "🟨";
    if (score >= 40) return "🟧";

    return "🟥";
  };

  const handleShare = async () => {
    const formattedShareDate = new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    }).format(new Date(`${today}T12:00:00Z`));

    const squares = dailyChallenge
      .map((stage) => {
        const result = results.find(
          (item) => item.stageId === stage.id,
        );

        return getScoreSquare(result?.score ?? 0);
      })
      .join(" ");

    const shareText = [
      "Kaxiro Daily Challenge",
      formattedShareDate,
      "",
      squares,
      "",
      `Score: ${totalScore}%`,
      ...(isLoggedIn
        ? [
          streak.currentStreak === 1
            ? "🔥 1 day streak"
            : `🔥 ${streak.currentStreak} day streak`,
        ]
        : []),
      "",
      "Can you beat my score?",
    ].join("\n");

    if (navigator.share) {
      try {
        await navigator.share({
          text: shareText,
        });

        return;
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);

      setShareStatus("copied");

      window.setTimeout(() => {
        setShareStatus("idle");
      }, 2000);
    } catch {
      setShareStatus("idle");
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <main className="relative flex min-h-[calc(100dvh-4rem)] items-center overflow-hidden px-6 py-12 [@media(max-height:900px)]:py-8 [@media(max-height:760px)]:py-5">
      <div className="pointer-events-none absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl [@media(max-height:900px)]:h-80 [@media(max-height:900px)]:w-80" />

      <Container className="relative max-w-3xl text-center">
        <p className="text-sm font-medium uppercase tracking-[0.28em] text-cyan-300">
          Daily Summary
        </p>

        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl [@media(max-height:760px)]:mt-4">
          Challenge complete.
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-base font-medium text-slate-300">
          Here&apos;s how you did today.
        </p>

        <div className="mt-8 [@media(max-height:900px)]:mt-6">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
            Total Score
          </p>

          <p className="mt-2 text-5xl font-semibold text-cyan-300">
            {totalScore}%
          </p>
        </div>

        {isLoggedIn && (
          <div className="mx-auto mt-8 grid max-w-md grid-cols-2 gap-3 [@media(max-height:900px)]:mt-6">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Current Streak
              </p>

              <p className="mt-2 text-2xl font-semibold text-white">
                🔥 {streak.currentStreak}{" "}
                {streak.currentStreak === 1 ? "day" : "days"}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Best Streak
              </p>

              <p className="mt-2 text-2xl font-semibold text-white">
                🏆 {streak.bestStreak}{" "}
                {streak.bestStreak === 1 ? "day" : "days"}
              </p>
            </div>
          </div>
        )}

        <div className="mx-auto mt-9 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-5 [@media(max-height:900px)]:mt-7">
          {dailyChallenge.map((stage) => {
            const result = results.find(
              (item) => item.stageId === stage.id,
            );

            return (
              <div
                key={stage.id}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-5"
              >
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Stage {stage.id}
                </p>

                <p className="mt-1 text-sm font-semibold text-white">
                  {stage.title}
                </p>

                <p className="mt-3 text-xl font-semibold text-cyan-300">
                  {result ? `${result.score}%` : "—"}
                </p>
              </div>
            );
          })}
        </div>

        {!isLoggedIn && (
          <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.05] px-6 py-6 [@media(max-height:900px)]:mt-7 [@media(max-height:900px)]:py-5">
            <p className="text-lg font-semibold text-white">
              Want to keep this score?
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Create a free account to save your results, build your
              streak and join the leaderboard.
            </p>

            <div className="mt-5">
              <Button href="/register">
                Create free account →
              </Button>
            </div>
          </div>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 [@media(max-height:900px)]:mt-7">
          <button
            type="button"
            onClick={handleShare}
            className="flex min-w-48 items-center justify-center gap-3 rounded-xl bg-cyan-300 px-8 py-3.5 font-medium text-slate-950 transition hover:bg-cyan-200"
          >
            {shareStatus === "copied" ? (
              "Copied! ✓"
            ) : (
              <>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-6 w-6"
                  stroke="currentColor"
                  strokeWidth="2.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M7 17L17 7" />
                  <path d="M8 7h9v9" />
                </svg>

                <span>Share Results</span>
              </>
            )}
          </button>

          <a
            href="/"
            className="min-w-36 rounded-xl border border-white/10 bg-white/[0.02] px-6 py-3.5 font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
          >
            Back to Home →
          </a>
        </div>
      </Container>
    </main>
  );
}