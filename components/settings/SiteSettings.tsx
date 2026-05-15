"use client";

import { useState } from "react";
import { Plus, Pencil } from "lucide-react";
import PolicySettings from "./PolicySettings";
import { useGetPolicyQuery, useGetTermsQuery } from "@/lib/features/policy/policyApi";
import { useGetMeQuery } from "@/lib/features/auth/authApi";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

export default function SiteSettings() {
    const [activeMenu, setActiveMenu] = useState("privacy-policy");
    const [isEditing, setIsEditing] = useState(false);

    const { data: profileResponse } = useGetMeQuery();
    const reduxUser = useSelector((state: RootState) => state.auth.user);
    const user = profileResponse?.data || reduxUser;
    const isSuperAdmin = user?.role === "SUPER_ADMIN";

    const { data: policyData } = useGetPolicyQuery(undefined, { skip: activeMenu !== "privacy-policy" });
    const { data: termsData } = useGetTermsQuery(undefined, { skip: activeMenu !== "terms-condition" });
    
    const content = activeMenu === "privacy-policy" 
        ? (policyData?.data?.content || policyData?.content || "No privacy policy found.")
        : (termsData?.data?.content || termsData?.content || "No terms and conditions found.");

    return (
        <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-180px)]">
            {/* Left Sidebar Menu */}
            <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible w-full lg:w-[240px] shrink-0 space-x-2 lg:space-x-0 lg:space-y-1 pb-2 lg:pb-0 scrollbar-hide">
                <button
                    onClick={() => { setActiveMenu("privacy-policy"); setIsEditing(false); }}
                    className={`whitespace-nowrap px-4 py-2.5 lg:py-3 rounded-lg text-sm font-semibold transition-colors ${activeMenu === "privacy-policy"
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-600 hover:bg-slate-50"
                        }`}
                >
                    Privacy Policy
                </button>
                <button
                    onClick={() => { setActiveMenu("terms-condition"); setIsEditing(false); }}
                    className={`whitespace-nowrap px-4 py-2.5 lg:py-3 rounded-lg text-sm font-semibold transition-colors ${activeMenu === "terms-condition"
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-600 hover:bg-slate-50"
                        }`}
                >
                    Terms & Conditions
                </button>
            </div>

            {/* Right Content Area */}
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-100 p-4 sm:p-8">
                {(activeMenu === "privacy-policy" || activeMenu === "terms-condition") && (
                    <>
                        {isEditing ? (
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-slate-900">Edit {activeMenu === "privacy-policy" ? "Privacy Policy" : "Terms & Conditions"}</h2>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="text-sm text-slate-500 hover:text-slate-700"
                                    >
                                        Back to view
                                    </button>
                                </div>
                                <PolicySettings 
                                    onSaveComplete={() => setIsEditing(false)} 
                                    type={activeMenu === "privacy-policy" ? "privacy" : "terms"}
                                    readOnly={!isSuperAdmin}
                                />
                            </div>
                        ) : (
                            <div>
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-xl font-bold text-slate-900">{activeMenu === "privacy-policy" ? "Privacy Policy" : "Terms & Conditions"}</h2>
                                    {isSuperAdmin && (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                                        >
                                            <Plus size={16} />
                                            {content === "No privacy policy found." || content === "No terms and conditions found." ? "Add New" : "Edit"}
                                        </button>
                                    )}
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-slate-700 mb-4">{activeMenu === "privacy-policy" ? "Privacy Policy" : "Terms & Conditions"} Sections</h3>

                                    <div className="border border-slate-200 rounded-lg flex items-center justify-between p-4 group hover:border-blue-200 transition-colors">
                                        <div 
                                            className="text-sm text-slate-600 prose prose-sm max-w-none line-clamp-3"
                                            dangerouslySetInnerHTML={{ __html: content }}
                                        />
                                        {isSuperAdmin && (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="text-slate-400 hover:text-blue-600 transition-colors shrink-0 ml-4"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                        )}
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
