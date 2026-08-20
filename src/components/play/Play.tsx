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
import { saveChallengeHistoryEntry } from "@/utils/history";
import { createClient } from "@/utils/supabase/client";
import { saveChallengeResult } from "@/utils/supabase/saveChallengeResult";
import { getGuestStorageId } from "@/utils/guest";
import { getKaxiroDate } from "@/utils/date";

export default function Play() {
  const router = useRouter();

  const today = getKaxiroDate();
  const challenge = getDailyChallenge(today);

  const dailyChallenge = challenge?.stages ?? [];
  const totalStages = dailyChallenge.length;

  const [currentStage, setCurrentStage] = useState(1);
  const [stageCompleted, setStageCompleted] = useState(false);
  const [results, setResults] = useState<StageResult[]>([]);
  const [isCheckingProgress, setIsCheckingProgress] = useState(true);
  const [storageId, setStorageId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function loadProgress() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const currentStorageId = user
        ? user.id
        : getGuestStorageId();

      setStorageId(currentStorageId);
      setIsLoggedIn(Boolean(user));

      if (user) {
        const { data: completedResult } = await supabase
          .from("challenge_results")
          .select("id")
          .eq("user_id", user.id)
          .eq("challenge_date", today)
          .maybeSingle();

        if (completedResult) {
          router.replace("/summary");
          return;
        }
      } else {
        const isGuestCompleted =
          localStorage.getItem(
            `dailyChallengeCompleted:${currentStorageId}:${today}`,
          ) === "true";

        if (isGuestCompleted) {
          router.replace("/summary");
          return;
        }
      }

      const storedResults = localStorage.getItem(
        `dailyChallengeResults:${currentStorageId}:${today}`,
      );

      if (storedResults) {
        try {
          setResults(JSON.parse(storedResults));
        } catch {
          setResults([]);
        }
      }

      const storedStage = localStorage.getItem(
        `dailyChallengeStage:${currentStorageId}:${today}`,
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
    }

    loadProgress();
  }, [router, today, totalStages]);

  if (isCheckingProgress) {
    return null;
  }

  if (!challenge || totalStages === 0) {
    return (
      <main className="flex min-h-[calc(100dvh-4rem)] items-center justify-center px-6">
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

      if (storageId) {
        localStorage.setItem(
          `dailyChallengeResults:${storageId}:${today}`,
          JSON.stringify(updatedResults),
        );
      }

      return updatedResults;
    });

    setStageCompleted(true);
  };

  const handleContinue = async () => {
    if (!stageCompleted || !storageId) return;

    if (currentStage === totalStages) {
      saveChallengeHistoryEntry(today, results);

      if (isLoggedIn) {
        try {
          await saveChallengeResult(today, results);
        } catch (error) {
          console.error(
            "Failed to save challenge result to Supabase:",
            error,
          );

          return;
        }
      }

      localStorage.setItem(
        `dailyChallengeCompleted:${storageId}:${today}`,
        "true",
      );

      localStorage.removeItem(
        `dailyChallengeStage:${storageId}:${today}`,
      );

      router.push("/summary");
      return;
    }

    const nextStage = currentStage + 1;

    localStorage.setItem(
      `dailyChallengeStage:${storageId}:${today}`,
      String(nextStage),
    );

    setCurrentStage(nextStage);
    setStageCompleted(false);
  };

  return (
    <main className="flex min-h-[calc(100dvh-4rem)] items-start justify-center px-6 pb-8 pt-10 [@media(max-height:900px)]:pb-6 [@media(max-height:900px)]:pt-6 [@media(max-height:760px)]:pb-4 [@media(max-height:760px)]:pt-4">
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-cyan-300">
            Stage {currentStage} of {totalStages}
          </p>

          <p className="text-sm text-slate-500">
            {currentStage}/{totalStages}
          </p>
        </div>

        <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/10 [@media(max-height:760px)]:mt-3">
          <div
            className="h-full rounded-full bg-cyan-300 transition-all duration-300"
            style={{
              width: `${(currentStage / totalStages) * 100}%`,
            }}
          />
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center [@media(max-height:900px)]:mt-7 [@media(max-height:900px)]:p-6 [@media(max-height:760px)]:mt-5 [@media(max-height:760px)]:p-5">
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

          {stageCompleted && (
            <div className="mt-6 flex justify-center [@media(max-height:760px)]:mt-4">
              <button
                type="button"
                onClick={handleContinue}
                className="rounded-xl bg-cyan-300 px-6 py-3 font-medium text-slate-950 transition hover:bg-cyan-200"
              >
                {currentStage === totalStages
                  ? "Finish Challenge →"
                  : "Continue →"}
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}