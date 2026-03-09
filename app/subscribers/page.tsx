"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import DetailPageLayout from "@/components/DetailPageLayout";
import DataTable, { Column } from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import { Account } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/formatters";

const columns: Column<Account>[] = [
  {
    key: "id",
    label: "ID",
    render: (a) => <span className="font-mono text-xs text-zinc-500">{a.id}</span>,
    sortKey: (a) => a.id,
    className: "w-28",
  },
  {
    key: "name",
    label: "Name",
    render: (a) => <span className="text-zinc-200 font-medium">{a.name}</span>,
    sortKey: (a) => a.name,
  },
  {
    key: "email",
    label: "Email",
    render: (a) => <span className="text-zinc-400 text-xs">{a.email}</span>,
    className: "hidden md:table-cell",
  },
  {
    key: "status",
    label: "Status",
    render: (a) => <StatusBadge status={a.status} />,
    sortKey: (a) => a.status,
  },
  {
    key: "balance",
    label: "Balance",
    render: (a) => (
      <span className={`font-mono text-xs ${a.balance > 0 ? "text-red-400" : "text-zinc-500"}`}>
        {a.balance > 0 ? formatCurrency(a.balance) : "—"}
      </span>
    ),
    sortKey: (a) => a.balance,
    className: "text-right",
  },
  {
    key: "payment",
    label: "Payment",
    render: (a) => (
      <span className={`text-xs ${a.payment_method_on_file ? "text-emerald-500" : "text-amber-500"}`}>
        {a.payment_method_on_file ? "On file" : "Missing"}
      </span>
    ),
    className: "hidden lg:table-cell",
  },
  {
    key: "created",
    label: "Created",
    render: (a) => <span className="text-xs text-zinc-500 font-mono">{formatDate(a.created_at)}</span>,
    sortKey: (a) => a.created_at,
    className: "hidden lg:table-cell",
  },
];

export default function SubscribersPage() {
  return (
    <Suspense fallback={
      <DetailPageLayout title="Subscribers">
        <div className="flex items-center justify-center h-64">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-500" />
        </div>
      </DetailPageLayout>
    }>
      <SubscribersContent />
    </Suspense>
  );
}

function SubscribersContent() {
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status") || "all";
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/subscribers")
      .then((r) => r.json())
      .then((d) => setAccounts(d.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <DetailPageLayout title="Subscribers">
        <div className="flex items-center justify-center h-64">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-500" />
        </div>
      </DetailPageLayout>
    );
  }

  return (
    <DetailPageLayout title="Subscribers" subtitle={`${accounts.length} total accounts`}>
      <DataTable
        data={accounts}
        columns={columns}
        searchPlaceholder="Search by name, email, or ID..."
        searchFilter={(a, q) =>
          a.name.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.id.toLowerCase().includes(q)
        }
        filterOptions={{
          label: "Status",
          key: "status",
          values: ["active", "suspended", "pending", "cancelled"],
        }}
        defaultFilter={statusFilter}
      />
    </DetailPageLayout>
  );
}
