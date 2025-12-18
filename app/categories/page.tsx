"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import RequireAuth from "@/components/RequireAuth";
import { api } from "@/lib/api";
import type { ApiResponse } from "@/lib/types";

interface CategoryItem {
  id: number;
  name: string;
  description?: string;
}

interface CategoriesPayload {
  categories: CategoryItem[];
  pagination?: { page: number; limit: number; total: number };
}

export default function CategoriesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const queryKey = useMemo(() => ["categories", { page, search }], [page, search]);

  // Response: { success, data: Category[], pagination }
  const { data, isLoading, isError } = useQuery({
    queryKey,
    queryFn: () =>
      api.get<{ success: boolean; data: CategoryItem[]; pagination?: any }>(
        "/api/v1/categories",
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h1 className="text-2xl font-bold text-foreground">Categories</h1>
            <input
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              placeholder="Search category..."
              className="rounded-md border border-input bg-background/50 p-2 text-sm min-w-[240px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
            />
          </div>
          <div className="rounded-xl border border-border bg-card/50 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-foreground">ID</th>
                  <th className="px-3 py-2 text-left font-semibold text-foreground">Name</th>
                  <th className="px-3 py-2 text-left font-semibold text-foreground">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td className="px-3 py-3 text-center text-muted-foreground" colSpan={3}>
                      Loading...
                    </td>
                  </tr>
                )}
                {isError && (
                  <tr>
                    <td
                      className="px-3 py-3 text-destructive text-center"
                      colSpan={3}
                    >
                      Failed to load categories
                    </td>
                  </tr>
                )}
                {list.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-border/50 hover:bg-muted/20 odd:bg-muted/10"
                  >
                    <td className="px-3 py-2 text-muted-foreground">{c.id}</td>
                    <td className="px-3 py-2 text-foreground">{c.name}</td>
                    <td className="px-3 py-2 text-muted-foreground">{c.description ?? "-"}</td>
                  </tr>
                ))}
                {!isLoading && !isError && list.length === 0 && (
                  <tr>
                    <td className="px-3 py-3 text-center text-muted-foreground" colSpan={3}>
                      No categories
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
                Page {pagination.page} /{" "}
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
