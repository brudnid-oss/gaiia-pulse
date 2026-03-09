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
import StatusBadge from "../ui/StatusBadge";
import { OrderStatusData, OrderTypeData, Order } from "@/lib/types";
import { formatNumber, formatRelativeTime } from "@/lib/formatters";

interface OrderPipelineProps {
  statusData: OrderStatusData[] | null;
  typeData: OrderTypeData[] | null;
  recentOrders: Order[] | null;
  loading: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  Pending: "#F59E0B",
  "In Progress": "#3B82F6",
  Completed: "#00C853",
  Cancelled: "#6B7280",
};

export default function OrderPipeline({
  statusData,
  typeData,
  recentOrders,
  loading,
}: OrderPipelineProps) {
  return (
    <ChartCard title="Order Pipeline" loading={loading}>
      {statusData && recentOrders && (
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
                contentStyle={{
                  backgroundColor: "#18181b",
                  border: "1px solid #3f3f46",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value: any) => [formatNumber(value), "Orders"]}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={16}>
                {statusData.map((entry) => (
                  <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || "#6B7280"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {typeData && (
            <div className="flex gap-4 border-t border-zinc-800 pt-3">
              {typeData.map((t) => (
                <div key={t.type} className="flex items-center gap-2">
                  <StatusBadge status={t.type.toLowerCase().replace(/ /g, "_")} />
                  <span className="text-xs font-mono text-zinc-400">{t.count}</span>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-zinc-800 pt-3">
            <p className="text-[10px] uppercase tracking-wider text-zinc-600 mb-2">
              Recent Orders
            </p>
            <div className="space-y-2">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-start justify-between gap-2 rounded-md border border-zinc-800/50 px-3 py-2 hover:border-zinc-700 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-mono text-zinc-600">{order.id}</span>
                      <StatusBadge status={order.type} />
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-xs text-zinc-300 truncate">{order.account_name}</p>
                    <p className="text-[10px] text-zinc-600">{order.product_name}</p>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-600 whitespace-nowrap">
                    {formatRelativeTime(order.created_at)}
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
