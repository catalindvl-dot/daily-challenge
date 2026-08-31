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
        width: 1672,
        height: 941,
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

        {children}
      </body>
    </html>
  );
}