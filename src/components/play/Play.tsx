"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
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

function getStageTimeLimit(gameType: string) {
  switch (gameType) {
    case "timeline":
    case "connection":
      return 40;

    case "flight-path":
    case "price-guess":
    case "visual-reveal":
    default:
      return 30;
  }
}

export default function Play() {
  const router = useRouter();

  const today = getKaxiroDate();

  const challenge = useMemo(() => {
    return getDailyChallenge(today);
  }, [today]);

  const dailyChallenge = useMemo(() => {
    return challenge?.stages ?? [];
  }, [challenge]);

  const totalStages = dailyChallenge.length;

  const [currentStage, setCurrentStage] = useState(1);
  const [stageCompleted, setStageCompleted] = useState(false);
  const [results, setResults] = useState<StageResult[]>([]);
  const [isCheckingProgress, setIsCheckingProgress] =
    useState(true);
  const [storageId, setStorageId] = useState<string | null>(
    null,
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const [timeRemaining, setTimeRemaining] = useState<
    number | null
  >(null);

  const stage =
    totalStages > 0
      ? dailyChallenge[currentStage - 1]
      : undefined;

  const stageTimeLimit = stage
    ? getStageTimeLimit(stage.type)
    : 30;

  const timeExpired =
    timeRemaining !== null && timeRemaining <= 0;

  useEffect(() => {
    const supabase = createClient();

    async function loadProgress() {
      setLoadError("");
      setSaveError("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      const isMissingSession =
        userError?.name === "AuthSessionMissingError";

      if (userError && !isMissingSession) {
        console.error(
          "Failed to check authentication:",
          userError,
        );

        setLoadError(
          "We couldn't load your challenge progress. Please try again.",
        );
        setIsCheckingProgress(false);
        return;
      }

      const currentStorageId = user
        ? user.id
        : getGuestStorageId();

      setStorageId(currentStorageId);
      setIsLoggedIn(Boolean(user));

      if (user) {
        const {
          data: completedResult,
          error: completedResultError,
        } = await supabase
          .from("challenge_results")
          .select("id")
          .eq("user_id", user.id)
          .eq("challenge_date", today)
          .maybeSingle();

        if (completedResultError) {
          console.error(
            "Failed to check completed challenge:",
            completedResultError,
          );

          setLoadError(
            "We couldn't load your challenge progress. Please try again.",
          );
          setIsCheckingProgress(false);
          return;
        }

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

      let restoredResults: StageResult[] = [];

      if (storedResults) {
        try {
          restoredResults = JSON.parse(
            storedResults,
          ) as StageResult[];
        } catch {
          restoredResults = [];
        }
      }

      setResults(restoredResults);

      /*
       * Results are the source of truth for progression.
       *
       * If a stage already has a saved result, the player has
       * already seen its answer and must not be able to replay it.
       */
      const completedStageIds = new Set(
        restoredResults.map((result) => result.stageId),
      );

      const firstIncompleteStageIndex =
        dailyChallenge.findIndex(
          (challengeStage) =>
            !completedStageIds.has(challengeStage.id),
        );

      /*
       * Every stage already has a saved result.
       * This can happen when the user refreshes after completing
       * Stage 5 but before pressing Finish Challenge.
       */
      if (
        totalStages > 0 &&
        firstIncompleteStageIndex === -1
      ) {
        saveChallengeHistoryEntry(today, restoredResults);

        if (user) {
          setIsSaving(true);

          try {
            await saveChallengeResult(
              today,
              restoredResults,
            );
          } catch (error) {
            console.error(
              "Failed to recover completed challenge:",
              error,
            );

            setCurrentStage(totalStages);
            setStageCompleted(true);
            setSaveError(
              "We couldn't save your result. Check your connection and try again.",
            );
            setIsSaving(false);
            setIsCheckingProgress(false);

            return;
          }

          setIsSaving(false);
        }

        localStorage.setItem(
          `dailyChallengeCompleted:${currentStorageId}:${today}`,
          "true",
        );

        localStorage.removeItem(
          `dailyChallengeStage:${currentStorageId}:${today}`,
        );

        router.replace("/summary");
        return;
      }

      /*
       * Resume from the first stage that does not yet have
       * a result. This also protects completed stages from replay
       * after a refresh.
       */
      const stageToResume =
        firstIncompleteStageIndex + 1;

      if (
        stageToResume >= 1 &&
        stageToResume <= totalStages
      ) {
        setCurrentStage(stageToResume);

        localStorage.setItem(
          `dailyChallengeStage:${currentStorageId}:${today}`,
          String(stageToResume),
        );
      }

      setStageCompleted(false);
      setTimeRemaining(null);
      setIsCheckingProgress(false);
    }

    loadProgress();
  }, [
    router,
    today,
    totalStages,
    dailyChallenge,
    retryCount,
  ]);

  /*
   * Persistent stage timer.
   *
   * We store an absolute deadline instead of the remaining
   * seconds so refreshes and tab changes cannot reset the timer.
   */
  useEffect(() => {
    if (
      isCheckingProgress ||
      !storageId ||
      !stage ||
      stageCompleted
    ) {
      return;
    }

    const timerKey =
      `dailyChallengeStageDeadline:` +
      `${storageId}:${today}:${stage.id}`;

    const storedDeadline =
      localStorage.getItem(timerKey);

    let deadline = Number(storedDeadline);

    if (
      !storedDeadline ||
      Number.isNaN(deadline) ||
      deadline <= 0
    ) {
      deadline =
        Date.now() + stageTimeLimit * 1000;

      localStorage.setItem(
        timerKey,
        String(deadline),
      );
    }

    const updateTimer = () => {
      const millisecondsRemaining =
        deadline - Date.now();

      const secondsRemaining = Math.max(
        0,
        Math.ceil(millisecondsRemaining / 1000),
      );

      setTimeRemaining(secondsRemaining);
    };

    updateTimer();

    const interval = window.setInterval(
      updateTimer,
      250,
    );

    return () => {
      window.clearInterval(interval);
    };
  }, [
    isCheckingProgress,
    storageId,
    today,
    stage,
    stageCompleted,
    stageTimeLimit,
  ]);

  const handleRetryLoad = () => {
    setIsCheckingProgress(true);
    setLoadError("");
    setRetryCount((current) => current + 1);
  };

  if (isCheckingProgress) {
    return null;
  }

  if (loadError) {
    return (
      <main className="flex min-h-[calc(100dvh-4rem)] items-center justify-center px-6">
        <div className="text-center">
          <p className="text-slate-400">
            {loadError}
          </p>

          <button
            type="button"
            onClick={handleRetryLoad}
            className="mt-5 rounded-xl bg-cyan-300 px-6 py-3 font-medium text-slate-950 transition hover:bg-cyan-200"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  if (!challenge || totalStages === 0 || !stage) {
    return (
      <main className="flex min-h-[calc(100dvh-4rem)] items-center justify-center px-6">
        <div className="text-center">
          <p className="text-slate-400">
            No challenge available for today.
          </p>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-5 rounded-xl border border-white/10 bg-white/[0.02] px-6 py-3 font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
          >
            Home →
          </button>
        </div>
      </main>
    );
  }

  const handleStageComplete = (score: number) => {
    if (stageCompleted) {
      return;
    }

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

    if (storageId) {
      localStorage.removeItem(
        `dailyChallengeStageDeadline:${storageId}:${today}:${stage.id}`,
      );
    }

    setStageCompleted(true);
  };

  const handleContinue = async () => {
    if (
      !stageCompleted ||
      !storageId ||
      isSaving
    ) {
      return;
    }

    setSaveError("");

    if (currentStage === totalStages) {
      saveChallengeHistoryEntry(today, results);

      if (isLoggedIn) {
        setIsSaving(true);

        try {
          await saveChallengeResult(today, results);
        } catch (error) {
          console.error(
            "Failed to save challenge result to Supabase:",
            error,
          );

          setSaveError(
            "We couldn't save your result. Check your connection and try again.",
          );
          setIsSaving(false);
          return;
        }

        setIsSaving(false);
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

    setTimeRemaining(null);
    setCurrentStage(nextStage);
    setStageCompleted(false);
    setSaveError("");
  };

  const formattedTime =
    timeRemaining === null
      ? `0:${String(stageTimeLimit).padStart(2, "0")}`
      : `0:${String(timeRemaining).padStart(2, "0")}`;

  const timerIsUrgent =
    timeRemaining !== null &&
    timeRemaining <= 10;

  return (
    <main className="flex min-h-[calc(100dvh-4rem)] items-start justify-center px-4 pb-5 pt-5 sm:px-6 sm:pb-8 sm:pt-10 sm:[@media(max-height:900px)]:pb-6 sm:[@media(max-height:900px)]:pt-6 sm:[@media(max-height:760px)]:pb-4 sm:[@media(max-height:760px)]:pt-4">
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-cyan-300 sm:text-sm sm:tracking-[0.28em]">
            Stage {currentStage} of {totalStages}
          </p>

          {!stageCompleted ? (
            <div
              className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold tabular-nums transition-colors sm:text-base ${timerIsUrgent
                  ? "border-rose-400/30 bg-rose-400/10 text-rose-300"
                  : "border-cyan-300/20 bg-cyan-300/[0.06] text-cyan-200"
                }`}
            >
              <span aria-hidden="true">⏱</span>
              <span>{formattedTime}</span>
            </div>
          ) : (
            <p className="text-xs text-slate-500 sm:text-sm">
              {currentStage}/{totalStages}
            </p>
          )}
        </div>

        <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10 sm:mt-4 sm:[@media(max-height:760px)]:mt-3">
          <div
            className="h-full rounded-full bg-cyan-300 transition-all duration-300"
            style={{
              width: `${(currentStage / totalStages) * 100}%`,
            }}
          />
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-center sm:mt-10 sm:p-8 sm:[@media(max-height:900px)]:mt-7 sm:[@media(max-height:900px)]:p-6 sm:[@media(max-height:760px)]:mt-5 sm:[@media(max-height:760px)]:p-5">
          {stage.type === "flight-path" ? (
            <FlightPath
              key={`${stage.id}-${stage.contentId}`}
              contentId={stage.contentId}
              onComplete={handleStageComplete}
              timeExpired={timeExpired}
            />
          ) : stage.type === "price-guess" ? (
            <PriceGuess
              key={`${stage.id}-${stage.contentId}`}
              contentId={stage.contentId}
              onComplete={handleStageComplete}
              timeExpired={timeExpired}
            />
          ) : stage.type === "timeline" ? (
            <Timeline
              key={`${stage.id}-${stage.contentId}`}
              contentId={stage.contentId}
              onComplete={handleStageComplete}
              timeExpired={timeExpired}
            />
          ) : stage.type === "visual-reveal" ? (
            <VisualReveal
              key={`${stage.id}-${stage.contentId}`}
              contentId={stage.contentId}
              onComplete={handleStageComplete}
              timeExpired={timeExpired}
            />
          ) : stage.type === "connection" ? (
            <Connection
              key={`${stage.id}-${stage.contentId}`}
              contentId={stage.contentId}
              onComplete={handleStageComplete}
              timeExpired={timeExpired}
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
            <div className="mt-5 flex flex-col items-center sm:mt-6 sm:[@media(max-height:760px)]:mt-4">
              {saveError && (
                <p className="mb-4 max-w-md text-sm text-rose-300">
                  {saveError}
                </p>
              )}

              <button
                type="button"
                onClick={handleContinue}
                disabled={isSaving}
                className="rounded-xl bg-cyan-300 px-6 py-3 font-medium text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving
                  ? "Saving..."
                  : currentStage === totalStages
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