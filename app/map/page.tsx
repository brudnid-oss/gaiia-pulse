"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const NetworkMap = dynamic(() => import("@/components/map/NetworkMap"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center bg-zinc-950" style={{ height: "calc(100vh - 48px)" }}>
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-500" />
        <p className="text-sm text-zinc-400">Loading map...</p>
      </div>
    </div>
  ),
});

export default function MapPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50 h-12">
        <div className="h-full px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <svg className="h-5 w-5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">
                gaiia <span className="text-emerald-500">Pulse</span>
              </h1>
            </Link>
            <nav className="flex items-center gap-1 ml-4">
              <Link
                href="/"
                className="rounded-md px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
              >
                Dashboard
              </Link>
              <span
                className="rounded-md px-3 py-1.5 text-xs text-emerald-400 bg-emerald-500/10"
              >
                Map
              </span>
            </nav>
          </div>
        </div>
      </header>
      <NetworkMap />
    </div>
  );
}
