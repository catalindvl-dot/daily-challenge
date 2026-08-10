"use client";

import { useState } from "react";
import { timelineChallenge } from "@/data/timeline";
import type { TimelineEvent } from "@/types/timeline";

type TimelineProps = {
  onComplete: (score: number) => void;
};

export default function Timeline({ onComplete }: TimelineProps) {
  const [events, setEvents] = useState<TimelineEvent[]>(
    [...timelineChallenge.events].reverse(),
  );

  const [isLocked, setIsLocked] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const moveEvent = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;

    if (newIndex < 0 || newIndex >= events.length) return;

    setEvents((currentEvents) => {
      const updatedEvents = [...currentEvents];

      [updatedEvents[index], updatedEvents[newIndex]] = [
        updatedEvents[newIndex],
        updatedEvents[index],
      ];

      return updatedEvents;
    });
  };

  const lockTimeline = () => {
    const correctOrder = [...timelineChallenge.events].sort(
      (a, b) => a.year - b.year,
    );

    const correctPositions = events.filter(
      (event, index) => event.id === correctOrder[index].id,
    ).length;

    const calculatedScore = Math.round(
      (correctPositions / events.length) * 100,
    );

    setScore(calculatedScore);
    setIsLocked(true);
    onComplete(calculatedScore);
  };

  return (
    <div className="text-center">
      <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
        Timeline
      </p>

      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
        Put these events in order
      </h1>

      <p className="mt-4 text-slate-400">Oldest to newest</p>

      <div className="mx-auto mt-8 max-w-xl space-y-3">
        {events.map((event, index) => (
          <div
            key={event.id}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
          >
            <div className="text-left">
              <p className="font-medium text-white">{event.title}</p>

              {isLocked && (
                <p className="mt-1 text-sm text-cyan-300">{event.year}</p>
              )}
            </div>

            {!isLocked && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => moveEvent(index, -1)}
                  disabled={index === 0}
                  className="rounded-lg border border-white/10 px-3 py-1 text-slate-300 transition hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-cyan-300 active:bg-cyan-300/20 disabled:opacity-20 disabled:hover:border-white/10 disabled:hover:bg-transparent disabled:hover:text-slate-300"
                >
                  ↑
                </button>

                <button
                  type="button"
                  onClick={() => moveEvent(index, 1)}
                  disabled={index === events.length - 1}
                  className="rounded-lg border border-white/10 px-3 py-1 text-slate-300 transition hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-cyan-300 active:bg-cyan-300/20 disabled:opacity-20 disabled:hover:border-white/10 disabled:hover:bg-transparent disabled:hover:text-slate-300"
                >
                  ↓
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {isLocked && score !== null && (
        <div className="mt-8">
          <p
            className={`text-lg font-semibold ${score === 100 ? "text-cyan-300" : "text-slate-300"
              }`}
          >
            {score === 100
              ? "Perfect! You got the timeline right."
              : "Not quite. Here’s the correct timeline."}
          </p>

          <p className="mt-2 text-sm text-slate-500">Score: {score}%</p>
        </div>
      )}

      {!isLocked && (
        <button
          type="button"
          onClick={lockTimeline}
          className="mt-8 rounded-xl bg-cyan-300 px-6 py-3 font-medium text-slate-950 transition hover:bg-cyan-200"
        >
          Lock Timeline →
        </button>
      )}
    </div>
  );
}