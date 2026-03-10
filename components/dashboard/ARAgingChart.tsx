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
import { ARAgingBucket } from "@/lib/types";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { tooltipStyle } from "@/lib/chart-theme";

interface ARAgingChartProps {
  data: ARAgingBucket[] | null;
  loading: boolean;
}

const COLORS: Record<string, string> = {
  Current: "#10B981",
  "1-30": "#F59E0B",
  "31-60": "#F97316",
  "61-90": "#EF4444",
  "90+": "#DC2626",
};

export default function ARAgingChart({ data, loading }: ARAgingChartProps) {
  const totalAmount = data?.reduce((sum, b) => sum + b.amount, 0) || 0;

  return (
    <ChartCard title="AR Aging Buckets" loading={loading} href="/invoices?status=overdue">
      {data && (
        <div className="space-y-4">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-mono font-semibold text-zinc-100">
              {formatCurrency(totalAmount)}
            </span>
            <span className="text-xs text-zinc-500">total outstanding</span>
          </div>

          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={data} margin={{ top: 0, right: 5, left: 0, bottom: 0 }}>
              <XAxis
                dataKey="bucket"
                tick={{ fill: "#71717a", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis hide />
              <Tooltip
                {...tooltipStyle}
                formatter={(value: any, name: any) => {
                  if (name === "amount") return [formatCurrency(value), "Amount"];
                  return [formatNumber(value), "Invoices"];
                }}
              />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]} barSize={32}>
                {data.map((entry) => (
                  <Cell key={entry.bucket} fill={COLORS[entry.bucket] || "#6B7280"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-5 gap-2 border-t border-zinc-800 pt-3">
            {data.map((bucket) => (
              <div key={bucket.bucket} className="text-center">
                <p className="text-[10px] text-zinc-500 mb-0.5">{bucket.bucket} days</p>
                <p className="text-xs font-mono text-zinc-300">{formatNumber(bucket.count)}</p>
                <p className="text-[10px] font-mono text-zinc-500">{formatCurrency(bucket.amount)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </ChartCard>
  );
}
