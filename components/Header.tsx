"use client";

import { BellIcon, LogOutIcon, MenuIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { clearTokens } from "@/lib/auth";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
	const router = useRouter();

	const handleLogout = () => {
		clearTokens();
		router.replace("/auth/login");
	};

	return (
		<header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/95 backdrop-blur px-4 lg:px-6">
			{/* Mobile Menu Button */}
			<button
				type="button"
				onClick={onMenuClick}
				className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden transition-colors"
				aria-label="Toggle menu"
			>
				<MenuIcon className="h-6 w-6" />
			</button>

			{/* Page Title - Hidden on Mobile */}
			<div className="hidden lg:block">
				<h1 className="text-lg font-semibold text-foreground">Point of Sale Dashboard</h1>
			</div>

			{/* Right Actions */}
			<div className="flex items-center gap-2">
				{/* Theme Toggle */}
				<ThemeToggle />
				
				{/* Notifications */}
				<button
					type="button"
					className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
					aria-label="Notifications"
				>
					<BellIcon className="h-5 w-5" />
					<span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
				</button>

				{/* Logout */}
				<button
					type="button"
					onClick={handleLogout}
					className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
				>
					<LogOutIcon className="h-4 w-4" />
					<span className="hidden sm:inline">Logout</span>
				</button>
			</div>
		</header>
	);
}
