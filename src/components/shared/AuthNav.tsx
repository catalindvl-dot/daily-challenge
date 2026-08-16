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
    <div className="flex items-center gap-6">
      <Link
        href="/challenge"
        className="text-sm font-medium text-slate-400 transition hover:text-white"
      >
        Challenge
      </Link>

      <Link
        href="/leaderboard"
        className="text-sm font-medium text-slate-400 transition hover:text-white"
      >
        Leaderboard
      </Link>

      {isLoggedIn ? (
        <>
          <Link
            href="/profile"
            className="text-sm font-medium text-slate-400 transition hover:text-white"
          >
            Profile
          </Link>

          <button
            onClick={handleSignOut}
            className="text-sm font-medium text-slate-400 transition hover:text-white"
          >
            Sign Out
          </button>
        </>
      ) : (
        <Link
          href="/login"
          className="text-sm font-medium text-slate-400 transition hover:text-white"
        >
          Sign In
        </Link>
      )}
    </div>
  );
}