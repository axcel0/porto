"use client";

import { useQuery } from "@tanstack/react-query";
import {
	BarChartIcon,
	BoxIcon,
	FileTextIcon,
	HomeIcon,
	PackageIcon,
	ReceiptIcon,
	ShieldIcon,
	ShoppingCartIcon,
	StoreIcon,
	TagIcon,
	UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { api } from "@/lib/api";
import type { ApiResponse, User } from "@/lib/types";

interface NavItem {
	label: string;
	href: string;
	icon: React.ComponentType<{ className?: string }>;
	roles?: Array<User["role"]>;
}

const navigation: NavItem[] = [
	{ label: "Dashboard", href: "/dashboard", icon: HomeIcon },
	{ label: "Products", href: "/products", icon: PackageIcon },
	{ label: "Categories", href: "/categories", icon: TagIcon },
	{ label: "Checkout", href: "/checkout", icon: ShoppingCartIcon },
	{ label: "Orders", href: "/orders", icon: ReceiptIcon },
	{
		label: "User Management",
		href: "/admin/users",
		icon: UsersIcon,
		roles: ["admin", "superadmin"],
	},
	{
		label: "Analytics",
		href: "/analytics",
		icon: BarChartIcon,
		roles: ["admin", "superadmin"],
	},
	{
		label: "Stock Ops",
		href: "/stock",
		icon: BoxIcon,
		roles: ["admin", "superadmin"],
	},
	{
		label: "Stores",
		href: "/admin/stores",
		icon: StoreIcon,
		roles: ["superadmin"],
	},
	{
		label: "Audit Logs",
		href: "/admin/audit-logs",
		icon: FileTextIcon,
		roles: ["superadmin"],
	},
	{
		label: "Role Settings",
		href: "/admin/roles",
		icon: ShieldIcon,
		roles: ["superadmin"],
	},
];

export default function Sidebar({ isOpen }: { isOpen: boolean }) {
	const pathname = usePathname();

	const { data } = useQuery({
		queryKey: ["me"],
		queryFn: () => api.get<ApiResponse<User>>("/api/v1/auth/profile"),
		retry: false,
	});

	const userRole = data?.data?.role;

	const filteredNav = navigation.filter(
		(item) => !item.roles || (userRole && item.roles.includes(userRole)),
	);

	return (
		<aside
			className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-card border-r border-border transition-transform duration-300 lg:translate-x-0 ${
				isOpen ? "translate-x-0" : "-translate-x-full"
			}`}
		>
			<div className="flex h-full flex-col">
				{/* Logo */}
				<div className="flex h-16 items-center border-b border-border px-6">
					<Link href="/dashboard" className="flex items-center gap-2">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
							<span className="text-lg font-bold text-primary-foreground">P</span>
						</div>
						<span className="text-lg font-bold text-card-foreground">POS01</span>
					</Link>
				</div>

				{/* Navigation */}
				<nav className="flex-1 overflow-y-auto px-3 py-4">
					<ul className="space-y-1">
						{filteredNav.map((item) => {
							const isActive = pathname === item.href;
							const Icon = item.icon;
							return (
								<li key={item.href}>
									<Link
										href={item.href}
										className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
											isActive
												? "bg-primary text-primary-foreground"
												: "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
										}`}
									>
										<Icon className="h-5 w-5" />
										<span>{item.label}</span>
									</Link>
								</li>
							);
						})}
					</ul>
				</nav>

				{/* User Info */}
				{data?.data && (
					<div className="border-t border-border p-4">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-bold text-primary-foreground">
								{data.data.name.charAt(0).toUpperCase()}
							</div>
							<div className="flex-1 overflow-hidden">
								<p className="truncate text-sm font-medium text-foreground">{data.data.name}</p>
								<p className="text-xs uppercase tracking-wide text-muted-foreground">{data.data.role}</p>
							</div>
						</div>
					</div>
				)}
			</div>
		</aside>
	);
}
