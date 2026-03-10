import { NextResponse } from "next/server";
import { getKPIs, getAccountStatus, getAccountIssues, getPlanMix } from "@/lib/gaiia-client";

export async function GET() {
  try {
    const [kpis, status, issues, planMix] = await Promise.all([
      getKPIs(),
      getAccountStatus(),
      getAccountIssues(),
      getPlanMix(),
    ]);
    return NextResponse.json({ kpis, status, issues, planMix });
  } catch {
    return NextResponse.json({ error: "Failed to fetch account data" }, { status: 500 });
  }
}
