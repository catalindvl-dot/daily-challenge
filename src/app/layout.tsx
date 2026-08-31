import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import AuthNav from "@/components/shared/AuthNav";
import { getCurrentUser } from "@/utils/supabase/getCurrentUser";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kaxiro.com"),

  title: {
    default: "Kaxiro",
    template: "%s | Kaxiro",
  },

  description: "Where curiosity comes to play.",

  applicationName: "Kaxiro",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    url: "/",
    siteName: "Kaxiro",
    title: "Kaxiro",
    description: "Where curiosity comes to play.",
    images: [
      {
        url: "/kaxiro-og.png",
        width: 1200,
        height: 630,
        alt: "Kaxiro — Where curiosity comes to play.",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Kaxiro",
    description: "Where curiosity comes to play.",
    images: ["/kaxiro-og.png"],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <header className="relative z-50 h-16 shrink-0 border-b border-white/5">
          <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-between px-6">
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight text-white"
            >
              Kaxiro
            </Link>

            <AuthNav isLoggedIn={Boolean(user)} />
          </div>
        </header>

        <div className="flex flex-1 flex-col">
          {children}
        </div>

        <footer className="shrink-0 border-t border-white/5">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row">
            <p className="text-xs text-slate-500 sm:text-slate-400">
              © 2026 Kaxiro
            </p>

            <nav className="flex items-center gap-5">
              <Link
                href="/privacy"
                className="text-xs text-slate-500 transition hover:text-white sm:text-slate-400"
              >
                Privacy
              </Link>

              <Link
                href="/terms"
                className="text-xs text-slate-500 transition hover:text-white sm:text-slate-400"
              >
                Terms
              </Link>

              <Link
                href="/contact"
                className="text-xs text-slate-500 transition hover:text-white sm:text-slate-400"
              >
                Contact
              </Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}