"use client";

import { useState } from "react";
import { getFlightPathChallenge } from "@/data/flightPath";
import GameLabel from "@/components/play/GameLabel";

type FlightPathProps = {
  contentId: string;
  onComplete: (accuracy: number) => void;
};

export default function FlightPath({
  contentId,
  onComplete,
}: FlightPathProps) {
  const flightPathChallenge = getFlightPathChallenge(contentId);

  const [guess, setGuess] = useState(10000);
  const [isLocked, setIsLocked] = useState(false);

  if (!flightPathChallenge) {
    return (
      <p className="text-sm text-slate-400">
        Flight Path challenge not found.
      </p>
    );
  }

  const errorPercent =
    (Math.abs(guess - flightPathChallenge.distanceKm) /
      flightPathChallenge.distanceKm) *
    100;

  const accuracy =
    errorPercent <= 3
      ? 100
      : Math.max(
          0,
          Math.round(
            100 * (1 - (errorPercent - 3) / 97),
          ),
        );

  return (
    <div className="text-center">
      <GameLabel icon="✈" label="Flight Path" />

      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
        {flightPathChallenge.from} → {flightPathChallenge.to}
      </h1>

      <p className="mt-4 text-slate-400">
        How far apart are these cities?
      </p>

      <p className="mt-2 text-sm text-slate-500">
        Get within 3% for a perfect score.
      </p>

      <p className="mt-8 text-2xl font-semibold text-cyan-300">
        {guess.toLocaleString()} km
      </p>

      <input
        type="range"
        min="0"
        max="20000"
        step="1"
        value={guess}
        disabled={isLocked}
        onChange={(event) => setGuess(Number(event.target.value))}
        className="mt-6 w-full disabled:cursor-not-allowed disabled:opacity-50"
      />

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
            Actual distance
          </p>

          <p className="mt-1 text-xl font-semibold text-white">
            {flightPathChallenge.distanceKm.toLocaleString()} km
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