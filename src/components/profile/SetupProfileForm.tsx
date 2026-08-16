"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { importGuestChallenge } from "@/utils/supabase/importGuestChallenge";
import { getKaxiroDate } from "@/utils/date";

export default function SetupProfileForm() {
    const supabase = createClient();
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [message, setMessage] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    async function handleSave() {
        setMessage("");

        const cleanUsername = username.trim().toLowerCase();

        if (cleanUsername.length < 3) {
            setMessage("Username must be at least 3 characters.");
            return;
        }

        if (!/^[a-z0-9_]+$/.test(cleanUsername)) {
            setMessage(
                "Username can only contain letters, numbers, and underscores.",
            );
            return;
        }

        setIsSaving(true);

        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            setMessage("You need to be signed in.");
            setIsSaving(false);
            return;
        }

        const { error } = await supabase
            .from("profiles")
            .update({
                username: cleanUsername,
            })
            .eq("id", user.id);

        if (error) {
            if (error.code === "23505") {
                setMessage("That username is already taken.");
            } else {
                setMessage(error.message);
            }

            setIsSaving(false);
            return;
        }
        const today = getKaxiroDate();

        try {
            await importGuestChallenge(today);
        } catch (error) {
            console.error("Failed to import guest challenge:", error);
        }

        router.push("/profile");
        router.refresh();
    }

    return (
        <main className="flex min-h-screen items-center justify-center px-6">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8">
                <div className="text-center">
                    <p className="text-sm font-medium uppercase tracking-[0.28em] text-cyan-300">
                        Kaxiro
                    </p>

                    <h1 className="mt-4 text-3xl font-semibold text-white">
                        Choose your username.
                    </h1>

                    <p className="mt-3 text-sm text-slate-400">
                        This is how you&apos;ll appear on the leaderboard.
                    </p>
                </div>

                <div className="mt-8 space-y-4">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        autoComplete="username"
                        maxLength={20}
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/50"
                    />

                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSaving ? "Saving..." : "Continue"}
                    </button>

                    {message && (
                        <p className="pt-2 text-center text-sm text-slate-400">
                            {message}
                        </p>
                    )}
                </div>
            </div>
        </main>
    );
}