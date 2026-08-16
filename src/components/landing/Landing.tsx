import LandingHero from "./LandingHero";

type LandingProps = {
  isLoggedIn: boolean;
  hasCompletedToday: boolean;
};

export default function Landing({
  isLoggedIn,
  hasCompletedToday,
}: LandingProps) {
  return (
    <main>
      <LandingHero
        isLoggedIn={isLoggedIn}
        hasCompletedToday={hasCompletedToday}
      />
    </main>
  );
}