"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import ChartCard from "../ui/ChartCard";
import { InvoiceStatusData } from "@/lib/types";
import { formatCurrency, formatNumber } from "@/lib/formatters";

interface InvoiceBreakdownProps {
  data: InvoiceStatusData[] | null;
  loading: boolean;
}

const COLORS: Record<string, string> = {
  Paid: "#00C853",
  Unpaid: "#F59E0B",
  Overdue: "#EF4444",
  Void: "#6B7280",
};

export default function InvoiceBreakdown({ data, loading }: InvoiceBreakdownProps) {
  return (
    <ChartCard title="Invoice Status Breakdown" loading={loading}>
      {data && (
        <div className="flex items-center gap-4">
          <ResponsiveContainer width="50%" height={220}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                dataKey="count"
                nameKey="status"
                strokeWidth={0}
              >
                {data.map((entry) => (
                  <Cell key={entry.status} fill={COLORS[entry.status] || "#6B7280"} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181b",
                  border: "1px solid #3f3f46",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value: any, name: any) => [formatNumber(value), name]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex-1 space-y-3">
            {data.map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: COLORS[item.status] || "#6B7280" }}
                  />
                  <span className="text-xs text-zinc-400">{item.status}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-mono text-zinc-200">{formatNumber(item.count)}</span>
                  <span className="text-xs text-zinc-600 ml-2 font-mono">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </ChartCard>
  );
}
