"use client";

import { useState } from "react";
import { getPriceGuessChallenge } from "@/data/priceGuess";
import GameLabel from "@/components/play/GameLabel";

type PriceGuessProps = {
  contentId: string;
  onComplete: (accuracy: number) => void;
};

export default function PriceGuess({
  contentId,
  onComplete,
}: PriceGuessProps) {
  const priceGuessChallenge = getPriceGuessChallenge(contentId);

  const startingGuess =
    priceGuessChallenge?.startingGuess ?? 0;

  const [guess, setGuess] = useState(startingGuess);
  const [guessInput, setGuessInput] = useState(
    String(startingGuess),
  );
  const [isLocked, setIsLocked] = useState(false);

  if (!priceGuessChallenge) {
    return (
      <p className="text-sm text-slate-400">
        Price Guess challenge not found.
      </p>
    );
  }

  const errorPercent =
    (Math.abs(guess - priceGuessChallenge.price) /
      priceGuessChallenge.price) *
    100;

  const accuracy =
    errorPercent <= 5
      ? 100
      : Math.max(
        0,
        Math.min(
          99,
          Math.round(
            100 * (1 - (errorPercent - 5) / 95),
          ),
        ),
      );

  const handleInputChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "");

    setGuessInput(digitsOnly);

    if (digitsOnly === "") {
      return;
    }

    setGuess(Number(digitsOnly));
  };

  return (
    <div className="text-center">
      <GameLabel icon="💰" label="Price Guess" />

      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
        {priceGuessChallenge.name}
      </h1>

      <p className="mt-4 text-slate-400">
        How much does it cost?
      </p>

      <p className="mt-2 text-sm text-slate-500">
        Get within 5% for a perfect score.
      </p>

      <div className="mt-8 flex justify-center">
        <div className="flex min-w-44 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 transition focus-within:border-cyan-300/50">
          <span className="mr-1 text-3xl font-semibold text-cyan-300">
            {priceGuessChallenge.currency}
          </span>

          <input
            type="text"
            inputMode="numeric"
            value={guessInput}
            disabled={isLocked}
            onChange={(event) =>
              handleInputChange(event.target.value)
            }
            aria-label="Price guess"
            style={{
              width: `${Math.max(1, guessInput.length)}ch`,
            }}
            className="min-w-[1ch] bg-transparent text-left text-3xl font-semibold text-cyan-300 outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      {!isLocked ? (
        <button
          type="button"
          disabled={guessInput === ""}
          onClick={() => {
            setIsLocked(true);
            onComplete(accuracy);
          }}
          className="mt-8 rounded-xl bg-cyan-300 px-6 py-3 font-medium text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-30"
        >
          Lock Guess →
        </button>
      ) : (
        <div className="mt-8">
          <p className="text-sm text-slate-500">
            Actual price
          </p>

          <p className="mt-1 text-xl font-semibold text-white">
            {priceGuessChallenge.currency}
            {priceGuessChallenge.price.toLocaleString()}
          </p>

          <p className="mt-4 text-sm text-slate-400">
            Your accuracy
          </p>

          <p className="mt-1 text-3xl font-semibold text-cyan-300">
            {accuracy}%
          </p>
        </div>
      )}
    </div>
  );
}