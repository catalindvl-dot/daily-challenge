"use client";

import { useState } from "react";
import { priceGuessChallenge } from "@/data/priceGuess";

type PriceGuessProps = {
  onComplete: (accuracy: number) => void;
};

export default function PriceGuess({ onComplete }: PriceGuessProps) {
  const [guess, setGuess] = useState(priceGuessChallenge.startingGuess);
  const [isLocked, setIsLocked] = useState(false);

  const accuracy = Math.max(
    0,
    Math.round(
      (1 -
        Math.abs(guess - priceGuessChallenge.price) /
          priceGuessChallenge.price) *
        100,
    ),
  );

  const changeGuess = (amount: number) => {
    setGuess((currentGuess) => Math.max(0, currentGuess + amount));
  };

  return (
    <div className="text-center">
      <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
        Price Guess
      </p>

      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
        {priceGuessChallenge.name}
      </h1>

      <p className="mt-4 text-slate-400">
        How much does it cost?
      </p>

      <p className="mt-8 text-4xl font-semibold text-cyan-300">
        {priceGuessChallenge.currency}
        {guess.toLocaleString()}
      </p>

      {!isLocked && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => changeGuess(-100)}
            className="rounded-lg border border-white/10 px-4 py-2 text-slate-300 transition hover:bg-white/5"
          >
            −100
          </button>

          <button
            type="button"
            onClick={() => changeGuess(-10)}
            className="rounded-lg border border-white/10 px-4 py-2 text-slate-300 transition hover:bg-white/5"
          >
            −10
          </button>

          <button
            type="button"
            onClick={() => changeGuess(10)}
            className="rounded-lg border border-white/10 px-4 py-2 text-slate-300 transition hover:bg-white/5"
          >
            +10
          </button>

          <button
            type="button"
            onClick={() => changeGuess(100)}
            className="rounded-lg border border-white/10 px-4 py-2 text-slate-300 transition hover:bg-white/5"
          >
            +100
          </button>
        </div>
      )}

      {!isLocked ? (
        <button
          type="button"
          onClick={() => {
            setIsLocked(true);
            onComplete(accuracy);
          }}
          className="mt-8 rounded-xl bg-cyan-300 px-6 py-3 font-medium text-slate-950 transition hover:bg-cyan-200"
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