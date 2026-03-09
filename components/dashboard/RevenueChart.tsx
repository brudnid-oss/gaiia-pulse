"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ChartCard from "../ui/ChartCard";
import { RevenueDataPoint } from "@/lib/types";
import { formatCurrency } from "@/lib/formatters";

interface RevenueChartProps {
  data: RevenueDataPoint[] | null;
  loading: boolean;
}

export default function RevenueChart({ data, loading }: RevenueChartProps) {
  return (
    <ChartCard title="Revenue — Last 12 Months" loading={loading}>
      {data && (
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00C853" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00C853" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis
              dataKey="month"
              tick={{ fill: "#71717a", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "#27272a" }}
            />
            <YAxis
              tick={{ fill: "#71717a", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid #3f3f46",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              labelStyle={{ color: "#a1a1aa" }}
              formatter={(value: any) => [formatCurrency(value), "Revenue"]}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#00C853"
              strokeWidth={2}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}
