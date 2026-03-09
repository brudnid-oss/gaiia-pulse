"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ChartCard from "../ui/ChartCard";
import { InventorySummaryData } from "@/lib/types";
import { formatNumber } from "@/lib/formatters";

interface InventorySummaryProps {
  data: InventorySummaryData | null;
  loading: boolean;
}

export default function InventorySummary({ data, loading }: InventorySummaryProps) {
  return (
    <ChartCard title="Network Inventory" loading={loading}>
      {data && (
        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-mono font-semibold text-zinc-100">
              {formatNumber(data.total)}
            </span>
            <span className="text-xs text-zinc-500">total devices provisioned</span>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={data.byType} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <XAxis
                dataKey="type"
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
                formatter={(value: any) => [formatNumber(value), "Devices"]}
              />
              <Bar dataKey="count" fill="#00C853" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartCard>
  );
}
