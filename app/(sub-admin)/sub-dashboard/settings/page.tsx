"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProfileSettings from "@/components/settings/ProfileSettings";
import SubAdminSiteSettings from "@/components/settings/SubAdminSiteSettings";

function SubAdminSettingsPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const tabParam = searchParams.get("tab") as "profile" | "site";

    const [activeTab, setActiveTab] = useState<"profile" | "site">(tabParam || "profile");

    useEffect(() => {
        if (tabParam && (tabParam === "profile" || tabParam === "site")) {
            setActiveTab(tabParam);
        }
    }, [tabParam]);

    const handleTabChange = (tab: "profile" | "site") => {
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
            </div>

            {/* Tab Content */}
            <div className="mt-6">
                {activeTab === "profile" ? (
                    <ProfileSettings />
                ) : (
                    <SubAdminSiteSettings />
                )}
            </div>
        </div>
    );
}

export default function SubAdminSettingsPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading settings...</div>}>
            <SubAdminSettingsPageContent />
        </Suspense>
    );
}
