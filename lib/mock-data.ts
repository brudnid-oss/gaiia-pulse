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
  Ticket,
  Order,
} from "./types";

export const mockKPIs: KPIData = {
  totalSubscribers: 2100,
  mrr: 175420,
  openTickets: 35,
  pendingOrders: 20,
  overdueInvoices: 45,
  overdueAmount: 12340,
  churnCount: 18,
  churnRate: 0.86,
};

export const mockRevenueHistory: RevenueDataPoint[] = (() => {
  const months = [
    "Apr", "May", "Jun", "Jul", "Aug", "Sep",
    "Oct", "Nov", "Dec", "Jan", "Feb", "Mar",
  ];
  let revenue = 131000;
  return months.map((month) => {
    revenue = Math.round(revenue * (1 + 0.04 + Math.random() * 0.02));
    return { month, revenue };
  });
})();

export const mockInvoiceStatus: InvoiceStatusData[] = [
  { status: "Paid", count: 1870, amount: 148900 },
  { status: "Unpaid", count: 176, amount: 14200 },
  { status: "Overdue", count: 110, amount: 12340 },
  { status: "Void", count: 44, amount: 3520 },
];

export const mockAccountStatus: AccountStatusData[] = [
  { status: "Active", count: 2100 },
  { status: "Suspended", count: 150 },
  { status: "Pending", count: 100 },
  { status: "Cancelled", count: 150 },
];

export const mockTicketStatus: TicketStatusData[] = [
  { status: "Open", count: 35 },
  { status: "In Progress", count: 15 },
  { status: "Resolved", count: 128 },
  { status: "Closed", count: 412 },
];

export const mockOrderStatus: OrderStatusData[] = [
  { status: "Pending", count: 12 },
  { status: "In Progress", count: 8 },
  { status: "Completed", count: 156 },
  { status: "Cancelled", count: 14 },
];

export const mockOrderTypes: OrderTypeData[] = [
  { type: "New Install", count: 14 },
  { type: "Upgrade", count: 4 },
  { type: "Disconnect", count: 2 },
];

export const mockAccountIssues: AccountIssue[] = [
  { label: "No payment method on file", count: 23, severity: "warning" },
  { label: "Suspended accounts", count: 150, severity: "critical" },
  { label: "Overdue balance > 60 days", count: 18, severity: "critical" },
  { label: "Failed auto-pay last cycle", count: 9, severity: "warning" },
];

export const mockRecentTickets: Ticket[] = [
  {
    id: "TK-1042",
    account_id: "ACC-391",
    account_name: "Martinez Household",
    subject: "Intermittent connection drops since Tuesday",
    status: "open",
    priority: "high",
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: "TK-1041",
    account_id: "ACC-1205",
    account_name: "Greenfield Apartments",
    subject: "Request to upgrade to 1Gbps plan",
    status: "open",
    priority: "medium",
    created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
  {
    id: "TK-1040",
    account_id: "ACC-887",
    account_name: "Chen Family",
    subject: "ONT light blinking red — no internet",
    status: "in_progress",
    priority: "critical",
    created_at: new Date(Date.now() - 8 * 3600000).toISOString(),
  },
  {
    id: "TK-1039",
    account_id: "ACC-2044",
    account_name: "Riverside Business Center",
    subject: "Billing discrepancy on February invoice",
    status: "open",
    priority: "medium",
    created_at: new Date(Date.now() - 14 * 3600000).toISOString(),
  },
  {
    id: "TK-1038",
    account_id: "ACC-562",
    account_name: "Dawson Residence",
    subject: "Slow speeds during peak hours",
    status: "open",
    priority: "high",
    created_at: new Date(Date.now() - 22 * 3600000).toISOString(),
  },
];

export const mockRecentOrders: Order[] = [
  {
    id: "ORD-3021",
    account_id: "ACC-2501",
    account_name: "New signup — J. Thompson",
    type: "new_install",
    status: "pending",
    created_at: new Date(Date.now() - 1 * 3600000).toISOString(),
    product_name: "Fiber 500 Mbps",
  },
  {
    id: "ORD-3020",
    account_id: "ACC-1102",
    account_name: "Williams Family",
    type: "upgrade",
    status: "in_progress",
    created_at: new Date(Date.now() - 4 * 3600000).toISOString(),
    product_name: "Fiber 1 Gbps",
  },
  {
    id: "ORD-3019",
    account_id: "ACC-2499",
    account_name: "New signup — Oakwood HOA",
    type: "new_install",
    status: "pending",
    created_at: new Date(Date.now() - 6 * 3600000).toISOString(),
    product_name: "Fiber 250 Mbps",
  },
  {
    id: "ORD-3018",
    account_id: "ACC-743",
    account_name: "Patel Household",
    type: "disconnect",
    status: "pending",
    created_at: new Date(Date.now() - 12 * 3600000).toISOString(),
    product_name: "Fiber 500 Mbps",
  },
  {
    id: "ORD-3017",
    account_id: "ACC-2498",
    account_name: "New signup — L. Garcia",
    type: "new_install",
    status: "in_progress",
    created_at: new Date(Date.now() - 18 * 3600000).toISOString(),
    product_name: "Fiber 1 Gbps",
  },
];

export const mockInventory: InventorySummaryData = {
  total: 3240,
  byType: [
    { type: "ONT", count: 2180 },
    { type: "Router", count: 640 },
    { type: "Switch", count: 280 },
    { type: "Access Point", count: 140 },
  ],
};
