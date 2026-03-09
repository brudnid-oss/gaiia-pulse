import { NextResponse } from "next/server";
import { getInventorySummary } from "@/lib/gaiia-client";

export async function GET() {
  try {
    const summary = await getInventorySummary();
    return NextResponse.json({ summary });
  } catch {
    return NextResponse.json({ error: "Failed to fetch inventory data" }, { status: 500 });
  }
}
