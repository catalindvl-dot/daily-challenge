"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const supabase = createClient();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    async function handleSignUp() {
        setMessage("");

        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setMessage(error.message);
            return;
        }

        setMessage("Check your email to confirm your account.");
    }

    async function handleLogin() {
        setMessage("");

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setMessage(error.message);
            return;
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
                        Welcome.
                    </h1>

                    <p className="mt-3 text-sm text-slate-400">
                        Sign in or create your account.
                    </p>
                </div>

                <div className="mt-8 space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/50"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/50"
                    />

                    <button
                        onClick={handleLogin}
                        className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
                    >
                        Sign In
                    </button>

                    <button
                        onClick={handleSignUp}
                        className="w-full rounded-xl border border-white/10 px-4 py-3 font-semibold text-white transition hover:bg-white/[0.05]"
                    >
                        Create Account
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