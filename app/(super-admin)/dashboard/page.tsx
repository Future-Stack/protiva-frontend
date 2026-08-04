"use client";

import { useState, useMemo } from "react";
import DashboardCard from "@/components/DashboardCard";
import {
    ChevronDown,
    Link,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useGetSuperAdminDashboardQuery } from "@/lib/features/super-admin/dashboard/dashboardAPI";
import { useRouter } from "next/navigation";

export default function SuperAdminDashboard() {
    const router = useRouter();
    const { data: response, isLoading, isError } = useGetSuperAdminDashboardQuery();
    const dashboardData = response?.data;

    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);

    const chartData = useMemo(() => {
        if (!dashboardData?.analytics) return [];
        return dashboardData.analytics.map(item => ({
            month: item.month_name,
            value: parseFloat(item.completed_payment_total) || 0
        }));
    }, [dashboardData?.analytics]);

    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });
    };

    const fromNow = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        
        if (diffInSeconds < 60) return 'just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return date.toLocaleDateString();
    };

    if (isLoading) {
        return (
            <div className="space-y-8 p-6 animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-32 w-full bg-slate-100 rounded-xl" />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 h-[400px] bg-slate-100 rounded-xl" />
                    <div className="lg:col-span-4 h-[400px] bg-slate-100 rounded-xl" />
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-red-500 font-medium">Failed to load dashboard data. Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Business Analytics Heading */}
            <div className="bg-white border border-slate-100 p-5 rounded-[10px]">
                <h2 className="text-lg font-semibold text-slate-900 mb-3 ">Business Analytics</h2>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    <DashboardCard
                        title="Total earning"
                        value={`${parseFloat(dashboardData?.meta?.totalProviderEarningPayment || '0').toLocaleString()}৳`}
                        variant="cyan"
                    />
                    <DashboardCard
                        title="Total Users"
                        value={dashboardData?.meta?.totalUser?.toString() || "0"}
                        variant="green"
                    />
                    <DashboardCard
                        title="Total Provider"
                        value={dashboardData?.meta?.totalProvider?.toString() || "0"}
                        variant="orange"
                    />
                    <DashboardCard
                        title="Accepted Bookings"
                        value={dashboardData?.meta?.totalAcceptBooking?.toString() || "0"}
                        variant="pink"
                    />
                </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Earning Statistics - Chart Section */}
                <div className="lg:col-span-8 bg-white p-6 rounded-[10px] border border-slate-100">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-semibold text-slate-900">Earning Statistics</h3>
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-4 py-1.5 bg-[#F5F7FF] text-[#4153B3] rounded-[8px] text-sm font-medium">
                                Yearly
                            </button>
                            <div className="relative">
                                <button
                                    onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-white text-slate-900 rounded-[8px] text-sm font-medium border border-slate-200"
                                >
                                    {selectedYear} <ChevronDown size={16} />
                                </button>
                                {isYearDropdownOpen && (
                                    <div className="absolute top-full right-0 mt-1 bg-white border border-slate-200 rounded-[8px] shadow-lg z-10 w-full min-w-[80px]">
                                        {["2025", "2026", "2027"].map((year) => (
                                            <button
                                                key={year}
                                                onClick={() => {
                                                    setSelectedYear(year);
                                                    setIsYearDropdownOpen(false);
                                                }}
                                                className="block w-full text-left px-3 py-1.5 text-sm hover:bg-slate-50 text-slate-900 first:rounded-t-[8px] last:rounded-b-[8px]"
                                            >
                                                {year}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={chartData}
                                margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
                            >
                                <CartesianGrid
                                    strokeDasharray="0"
                                    stroke="#F1F5F9"
                                    vertical={true}
                                    horizontal={true}
                                />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }}
                                    dx={-5}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #E2E8F0',
                                        borderRadius: '8px',
                                        fontSize: '12px'
                                    }}
                                    labelStyle={{ fontWeight: 600, color: '#0F172A' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#0891B2"
                                    strokeWidth={2}
                                    dot={(props) => {
                                        const { cx, cy, index } = props;
                                        if (index === 0 || index === chartData.length - 1) {
                                            return (
                                                <circle
                                                    cx={cx}
                                                    cy={cy}
                                                    r={5}
                                                    fill="#0891B2"
                                                    stroke="none"
                                                />
                                            );
                                        }
                                        return null;
                                    }}
                                    activeDot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Transactions Section */}
                <div className="lg:col-span-4 bg-white p-6 rounded-[10px] border border-slate-100">
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-slate-900">Recent Transactions</h3>
                        <p className="text-sm font-medium text-slate-400 mt-1">{dashboardData?.recentTransection?.length || 0} Transactions this month</p>
                    </div>
                    <div className="relative pl-6 space-y-10 overflow-y-auto max-h-[300px] scrollbar-hide">
                        {/* Timeline Line */}
                        <div className="absolute left-[10.3px] top-2 bottom-1 w-px bg-slate-100"></div>

                        {dashboardData?.recentTransection?.map((txn) => (
                            <div key={txn.id} className="relative">
                                <div className="absolute -left-[20px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-[#787BEB] bg-white z-10 shadow-sm"></div>
                                <div>
                                    <p className="text-[15px] font-semibold text-slate-900 leading-tight">
                                        {parseFloat(txn.amount).toLocaleString()} {txn.currency} {txn.status}
                                    </p>
                                    <p className="text-sm font-medium text-slate-400 mt-1">
                                        {formatDate(txn.createdAt)}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {(!dashboardData?.recentTransection || dashboardData.recentTransection.length === 0) && (
                            <p className="text-sm text-slate-400">No recent transactions</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* User Activity List */}
                <div className="bg-white p-6 rounded-[10px] border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-base font-semibold text-slate-900">User Last Activity</h3>
                        <button
                            onClick={() => router.push("/bookings/requests")}
                            className="text-sm font-semibold text-[#4153B3] hover:underline"
                        >
                            View all
                        </button>
                    </div>
                    <div className="divide-y divide-slate-200 max-h-[400px] overflow-y-auto scrollbar-hide">
                        {dashboardData?.userLastActivity?.map(activity => (
                            <div key={activity.id} className="flex items-start gap-3 py-4">
                                <div className="w-10 h-10 bg-slate-50 flex items-center justify-center rounded-full shrink-0">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-slate-900">{activity.title}</p>
                                    <p className="text-xs text-slate-500 mt-1">{activity.message}</p>
                                    <p className="text-[10px] text-slate-400 mt-1">{fromNow(activity.createdAt)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Bookings List */}
                <div className="bg-white p-6 rounded-[10px] border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-base font-semibold text-slate-900">Recent Bookings</h3>
                        <button
                            onClick={() => router.push("/bookings/requests")}
                            className="text-sm font-semibold text-[#4153B3] hover:underline"
                        >
                            View all
                        </button>
                    </div>
                    <div className="divide-y divide-slate-200 max-h-[400px] overflow-y-auto scrollbar-hide">
                        {dashboardData?.last10RecentBookign?.map(booking => (
                            <div key={booking.id} className="flex items-center py-4 group">
                                <div className="w-12 h-12 bg-slate-100 rounded-[8px] overflow-hidden mr-3 flex items-center justify-center shrink-0">
                                    <span className="text-xs font-bold text-slate-400">BK</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-[#18181A]">Booking ID: {booking.bookingId}</p>
                                    <p className="text-xs font-normal text-slate-700 mt-0.5">
                                        {formatDate(booking.createdAt)}
                                    </p>
                                    <p className="text-xs font-medium text-slate-500 mt-0.5">
                                        Amount: {parseFloat(booking.amount).toLocaleString()} {booking.currency} ({booking.status})
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
