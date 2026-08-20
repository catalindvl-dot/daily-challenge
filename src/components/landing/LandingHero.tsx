"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { APP_CONFIG } from "@/lib/config";
import { createClient } from "@/utils/supabase/client";
import { getGuestStorageId } from "@/utils/guest";
import { getKaxiroDate } from "@/utils/date";

type LandingHeroProps = {
  isLoggedIn: boolean;
  hasCompletedToday: boolean;
};

type ChallengeStatus =
  | "loading"
  | "new"
  | "in-progress"
  | "completed";

export default function LandingHero({
  isLoggedIn,
  hasCompletedToday,
}: LandingHeroProps) {
  const router = useRouter();

  const [transitionState, setTransitionState] = useState<
    "idle" | "transitioning"
  >("idle");

  const [challengeStatus, setChallengeStatus] =
    useState<ChallengeStatus>(
      hasCompletedToday ? "completed" : "loading",
    );

  const today = getKaxiroDate();

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${today}T12:00:00Z`));

  useEffect(() => {
    const supabase = createClient();

    async function loadChallengeStatus() {
      if (isLoggedIn && hasCompletedToday) {
        setChallengeStatus("completed");
        return;
      }

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

        if (completedResult) {
          setChallengeStatus("completed");
          return;
        }

        const savedStage = localStorage.getItem(
          `dailyChallengeStage:${user.id}:${today}`,
        );

        setChallengeStatus(
          savedStage !== null ? "in-progress" : "new",
        );

        return;
      }

      const guestStorageId = getGuestStorageId();

      const guestCompleted =
        localStorage.getItem(
          `dailyChallengeCompleted:${guestStorageId}:${today}`,
        ) === "true";

      if (guestCompleted) {
        setChallengeStatus("completed");
        return;
      }

      const savedStage = localStorage.getItem(
        `dailyChallengeStage:${guestStorageId}:${today}`,
      );

      setChallengeStatus(
        savedStage !== null ? "in-progress" : "new",
      );
    }

    loadChallengeStatus();
  }, [today, isLoggedIn, hasCompletedToday]);

  const handleChallengeAction = () => {
    if (transitionState === "transitioning") return;

    if (challengeStatus === "completed") {
      router.push("/summary");
      return;
    }

    if (challengeStatus === "in-progress") {
      router.push("/play");
      return;
    }

    setTransitionState("transitioning");

    window.setTimeout(() => {
      router.push("/challenge");
    }, 300);
  };

  const buttonLabel =
    challengeStatus === "completed"
      ? "View Results →"
      : challengeStatus === "in-progress"
        ? "Continue Challenge →"
        : "Start Challenge →";

  return (
    <main className="relative flex min-h-[calc(100dvh-4rem)] items-center overflow-hidden px-6 py-12 [@media(max-height:900px)]:py-8 [@media(max-height:760px)]:py-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.04)_1px,transparent_1px)] bg-[size:28px_28px]" />

      <div
        className={`pointer-events-none absolute left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl transition-all duration-300 [@media(max-height:900px)]:h-80 [@media(max-height:900px)]:w-80 ${
          transitionState === "transitioning"
            ? "top-36 scale-125 opacity-70 [@media(max-height:900px)]:top-24"
            : "top-24 scale-100 opacity-100 [@media(max-height:900px)]:top-16"
        }`}
      />

      <Container className="relative max-w-3xl text-center">
        <div className="-translate-y-10 mb-6 [@media(max-height:900px)]:-translate-y-5 [@media(max-height:900px)]:mb-4 [@media(max-height:760px)]:-translate-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-cyan-300">
            Today&apos;s Challenge
          </p>

          <p className="mt-3 text-sm text-slate-500 [@media(max-height:760px)]:mt-2">
            {formattedDate}
          </p>

          <div className="mt-4 flex items-center justify-center gap-3 [@media(max-height:760px)]:mt-3">
            <Badge>{APP_CONFIG.challenge.stages} stages</Badge>
            <Badge>5 minutes</Badge>
          </div>
        </div>

        <div
          className={`transition-all duration-300 ${
            transitionState === "transitioning"
              ? "-translate-y-2 opacity-0"
              : "translate-y-0 opacity-100"
          }`}
        >
          <h1 className="text-balance text-5xl font-semibold tracking-[-0.04em] text-white sm:text-7xl [@media(max-height:900px)]:text-6xl [@media(max-height:760px)]:text-5xl">
            Five minutes.
            <br />
            Five challenges.
            <br />
            Every day.
          </h1>
        </div>

        <p className="mx-auto mt-8 max-w-xl text-lg leading-8 text-slate-400 [@media(max-height:900px)]:mt-6 [@media(max-height:760px)]:mt-4 [@media(max-height:760px)]:text-base [@media(max-height:760px)]:leading-7">
          A fresh mix of challenges, every single day.
        </p>

        <div className="mt-10 [@media(max-height:900px)]:mt-7 [@media(max-height:760px)]:mt-5">
          <div
            className={`transition-all duration-300 ${
              transitionState === "transitioning"
                ? "pointer-events-none translate-y-1 opacity-0"
                : "translate-y-0 opacity-100"
            }`}
          >
            {challengeStatus === "loading" ? (
              <div className="h-12" />
            ) : (
              <Button onClick={handleChallengeAction}>
                {buttonLabel}
              </Button>
            )}
          </div>
        </div>

        <div className="mt-24 flex items-center justify-center gap-3 text-sm text-slate-500 [@media(max-height:900px)]:mt-14 [@media(max-height:760px)]:mt-8">
          <span className="h-px w-10 bg-white/15" />
          <span>{APP_CONFIG.name}</span>
          <span className="h-px w-10 bg-white/15" />
        </div>
      </Container>
    </main>
  );
}