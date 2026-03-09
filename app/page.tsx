"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import KPIStrip from "@/components/dashboard/KPIStrip";
import RevenueChart from "@/components/dashboard/RevenueChart";
import InvoiceBreakdown from "@/components/dashboard/InvoiceBreakdown";
import AccountHealth from "@/components/dashboard/AccountHealth";
import TicketOverview from "@/components/dashboard/TicketOverview";
import OrderPipeline from "@/components/dashboard/OrderPipeline";
import InventorySummary from "@/components/dashboard/InventorySummary";
import {
  KPIData,
  RevenueDataPoint,
  InvoiceStatusData,
  AccountStatusData,
  AccountIssue,
  TicketStatusData,
  Ticket,
  OrderStatusData,
  OrderTypeData,
  Order,
  InventorySummaryData,
} from "@/lib/types";

const REFRESH_INTERVAL = parseInt(process.env.NEXT_PUBLIC_REFRESH_INTERVAL_MS || "300000", 10);

interface DashboardData {
  kpis: KPIData | null;
  revenue: RevenueDataPoint[] | null;
  invoiceStatus: InvoiceStatusData[] | null;
  accountStatus: AccountStatusData[] | null;
  accountIssues: AccountIssue[] | null;
  ticketStatus: TicketStatusData[] | null;
  recentTickets: Ticket[] | null;
  orderStatus: OrderStatusData[] | null;
  orderTypes: OrderTypeData[] | null;
  recentOrders: Order[] | null;
  inventory: InventorySummaryData | null;
}

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.json();
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData>({
    kpis: null,
    revenue: null,
    invoiceStatus: null,
    accountStatus: null,
    accountIssues: null,
    ticketStatus: null,
    recentTickets: null,
    orderStatus: null,
    orderTypes: null,
    recentOrders: null,
    inventory: null,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      // Stagger requests slightly to avoid hammering
      const [accountsRes, invoicesRes, paymentsRes, ticketsRes, ordersRes, inventoryRes] =
        await Promise.all([
          fetchJSON<{ kpis: KPIData; status: AccountStatusData[]; issues: AccountIssue[] }>(
            "/api/accounts"
          ),
          fetchJSON<{ status: InvoiceStatusData[] }>("/api/invoices"),
          fetchJSON<{ history: RevenueDataPoint[] }>("/api/payments"),
          fetchJSON<{ status: TicketStatusData[]; recent: Ticket[] }>("/api/tickets"),
          fetchJSON<{ status: OrderStatusData[]; types: OrderTypeData[]; recent: Order[] }>(
            "/api/orders"
          ),
          fetchJSON<{ summary: InventorySummaryData }>("/api/inventory"),
        ]);

      setData({
        kpis: accountsRes.kpis,
        revenue: paymentsRes.history,
        invoiceStatus: invoicesRes.status,
        accountStatus: accountsRes.status,
        accountIssues: accountsRes.issues,
        ticketStatus: ticketsRes.status,
        recentTickets: ticketsRes.recent,
        orderStatus: ordersRes.status,
        orderTypes: ordersRes.types,
        recentOrders: ordersRes.recent,
        inventory: inventoryRes.summary,
      });
      setLastRefresh(new Date());
      setError(null);
    } catch {
      setError("Unable to connect to gaiia instance. Showing cached data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(true), REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header
        lastRefresh={lastRefresh}
        onRefresh={() => fetchData(true)}
        refreshing={refreshing}
      />

      {error && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-3">
          <div className="rounded-md border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-400">
            {error}
          </div>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-5 space-y-5">
        {/* KPI Strip */}
        <KPIStrip data={data.kpis} loading={loading} />

        {/* Revenue & Billing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <RevenueChart data={data.revenue} loading={loading} />
          <InvoiceBreakdown data={data.invoiceStatus} loading={loading} />
        </div>

        {/* Subscriber Health */}
        <AccountHealth
          statusData={data.accountStatus}
          issuesData={data.accountIssues}
          loading={loading}
        />

        {/* Operations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TicketOverview
            statusData={data.ticketStatus}
            recentTickets={data.recentTickets}
            loading={loading}
          />
          <OrderPipeline
            statusData={data.orderStatus}
            typeData={data.orderTypes}
            recentOrders={data.recentOrders}
            loading={loading}
          />
        </div>

        {/* Inventory */}
        <InventorySummary data={data.inventory} loading={loading} />

        {/* Footer */}
        <footer className="border-t border-zinc-800/50 pt-4 pb-8">
          <p className="text-center text-[10px] text-zinc-700 font-mono">
            gaiia Pulse — Powered by the gaiia API
          </p>
        </footer>
      </main>
    </div>
  );
}
