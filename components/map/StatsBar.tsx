"use client";

interface StatsBarProps {
  counts: {
    active: number;
    suspended: number;
    pending: number;
    cancelled: number;
    sites: number;
    tickets: number;
  };
  totalFiltered: number;
  totalAll: number;
}

export default function StatsBar({ counts, totalFiltered, totalAll }: StatsBarProps) {
  return (
    <div className="h-9 flex items-center gap-4 px-4 bg-zinc-900/90 border-b border-zinc-800 text-[11px] font-mono overflow-x-auto">
      {totalFiltered !== totalAll && (
        <span className="text-zinc-500">
          Showing <span className="text-zinc-300">{totalFiltered}</span> of {totalAll} accounts
        </span>
      )}
      <Stat label="Active" value={counts.active} color="text-emerald-400" />
      <Stat label="Suspended" value={counts.suspended} color="text-red-400" />
      <Stat label="Pending" value={counts.pending} color="text-amber-400" />
      <Stat label="Network Sites" value={counts.sites} color="text-cyan-400" />
      <Stat label="Open Tickets" value={counts.tickets} color="text-orange-400" />
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <span className="text-zinc-500 whitespace-nowrap">
      <span className={color}>{value}</span> {label}
    </span>
  );
}
