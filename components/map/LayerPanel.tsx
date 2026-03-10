"use client";

import { useState } from "react";

interface LayerPanelProps {
  layers: {
    subscribers: boolean;
    infrastructure: boolean;
    serviceAreas: boolean;
    heatmap: boolean;
  };
  onToggle: (key: string) => void;
}

const LAYER_CONFIG = [
  { key: "subscribers", label: "Subscribers", icon: "●", color: "text-emerald-400" },
  { key: "infrastructure", label: "Infrastructure", icon: "■", color: "text-cyan-400" },
  { key: "serviceAreas", label: "Service Areas", icon: "◻", color: "text-indigo-400" },
  { key: "heatmap", label: "Trouble Spots", icon: "◉", color: "text-orange-400" },
];

export default function LayerPanel({ layers, onToggle }: LayerPanelProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="absolute top-3 left-3 z-10">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center gap-2 rounded-lg bg-zinc-900/90 backdrop-blur-md border border-zinc-700/50 px-3 py-2 text-xs text-zinc-300 hover:text-zinc-100 hover:border-zinc-600 transition-all shadow-lg"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        Layers
      </button>

      {!collapsed && (
        <div className="mt-2 rounded-lg bg-zinc-900/90 backdrop-blur-md border border-zinc-700/50 p-3 shadow-lg min-w-[180px]">
          <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2">Map Layers</p>
          <div className="space-y-1.5">
            {LAYER_CONFIG.map(({ key, label, icon, color }) => (
              <label
                key={key}
                className="flex items-center gap-2 cursor-pointer py-1 hover:bg-zinc-800/50 rounded px-1.5 -mx-1.5"
              >
                <input
                  type="checkbox"
                  checked={layers[key as keyof typeof layers]}
                  onChange={() => onToggle(key)}
                  className="h-3.5 w-3.5 rounded border-zinc-600 bg-zinc-800 text-emerald-500 focus:ring-0 focus:ring-offset-0 accent-emerald-500"
                />
                <span className={`${color} text-sm`}>{icon}</span>
                <span className="text-xs text-zinc-300">{label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
