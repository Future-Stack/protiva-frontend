"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";

export default function SuperAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/");
        } else {
            setIsLoading(false);
        }
    }, [isAuthenticated, router]);

    if (isLoading || !isAuthenticated) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen lg:h-screen bg-slate-50 flex flex-col overflow-x-hidden lg:overflow-hidden relative">
            <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
            <div className="flex-1 flex overflow-hidden mx-2 sm:mx-4 md:mx-6">
                <Sidebar role="super-admin" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <main className="flex-1 overflow-y-auto px-0 sm:px-2 md:pl-0 md:pr-0 lg:pl-6 pb-6 scrollbar-hide w-full min-w-0">
                    {children}
                </main>
            </div>
            {/* Footer */}
            <div className="flex flex-col sm:flex-row px-4 sm:px-6 py-4 border-t border-[#F1F5F9] justify-between items-center gap-2 bg-white lg:bg-transparent">
                <p className="text-xs sm:text-sm font-semibold text-slate-600 text-center sm:text-left">All Right reserved by@2026</p>
                <p className="text-xs sm:text-sm font-medium text-blue-800">Software version 3.3</p>
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
