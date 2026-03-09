"use client";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

const colorMap: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  open: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  in_progress: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  pending: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  resolved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  closed: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
  cancelled: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
  suspended: "bg-red-500/15 text-red-400 border-red-500/20",
  paid: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  unpaid: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  overdue: "bg-red-500/15 text-red-400 border-red-500/20",
  void: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
  low: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
  medium: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  high: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  critical: "bg-red-500/15 text-red-400 border-red-500/20",
  new_install: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  upgrade: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  disconnect: "bg-red-500/15 text-red-400 border-red-500/20",
};

export default function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const key = status.toLowerCase().replace(/ /g, "_");
  const colors = colorMap[key] || "bg-zinc-500/15 text-zinc-400 border-zinc-500/20";
  const sizeClass = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs";

  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${colors} ${sizeClass}`}>
      {status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
    </span>
  );
}
