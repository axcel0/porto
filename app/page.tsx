"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getAccessToken } from "@/lib/auth";

export default function HomePage() {
	const router = useRouter();
	useEffect(() => {
		const token = getAccessToken();
		router.replace(token ? "/dashboard" : "/auth/login");
	}, [router]);
	return <div className="p-6">Loading...</div>;
}
