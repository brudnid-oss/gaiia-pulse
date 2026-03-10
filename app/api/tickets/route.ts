import { NextResponse } from "next/server";
import { getTicketStatus, getRecentTickets, getResolutionTrend } from "@/lib/gaiia-client";

export async function GET() {
  try {
    const [status, recent, resolutionTrend] = await Promise.all([
      getTicketStatus(),
      getRecentTickets(),
      getResolutionTrend(),
    ]);
    return NextResponse.json({ status, recent, resolutionTrend });
  } catch {
    return NextResponse.json({ error: "Failed to fetch ticket data" }, { status: 500 });
  }
}
