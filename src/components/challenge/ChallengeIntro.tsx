"use client";

import { useEffect, useState } from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { APP_CONFIG } from "@/lib/config";
import { createClient } from "@/utils/supabase/client";
import { getGuestStorageId } from "@/utils/guest";
import { getKaxiroDate } from "@/utils/date";

export default function ChallengeIntro() {
  const [isVisible, setIsVisible] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasProgress, setHasProgress] = useState(false);

  const today = getKaxiroDate();

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  useEffect(() => {
    const supabase = createClient();

    async function checkChallengeStatus() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: completedResult } = await supabase
          .from("challenge_results")
          .select("id")
          .eq("user_id", user.id)
          .eq("challenge_date", today)
          .maybeSingle();

        const completed = Boolean(completedResult);

        const savedStage = localStorage.getItem(
          `dailyChallengeStage:${user.id}:${today}`,
        );

        setIsCompleted(completed);
        setHasProgress(!completed && savedStage !== null);
      } else {
        const guestStorageId = getGuestStorageId();

        const completed =
          localStorage.getItem(
            `dailyChallengeCompleted:${guestStorageId}:${today}`,
          ) === "true";

        const savedStage = localStorage.getItem(
          `dailyChallengeStage:${guestStorageId}:${today}`,
        );

        setIsCompleted(completed);
        setHasProgress(!completed && savedStage !== null);
      }

      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    }

    checkChallengeStatus();
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
              : hasProgress
                ? "Your challenge is in progress."
                : "A new challenge is ready."}
          </p>

          <p className="mt-4 text-slate-400">
            {isCompleted
              ? "Come back tomorrow for a new challenge."
              : hasProgress
                ? "Pick up where you left off and complete today's challenge."
                : "Complete all five stages to finish today's challenge."}
          </p>
        </div>

        <div className="mt-10">
          {isCompleted ? (
            <Button href="/summary">
              View Results →
            </Button>
          ) : hasProgress ? (
            <Button href="/play">
              Continue Challenge →
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