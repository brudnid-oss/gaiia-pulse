import { NextResponse } from "next/server";
import { getTicketStatus, getRecentTickets } from "@/lib/gaiia-client";

export async function GET() {
  try {
    const [status, recent] = await Promise.all([
      getTicketStatus(),
      getRecentTickets(),
    ]);
    return NextResponse.json({ status, recent });
  } catch {
    return NextResponse.json({ error: "Failed to fetch ticket data" }, { status: 500 });
  }
}
