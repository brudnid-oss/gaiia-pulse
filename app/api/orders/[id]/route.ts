import { NextResponse } from "next/server";
import { mockOrders } from "@/lib/mock-data";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = mockOrders.find((o) => o.id === id);
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ order });
}
