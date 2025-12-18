"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PlusIcon, MinusIcon } from "lucide-react";
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import RequireRole from "@/components/RequireRole";
import { api } from "@/lib/api";
import type { ApiResponse } from "@/lib/types";

interface Product {
  id: number;
  name: string;
  stock: number;
  sku: string;
}

interface StockTransaction {
  id: number;
  productId: number;
  productName: string;
  type: "in" | "out" | "adjust";
  quantity: number;
  reason: string;
  createdAt: string;
  createdBy: string;
}

export default function StockOperationsPage() {
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [operationType, setOperationType] = useState<"in" | "out" | "adjust" | null>(null);
  const [quantity, setQuantity] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const queryClient = useQueryClient();

  // Response: { success, data: Product[], pagination }
  const { data: productsData, isLoading: loadingProducts } = useQuery({
    queryKey: ["products-stock"],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: Product[]; pagination?: any }>(
        "/api/v1/products"
      );
      return response;
    },
    retry: false,
  });

  // Response: { success, data: StockTransaction[], pagination }
  const { data: transactionsData, isLoading: loadingTransactions } = useQuery({
    queryKey: ["stock-transactions"],
    queryFn: async () => {
      const response = await api.get<{
        success: boolean;
        data: StockTransaction[];
        pagination?: any;
      }>("/api/v1/stock/movements");
      return response;
    },
    retry: false,
  });

  const products = Array.isArray(productsData?.data) ? productsData.data : [];
  const transactions = Array.isArray(transactionsData?.data) ? transactionsData.data : [];

  const stockMutation = useMutation({
    mutationFn: (data: {
      productId: number;
      type: string;
      quantity: number;
      reason: string;
    }) => api.post("/api/v1/stock/operations", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products-stock"] });
      queryClient.invalidateQueries({ queryKey: ["stock-transactions"] });
      setSelectedProduct(null);
      setOperationType(null);
      setQuantity("");
      setReason("");
    },
  });

  const handleSubmit = () => {
    if (!selectedProduct || !operationType || !quantity || !reason) return;

    stockMutation.mutate({
      productId: selectedProduct,
      type: operationType,
      quantity: parseInt(quantity, 10),
      reason,
    });
  };

  return (
    <RequireRole roles={["admin", "superadmin"]}>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-foreground">Stock Operations</h1>

          {/* Stock Operation Form */}
          <div className="rounded-lg border border-border bg-card/50 p-6">
            <h2 className="text-xl font-bold mb-4 text-foreground">Record Stock Movement</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Select Product
                </label>
                <select
                  value={selectedProduct || ""}
                  onChange={(e) =>
                    setSelectedProduct(e.target.value ? Number(e.target.value) : null)
                  }
                  disabled={loadingProducts}
                  className="w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-foreground placeholder:text-muted-foreground hover:border-input focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 disabled:opacity-50"
                >
                  <option value="">Select a product...</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} (SKU: {product.sku}) - Current: {product.stock}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Operation Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setOperationType("in")}
                    className={`rounded-lg border px-4 py-2 font-medium transition ${
                      operationType === "in"
                        ? "border-primary bg-primary/20 text-primary"
                        : "border-border bg-card/50 hover:border-input text-foreground"
                    }`}
                  >
                    <PlusIcon className="inline h-4 w-4 mr-1" />
                    Stock In
                  </button>
                  <button
                    type="button"
                    onClick={() => setOperationType("out")}
                    className={`rounded-lg border px-4 py-2 font-medium transition ${
                      operationType === "out"
                        ? "border-destructive bg-destructive/20 text-destructive"
                        : "border-border bg-card/50 hover:border-input text-foreground"
                    }`}
                  >
                    <MinusIcon className="inline h-4 w-4 mr-1" />
                    Stock Out
                  </button>
                  <button
                    type="button"
                    onClick={() => setOperationType("adjust")}
                    className={`rounded-lg border px-4 py-2 font-medium transition ${
                      operationType === "adjust"
                        ? "border-accent bg-accent/20 text-accent"
                        : "border-border bg-card/50 hover:border-input text-foreground"
                    }`}
                  >
                    Adjust
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Quantity
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity..."
                  min="1"
                  className="w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-foreground placeholder:text-muted-foreground hover:border-input focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Reason</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g., Restock, Damaged, Customer Return..."
                  className="w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-foreground placeholder:text-muted-foreground hover:border-input focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!selectedProduct || !operationType || !quantity || !reason || stockMutation.isPending}
              className="mt-4 rounded-md bg-gradient-to-r from-primary to-accent px-6 py-2 font-medium text-primary-foreground hover:from-accent hover:to-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {stockMutation.isPending ? "Processing..." : "Record Transaction"}
            </button>
          </div>

          {/* Current Stock Levels */}
          <div className="rounded-lg border border-border bg-card/50 p-6">
            <h2 className="text-xl font-bold mb-4 text-foreground">Current Stock Levels</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-3 text-left font-semibold text-foreground">SKU</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">
                      Product Name
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-foreground">Stock</th>
                    <th className="px-4 py-3 text-center font-semibold text-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loadingProducts ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                        Loading products...
                      </td>
                    </tr>
                  ) : products.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                        No products found
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id} className="border-b border-border/50 hover:bg-muted/20">
                        <td className="px-4 py-3 text-muted-foreground">{product.sku}</td>
                        <td className="px-4 py-3 text-foreground">{product.name}</td>
                        <td className="px-4 py-3 text-right font-medium text-foreground">
                          {product.stock}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                              product.stock === 0
                                ? "bg-destructive/20 text-destructive border border-destructive/30"
                                : product.stock < 10
                                ? "bg-accent/20 text-accent border border-accent/30"
                                : "bg-primary/20 text-primary border border-primary/30"
                            }`}
                          >
                            {product.stock === 0
                              ? "Out of Stock"
                              : product.stock < 10
                              ? "Low Stock"
                              : "In Stock"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="rounded-lg border border-border bg-card/50 p-6">
            <h2 className="text-xl font-bold mb-4 text-foreground">Recent Transactions</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Date</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Product</th>
                    <th className="px-4 py-3 text-center font-semibold text-foreground">Type</th>
                    <th className="px-4 py-3 text-right font-semibold text-foreground">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Reason</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">By</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingTransactions ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                        Loading transactions...
                      </td>
                    </tr>
                  ) : transactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                        No transactions yet
                      </td>
                    </tr>
                  ) : (
                    transactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="border-b border-border/50 hover:bg-muted/20"
                      >
                        <td className="px-4 py-3 text-muted-foreground">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-foreground">{transaction.productName}</td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                              transaction.type === "in"
                                ? "bg-primary/20 text-primary border border-primary/30"
                                : transaction.type === "out"
                                ? "bg-destructive/20 text-destructive border border-destructive/30"
                                : "bg-accent/20 text-accent border border-accent/30"
                            }`}
                          >
                            {transaction.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-foreground">
                          {transaction.type === "out" ? "-" : "+"}
                          {transaction.quantity}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{transaction.reason}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {transaction.createdBy}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}
