import { NextResponse } from "next/server";
import { mockOrders } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({ data: mockOrders });
}
