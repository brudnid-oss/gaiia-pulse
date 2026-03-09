import { NextResponse } from "next/server";
import { mockTickets } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({ data: mockTickets });
}
