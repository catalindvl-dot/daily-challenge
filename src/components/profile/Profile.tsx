"use client";

import { useEffect, useState } from "react";
import Container from "@/components/ui/Container";
import { backfillChallengeHistory } from "@/utils/history";
import { calculateChallengeStats } from "@/utils/stats";
import { getStreak, type StreakData } from "@/utils/streak";
import type { ChallengeStats } from "@/utils/stats";


const gameLabels: Record<string, string> = {
    "flight-path": "Flight Path",
    "price-guess": "Price Guess",
    timeline: "Timeline",
    "visual-reveal": "Visual Reveal",
    connection: "Connection",
};

export default function Profile() {
    
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

    useEffect(() => {
        const history = backfillChallengeHistory();

        const today = new Date().toISOString().split("T")[0];

        setStats(calculateChallengeStats(history));
        setStreak(getStreak(today));
    }, []);
    

    return (
        <main className="relative min-h-screen overflow-hidden px-6 py-16">
            <div className="pointer-events-none absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

            <Container className="relative max-w-4xl">
                
                <div className="text-center">
                    <p className="text-sm font-medium uppercase tracking-[0.28em] text-cyan-300">
                        Your Profile
                    </p>

                    <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                        Your stats.
                    </h1>

                    <p className="mx-auto mt-4 max-w-xl text-slate-400">
                        Track your performance across every Daily Challenge.
                    </p>
                </div>

                <div className="mt-12 grid gap-4 sm:grid-cols-3">
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

                <div className="mt-12">
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
            </Container>
        </main>
    );
}