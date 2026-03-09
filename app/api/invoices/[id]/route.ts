import { NextResponse } from "next/server";
import { mockInvoices } from "@/lib/mock-data";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const invoice = mockInvoices.find((i) => i.id === id);
  if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ invoice });
}
