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
    <main className="relative flex min-h-[calc(100dvh-4rem)] items-center overflow-hidden px-4 py-4 sm:px-6 sm:py-12 sm:[@media(max-height:900px)]:py-8 sm:[@media(max-height:760px)]:py-5">
      <div className="pointer-events-none absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl [@media(max-height:900px)]:h-80 [@media(max-height:900px)]:w-80" />

      <Container className="relative max-w-3xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-cyan-300 sm:text-sm sm:tracking-[0.28em]">
          Daily Summary
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:mt-6 sm:text-5xl [@media(max-height:760px)]:mt-4">
          Challenge complete.
        </h1>

        <p className="mx-auto mt-3 max-w-xl text-sm font-medium text-slate-300 sm:mt-4 sm:text-base">
          Here&apos;s how you did today.
        </p>

        <div className="mt-5 sm:mt-8 sm:[@media(max-height:900px)]:mt-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 sm:text-sm sm:tracking-[0.24em]">
            Total Score
          </p>

          <p className="mt-1 text-4xl font-semibold text-cyan-300 sm:mt-2 sm:text-5xl">
            {totalScore}%
          </p>
        </div>

        {isLoggedIn && (
          <div className="mx-auto mt-6 grid max-w-md grid-cols-2 gap-2.5 sm:mt-8 sm:gap-3 sm:[@media(max-height:900px)]:mt-6">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 sm:px-5 sm:py-4">
              <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500 sm:text-xs sm:tracking-[0.18em]">
                Current Streak
              </p>

              <p className="mt-1.5 text-lg font-semibold text-white sm:mt-2 sm:text-2xl">
                🔥 {streak.currentStreak}{" "}
                {streak.currentStreak === 1 ? "day" : "days"}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 sm:px-5 sm:py-4">
              <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500 sm:text-xs sm:tracking-[0.18em]">
                Best Streak
              </p>

              <p className="mt-1.5 text-lg font-semibold text-white sm:mt-2 sm:text-2xl">
                🏆 {streak.bestStreak}{" "}
                {streak.bestStreak === 1 ? "day" : "days"}
              </p>
            </div>
          </div>
        )}

        <div className="mx-auto mt-5 grid max-w-xl grid-cols-2 gap-2.5 ... sm:mt-9 sm:max-w-4xl sm:grid-cols-5 sm:gap-4 sm:[@media(max-height:900px)]:mt-7">
          {dailyChallenge.map((stage, index) => {
            const result = results.find(
              (item) => item.stageId === stage.id,
            );

            const isLastOddCard =
              dailyChallenge.length % 2 !== 0 &&
              index === dailyChallenge.length - 1;

            return (
              <div
                key={stage.id}
                className={`rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-center sm:px-4 sm:py-5 ${isLastOddCard ? "col-span-2 sm:col-span-1" : ""
                  }`}
              >
                <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500 sm:text-xs sm:tracking-wider">
                  Stage {stage.id}
                </p>

                <p className="mt-1 text-sm font-semibold text-white">
                  {stage.title}
                </p>

                <p className="mt-1.5 text-xl font-semibold text-cyan-300 sm:mt-3">
                  {result ? `${result.score}%` : "—"}
                </p>
              </div>
            );
          })}
        </div>

        {!isLoggedIn && (
          <div className="mx-auto mt-5 max-w-xl rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.05] px-4 py-3 sm:mt-10 sm:px-6 sm:py-6 sm:[@media(max-height:900px)]:mt-7 sm:[@media(max-height:900px)]:py-5">
            <p className="text-base font-semibold text-white sm:text-lg">
              Want to keep this score?
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Create a free account to save your results, build your
              streak and join the leaderboard.
            </p>

            <div className="mt-4 sm:mt-5">
              <Button href="/register">
                Create free account →
              </Button>
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center justify-center gap-2 sm:mt-10 sm:gap-4 sm:[@media(max-height:900px)]:mt-7">
          <button
            type="button"
            onClick={handleShare}
            className="flex min-w-0 flex-[1.25] items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-cyan-300 px-4 py-3 font-medium text-slate-950 transition hover:bg-cyan-200 sm:min-w-48 sm:flex-none sm:gap-3 sm:px-8 sm:py-3.5"
          >
            {shareStatus === "copied" ? (
              "Copied! ✓"
            ) : (
              <>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5 sm:h-6 sm:w-6"
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
            className="min-w-0 flex-1 whitespace-nowrap rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/[0.05] hover:text-white sm:min-w-36 sm:flex-none sm:px-6 sm:py-3.5"
          >
            Home →
          </a>
        </div>
      </Container>
    </main>
  );
}