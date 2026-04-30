"use client";

import { useGetPolicyQuery } from "@/lib/features/policy/policyApi";
import { ShieldCheck } from "lucide-react";

export default function SubAdminPolicyPage() {
    const { data: policyData, isLoading } = useGetPolicyQuery();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    const content = policyData?.data?.content || policyData?.content || "No privacy policy content available at the moment.";
    const updatedAt = policyData?.data?.updatedAt || policyData?.updatedAt;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-xl">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Privacy Policy</h1>
                    <p className="text-sm text-slate-500 mt-1">View the application's privacy policy and terms.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col min-h-[calc(100vh-220px)]">
                <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <h2 className="text-sm font-semibold text-slate-700">Policy Content</h2>
                    {updatedAt && (
                        <span className="text-xs text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
                            Last updated: {new Date(updatedAt).toLocaleDateString()}
                        </span>
                    )}
                </div>
                <div className="flex-1 p-8">
                    <div 
                        className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                </div>
            </div>
        </div>
    );
}
