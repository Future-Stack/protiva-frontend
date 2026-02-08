"use client";

import { useState } from "react";
import DashboardCard from "@/components/DashboardCard";
import {

    ChevronDown,
    ArrowRight
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const earningData = [
    { month: 'Jan', value: 40 },
    { month: 'Feb', value: 55 },
    { month: 'Mar', value: 30 },
    { month: 'Apr', value: 105 },
    { month: 'May', value: 60 },
    { month: 'Jun', value: 110 },
    { month: 'Jul', value: 45 },
    { month: 'Aug', value: 110 },
];

export default function SuperAdminDashboard() {
    const [selectedYear, setSelectedYear] = useState("2025");
    const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Business Analytics Heading */}
            <div className="bg-white border border-slate-100 p-5 rounded-[10px]">
                <h2 className="text-lg font-semibold text-slate-900 mb-3 ">Business Analytics</h2>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    <DashboardCard
                        title="Total earning"
                        value="80,190.15৳"
                        variant="cyan"
                    />
                    <DashboardCard
                        title="Total subscription"
                        value="25"
                        variant="green"
                    />
                    <DashboardCard
                        title="Total Provider"
                        value="3"
                        variant="orange"
                    />
                    <DashboardCard
                        title="Total booking served"
                        value="33"
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
                                data={earningData}
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
                                    domain={[0, 200]}
                                    ticks={[0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200]}
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
                                        // Only show dots at first and last points
                                        if (index === 0 || index === earningData.length - 1) {
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
                        <p className="text-sm font-medium text-slate-400 mt-1">05 Transactions this month</p>
                    </div>
                    <div className="relative pl-6 space-y-10 max-h-[350px] overflow-y-auto scrollbar-hide">
                        {/* Timeline Line */}
                        <div className="absolute left-[4.5px] top-2 bottom-2 w-px bg-slate-100"></div>

                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="relative">
                                <div className="absolute -left-[26px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-[#787BEB] bg-white z-10 shadow-sm"></div>
                                <div>
                                    <p className="text-[15px] font-semibold text-slate-900 leading-tight">3,564.00৳ Credited</p>
                                    <p className="text-sm font-medium text-slate-400 mt-1">25 Aug 11:30 am</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Subscription Providers List */}
                <div className="bg-white p-6 rounded-[10px] border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-base font-semibold text-slate-900">Subscription Providers</h3>
                        <button className="text-sm font-semibold text-[#4153B3] hover:underline">View all</button>
                    </div>
                    <div className="divide-y divide-slate-200 max-h-[350px] overflow-y-auto scrollbar-hide">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="flex items-center justify-between py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-slate-100 rounded-[8px] overflow-hidden">
                                        <img src={`https://picsum.photos/seed/${i + 15}/100/100`} alt="provider" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">Microwave Repair Ser...</p>
                                        <p className="text-xs font-medium text-[#4B5864] mt-1.5">2 Services</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-base font-medium text-[#4B5864]">5 Bookings Completed</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Bookings List */}
                <div className="bg-white p-6 rounded-[10px] border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-base font-semibold text-slate-900">Recent Bookings</h3>
                        <button className="text-sm font-semibold text-[#4153B3] hover:underline">View all</button>
                    </div>
                    <div className="divide-y divide-slate-200 max-h-[350px] overflow-y-auto scrollbar-hide">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="flex items-center py-4 group">
                                <div className="w-12 h-12 bg-slate-100 rounded-[8px] overflow-hidden mr-3 transition-colors ">
                                    <img src={`https://picsum.photos/seed/${i + 25}/100/100`} alt="booking" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <div>
                                        <p className="text-sm font-semibold text-[#18181A]">Booking # 100129</p>
                                        <p className="text-sm font-normal text-slate-700 mt-0.5">25-Aug-25 11:25AM</p>
                                        <p className="text-xs font-normal text-slate-500 mt-0.5">Booked by Sara Chan</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
