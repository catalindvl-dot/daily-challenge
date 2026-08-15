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

  if (!isLoggedIn) {
    return (
      <Link
        href="/login"
        className="text-sm font-medium text-slate-400 transition hover:text-white"
      >
        Sign In
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-5">
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
    </div>
  );
}