"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useGetMeQuery } from "@/lib/features/auth/authApi";
import ProfileSettings from "@/components/settings/ProfileSettings";
import SiteSettings from "@/components/settings/SiteSettings";
import CommissionSettings from "@/components/settings/CommissionSettings";
import VersionControlSettings from "@/components/settings/VersionControlSettings";

type SettingTab = "profile" | "site" | "commission" | "version-control";

function SettingsPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const tabParam = searchParams.get("tab") as SettingTab;

    const [activeTab, setActiveTab] = useState<SettingTab>(tabParam || "profile");

    const { data: profileResponse } = useGetMeQuery();
    const reduxUser = useSelector((state: RootState) => state.auth.user);
    const user = profileResponse?.data || reduxUser;
    const isSuperAdmin = user?.role === "SUPER_ADMIN";

    useEffect(() => {
        if (tabParam) {
            if (tabParam === "profile" || tabParam === "site" || tabParam === "commission") {
                setActiveTab(tabParam);
            } else if (tabParam === "version-control") {
                if (user) {
                    if (isSuperAdmin) {
                        setActiveTab("version-control");
                    } else {
                        setActiveTab("profile");
                        router.replace("?tab=profile");
                    }
                }
            }
        }
    }, [tabParam, user, isSuperAdmin, router]);

    const handleTabChange = (tab: SettingTab) => {
        setActiveTab(tab);
        router.replace(`?tab=${tab}`);
    };

    return (
        <div className="space-y-6">
            {/* Top Tabs Container */}
            <div className="flex items-center gap-1 bg-slate-100/80 rounded-full p-1 w-fit border border-slate-200">
                <button
                    onClick={() => handleTabChange("profile")}
                    className={`px-5 py-2 rounded-full text-[13px] font-medium transition-all duration-300 ${activeTab === "profile"
                            ? "bg-blue-600 text-white shadow-sm"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                >
                    Profile Settings
                </button>
                <button
                    onClick={() => handleTabChange("site")}
                    className={`px-5 py-2 rounded-full text-[13px] font-medium transition-all duration-300 ${activeTab === "site"
                            ? "bg-blue-600 text-white shadow-sm"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                >
                    Site Setting
                </button>
                <button
                    onClick={() => handleTabChange("commission")}
                    className={`px-5 py-2 rounded-full text-[13px] font-medium transition-all duration-300 ${activeTab === "commission"
                            ? "bg-blue-600 text-white shadow-sm"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                >
                    Commission Control
                </button>
                {isSuperAdmin && (
                    <button
                        onClick={() => handleTabChange("version-control")}
                        className={`px-5 py-2 rounded-full text-[13px] font-medium transition-all duration-300 ${activeTab === "version-control"
                                ? "bg-blue-600 text-white shadow-sm"
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                    >
                        Version Control
                    </button>
                )}
            </div>

            {/* Tab Content */}
            <div className="mt-6">
                {activeTab === "profile" ? (
                    <ProfileSettings />
                ) : activeTab === "site" ? (
                    <SiteSettings />
                ) : activeTab === "commission" ? (
                    <CommissionSettings />
                ) : (
                    isSuperAdmin && <VersionControlSettings />
                )}
            </div>
        </div>
    );
}

export default function SettingsPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading settings...</div>}>
            <SettingsPageContent />
        </Suspense>
    );
}
