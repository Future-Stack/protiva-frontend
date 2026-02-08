"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SuperAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="h-screen bg-slate-50 flex flex-col overflow-hidden relative">
            <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
            <div className="flex-1 flex overflow-hidden mx-6">
                <Sidebar role="super-admin" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <main className="flex-1 overflow-y-auto  md:pl-8 md:pr-0 pb-6 scrollbar-hide">
                    {children}
                </main>
            </div>
            {/* Footer */}
            <div className="flex px-6 py-4 border-t border-[#F1F5F9] justify-between gap-1">
                <p className="text-sm font-semibold text-slate-600">All Right reserved by@2026</p>
                <p className="text-sm font-medium text-blue-800">Software version 3.3</p>
            </div>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
}
