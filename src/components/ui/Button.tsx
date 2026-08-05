import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  className?: string;
};

export default function Button({
  children,
  href,
  onClick,
  variant = "primary",
  className = "",
}: ButtonProps) {
  const baseClasses =
    "inline-flex min-h-[60px] items-center justify-center rounded-2xl px-8 font-semibold transition-all duration-200";

  const variantClasses = {
    primary:
      "bg-cyan-300 text-slate-950 hover:-translate-y-0.5 hover:bg-cyan-200",
    secondary:
      "border border-white/10 bg-white/5 text-white hover:bg-white/10",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {children}
    </button>
  );
}