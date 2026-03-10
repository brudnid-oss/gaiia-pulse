"use client";

import type { NetworkSite } from "@/lib/mock-geodata";

const TYPE_LABELS: Record<string, string> = {
  central_office: "Central Office",
  fiber_hut: "Fiber Hut",
  cabinet: "Cabinet",
  splice_point: "Splice Point",
  pop: "POP",
};

export default function SitePopup({ site }: { site: NetworkSite }) {
  return (
    <div className="min-w-[200px] text-zinc-200">
      <div className="mb-2">
        <p className="text-sm font-semibold text-zinc-100">{site.name}</p>
        <p className="text-[10px] font-mono text-zinc-500">{site.id}</p>
      </div>

      <div className="space-y-1 text-xs">
        <div className="flex items-center gap-1">
          <span className="text-zinc-500 w-16 shrink-0">Type</span>
          <span className="text-cyan-400">{TYPE_LABELS[site.type] || site.type}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-zinc-500 w-16 shrink-0">Address</span>
          <span className="text-zinc-300">{site.address}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-zinc-500 w-16 shrink-0">Equipment</span>
          <span className="text-zinc-300">{site.equipmentCount} units</span>
        </div>
      </div>
    </div>
  );
}
