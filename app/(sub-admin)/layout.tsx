"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { useGetSubAdminProfileQuery } from "@/lib/features/sub-admin/profile/profileAPI";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/lib/features/auth/authSlice";

export default function SubAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, user, accessToken, refreshToken } = useAppSelector((state) => state.auth);
    const router = useRouter();
    const dispatch = useDispatch();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const { data: profileResponse } = useGetSubAdminProfileQuery(undefined, {
        skip: !isAuthenticated || user?.role !== "SUB_ADMIN"
    });

    useEffect(() => {
        if (profileResponse?.data?.user && accessToken && refreshToken) {
            dispatch(setCredentials({
                user: profileResponse.data.user,
                accessToken,
                refreshToken
            }));
        }
    }, [profileResponse, dispatch, accessToken, refreshToken]);

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
        <div className="h-screen bg-slate-50 flex flex-col overflow-hidden relative">
                    <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
                    <div className="flex-1 flex overflow-hidden mx-2 sm:mx-4 md:mx-6">
                        <Sidebar role="sub-admin" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                        <main className="flex-1 overflow-y-auto px-2 sm:px-4 md:pl-6 md:pr-0 pb-6 scrollbar-hide">
                            {children}
                        </main>
                    </div>
                    {/* Footer */}
                    <div className="flex flex-col sm:flex-row px-4 sm:px-6 py-4 border-t border-[#F1F5F9] justify-between items-center gap-2">
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
