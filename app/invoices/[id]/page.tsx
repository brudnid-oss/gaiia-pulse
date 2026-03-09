"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import DetailPageLayout from "@/components/DetailPageLayout";
import StatusBadge from "@/components/ui/StatusBadge";
import DetailField from "@/components/ui/DetailField";
import { Invoice } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/formatters";

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/invoices/${id}`)
      .then((r) => r.json())
      .then((d) => setInvoice(d.invoice))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || !invoice) {
    return (
      <DetailPageLayout title="Invoice">
        <div className="flex items-center justify-center h-64">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-500" />
        </div>
      </DetailPageLayout>
    );
  }

  return (
    <DetailPageLayout title={`Invoice ${invoice.id}`} subtitle={formatCurrency(invoice.amount)} breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Invoices", href: "/invoices" }]}>
      <div className="space-y-5">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
            <div>
              <h2 className="text-lg font-semibold text-zinc-100">{invoice.id}</h2>
              <p className="text-sm text-zinc-500">{invoice.account_name}</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={invoice.status} size="md" />
              <span className="text-2xl font-mono font-semibold text-zinc-100">{formatCurrency(invoice.amount)}</span>
            </div>
          </div>
          <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <DetailField label="Account">
              <Link href={`/subscribers/${invoice.account_id}`} className="text-emerald-400 hover:text-emerald-300 transition-colors">
                {invoice.account_name}
              </Link>
              <span className="text-zinc-600 text-xs ml-1">({invoice.account_id})</span>
            </DetailField>
            <DetailField label="Status"><StatusBadge status={invoice.status} /></DetailField>
            <DetailField label="Due Date">{formatDate(invoice.due_date)}</DetailField>
            <DetailField label="Created">{formatDate(invoice.created_at)}</DetailField>
            {invoice.paid_at && (
              <DetailField label="Paid On">{formatDate(invoice.paid_at)}</DetailField>
            )}
            {invoice.payment_method && (
              <DetailField label="Payment Method">{invoice.payment_method}</DetailField>
            )}
          </dl>
        </div>

        {/* Line Items */}
        {invoice.line_items && invoice.line_items.length > 0 && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-5">
            <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-400 mb-3">Line Items</h3>
            <div className="space-y-2">
              {invoice.line_items.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-zinc-800/50 last:border-0">
                  <span className="text-sm text-zinc-300">{item.description}</span>
                  <span className="text-sm font-mono text-zinc-200">{formatCurrency(item.amount)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2 border-t border-zinc-700">
                <span className="text-sm font-medium text-zinc-200">Total</span>
                <span className="text-base font-mono font-semibold text-zinc-100">{formatCurrency(invoice.amount)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </DetailPageLayout>
  );
}
