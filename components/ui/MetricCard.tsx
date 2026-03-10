"use client";

import Link from "next/link";

interface MetricCardProps {
  label: string;
  value: string;
  subValue?: string;
  trend?: "up" | "down" | "neutral";
  status?: "normal" | "warning" | "critical" | "good";
  loading?: boolean;
  href?: string;
}

export default function MetricCard({
  label,
  value,
  subValue,
  status = "normal",
  loading = false,
  href,
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

  const content = (
    <>
      <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-1">
        {label}
      </p>
      <p className={`font-mono font-semibold ${value.length > 7 ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"} ${statusColors[status]}`}>
        {value}
      </p>
      {subValue && (
        <p className="text-[10px] text-zinc-500 mt-1 font-mono whitespace-nowrap">{subValue}</p>
      )}
      {href && (
        <p className="text-[10px] text-zinc-600 mt-2 group-hover:text-emerald-500 transition-colors">
          View details →
        </p>
      )}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="group block rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 sm:p-5 hover:border-emerald-500/30 hover:bg-zinc-900/80 transition-all"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 sm:p-5 hover:border-zinc-700 transition-colors">
      {content}
    </div>
  );
}
