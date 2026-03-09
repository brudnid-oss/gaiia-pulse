import { NextResponse } from "next/server";
import { mockAccounts, mockTickets, mockOrders, mockInvoices, mockInventoryItems } from "@/lib/mock-data";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const account = mockAccounts.find((a) => a.id === id);
  if (!account) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const tickets = mockTickets.filter((t) => t.account_id === id);
  const orders = mockOrders.filter((o) => o.account_id === id);
  const invoices = mockInvoices.filter((i) => i.account_id === id);
  const devices = mockInventoryItems.filter((d) => d.assigned_account_id === id);

  return NextResponse.json({ account, tickets, orders, invoices, devices });
}
