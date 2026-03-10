"use client";

import MetricCard from "../ui/MetricCard";
import { KPIData } from "@/lib/types";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/formatters";

interface KPIStripProps {
  data: KPIData | null;
  loading: boolean;
}

export default function KPIStrip({ data, loading }: KPIStripProps) {
  if (loading || !data) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <MetricCard key={i} label="" value="" loading />
        ))}
      </div>
    );
  }

  const ticketStatus: "good" | "warning" | "critical" =
    data.openTickets < 10 ? "good" : data.openTickets <= 25 ? "warning" : "critical";

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
      <MetricCard
        label="Total Subscribers"
        value={formatNumber(data.totalSubscribers)}
        status="normal"
        href="/subscribers?status=active"
      />
      <MetricCard
        label="MRR"
        value={formatCurrency(data.mrr)}
        status="normal"
        href="/invoices?status=paid"
      />
      <MetricCard
        label="ARPU"
        value={`$${data.arpu.toFixed(2)}`}
        subValue="per subscriber"
        status="normal"
        href="/subscribers?status=active"
      />
      <MetricCard
        label="Net Subscriber Adds"
        value={`${data.netAdds >= 0 ? "+" : ""}${data.netAdds}`}
        subValue={`+${data.newInstalls} new / -${data.disconnects} churn`}
        status={data.netAdds > 0 ? "good" : data.netAdds === 0 ? "warning" : "critical"}
        href="/orders?type=new_install,disconnect"
      />
      <MetricCard
        label="Open Tickets"
        value={formatNumber(data.openTickets)}
        status={ticketStatus}
        href="/tickets?status=open"
      />
      <MetricCard
        label="Pending Orders"
        value={formatNumber(data.pendingOrders)}
        status="normal"
        href="/orders?status=pending"
      />
      <MetricCard
        label="Overdue Invoices"
        value={formatNumber(data.overdueInvoices)}
        subValue={formatCurrency(data.overdueAmount)}
        status={data.overdueInvoices > 20 ? "critical" : "warning"}
        href="/invoices?status=overdue"
      />
      <MetricCard
        label="Churn (This Month)"
        value={data.churnRate > 0 ? formatPercent(data.churnRate) : formatNumber(data.churnCount)}
        subValue={data.churnRate > 0 ? `${data.churnCount} accounts` : undefined}
        status={data.churnRate > 2 ? "critical" : data.churnRate > 1 ? "warning" : "normal"}
        href="/subscribers?status=cancelled"
      />
    </div>
  );
}
