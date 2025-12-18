"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EditIcon, TrashIcon, Store as StoreIcon, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import RequireRole from "@/components/RequireRole";
import { api } from "@/lib/api";
import type { ApiResponse } from "@/lib/types";

interface Store {
	id: number;
	name: string;
	address: string;
	phone: string;
	createdAt?: string;
	updatedAt?: string;
}

export default function StoresPage() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingStore, setEditingStore] = useState<Store | null>(null);
	const [formData, setFormData] = useState({ name: "", address: "", phone: "" });
	const queryClient = useQueryClient();

	const { data: storesData, isLoading } = useQuery({
		queryKey: ["stores"],
		queryFn: async () => {
			const response = await api.get<{ success: boolean; data: Store[]; pagination?: any }>("/api/v1/stores");
			return response;
		},
		retry: false,
	});

	const createMutation = useMutation({
		mutationFn: (data: Omit<Store, "id">) => api.post("/api/v1/stores", data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["stores"] });
			setIsModalOpen(false);
			setFormData({ name: "", address: "", phone: "" });
			toast.success("Store created successfully!");
		},
		onError: (error: any) => {
			toast.error(error?.message || "Failed to create store");
		},
	});

	const updateMutation = useMutation({
		mutationFn: (data: Store) =>
			api.put(`/api/v1/stores/${data.id}`, {
				name: data.name,
				address: data.address,
				phone: data.phone,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["stores"] });
			setEditingStore(null);
			setFormData({ name: "", address: "", phone: "" });
			setIsModalOpen(false);
			toast.success("Store updated successfully!");
		},
		onError: (error: any) => {
			toast.error(error?.message || "Failed to update store");
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (id: number) => api.delete(`/api/v1/stores/${id}`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["stores"] });
			toast.success("Store deleted successfully!");
		},
		onError: (error: any) => {
			toast.error(error?.message || "Failed to delete store");
		},
	});

	const stores = Array.isArray(storesData?.data) ? storesData.data : [];

	const handleOpenModal = (store?: Store) => {
		if (store) {
			setEditingStore(store);
			setFormData({ name: store.name, address: store.address, phone: store.phone });
		} else {
			setEditingStore(null);
			setFormData({ name: "", address: "", phone: "" });
		}
		setIsModalOpen(true);
	};

	const handleSubmit = () => {
		if (!formData.name || !formData.address || !formData.phone) {
			toast.error("Please fill in all fields");
			return;
		}

		if (editingStore) {
			updateMutation.mutate({ ...editingStore, ...formData });
		} else {
			createMutation.mutate(formData);
		}
	};

	const handleDelete = (id: number, name: string) => {
		toast(
			<div>
				<p className="font-semibold">Delete Store?</p>
				<p className="text-sm text-muted-foreground">Are you sure you want to delete "{name}"?</p>
			</div>,
			{
				action: {
					label: "Delete",
					onClick: () => deleteMutation.mutate(id),
				},
				cancel: {
					label: "Cancel",
				},
			}
		);
	};

	return (
		<RequireRole roles={["superadmin"]}>
			<DashboardLayout>
				<div className="max-w-6xl mx-auto">
					<div className="mb-6 flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
								<StoreIcon className="h-6 w-6 text-primary" />
							</div>
							<h1 className="text-2xl font-bold text-foreground">Store Management</h1>
						</div>
						<button
							type="button"
							onClick={() => handleOpenModal()}
							className="rounded-lg bg-gradient-to-r from-primary to-accent px-4 py-2.5 font-semibold hover:from-accent hover:to-primary transition-all shadow-lg shadow-primary/25 flex items-center gap-2 text-primary-foreground"
						>
							<Plus className="h-5 w-5" />
							Create Store
						</button>
					</div>

					{/* Stores Table */}
					<div className="overflow-x-auto rounded-lg border border-border bg-card/50 backdrop-blur">
						{isLoading ? (
							<div className="p-12 flex items-center justify-center">
								<Loader2 className="h-8 w-8 animate-spin text-primary" />
							</div>
						) : stores.length > 0 ? (
							<table className="w-full text-sm">
								<thead>
									<tr className="border-b border-border bg-muted/50">
										<th className="px-4 py-3 text-left font-semibold text-foreground">Name</th>
										<th className="px-4 py-3 text-left font-semibold text-foreground">Address</th>
										<th className="px-4 py-3 text-left font-semibold text-foreground">Phone</th>
										<th className="px-4 py-3 text-right font-semibold text-foreground">Actions</th>
									</tr>
								</thead>
								<tbody>
									{stores.map((store) => (
										<tr key={store.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
											<td className="px-4 py-3 font-medium text-foreground">{store.name}</td>
											<td className="px-4 py-3 text-muted-foreground">{store.address}</td>
											<td className="px-4 py-3 text-muted-foreground">{store.phone}</td>
											<td className="px-4 py-3 flex items-center justify-end gap-2">
												<button
													type="button"
													onClick={() => handleOpenModal(store)}
													className="rounded-lg p-2 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
													title="Edit store"
												>
													<EditIcon className="h-4 w-4" />
												</button>
												<button
													type="button"
													onClick={() => handleDelete(store.id, store.name)}
													className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
													title="Delete store"
												>
													<TrashIcon className="h-4 w-4" />
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						) : (
							<div className="p-12 text-center">
								<StoreIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
								<p className="text-muted-foreground">No stores found. Create one to get started.</p>
							</div>
						)}
					</div>

					{/* Create/Edit Modal */}
					{isModalOpen && (
						<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
							<div className="w-full max-w-md rounded-xl border border-border bg-card/95 backdrop-blur p-6 shadow-2xl">
								<h2 className="mb-6 text-xl font-bold flex items-center gap-2 text-foreground">
									<StoreIcon className="h-5 w-5 text-primary" />
									{editingStore ? "Edit Store" : "Create Store"}
								</h2>
								<div className="space-y-4">
									<div>
										<label className="block text-sm font-medium mb-2 text-foreground">Store Name</label>
										<input
											type="text"
											value={formData.name}
											onChange={(e) => setFormData({ ...formData, name: e.target.value })}
											placeholder="e.g., Main Store"
											className="w-full rounded-lg border border-input bg-background/50 px-4 py-2.5 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium mb-2 text-foreground">Address</label>
										<input
											type="text"
											value={formData.address}
											onChange={(e) => setFormData({ ...formData, address: e.target.value })}
											placeholder="e.g., 123 Main St"
											className="w-full rounded-lg border border-input bg-background/50 px-4 py-2.5 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium mb-2 text-foreground">Phone</label>
										<input
											type="tel"
											value={formData.phone}
											onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
											placeholder="e.g., (555) 123-4567"
											className="w-full rounded-lg border border-input bg-background/50 px-4 py-2.5 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
										/>
									</div>
								</div>
								<div className="mt-6 flex gap-3">
									<button
										type="button"
										onClick={() => {
											setIsModalOpen(false);
											setEditingStore(null);
											setFormData({ name: "", address: "", phone: "" });
										}}
										disabled={createMutation.isPending || updateMutation.isPending}
										className="flex-1 rounded-lg border border-border py-2.5 font-medium hover:bg-muted text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
									>
										Cancel
									</button>
									<button
										type="button"
										onClick={handleSubmit}
										disabled={
											!formData.name ||
											!formData.address ||
											!formData.phone ||
											createMutation.isPending ||
											updateMutation.isPending
										}
										className="flex-1 rounded-lg bg-gradient-to-r from-primary to-accent py-2.5 font-semibold hover:from-accent hover:to-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 text-primary-foreground"
									>
										{createMutation.isPending || updateMutation.isPending ? (
											<>
												<Loader2 className="h-4 w-4 animate-spin" />
												<span>{editingStore ? "Saving..." : "Creating..."}</span>
											</>
										) : (
											<span>{editingStore ? "Save Changes" : "Create Store"}</span>
										)}
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			</DashboardLayout>
		</RequireRole>
	);
}
