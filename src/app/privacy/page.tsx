import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how Kaxiro handles your information.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-[calc(100dvh-4rem)] px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.28em] text-cyan-300">
          Legal
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Privacy Policy
        </h1>

        <p className="mt-4 text-sm text-slate-500">
          Last updated: August 31, 2026
        </p>

        <div className="mt-10 space-y-10 text-slate-300">
          <section>
            <h2 className="text-xl font-semibold text-white">
              1. Information we collect
            </h2>

            <p className="mt-3 leading-7 text-slate-400">
              When you create a Kaxiro account, we may collect information
              such as your email address, username, challenge scores, stage
              results, streaks, and challenge history.
            </p>

            <p className="mt-3 leading-7 text-slate-400">
              If you use Kaxiro without an account, certain challenge progress
              and results may be stored locally in your browser using local
              storage.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">
              2. How we use your information
            </h2>

            <p className="mt-3 leading-7 text-slate-400">
              We use your information to provide and operate Kaxiro, save your
              challenge results, calculate streaks and statistics, display
              leaderboard rankings, maintain your account, and improve the
              experience.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">
              3. Authentication and data storage
            </h2>

            <p className="mt-3 leading-7 text-slate-400">
              Kaxiro uses Supabase to provide authentication and database
              services. Account information and challenge data may therefore
              be processed and stored through Supabase&apos;s infrastructure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">
              4. Local storage
            </h2>

            <p className="mt-3 leading-7 text-slate-400">
              Kaxiro uses browser local storage to remember guest challenge
              progress, completed stages, and other information necessary for
              the Daily Challenge experience.
            </p>

            <p className="mt-3 leading-7 text-slate-400">
              Local storage data remains on your device unless it is cleared
              by you, your browser, or the application.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">
              5. Sharing of information
            </h2>

            <p className="mt-3 leading-7 text-slate-400">
              We do not sell your personal information. Information may be
              processed by service providers that are necessary to operate
              Kaxiro, such as hosting, authentication, and database providers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">
              6. Leaderboards
            </h2>

            <p className="mt-3 leading-7 text-slate-400">
              If you create an account and participate in the Daily Challenge,
              your username, score, and leaderboard position may be visible to
              other Kaxiro users.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">
              7. Data retention
            </h2>

            <p className="mt-3 leading-7 text-slate-400">
              We retain account and challenge information for as long as
              necessary to operate Kaxiro and provide features such as profile
              statistics, challenge history, streaks, and leaderboards.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">
              8. Your choices
            </h2>

            <p className="mt-3 leading-7 text-slate-400">
              You may use parts of Kaxiro without creating an account. You may
              also clear locally stored guest data through your browser
              settings.
            </p>

            <p className="mt-3 leading-7 text-slate-400">
              If you would like to request access to, correction of, or
              deletion of information associated with your Kaxiro account,
              you can contact us through the Contact page.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">
              9. Changes to this policy
            </h2>

            <p className="mt-3 leading-7 text-slate-400">
              We may update this Privacy Policy as Kaxiro evolves. When we do,
              the updated date shown on this page will be changed.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">
              10. Contact
            </h2>

            <p className="mt-3 leading-7 text-slate-400">
              If you have questions about this Privacy Policy or how Kaxiro
              handles your information, please visit our{" "}
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