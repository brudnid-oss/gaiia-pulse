"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import DetailPageLayout from "@/components/DetailPageLayout";
import StatusBadge from "@/components/ui/StatusBadge";
import DetailField from "@/components/ui/DetailField";
import { Order } from "@/lib/types";
import { formatDate } from "@/lib/formatters";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then((d) => setOrder(d.order))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || !order) {
    return (
      <DetailPageLayout title="Order">
        <div className="flex items-center justify-center h-64">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-500" />
        </div>
      </DetailPageLayout>
    );
  }

  return (
    <DetailPageLayout title={`Order ${order.id}`} subtitle={order.product_name} breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Orders", href: "/orders" }]}>
      <div className="space-y-5">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
            <div>
              <h2 className="text-lg font-semibold text-zinc-100">{order.id}</h2>
              <p className="text-sm text-zinc-500">{order.product_name}</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={order.type} size="md" />
              <StatusBadge status={order.status} size="md" />
            </div>
          </div>
          <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <DetailField label="Account">
              <Link href={`/subscribers/${order.account_id}`} className="text-emerald-400 hover:text-emerald-300 transition-colors">
                {order.account_name}
              </Link>
              <span className="text-zinc-600 text-xs ml-1">({order.account_id})</span>
            </DetailField>
            <DetailField label="Type">
              <StatusBadge status={order.type} />
            </DetailField>
            <DetailField label="Status">
              <StatusBadge status={order.status} />
            </DetailField>
            <DetailField label="Product">{order.product_name}</DetailField>
            <DetailField label="Assigned To">{order.assigned_to || "Unassigned"}</DetailField>
            <DetailField label="Created">{formatDate(order.created_at)}</DetailField>
            {order.scheduled_date && (
              <DetailField label="Scheduled">{formatDate(order.scheduled_date)}</DetailField>
            )}
            {order.completed_at && (
              <DetailField label="Completed">{formatDate(order.completed_at)}</DetailField>
            )}
          </dl>
        </div>

        {order.notes && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-5">
            <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-400 mb-3">Notes</h3>
            <p className="text-sm text-zinc-300 leading-relaxed">{order.notes}</p>
          </div>
        )}
      </div>
    </DetailPageLayout>
  );
}
