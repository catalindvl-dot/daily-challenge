import Link from "next/link";
import { APP_CONFIG } from "@/lib/config";

export default function Logo() {
  return (
    <Link
      href="/"
      className="text-xl font-semibold tracking-tight text-white"
    >
      {APP_CONFIG.name}
    </Link>
  );
}