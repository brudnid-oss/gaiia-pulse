import { NextResponse } from "next/server";
import { mockMapSubscribers } from "@/lib/mock-geodata";

export async function GET() {
  try {
    // In production, this would call the gaiia API for accounts with coordinates
    return NextResponse.json({ data: mockMapSubscribers });
  } catch {
    return NextResponse.json({ error: "Failed to fetch map accounts" }, { status: 500 });
  }
}
