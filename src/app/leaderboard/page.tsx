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
    timeZone: "UTC",
  }).format(new Date(`${today}T12:00:00Z`));

  const { data, error } = await supabase.rpc(
    "get_daily_leaderboard",
    {
      target_date: today,
    },
  );

  if (error) {
    console.error("Failed to load leaderboard:", error);
  }

  const leaderboard = (data ?? []) as LeaderboardRow[];

  const currentUserEntry = user
    ? leaderboard.find((entry) => entry.user_id === user.id)
    : undefined;

  return (
    <main className="relative min-h-[calc(100dvh-4rem)] overflow-hidden px-4 pb-8 pt-10 sm:px-6 sm:pb-10 sm:pt-20 sm:[@media(max-height:900px)]:pt-14 sm:[@media(max-height:760px)]:pt-8">
      <div className="pointer-events-none absolute left-1/2 top-16 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl sm:top-20 sm:h-96 sm:w-96 sm:[@media(max-height:900px)]:h-80 sm:[@media(max-height:900px)]:w-80" />

      <div className="relative mx-auto w-full max-w-3xl">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-cyan-300 sm:text-sm sm:tracking-[0.28em]">
            Daily Leaderboard
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:mt-4 sm:text-5xl">
            Today&apos;s ranking.
          </h1>

          <p className="mt-2 text-sm text-slate-500 sm:mt-3">
            {formattedDate}
          </p>

          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400 sm:mt-4 sm:text-base">
            See how today&apos;s challengers stack up.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2.5 sm:mt-10 sm:gap-4 sm:[@media(max-height:900px)]:mt-8">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-4 text-center sm:p-5">
            <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500 sm:text-xs sm:tracking-[0.18em]">
              Players Today
            </p>

            <p className="mt-1.5 text-2xl font-semibold text-white sm:mt-2">
              {leaderboard.length}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-4 text-center sm:p-5">
            <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500 sm:text-xs sm:tracking-[0.18em]">
              Your Position
            </p>

            <p className="mt-1.5 text-2xl font-semibold text-cyan-300 sm:mt-2">
              {currentUserEntry
                ? `#${currentUserEntry.rank}`
                : "—"}
            </p>
          </div>
        </div>

        {!user && (
          <div className="mt-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.05] px-4 py-4 text-center sm:mt-6 sm:px-6 sm:py-5">
            <p className="font-semibold text-white">
              Want to join the ranking?
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-400">
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

        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] sm:mt-6">
          {leaderboard.length > 0 ? (
            <div>
              {leaderboard.map((entry) => {
                const isCurrentUser = user
                  ? entry.user_id === user.id
                  : false;

                return (
                  <div
                    key={entry.user_id}
                    className={`grid grid-cols-[52px_1fr_64px] items-center border-b border-white/5 px-4 py-3 last:border-b-0 sm:grid-cols-[70px_1fr_90px] sm:px-6 sm:py-4 ${
                      isCurrentUser
                        ? "bg-cyan-400/10"
                        : ""
                    }`}
                  >
                    <div className="flex w-8 items-center justify-center sm:w-10">
                      <span
                        className={
                          entry.rank <= 3
                            ? "text-xl leading-none sm:text-2xl"
                            : "text-xs font-semibold text-slate-500 sm:text-sm"
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
                      className={`truncate text-sm font-medium sm:text-base ${
                        isCurrentUser
                          ? "text-cyan-300"
                          : "text-white"
                      }`}
                    >
                      {entry.username}
                      {isCurrentUser ? " (You)" : ""}
                    </p>

                    <p className="text-right text-base font-semibold text-cyan-300 sm:text-lg">
                      {entry.score}%
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="px-5 py-8 text-center sm:px-6 sm:py-10">
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
          <p className="mt-4 text-center text-sm text-slate-500 sm:mt-5">
            Complete today&apos;s challenge to join the ranking.
          </p>
        )}
      </div>
    </main>
  );
}