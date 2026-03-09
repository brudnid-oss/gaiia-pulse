import {
  Account,
  Invoice,
  Ticket,
  TicketComment,
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

const streets = [
  "Oak St", "Maple Ave", "Cedar Ln", "Pine Dr", "Elm Blvd", "Birch Ct",
  "Walnut Way", "Spruce Rd", "Ash Pl", "Willow Cir", "Main St", "Park Ave",
  "Lake Dr", "River Rd", "Hill St", "Valley View", "Sunset Blvd", "Highland Ave",
];
const cities = [
  "Springfield", "Riverside", "Fairview", "Georgetown", "Brookfield",
  "Lakewood", "Greenville", "Maplewood", "Cedarville", "Hillcrest",
];
const states = ["CA", "TX", "FL", "NY", "IL", "PA", "OH", "GA", "NC", "MI"];

const ticketCategories = [
  "Network Issue", "Billing", "Service Request", "Equipment", "Installation", "Account Management",
];
const ticketDescriptions: Record<string, string> = {
  "Intermittent connection drops": "Customer reports that their internet connection drops multiple times per day, usually lasting 2-5 minutes each time. They've restarted the router and ONT with no improvement. Issue started approximately one week ago. Customer works from home and this is significantly impacting their productivity.",
  "Slow speeds during peak hours": "Customer is experiencing significantly reduced speeds between 6 PM and 11 PM. Speed tests show ~50 Mbps down during peak vs. their subscribed 500 Mbps plan. Off-peak speeds are normal. Customer has tested with both Wi-Fi and direct Ethernet connection to ONT — same results.",
  "ONT light blinking red — no internet": "Customer reports the PON light on their ONT is blinking red and they have no internet connectivity. All other lights appear normal. No known outages in the area. Customer has power-cycled the ONT twice with no change. Issue began this morning.",
  "Request to upgrade plan": "Customer would like to upgrade from their current plan to a higher tier. They've been experiencing that their current speeds are insufficient for their household of 5 with multiple streaming devices and remote work.",
  "Billing discrepancy on invoice": "Customer noticed a charge on their latest invoice that doesn't match their plan rate. They believe they were charged for a higher tier plan than what they're subscribed to. Requesting review and adjustment if needed.",
  "Cannot connect new device to Wi-Fi": "Customer purchased a new laptop and is unable to connect it to their Wi-Fi network. All other devices are working fine. They've tried entering the password multiple times and also tried connecting to both 2.4 GHz and 5 GHz bands.",
  "Request for static IP address": "Business customer requesting a static IP address for hosting purposes. They need to run a small server for their business application. Requesting information on pricing and provisioning timeline.",
  "Service outage after storm": "Customer lost internet service after last night's thunderstorm. ONT appears to have power but no connectivity lights. Neighbors on the same street are also reporting issues. Possible fiber cut or equipment damage at the node.",
  "Router not broadcasting 5GHz band": "Customer reports that their router's 5 GHz network has disappeared from the available networks list. The 2.4 GHz band is still working. They haven't changed any settings. Router was provided by us during installation.",
  "Need to reschedule installation": "New customer needs to reschedule their fiber installation appointment from this Thursday to next week. They have a conflict with their current appointment time. Requesting available slots for Monday through Wednesday.",
  "Account billing address change": "Customer has moved within our service area and needs their billing address updated. Service address remains the same. New billing address provided via secure form.",
  "Speed test not matching plan": "Customer on our 1 Gbps plan is consistently seeing speeds of only 200-300 Mbps on speed tests. They're testing via Ethernet directly connected to the ONT. This has been ongoing for about two weeks.",
  "Frequent DNS resolution failures": "Customer experiencing intermittent DNS resolution failures causing websites to fail to load. Issue resolves temporarily when they manually set DNS to 8.8.8.8 but reverts after router restart. Affecting all devices on the network.",
  "TV streaming buffering issues": "Customer reports constant buffering when streaming 4K content on Netflix and YouTube TV. They're on a 500 Mbps plan. Regular browsing and downloads work fine. Issue is consistent across multiple streaming devices.",
  "Request for service downgrade": "Customer would like to downgrade from Fiber 1 Gbps to Fiber 250 Mbps to reduce their monthly bill. They feel the lower tier is sufficient for their current usage. Requesting effective date for next billing cycle.",
  "Payment not reflected on account": "Customer made a payment 5 business days ago but it's still not reflected on their account balance. They paid via bank transfer and have confirmation from their bank. Payment reference number provided.",
  "Need technician visit for wiring": "Customer needs internal wiring work done. They'd like to add an Ethernet run from their living room to their home office, approximately 50 feet. Requesting a technician visit to assess and complete the work.",
  "Ethernet port not working on ONT": "Customer reports that port 2 on their ONT has stopped working. Port 1 still works fine. They've tried multiple cables and devices on port 2 with no success. ONT model is Nokia G-010G-T.",
  "Request to add second access point": "Customer has a large home and is experiencing weak Wi-Fi signal in their upstairs bedrooms. They'd like to add a second access point. Requesting options and pricing for mesh extension.",
  "Latency spikes during gaming": "Customer experiencing latency spikes of 200-500ms while gaming online, occurring every few minutes. Normal latency is around 10-15ms. Issue is consistent across multiple games and gaming platforms. Wired connection directly to ONT.",
};

const agentNames = ["Alex Rivera", "Sam Chen", "Jordan Park", "Morgan Lee", "Taylor Kim", "Casey Nguyen"];

const commentTemplates = {
  agent: [
    "I've reviewed the account and can see the issue. Let me escalate this to our network team for further investigation.",
    "I've run a diagnostic on the line and everything looks clean from our end. Can you confirm if the issue is still occurring?",
    "I've scheduled a technician visit for this. You should receive a confirmation email shortly with the appointment details.",
    "I've applied a credit to the account for the inconvenience. The adjustment will appear on your next invoice.",
    "I've updated the account settings as requested. The changes should take effect within the next 15 minutes.",
    "Our network team has identified and resolved an issue at the local node. Please let us know if you're still experiencing problems.",
    "I've checked our monitoring tools and can confirm there was a brief outage in your area. Service has been restored.",
  ],
  customer: [
    "Thank you for looking into this. The issue is still happening as of this morning.",
    "That seems to have fixed it! Everything is working great now. Thanks for the quick response.",
    "I've restarted the equipment as suggested but the problem persists. What should I try next?",
    "The technician came by and fixed the issue. Internet is back to normal speeds. Thank you!",
    "I'm still seeing the same problem. Is there anything else we can try?",
    "Just wanted to confirm — the credit showed up on my account. Appreciate the help!",
  ],
  system: [
    "Ticket automatically escalated due to SLA threshold.",
    "Status changed from Open to In Progress.",
    "Technician dispatch scheduled.",
    "Customer contacted via email — awaiting response.",
    "Network diagnostic completed — no issues detected on trunk line.",
  ],
};

const orderNotes = [
  "Customer prefers morning installation window (8 AM - 12 PM).",
  "Building requires access code: #4521. Contact property manager if issues.",
  "Underground conduit already in place from previous provider.",
  "Customer requested specific router model — Ubiquiti Dream Machine.",
  "Multi-dwelling unit — fiber already terminated in utility room.",
  "Customer will be working from home, needs minimal downtime.",
  "Previous installation attempt failed due to access issue — rescheduled.",
  "Aerial fiber drop required — pole attachment permit obtained.",
];

const techNames = ["Mike Torres", "Sarah Kim", "Dave Patel", "Lisa Chen", "Tom Rivera", "Amy Nguyen"];

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
    const plan = pick(plans);
    const hasPayment = status === "active" ? seededRandom() > 0.01 : seededRandom() > 0.3;
    const paymentTypes = ["Visa", "Mastercard", "Amex", "ACH Bank Transfer"];
    accounts.push({
      id: `ACC-${String(i + 1).padStart(4, "0")}`,
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@example.com`,
      status,
      created_at: randomDate(730),
      cancelled_at: status === "cancelled" ? randomDate(90) : undefined,
      balance: status === "suspended" ? Math.round(seededRandom() * 300 + 50) :
               status === "active" ? (seededRandom() > 0.85 ? Math.round(seededRandom() * 200) : 0) : 0,
      payment_method_on_file: hasPayment,
      phone: `(${String(200 + Math.floor(seededRandom() * 800))}) ${String(200 + Math.floor(seededRandom() * 800))}-${String(1000 + Math.floor(seededRandom() * 9000))}`,
      address: `${Math.floor(seededRandom() * 9000 + 100)} ${pick(streets)}`,
      city: pick(cities),
      state: pick(states),
      zip: String(10000 + Math.floor(seededRandom() * 90000)),
      plan,
      plan_price: planPrices[plan],
      payment_method_type: hasPayment ? pick(paymentTypes) : undefined,
      payment_method_last4: hasPayment ? String(1000 + Math.floor(seededRandom() * 9000)) : undefined,
      labels: seededRandom() > 0.7 ? [pick(["Residential", "Business", "MDU", "VIP", "New Customer"])] : [],
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
    const subject = pick(ticketSubjects);
    const agent = pick(agentNames);
    const createdDate = new Date(created);

    // Generate 1-5 comments per ticket
    const numComments = Math.floor(seededRandom() * 4) + 1;
    const comments: TicketComment[] = [];
    let commentTime = createdDate.getTime() + 30 * 60000; // 30 min after creation
    for (let c = 0; c < numComments; c++) {
      const role: TicketComment["author_role"] = c === 0 ? "agent" : pick(["agent", "customer", "customer", "system"]);
      const templates = commentTemplates[role];
      comments.push({
        id: `CMT-${String(i * 10 + c + 1).padStart(5, "0")}`,
        author: role === "agent" ? agent : role === "customer" ? acc.name : "System",
        author_role: role,
        body: pick(templates),
        created_at: new Date(commentTime).toISOString(),
      });
      commentTime += (seededRandom() * 24 + 1) * 3600000; // 1-25 hours between comments
    }

    tickets.push({
      id: `TK-${String(1000 + statuses.length - i).padStart(4, "0")}`,
      account_id: acc.id,
      account_name: acc.name,
      subject,
      status,
      priority: pick(["low", "medium", "medium", "high", "high", "critical"]),
      created_at: created,
      resolved_at: status === "resolved" || status === "closed"
        ? new Date(createdDate.getTime() + seededRandom() * 7 * 86400000).toISOString()
        : undefined,
      description: ticketDescriptions[subject] || "Customer reported an issue requiring investigation. Details to be gathered during initial triage.",
      assigned_to: status !== "closed" || seededRandom() > 0.3 ? agent : undefined,
      category: pick(ticketCategories),
      comments,
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
    const scheduledDate = new Date(new Date(created).getTime() + seededRandom() * 14 * 86400000);
    orders.push({
      id: `ORD-${String(3000 + statuses.length - i).padStart(4, "0")}`,
      account_id: acc.id,
      account_name: type === "new_install" ? `New signup — ${acc.name}` : acc.name,
      type,
      status,
      created_at: created,
      completed_at: status === "completed"
        ? new Date(new Date(created).getTime() + seededRandom() * 14 * 86400000).toISOString()
        : undefined,
      product_name: product,
      assigned_to: pick(techNames),
      notes: seededRandom() > 0.4 ? pick(orderNotes) : undefined,
      scheduled_date: status === "pending" || status === "in_progress" ? scheduledDate.toISOString() : undefined,
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
      const lineItems = [{ description: `${plan} — Monthly Service`, amount: price }];
      if (seededRandom() > 0.8) lineItems.push({ description: "Equipment Rental — Router", amount: 10 });
      if (seededRandom() > 0.9) lineItems.push({ description: "Static IP Add-on", amount: 15 });
      const totalAmount = lineItems.reduce((s, l) => s + l.amount, 0);
      invoices.push({
        id: `INV-${invNum++}`,
        account_id: acc.id,
        account_name: acc.name,
        amount: totalAmount,
        status,
        due_date: dueDate.toISOString(),
        paid_at: status === "paid" ? new Date(dueDate.getTime() + seededRandom() * 25 * 86400000).toISOString() : undefined,
        created_at: new Date(dueDate.getTime() - 15 * 86400000).toISOString(),
        line_items: lineItems,
        payment_method: status === "paid" ? pick(["Visa •••• 4242", "Mastercard •••• 8812", "ACH Bank Transfer", "Check #" + Math.floor(seededRandom() * 9000 + 1000)]) : undefined,
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
