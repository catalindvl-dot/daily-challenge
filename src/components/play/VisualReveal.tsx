"use client";

import { useState } from "react";
import { getVisualRevealChallenge } from "@/data/visualReveal";
import { fuzzyMatch } from "@/utils/fuzzyMatch";
import GameLabel from "@/components/play/GameLabel";

type VisualRevealProps = {
  contentId: string;
  onComplete: (score: number) => void;
};

const revealScores = [100, 75, 50, 25];

export default function VisualReveal({
  contentId,
  onComplete,
}: VisualRevealProps) {
  const visualRevealChallenge =
    getVisualRevealChallenge(contentId);

  const [revealLevel, setRevealLevel] = useState(0);
  const [guess, setGuess] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hasGuessedThisReveal, setHasGuessedThisReveal] =
    useState(false);

  const blurClasses = [
    "blur-lg scale-105",
    "blur-md scale-105",
    "blur-sm scale-100",
    "blur-[2px] scale-100",
  ];

  if (!visualRevealChallenge) {
    return (
      <p className="text-sm text-slate-400">
        Visual Reveal challenge not found.
      </p>
    );
  }

  const handleSubmit = () => {
    if (
      !guess.trim() ||
      isComplete ||
      hasGuessedThisReveal
    ) {
      return;
    }

    const correct = fuzzyMatch(
      guess,
      visualRevealChallenge.acceptedAnswers,
    );

    if (correct) {
      const score = revealScores[revealLevel];

      setIsCorrect(true);
      setIsComplete(true);
      onComplete(score);

      return;
    }

    setIsCorrect(false);
    setHasGuessedThisReveal(true);
  };

  const handleRevealMore = () => {
    if (revealLevel >= 3) {
      setIsComplete(true);
      setIsCorrect(false);
      onComplete(0);

      return;
    }

    setRevealLevel((level) => level + 1);
    setGuess("");
    setIsCorrect(null);
    setHasGuessedThisReveal(false);
  };

  return (
    <div className="text-center">
      <GameLabel icon="👁" label="Visual Reveal" />

      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
        What are you looking at?
      </h1>

      <p className="mt-4 text-slate-400">
        Identify it as early as possible.
      </p>

      <p className="mt-2 text-sm text-slate-500">
        One guess per reveal. Each reveal lowers the score.
      </p>

      <div className="mx-auto mt-6 max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-black/20">
        <div className="aspect-[16/9] overflow-hidden">
          <img
            src={visualRevealChallenge.image}
            alt=""
            className={`h-full w-full object-cover transition-all duration-500 ${
              isComplete
                ? "blur-none scale-100"
                : blurClasses[revealLevel]
            }`}
          />
        </div>
      </div>

      {!isComplete && (
        <div className="mt-3 flex items-center justify-center gap-3 text-sm">
          <span className="text-slate-500">
            Reveal {revealLevel + 1} of 4
          </span>

          <span className="text-slate-700">•</span>

          <span className="font-medium text-cyan-300">
            {revealScores[revealLevel]} pts
          </span>
        </div>
      )}

      {!isComplete ? (
        <>
          <div className="mx-auto mt-5 max-w-md">
            <input
              type="text"
              value={guess}
              disabled={hasGuessedThisReveal}
              onChange={(event) => setGuess(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSubmit();
                }
              }}
              placeholder="Type your answer..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-center text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/40 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {isCorrect === false && (
            <p className="mt-3 text-sm text-slate-400">
              Not quite. Reveal more to try again.
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={
                !guess.trim() || hasGuessedThisReveal
              }
              className="rounded-xl bg-cyan-300 px-6 py-3 font-medium text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-30"
            >
              Submit Guess →
            </button>

            <button
              type="button"
              onClick={handleRevealMore}
              className="rounded-xl border border-white/10 px-6 py-3 font-medium text-slate-300 transition hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-cyan-300"
            >
              {revealLevel === 3 ? "Give Up" : "Reveal More"}
            </button>
          </div>
        </>
      ) : (
        <div className="mt-5">
          {isCorrect ? (
            <>
              <p className="text-lg font-semibold text-cyan-300">
                Correct! It&apos;s the{" "}
                {visualRevealChallenge.answer}.
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Score: {revealScores[revealLevel]}%
              </p>
            </>
          ) : (
            <>
              <p className="text-lg font-semibold text-slate-300">
                The answer was{" "}
                {visualRevealChallenge.answer}.
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Score: 0%
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}