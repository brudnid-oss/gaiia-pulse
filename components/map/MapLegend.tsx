"use client";

import { useState } from "react";

export default function MapLegend() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="absolute bottom-8 left-3 z-10">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="rounded-lg bg-zinc-900/90 backdrop-blur-md border border-zinc-700/50 px-2.5 py-1.5 text-[10px] text-zinc-400 hover:text-zinc-200 transition-all shadow-lg"
      >
        {collapsed ? "Legend" : "Legend ▾"}
      </button>

      {!collapsed && (
        <div className="mt-1 rounded-lg bg-zinc-900/90 backdrop-blur-md border border-zinc-700/50 p-2.5 shadow-lg">
          <div className="space-y-2">
            <LegendGroup title="Subscribers">
              <LegendDot color="bg-emerald-500" label="Active" />
              <LegendDot color="bg-red-500" label="Suspended" />
              <LegendDot color="bg-amber-500" label="Pending" />
              <LegendDot color="bg-zinc-500" label="Cancelled" />
            </LegendGroup>
            <LegendGroup title="Infrastructure">
              <LegendShape shape="square" color="#06B6D4" label="Central Office" />
              <LegendShape shape="pentagon" color="#0891B2" label="POP" />
              <LegendShape shape="circle" color="#22D3EE" label="Fiber Hut" />
              <LegendShape shape="triangle" color="#67E8F9" label="Cabinet" />
              <LegendShape shape="diamond" color="#A5F3FC" label="Splice Point" />
            </LegendGroup>
          </div>
        </div>
      )}
    </div>
  );
}

function LegendGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[9px] uppercase tracking-wider text-zinc-500 mb-1">{title}</p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`h-2 w-2 rounded-full ${color}`} />
      <span className="text-[10px] text-zinc-400">{label}</span>
    </div>
  );
}

function LegendShape({ shape, color, label }: { shape: string; color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <svg width="10" height="10" viewBox="0 0 10 10">
        {shape === "square" && <rect x="1" y="1" width="8" height="8" fill={color} />}
        {shape === "circle" && <circle cx="5" cy="5" r="4" fill={color} />}
        {shape === "triangle" && <polygon points="5,1 9,9 1,9" fill={color} />}
        {shape === "diamond" && <polygon points="5,0 10,5 5,10 0,5" fill={color} />}
        {shape === "pentagon" && <polygon points="5,0 10,4 8,9 2,9 0,4" fill={color} />}
      </svg>
      <span className="text-[10px] text-zinc-400">{label}</span>
    </div>
  );
}
