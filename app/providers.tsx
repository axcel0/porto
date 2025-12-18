"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function Providers({ children }: { children: ReactNode }) {
	const [client] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 30 * 1000, // 30 seconds
						refetchOnWindowFocus: false,
						retry: 1,
					},
					mutations: {
						retry: 1,
					},
				},
			}),
	);
	return (
		<QueryClientProvider client={client}>
			<ThemeProvider>
				<Toaster position="top-right" richColors closeButton expand={false} />
				{children}
			</ThemeProvider>
		</QueryClientProvider>
	);
}
