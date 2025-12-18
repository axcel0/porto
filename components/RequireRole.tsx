"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { api } from "@/lib/api";
import type { ApiResponse, User } from "@/lib/types";

export default function RequireRole({
	children,
	roles,
}: {
	children: React.ReactNode;
	roles: Array<User["role"]>;
}) {
	const router = useRouter();

	const { data, isLoading, isError } = useQuery({
		queryKey: ["me"],
		queryFn: () => api.get<ApiResponse<User>>("/api/v1/auth/profile"),
	});

	useEffect(() => {
		if (isError) {
			router.replace("/auth/login");
			return;
		}
		const role = data?.data?.role;
		if (!isLoading && (!role || !roles.includes(role))) {
			router.replace("/dashboard");
		}
	}, [isError, isLoading, data, roles, router]);

	if (isLoading) return null;
	const role = data?.data?.role;
	if (!role || !roles.includes(role)) return null;
	return <>{children}</>;
}
