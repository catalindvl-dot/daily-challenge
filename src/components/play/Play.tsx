"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { dailyChallenge } from "@/data/dailyChallenge";
import type { StageResult } from "@/types/challenge";
import FlightPath from "@/components/play/FlightPath";
import PriceGuess from "@/components/play/PriceGuess";
import Timeline from "@/components/play/Timeline";
import VisualReveal from "@/components/play/VisualReveal";
import Connection from "@/components/play/Connection";

export default function Play() {
  const router = useRouter();
  const totalStages = dailyChallenge.length;

  const [currentStage, setCurrentStage] = useState(1);
  const [stageCompleted, setStageCompleted] = useState(false);
  const [results, setResults] = useState<StageResult[]>([]);

  const stage = dailyChallenge[currentStage - 1];

  const handleStageComplete = (score: number) => {
    setResults((currentResults) => {
      const updatedResults = [
        ...currentResults.filter((result) => result.stageId !== stage.id),
        {
          stageId: stage.id,
          gameType: stage.type,
          score,
        },
      ];

      sessionStorage.setItem(
        "dailyChallengeResults",
        JSON.stringify(updatedResults),
      );

      return updatedResults;
    });

    setStageCompleted(true);
  };

  const handleContinue = () => {
    if (!stageCompleted) return;

    if (currentStage === totalStages) {
      router.push("/summary");
      return;
    }

    setCurrentStage((current) => current + 1);
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
            <FlightPath onComplete={handleStageComplete} />
          ) : stage.type === "price-guess" ? (
            <PriceGuess onComplete={handleStageComplete} />
          ) : stage.type === "timeline" ? (
            <Timeline onComplete={handleStageComplete} />
          ) : stage.type === "visual-reveal" ? (
            <VisualReveal onComplete={handleStageComplete} />
          ) : stage.type === "connection" ? (
            <Connection onComplete={handleStageComplete} />
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