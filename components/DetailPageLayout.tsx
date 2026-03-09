"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface Breadcrumb {
  label: string;
  href: string;
}

interface DetailPageLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  breadcrumbs?: Breadcrumb[];
}

export default function DetailPageLayout({ title, subtitle, children, breadcrumbs }: DetailPageLayoutProps) {
  const crumbs: Breadcrumb[] = breadcrumbs || [{ label: "Dashboard", href: "/" }];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center gap-2">
          {crumbs.map((crumb, i) => (
            <span key={crumb.href} className="flex items-center gap-2">
              {i === 0 && (
                <svg className="h-4 w-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              )}
              <Link
                href={crumb.href}
                className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm"
              >
                {crumb.label}
              </Link>
              <div className="h-4 w-px bg-zinc-800" />
            </span>
          ))}
          <div className="min-w-0">
            <h1 className="text-base font-semibold text-zinc-100 truncate">{title}</h1>
            {subtitle && <p className="text-xs text-zinc-500">{subtitle}</p>}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-5">
        {children}
      </main>
    </div>
  );
}
