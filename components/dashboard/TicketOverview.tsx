"use client";

import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import ChartCard from "../ui/ChartCard";
import StatusBadge from "../ui/StatusBadge";
import { TicketStatusData, Ticket } from "@/lib/types";
import { formatNumber, formatRelativeTime } from "@/lib/formatters";
import { tooltipStyle } from "@/lib/chart-theme";

interface TicketOverviewProps {
  statusData: TicketStatusData[] | null;
  recentTickets: Ticket[] | null;
  loading: boolean;
}

const COLORS: Record<string, string> = {
  Open: "#F59E0B",
  "In Progress": "#3B82F6",
  Resolved: "#00C853",
  Closed: "#6B7280",
};

export default function TicketOverview({
  statusData,
  recentTickets,
  loading,
}: TicketOverviewProps) {
  return (
    <ChartCard title="Support Tickets" loading={loading} href="/tickets">
      {statusData && recentTickets && (
        <div className="space-y-4">
          <ResponsiveContainer width="100%" height={120}>
            <BarChart
              data={statusData}
              layout="vertical"
              margin={{ top: 0, right: 5, left: 0, bottom: 0 }}
            >
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="status"
                tick={{ fill: "#71717a", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={80}
              />
              <Tooltip
                {...tooltipStyle}
                formatter={(value: any) => [formatNumber(value), "Tickets"]}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={16}>
                {statusData.map((entry) => (
                  <Cell key={entry.status} fill={COLORS[entry.status] || "#6B7280"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div className="border-t border-zinc-800 pt-3">
            <p className="text-[10px] uppercase tracking-wider text-zinc-600 mb-2">
              Recent Open Tickets
            </p>
            <div className="space-y-2">
              {recentTickets.map((ticket) => (
                <Link
                  key={ticket.id}
                  href="/tickets"
                  className="flex items-start justify-between gap-2 rounded-md border border-zinc-800/50 px-3 py-2 hover:border-zinc-700 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-mono text-zinc-600">{ticket.id}</span>
                      <StatusBadge status={ticket.priority} />
                    </div>
                    <p className="text-xs text-zinc-300 truncate">{ticket.subject}</p>
                    <p className="text-[10px] text-zinc-600">{ticket.account_name}</p>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-600 whitespace-nowrap">
                    {formatRelativeTime(ticket.created_at)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </ChartCard>
  );
}
