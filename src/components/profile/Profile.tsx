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

  const [history, setHistory] = useState<DailyChallengeHistoryEntry[]>([]);

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
    <main className="relative min-h-[calc(100dvh-4rem)] overflow-hidden px-6 pb-12 pt-12 [@media(max-height:900px)]:pb-8 [@media(max-height:900px)]:pt-8">
      <div className="pointer-events-none absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl [@media(max-height:900px)]:h-80 [@media(max-height:900px)]:w-80" />

      <Container className="relative max-w-4xl">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-cyan-300">
            Your Profile
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {username ? `@${username}` : "Your stats."}
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            Track your performance across every Daily Challenge.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Challenges Played
            </p>

            <p className="mt-3 text-3xl font-semibold text-white">
              {stats.challengesPlayed}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Average Score
            </p>

            <p className="mt-3 text-3xl font-semibold text-cyan-300">
              {stats.averageScore}%
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Best Score
            </p>

            <p className="mt-3 text-3xl font-semibold text-cyan-300">
              {stats.bestScore}%
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Current Streak
            </p>

            <p className="mt-3 text-2xl font-semibold text-white">
              🔥 {streak.currentStreak}{" "}
              {streak.currentStreak === 1 ? "day" : "days"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Best Streak
            </p>

            <p className="mt-3 text-2xl font-semibold text-white">
              🏆 {streak.bestStreak}{" "}
              {streak.bestStreak === 1 ? "day" : "days"}
            </p>
          </div>
        </div>

        <div className="mt-10">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
              Game Performance
            </p>
          </div>

          {stats.gamePerformance.length > 0 ? (
            <div className="mt-6 grid gap-3 sm:grid-cols-5">
              {stats.gamePerformance.map((game) => (
                <div
                  key={game.gameType}
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-5 text-center"
                >
                  <p className="text-sm font-semibold text-white">
                    {gameLabels[game.gameType]}
                  </p>

                  <p className="mt-3 text-2xl font-semibold text-cyan-300">
                    {game.averageScore}%
                  </p>

                  <p className="mt-2 text-xs text-slate-500">
                    {game.gamesPlayed}{" "}
                    {game.gamesPlayed === 1 ? "game" : "games"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-8 text-center">
              <p className="font-medium text-white">
                No performance data yet.
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Complete a Daily Challenge to start building your stats.
              </p>
            </div>
          )}
        </div>

        <div className="mt-12">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
              Challenge History
            </p>
          </div>

          {history.length > 0 ? (
            <div className="mx-auto mt-6 max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
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
                      className="flex items-center justify-between border-b border-white/5 px-6 py-4 last:border-b-0"
                    >
                      <p className="font-medium text-white">
                        {formattedDate}
                      </p>

                      <p className="text-lg font-semibold text-cyan-300">
                        {entry.totalScore}%
                      </p>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-8 text-center">
              <p className="font-medium text-white">
                No challenge history yet.
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Complete your first Daily Challenge to build your history.
              </p>
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}