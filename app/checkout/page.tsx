"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import RequireAuth from "@/components/RequireAuth";
import { api } from "@/lib/api";
import type { ApiResponse } from "@/lib/types";

interface BarcodeProduct {
	id: number;
	name: string;
	barcode?: string;
	base_price?: string | number;
	stock?: number;
}

interface TransactionItem {
	product_id: number;
	quantity: number;
	name?: string;
	price?: number;
}

export default function CheckoutPage() {
	const [barcode, setBarcode] = useState("");
	const [items, setItems] = useState<TransactionItem[]>([]);

	const { refetch, isFetching } = useQuery({
		queryKey: ["barcode", barcode],
		enabled: false,
		queryFn: () => api.get<ApiResponse<BarcodeProduct>>(`/api/v1/products/by-barcode/${barcode}`),
	});

	const addByBarcode = async () => {
		if (!barcode) return;
		const res = await refetch();
		const p = res.data?.data;
		if (p?.id) {
			setItems((prev) => {
				const existing = prev.find((i) => i.product_id === p.id);
				if (existing) {
					return prev.map((i) => (i.product_id === p.id ? { ...i, quantity: i.quantity + 1 } : i));
				}
				return [
					...prev,
					{
						product_id: p.id,
						quantity: 1,
						name: p.name,
						price:
							typeof p.base_price === "string"
								? parseFloat(p.base_price)
								: (p.base_price as number | undefined),
					},
				];
			});
			setBarcode("");
		}
	};

	const total = items.reduce((sum, i) => sum + (i.price ?? 0) * i.quantity, 0);

	const createTxn = useMutation({
		mutationFn: () =>
			api.post<ApiResponse<{ transaction: { id: number; transaction_number: string } }>>(
				"/api/v1/transactions",
				{
					store_id: 1,
					items: items.map((i) => ({ product_id: i.product_id, quantity: i.quantity })),
					payment_method: "cash",
					notes: "",
				},
			),
		onSuccess: () => setItems([]),
	});

	return (
		<RequireAuth>
			<DashboardLayout>
				<div className="max-w-4xl mx-auto">
					<h1 className="text-2xl font-bold mb-4 text-foreground">Checkout</h1>
					<div className="mb-4 flex gap-2">
						<input
							value={barcode}
							onChange={(e) => setBarcode(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") void addByBarcode();
							}}
							placeholder="Scan or type barcode and press Enter"
							className="flex-1 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground p-3 outline-none focus:ring-2 focus:ring-primary/50"
						/>
						<button
							type="button"
							onClick={() => void addByBarcode()}
							disabled={!barcode || isFetching}
							className="rounded-md bg-primary text-primary-foreground px-4 py-2 disabled:opacity-50 hover:bg-primary/90 transition-colors"
						>
							{isFetching ? "Searching..." : "Add"}
						</button>
					</div>
					<div className="rounded-xl border border-border bg-card/50 overflow-hidden">
						<table className="w-full text-sm">
							<thead className="bg-muted/50 border-b border-border">
								<tr>
									<th className="px-3 py-3 text-left font-semibold text-foreground">Product</th>
									<th className="px-3 py-3 text-left font-semibold text-foreground">Qty</th>
									<th className="px-3 py-3 text-left font-semibold text-foreground">Price</th>
									<th className="px-3 py-3 text-left font-semibold text-foreground">Subtotal</th>
									<th className="px-3 py-3 text-left font-semibold text-foreground">Action</th>
								</tr>
							</thead>
							<tbody>
								{items.map((i) => (
									<tr key={i.product_id} className="border-b border-border hover:bg-muted/30 transition-colors">
										<td className="px-3 py-3 text-foreground">{i.name ?? i.product_id}</td>
										<td className="px-3 py-3">
											<input
												type="number"
												min={1}
												value={i.quantity}
												onChange={(e) =>
													setItems((prev) =>
														prev.map((it) =>
															it.product_id === i.product_id
																? { ...it, quantity: Math.max(1, Number(e.target.value)) }
																: it,
														),
													)
												}
												className="w-20 rounded-md border border-input bg-background text-foreground p-2 outline-none focus:ring-2 focus:ring-primary/50"
											/>
										</td>
										<td className="px-3 py-3 text-foreground">{i.price ?? 0}</td>
										<td className="px-3 py-3 text-foreground font-medium">{((i.price ?? 0) * i.quantity).toFixed(2)}</td>
										<td className="px-3 py-3">
											<button
												type="button"
												className="text-destructive hover:text-destructive/90 transition-colors"
												onClick={() =>
													setItems((prev) => prev.filter((it) => it.product_id !== i.product_id))
												}
											>
												Remove
											</button>
										</td>
									</tr>
								))}
								{items.length === 0 && (
									<tr>
										<td className="px-3 py-6 colSpan={5} text-center text-muted-foreground">
											No items. Scan a barcode to begin.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
					<div className="mt-6 flex items-center justify-between">
						<div className="text-muted-foreground">
							Total items: <span className="font-medium text-foreground">{items.reduce((s, i) => s + i.quantity, 0)}</span>
						</div>
						<div className="text-2xl font-bold text-foreground">Total: {total.toFixed(2)}</div>
					</div>
					<div className="mt-6 flex justify-end">
						<button
							type="button"
							onClick={() => createTxn.mutate()}
							disabled={items.length === 0 || createTxn.isPending}
							className="rounded-md bg-green-600 hover:bg-green-700 text-white px-6 py-3 disabled:opacity-50 font-medium transition-colors"
						>
							{createTxn.isPending ? "Processing..." : "Pay (Cash)"}
						</button>
					</div>
				</div>
			</DashboardLayout>
		</RequireAuth>
	);
}
