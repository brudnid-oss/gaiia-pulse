import {
  KPIData,
  RevenueDataPoint,
  InvoiceStatusData,
  AccountStatusData,
  TicketStatusData,
  OrderStatusData,
  OrderTypeData,
  AccountIssue,
  InventorySummaryData,
  ARAgingBucket,
  PlanMixData,
  ResolutionTrendPoint,
  Ticket,
  Order,
} from "./types";
import * as mock from "./mock-data";

const API_URL = process.env.GAIIA_API_URL || "";
const API_TOKEN = process.env.GAIIA_API_TOKEN || "";
const USE_MOCK = process.env.USE_MOCK_DATA === "true" || !API_URL;

async function apiFetch<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${API_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: 300 },
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

async function safeCall<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  if (USE_MOCK) return fallback;
  try {
    return await fn();
  } catch {
    console.error("API call failed, using fallback");
    return fallback;
  }
}

export async function getKPIs(): Promise<KPIData> {
  return safeCall(async () => {
    const [activeCount, openTickets, inProgressTickets, pendingOrders, overdueInvoices, allAccounts] =
      await Promise.all([
        apiFetch<{ count: number }>("/accounts/count", { status: "active" }),
        apiFetch<{ count: number }>("/tickets/count", { status: "open" }),
        apiFetch<{ count: number }>("/tickets/count", { status: "in_progress" }),
        apiFetch<{ count: number }>("/orders/count", { status: "pending,in_progress" }),
        apiFetch<{ count: number }>("/invoices/count", { status: "overdue" }),
        apiFetch<{ count: number }>("/accounts/count"),
      ]);

    // Simplified MRR calculation from invoices
    const currentMonth = new Date().toISOString().slice(0, 7);
    const invoices = await apiFetch<{ data: { amount: number }[] }>("/invoices", {
      status: "paid",
      period: currentMonth,
      per_page: "1",
    });

    const disconnects = await apiFetch<{ count: number }>("/orders/count", {
      type: "disconnect",
      created_after: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
    });

    const newInstalls = await apiFetch<{ count: number }>("/orders/count", {
      type: "new_install",
      created_after: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
    });

    const mrrValue = invoices.data?.[0]?.amount || 0;
    const arpuValue = activeCount.count > 0 ? Math.round((mrrValue / activeCount.count) * 100) / 100 : 0;

    return {
      totalSubscribers: activeCount.count,
      mrr: mrrValue,
      openTickets: openTickets.count + inProgressTickets.count,
      pendingOrders: pendingOrders.count,
      overdueInvoices: overdueInvoices.count,
      overdueAmount: 0,
      churnCount: disconnects.count,
      churnRate: allAccounts.count > 0 ? (disconnects.count / allAccounts.count) * 100 : 0,
      arpu: arpuValue,
      netAdds: newInstalls.count - disconnects.count,
      newInstalls: newInstalls.count,
      disconnects: disconnects.count,
    };
  }, mock.mockKPIs);
}

export async function getRevenueHistory(): Promise<RevenueDataPoint[]> {
  return safeCall(async () => {
    const payments = await apiFetch<{ data: { amount: number; created_at: string }[] }>("/payments", {
      per_page: "1000",
      created_after: new Date(Date.now() - 365 * 86400000).toISOString(),
    });
    const byMonth: Record<string, number> = {};
    payments.data.forEach((p) => {
      const month = new Date(p.created_at).toLocaleString("en-US", { month: "short" });
      byMonth[month] = (byMonth[month] || 0) + p.amount;
    });
    return Object.entries(byMonth).map(([month, revenue]) => ({ month, revenue }));
  }, mock.mockRevenueHistory);
}

export async function getInvoiceStatus(): Promise<InvoiceStatusData[]> {
  return safeCall(async () => {
    const statuses = ["paid", "unpaid", "overdue", "void"];
    const results = await Promise.all(
      statuses.map((s) => apiFetch<{ count: number }>("/invoices/count", { status: s }))
    );
    return statuses.map((status, i) => ({
      status: status.charAt(0).toUpperCase() + status.slice(1),
      count: results[i].count,
      amount: 0,
    }));
  }, mock.mockInvoiceStatus);
}

export async function getAccountStatus(): Promise<AccountStatusData[]> {
  return safeCall(async () => {
    const statuses = ["active", "suspended", "pending", "cancelled"];
    const results = await Promise.all(
      statuses.map((s) => apiFetch<{ count: number }>("/accounts/count", { status: s }))
    );
    return statuses.map((status, i) => ({
      status: status.charAt(0).toUpperCase() + status.slice(1),
      count: results[i].count,
    }));
  }, mock.mockAccountStatus);
}

export async function getAccountIssues(): Promise<AccountIssue[]> {
  return safeCall(async () => {
    const [noPayment, suspended, overdue] = await Promise.all([
      apiFetch<{ count: number }>("/accounts/count", { payment_method: "none" }),
      apiFetch<{ count: number }>("/accounts/count", { status: "suspended" }),
      apiFetch<{ count: number }>("/invoices/count", { status: "overdue", age: "60" }),
    ]);
    return [
      { label: "No payment method on file", count: noPayment.count, severity: "warning" as const },
      { label: "Suspended accounts", count: suspended.count, severity: "critical" as const },
      { label: "Overdue balance > 60 days", count: overdue.count, severity: "critical" as const },
    ];
  }, mock.mockAccountIssues);
}

export async function getTicketStatus(): Promise<TicketStatusData[]> {
  return safeCall(async () => {
    const statuses = ["open", "in_progress", "resolved", "closed"];
    const results = await Promise.all(
      statuses.map((s) => apiFetch<{ count: number }>("/tickets/count", { status: s }))
    );
    const labels = ["Open", "In Progress", "Resolved", "Closed"];
    return statuses.map((_, i) => ({ status: labels[i], count: results[i].count }));
  }, mock.mockTicketStatus);
}

export async function getRecentTickets(): Promise<Ticket[]> {
  return safeCall(async () => {
    const res = await apiFetch<{ data: Ticket[] }>("/tickets", {
      status: "open,in_progress",
      per_page: "5",
      sort: "-created_at",
    });
    return res.data;
  }, mock.mockRecentTickets);
}

export async function getOrderStatus(): Promise<OrderStatusData[]> {
  return safeCall(async () => {
    const statuses = ["pending", "in_progress", "completed", "cancelled"];
    const results = await Promise.all(
      statuses.map((s) => apiFetch<{ count: number }>("/orders/count", { status: s }))
    );
    const labels = ["Pending", "In Progress", "Completed", "Cancelled"];
    return statuses.map((_, i) => ({ status: labels[i], count: results[i].count }));
  }, mock.mockOrderStatus);
}

export async function getOrderTypes(): Promise<OrderTypeData[]> {
  return safeCall(async () => {
    const types = ["new_install", "upgrade", "disconnect"];
    const results = await Promise.all(
      types.map((t) => apiFetch<{ count: number }>("/orders/count", { type: t }))
    );
    const labels = ["New Install", "Upgrade", "Disconnect"];
    return types.map((_, i) => ({ type: labels[i], count: results[i].count }));
  }, mock.mockOrderTypes);
}

export async function getRecentOrders(): Promise<Order[]> {
  return safeCall(async () => {
    const res = await apiFetch<{ data: Order[] }>("/orders", {
      per_page: "5",
      sort: "-created_at",
    });
    return res.data;
  }, mock.mockRecentOrders);
}

export async function getInventorySummary(): Promise<InventorySummaryData> {
  return safeCall(async () => {
    const res = await apiFetch<{ data: { type: string }[] }>("/inventory/items", {
      per_page: "5000",
    });
    const byType: Record<string, number> = {};
    res.data.forEach((item) => {
      byType[item.type] = (byType[item.type] || 0) + 1;
    });
    return {
      total: res.data.length,
      byType: Object.entries(byType).map(([type, count]) => ({ type, count })),
    };
  }, mock.mockInventory);
}

export async function getARAgingBuckets(): Promise<ARAgingBucket[]> {
  return safeCall(async () => {
    const res = await apiFetch<{ data: ARAgingBucket[] }>("/invoices/aging");
    return res.data;
  }, mock.mockARAgingBuckets);
}

export async function getPlanMix(): Promise<PlanMixData[]> {
  return safeCall(async () => {
    const res = await apiFetch<{ data: PlanMixData[] }>("/accounts/plan-mix");
    return res.data;
  }, mock.mockPlanMix);
}

export async function getResolutionTrend(): Promise<ResolutionTrendPoint[]> {
  return safeCall(async () => {
    const res = await apiFetch<{ data: ResolutionTrendPoint[] }>("/tickets/resolution-trend");
    return res.data;
  }, mock.mockResolutionTrend);
}
