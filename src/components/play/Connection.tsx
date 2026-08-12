"use client";

import { useState } from "react";
import { getConnectionChallenge } from "@/data/connection";
import { fuzzyMatch } from "@/utils/fuzzyMatch";

type ConnectionProps = {
  contentId: string;
  onComplete: (score: number) => void;
};

const scoreLevels = [100, 75, 50, 25];

export default function Connection({
  contentId,
  onComplete,
}: ConnectionProps) {
  const connectionChallenge = getConnectionChallenge(contentId);

  const [visibleClues, setVisibleClues] = useState(1);
  const [guess, setGuess] = useState("");
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [finalScore, setFinalScore] = useState<number | null>(null);

  if (!connectionChallenge) {
    return (
      <p className="text-sm text-slate-400">
        Connection challenge not found.
      </p>
    );
  }

  const calculateScore = (extraPenalty = 0) => {
    const penalties =
      visibleClues - 1 + wrongGuesses + extraPenalty;

    return scoreLevels[
      Math.min(penalties, scoreLevels.length - 1)
    ];
  };

  const handleSubmit = () => {
    if (!guess.trim() || isComplete) return;

    const correct = fuzzyMatch(
      guess,
      connectionChallenge.acceptedAnswers,
    );

    if (correct) {
      const score = calculateScore();

      setFinalScore(score);
      setIsCorrect(true);
      setIsComplete(true);
      onComplete(score);

      return;
    }

    setWrongGuesses((current) => current + 1);
    setIsCorrect(false);
    setGuess("");
  };

  const handleRevealClue = () => {
    if (visibleClues >= connectionChallenge.clues.length) {
      setFinalScore(0);
      setIsComplete(true);
      setIsCorrect(false);
      onComplete(0);
      return;
    }

    setVisibleClues((current) => current + 1);
    setGuess("");
    setIsCorrect(null);
  };

  return (
    <div className="text-center">
      <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
        Connection
      </p>

      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
        What connects these clues?
      </h1>

      <p className="mt-4 text-slate-400">
        Solve it using as few clues and guesses as possible.
      </p>

      <div className="mx-auto mt-8 grid max-w-xl gap-3">
        {connectionChallenge.clues
          .slice(0, visibleClues)
          .map((clue, index) => (
            <div
              key={clue}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Clue {index + 1}
              </p>

              <p className="mt-2 text-lg font-medium text-white">
                {clue}
              </p>
            </div>
          ))}
      </div>

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
              Not quite. Your next correct answer is worth{" "}
              {calculateScore()}%.
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
              onClick={handleRevealClue}
              className="rounded-xl border border-white/10 px-6 py-3 font-medium text-slate-300 transition hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-cyan-300"
            >
              {visibleClues === connectionChallenge.clues.length
                ? "Give Up"
                : "Reveal Another Clue"}
            </button>
          </div>
        </>
      ) : (
        <div className="mt-8">
          {isCorrect ? (
            <>
              <p className="text-lg font-semibold text-cyan-300">
                Correct! The connection is {connectionChallenge.answer}.
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Score: {finalScore}%
              </p>
            </>
          ) : (
            <>
              <p className="text-lg font-semibold text-slate-300">
                The connection was {connectionChallenge.answer}.
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