"use client";

import { useState } from "react";
import { getConnectionChallenge } from "@/data/connection";
import { fuzzyMatch } from "@/utils/fuzzyMatch";
import GameLabel from "@/components/play/GameLabel";

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
  const [hasGuessedThisClue, setHasGuessedThisClue] =
    useState(false);
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

  const currentScore =
    scoreLevels[
      Math.min(visibleClues - 1, scoreLevels.length - 1)
    ];

  const handleSubmit = () => {
    if (
      !guess.trim() ||
      isComplete ||
      hasGuessedThisClue
    ) {
      return;
    }

    const correct = fuzzyMatch(
      guess,
      connectionChallenge.acceptedAnswers,
    );

    if (correct) {
      setFinalScore(currentScore);
      setIsCorrect(true);
      setIsComplete(true);
      onComplete(currentScore);

      return;
    }

    setIsCorrect(false);
    setHasGuessedThisClue(true);
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
    setHasGuessedThisClue(false);
  };

  return (
    <div className="text-center">
      <GameLabel icon="🔗" label="Connection" />

      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
        What do these have in common?
      </h1>

      <p className="mt-4 text-slate-400">
        Find the connection using as little information as possible.
      </p>

      <p className="mt-2 text-sm text-slate-500">
        One guess per clue. Each new clue lowers the score.
      </p>

      <div className="mx-auto mt-7 grid max-w-xl gap-2.5">
        {connectionChallenge.clues
          .slice(0, visibleClues)
          .map((clue, index) => (
            <div
              key={clue}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Clue {index + 1}
              </p>

              <p className="mt-1.5 text-base font-medium text-white">
                {clue}
              </p>
            </div>
          ))}
      </div>

      {!isComplete && (
        <div className="mt-4 flex items-center justify-center gap-3 text-sm">
          <span className="text-slate-500">
            Clue {visibleClues} of{" "}
            {connectionChallenge.clues.length}
          </span>

          <span className="text-slate-700">•</span>

          <span className="font-medium text-cyan-300">
            {currentScore} pts
          </span>
        </div>
      )}

      {!isComplete ? (
        <>
          <div className="mx-auto mt-5 max-w-md">
            <input
              type="text"
              value={guess}
              disabled={hasGuessedThisClue}
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
              Not quite. Reveal another clue to try again.
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={
                !guess.trim() || hasGuessedThisClue
              }
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
        <div className="mt-6">
          {isCorrect ? (
            <>
              <p className="text-lg font-semibold text-cyan-300">
                Correct! The connection is{" "}
                {connectionChallenge.answer}.
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Score: {finalScore}%
              </p>
            </>
          ) : (
            <>
              <p className="text-lg font-semibold text-slate-300">
                The connection was{" "}
                {connectionChallenge.answer}.
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