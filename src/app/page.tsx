import Link from "next/link";
import { APP_CONFIG } from "@/lib/config";

export default function Home() {
  return (
    <main className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden px-6 py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.04)_1px,transparent_1px)] bg-[size:28px_28px]" />

      <div className="pointer-events-none absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

      <section className="relative mx-auto w-full max-w-3xl text-center">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-cyan-300">
            Today&apos;s Challenge
          </p>

          <p className="mt-3 text-sm text-slate-500">
            Wednesday • August 6
          </p>

          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-slate-500">
            <span>5 stages</span>
            <span className="h-1 w-1 rounded-full bg-slate-600" />
            <span>≈5 minutes</span>
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
          <Link
            href="/challenge"
            className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-cyan-300 px-8 font-semibold text-slate-950 hover:-translate-y-0.5 hover:bg-cyan-200"
          >
            Start Challenge
            <span className="ml-3">→</span>
          </Link>
        </div>

        <p className="mt-5 text-sm text-slate-500">
          No download required · Finish in about five minutes
        </p>

        <div className="mt-14 flex items-center justify-center gap-3 text-sm text-slate-600">
          <span className="h-px w-10 bg-white/10" />
          <span>{APP_CONFIG.name}</span>
          <span className="h-px w-10 bg-white/10" />
        </div>
      </section>
    </main>
  );
}