import Link from "next/link";
import { APP_CONFIG } from "@/lib/config";

export default function Navbar() {
  return (
    <header className="border-b border-white/5 bg-[#07090d]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-white"
        >
          {APP_CONFIG.name}
        </Link>

        <Link
          href="/profile"
          className="text-sm text-slate-400 hover:text-white"
        >
          Sign In
        </Link>
      </div>
    </header>
  );
}