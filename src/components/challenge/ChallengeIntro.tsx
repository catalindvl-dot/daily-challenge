"use client";

import { useEffect, useState } from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { APP_CONFIG } from "@/lib/config";

export default function ChallengeIntro() {
  const [isVisible, setIsVisible] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const today = new Intl.DateTimeFormat("en-CA").format(new Date());

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  useEffect(() => {
    const completed =
      localStorage.getItem(`dailyChallengeCompleted:${today}`) === "true";

    setIsCompleted(completed);

    const frame = requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => cancelAnimationFrame(frame);
  }, [today]);

  return (
    <main className="relative flex min-h-screen items-center overflow-hidden px-6 py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.04)_1px,transparent_1px)] bg-[size:28px_28px]" />

      <div
        className={`pointer-events-none absolute left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl transition-all duration-300 ${
          isVisible
            ? "top-16 scale-100 opacity-100"
            : "top-32 scale-125 opacity-70"
        }`}
      />

      <Container
        className={`relative max-w-3xl text-center transition-all duration-300 ${
          isVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-2 opacity-0"
        }`}
      >
        <p className="text-sm font-medium uppercase tracking-[0.28em] text-cyan-300">
          Today&apos;s Challenge
        </p>

        <p className="mt-3 text-sm text-slate-500">
          {formattedDate}
        </p>

        <div className="mt-5 flex items-center justify-center gap-3">
          <Badge>{APP_CONFIG.challenge.stages} stages</Badge>
          <Badge>5 minutes</Badge>
        </div>

        <div className="mx-auto mt-12 max-w-xl border-y border-white/10 py-10">
          <p className="text-3xl font-semibold tracking-tight text-white">
            {isCompleted
              ? "Today's challenge is complete."
              : "A new challenge is ready."}
          </p>

          <p className="mt-4 text-slate-400">
            {isCompleted
              ? "Your score is saved. Come back tomorrow for a new challenge."
              : "Complete all five stages to finish today's challenge."}
          </p>
        </div>

        <div className="mt-10">
          {isCompleted ? (
            <Button href="/summary">
              View Results →
            </Button>
          ) : (
            <Button href="/play">
              Begin →
            </Button>
          )}
        </div>
      </Container>
    </main>
  );
}