"use client";

import { useEffect, useState } from "react";
import { getTimelineChallenge } from "@/data/timeline";
import type { TimelineEvent } from "@/types/timeline";
import GameLabel from "@/components/play/GameLabel";

type TimelineProps = {
  contentId: string;
  onComplete: (score: number) => void;
  timeExpired: boolean;
};

export default function Timeline({
  contentId,
  onComplete,
  timeExpired,
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

  const moveEvent = (
    index: number,
    direction: "up" | "down",
  ) => {
    if (isLocked) {
      return;
    }

    const targetIndex =
      direction === "up" ? index - 1 : index + 1;

    if (
      targetIndex < 0 ||
      targetIndex >= events.length
    ) {
      return;
    }

    setEvents((currentEvents) => {
      const updatedEvents = [...currentEvents];

      [
        updatedEvents[index],
        updatedEvents[targetIndex],
      ] = [
        updatedEvents[targetIndex],
        updatedEvents[index],
      ];

      return updatedEvents;
    });
  };

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
    if (isLocked) {
      return;
    }

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

  useEffect(() => {
    if (timeExpired && !isLocked) {
      lockTimeline();
    }
  }, [timeExpired, isLocked]);

  const renderTimelineList = (
    timelineEvents: TimelineEvent[],
    showControls: boolean,
  ) => {
    return (
      <div
        className={
          showControls
            ? "space-y-2 sm:space-y-3"
            : "space-y-2"
        }
      >
        {timelineEvents.map((event, index) => (
          <div
            key={event.id}
            draggable={showControls}
            onDragStart={() => {
              if (showControls) {
                setDraggedIndex(index);
              }
            }}
            onDragEnter={() => {
              if (showControls) {
                setDragOverIndex(index);
              }
            }}
            onDragOver={(dragEvent) => {
              if (showControls) {
                dragEvent.preventDefault();
              }
            }}
            onDrop={() => {
              if (showControls) {
                handleDrop(index);
              }
            }}
            onDragEnd={() => {
              setDraggedIndex(null);
              setDragOverIndex(null);
            }}
            className={`rounded-xl border transition ${
              showControls
                ? "px-3 py-2.5 sm:px-4 sm:py-4"
                : "px-3 py-2.5 sm:px-4 sm:py-3"
            } ${
              showControls
                ? "sm:cursor-grab sm:active:cursor-grabbing"
                : "cursor-default"
            } ${
              showControls &&
              dragOverIndex === index &&
              draggedIndex !== index
                ? "sm:border-cyan-300/50 sm:bg-cyan-300/10"
                : "border-white/10 bg-white/[0.03]"
            } ${
              showControls && draggedIndex === index
                ? "sm:opacity-40"
                : "opacity-100"
            }`}
          >
            <div className="flex items-center gap-3 text-left sm:gap-4">
              {showControls && (
                <span
                  className="hidden select-none text-xl text-slate-600 sm:block"
                  aria-hidden="true"
                >
                  ⋮⋮
                </span>
              )}

              <div className="min-w-0 flex-1">
                <p
                  className={
                    showControls
                      ? "font-medium text-white"
                      : "text-sm font-medium leading-5 text-white sm:text-base sm:leading-normal"
                  }
                >
                  {event.title}
                </p>

                {isLocked && (
                  <p className="mt-1 text-xs text-cyan-300 sm:text-sm">
                    {event.year}
                  </p>
                )}
              </div>

              {showControls && (
                <div className="flex shrink-0 gap-1.5 sm:hidden">
                  <button
                    type="button"
                    onClick={() => moveEvent(index, "up")}
                    disabled={index === 0}
                    aria-label={`Move ${event.title} up`}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-lg text-slate-300 transition active:bg-white/10 disabled:cursor-not-allowed disabled:opacity-25"
                  >
                    ↑
                  </button>

                  <button
                    type="button"
                    onClick={() => moveEvent(index, "down")}
                    disabled={index === timelineEvents.length - 1}
                    aria-label={`Move ${event.title} down`}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-lg text-slate-300 transition active:bg-white/10 disabled:cursor-not-allowed disabled:opacity-25"
                  >
                    ↓
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="text-center">
      <GameLabel icon="⏳" label="Timeline" />

      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:mt-4 sm:text-3xl">
        Put these events in order
      </h1>

      <p className="mt-3 text-slate-400 sm:mt-4">
        Oldest to newest
      </p>

      {!isLocked && (
        <>
          <p className="mt-1.5 text-sm text-slate-500 sm:hidden">
            Use the arrows to rearrange the events.
          </p>

          <p className="mt-2 hidden text-sm text-slate-500 sm:block">
            Drag the events to rearrange them.
          </p>
        </>
      )}

      {!isLocked ? (
        <div className="mx-auto mt-6 max-w-xl sm:mt-8">
          {renderTimelineList(events, true)}
        </div>
      ) : (
        <>
          {score !== null && (
            <div className="mt-4 sm:mt-5">
              <p
                className={`text-base font-semibold sm:text-lg ${
                  score === 100
                    ? "text-cyan-300"
                    : "text-slate-300"
                }`}
              >
                {score === 100
                  ? "Perfect! You got the timeline right."
                  : "Not quite. Compare your order with the correct timeline."}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Score: {score}%
              </p>
            </div>
          )}

          {userOrder && correctOrder && (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-5 sm:gap-4">
              <div>
                <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-slate-500 sm:mb-3">
                  Your order
                </p>

                {renderTimelineList(userOrder, false)}
              </div>

              <div>
                <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-cyan-300 sm:mb-3">
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
          className="mt-6 rounded-xl bg-cyan-300 px-6 py-3 font-medium text-slate-950 transition hover:bg-cyan-200 sm:mt-8"
        >
          Lock Timeline →
        </button>
      )}
    </div>
  );
}