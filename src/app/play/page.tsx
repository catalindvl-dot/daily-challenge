import type { Metadata } from "next";
import Play from "@/components/play/Play";

export const metadata: Metadata = {
  title: "Play",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PlayPage() {
  return <Play />;
}