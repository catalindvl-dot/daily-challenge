import { createClient } from "@/utils/supabase/server";
import { getKaxiroDate } from "@/utils/date";

type LeaderboardRow = {
  rank: number;
  user_id: string;
  username: string;
  score: number;
};

export default async function LeaderboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();



  const today = getKaxiroDate();

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
  }).format(new Date());

  const { data, error } = await supabase.rpc("get_daily_leaderboard", {
    target_date: today,
  });

  if (error) {
    console.error("Failed to load leaderboard:", error);
  }

  const leaderboard = (data ?? []) as LeaderboardRow[];

  const currentUserEntry = user
    ? leaderboard.find((entry) => entry.user_id === user.id)
    : undefined;

  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-16">
      <div className="pointer-events-none absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-3xl">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-cyan-300">
            Daily Leaderboard
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Today&apos;s ranking.
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            {formattedDate}
          </p>

          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            See how today&apos;s challengers stack up.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Players Today
            </p>

            <p className="mt-2 text-2xl font-semibold text-white">
              {leaderboard.length}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Your Position
            </p>

            <p className="mt-2 text-2xl font-semibold text-cyan-300">
              {currentUserEntry
                ? `#${currentUserEntry.rank}`
                : "—"}
            </p>
          </div>
        </div>
        {!user && (
          <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.05] px-6 py-5 text-center">
            <p className="font-semibold text-white">
              Want to join the ranking?
            </p>

            <p className="mt-2 text-sm text-slate-400">
              Create a free account to save your scores and compete on the leaderboard.
            </p>

            <a
              href="/register"
              className="mt-4 inline-flex rounded-xl bg-cyan-300 px-5 py-2.5 font-medium text-slate-950 transition hover:bg-cyan-200"
            >
              Create free account →
            </a>
          </div>
        )}

        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          {leaderboard.length > 0 ? (
            <div>
              {leaderboard.map((entry) => {
                const isCurrentUser = user
                  ? entry.user_id === user.id
                  : false;

                return (
                  <div
                    key={entry.user_id}
                    className={`grid grid-cols-[70px_1fr_90px] items-center border-b border-white/5 px-6 py-4 last:border-b-0 ${isCurrentUser ? "bg-cyan-400/10" : ""
                      }`}
                  >
                    <div className="flex w-10 items-center justify-center">
                      <span
                        className={
                          entry.rank <= 3
                            ? "text-2xl leading-none"
                            : "text-sm font-semibold text-slate-500"
                        }
                      >
                        {entry.rank === 1
                          ? "🥇"
                          : entry.rank === 2
                            ? "🥈"
                            : entry.rank === 3
                              ? "🥉"
                              : `#${entry.rank}`}
                      </span>
                    </div>

                    <p
                      className={`font-medium ${isCurrentUser
                        ? "text-cyan-300"
                        : "text-white"
                        }`}
                    >
                      {entry.username}
                      {isCurrentUser ? " (You)" : ""}
                    </p>

                    <p className="text-right text-lg font-semibold text-cyan-300">
                      {entry.score}%
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="px-6 py-10 text-center">
              <p className="font-medium text-white">
                No scores yet today.
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Complete today&apos;s challenge to appear on the leaderboard.
              </p>
            </div>
          )}
        </div>

        {!currentUserEntry && leaderboard.length > 0 && (
          <p className="mt-5 text-center text-sm text-slate-500">
            Complete today&apos;s challenge to join the ranking.
          </p>
        )}
      </div>
    </main>
  );
}