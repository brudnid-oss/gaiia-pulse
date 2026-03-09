"use client";

import { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  children: ReactNode;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
}

export default function ChartCard({
  title,
  children,
  loading = false,
  error,
  onRetry,
}: ChartCardProps) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 sm:p-5">
      <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-400 mb-4">
        {title}
      </h3>
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-500" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-48 text-zinc-500">
          <p className="text-sm mb-2">Data unavailable</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-xs text-emerald-500 hover:text-emerald-400 transition-colors"
            >
              Retry
            </button>
          )}
        </div>
      ) : (
        children
      )}
    </div>
  );
}
