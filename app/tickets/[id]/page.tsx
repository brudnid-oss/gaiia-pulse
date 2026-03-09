"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import DetailPageLayout from "@/components/DetailPageLayout";
import StatusBadge from "@/components/ui/StatusBadge";
import DetailField from "@/components/ui/DetailField";
import { Ticket } from "@/lib/types";
import { formatDate, formatRelativeTime } from "@/lib/formatters";

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/tickets/${id}`)
      .then((r) => r.json())
      .then((d) => setTicket(d.ticket))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || !ticket) {
    return (
      <DetailPageLayout title="Ticket">
        <div className="flex items-center justify-center h-64">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-500" />
        </div>
      </DetailPageLayout>
    );
  }

  return (
    <DetailPageLayout title={ticket.subject} subtitle={ticket.id} breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Tickets", href: "/tickets" }]}>
      <div className="space-y-5">
        {/* Header */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
            <div>
              <h2 className="text-lg font-semibold text-zinc-100">{ticket.subject}</h2>
              <p className="text-sm text-zinc-500 font-mono">{ticket.id}</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={ticket.priority} size="md" />
              <StatusBadge status={ticket.status} size="md" />
            </div>
          </div>
          <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <DetailField label="Account">
              <Link href={`/subscribers/${ticket.account_id}`} className="text-emerald-400 hover:text-emerald-300 transition-colors">
                {ticket.account_name}
              </Link>
              <span className="text-zinc-600 text-xs ml-1">({ticket.account_id})</span>
            </DetailField>
            <DetailField label="Category">{ticket.category || "—"}</DetailField>
            <DetailField label="Assigned To">{ticket.assigned_to || "Unassigned"}</DetailField>
            <DetailField label="Created">{formatDate(ticket.created_at)}</DetailField>
            <DetailField label="Resolved">
              {ticket.resolved_at ? formatDate(ticket.resolved_at) : <span className="text-zinc-600">Pending</span>}
            </DetailField>
          </dl>
        </div>

        {/* Description */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-5">
          <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-400 mb-3">Description</h3>
          <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
            {ticket.description || "No description provided."}
          </p>
        </div>

        {/* Comments / Activity */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-5">
          <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-400 mb-4">
            Activity ({ticket.comments?.length || 0})
          </h3>
          {!ticket.comments || ticket.comments.length === 0 ? (
            <p className="text-sm text-zinc-600">No activity yet.</p>
          ) : (
            <div className="space-y-4">
              {ticket.comments.map((comment) => (
                <div key={comment.id} className="relative pl-4 border-l-2 border-zinc-800">
                  <div
                    className={`absolute -left-[5px] top-1.5 h-2 w-2 rounded-full ${
                      comment.author_role === "agent"
                        ? "bg-emerald-500"
                        : comment.author_role === "customer"
                          ? "bg-blue-500"
                          : "bg-zinc-600"
                    }`}
                  />
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium ${
                      comment.author_role === "agent"
                        ? "text-emerald-400"
                        : comment.author_role === "customer"
                          ? "text-blue-400"
                          : "text-zinc-500"
                    }`}>
                      {comment.author}
                    </span>
                    <span className="rounded-full bg-zinc-800 px-1.5 py-0.5 text-[9px] text-zinc-500 uppercase">
                      {comment.author_role}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-600">
                      {formatRelativeTime(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed">{comment.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DetailPageLayout>
  );
}
