"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import RequireAuth from "@/components/RequireAuth";
import { api } from "@/lib/api";
import type { ApiResponse } from "@/lib/types";

interface OrderItem {
  id: number;
  transaction_number: string;
  transaction_date: string;
  total_amount: string;
  payment_method: string;
  kasir_name?: string;
}

interface OrdersPayload {
  transactions: OrderItem[];
  pagination?: { page: number; limit: number; total: number };
}

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const queryKey = useMemo(() => ["orders", { page }], [page]);

  // Response: { success, data: Transaction[], pagination }
  const { data, isLoading, isError } = useQuery({
    queryKey,
    queryFn: () =>
      api.get<{ success: boolean; data: OrderItem[]; pagination?: any }>(
        "/api/v1/transactions",
        { page, limit: 20 }
      ),
  });

  const list = Array.isArray(data?.data) ? data.data : [];
  const pagination = data?.pagination;

  return (
    <RequireAuth>
      <DashboardLayout>
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold mb-4 text-foreground">Orders</h1>
          <div className="rounded-xl border border-border bg-card/50 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-foreground">Number</th>
                  <th className="px-3 py-2 text-left font-semibold text-foreground">Date</th>
                  <th className="px-3 py-2 text-left font-semibold text-foreground">Total</th>
                  <th className="px-3 py-2 text-left font-semibold text-foreground">Payment</th>
                  <th className="px-3 py-2 text-left font-semibold text-foreground">Cashier</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td className="px-3 py-3 text-center text-muted-foreground" colSpan={5}>
                      Loading...
                    </td>
                  </tr>
                )}
                {isError && (
                  <tr>
                    <td
                      className="px-3 py-3 text-destructive text-center"
                      colSpan={5}
                    >
                      Failed to load orders
                    </td>
                  </tr>
                )}
                {list.map((o) => (
                  <tr
                    key={o.id}
                    className="border-b border-border/50 hover:bg-muted/20 odd:bg-muted/10"
                  >
                    <td className="px-3 py-2 text-foreground">{o.transaction_number}</td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {new Date(o.transaction_date).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{o.total_amount}</td>
                    <td className="px-3 py-2 text-muted-foreground">{o.payment_method}</td>
                    <td className="px-3 py-2 text-muted-foreground">{o.kasir_name ?? "-"}</td>
                  </tr>
                ))}
                {!isLoading && !isError && list.length === 0 && (
                  <tr>
                    <td className="px-3 py-3 text-center text-muted-foreground" colSpan={5}>
                      No orders
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {pagination && (
            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                className="rounded-md border border-border bg-muted/50 px-3 py-1 text-foreground hover:bg-muted disabled:opacity-50"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </button>
              <span className="text-sm text-muted-foreground">
                Page {pagination.page} /
                {Math.ceil((pagination.total ?? 0) / (pagination.limit || 1) || 1)}
              </span>
              <button
                type="button"
                className="rounded-md border border-border bg-muted/50 px-3 py-1 text-foreground hover:bg-muted"
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </DashboardLayout>
    </RequireAuth>
  );
}
