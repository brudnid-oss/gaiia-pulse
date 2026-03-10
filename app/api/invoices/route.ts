import { NextResponse } from "next/server";
import { getInvoiceStatus, getARAgingBuckets } from "@/lib/gaiia-client";

export async function GET() {
  try {
    const [status, arAging] = await Promise.all([
      getInvoiceStatus(),
      getARAgingBuckets(),
    ]);
    return NextResponse.json({ status, arAging });
  } catch {
    return NextResponse.json({ error: "Failed to fetch invoice data" }, { status: 500 });
  }
}
