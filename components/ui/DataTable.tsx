"use client";

import { useState, useMemo, ReactNode } from "react";

export interface Column<T> {
  key: string;
  label: string;
  render: (item: T) => ReactNode;
  sortKey?: (item: T) => string | number;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  searchPlaceholder?: string;
  searchFilter?: (item: T, query: string) => boolean;
  filterOptions?: { label: string; key: string; values: string[] };
  onFilterChange?: (value: string) => void;
  onRowClick?: (item: T) => void;
}

export default function DataTable<T>({
  data,
  columns,
  pageSize = 25,
  searchPlaceholder = "Search...",
  searchFilter,
  filterOptions,
  onRowClick,
}: DataTableProps<T>) {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    let result = data;
    if (search && searchFilter) {
      result = result.filter((item) => searchFilter(item, search.toLowerCase()));
    }
    if (filter !== "all" && filterOptions) {
      result = result.filter((item) => {
        const val = (item as Record<string, unknown>)[filterOptions.key];
        return String(val).toLowerCase() === filter.toLowerCase();
      });
    }
    if (sortCol) {
      const col = columns.find((c) => c.key === sortCol);
      if (col?.sortKey) {
        result = [...result].sort((a, b) => {
          const av = col.sortKey!(a);
          const bv = col.sortKey!(b);
          if (av < bv) return sortDir === "asc" ? -1 : 1;
          if (av > bv) return sortDir === "asc" ? 1 : -1;
          return 0;
        });
      }
    }
    return result;
  }, [data, search, searchFilter, filter, filterOptions, sortCol, sortDir, columns]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const pageData = filtered.slice(page * pageSize, (page + 1) * pageSize);

  const handleSort = (key: string) => {
    if (sortCol === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortCol(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="space-y-3">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        {searchFilter && (
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="w-full rounded-md border border-zinc-800 bg-zinc-900/50 py-2 pl-9 pr-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
            />
          </div>
        )}
        {filterOptions && (
          <select
            value={filter}
            onChange={(e) => { setFilter(e.target.value); setPage(0); }}
            className="rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-zinc-600"
          >
            <option value="all">All {filterOptions.label}</option>
            {filterOptions.values.map((v) => (
              <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1).replace(/_/g, " ")}</option>
            ))}
          </select>
        )}
        <div className="text-xs text-zinc-600 self-center font-mono whitespace-nowrap">
          {filtered.length} results
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/80">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortKey && handleSort(col.key)}
                  className={`px-4 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider text-zinc-500 ${
                    col.sortKey ? "cursor-pointer hover:text-zinc-300 select-none" : ""
                  } ${col.className || ""}`}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {sortCol === col.key && (
                      <span className="text-emerald-500">{sortDir === "asc" ? "↑" : "↓"}</span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.map((item, i) => (
              <tr
                key={i}
                onClick={() => onRowClick?.(item)}
                className={`border-b border-zinc-800/50 transition-colors ${
                  onRowClick ? "cursor-pointer hover:bg-zinc-800/30" : ""
                }`}
              >
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-2.5 ${col.className || ""}`}>
                    {col.render(item)}
                  </td>
                ))}
              </tr>
            ))}
            {pageData.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-zinc-600">
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="rounded-md border border-zinc-800 px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="text-xs font-mono text-zinc-600">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
            className="rounded-md border border-zinc-800 px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
