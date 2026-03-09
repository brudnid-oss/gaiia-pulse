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

// ── Helpers ──────────────────────────────────────────────────────────────────

function randomDate(daysBack: number): string {
  return new Date(Date.now() - Math.random() * daysBack * 86400000).toISOString();
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
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

// ── Aggregated data (used by dashboard summary) ──────────────────────────────

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

export const mockRecentTickets: Ticket[] = mockTickets.filter(
  (t) => t.status === "open" || t.status === "in_progress"
).slice(0, 5);

export const mockRecentOrders: Order[] = mockOrders.slice(0, 5);

export const mockInventory: InventorySummaryData = {
  total: 3240,
  byType: [
    { type: "ONT", count: 2180 },
    { type: "Router", count: 640 },
    { type: "Switch", count: 280 },
    { type: "Access Point", count: 140 },
  ],
};
