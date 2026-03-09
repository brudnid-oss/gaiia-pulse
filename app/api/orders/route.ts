import { NextResponse } from "next/server";
import { getOrderStatus, getOrderTypes, getRecentOrders } from "@/lib/gaiia-client";

export async function GET() {
  try {
    const [status, types, recent] = await Promise.all([
      getOrderStatus(),
      getOrderTypes(),
      getRecentOrders(),
    ]);
    return NextResponse.json({ status, types, recent });
  } catch {
    return NextResponse.json({ error: "Failed to fetch order data" }, { status: 500 });
  }
}
