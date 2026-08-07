import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { dailyChallenge } from "@/data/dailyChallenge";

export default function Summary() {
  return (
    <main className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden px-6 py-16">
      <div className="pointer-events-none absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

      <Container className="relative max-w-3xl text-center">
        <p className="text-sm font-medium uppercase tracking-[0.28em] text-cyan-300">
          Daily Summary
        </p>

        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Challenge complete.
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-slate-400">
          You completed all five stages of today&apos;s challenge.
        </p>

        <div className="mx-auto mt-10 grid max-w-xl grid-cols-5 gap-3">
          {dailyChallenge.map((stage) => (
            <div
              key={stage.id}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-4"
            >
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Stage {stage.id}
              </p>

              <p className="mt-1 text-lg font-semibold text-cyan-300">
                {stage.title}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Button href="/">Done →</Button>
        </div>
      </Container>
    </main>
  );
}