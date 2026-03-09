import {
  Account,
  Invoice,
  Ticket,
  Order,
  InventoryItem,
  KPIData,
  RevenueDataPoint,
  InvoiceStatusData,
  AccountStatusData,
  TicketStatusData,
  OrderStatusData,
  OrderTypeData,
  AccountIssue,
  InventorySummaryData,
} from "./types";

// ── Seeded RNG (stable across runs) ──────────────────────────────────────────

let _seed = 42;
function seededRandom(): number {
  _seed = (_seed * 16807 + 0) % 2147483647;
  return (_seed - 1) / 2147483646;
}

function randomDate(daysBack: number): string {
  return new Date(Date.now() - seededRandom() * daysBack * 86400000).toISOString();
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(seededRandom() * arr.length)];
}

const firstNames = [
  "James","Maria","Robert","Jennifer","Michael","Linda","William","Patricia",
  "David","Elizabeth","Richard","Susan","Joseph","Jessica","Thomas","Sarah",
  "Charles","Karen","Christopher","Lisa","Daniel","Nancy","Matthew","Betty",
  "Anthony","Margaret","Mark","Sandra","Steven","Ashley","Paul","Dorothy",
  "Andrew","Kimberly","Joshua","Emily","Kenneth","Donna","Kevin","Michelle",
  "Brian","Carol","George","Amanda","Timothy","Melissa","Ronald","Deborah",
  "Edward","Stephanie","Jason","Rebecca","Jeffrey","Sharon","Ryan","Laura",
];

const lastNames = [
  "Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis",
  "Rodriguez","Martinez","Hernandez","Lopez","Gonzalez","Wilson","Anderson",
  "Thomas","Taylor","Moore","Jackson","Martin","Lee","Perez","Thompson",
  "White","Harris","Sanchez","Clark","Ramirez","Lewis","Robinson","Walker",
  "Young","Allen","King","Wright","Scott","Torres","Nguyen","Hill","Flores",
  "Green","Adams","Nelson","Baker","Hall","Rivera","Campbell","Mitchell",
  "Carter","Roberts","Chen","Patel","Kim","Shah","Singh","Park","Reyes",
];

const plans = ["Fiber 100 Mbps", "Fiber 250 Mbps", "Fiber 500 Mbps", "Fiber 1 Gbps", "Fiber 2 Gbps"];
const planPrices: Record<string, number> = {
  "Fiber 100 Mbps": 49, "Fiber 250 Mbps": 69, "Fiber 500 Mbps": 89, "Fiber 1 Gbps": 109, "Fiber 2 Gbps": 149,
};

const ticketSubjects = [
  "Intermittent connection drops",
  "Slow speeds during peak hours",
  "ONT light blinking red — no internet",
  "Request to upgrade plan",
  "Billing discrepancy on invoice",
  "Cannot connect new device to Wi-Fi",
  "Request for static IP address",
  "Service outage after storm",
  "Router not broadcasting 5GHz band",
  "Need to reschedule installation",
  "Account billing address change",
  "Speed test not matching plan",
  "Frequent DNS resolution failures",
  "TV streaming buffering issues",
  "Request for service downgrade",
  "Payment not reflected on account",
  "Need technician visit for wiring",
  "Ethernet port not working on ONT",
  "Request to add second access point",
  "Latency spikes during gaming",
];

const deviceModels: Record<string, string[]> = {
  ONT: ["Nokia G-010G-T", "Calix 716GE-I", "Zhone 2426", "Adtran 411"],
  router: ["TP-Link AX6000", "Ubiquiti Dream Machine", "Eero Pro 6E", "Calix GigaSpire"],
  switch: ["Ubiquiti USW-24-POE", "Aruba 2530-24G", "Netgear GS724T"],
  access_point: ["Ubiquiti U6-Pro", "Ruckus R550", "Aruba AP-505"],
};

// ── Full Account List ────────────────────────────────────────────────────────

function generateAccounts(): Account[] {
  const accounts: Account[] = [];
  const statusDist: Account["status"][] = [
    ...Array(2100).fill("active"),
    ...Array(150).fill("suspended"),
    ...Array(100).fill("pending"),
    ...Array(150).fill("cancelled"),
  ];

  for (let i = 0; i < statusDist.length; i++) {
    const first = pick(firstNames);
    const last = pick(lastNames);
    const status = statusDist[i];
    accounts.push({
      id: `ACC-${String(i + 1).padStart(4, "0")}`,
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@example.com`,
      status,
      created_at: randomDate(730),
      cancelled_at: status === "cancelled" ? randomDate(90) : undefined,
      balance: status === "suspended" ? Math.round(Math.random() * 300 + 50) :
               status === "active" ? (Math.random() > 0.85 ? Math.round(Math.random() * 200) : 0) : 0,
      payment_method_on_file: status === "active" ? Math.random() > 0.01 : Math.random() > 0.3,
    });
  }
  return accounts;
}

export const mockAccounts: Account[] = generateAccounts();

// ── Full Ticket List ─────────────────────────────────────────────────────────

function generateTickets(): Ticket[] {
  const tickets: Ticket[] = [];
  const statuses: Ticket["status"][] = [
    ...Array(35).fill("open"),
    ...Array(15).fill("in_progress"),
    ...Array(128).fill("resolved"),
    ...Array(412).fill("closed"),
  ];

  for (let i = 0; i < statuses.length; i++) {
    const status = statuses[i];
    const acc = pick(mockAccounts.filter((a) => a.status === "active"));
    const created = status === "open" || status === "in_progress"
      ? randomDate(14)
      : randomDate(180);
    tickets.push({
      id: `TK-${String(1000 + statuses.length - i).padStart(4, "0")}`,
      account_id: acc.id,
      account_name: acc.name,
      subject: pick(ticketSubjects),
      status,
      priority: pick(["low", "medium", "medium", "high", "high", "critical"]),
      created_at: created,
      resolved_at: status === "resolved" || status === "closed"
        ? new Date(new Date(created).getTime() + Math.random() * 7 * 86400000).toISOString()
        : undefined,
    });
  }
  return tickets.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export const mockTickets: Ticket[] = generateTickets();

// ── Full Order List ──────────────────────────────────────────────────────────

function generateOrders(): Order[] {
  const orders: Order[] = [];
  const statuses: Order["status"][] = [
    ...Array(12).fill("pending"),
    ...Array(8).fill("in_progress"),
    ...Array(156).fill("completed"),
    ...Array(14).fill("cancelled"),
  ];

  for (let i = 0; i < statuses.length; i++) {
    const status = statuses[i];
    const acc = pick(mockAccounts);
    const type: Order["type"] = status === "pending" || status === "in_progress"
      ? pick(["new_install", "new_install", "new_install", "upgrade", "disconnect"])
      : pick(["new_install", "upgrade", "downgrade", "disconnect"]);
    const product = pick(plans);
    const created = status === "pending" || status === "in_progress"
      ? randomDate(14)
      : randomDate(365);
    orders.push({
      id: `ORD-${String(3000 + statuses.length - i).padStart(4, "0")}`,
      account_id: acc.id,
      account_name: type === "new_install" ? `New signup — ${acc.name}` : acc.name,
      type,
      status,
      created_at: created,
      completed_at: status === "completed"
        ? new Date(new Date(created).getTime() + Math.random() * 14 * 86400000).toISOString()
        : undefined,
      product_name: product,
    });
  }
  return orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export const mockOrders: Order[] = generateOrders();

// ── Full Invoice List ────────────────────────────────────────────────────────

function generateInvoices(): Invoice[] {
  const invoices: Invoice[] = [];
  const activeAccounts = mockAccounts.filter((a) => a.status === "active" || a.status === "suspended");
  let invNum = 10000;

  for (const acc of activeAccounts) {
    const plan = pick(plans);
    const price = planPrices[plan];
    // Generate 1-3 invoices per account
    const count = Math.random() > 0.5 ? 1 : Math.random() > 0.5 ? 2 : 3;
    for (let m = 0; m < count; m++) {
      const dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() - m);
      dueDate.setDate(1);
      const rand = Math.random();
      let status: Invoice["status"];
      if (m >= 1) {
        status = rand > 0.05 ? "paid" : "void";
      } else {
        status = rand > 0.15 ? "paid" : rand > 0.07 ? "unpaid" : rand > 0.02 ? "overdue" : "void";
      }
      invoices.push({
        id: `INV-${invNum++}`,
        account_id: acc.id,
        account_name: acc.name,
        amount: price,
        status,
        due_date: dueDate.toISOString(),
        paid_at: status === "paid" ? new Date(dueDate.getTime() + Math.random() * 25 * 86400000).toISOString() : undefined,
        created_at: new Date(dueDate.getTime() - 15 * 86400000).toISOString(),
      });
    }
  }
  return invoices.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export const mockInvoices: Invoice[] = generateInvoices();

// ── Full Inventory List ──────────────────────────────────────────────────────

function generateInventory(): InventoryItem[] {
  const items: InventoryItem[] = [];
  const typeDist: InventoryItem["type"][] = [
    ...Array(2180).fill("ONT"),
    ...Array(640).fill("router"),
    ...Array(280).fill("switch"),
    ...Array(140).fill("access_point"),
  ];
  const activeIds = mockAccounts.filter((a) => a.status === "active").map((a) => a.id);

  for (let i = 0; i < typeDist.length; i++) {
    const type = typeDist[i];
    const typeKey = type === "access_point" ? "access_point" : type;
    const models = deviceModels[typeKey] || deviceModels["access_point"];
    const isProvisioned = i < activeIds.length && (type === "ONT" || Math.random() > 0.3);
    items.push({
      id: `DEV-${String(i + 1).padStart(5, "0")}`,
      type,
      model: pick(models),
      status: isProvisioned ? "provisioned" : pick(["available", "available", "available", "defective", "retired"]),
      serial_number: `SN${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      assigned_account_id: isProvisioned ? activeIds[i % activeIds.length] : undefined,
    });
  }
  return items;
}

export const mockInventoryItems: InventoryItem[] = generateInventory();

// ── Aggregated data (ALL derived from generated lists — single source of truth)

function countBy<T>(arr: T[], key: keyof T): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of arr) {
    const val = String(item[key]);
    counts[val] = (counts[val] || 0) + 1;
  }
  return counts;
}

function sumBy<T>(arr: T[], amountKey: keyof T): number {
  return arr.reduce((sum, item) => sum + (Number(item[amountKey]) || 0), 0);
}

// Account counts
const accountsByStatus = countBy(mockAccounts, "status");
const activeCount = accountsByStatus["active"] || 0;
const cancelledCount = accountsByStatus["cancelled"] || 0;
const suspendedCount = accountsByStatus["suspended"] || 0;
const pendingAccountCount = accountsByStatus["pending"] || 0;
const noPaymentCount = mockAccounts.filter((a) => a.status === "active" && !a.payment_method_on_file).length;

// Ticket counts
const ticketsByStatus = countBy(mockTickets, "status");
const openTicketCount = ticketsByStatus["open"] || 0;
const inProgressTicketCount = ticketsByStatus["in_progress"] || 0;
const resolvedTicketCount = ticketsByStatus["resolved"] || 0;
const closedTicketCount = ticketsByStatus["closed"] || 0;

// Order counts
const ordersByStatus = countBy(mockOrders, "status");
const pendingOrderCount = ordersByStatus["pending"] || 0;
const inProgressOrderCount = ordersByStatus["in_progress"] || 0;
const completedOrderCount = ordersByStatus["completed"] || 0;
const cancelledOrderCount = ordersByStatus["cancelled"] || 0;

const activeOrders = mockOrders.filter((o) => o.status === "pending" || o.status === "in_progress");
const ordersByType = countBy(activeOrders, "type");

// Invoice counts
const invoicesByStatus = countBy(mockInvoices, "status");
const paidInvoices = mockInvoices.filter((i) => i.status === "paid");
const unpaidInvoices = mockInvoices.filter((i) => i.status === "unpaid");
const overdueInvoices = mockInvoices.filter((i) => i.status === "overdue");
const voidInvoices = mockInvoices.filter((i) => i.status === "void");
const overdueAmount = sumBy(overdueInvoices, "amount");

// MRR: average of paid invoices this month (simplified)
const mrr = Math.round(sumBy(paidInvoices.slice(0, activeCount), "amount") / Math.max(paidInvoices.length / activeCount, 1));

// Inventory counts
const inventoryByType = countBy(mockInventoryItems, "type");

export const mockKPIs: KPIData = {
  totalSubscribers: activeCount,
  mrr: mrr || 175420,
  openTickets: openTicketCount + inProgressTicketCount,
  pendingOrders: pendingOrderCount + inProgressOrderCount,
  overdueInvoices: overdueInvoices.length,
  overdueAmount: overdueAmount,
  churnCount: cancelledCount,
  churnRate: Number(((cancelledCount / (activeCount + cancelledCount)) * 100).toFixed(1)),
};

export const mockRevenueHistory: RevenueDataPoint[] = (() => {
  const months = [
    "Apr", "May", "Jun", "Jul", "Aug", "Sep",
    "Oct", "Nov", "Dec", "Jan", "Feb", "Mar",
  ];
  let revenue = 131000;
  return months.map((month) => {
    revenue = Math.round(revenue * (1 + 0.04 + seededRandom() * 0.02));
    return { month, revenue };
  });
})();

export const mockInvoiceStatus: InvoiceStatusData[] = [
  { status: "Paid", count: paidInvoices.length, amount: sumBy(paidInvoices, "amount") },
  { status: "Unpaid", count: unpaidInvoices.length, amount: sumBy(unpaidInvoices, "amount") },
  { status: "Overdue", count: overdueInvoices.length, amount: overdueAmount },
  { status: "Void", count: voidInvoices.length, amount: sumBy(voidInvoices, "amount") },
];

export const mockAccountStatus: AccountStatusData[] = [
  { status: "Active", count: activeCount },
  { status: "Suspended", count: suspendedCount },
  { status: "Pending", count: pendingAccountCount },
  { status: "Cancelled", count: cancelledCount },
];

export const mockTicketStatus: TicketStatusData[] = [
  { status: "Open", count: openTicketCount },
  { status: "In Progress", count: inProgressTicketCount },
  { status: "Resolved", count: resolvedTicketCount },
  { status: "Closed", count: closedTicketCount },
];

export const mockOrderStatus: OrderStatusData[] = [
  { status: "Pending", count: pendingOrderCount },
  { status: "In Progress", count: inProgressOrderCount },
  { status: "Completed", count: completedOrderCount },
  { status: "Cancelled", count: cancelledOrderCount },
];

export const mockOrderTypes: OrderTypeData[] = [
  { type: "New Install", count: ordersByType["new_install"] || 0 },
  { type: "Upgrade", count: ordersByType["upgrade"] || 0 },
  { type: "Disconnect", count: ordersByType["disconnect"] || 0 },
];

export const mockAccountIssues: AccountIssue[] = [
  { label: "No payment method on file", count: noPaymentCount, severity: "warning" as const },
  { label: "Suspended accounts", count: suspendedCount, severity: "critical" as const },
  { label: "Overdue balance > 60 days", count: overdueInvoices.length, severity: "critical" as const },
];

export const mockRecentTickets: Ticket[] = mockTickets.filter(
  (t) => t.status === "open" || t.status === "in_progress"
).slice(0, 5);

export const mockRecentOrders: Order[] = mockOrders.slice(0, 5);

export const mockInventory: InventorySummaryData = {
  total: mockInventoryItems.length,
  byType: [
    { type: "ONT", count: inventoryByType["ONT"] || 0 },
    { type: "Router", count: inventoryByType["router"] || 0 },
    { type: "Switch", count: inventoryByType["switch"] || 0 },
    { type: "Access Point", count: inventoryByType["access_point"] || 0 },
  ],
};
