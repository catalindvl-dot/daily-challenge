import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Kaxiro.",
};

export default function ContactPage() {
  return (
    <main className="flex-1 px-6 py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.28em] text-cyan-300">
          Kaxiro
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Contact
        </h1>

        <p className="mt-4 max-w-2xl leading-7 text-slate-400">
          Have a question, found an issue, or want to share feedback?
          We&apos;d be happy to hear from you.
        </p>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-white">
            Get in touch
          </h2>

          <p className="mt-3 leading-7 text-slate-400">
            You can contact Kaxiro by email at:
          </p>

          <a
            href="mailto:contact@kaxiro.com"
            className="mt-4 inline-flex font-medium text-cyan-300 transition hover:text-cyan-200"
          >
            contact@kaxiro.com
          </a>

          <p className="mt-6 text-sm leading-6 text-slate-500">
            For privacy-related requests, account questions, bug reports,
            or general feedback, please include enough information for us
            to understand your request.
          </p>
        </div>

        <div className="mt-10 border-t border-white/[0.07] pt-8">
          <p className="text-sm text-slate-500">
            Looking for legal information?
          </p>

          <div className="mt-3 flex flex-wrap gap-4">
            <Link
              href="/privacy"
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              Privacy Policy →
            </Link>

            <Link
              href="/terms"
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              Terms of Use →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}