export interface Account {
  id: string;
  name: string;
  email: string;
  status: "active" | "suspended" | "pending" | "cancelled";
  created_at: string;
  cancelled_at?: string;
  balance: number;
  payment_method_on_file: boolean;
}

export interface Order {
  id: string;
  account_id: string;
  account_name: string;
  type: "new_install" | "upgrade" | "downgrade" | "disconnect";
  status: "pending" | "in_progress" | "completed" | "cancelled";
  created_at: string;
  completed_at?: string;
  product_name: string;
}

export interface Invoice {
  id: string;
  account_id: string;
  account_name: string;
  amount: number;
  status: "paid" | "unpaid" | "overdue" | "void";
  due_date: string;
  paid_at?: string;
  created_at: string;
}

export interface Payment {
  id: string;
  account_id: string;
  amount: number;
  method: string;
  created_at: string;
}

export interface PaymentSummary {
  total: number;
  count: number;
  period: string;
}

export interface Ticket {
  id: string;
  account_id: string;
  account_name: string;
  subject: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "critical";
  created_at: string;
  resolved_at?: string;
}

export interface InventoryItem {
  id: string;
  type: "ONT" | "router" | "switch" | "access_point" | "other";
  model: string;
  status: "available" | "provisioned" | "defective" | "retired";
  serial_number: string;
  assigned_account_id?: string;
}

export interface CountResponse {
  count: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
}

// Dashboard-specific aggregated types
export interface KPIData {
  totalSubscribers: number;
  mrr: number;
  openTickets: number;
  pendingOrders: number;
  overdueInvoices: number;
  overdueAmount: number;
  churnCount: number;
  churnRate: number;
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
}

export interface InvoiceStatusData {
  status: string;
  count: number;
  amount: number;
}

export interface AccountStatusData {
  status: string;
  count: number;
}

export interface TicketStatusData {
  status: string;
  count: number;
}

export interface OrderStatusData {
  status: string;
  count: number;
}

export interface OrderTypeData {
  type: string;
  count: number;
}

export interface AccountIssue {
  label: string;
  count: number;
  severity: "warning" | "critical";
}

export interface InventorySummaryData {
  total: number;
  byType: { type: string; count: number }[];
}
