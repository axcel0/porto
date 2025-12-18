"use client";

import { useQuery } from "@tanstack/react-query";
import { TrendingUpIcon, TrendingDownIcon, DollarSignIcon, PackageIcon, ShoppingCartIcon, UsersIcon } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import RequireRole from "@/components/RequireRole";
import { api } from "@/lib/api";
import type { ApiResponse } from "@/lib/types";

interface AnalyticsData {
revenue: {
total: number;
change: number;
trend: "up" | "down";
};
orders: {
total: number;
change: number;
trend: "up" | "down";
};
products: {
total: number;
lowStock: number;
};
customers: {
total: number;
newThisMonth: number;
};
topProducts: Array<{
id: number;
name: string;
sales: number;
revenue: number;
}>;
recentOrders: Array<{
id: number;
customerName: string;
total: number;
status: string;
date: string;
}>;
}

const KPICard = ({
title,
value,
change,
trend,
icon: Icon,
color,
}: {
title: string;
value: string;
change?: string;
trend?: "up" | "down";
icon: React.ComponentType<{ className?: string }>;
color: string;
}) => (
<div className="rounded-lg border border-border bg-card/50 p-6">
<div className="flex items-center justify-between">
<div>
<p className="text-sm text-muted-foreground">{title}</p>
<h3 className="mt-2 text-3xl font-bold text-foreground">{value}</h3>
{change && trend && (
<div className={`mt-2 flex items-center gap-1 text-sm ${trend === "up" ? "text-primary" : "text-destructive"}`}>
{trend === "up" ? (
<TrendingUpIcon className="h-4 w-4" />
) : (
<TrendingDownIcon className="h-4 w-4" />
)}
<span>{change} from last month</span>
</div>
)}
</div>
<div className={`rounded-full ${color} p-3`}>
<Icon className="h-6 w-6 text-primary-foreground" />
</div>
</div>
</div>
);

export default function AnalyticsPage() {
const { data: analyticsData, isLoading } = useQuery({
queryKey: ["analytics"],
queryFn: () => api.get<ApiResponse<AnalyticsData>>("/api/v1/analytics"),
retry: false,
});

const analytics = analyticsData?.data;

return (
<RequireRole roles={["admin", "superadmin"]}>
<DashboardLayout>
<div className="max-w-7xl mx-auto space-y-6">
<h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>

{isLoading ? (
<div className="text-center py-12">
<p className="text-muted-foreground">Loading analytics...</p>
</div>
) : (
<>
{/* KPI Cards */}
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
<KPICard
title="Total Revenue"
value={`$${analytics?.revenue?.total?.toLocaleString() || "0"}`}
change={
analytics?.revenue?.change !== undefined
? `${analytics.revenue.change >= 0 ? "+" : ""}${analytics.revenue.change}%`
: undefined
}
trend={analytics?.revenue?.trend}
icon={DollarSignIcon}
color="bg-primary/10 border border-primary/20"
/>
<KPICard
title="Total Orders"
value={analytics?.orders?.total?.toString() || "0"}
change={
analytics?.orders?.change !== undefined
? `${analytics.orders.change >= 0 ? "+" : ""}${analytics.orders.change}%`
: undefined
}
trend={analytics?.orders?.trend}
icon={ShoppingCartIcon}
color="bg-accent/10 border border-accent/20"
/>
<KPICard
title="Products"
value={analytics?.products?.total?.toString() || "0"}
change={
analytics?.products?.lowStock !== undefined
? `${analytics.products.lowStock} low stock`
: undefined
}
icon={PackageIcon}
color="bg-secondary/10 border border-secondary/20"
/>
<KPICard
title="Customers"
value={analytics?.customers?.total?.toString() || "0"}
change={
analytics?.customers?.newThisMonth !== undefined
? `${analytics.customers.newThisMonth} new this month`
: undefined
}
icon={UsersIcon}
color="bg-muted/50"
/>
</div>

{/* Top Products */}
<div className="rounded-lg border border-border bg-card/50 p-6">
<h2 className="text-xl font-bold mb-4 text-foreground">Top Selling Products</h2>
<div className="overflow-x-auto">
<table className="w-full text-sm">
<thead>
<tr className="border-b border-border">
<th className="px-4 py-3 text-left font-semibold text-foreground">Product</th>
<th className="px-4 py-3 text-right font-semibold text-foreground">Sales</th>
<th className="px-4 py-3 text-right font-semibold text-foreground">Revenue</th>
</tr>
</thead>
<tbody>
{analytics?.topProducts && analytics.topProducts.length > 0 ? (
analytics.topProducts.map((product) => (
<tr key={product.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
<td className="px-4 py-3 text-foreground">{product.name}</td>
<td className="px-4 py-3 text-right text-muted-foreground">{product.sales}</td>
<td className="px-4 py-3 text-right font-medium text-primary">
${product.revenue.toLocaleString()}
</td>
</tr>
))
) : (
<tr>
<td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
No product data available
</td>
</tr>
)}
</tbody>
</table>
</div>
</div>

{/* Recent Orders */}
<div className="rounded-lg border border-border bg-card/50 p-6">
<h2 className="text-xl font-bold mb-4 text-foreground">Recent Orders</h2>
<div className="overflow-x-auto">
<table className="w-full text-sm">
<thead>
<tr className="border-b border-border">
<th className="px-4 py-3 text-left font-semibold text-foreground">Order ID</th>
<th className="px-4 py-3 text-left font-semibold text-foreground">Customer</th>
<th className="px-4 py-3 text-right font-semibold text-foreground">Total</th>
<th className="px-4 py-3 text-left font-semibold text-foreground">Status</th>
<th className="px-4 py-3 text-left font-semibold text-foreground">Date</th>
</tr>
</thead>
<tbody>
{analytics?.recentOrders && analytics.recentOrders.length > 0 ? (
analytics.recentOrders.map((order) => (
<tr key={order.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
<td className="px-4 py-3 text-muted-foreground">#{order.id}</td>
<td className="px-4 py-3 text-foreground">{order.customerName}</td>
<td className="px-4 py-3 text-right font-medium text-foreground">${order.total.toLocaleString()}</td>
<td className="px-4 py-3">
<span
className={`rounded-full px-2 py-1 text-xs font-medium ${
order.status === "completed"
? "bg-primary/10 text-primary border border-primary/20"
: order.status === "pending"
? "bg-accent/10 text-accent border border-accent/20"
: "bg-muted text-muted-foreground border border-border"
}`}
>
{order.status}
</span>
</td>
<td className="px-4 py-3 text-muted-foreground">
{new Date(order.date).toLocaleDateString()}
</td>
</tr>
))
) : (
<tr>
<td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
No recent orders
</td>
</tr>
)}
</tbody>
</table>
</div>
</div>
</>
)}
</div>
</DashboardLayout>
</RequireRole>
);
}
