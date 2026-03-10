import { NextResponse } from "next/server";
import { mockTicketLocations, mockServiceAreas } from "@/lib/mock-geodata";

export async function GET() {
  try {
    return NextResponse.json({
      tickets: mockTicketLocations,
      serviceAreas: mockServiceAreas,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch ticket locations" }, { status: 500 });
  }
}
