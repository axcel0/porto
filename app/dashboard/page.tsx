"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import RequireAuth from "@/components/RequireAuth";
import { api } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import type { ApiResponse } from "@/lib/types";

interface ProfileRes {
	id: number;
	name: string;
	email: string;
	role?: string;
}

export default function DashboardPage() {
	const router = useRouter();
	const hasToken = typeof window !== "undefined" && !!getAccessToken();

	const { data, isLoading, isError } = useQuery({
		queryKey: ["me"],
		queryFn: () => api.get<ApiResponse<ProfileRes>>("/api/v1/auth/profile"),
		enabled: hasToken,
	});

	if (!hasToken) {
		router.replace("/auth/login");
		return null;
	}

	return (
		<RequireAuth>
			<DashboardLayout>
				<div className="max-w-4xl mx-auto">
					<h1 className="text-2xl font-bold mb-4 text-foreground">Welcome Back!</h1>
					{isLoading && <p className="text-muted-foreground">Loading profile...</p>}
					{isError && <p className="text-destructive">Failed to load profile</p>}
					{data?.data && (
						<div className="space-y-4">
							<div className="rounded-xl border border-border bg-card/50 p-6">
								<h2 className="text-lg font-semibold mb-3 text-foreground">Profile Information</h2>
								<dl className="space-y-2">
									<div>
										<dt className="text-sm text-muted-foreground">Name</dt>
										<dd className="text-base font-medium text-foreground">{data.data.name}</dd>
									</div>
									<div>
										<dt className="text-sm text-muted-foreground">Email</dt>
										<dd className="text-base font-medium text-foreground">{data.data.email}</dd>
									</div>
									<div>
										<dt className="text-sm text-muted-foreground">Role</dt>
										<dd>
											<span className="inline-flex items-center rounded-md border border-primary bg-primary/10 px-2 py-0.5 text-xs uppercase tracking-wide text-primary">
												{data.data.role ?? "-"}
											</span>
										</dd>
									</div>
								</dl>
							</div>
						</div>
					)}
				</div>
			</DashboardLayout>
		</RequireAuth>
	);
}
