"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

type AuthNavProps = {
  isLoggedIn: boolean;
};

export default function AuthNav({ isLoggedIn }: AuthNavProps) {
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();

    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-4 sm:gap-6">
      <Link
        href="/challenge"
        className="text-xs font-medium text-slate-400 transition hover:text-white sm:text-sm"
      >
        Challenge
      </Link>

      <Link
        href="/leaderboard"
        className="text-xs font-medium text-slate-400 transition hover:text-white sm:text-sm"
      >
        Leaderboard
      </Link>

      {isLoggedIn ? (
        <>
          <Link
            href="/profile"
            className="text-xs font-medium text-slate-400 transition hover:text-white sm:text-sm"
          >
            Profile
          </Link>

          <button
            onClick={handleSignOut}
            className="text-xs font-medium text-slate-400 transition hover:text-white sm:text-sm"
          >
            Sign Out
          </button>
        </>
      ) : (
        <Link
          href="/login"
          className="text-xs font-medium text-slate-400 transition hover:text-white sm:text-sm"
        >
          Sign In
        </Link>
      )}
    </div>
  );
}