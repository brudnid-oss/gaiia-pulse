import { NextResponse } from "next/server";
import { mockTickets } from "@/lib/mock-data";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ticket = mockTickets.find((t) => t.id === id);
  if (!ticket) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ticket });
}
