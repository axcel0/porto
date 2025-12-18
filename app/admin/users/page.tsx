"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EditIcon, Loader2, TrashIcon, UserPlus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import RequireRole from "@/components/RequireRole";
import { api } from "@/lib/api";

interface User {
	id: number;
	name: string;
	email: string;
	role?: string;
	createdAt?: string;
}

export default function UsersPage() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingUser, setEditingUser] = useState<User | null>(null);
	const [formData, setFormData] = useState({ name: "", email: "", password: "" });
	const queryClient = useQueryClient();

	const { data: usersData, isLoading, isError, error } = useQuery({
		queryKey: ["users"],
		queryFn: async () => {
			const response = await api.get<{ success: boolean; data: User[]; pagination?: any }>("/api/v1/users");
			return response;
		},
	});

	const createMutation = useMutation({
		mutationFn: (data: { name: string; email: string; password: string }) =>
			api.post("/api/v1/users", data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
			setIsModalOpen(false);
			setFormData({ name: "", email: "", password: "" });
			toast.success("User created successfully!");
		},
		onError: (error: any) => {
			toast.error(error?.message || "Failed to create user");
		},
	});

	const updateMutation = useMutation({
		mutationFn: (data: User) =>
			api.put(`/api/v1/users/${data.id}`, {
				name: data.name,
				email: data.email,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
			setEditingUser(null);
			setIsModalOpen(false);
			setFormData({ name: "", email: "", password: "" });
			toast.success("User updated successfully!");
		},
		onError: (error: any) => {
			toast.error(error?.message || "Failed to update user");
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (id: number) => api.delete(`/api/v1/users/${id}`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
			toast.success("User deleted successfully!");
		},
		onError: (error: any) => {
			toast.error(error?.message || "Failed to delete user");
		},
	});

	const users = Array.isArray(usersData?.data) ? usersData.data : [];

	const handleOpenModal = (user?: User) => {
		if (user) {
			setEditingUser(user);
			setFormData({ name: user.name, email: user.email, password: "" });
		} else {
			setEditingUser(null);
			setFormData({ name: "", email: "", password: "" });
		}
		setIsModalOpen(true);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.name?.trim() || !formData.email?.trim()) {
			toast.error("Name and email are required");
			return;
		}

		if (!editingUser && !formData.password?.trim()) {
			toast.error("Password is required for new users");
			return;
		}

		if (editingUser) {
			updateMutation.mutate({ ...editingUser, name: formData.name, email: formData.email });
		} else {
			createMutation.mutate(formData);
		}
	};

	const handleDelete = (id: number, name: string) => {
		const toastId = toast.custom(
			(t) => (
				<div className="bg-card border border-border rounded-lg p-4 shadow-xl min-w-[300px]">
					<p className="text-foreground font-medium mb-3">Delete user "{name}"?</p>
					<p className="text-muted-foreground text-sm mb-4">This action cannot be undone.</p>
					<div className="flex gap-2 justify-end">
						<button
							onClick={() => {
								toast.dismiss(t);
							}}
							className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-md text-sm font-medium transition-colors"
						>
							Cancel
						</button>
						<button
							onClick={() => {
								deleteMutation.mutate(id);
								toast.dismiss(t);
							}}
							disabled={deleteMutation.isPending}
							className="px-4 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
						>
							{deleteMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
							Delete
						</button>
					</div>
				</div>
			),
			{ duration: 10000 },
		);
	};

	return (
		<RequireRole roles={["admin", "superadmin"]}>
			<DashboardLayout>
				<div className="max-w-6xl mx-auto space-y-6">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-2xl font-bold text-foreground">User Management</h1>
							<p className="text-muted-foreground text-sm mt-1">Manage system users and their access</p>
						</div>
						<button
							onClick={() => handleOpenModal()}
							className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-accent px-4 py-2.5 text-sm font-medium hover:from-accent hover:to-primary transition-colors text-primary-foreground shadow-lg shadow-primary/25"
						>
							<UserPlus className="h-4 w-4" />
							Create User
						</button>
					</div>

					{isLoading ? (
						<div className="flex items-center justify-center py-20">
							<div className="text-center space-y-3">
								<Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
								<p className="text-muted-foreground">Loading users...</p>
							</div>
						</div>
					) : isError ? (
						<div className="rounded-xl border border-destructive/50 bg-destructive/10 p-6 text-center">
							<p className="text-destructive font-medium mb-2">Failed to load users</p>
							<p className="text-muted-foreground text-sm">{(error as any)?.message || "Please try again"}</p>
							<button
								onClick={() => queryClient.invalidateQueries({ queryKey: ["users"] })}
								className="mt-4 px-4 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg text-sm transition-colors"
							>
								Retry
							</button>
						</div>
					) : users.length === 0 ? (
						<div className="rounded-xl border border-border bg-card/50 p-12 text-center">
							<UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
							<h3 className="text-lg font-medium text-foreground mb-2">No users found</h3>
							<p className="text-muted-foreground text-sm mb-4">Create your first user to get started</p>
							<button
								onClick={() => handleOpenModal()}
								className="px-4 py-2 bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary rounded-lg text-sm transition-colors text-primary-foreground font-medium"
							>
								Create User
							</button>
						</div>
					) : (
						<div className="rounded-xl border border-border bg-card/50 overflow-hidden">
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead className="bg-muted/50 border-b border-border">
										<tr>
											<th className="px-4 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
												Name
											</th>
											<th className="px-4 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
												Email
											</th>
											<th className="px-4 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
												Role
											</th>
											<th className="px-4 py-3 text-right text-xs font-medium text-foreground uppercase tracking-wider">
												Actions
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-border">
										{users.map((user) => (
											<tr key={user.id} className="hover:bg-muted/20 transition-colors">
												<td className="px-4 py-3 text-sm font-medium text-foreground">{user.name}</td>
												<td className="px-4 py-3 text-sm text-muted-foreground">{user.email}</td>
												<td className="px-4 py-3 text-sm">
													<span
														className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
															user.role === "superadmin"
																? "bg-destructive/20 text-destructive border border-destructive/30"
																: user.role === "admin"
																	? "bg-primary/20 text-primary border border-primary/30"
																	: "bg-muted text-muted-foreground border border-border/50"
														}`}
													>
														{user.role || "user"}
													</span>
												</td>
												<td className="px-4 py-3 text-sm text-right">
													<div className="flex items-center justify-end gap-2">
														<button
															onClick={() => handleOpenModal(user)}
															className="p-2 text-primary hover:text-primary/80 hover:bg-primary/10 rounded-lg transition-colors"
															title="Edit"
														>
															<EditIcon className="h-4 w-4" />
														</button>
														<button
															onClick={() => handleDelete(user.id, user.name)}
															className="p-2 text-destructive hover:text-destructive/80 hover:bg-destructive/10 rounded-lg transition-colors"
															title="Delete"
														>
															<TrashIcon className="h-4 w-4" />
														</button>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}

					{/* Modal */}
					{isModalOpen && (
						<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
							<div className="w-full max-w-md rounded-xl border border-border bg-card shadow-2xl">
								<div className="flex items-center justify-between border-b border-border px-6 py-4">
									<h2 className="text-lg font-semibold text-foreground">{editingUser ? "Edit User" : "Create User"}</h2>
									<button
										onClick={() => {
											setIsModalOpen(false);
											setEditingUser(null);
											setFormData({ name: "", email: "", password: "" });
										}}
										className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-muted rounded-lg"
									>
										<X className="h-5 w-5" />
									</button>
								</div>
								<form onSubmit={handleSubmit} className="p-6 space-y-4">
									<div>
										<label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
											Name <span className="text-destructive">*</span>
										</label>
										<input
											id="name"
											type="text"
											value={formData.name}
											onChange={(e) => setFormData({ ...formData, name: e.target.value })}
											placeholder="John Doe"
											className="w-full rounded-lg border border-input bg-background/50 px-4 py-2.5 text-foreground placeholder-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
											required
										/>
									</div>
									<div>
										<label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
											Email <span className="text-destructive">*</span>
										</label>
										<input
											id="email"
											type="email"
											value={formData.email}
											onChange={(e) => setFormData({ ...formData, email: e.target.value })}
											placeholder="john@example.com"
											className="w-full rounded-lg border border-input bg-background/50 px-4 py-2.5 text-foreground placeholder-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
											required
										/>
									</div>
									{!editingUser && (
										<div>
											<label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
												Password <span className="text-destructive">*</span>
											</label>
											<input
												id="password"
												type="password"
												value={formData.password}
												onChange={(e) => setFormData({ ...formData, password: e.target.value })}
												placeholder="••••••••"
												className="w-full rounded-lg border border-input bg-background/50 px-4 py-2.5 text-foreground placeholder-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
												required={!editingUser}
												minLength={6}
											/>
											<p className="mt-1.5 text-xs text-muted-foreground">Minimum 6 characters</p>
										</div>
									)}
									<div className="flex gap-3 pt-4">
										<button
											type="button"
											onClick={() => {
												setIsModalOpen(false);
												setEditingUser(null);
												setFormData({ name: "", email: "", password: "" });
											}}
											className="flex-1 rounded-lg border border-border bg-muted/50 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
										>
											Cancel
										</button>
										<button
											type="submit"
											disabled={createMutation.isPending || updateMutation.isPending}
											className="flex-1 rounded-lg bg-gradient-to-r from-primary to-accent px-4 py-2.5 text-sm font-medium hover:from-accent hover:to-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-primary-foreground"
										>
											{(createMutation.isPending || updateMutation.isPending) && (
												<Loader2 className="h-4 w-4 animate-spin" />
											)}
											{editingUser ? "Update" : "Create"}
										</button>
									</div>
								</form>
							</div>
						</div>
					)}
				</div>
			</DashboardLayout>
		</RequireRole>
	);
}
