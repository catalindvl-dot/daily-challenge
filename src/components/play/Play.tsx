"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDailyChallenge } from "@/data/dailyChallenge";
import type { StageResult } from "@/types/challenge";
import FlightPath from "@/components/play/FlightPath";
import PriceGuess from "@/components/play/PriceGuess";
import Timeline from "@/components/play/Timeline";
import VisualReveal from "@/components/play/VisualReveal";
import Connection from "@/components/play/Connection";
import { updateStreak } from "@/utils/streak";

export default function Play() {
  const router = useRouter();

  const today = new Intl.DateTimeFormat("en-CA").format(new Date());
  const challenge = getDailyChallenge(today);

  const dailyChallenge = challenge?.stages ?? [];
  const totalStages = dailyChallenge.length;

  const [currentStage, setCurrentStage] = useState(1);
  const [stageCompleted, setStageCompleted] = useState(false);
  const [results, setResults] = useState<StageResult[]>([]);
  const [isCheckingProgress, setIsCheckingProgress] = useState(true);

  useEffect(() => {
    const isCompleted =
      localStorage.getItem(`dailyChallengeCompleted:${today}`) === "true";

    if (isCompleted) {
      router.replace("/summary");
      return;
    }

    const storedResults = localStorage.getItem(
      `dailyChallengeResults:${today}`,
    );

    if (storedResults) {
      try {
        setResults(JSON.parse(storedResults));
      } catch {
        setResults([]);
      }
    }

    const storedStage = localStorage.getItem(
      `dailyChallengeStage:${today}`,
    );

    if (storedStage) {
      const parsedStage = Number(storedStage);

      if (
        Number.isInteger(parsedStage) &&
        parsedStage >= 1 &&
        parsedStage <= totalStages
      ) {
        setCurrentStage(parsedStage);
      }
    }

    setIsCheckingProgress(false);
  }, [router, today, totalStages]);

  if (isCheckingProgress) {
    return null;
  }

  if (!challenge || totalStages === 0) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6">
        <p className="text-slate-400">
          No challenge available for today.
        </p>
      </main>
    );
  }

  const stage = dailyChallenge[currentStage - 1];

  const handleStageComplete = (score: number) => {
    setResults((currentResults) => {
      const updatedResults = [
        ...currentResults.filter(
          (result) => result.stageId !== stage.id,
        ),
        {
          stageId: stage.id,
          gameType: stage.type,
          score,
        },
      ];

      localStorage.setItem(
        `dailyChallengeResults:${today}`,
        JSON.stringify(updatedResults),
      );

      return updatedResults;
    });

    setStageCompleted(true);
  };

  const handleContinue = () => {
    if (!stageCompleted) return;

    if (currentStage === totalStages) {
      localStorage.setItem(
        `dailyChallengeCompleted:${today}`,
        "true",
      );

      localStorage.removeItem(
        `dailyChallengeStage:${today}`,
      );

      updateStreak(today);

      router.push("/summary");
      return;
    }

    const nextStage = currentStage + 1;

    localStorage.setItem(
      `dailyChallengeStage:${today}`,
      String(nextStage),
    );

    setCurrentStage(nextStage);
    setStageCompleted(false);
  };

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-16">
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-cyan-300">
            Stage {currentStage} of {totalStages}
          </p>

          <p className="text-sm text-slate-500">
            {currentStage}/{totalStages}
          </p>
        </div>

        <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-cyan-300 transition-all duration-300"
            style={{
              width: `${(currentStage / totalStages) * 100}%`,
            }}
          />
        </div>

        <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
          {stage.type === "flight-path" ? (
            <FlightPath
              contentId={stage.contentId}
              onComplete={handleStageComplete}
            />
          ) : stage.type === "price-guess" ? (
            <PriceGuess
              contentId={stage.contentId}
              onComplete={handleStageComplete}
            />
          ) : stage.type === "timeline" ? (
            <Timeline
              contentId={stage.contentId}
              onComplete={handleStageComplete}
            />
          ) : stage.type === "visual-reveal" ? (
            <VisualReveal
              contentId={stage.contentId}
              onComplete={handleStageComplete}
            />
          ) : stage.type === "connection" ? (
            <Connection
              contentId={stage.contentId}
              onComplete={handleStageComplete}
            />
          ) : (
            <>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
                Daily Challenge
              </p>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
                {stage.title}
              </h1>

              <p className="mx-auto mt-4 max-w-lg text-slate-400">
                {stage.description}
              </p>
            </>
          )}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            disabled={!stageCompleted}
            onClick={handleContinue}
            className="rounded-xl bg-cyan-300 px-6 py-3 font-medium text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-30"
          >
            {currentStage === totalStages
              ? "Finish Challenge →"
              : "Continue →"}
          </button>
        </div>
      </div>
    </main>
  );
}