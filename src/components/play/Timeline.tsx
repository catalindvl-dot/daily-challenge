"use client";

import { useState } from "react";
import { getTimelineChallenge } from "@/data/timeline";
import type { TimelineEvent } from "@/types/timeline";
import GameLabel from "@/components/play/GameLabel";

type TimelineProps = {
  contentId: string;
  onComplete: (score: number) => void;
};

export default function Timeline({
  contentId,
  onComplete,
}: TimelineProps) {
  const timelineChallenge = getTimelineChallenge(contentId);

  const [events, setEvents] = useState<TimelineEvent[]>(
    () => [...(timelineChallenge?.events ?? [])].reverse(),
  );

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  if (!timelineChallenge) {
    return (
      <p className="text-sm text-slate-400">
        Timeline challenge not found.
      </p>
    );
  }

  const handleDrop = (targetIndex: number) => {
    if (
      draggedIndex === null ||
      draggedIndex === targetIndex ||
      isLocked
    ) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    setEvents((currentEvents) => {
      const updatedEvents = [...currentEvents];
      const [draggedEvent] = updatedEvents.splice(draggedIndex, 1);

      updatedEvents.splice(targetIndex, 0, draggedEvent);

      return updatedEvents;
    });

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const lockTimeline = () => {
    const correctOrder = [...timelineChallenge.events].sort(
      (a, b) => a.year - b.year,
    );

    let correctPairs = 0;
    let totalPairs = 0;

    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        totalPairs++;

        const firstCorrectIndex = correctOrder.findIndex(
          (event) => event.id === events[i].id,
        );

        const secondCorrectIndex = correctOrder.findIndex(
          (event) => event.id === events[j].id,
        );

        if (firstCorrectIndex < secondCorrectIndex) {
          correctPairs++;
        }
      }
    }

    const calculatedScore = Math.round(
      (correctPairs / totalPairs) * 100,
    );

    setScore(calculatedScore);
    setEvents(correctOrder);
    setIsLocked(true);
    onComplete(calculatedScore);
  };

  return (
    <div className="text-center">
      <GameLabel icon="⏳" label="Timeline" />

      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
        Put these events in order
      </h1>

      <p className="mt-4 text-slate-400">
        Oldest to newest
      </p>

      <p className="mt-2 text-sm text-slate-500">
        Drag the events to rearrange them.
      </p>

      <div className="mx-auto mt-8 max-w-xl space-y-3">
        {events.map((event, index) => (
          <div
            key={event.id}
            draggable={!isLocked}
            onDragStart={() => {
              setDraggedIndex(index);
            }}
            onDragEnter={() => {
              if (!isLocked) {
                setDragOverIndex(index);
              }
            }}
            onDragOver={(event) => {
              event.preventDefault();
            }}
            onDrop={() => {
              handleDrop(index);
            }}
            onDragEnd={() => {
              setDraggedIndex(null);
              setDragOverIndex(null);
            }}
            className={`flex items-center justify-between rounded-xl border px-4 py-4 transition ${
              isLocked
                ? "cursor-default border-white/10 bg-white/[0.03]"
                : "cursor-grab active:cursor-grabbing"
            } ${
              dragOverIndex === index && draggedIndex !== index
                ? "border-cyan-300/50 bg-cyan-300/10"
                : "border-white/10 bg-white/[0.03]"
            } ${
              draggedIndex === index ? "opacity-40" : "opacity-100"
            }`}
          >
            <div className="flex items-center gap-4 text-left">
              {!isLocked && (
                <span
                  className="select-none text-xl text-slate-600"
                  aria-hidden="true"
                >
                  ⋮⋮
                </span>
              )}

              <div>
                <p className="font-medium text-white">
                  {event.title}
                </p>

                {isLocked && (
                  <p className="mt-1 text-sm text-cyan-300">
                    {event.year}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isLocked && score !== null && (
        <div className="mt-8">
          <p
            className={`text-lg font-semibold ${
              score === 100
                ? "text-cyan-300"
                : "text-slate-300"
            }`}
          >
            {score === 100
              ? "Perfect! You got the timeline right."
              : "Not quite. Here’s the correct timeline."}
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Score: {score}%
          </p>
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