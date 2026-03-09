"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import DetailPageLayout from "@/components/DetailPageLayout";
import DataTable, { Column } from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import { InventoryItem } from "@/lib/types";

const columns: Column<InventoryItem>[] = [
  {
    key: "id",
    label: "Device ID",
    render: (d) => <span className="font-mono text-xs text-zinc-500">{d.id}</span>,
    sortKey: (d) => d.id,
    className: "w-28",
  },
  {
    key: "type",
    label: "Type",
    render: (d) => (
      <span className="text-xs text-zinc-300 uppercase tracking-wide">
        {d.type.replace(/_/g, " ")}
      </span>
    ),
    sortKey: (d) => d.type,
  },
  {
    key: "model",
    label: "Model",
    render: (d) => <span className="text-sm text-zinc-200">{d.model}</span>,
    sortKey: (d) => d.model,
  },
  {
    key: "serial",
    label: "Serial",
    render: (d) => <span className="font-mono text-xs text-zinc-500">{d.serial_number}</span>,
    className: "hidden md:table-cell",
  },
  {
    key: "status",
    label: "Status",
    render: (d) => <StatusBadge status={d.status} />,
    sortKey: (d) => d.status,
  },
  {
    key: "assigned",
    label: "Assigned To",
    render: (d) => (
      <span className="font-mono text-xs text-zinc-500">
        {d.assigned_account_id || "—"}
      </span>
    ),
    className: "hidden lg:table-cell",
  },
];

export default function InventoryPage() {
  return (
    <Suspense fallback={
      <DetailPageLayout title="Network Inventory">
        <div className="flex items-center justify-center h-64">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-500" />
        </div>
      </DetailPageLayout>
    }>
      <InventoryContent />
    </Suspense>
  );
}

function InventoryContent() {
  const searchParams = useSearchParams();
  const typeFilter = searchParams.get("type") || "all";
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/inventory/list")
      .then((r) => r.json())
      .then((d) => setItems(d.data))
      .finally(() => setLoading(false));
  }, []);

  const provisioned = items.filter((i) => i.status === "provisioned").length;

  if (loading) {
    return (
      <DetailPageLayout title="Network Inventory">
        <div className="flex items-center justify-center h-64">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-500" />
        </div>
      </DetailPageLayout>
    );
  }

  return (
    <DetailPageLayout title="Network Inventory" subtitle={`${provisioned} provisioned · ${items.length} total`}>
      <DataTable
        data={items}
        columns={columns}
        searchPlaceholder="Search by model, serial, device ID..."
        searchFilter={(d, q) =>
          d.model.toLowerCase().includes(q) ||
          d.serial_number.toLowerCase().includes(q) ||
          d.id.toLowerCase().includes(q) ||
          (d.assigned_account_id || "").toLowerCase().includes(q)
        }
        filterOptions={{
          label: "Type",
          key: "type",
          values: ["ONT", "router", "switch", "access_point"],
        }}
        defaultFilter={typeFilter}
      />
    </DetailPageLayout>
  );
}
