"use client";

import { useState, useEffect } from "react";
import {
    Eye,
    X,
    ChevronLeft,
    ChevronRight,
    Check,
    Search,
    Loader2,
    AlertCircle,
} from "lucide-react";
import { ImgIcon, PdfIcon } from "@/app/assets/DocumentsIcon";
import {
    useGetAllProvidersQuery,
    useVerifyProviderMutation,
    useRejectProviderMutation,
} from "@/lib/features/super-admin/provider/providerAPI";
import { useAppSelector } from "@/lib/hooks";
import Swal from "sweetalert2";

/* ─── Debounce hook ──────────────────────────────────────────────────── */
function useDebounce<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState<T>(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debounced;
}

export default function BackgroundCheckPage() {
    const { user } = useAppSelector((state) => state.auth);
    const hasViewPermission   = user?.role === "SUPER_ADMIN" || user?.adminPermissions?.isViewProvider;
    const hasManagePermission = user?.role === "SUPER_ADMIN" || user?.adminPermissions?.isManageProvider;

    const LIMIT = 10;
    const [page, setPage]         = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const debouncedSearch = useDebounce(searchInput, 400);
    useEffect(() => { setPage(1); }, [debouncedSearch]);

    const [selectedProvider, setSelectedProvider] = useState<any | null>(null);
    const [actionLoading, setActionLoading]       = useState<string | null>(null);

    /* ── API ── */
    const { data, isLoading, isFetching, isError, refetch } = useGetAllProvidersQuery(
        { page, limit: LIMIT, ...(debouncedSearch ? { search: debouncedSearch } : {}) },
        { skip: !hasViewPermission }
    );
    const [verifyProvider] = useVerifyProviderMutation();
    const [rejectProvider] = useRejectProviderMutation();

    const apiProviders = data?.data?.data ?? [];
    const pagination   = data?.data?.pagination;
    const totalPages   = pagination?.totalPages ?? 1;


    /* ── Verify flow ── */
    const handleVerify = async (id: string) => {
        const result = await Swal.fire({
            title: "Verify Provider?",
            text: "This will mark the provider as verified.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, Verify",
            confirmButtonColor: "#10b981",
        });
        if (!result.isConfirmed) return;
        try {
            await verifyProvider(id).unwrap();
            refetch();
            Swal.fire({ icon: "success", title: "Verified!", text: "Provider has been verified.", timer: 1800, showConfirmButton: false });
        } catch {
            Swal.fire({ icon: "error", title: "Failed", text: "Could not verify provider. Please try again." });
        }
    };

    /* ── Reject flow ── */
    const handleReject = async (id: string) => {
        const result = await Swal.fire({
            title: "Reject Provider?",
            text: "This will mark the provider as rejected.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Reject",
            confirmButtonColor: "#ef4444",
        });
        if (!result.isConfirmed) return;
        try {
            await rejectProvider(id).unwrap();
            refetch();
            Swal.fire({ icon: "success", title: "Rejected!", text: "Provider has been rejected.", timer: 1800, showConfirmButton: false });
        } catch {
            Swal.fire({ icon: "error", title: "Failed", text: "Could not reject provider. Please try again." });
        }
    };

    /* ── Access denied ── */
    if (!hasViewPermission) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h2>
                    <p className="text-slate-500">You do not have permission to view background checks.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Background check</h2>
                <p className="text-sm text-slate-500 mt-1">Check the identification for authentic providers</p>
            </div>

            {/* Main Card */}
            <div className="bg-white px-[26px] py-[34px] rounded-lg">
                {/* Search bar */}
                <div className="pb-6 flex">
                    <div className="hidden sm:flex items-center flex-1 max-w-md relative">
                        <input
                            type="text"
                            placeholder="Search providers..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full pl-15 px-4 py-1.5 h-[45px] bg-white border border-blue-300 rounded-[50px] text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                        />
                        <button className="absolute left-1.5 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-[#787BEB] text-white rounded-full hover:bg-blue-700 transition-colors shadow-sm">
                            <Search size={18} />
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-24 gap-3 text-slate-400">
                            <Loader2 size={28} className="animate-spin" />
                            <span className="text-sm">Loading providers…</span>
                        </div>
                    ) : isError ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3 text-red-500">
                            <AlertCircle size={36} />
                            <p className="text-sm font-medium">Failed to load providers. Please try again.</p>
                        </div>
                    ) : apiProviders.length === 0 ? (
                        <div className="py-20 text-center text-slate-400 text-sm">No providers found.</div>
                    ) : (
                        <table className={`w-full text-left border border-slate-300 transition-opacity ${isFetching ? "opacity-60" : "opacity-100"}`}>
                            <thead>
                                <tr className="bg-[#EFF6FF]">
                                    <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300">SL</th>
                                    <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300">Provider Information</th>
                                    <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300">Contact information</th>
                                    <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300 text-center">NID number</th>
                                    <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300 text-center">Documents</th>
                                    <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {apiProviders.map((provider: any, index: number) => {
                                    const isActioning = actionLoading === provider.id;
                                    const isVerified  = provider.verificationStatus === "VERIFIED";
                                    const isRejected  = provider.verificationStatus === "REJECTED";
                                    return (
                                        <tr key={provider.id} className="border-t border-slate-300 hover:bg-slate-50/50 transition-colors">
                                            <td className="px-4 py-4 text-sm text-[#64748B] border-r border-slate-300">
                                                {(page - 1) * LIMIT + index + 1}
                                            </td>
                                            <td className="px-4 py-4 border-r border-slate-300">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                                                        <img
                                                            src={provider.avatar || `https://picsum.photos/seed/${provider.id}/100/100`}
                                                            alt=""
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-[#0F172A]">{provider.firstName} {provider.lastName}</div>
                                                        <div className="text-xs text-[#FF8113]">★ <span className="text-[#475569]">{provider.averageRating ?? "N/A"}</span></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 border-r border-slate-300">
                                                <div className="text-sm text-[#0F172A]">{provider.phone}</div>
                                                <div className="text-sm text-[#0F172A]">{provider.email}</div>
                                            </td>
                                            <td className="px-4 py-4 text-sm text-[#64748B] border-r border-slate-300 text-center">
                                                {provider.id.slice(0, 10).toUpperCase()}
                                            </td>
                                            <td className="px-4 py-4 border-r border-slate-300">
                                                <div className="flex items-center gap-2 justify-center">
                                                    <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                                                        <ImgIcon />
                                                    </div>
                                                    <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                                                        <PdfIcon />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2 justify-center">
                                                    {/* View */}
                                                    <button
                                                        onClick={() => setSelectedProvider(provider)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye size={18} />
                                                    </button>

                                                    {/* Verify / Reject — only if manage permission */}
                                                    {hasManagePermission && (
                                                        isVerified ? (
                                                            <span className="px-2 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 rounded-md">Verified</span>
                                                        ) : isRejected ? (
                                                            <span className="px-2 py-1 text-xs font-semibold bg-red-50 text-red-600 rounded-md">Rejected</span>
                                                        ) : (
                                                            <>
                                                                <button
                                                                    onClick={() => handleVerify(provider.id)}
                                                                    disabled={isActioning}
                                                                    title="Verify provider"
                                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-40"
                                                                >
                                                                    {isActioning ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                                                                </button>
                                                                <button
                                                                    onClick={() => handleReject(provider.id)}
                                                                    disabled={isActioning}
                                                                    title="Reject provider"
                                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                                                                >
                                                                    <X size={18} />
                                                                </button>
                                                            </>
                                                        )
                                                    )}

                                                    {/* Read-only badge if no manage permission */}
                                                    {!hasManagePermission && (
                                                        <span className={`px-2 py-1 text-xs font-semibold rounded-md ${
                                                            isVerified  ? "bg-emerald-50 text-emerald-700"
                                                            : isRejected ? "bg-red-50 text-red-600"
                                                            : "bg-amber-50 text-amber-700"
                                                        }`}>
                                                            {isVerified ? "Verified" : isRejected ? "Rejected" : "Pending"}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="pt-4 flex items-center justify-center md:justify-end gap-1 md:gap-3">
                        <button
                            disabled={page <= 1 || isFetching}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft size={16} />
                            Previous
                        </button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((i) => (
                                <button
                                    key={i}
                                    onClick={() => setPage(i)}
                                    disabled={isFetching}
                                    className={`w-8 h-8 rounded text-sm flex items-center justify-center font-medium transition-all ${
                                        i === page ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50"
                                    }`}
                                >
                                    {i}
                                </button>
                            ))}
                        </div>
                        <button
                            disabled={page >= totalPages || isFetching}
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>

            {/* Details Modal */}
            {selectedProvider && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedProvider(null)} />
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <h3 className="text-lg font-bold text-slate-900">Background Check Details</h3>
                            <button
                                onClick={() => setSelectedProvider(null)}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden">
                                    <img
                                        src={selectedProvider.avatar || `https://picsum.photos/seed/${selectedProvider.id}/100/100`}
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-slate-900">{selectedProvider.firstName} {selectedProvider.lastName}</h4>
                                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-md text-xs font-semibold ${
                                        selectedProvider.verificationStatus === "VERIFIED" ? "bg-emerald-50 text-emerald-700"
                                        : selectedProvider.verificationStatus === "REJECTED" ? "bg-red-50 text-red-600"
                                        : "bg-amber-50 text-amber-700"
                                    }`}>
                                        {selectedProvider.verificationStatus}
                                    </span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-slate-500 font-medium uppercase">Phone</label>
                                    <p className="text-sm font-medium text-slate-900">{selectedProvider.phone}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 font-medium uppercase">Email</label>
                                    <p className="text-sm font-medium text-slate-900">{selectedProvider.email}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 font-medium uppercase">Country</label>
                                    <p className="text-sm font-medium text-slate-900">{selectedProvider.country || "N/A"}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 font-medium uppercase">Status</label>
                                    <p className="text-sm font-medium text-slate-900">{selectedProvider.status}</p>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-xs text-slate-500 font-medium uppercase">Documents</label>
                                    <div className="flex gap-2 mt-1">
                                        <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 text-green-700 text-xs rounded border border-green-200">
                                            <ImgIcon /> Image
                                        </div>
                                        <div className="flex items-center gap-1.5 px-2 py-1 bg-red-50 text-red-700 text-xs rounded border border-red-200">
                                            <PdfIcon /> PDF
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                            {hasManagePermission
                                && selectedProvider.verificationStatus !== "VERIFIED"
                                && selectedProvider.verificationStatus !== "REJECTED" && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleVerify(selectedProvider.id)}
                                        disabled={actionLoading === selectedProvider.id}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                                    >
                                        <Check size={15} /> Verify
                                    </button>
                                    <button
                                        onClick={() => handleReject(selectedProvider.id)}
                                        disabled={actionLoading === selectedProvider.id}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                                    >
                                        <X size={15} /> Reject
                                    </button>
                                </div>
                            )}
                            <button
                                onClick={() => setSelectedProvider(null)}
                                className="ml-auto px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
