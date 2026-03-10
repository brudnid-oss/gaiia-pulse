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
import { PlanMixData } from "@/lib/types";
import { formatNumber } from "@/lib/formatters";
import { tooltipStyle } from "@/lib/chart-theme";

interface PlanMixChartProps {
  data: PlanMixData[] | null;
  loading: boolean;
}

const COLORS = ["#6366F1", "#8B5CF6", "#A78BFA", "#10B981", "#06B6D4"];

export default function PlanMixChart({ data, loading }: PlanMixChartProps) {
  const total = data?.reduce((sum, d) => sum + d.count, 0) || 0;

  return (
    <ChartCard title="Service / Plan Mix" loading={loading} href="/subscribers">
      {data && (
        <div className="space-y-4">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 5, left: 0, bottom: 0 }}
            >
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="plan"
                tick={{ fill: "#71717a", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={80}
              />
              <Tooltip
                {...tooltipStyle}
                formatter={(value: any) => [formatNumber(value), "Subscribers"]}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div className="border-t border-zinc-800 pt-3">
            <div className="flex flex-wrap gap-3">
              {data.map((item, i) => (
                <div key={item.plan} className="flex items-center gap-1.5">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  <span className="text-[10px] text-zinc-400">{item.plan}</span>
                  <span className="text-[10px] font-mono text-zinc-500">
                    {formatNumber(item.count)} ({total > 0 ? Math.round((item.count / total) * 100) : 0}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </ChartCard>
  );
}
