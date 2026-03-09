"use client";

interface MetricCardProps {
  label: string;
  value: string;
  subValue?: string;
  trend?: "up" | "down" | "neutral";
  status?: "normal" | "warning" | "critical" | "good";
  loading?: boolean;
}

export default function MetricCard({
  label,
  value,
  subValue,
  status = "normal",
  loading = false,
}: MetricCardProps) {
  const statusColors = {
    normal: "text-zinc-100",
    good: "text-emerald-400",
    warning: "text-amber-400",
    critical: "text-red-400",
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 sm:p-5">
        <div className="h-3 w-24 animate-pulse rounded bg-zinc-800 mb-3" />
        <div className="h-8 w-32 animate-pulse rounded bg-zinc-800 mb-2" />
        <div className="h-3 w-20 animate-pulse rounded bg-zinc-800" />
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 sm:p-5 hover:border-zinc-700 transition-colors">
      <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-1">
        {label}
      </p>
      <p className={`text-2xl sm:text-3xl font-mono font-semibold ${statusColors[status]}`}>
        {value}
      </p>
      {subValue && (
        <p className="text-xs text-zinc-500 mt-1 font-mono">{subValue}</p>
      )}
    </div>
  );
}
