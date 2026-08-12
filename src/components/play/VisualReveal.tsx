"use client";

import { useState } from "react";
import { getVisualRevealChallenge } from "@/data/visualReveal";
import { fuzzyMatch } from "@/utils/fuzzyMatch";

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

  const blurClasses = [
    "blur-2xl scale-110",
    "blur-xl scale-105",
    "blur-md scale-100",
    "blur-none scale-100",
  ];

  if (!visualRevealChallenge) {
    return (
      <p className="text-sm text-slate-400">
        Visual Reveal challenge not found.
      </p>
    );
  }

  const handleSubmit = () => {
    if (!guess.trim() || isComplete) return;

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
  };

  return (
    <div className="text-center">
      <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
        Visual Reveal
      </p>

      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
        What are you looking at?
      </h1>

      <p className="mt-4 text-slate-400">
        Identify it as early as possible.
      </p>

      <div className="mx-auto mt-8 max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-black/20">
        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={visualRevealChallenge.image}
            alt=""
            className={`h-full w-full object-cover transition-all duration-500 ${isComplete ? "blur-none scale-100" : blurClasses[revealLevel]
              }`}
          />
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-500">
        Reveal {revealLevel + 1} of 4
      </p>

      {!isComplete ? (
        <>
          <div className="mx-auto mt-6 max-w-md">
            <input
              type="text"
              value={guess}
              onChange={(event) => setGuess(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSubmit();
                }
              }}
              placeholder="Type your answer..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-center text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/40"
            />
          </div>

          {isCorrect === false && (
            <p className="mt-4 text-sm text-slate-400">
              Not quite. Try again or reveal more.
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!guess.trim()}
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
        <div className="mt-8">
          {isCorrect ? (
            <>
              <p className="text-lg font-semibold text-cyan-300">
                Correct! It&apos;s the {visualRevealChallenge.answer}.
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Score: {revealScores[revealLevel]}%
              </p>
            </>
          ) : (
            <>
              <p className="text-lg font-semibold text-slate-300">
                The answer was {visualRevealChallenge.answer}.
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