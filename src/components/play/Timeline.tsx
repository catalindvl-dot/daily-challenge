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

  const [userOrder, setUserOrder] = useState<TimelineEvent[] | null>(
    null,
  );

  const [correctOrder, setCorrectOrder] = useState<
    TimelineEvent[] | null
  >(null);

  const [draggedIndex, setDraggedIndex] = useState<number | null>(
    null,
  );
  const [dragOverIndex, setDragOverIndex] = useState<
    number | null
  >(null);
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
      const [draggedEvent] = updatedEvents.splice(
        draggedIndex,
        1,
      );

      updatedEvents.splice(targetIndex, 0, draggedEvent);

      return updatedEvents;
    });

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const lockTimeline = () => {
    const sortedCorrectOrder = [
      ...timelineChallenge.events,
    ].sort((a, b) => a.year - b.year);

    let correctPairs = 0;
    let totalPairs = 0;

    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        totalPairs++;

        const firstCorrectIndex =
          sortedCorrectOrder.findIndex(
            (event) => event.id === events[i].id,
          );

        const secondCorrectIndex =
          sortedCorrectOrder.findIndex(
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

    setUserOrder([...events]);
    setCorrectOrder(sortedCorrectOrder);
    setScore(calculatedScore);
    setIsLocked(true);

    onComplete(calculatedScore);
  };

  const renderTimelineList = (
    timelineEvents: TimelineEvent[],
    showDragHandle: boolean,
  ) => {
    return (
      <div className="space-y-3">
        {timelineEvents.map((event, index) => (
          <div
            key={event.id}
            draggable={showDragHandle}
            onDragStart={() => {
              if (showDragHandle) {
                setDraggedIndex(index);
              }
            }}
            onDragEnter={() => {
              if (showDragHandle) {
                setDragOverIndex(index);
              }
            }}
            onDragOver={(dragEvent) => {
              if (showDragHandle) {
                dragEvent.preventDefault();
              }
            }}
            onDrop={() => {
              if (showDragHandle) {
                handleDrop(index);
              }
            }}
            onDragEnd={() => {
              setDraggedIndex(null);
              setDragOverIndex(null);
            }}
            className={`rounded-xl border px-4 py-4 transition ${
              showDragHandle
                ? "cursor-grab active:cursor-grabbing"
                : "cursor-default"
            } ${
              showDragHandle &&
              dragOverIndex === index &&
              draggedIndex !== index
                ? "border-cyan-300/50 bg-cyan-300/10"
                : "border-white/10 bg-white/[0.03]"
            } ${
              showDragHandle && draggedIndex === index
                ? "opacity-40"
                : "opacity-100"
            }`}
          >
            <div className="flex items-center gap-4 text-left">
              {showDragHandle && (
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
    );
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

      {!isLocked && (
        <p className="mt-2 text-sm text-slate-500">
          Drag the events to rearrange them.
        </p>
      )}

      {!isLocked ? (
        <div className="mx-auto mt-8 max-w-xl">
          {renderTimelineList(events, true)}
        </div>
      ) : (
        <>
          {score !== null && (
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
                  : "Not quite. Compare your order with the correct timeline."}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Score: {score}%
              </p>
            </div>
          )}

          {userOrder && correctOrder && (
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div>
                <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
                  Your order
                </p>

                {renderTimelineList(userOrder, false)}
              </div>

              <div>
                <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">
                  Correct order
                </p>

                {renderTimelineList(correctOrder, false)}
              </div>
            </div>
          )}
        </>
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