"use client";

import { useState, useEffect } from "react";
import { useGetSystemSettingQuery, useUpdateSystemSettingMutation } from "@/lib/features/super-admin/system-setting/systemSettingApi";
import { Percent, TrendingUp, Clock, Save, ShieldAlert, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

export default function CommissionSettings() {
    const { data: settingResponse, isLoading, refetch } = useGetSystemSettingQuery();
    const [updateSystemSetting, { isLoading: isUpdating }] = useUpdateSystemSettingMutation();

    const [value, setValue] = useState<number | string>("");

    // Safe extraction of the system setting record
    const setting = settingResponse?.data?.data || settingResponse?.data || settingResponse;

    useEffect(() => {
        if (setting && typeof setting.value !== "undefined") {
            setValue(setting.value);
        }
    }, [setting]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const numericValue = Number(value);
        if (isNaN(numericValue) || numericValue < 0 || numericValue > 100) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Commission rate must be a valid number between 0 and 100.",
            });
            return;
        }

        try {
            await updateSystemSetting({ value: numericValue }).unwrap();
            
            Swal.fire({
                icon: "success",
                title: "Setting Updated!",
                text: "Platform commission fee updated successfully.",
                timer: 2000,
                showConfirmButton: false,
            });
            refetch();
        } catch (error: any) {
            Swal.fire({
                icon: "error",
                title: "Update Failed",
                text: error?.data?.message || "Failed to update system setting.",
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <p className="text-sm text-slate-500 font-medium animate-pulse">Retrieving commission settings...</p>
            </div>
        );
    }

    const currentFee = setting?.value ?? "N/A";
    const lastUpdated = setting?.updatedAt ? new Date(setting.updatedAt).toLocaleString() : "Never";

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
            {/* Header section */}
            <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900">Commission Control</h2>
                <p className="text-sm text-slate-500 mt-1">Configure and manage global platform commission fees applied to transactions</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Visual Overview Metric */}
                <div className="md:col-span-1 bg-gradient-to-br from-indigo-500 to-blue-600 text-white rounded-xl shadow-md p-6 flex flex-col justify-between min-h-[180px] relative overflow-hidden group">
                    <div className="absolute right-0 bottom-0 opacity-10 translate-x-1/4 translate-y-1/4 scale-150 transition-transform group-hover:scale-125 duration-500">
                        <Percent size={180} />
                    </div>
                    <div>
                        <span className="text-xs font-semibold tracking-wider text-indigo-100 uppercase">Platform Fee</span>
                        <div className="text-4xl font-extrabold mt-2 flex items-baseline">
                            {currentFee}
                            <span className="text-2xl font-semibold ml-0.5">%</span>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-indigo-100 text-xs">
                        <Clock size={14} className="shrink-0" />
                        <span className="truncate">Last updated: {lastUpdated}</span>
                    </div>
                </div>

                {/* Edit Commission Card */}
                <div className="md:col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
                    <form onSubmit={handleSave} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                                <TrendingUp size={16} className="text-indigo-500" />
                                Commission Percentage (%)
                            </label>
                            <p className="text-xs text-slate-400">Specify the fee percentage that the platform retains from provider earnings.</p>
                            
                            <div className="relative mt-2.5 max-w-xs flex items-center">
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="any"
                                    required
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    placeholder="Enter commission rate"
                                    className="w-full pl-4 pr-12 py-2.5 bg-slate-50 text-slate-900 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium text-lg"
                                />
                                <div className="absolute right-4 text-slate-400 font-semibold text-lg pointer-events-none">
                                    %
                                </div>
                            </div>
                        </div>

                        {/* Informational Alert Box */}
                        <div className="flex gap-3 p-4 bg-amber-50/60 border border-amber-100 rounded-lg text-slate-600 text-xs leading-relaxed max-w-2xl">
                            <ShieldAlert className="text-amber-500 shrink-0 mt-0.5" size={16} />
                            <div>
                                <span className="font-semibold text-slate-700">Notice:</span> Adjusting the global commission rate affects all new bookings and payouts. Existing transactions will remain unaffected. Make sure you verify all financial calculations before proceeding.
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="pt-2 flex justify-end">
                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-md transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isUpdating ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Save size={16} />
                                )}
                                <span>Save Changes</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
