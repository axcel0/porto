"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { api } from "@/lib/api";
import { setTokens } from "@/lib/auth";
import type { ApiResponse, LoginData } from "@/lib/types";

const schema = z.object({
	email: z.string().email("Please enter a valid email"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
	const router = useRouter();
	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: { email: "", password: "" },
	});

	const mutation = useMutation({
		mutationFn: (values: FormValues) => api.post<ApiResponse<LoginData>>("/api/v1/auth/login", values),
		onSuccess: (res) => {
			const tokens = res?.data;
			if (tokens?.access_token) {
				setTokens(tokens.access_token, tokens.refresh_token);
				toast.success("Welcome back!");
				router.replace("/dashboard");
			} else {
				toast.error("Invalid response from server");
			}
		},
		onError: (error: any) => {
			toast.error(error?.message || "Invalid email or password");
		},
	});

	return (
		<div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background via-background to-secondary">
			<div className="w-full max-w-md">
				<div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-8 shadow-2xl">
					<div className="text-center mb-8">
						<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20 mb-4">
							<LogIn className="h-8 w-8 text-primary" />
						</div>
						<h1 className="text-2xl font-bold text-foreground">Welcome to POS01</h1>
						<p className="text-muted-foreground text-sm mt-2">Sign in to continue to dashboard</p>
					</div>
					<form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-5">
						<div>
							<label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
								Email
							</label>
							<input
								id="email"
								type="email"
								{...form.register("email")}
								className="w-full rounded-lg border border-input bg-background/50 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
								placeholder="you@example.com"
							/>
							{form.formState.errors.email && (
								<p className="mt-2 text-sm text-destructive">{form.formState.errors.email.message}</p>
							)}
						</div>
						<div>
							<label htmlFor="password" className="mb-2 block text-sm font-medium text-foreground">
								Password
							</label>
							<input
								id="password"
								type="password"
								{...form.register("password")}
								className="w-full rounded-lg border border-input bg-background/50 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
								placeholder="••••••••"
							/>
							{form.formState.errors.password && (
								<p className="mt-2 text-sm text-destructive">{form.formState.errors.password.message}</p>
							)}
						</div>
						<button
							type="submit"
							disabled={mutation.isPending}
							className="w-full rounded-lg bg-gradient-to-r from-primary to-accent px-4 py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:from-primary hover:to-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
						>
							{mutation.isPending ? (
								<>
									<Loader2 className="h-5 w-5 animate-spin" />
									<span>Signing in...</span>
								</>
							) : (
								<>
									<LogIn className="h-5 w-5" />
									<span>Sign In</span>
								</>
							)}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
