"use client";

import { useState } from "react";
import SubAdminPolicySettings from "./SubAdminPolicySettings";

export default function SubAdminSiteSettings() {
    const [activeMenu, setActiveMenu] = useState("privacy-policy");

    return (
        <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-180px)]">
            {/* Left Sidebar Menu */}
            <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible w-full lg:w-[240px] shrink-0 space-x-2 lg:space-x-0 lg:space-y-1 pb-2 lg:pb-0 scrollbar-hide">
                <button
                    onClick={() => setActiveMenu("privacy-policy")}
                    className={`whitespace-nowrap px-4 py-2.5 lg:py-3 rounded-lg text-sm font-semibold transition-colors ${activeMenu === "privacy-policy"
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-600 hover:bg-slate-50"
                        }`}
                >
                    Privacy Policy
                </button>
            </div>

            {/* Right Content Area */}
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-100 p-4 sm:p-8">
                {activeMenu === "privacy-policy" && (
                    <div>
                        {/* <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-slate-900">Privacy Policy</h2>
                        </div> */}
                        <SubAdminPolicySettings />
                    </div>
                )}
            </div>
        </div>
    );
}
