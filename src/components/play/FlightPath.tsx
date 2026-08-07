"use client";

import { useState } from "react";
import { flightPathChallenge } from "@/data/flightPath";

type FlightPathProps = {
    onComplete: (accuracy: number) => void;
};

export default function FlightPath({ onComplete }: FlightPathProps) {
    const [guess, setGuess] = useState(5000);
    const [isLocked, setIsLocked] = useState(false);

    const accuracy = Math.max(
        0,
        Math.round(
            (1 -
                Math.abs(guess - flightPathChallenge.distanceKm) /
                flightPathChallenge.distanceKm) *
            100,
        ),
    );

    return (
        <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
                Flight Path
            </p>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
                {flightPathChallenge.from} → {flightPathChallenge.to}
            </h1>

            <p className="mt-4 text-slate-400">How far is the flight?</p>

            <p className="mt-8 text-2xl font-semibold text-cyan-300">
                {guess.toLocaleString()} km
            </p>

            <input
                type="range"
                min="500"
                max="15000"
                step="100"
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
                    <p className="text-sm text-slate-500">Actual distance</p>

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