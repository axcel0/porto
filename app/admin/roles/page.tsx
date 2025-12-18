"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, Shield, UserCog } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import RequireRole from "@/components/RequireRole";
import { api } from "@/lib/api";
import type { ApiResponse } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface PromoteUser {
	id: number;
	name: string;
	email: string;
	role?: string;
}

const ROLES = [
	{ value: "user", label: "User", description: "Can view products and make transactions", color: "text-blue-400" },
	{ value: "admin", label: "Admin", description: "User + Manage products, categories, stock", color: "text-yellow-400" },
	{
		value: "superadmin",
		label: "Superadmin",
		description: "Admin + Manage users, stores, audit logs",
		color: "text-red-400",
	},
];

const PERMISSIONS = [
	{ feature: "View Products", user: "✓", admin: "✓", superadmin: "✓" },
	{ feature: "Make Transactions", user: "✓", admin: "✓", superadmin: "✓" },
	{ feature: "Manage Products", user: "✗", admin: "✓", superadmin: "✓" },
	{ feature: "Manage Categories", user: "✗", admin: "✓", superadmin: "✓" },
	{ feature: "View Analytics", user: "✗", admin: "✓", superadmin: "✓" },
	{ feature: "Manage Stock", user: "✗", admin: "✓", superadmin: "✓" },
	{ feature: "Manage Users", user: "✗", admin: "✗", superadmin: "✓" },
	{ feature: "Manage Stores", user: "✗", admin: "✗", superadmin: "✓" },
	{ feature: "View Audit Logs", user: "✗", admin: "✗", superadmin: "✓" },
	{ feature: "Role Management", user: "✗", admin: "✗", superadmin: "✓" },
];

export default function RoleSettingsPage() {
	const queryClient = useQueryClient();
	const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
	const [selectedRole, setSelectedRole] = useState<string>("");

	const { data: usersData, isLoading } = useQuery({
		queryKey: ["users-for-role"],
		queryFn: async () => {
			const response = await api.get<{ success: boolean; data: PromoteUser[]; pagination?: any }>("/api/v1/users");
			return response;
		},
		retry: false,
	});

	const users = Array.isArray(usersData?.data) ? usersData.data : [];

	const promoteMutation = useMutation({
		mutationFn: async ({ userId, role }: { userId: number; role: string }) => {
			return api.put(`/api/v1/users/${userId}/role`, { role });
		},
		onSuccess: () => {
			toast.success("User role updated successfully!");
			setSelectedUserId(null);
			setSelectedRole("");
			queryClient.invalidateQueries({ queryKey: ["users-for-role"] });
		},
		onError: (error: any) => {
			toast.error(error?.message || "Failed to update user role");
		},
	});

	const handlePromote = () => {
		if (!selectedUserId || !selectedRole) return;
		promoteMutation.mutate({ userId: selectedUserId, role: selectedRole });
	};

	return (
		<RequireRole roles={["superadmin"]}>
			<DashboardLayout>
			<div className="max-w-6xl mx-auto space-y-6">
				{/* Role Definitions */}
				<section>
					<div className="flex items-center gap-3 mb-4">
						<div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
							<Shield className="h-6 w-6 text-primary" />
						</div>
						<h1 className="text-2xl font-bold text-foreground">Role Settings</h1>
					</div>
					<div className="grid gap-4 md:grid-cols-3">
						{ROLES.map((role) => (
							<div
								key={role.value}
								className="rounded-lg border border-border bg-card/50 backdrop-blur p-4 hover:border-border/80 transition-colors"
							>
								<h3 className={`font-semibold ${role.color}`}>{role.label}</h3>
								<p className="mt-2 text-sm text-muted-foreground">{role.description}</p>
							</div>
						))}
					</div>
				</section>

				{/* Permission Matrix */}
				<section>
					<h2 className="text-xl font-bold mb-4 text-foreground">Permission Matrix</h2>
					<div className="overflow-x-auto rounded-lg border border-border bg-card/50 backdrop-blur">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b border-border bg-muted/50">
									<th className="px-4 py-3 text-left font-semibold text-foreground">Feature</th>
									<th className="px-4 py-3 text-center font-semibold text-primary">User</th>
									<th className="px-4 py-3 text-center font-semibold text-accent">Admin</th>
									<th className="px-4 py-3 text-center font-semibold text-destructive">Superadmin</th>
								</tr>
							</thead>
							<tbody>
								{PERMISSIONS.map((row) => (
									<tr key={row.feature} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
										<td className="px-4 py-3 font-medium text-foreground">{row.feature}</td>
										<td className="px-4 py-3 text-center">
											<span className={row.user === "✓" ? "text-primary" : "text-destructive"}>{row.user}</span>
										</td>
										<td className="px-4 py-3 text-center">
											<span className={row.admin === "✓" ? "text-primary" : "text-destructive"}>{row.admin}</span>
										</td>
										<td className="px-4 py-3 text-center">
											<span className={row.superadmin === "✓" ? "text-primary" : "text-destructive"}>
												{row.superadmin}
											</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</section>

				{/* Promote User */}
				<section>
					<div className="flex items-center gap-3 mb-4">
						<div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
							<UserCog className="h-6 w-6 text-primary" />
						</div>
						<h2 className="text-xl font-bold text-foreground">Promote User</h2>
					</div>
					<div className="rounded-lg border border-border bg-card/50 backdrop-blur p-6">
						{isLoading ? (
							<div className="flex items-center justify-center py-8">
								<Loader2 className="h-8 w-8 animate-spin text-primary" />
							</div>
						) : (
								<>
									<div className="grid gap-6 md:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="user-select" className="text-foreground">Select User</Label>
											<Select
												value={selectedUserId?.toString() || ""}
												onValueChange={(value) => setSelectedUserId(value ? Number(value) : null)}
												disabled={promoteMutation.isPending}
											>
												<SelectTrigger id="user-select">
													<SelectValue placeholder="Select a user..." />
												</SelectTrigger>
												<SelectContent>
													{users.map((user) => (
														<SelectItem key={user.id} value={user.id.toString()}>
															{user.name} ({user.email}) - {user.role || "user"}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
									</div>

									<div className="space-y-2">
										<Label htmlFor="role-select" className="text-foreground">Select New Role</Label>
											<Select
												value={selectedRole}
												onValueChange={setSelectedRole}
												disabled={promoteMutation.isPending}
											>
												<SelectTrigger id="role-select">
													<SelectValue placeholder="Choose a role..." />
												</SelectTrigger>
												<SelectContent>
													{ROLES.map((role) => (
														<SelectItem key={role.value} value={role.value}>
															<span className={role.color}>{role.label}</span>
														</SelectItem>
													))}
												</SelectContent>
											</Select>
									</div>

								<Button
									type="button"
									onClick={handlePromote}
									disabled={!selectedUserId || !selectedRole || promoteMutation.isPending}
									className="mt-6 w-full bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-primary-foreground disabled:opacity-50"
									size="lg"
								>
									{promoteMutation.isPending ? (
										<>
											<Loader2 className="h-5 w-5 animate-spin mr-2" />
											<span>Promoting...</span>
										</>
									) : (
										<>
											<UserCog className="h-5 w-5 mr-2" />
											<span>Promote User</span>
										</>
									)}
								</Button>
							</>
						)}
					</div>
					</section>
				</div>
			</DashboardLayout>
		</RequireRole>
	);
}
