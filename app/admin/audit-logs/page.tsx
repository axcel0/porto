"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import RequireRole from "@/components/RequireRole";
import { api } from "@/lib/api";
import type { ApiResponse } from "@/lib/types";

interface AuditLog {
  id: number;
  user_id?: number;
  action: string;
  resource: string;
  created_at: string;
  ip_address?: string;
  user_agent?: string;
  success?: boolean;
  error_message?: string;
}

const ACTION_COLORS: Record<string, string> = {
  create: "text-primary",
  update: "text-accent",
  delete: "text-destructive",
  login: "text-primary",
  logout: "text-muted-foreground",
};

export default function AuditLogsPage() {
  const [filterAction, setFilterAction] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { data: logsData, isLoading } = useQuery({
    queryKey: ["audit-logs", filterAction, filterStatus, sortOrder],
    // Response: { success, data: AuditLog[], pagination }
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filterAction) params.set("action", filterAction);
      if (filterStatus) params.set("success", filterStatus);
      params.set("sort", sortOrder);
      return api.get<{ success: boolean; data: AuditLog[]; pagination?: any }>(
        `/api/v1/audit-logs?${params.toString()}`
      );
    },
    retry: false,
  });

  const logs = Array.isArray(logsData?.data) ? logsData.data : [];

  return (
    <RequireRole roles={["superadmin"]}>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Audit Logs</h1>
          </div>

          {/* Filters */}
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                Action
              </label>
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-foreground placeholder:text-muted-foreground hover:border-input focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
              >
                <option value="">All Actions</option>
                <option value="create">Create</option>
                <option value="update">Update</option>
                <option value="delete">Delete</option>
                <option value="login">Login</option>
                <option value="logout">Logout</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-foreground placeholder:text-muted-foreground hover:border-input focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
              >
                <option value="">All Status</option>
                <option value="true">Success</option>
                <option value="false">Failed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                Sort Order
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                className="w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-foreground placeholder:text-muted-foreground hover:border-input focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Logs Table */}
          <div className="overflow-x-auto rounded-lg border border-border bg-card/50">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Timestamp
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    User ID
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Action
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Resource
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    IP Address
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      Loading audit logs...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      No audit logs found
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => {
                    const date = log.created_at ? new Date(log.created_at) : null;
                    const isValidDate = date && !isNaN(date.getTime());
                    const formattedDate = isValidDate ? date.toLocaleString() : "N/A";
                    const status = log.success ? "success" : "failed";

                    return (
                      <tr
                        key={log.id}
                        className="border-b border-border/50 hover:bg-muted/20"
                      >
                        <td className="px-4 py-3 text-muted-foreground">
                          {formattedDate}
                        </td>
                        <td className="px-4 py-3 text-foreground">{log.user_id || "-"}</td>
                        <td
                          className={`px-4 py-3 font-medium ${
                            ACTION_COLORS[log.action] || "text-muted-foreground"
                          }`}
                        >
                          {log.action}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {log.resource || "-"}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                              status === "success"
                                ? "bg-primary/20 text-primary border border-primary/30"
                                : status === "failed"
                                ? "bg-destructive/20 text-destructive border border-destructive/30"
                                : "bg-muted/20 text-muted-foreground border border-muted/30"
                            }`}
                          >
                            {status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {log.ip_address || "-"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}
