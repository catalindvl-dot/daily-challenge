"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function RegisterPage() {
    const supabase = createClient();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");

    async function handleSignUp(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
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

    return (
        <main className="flex min-h-[calc(100dvh-4rem)] items-start justify-center px-6 pt-40 sm:min-h-screen sm:items-center sm:pt-0">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8">
                <div className="text-center">
                    <p className="text-sm font-medium uppercase tracking-[0.28em] text-cyan-300">
                        Kaxiro
                    </p>

                    <h1 className="mt-4 text-3xl font-semibold text-white">
                        Create your account.
                    </h1>

                    <p className="mt-3 text-sm text-slate-400">
                        Join Kaxiro and start your daily challenge.
                    </p>
                </div>

                <form onSubmit={handleSignUp} className="mt-8 space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        autoComplete="email"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/50"
                    />

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            autoComplete="new-password"
                            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 pr-12 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/50 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden" />

                        <button
                            type="button"
                            onClick={() => setShowPassword((current) => !current)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
                        >
                            {showPassword ? (
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="h-5 w-5"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <path d="M3 3l18 18" />
                                    <path d="M10.6 10.6a2 2 0 002.8 2.8" />
                                    <path d="M9.9 4.2A10.8 10.8 0 0112 4c5 0 9 4 10 8a11.7 11.7 0 01-2.1 4.1" />
                                    <path d="M6.6 6.6A11.7 11.7 0 002 12c1 4 5 8 10 8a10.8 10.8 0 005.4-1.4" />
                                </svg>
                            ) : (
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="h-5 w-5"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            )}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
                    >
                        Create Account
                    </button>

                    {message && (
                        <p className="pt-2 text-center text-sm text-slate-400">
                            {message}
                        </p>
                    )}
                </form>

                <p className="mt-6 text-center text-sm text-slate-500">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="font-medium text-cyan-300 transition hover:text-cyan-200"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </main>
    );
}