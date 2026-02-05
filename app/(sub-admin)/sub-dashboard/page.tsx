"use client";

import DashboardCard from "@/components/DashboardCard";
import { FileText, CheckCircle2 } from "lucide-react";

export default function SubAdminDashboard() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Business Analytics Heading */}
            <div className="bg-white border border-slate-100 p-6 rounded-[10px]">
                <h2 className="text-base font-semibold text-slate-900 mb-4">Business Analytics</h2>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    <DashboardCard
                        title="Total Bookings"
                        value="234"
                        variant="cyan"
                    />
                    <DashboardCard
                        title="Completed"
                        value="189"
                        variant="green"
                    />
                    <DashboardCard
                        title="Pending"
                        value="32"
                        variant="orange"
                    />
                    <DashboardCard
                        title="Issues"
                        value="13"
                        variant="pink"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* My Pending Tasks */}
                <div className="bg-white border border-slate-100 rounded-[10px] p-6 h-full">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-base font-bold text-slate-900">My Pending Tasks</h3>
                        <span className="px-3 py-1 bg-[#6366F1] text-white text-xs font-medium rounded-full">3 pending</span>
                    </div>

                    <div className="space-y-6">
                        {/* Task 1 */}
                        <div className="flex items-start gap-3">
                            <div className="mt-1 w-5 h-5 rounded-full border-2 border-slate-300 flex-shrink-0 cursor-pointer hover:border-[#6366F1]"></div>
                            <div>
                                <p className="text-sm font-medium text-slate-900">Approve booking #1234</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-medium rounded">High</span>
                                    <span className="text-xs text-slate-400">5 min ago</span>
                                </div>
                            </div>
                        </div>

                        {/* Task 2 */}
                        <div className="flex items-start gap-3">
                            <div className="mt-1 w-5 h-5 rounded-full border-2 border-slate-300 flex-shrink-0 cursor-pointer hover:border-[#6366F1]"></div>
                            <div>
                                <p className="text-sm font-medium text-slate-900">Review provider profile - Sarah Jones</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-medium rounded">Medium</span>
                                    <span className="text-xs text-slate-400">1 hour ago</span>
                                </div>
                            </div>
                        </div>

                        {/* Task 3 */}
                        <div className="flex items-start gap-3">
                            <div className="mt-1 w-5 h-5 rounded-full border-2 border-slate-300 flex-shrink-0 cursor-pointer hover:border-[#6366F1]"></div>
                            <div>
                                <p className="text-sm font-medium text-slate-900">Update booking #1189 status</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-medium rounded">High</span>
                                    <span className="text-xs text-slate-400">2 hours ago</span>
                                </div>
                            </div>
                        </div>

                        {/* Task 4 - Completed */}
                        <div className="flex items-start gap-3 opacity-60">
                            <div className="mt-1 w-5 h-5 rounded-full bg-green-500 border-2 border-green-500 flex items-center justify-center flex-shrink-0">
                                <CheckCircle2 size={12} className="text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-900 line-through">Check provider verification docs</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-medium rounded">Low</span>
                                    <span className="text-xs text-slate-400">3 hours ago</span>
                                </div>
                            </div>
                        </div>

                        {/* Task 5 */}
                        <div className="flex items-start gap-3">
                            <div className="mt-1 w-5 h-5 rounded-full border-2 border-slate-300 flex-shrink-0 cursor-pointer hover:border-[#6366F1]"></div>
                            <div>
                                <p className="text-sm font-medium text-slate-900">Export weekly booking report</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-medium rounded">Medium</span>
                                    <span className="text-xs text-slate-400">5 hours ago</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white border border-slate-100 rounded-[10px] p-6 h-full">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-base font-bold text-slate-900">Recent Activity</h3>
                        <button className="text-slate-400 hover:text-slate-600">
                            <FileText size={18} />
                        </button>
                    </div>

                    <div className="relative pl-2 space-y-8">
                        {/* Custom Timeline Line */}
                        <div className="absolute left-[3px] top-2 bottom-2 w-px bg-slate-100"></div>

                        {/* Activity 1 */}
                        <div className="relative pl-6">
                            <div className="absolute left-[-4px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#6366F1] border-2 border-white shadow-sm z-10"></div>
                            <div>
                                <p className="text-sm font-semibold text-slate-900">Updated booking status</p>
                                <p className="text-xs text-slate-500 mt-0.5">Booking #1245</p>
                                <p className="text-[10px] text-slate-400 mt-1">10 min ago</p>
                            </div>
                        </div>

                        {/* Activity 2 */}
                        <div className="relative pl-6">
                            <div className="absolute left-[-4px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#6366F1] border-2 border-white shadow-sm z-10"></div>
                            <div>
                                <p className="text-sm font-semibold text-slate-900">Viewed provider profile</p>
                                <p className="text-xs text-slate-500 mt-0.5">Michael Brown</p>
                                <p className="text-[10px] text-slate-400 mt-1">25 min ago</p>
                            </div>
                        </div>

                        {/* Activity 3 */}
                        <div className="relative pl-6">
                            <div className="absolute left-[-4px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#6366F1] border-2 border-white shadow-sm z-10"></div>
                            <div>
                                <p className="text-sm font-semibold text-slate-900">Exported booking data</p>
                                <p className="text-xs text-slate-500 mt-0.5">Weekly Report</p>
                                <p className="text-[10px] text-slate-400 mt-1">1 hour ago</p>
                            </div>
                        </div>

                        {/* Activity 4 */}
                        <div className="relative pl-6">
                            <div className="absolute left-[-4px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#6366F1] border-2 border-white shadow-sm z-10"></div>
                            <div>
                                <p className="text-sm font-semibold text-slate-900">Approved booking request</p>
                                <p className="text-xs text-slate-500 mt-0.5">Booking #232</p>
                                <p className="text-[10px] text-slate-400 mt-1">2 hours ago</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
