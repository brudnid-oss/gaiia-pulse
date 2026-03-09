"use client";

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
import { AccountStatusData, AccountIssue } from "@/lib/types";
import { formatNumber } from "@/lib/formatters";

interface AccountHealthProps {
  statusData: AccountStatusData[] | null;
  issuesData: AccountIssue[] | null;
  loading: boolean;
}

const COLORS: Record<string, string> = {
  Active: "#00C853",
  Suspended: "#EF4444",
  Pending: "#F59E0B",
  Cancelled: "#6B7280",
};

export default function AccountHealth({
  statusData,
  issuesData,
  loading,
}: AccountHealthProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <ChartCard title="Account Status Distribution" loading={loading}>
        {statusData && (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={statusData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <XAxis
                dataKey="status"
                tick={{ fill: "#71717a", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "#27272a" }}
              />
              <YAxis
                tick={{ fill: "#71717a", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181b",
                  border: "1px solid #3f3f46",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value: any) => [formatNumber(value), "Accounts"]}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {statusData.map((entry) => (
                  <Cell key={entry.status} fill={COLORS[entry.status] || "#6B7280"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <ChartCard title="Account Issues" loading={loading}>
        {issuesData && (
          <div className="space-y-3">
            {issuesData.map((issue) => (
              <div
                key={issue.label}
                className="flex items-center justify-between rounded-md border border-zinc-800 px-3 py-2.5 hover:border-zinc-700 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      issue.severity === "critical" ? "bg-red-500" : "bg-amber-500"
                    }`}
                  />
                  <span className="text-sm text-zinc-300">{issue.label}</span>
                </div>
                <span
                  className={`text-sm font-mono font-medium ${
                    issue.severity === "critical" ? "text-red-400" : "text-amber-400"
                  }`}
                >
                  {formatNumber(issue.count)}
                </span>
              </div>
            ))}
          </div>
        )}
      </ChartCard>
    </div>
  );
}
