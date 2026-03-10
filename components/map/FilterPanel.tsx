"use client";

import { useState, useMemo } from "react";
import type { MapSubscriber } from "@/lib/mock-geodata";
import type { MapFilters } from "./NetworkMap";

interface FilterPanelProps {
  filters: MapFilters;
  onFiltersChange: (filters: MapFilters) => void;
  subscribers: MapSubscriber[];
  onSearchSelect: (subscriber: MapSubscriber) => void;
}

const STATUSES = ["active", "suspended", "pending", "cancelled"];
const ACCOUNT_TYPES = ["Residential", "Commercial"];
const PLANS = ["Fiber 100 Mbps", "Fiber 250 Mbps", "Fiber 500 Mbps", "Fiber 1 Gbps", "Fiber 2 Gbps"];

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-500",
  suspended: "bg-red-500",
  pending: "bg-amber-500",
  cancelled: "bg-zinc-500",
};

export default function FilterPanel({
  filters,
  onFiltersChange,
  subscribers,
  onSearchSelect,
}: FilterPanelProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [searchResults, setSearchResults] = useState<MapSubscriber[]>([]);

  const toggleSet = (set: Set<string>, value: string): Set<string> => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    return next;
  };

  const handleSearch = (query: string) => {
    onFiltersChange({ ...filters, search: query });
    if (query.length >= 2) {
      const q = query.toLowerCase();
      setSearchResults(
        subscribers
          .filter(
            (s) =>
              s.name.toLowerCase().includes(q) ||
              s.id.toLowerCase().includes(q) ||
              s.address.toLowerCase().includes(q),
          )
          .slice(0, 5),
      );
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className="absolute top-3 right-3 z-10">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center gap-2 rounded-lg bg-zinc-900/90 backdrop-blur-md border border-zinc-700/50 px-3 py-2 text-xs text-zinc-300 hover:text-zinc-100 hover:border-zinc-600 transition-all shadow-lg ml-auto"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filters
      </button>

      {!collapsed && (
        <div className="mt-2 rounded-lg bg-zinc-900/90 backdrop-blur-md border border-zinc-700/50 p-3 shadow-lg w-[240px] max-h-[calc(100vh-160px)] overflow-y-auto">
          {/* Search */}
          <div className="mb-3">
            <div className="relative">
              <svg
                className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Find account..."
                className="w-full rounded-md border border-zinc-700 bg-zinc-800/50 py-1.5 pl-8 pr-3 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
              />
            </div>
            {searchResults.length > 0 && (
              <div className="mt-1 rounded-md border border-zinc-700 bg-zinc-800/90 overflow-hidden">
                {searchResults.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      onSearchSelect(s);
                      setSearchResults([]);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs hover:bg-zinc-700/50 transition-colors border-b border-zinc-700/50 last:border-0"
                  >
                    <div className="flex items-center gap-1.5">
                      <div className={`h-1.5 w-1.5 rounded-full ${STATUS_COLORS[s.status]}`} />
                      <span className="text-zinc-200 truncate">{s.name}</span>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono">{s.id}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Account Status */}
          <FilterSection title="Account Status">
            {STATUSES.map((status) => (
              <CheckboxItem
                key={status}
                label={status.charAt(0).toUpperCase() + status.slice(1)}
                checked={filters.statuses.has(status)}
                onChange={() =>
                  onFiltersChange({
                    ...filters,
                    statuses: toggleSet(filters.statuses, status),
                  })
                }
                dotColor={STATUS_COLORS[status]}
              />
            ))}
          </FilterSection>

          {/* Account Type */}
          <FilterSection title="Account Type">
            {ACCOUNT_TYPES.map((type) => (
              <CheckboxItem
                key={type}
                label={type}
                checked={filters.accountTypes.has(type)}
                onChange={() =>
                  onFiltersChange({
                    ...filters,
                    accountTypes: toggleSet(filters.accountTypes, type),
                  })
                }
              />
            ))}
          </FilterSection>

          {/* Plan */}
          <FilterSection title="Service Plan">
            {PLANS.map((plan) => (
              <CheckboxItem
                key={plan}
                label={plan.replace("Fiber ", "")}
                checked={filters.plans.has(plan)}
                onChange={() =>
                  onFiltersChange({
                    ...filters,
                    plans: toggleSet(filters.plans, plan),
                  })
                }
              />
            ))}
          </FilterSection>

          {/* Has Issues */}
          <div className="border-t border-zinc-700/50 pt-2 mt-2">
            <CheckboxItem
              label="Has issues only"
              checked={filters.hasIssuesOnly}
              onChange={() =>
                onFiltersChange({ ...filters, hasIssuesOnly: !filters.hasIssuesOnly })
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-2.5">
      <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1.5">{title}</p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function CheckboxItem({
  label,
  checked,
  onChange,
  dotColor,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  dotColor?: string;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer py-0.5 hover:bg-zinc-800/50 rounded px-1.5 -mx-1.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-3 w-3 rounded border-zinc-600 bg-zinc-800 text-emerald-500 focus:ring-0 focus:ring-offset-0 accent-emerald-500"
      />
      {dotColor && <div className={`h-2 w-2 rounded-full ${dotColor}`} />}
      <span className="text-xs text-zinc-300">{label}</span>
    </label>
  );
}
