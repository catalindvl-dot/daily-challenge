import ChallengeIntro from "./ChallengeIntro";

type ChallengeProps = {
  today: string;
};

export default function Challenge({ today }: ChallengeProps) {
  return <ChallengeIntro today={today} />;
}