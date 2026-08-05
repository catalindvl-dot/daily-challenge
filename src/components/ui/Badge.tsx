import { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
};

export default function Badge({ children }: BadgeProps) {
  return (
    <span className="inline-flex min-h-9 items-center rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-slate-400">
      {children}
    </span>
  );
}