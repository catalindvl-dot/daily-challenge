import type { Metadata } from "next";
import Challenge from "@/components/challenge";
import { getKaxiroDate } from "@/utils/date";

export const metadata: Metadata = {
  title: "Today's Challenge",
  description:
    "Play today's Kaxiro challenge: five quick games designed to test your knowledge, intuition, and curiosity.",
};

export default function ChallengePage() {
  const today = getKaxiroDate();

  return <Challenge today={today} />;
}