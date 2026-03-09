"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import DetailPageLayout from "@/components/DetailPageLayout";
import StatusBadge from "@/components/ui/StatusBadge";
import DetailField from "@/components/ui/DetailField";
import { Account, Ticket, Order, Invoice, InventoryItem } from "@/lib/types";
import { formatCurrency, formatDate, formatRelativeTime } from "@/lib/formatters";

interface AccountDetail {
  account: Account;
  tickets: Ticket[];
  orders: Order[];
  invoices: Invoice[];
  devices: InventoryItem[];
}

export default function AccountDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<AccountDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/subscribers/${id}`)
      .then((r) => r.json())
      .then((d) => setData(d))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || !data) {
    return (
      <DetailPageLayout title="Account">
        <div className="flex items-center justify-center h-64">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-500" />
        </div>
      </DetailPageLayout>
    );
  }

  const { account: a, tickets, orders, invoices, devices } = data;

  return (
    <DetailPageLayout title={a.name} subtitle={a.id} breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Subscribers", href: "/subscribers" }]}>
      <div className="space-y-6">
        {/* Header card */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
            <div>
              <h2 className="text-xl font-semibold text-zinc-100">{a.name}</h2>
              <p className="text-sm text-zinc-500 font-mono">{a.id}</p>
            </div>
            <StatusBadge status={a.status} size="md" />
          </div>
          <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <DetailField label="Email">{a.email}</DetailField>
            <DetailField label="Phone">{a.phone || "—"}</DetailField>
            <DetailField label="Address">
              {a.address ? `${a.address}, ${a.city}, ${a.state} ${a.zip}` : "—"}
            </DetailField>
            <DetailField label="Member Since">{formatDate(a.created_at)}</DetailField>
            <DetailField label="Plan">
              <span className="text-emerald-400">{a.plan || "—"}</span>
              {a.plan_price && <span className="text-zinc-500 ml-1">{formatCurrency(a.plan_price)}/mo</span>}
            </DetailField>
            <DetailField label="Balance">
              <span className={a.balance > 0 ? "text-red-400" : "text-emerald-400"}>
                {a.balance > 0 ? formatCurrency(a.balance) : "$0.00"}
              </span>
            </DetailField>
            <DetailField label="Payment Method">
              {a.payment_method_on_file
                ? `${a.payment_method_type} •••• ${a.payment_method_last4}`
                : <span className="text-amber-500">None on file</span>}
            </DetailField>
            {a.labels && a.labels.length > 0 && (
              <DetailField label="Labels">
                <div className="flex gap-1 flex-wrap">
                  {a.labels.map((l) => (
                    <span key={l} className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400">{l}</span>
                  ))}
                </div>
              </DetailField>
            )}
            {a.cancelled_at && (
              <DetailField label="Cancelled">
                <span className="text-red-400">{formatDate(a.cancelled_at)}</span>
              </DetailField>
            )}
          </dl>
        </div>

        {/* Related data grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Tickets */}
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-400">Tickets</h3>
              <span className="text-xs font-mono text-zinc-600">{tickets.length}</span>
            </div>
            {tickets.length === 0 ? (
              <p className="text-sm text-zinc-600">No tickets</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {tickets.map((t) => (
                  <Link key={t.id} href={`/tickets/${t.id}`} className="flex items-start justify-between gap-2 rounded-md border border-zinc-800/50 px-3 py-2 hover:border-zinc-700 transition-colors">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-mono text-zinc-600">{t.id}</span>
                        <StatusBadge status={t.status} />
                        <StatusBadge status={t.priority} />
                      </div>
                      <p className="text-xs text-zinc-300 truncate">{t.subject}</p>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-600 whitespace-nowrap">{formatRelativeTime(t.created_at)}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Invoices */}
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-400">Invoices</h3>
              <span className="text-xs font-mono text-zinc-600">{invoices.length}</span>
            </div>
            {invoices.length === 0 ? (
              <p className="text-sm text-zinc-600">No invoices</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {invoices.map((inv) => (
                  <Link key={inv.id} href={`/invoices/${inv.id}`} className="flex items-center justify-between gap-2 rounded-md border border-zinc-800/50 px-3 py-2 hover:border-zinc-700 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-zinc-600">{inv.id}</span>
                      <StatusBadge status={inv.status} />
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-mono text-zinc-200">{formatCurrency(inv.amount)}</span>
                      <span className="text-[10px] text-zinc-600 ml-2">{formatDate(inv.due_date)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Orders */}
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-400">Orders</h3>
              <span className="text-xs font-mono text-zinc-600">{orders.length}</span>
            </div>
            {orders.length === 0 ? (
              <p className="text-sm text-zinc-600">No orders</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {orders.map((o) => (
                  <Link key={o.id} href={`/orders/${o.id}`} className="flex items-start justify-between gap-2 rounded-md border border-zinc-800/50 px-3 py-2 hover:border-zinc-700 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-zinc-600">{o.id}</span>
                      <StatusBadge status={o.type} />
                      <StatusBadge status={o.status} />
                    </div>
                    <span className="text-xs text-zinc-400">{o.product_name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Devices */}
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-400">Devices</h3>
              <span className="text-xs font-mono text-zinc-600">{devices.length}</span>
            </div>
            {devices.length === 0 ? (
              <p className="text-sm text-zinc-600">No devices assigned</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {devices.map((d) => (
                  <div key={d.id} className="flex items-center justify-between gap-2 rounded-md border border-zinc-800/50 px-3 py-2">
                    <div>
                      <span className="text-xs text-zinc-300 uppercase">{d.type.replace(/_/g, " ")}</span>
                      <span className="text-xs text-zinc-500 ml-2">{d.model}</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-600">{d.serial_number}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DetailPageLayout>
  );
}
