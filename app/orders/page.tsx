"use client";

import { useState, useEffect } from "react";
import DetailPageLayout from "@/components/DetailPageLayout";
import DataTable, { Column } from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import { Order } from "@/lib/types";
import { formatRelativeTime } from "@/lib/formatters";

const columns: Column<Order>[] = [
  {
    key: "id",
    label: "ID",
    render: (o) => <span className="font-mono text-xs text-zinc-500">{o.id}</span>,
    sortKey: (o) => o.id,
    className: "w-24",
  },
  {
    key: "account",
    label: "Account",
    render: (o) => (
      <div className="min-w-0">
        <p className="text-zinc-200 truncate max-w-xs">{o.account_name}</p>
        <p className="text-[10px] text-zinc-600">{o.account_id}</p>
      </div>
    ),
    sortKey: (o) => o.account_name,
  },
  {
    key: "type",
    label: "Type",
    render: (o) => <StatusBadge status={o.type} />,
    sortKey: (o) => o.type,
  },
  {
    key: "status",
    label: "Status",
    render: (o) => <StatusBadge status={o.status} />,
    sortKey: (o) => o.status,
  },
  {
    key: "product",
    label: "Product",
    render: (o) => <span className="text-xs text-zinc-400">{o.product_name}</span>,
    className: "hidden md:table-cell",
  },
  {
    key: "created",
    label: "Created",
    render: (o) => <span className="text-xs text-zinc-500 font-mono">{formatRelativeTime(o.created_at)}</span>,
    sortKey: (o) => o.created_at,
  },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders/list")
      .then((r) => r.json())
      .then((d) => setOrders(d.data))
      .finally(() => setLoading(false));
  }, []);

  const pendingCount = orders.filter((o) => o.status === "pending" || o.status === "in_progress").length;

  if (loading) {
    return (
      <DetailPageLayout title="Orders">
        <div className="flex items-center justify-center h-64">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-500" />
        </div>
      </DetailPageLayout>
    );
  }

  return (
    <DetailPageLayout title="Order Pipeline" subtitle={`${pendingCount} active · ${orders.length} total`}>
      <DataTable
        data={orders}
        columns={columns}
        searchPlaceholder="Search by account, product, or ID..."
        searchFilter={(o, q) =>
          o.account_name.toLowerCase().includes(q) ||
          o.product_name.toLowerCase().includes(q) ||
          o.id.toLowerCase().includes(q)
        }
        filterOptions={{
          label: "Status",
          key: "status",
          values: ["pending", "in_progress", "completed", "cancelled"],
        }}
      />
    </DetailPageLayout>
  );
}
