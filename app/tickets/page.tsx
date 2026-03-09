"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import DetailPageLayout from "@/components/DetailPageLayout";
import DataTable, { Column } from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import { Ticket } from "@/lib/types";
import { formatRelativeTime } from "@/lib/formatters";

const columns: Column<Ticket>[] = [
  {
    key: "id",
    label: "ID",
    render: (t) => <span className="font-mono text-xs text-zinc-500">{t.id}</span>,
    sortKey: (t) => t.id,
    className: "w-24",
  },
  {
    key: "subject",
    label: "Subject",
    render: (t) => (
      <div className="min-w-0">
        <p className="text-zinc-200 truncate max-w-xs">{t.subject}</p>
        <p className="text-[10px] text-zinc-600">{t.account_name}</p>
      </div>
    ),
    sortKey: (t) => t.subject,
  },
  {
    key: "status",
    label: "Status",
    render: (t) => <StatusBadge status={t.status} />,
    sortKey: (t) => t.status,
  },
  {
    key: "priority",
    label: "Priority",
    render: (t) => <StatusBadge status={t.priority} />,
    sortKey: (t) => {
      const order = { critical: 0, high: 1, medium: 2, low: 3 };
      return order[t.priority];
    },
  },
  {
    key: "account",
    label: "Account",
    render: (t) => <span className="text-xs text-zinc-400">{t.account_id}</span>,
    className: "hidden lg:table-cell",
  },
  {
    key: "created",
    label: "Age",
    render: (t) => <span className="text-xs text-zinc-500 font-mono">{formatRelativeTime(t.created_at)}</span>,
    sortKey: (t) => t.created_at,
  },
  {
    key: "resolved",
    label: "Resolved",
    render: (t) => (
      <span className="text-xs text-zinc-500 font-mono">
        {t.resolved_at ? formatRelativeTime(t.resolved_at) : "—"}
      </span>
    ),
    className: "hidden md:table-cell",
  },
];

export default function TicketsPage() {
  return (
    <Suspense fallback={
      <DetailPageLayout title="Tickets">
        <div className="flex items-center justify-center h-64">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-500" />
        </div>
      </DetailPageLayout>
    }>
      <TicketsContent />
    </Suspense>
  );
}

function TicketsContent() {
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status") || "all";
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tickets/list")
      .then((r) => r.json())
      .then((d) => setTickets(d.data))
      .finally(() => setLoading(false));
  }, []);

  const openCount = tickets.filter((t) => t.status === "open" || t.status === "in_progress").length;

  if (loading) {
    return (
      <DetailPageLayout title="Tickets">
        <div className="flex items-center justify-center h-64">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-500" />
        </div>
      </DetailPageLayout>
    );
  }

  return (
    <DetailPageLayout title="Support Tickets" subtitle={`${openCount} open · ${tickets.length} total`}>
      <DataTable
        data={tickets}
        columns={columns}
        searchPlaceholder="Search by subject, account, or ID..."
        searchFilter={(t, q) =>
          t.subject.toLowerCase().includes(q) ||
          t.account_name.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q)
        }
        filterOptions={{
          label: "Status",
          key: "status",
          values: ["open", "in_progress", "resolved", "closed"],
        }}
        defaultFilter={statusFilter}
      />
    </DetailPageLayout>
  );
}
