import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { APP_CONFIG } from "@/lib/config";

export default function LandingHero() {
  return (
    <main className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden px-6 py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.04)_1px,transparent_1px)] bg-[size:28px_28px]" />

      <div className="pointer-events-none absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

      <Container className="relative max-w-3xl text-center">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-cyan-300">
            Today&apos;s Challenge
          </p>

          <p className="mt-3 text-sm text-slate-500">
            Wednesday • August 6
          </p>

          <div className="mt-4 flex items-center justify-center gap-3">
            <Badge>{APP_CONFIG.challenge.stages} stages</Badge>
            <Badge>5 minutes</Badge>
          </div>
        </div>

        <h1 className="text-balance text-5xl font-semibold tracking-[-0.04em] text-white sm:text-7xl">
          Five minutes.
          <br />
          Five challenges.
          <br />
          Every day.
        </h1>

        <p className="mx-auto mt-8 max-w-xl text-lg leading-8 text-slate-400">
          A new challenge every day. Finish it in five minutes.
        </p>

        <div className="mt-10">
          <Button href="/challenge">
            Start Challenge →
          </Button>
        </div>

        <p className="mt-5 text-sm text-slate-600">
          No download required · Finish in about five minutes
        </p>

        <div className="mt-14 flex items-center justify-center gap-3 text-sm text-slate-600">
          <span className="h-px w-10 bg-white/10" />
          <span>{APP_CONFIG.name}</span>
          <span className="h-px w-10 bg-white/10" />
        </div>
      </Container>
    </main>
  );
}