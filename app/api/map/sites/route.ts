import { NextResponse } from "next/server";
import { mockNetworkSites } from "@/lib/mock-geodata";

export async function GET() {
  try {
    return NextResponse.json({ data: mockNetworkSites });
  } catch {
    return NextResponse.json({ error: "Failed to fetch network sites" }, { status: 500 });
  }
}
