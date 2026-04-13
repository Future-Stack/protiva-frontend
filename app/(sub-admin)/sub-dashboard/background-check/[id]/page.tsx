"use client";

import { use } from "react";
import { ImgIcon, PdfIcon } from "@/app/assets/DocumentsIcon";
import { Phone, Mail, MapPin } from "lucide-react";

export default function BackgroundCheckDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    console.log(id);
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Background check</h2>
                <p className="text-sm text-slate-500 mt-1">Check the identification for authentic providers</p>
            </div>

            {/* Main Card */}
            <div className="bg-white  rounded-lg overflow-hidden">
                <div className="px-10 py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
                        {/* Left Column - Provider Info */}
                        <div className="bg-[#EFF6FF] p-8 rounded-lg">
                            <div className="flex items-center gap-8">
                                <div className="w-20 h-20 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                                    <img src="https://picsum.photos/seed/provider/200/200" alt="Provider" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 pt-1">
                                    <h3 className="text-lg font-semibold text-[#0F172A] mb-3">Mike Handyman</h3>
                                    <div className="space-y-2.5">
                                        <div className="flex items-center gap-2.5 text-sm text-[#475569]">
                                            <Phone className="w-4 h-4 text-[#6366F1]" />
                                            <span>+1268650960</span>
                                        </div>
                                        <div className="flex items-center gap-2.5 text-sm text-[#475569]">
                                            <Mail className="w-4 h-4 text-[#6366F1]" />
                                            <span>jemmy@gmail.com</span>
                                        </div>
                                        <div className="flex items-center gap-2.5 text-sm text-[#475569]">
                                            <MapPin className="w-4 h-4 text-[#6366F1]" />
                                            <span>Toronto, Canada</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Service Information */}
                        <div className="bg-[#EFF6FF] p-8 rounded-lg">
                            <h3 className="text-lg font-semibold text-[#0F172A] mb-3">Service Information</h3>
                            <div className="space-y-2">
                                <p className="text-sm text-[#475569]">Commercial Space Shifting</p>
                                <p className="text-sm text-[#475569]">License number: 0H5B63352</p>
                                <p className="text-sm text-[#475569]">Year of Experience: 02</p>
                            </div>
                        </div>
                    </div>

                    {/* Provided Documents */}
                    <div className="mt-12">
                        <h3 className="text-base font-semibold text-[#0F172A] mb-6">Provided Documents</h3>
                        <div className="space-y-0">
                            <div className="flex items-center gap-3 py-3 border-b border-slate-200">
                                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                                    <PdfIcon />
                                </div>
                                <span className="text-sm font-medium text-[#475569]">Topic Name.PDF</span>
                            </div>
                            <div className="flex items-center gap-3 py-3 ">
                                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                                    <ImgIcon />
                                </div>
                                <span className="text-sm font-medium text-[#475569]">Topic Name .image</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
                {/* Action Buttons */}
                <div className="flex items-center gap-4 py-10 pb-10">
                    <button className="px-16 py-2.5 bg-[#6366F1] text-white rounded-lg text-sm font-medium hover:bg-[#6366F1]/90 transition-colors">
                        Approve
                    </button>
                    <button className="px-16 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                        Reject
                    </button>
                </div>
        </div>
    );
}
