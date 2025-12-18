"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EditIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import RequireRole from "@/components/RequireRole";
import { api } from "@/lib/api";
import type { ApiResponse } from "@/lib/types";

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
    const [formData, setFormData] = useState({ name: "", email: "" });
    const queryClient = useQueryClient();

    // Response: { success: true, data: User[], pagination: {...} }
    const { data: usersData, isLoading, error } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const response = await api.get<{ success: boolean; data: User[]; pagination?: any }>("/api/v1/users");
            console.log("Users API response:", response);
            return response;
        },
        retry: false,
        refetchOnMount: true,
        staleTime: 0,
    });

    const createMutation = useMutation({
        mutationFn: (data: Omit<User, "id">) => api.post("/api/v1/users", data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            setIsModalOpen(false);
            setFormData({ name: "", email: "" });
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
            setFormData({ name: "", email: "" });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => api.delete(`/api/v1/users/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });

    // Response structure: { success: true, data: User[], pagination: {...} }
    const users = Array.isArray(usersData?.data) ? usersData.data : [];

    const handleOpenModal = (user?: User) => {
        if (user) {
            setEditingUser(user);
            setFormData({ name: user.name, email: user.email });
        } else {
            setEditingUser(null);
            setFormData({ name: "", email: "" });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = () => {
        if (!formData.name || !formData.email) return;

        if (editingUser) {
            updateMutation.mutate({ ...editingUser, ...formData });
        } else {
            createMutation.mutate({ name: formData.name, email: formData.email });
        }
    };

    const handleDelete = (id: number) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <RequireRole roles={["admin", "superadmin"]}>
            <DashboardLayout>
                <div className="max-w-6xl mx-auto">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-2xl font-bold">User Management</h1>
                        <button
                            type="button"
                            onClick={() => handleOpenModal()}
                            className="rounded-md bg-blue-600 px-4 py-2 font-medium hover:bg-blue-500"
                        >
                            + Create User
                        </button>
                    </div>

                    {/* Users Table */}
                    <div className="overflow-x-auto rounded-lg border border-gray-700 bg-gray-900">
                        {isLoading ? (
                            <div className="p-6 text-center text-gray-400">Loading users...</div>
                        ) : users.length > 0 ? (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-700 bg-gray-800">
                                        <th className="px-4 py-3 text-left font-semibold">Name</th>
                                        <th className="px-4 py-3 text-left font-semibold">Email</th>
                                        <th className="px-4 py-3 text-left font-semibold">Role</th>
                                        <th className="px-4 py-3 text-left font-semibold">Created</th>
                                        <th className="px-4 py-3 text-right font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-800/50">
                                            <td className="px-4 py-3 font-medium">{user.name}</td>
                                            <td className="px-4 py-3 text-gray-400">{user.email}</td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${user.role === "superadmin"
                                                            ? "bg-red-900/30 text-red-400"
                                                            : user.role === "admin"
                                                                ? "bg-yellow-900/30 text-yellow-400"
                                                                : "bg-blue-900/30 text-blue-400"
                                                        }`}
                                                >
                                                    {user.role || "user"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-xs text-gray-500">
                                                {user.createdAt
                                                    ? new Date(user.createdAt).toLocaleDateString()
                                                    : "-"}
                                            </td>
                                            <td className="px-4 py-3 flex items-center justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleOpenModal(user)}
                                                    className="rounded p-1.5 text-gray-400 hover:bg-gray-700 hover:text-white"
                                                >
                                                    <EditIcon className="h-4 w-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(user.id)}
                                                    className="rounded p-1.5 text-gray-400 hover:bg-red-900/30 hover:text-red-400"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-6 text-center text-gray-400">No users found. Create one to get started.</div>
                        )}
                    </div>

                    {/* Create/Edit Modal */}
                    {isModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                            <div className="w-full max-w-md rounded-lg border border-gray-700 bg-gray-900 p-6">
                                <h2 className="mb-4 text-xl font-bold">
                                    {editingUser ? "Edit User" : "Create User"}
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g., John Doe"
                                            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Email</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="e.g., john@example.com"
                                            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="mt-6 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 rounded-lg border border-gray-700 py-2 font-medium hover:bg-gray-800"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={
                                            !formData.name ||
                                            !formData.email ||
                                            createMutation.isPending ||
                                            updateMutation.isPending
                                        }
                                        className="flex-1 rounded-lg bg-blue-600 py-2 font-medium hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {editingUser ? (updateMutation.isPending ? "Saving..." : "Save") : createMutation.isPending ? "Creating..." : "Create"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Info Box */}
                    <div className="mt-6 rounded-lg border border-gray-700 bg-gray-800/50 p-4 text-sm text-gray-400">
                        <p className="font-semibold mb-2">💡 Tip:</p>
                        <p>To promote users to admin or superadmin roles, use the <strong>Role Settings</strong> page from the sidebar.</p>
                    </div>
                </div>
            </DashboardLayout>
        </RequireRole>
    );
}
