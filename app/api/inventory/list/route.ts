import { NextResponse } from "next/server";
import { mockInventoryItems } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({ data: mockInventoryItems });
}
