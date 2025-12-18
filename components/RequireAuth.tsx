"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAccessToken } from "@/lib/auth";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const [ready, setReady] = useState(false);

	useEffect(() => {
		const token = getAccessToken();
		if (!token) {
			router.replace("/auth/login");
		} else {
			setReady(true);
		}
	}, [router]);

	if (!ready) return null;
	return <>{children}</>;
}
