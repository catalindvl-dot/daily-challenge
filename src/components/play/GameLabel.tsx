type GameLabelProps = {
  icon: string;
  label: string;
};

export default function GameLabel({
  icon,
  label,
}: GameLabelProps) {
  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4">
      <span className="h-px w-12 bg-cyan-300/30 sm:w-16" />

      <div className="flex items-center gap-2 text-cyan-300 sm:gap-3">
        <span className="text-xl" aria-hidden="true">
          {icon}
        </span>

        <p className="text-sm font-semibold uppercase tracking-[0.28em] sm:tracking-[0.32em]">
          {label}
        </p>
      </div>

      <span className="h-px w-12 bg-cyan-300/30 sm:w-16" />
    </div>
  );
}