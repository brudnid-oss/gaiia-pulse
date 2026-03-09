import { NextResponse } from "next/server";
import { getRevenueHistory } from "@/lib/gaiia-client";

export async function GET() {
  try {
    const history = await getRevenueHistory();
    return NextResponse.json({ history });
  } catch {
    return NextResponse.json({ error: "Failed to fetch payment data" }, { status: 500 });
  }
}
