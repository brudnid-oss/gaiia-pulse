"use client";

import ThemeToggle from "./ui/ThemeToggle";
import { formatTimestamp } from "@/lib/formatters";

interface HeaderProps {
  lastRefresh: Date | null;
  onRefresh: () => void;
  refreshing: boolean;
}

export default function Header({ lastRefresh, onRefresh, refreshing }: HeaderProps) {
  const instanceUrl = process.env.NEXT_PUBLIC_GAIIA_INSTANCE || "demo.gaiia.com";

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">
              gaiia <span className="text-emerald-500">Pulse</span>
            </h1>
          </div>
          <span className="hidden sm:inline-flex items-center rounded-full bg-zinc-800/80 px-2.5 py-0.5 text-[10px] font-mono text-zinc-500">
            {instanceUrl}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {lastRefresh && (
            <span className="hidden sm:block text-[11px] font-mono text-zinc-600">
              Updated {formatTimestamp(lastRefresh)}
            </span>
          )}
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="rounded-md border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition-colors disabled:opacity-50"
          >
            {refreshing ? (
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 animate-spin rounded-full border border-zinc-600 border-t-emerald-500" />
                Refreshing
              </span>
            ) : (
              "Refresh"
            )}
          </button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
