"use client";

import Link from "next/link";
import type { MapSubscriber } from "@/lib/mock-geodata";

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-500",
  suspended: "bg-red-500",
  pending: "bg-amber-500",
  cancelled: "bg-zinc-500",
};

const STATUS_TEXT: Record<string, string> = {
  active: "text-emerald-400",
  suspended: "text-red-400",
  pending: "text-amber-400",
  cancelled: "text-zinc-400",
};

export default function SubscriberPopup({ subscriber: s }: { subscriber: MapSubscriber }) {
  return (
    <div className="min-w-[220px] text-zinc-200">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <p className="text-sm font-semibold text-zinc-100">{s.name}</p>
          <p className="text-[10px] font-mono text-zinc-500">{s.id}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className={`h-2 w-2 rounded-full ${STATUS_COLORS[s.status]}`} />
          <span className={`text-[10px] font-medium uppercase ${STATUS_TEXT[s.status]}`}>
            {s.status}
          </span>
        </div>
      </div>

      <div className="space-y-1 text-xs">
        <Row label="Plan" value={s.planName} />
        <Row label="Type" value={s.accountType} />
        <Row label="Address" value={s.address} />
        {s.labels.length > 0 && (
          <div className="flex items-center gap-1">
            <span className="text-zinc-500 w-14 shrink-0">Labels</span>
            <div className="flex gap-1 flex-wrap">
              {s.labels.map((l) => (
                <span key={l} className="rounded-full bg-zinc-700 px-1.5 py-0.5 text-[9px] text-zinc-400">
                  {l}
                </span>
              ))}
            </div>
          </div>
        )}
        {s.overdueBalance > 0 && (
          <Row label="Balance" value={`$${s.overdueBalance}`} valueClass="text-red-400" />
        )}
        {!s.hasPaymentMethod && (
          <p className="text-amber-500 text-[10px]">No payment method on file</p>
        )}
      </div>

      <div className="mt-2.5 pt-2 border-t border-zinc-700/50">
        <Link
          href={`/subscribers/${s.id}`}
          className="text-[10px] text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          View account details →
        </Link>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  valueClass = "text-zinc-300",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-zinc-500 w-14 shrink-0">{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  );
}
