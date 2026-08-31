import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms that apply when using Kaxiro.",
};

export default function TermsPage() {
  return (
    <main className="min-h-[calc(100dvh-4rem)] px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.28em] text-cyan-300">
          Legal
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Terms of Use
        </h1>

        <p className="mt-4 text-sm text-slate-500">
          Last updated: August 31, 2026
        </p>

        <div className="mt-10 space-y-10 text-slate-300">
          <section>
            <h2 className="text-xl font-semibold text-white">
              1. Acceptance of these terms
            </h2>

            <p className="mt-3 leading-7 text-slate-400">
              By accessing or using Kaxiro, you agree to these Terms of Use.
              If you do not agree with these terms, you should not use Kaxiro.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">
              2. About Kaxiro
            </h2>

            <p className="mt-3 leading-7 text-slate-400">
              Kaxiro is a daily challenge platform featuring short games
              designed to test knowledge, intuition, reasoning, and curiosity.
              Features may include daily challenges, scores, streaks,
              leaderboards, profiles, and challenge history.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">
              3. Accounts
            </h2>

            <p className="mt-3 leading-7 text-slate-400">
              Some Kaxiro features require an account. You are responsible for
              maintaining the confidentiality of your account credentials and
              for activity that occurs through your account.
            </p>

            <p className="mt-3 leading-7 text-slate-400">
              You must provide accurate information and must not impersonate
              another person or use a username that is unlawful, abusive, or
              misleading.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">
              4. Fair play
            </h2>

            <p className="mt-3 leading-7 text-slate-400">
              Kaxiro is intended to be played fairly. You agree not to
              manipulate scores, exploit technical vulnerabilities, automate
              gameplay, interfere with challenge timers, or otherwise gain an
              unfair advantage over other players.
            </p>

            <p className="mt-3 leading-7 text-slate-400">
              We may remove invalid scores, restrict access, or take other
              reasonable action when we believe Kaxiro has been abused or
              manipulated.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">
              5. Challenge content and scores
            </h2>

            <p className="mt-3 leading-7 text-slate-400">
              Challenge content, answers, scoring methods, time limits, and
              available features may change over time.
            </p>

            <p className="mt-3 leading-7 text-slate-400">
              Scores and leaderboard positions are provided as part of the
              entertainment experience and may be corrected or removed if
              errors, technical issues, or abuse are discovered.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">
              6. Acceptable use
            </h2>

            <p className="mt-3 leading-7 text-slate-400">
              You may not use Kaxiro in a way that disrupts the service,
              attempts unauthorized access, distributes malicious software,
              abuses other users, or violates applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">
              7. Intellectual property
            </h2>

            <p className="mt-3 leading-7 text-slate-400">
              Kaxiro&apos;s branding, interface, original challenge content,
              software, and other original materials are protected by
              applicable intellectual property laws.
            </p>

            <p className="mt-3 leading-7 text-slate-400">
              Third-party names, trademarks, images, products, landmarks, and
              other referenced materials remain the property of their
              respective owners.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">
              8. Availability
            </h2>

            <p className="mt-3 leading-7 text-slate-400">
              We aim to keep Kaxiro available and reliable, but we do not
              guarantee uninterrupted or error-free access. The service may be
              changed, suspended, or temporarily unavailable for maintenance,
              updates, or technical reasons.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">
              9. Disclaimer
            </h2>

            <p className="mt-3 leading-7 text-slate-400">
              Kaxiro is provided on an &quot;as is&quot; and &quot;as
              available&quot; basis. To the extent permitted by law, we make
              no warranties regarding uninterrupted availability, accuracy,
              or suitability for a particular purpose.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">
              10. Limitation of liability
            </h2>

            <p className="mt-3 leading-7 text-slate-400">
              To the extent permitted by applicable law, Kaxiro and its
              operators will not be liable for indirect, incidental, or
              consequential losses resulting from the use of or inability to
              use the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">
              11. Changes to these terms
            </h2>

            <p className="mt-3 leading-7 text-slate-400">
              We may update these Terms of Use as Kaxiro evolves. The
              &quot;Last updated&quot; date on this page will indicate when the
              terms were most recently revised.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">
              12. Contact
            </h2>

            <p className="mt-3 leading-7 text-slate-400">
              If you have questions about these Terms of Use, please visit our{" "}
              <Link
                href="/contact"
                className="font-medium text-cyan-300 transition hover:text-cyan-200"
              >
                Contact page
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}