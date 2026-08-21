"use client";

import { useEffect, useState } from "react";
import Container from "@/components/ui/Container";
import { getChallengeHistoryFromSupabase } from "@/utils/supabase/getChallengeHistory";
import { calculateChallengeStats } from "@/utils/stats";
import type { ChallengeStats } from "@/utils/stats";
import type { StreakData } from "@/utils/streak";
import { calculateSupabaseStreak } from "@/utils/supabase/calculateSupabaseStreak";
import { createClient } from "@/utils/supabase/client";
import type { DailyChallengeHistoryEntry } from "@/types/challenge";
import { getKaxiroDate } from "@/utils/date";

const gameLabels: Record<string, string> = {
  "flight-path": "Flight Path",
  "price-guess": "Price Guess",
  timeline: "Timeline",
  "visual-reveal": "Visual Reveal",
  connection: "Connection",
};

export default function Profile() {
  const [username, setUsername] = useState<string | null>(null);

  const [stats, setStats] = useState<ChallengeStats>({
    challengesPlayed: 0,
    averageScore: 0,
    bestScore: 0,
    gamePerformance: [],
  });

  const [streak, setStreak] = useState<StreakData>({
    currentStreak: 0,
    bestStreak: 0,
    lastCompletedDate: null,
  });

  const [history, setHistory] = useState<
    DailyChallengeHistoryEntry[]
  >([]);

  useEffect(() => {
    async function loadProfileData() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .single();

        setUsername(profile?.username ?? null);
      }

      const challengeHistory =
        await getChallengeHistoryFromSupabase();

      const today = getKaxiroDate();

      setHistory(challengeHistory);
      setStats(calculateChallengeStats(challengeHistory));
      setStreak(
        calculateSupabaseStreak(challengeHistory, today),
      );
    }

    loadProfileData();
  }, []);

  return (
    <main className="relative min-h-[calc(100dvh-4rem)] overflow-hidden px-4 pb-8 pt-8 sm:px-6 sm:pb-12 sm:pt-12 sm:[@media(max-height:900px)]:pb-8 sm:[@media(max-height:900px)]:pt-8">
      <div className="pointer-events-none absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl sm:h-96 sm:w-96 sm:[@media(max-height:900px)]:h-80 sm:[@media(max-height:900px)]:w-80" />

      <Container className="relative max-w-4xl">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-cyan-300 sm:text-sm sm:tracking-[0.28em]">
            Your Profile
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:mt-4 sm:text-5xl">
            {username ? `@${username}` : "Your stats."}
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:mt-4 sm:text-base sm:leading-normal">
            Track your performance across every Daily Challenge.
          </p>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-2.5 sm:mt-10 sm:grid-cols-3 sm:gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-4 text-center sm:p-6">
            <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500 sm:text-xs sm:tracking-[0.18em]">
              Challenges Played
            </p>

            <p className="mt-2 text-2xl font-semibold text-white sm:mt-3 sm:text-3xl">
              {stats.challengesPlayed}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-4 text-center sm:p-6">
            <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500 sm:text-xs sm:tracking-[0.18em]">
              Average Score
            </p>

            <p className="mt-2 text-2xl font-semibold text-cyan-300 sm:mt-3 sm:text-3xl">
              {stats.averageScore}%
            </p>
          </div>

          <div className="col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-4 text-center sm:col-span-1 sm:p-6">
            <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500 sm:text-xs sm:tracking-[0.18em]">
              Best Score
            </p>

            <p className="mt-2 text-2xl font-semibold text-cyan-300 sm:mt-3 sm:text-3xl">
              {stats.bestScore}%
            </p>
          </div>
        </div>

        <div className="mt-2.5 grid grid-cols-2 gap-2.5 sm:mt-4 sm:gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-4 text-center sm:p-6">
            <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500 sm:text-xs sm:tracking-[0.18em]">
              Current Streak
            </p>

            <p className="mt-2 text-lg font-semibold text-white sm:mt-3 sm:text-2xl">
              🔥 {streak.currentStreak}{" "}
              {streak.currentStreak === 1 ? "day" : "days"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-4 text-center sm:p-6">
            <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500 sm:text-xs sm:tracking-[0.18em]">
              Best Streak
            </p>

            <p className="mt-2 text-lg font-semibold text-white sm:mt-3 sm:text-2xl">
              🏆 {streak.bestStreak}{" "}
              {streak.bestStreak === 1 ? "day" : "days"}
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mt-12">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 sm:text-sm sm:tracking-[0.24em]">
              Game Performance
            </p>
          </div>

          {stats.gamePerformance.length > 0 ? (
            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:mt-6 sm:grid-cols-5 sm:gap-3">
              {stats.gamePerformance.map((game, index) => {
                const isLastOddCard =
                  stats.gamePerformance.length % 2 !== 0 &&
                  index === stats.gamePerformance.length - 1;

                return (
                  <div
                    key={game.gameType}
                    className={`rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3.5 text-center sm:px-4 sm:py-5 ${
                      isLastOddCard
                        ? "col-span-2 sm:col-span-1"
                        : ""
                    }`}
                  >
                    <p className="text-sm font-semibold text-white">
                      {gameLabels[game.gameType]}
                    </p>

                    <p className="mt-2 text-xl font-semibold text-cyan-300 sm:mt-3 sm:text-2xl">
                      {game.averageScore}%
                    </p>

                    <p className="mt-1.5 text-xs text-slate-500 sm:mt-2">
                      {game.gamesPlayed}{" "}
                      {game.gamesPlayed === 1
                        ? "game"
                        : "games"}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mx-auto mt-4 max-w-xl rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-6 text-center sm:mt-6 sm:px-6 sm:py-8">
              <p className="font-medium text-white">
                No performance data yet.
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Complete a Daily Challenge to start building your
                stats.
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 sm:mt-12">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 sm:text-sm sm:tracking-[0.24em]">
              Challenge History
            </p>
          </div>

          {history.length > 0 ? (
            <div className="mx-auto mt-4 max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] sm:mt-6">
              {[...history]
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() -
                    new Date(a.date).getTime(),
                )
                .map((entry) => {
                  const formattedDate =
                    new Intl.DateTimeFormat("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }).format(
                      new Date(`${entry.date}T12:00:00`),
                    );

                  return (
                    <div
                      key={entry.date}
                      className="flex items-center justify-between border-b border-white/5 px-4 py-3.5 last:border-b-0 sm:px-6 sm:py-4"
                    >
                      <p className="text-sm font-medium text-white sm:text-base">
                        {formattedDate}
                      </p>

                      <p className="text-base font-semibold text-cyan-300 sm:text-lg">
                        {entry.totalScore}%
                      </p>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="mx-auto mt-4 max-w-xl rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-6 text-center sm:mt-6 sm:px-6 sm:py-8">
              <p className="font-medium text-white">
                No challenge history yet.
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Complete your first Daily Challenge to build your
                history.
              </p>
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}