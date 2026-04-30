"use client";

import { useState } from "react";
import { Plus, Pencil } from "lucide-react";
import PolicySettings from "./PolicySettings";
import { useGetPolicyQuery } from "@/lib/features/policy/policyApi";

export default function SiteSettings() {
    const [activeMenu, setActiveMenu] = useState("privacy-policy");
    const [isEditing, setIsEditing] = useState(false);

    const { data: policyData } = useGetPolicyQuery();
    console.log(policyData)
    const content = policyData?.data?.content || policyData?.content || "No privacy policy found.";

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
                    <>
                        {isEditing ? (
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-slate-900">Edit Privacy Policy</h2>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="text-sm text-slate-500 hover:text-slate-700"
                                    >
                                        Back to list
                                    </button>
                                </div>
                                <PolicySettings onSaveComplete={() => setIsEditing(false)} />
                            </div>
                        ) : (
                            <div>
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-xl font-bold text-slate-900">Privacy Policy</h2>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                                    >
                                        <Plus size={16} />
                                        Add New
                                    </button>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-slate-700 mb-4">Privacy Policy Sections</h3>

                                    <div className="border border-slate-200 rounded-lg flex items-center justify-between p-4 group hover:border-blue-200 transition-colors">
                                        <span className="text-sm text-slate-600 truncate max-w-[80%]">
                                            {content.substring(0, 100)}{content.length > 100 ? "..." : ""}
                                        </span>
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="text-slate-400 hover:text-blue-600 transition-colors"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
