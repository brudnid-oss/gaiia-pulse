import { NextResponse } from "next/server";
import { mockAccounts } from "@/lib/mock-data";

export async function GET() {
  // In production, this would call the gaiia API with pagination
  // For mock mode, return the full list
  return NextResponse.json({ data: mockAccounts });
}
