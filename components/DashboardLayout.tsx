"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<div className="min-h-screen bg-background">
			{/* Sidebar */}
			<Sidebar isOpen={sidebarOpen} />
			{/* Mobile Overlay */}
			{sidebarOpen && (
				<button
					type="button"
					className="fixed inset-0 z-30 bg-black/50 lg:hidden"
					onClick={() => setSidebarOpen(false)}
					onKeyDown={(e) => {
						if (e.key === "Escape") setSidebarOpen(false);
					}}
					aria-label="Close sidebar"
				/>
			)}{" "}
			{/* Main Content */}
			<div className="lg:pl-64">
				<Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
				<main className="p-4 lg:p-6">{children}</main>
			</div>
		</div>
	);
}
