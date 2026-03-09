import { NextResponse } from "next/server";
import { getInvoiceStatus } from "@/lib/gaiia-client";

export async function GET() {
  try {
    const status = await getInvoiceStatus();
    return NextResponse.json({ status });
  } catch {
    return NextResponse.json({ error: "Failed to fetch invoice data" }, { status: 500 });
  }
}
