import { NextResponse } from "next/server";
import { getKPIs, getAccountStatus, getAccountIssues } from "@/lib/gaiia-client";

export async function GET() {
  try {
    const [kpis, status, issues] = await Promise.all([
      getKPIs(),
      getAccountStatus(),
      getAccountIssues(),
    ]);
    return NextResponse.json({ kpis, status, issues });
  } catch {
    return NextResponse.json({ error: "Failed to fetch account data" }, { status: 500 });
  }
}
