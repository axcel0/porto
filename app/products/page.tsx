"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import RequireAuth from "@/components/RequireAuth";
import { api } from "@/lib/api";
import type { ApiResponse } from "@/lib/types";

interface ProductItem {
  id: number;
  name: string;
  barcode?: string;
  base_price?: string | number;
  stock?: number;
  category_name?: string;
}

interface ProductsPayload {
  products: ProductItem[];
  pagination?: { page: number; limit: number; total: number; pages?: number };
}

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const queryKey = useMemo(() => ["products", { search, page }], [search, page]);

  // Response: { success, data: Product[], pagination }
  const { data, isLoading, isError } = useQuery({
    queryKey,
    queryFn: () =>
      api.get<{ success: boolean; data: ProductItem[]; pagination?: any }>(
        "/api/v1/products",
        {
          page,
          limit: 20,
          ...(search ? { search } : {}),
        }
      ),
  });

  const list = Array.isArray(data?.data) ? data.data : [];
  const pagination = data?.pagination;

  return (
    <RequireAuth>
      <DashboardLayout>
        <div className="max-w-6xl mx-auto">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h1 className="text-2xl font-bold text-foreground">Products</h1>
            <div className="flex items-center gap-2">
              <input
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
                }}
                placeholder="Search name or barcode..."
                className="rounded-md border border-input bg-background/50 p-2 text-sm min-w-[260px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card/50 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-foreground">ID</th>
                  <th className="px-3 py-2 text-left font-semibold text-foreground">Name</th>
                  <th className="px-3 py-2 text-left font-semibold text-foreground">Barcode</th>
                  <th className="px-3 py-2 text-left font-semibold text-foreground">Price</th>
                  <th className="px-3 py-2 text-left font-semibold text-foreground">Stock</th>
                  <th className="px-3 py-2 text-left font-semibold text-foreground">Category</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td className="px-3 py-3 text-center text-muted-foreground" colSpan={6}>
                      Loading...
                    </td>
                  </tr>
                )}
                {isError && (
                  <tr>
                    <td
                      className="px-3 py-3 text-destructive text-center"
                      colSpan={6}
                    >
                      Failed to load products
                    </td>
                  </tr>
                )}
                {list.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-border/50 hover:bg-muted/20 odd:bg-muted/10"
                  >
                    <td className="px-3 py-2 text-muted-foreground">{p.id}</td>
                    <td className="px-3 py-2 text-foreground">{p.name}</td>
                    <td className="px-3 py-2 text-muted-foreground">{p.barcode ?? "-"}</td>
                    <td className="px-3 py-2 text-muted-foreground">{p.base_price ?? "-"}</td>
                    <td className="px-3 py-2 text-muted-foreground">{p.stock ?? "-"}</td>
                    <td className="px-3 py-2 text-muted-foreground">{p.category_name ?? "-"}</td>
                  </tr>
                ))}
                {!isLoading && !isError && list.length === 0 && (
                  <tr>
                    <td className="px-3 py-3 text-center text-muted-foreground" colSpan={6}>
                      No products
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
                Page {pagination.page} of{" "}
                {pagination.pages ??
                  Math.ceil((pagination.total ?? 0) / (pagination.limit || 1) || 1)}
              </span>
              <button
                type="button"
                className="rounded-md border border-border bg-muted/50 px-3 py-1 text-foreground hover:bg-muted disabled:opacity-50"
                disabled={pagination.pages ? page >= pagination.pages : false}
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
