"use client";

import { useState, useEffect } from "react";
import DetailPageLayout from "@/components/DetailPageLayout";
import DataTable, { Column } from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import { Invoice } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/formatters";

const columns: Column<Invoice>[] = [
  {
    key: "id",
    label: "Invoice",
    render: (inv) => <span className="font-mono text-xs text-zinc-500">{inv.id}</span>,
    sortKey: (inv) => inv.id,
    className: "w-28",
  },
  {
    key: "account",
    label: "Account",
    render: (inv) => (
      <div className="min-w-0">
        <p className="text-zinc-200 truncate max-w-xs">{inv.account_name}</p>
        <p className="text-[10px] text-zinc-600">{inv.account_id}</p>
      </div>
    ),
    sortKey: (inv) => inv.account_name,
  },
  {
    key: "amount",
    label: "Amount",
    render: (inv) => <span className="font-mono text-sm text-zinc-200">{formatCurrency(inv.amount)}</span>,
    sortKey: (inv) => inv.amount,
    className: "text-right",
  },
  {
    key: "status",
    label: "Status",
    render: (inv) => <StatusBadge status={inv.status} />,
    sortKey: (inv) => inv.status,
  },
  {
    key: "due",
    label: "Due Date",
    render: (inv) => <span className="text-xs text-zinc-500 font-mono">{formatDate(inv.due_date)}</span>,
    sortKey: (inv) => inv.due_date,
    className: "hidden md:table-cell",
  },
  {
    key: "paid",
    label: "Paid",
    render: (inv) => (
      <span className="text-xs text-zinc-500 font-mono">
        {inv.paid_at ? formatDate(inv.paid_at) : "—"}
      </span>
    ),
    className: "hidden lg:table-cell",
  },
];

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/invoices/list")
      .then((r) => r.json())
      .then((d) => setInvoices(d.data))
      .finally(() => setLoading(false));
  }, []);

  const overdueCount = invoices.filter((i) => i.status === "overdue").length;
  const overdueAmount = invoices.filter((i) => i.status === "overdue").reduce((sum, i) => sum + i.amount, 0);

  if (loading) {
    return (
      <DetailPageLayout title="Invoices">
        <div className="flex items-center justify-center h-64">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-500" />
        </div>
      </DetailPageLayout>
    );
  }

  return (
    <DetailPageLayout
      title="Invoices"
      subtitle={`${overdueCount} overdue (${formatCurrency(overdueAmount)}) · ${invoices.length} total`}
    >
      <DataTable
        data={invoices}
        columns={columns}
        searchPlaceholder="Search by account, invoice ID..."
        searchFilter={(inv, q) =>
          inv.account_name.toLowerCase().includes(q) ||
          inv.id.toLowerCase().includes(q) ||
          inv.account_id.toLowerCase().includes(q)
        }
        filterOptions={{
          label: "Status",
          key: "status",
          values: ["paid", "unpaid", "overdue", "void"],
        }}
      />
    </DetailPageLayout>
  );
}
