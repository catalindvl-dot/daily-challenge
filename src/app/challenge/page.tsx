import Challenge from "@/components/challenge";
import { getKaxiroDate } from "@/utils/date";

export default function ChallengePage() {
  const today = getKaxiroDate();

  return <Challenge today={today} />;
}