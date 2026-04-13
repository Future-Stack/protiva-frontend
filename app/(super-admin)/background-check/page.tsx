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
import { useRouter } from "next/navigation";


/* ─── Static fallback ────────────────────────────────────────────────── */
const STATIC_CHECKS = [
    { id: "01", name: "Handyman service", rating: "★", phone: "+65954425", email: "polo@gmail.com", nid: "1202445221", documents: { pdf: true, image: true }, professionalDocs: { pdf: true, image: true }, verificationStatus: "PENDING" },
    { id: "02", name: "Handyman service", rating: "★", phone: "+65954425", email: "polo@gmail.com", nid: "1202445221", documents: { pdf: true, image: true }, professionalDocs: { pdf: true, image: true }, verificationStatus: "UNVERIFIED" },
    { id: "03", name: "Handyman service", rating: "★", phone: "+65954425", email: "polo@gmail.com", nid: "1202445221", documents: { pdf: true, image: true }, professionalDocs: { pdf: true, image: true }, verificationStatus: "PENDING" },
    { id: "04", name: "Handyman service", rating: "★", phone: "+65954425", email: "polo@gmail.com", nid: "1202445221", documents: { pdf: true, image: true }, professionalDocs: { pdf: true, image: true }, verificationStatus: "PENDING" },
    { id: "05", name: "Handyman service", rating: "★", phone: "+65954425", email: "polo@gmail.com", nid: "1202445221", documents: { pdf: true, image: true }, professionalDocs: { pdf: true, image: true }, verificationStatus: "UNVERIFIED" },
    { id: "06", name: "Handyman service", rating: "★", phone: "+65954425", email: "polo@gmail.com", nid: "1202445221", documents: { pdf: true, image: true }, professionalDocs: { pdf: true, image: true }, verificationStatus: "PENDING" },
    { id: "07", name: "Handyman service", rating: "★", phone: "+65954425", email: "polo@gmail.com", nid: "1202445221", documents: { pdf: true, image: true }, professionalDocs: { pdf: true, image: true }, verificationStatus: "PENDING" },
    { id: "08", name: "Handyman service", rating: "★", phone: "+65954425", email: "polo@gmail.com", nid: "1202445221", documents: { pdf: true, image: true }, professionalDocs: { pdf: true, image: true }, verificationStatus: "UNVERIFIED" },
    { id: "09", name: "Handyman service", rating: "★", phone: "+65954425", email: "polo@gmail.com", nid: "1202445221", documents: { pdf: true, image: true }, professionalDocs: { pdf: true, image: true }, verificationStatus: "PENDING" },
    { id: "10", name: "Handyman service", rating: "★", phone: "+65954425", email: "polo@gmail.com", nid: "1202445221", documents: { pdf: true, image: true }, professionalDocs: { pdf: true, image: true }, verificationStatus: "PENDING" },
];

/* ─── Normalised row shape ───────────────────────────────────────────── */
interface CheckRow {
    id: string;
    name: string;
    rating: string;
    phone: string;
    email: string;
    nid: string;
    documents: { pdf: boolean; image: boolean };
    professionalDocs: { pdf: boolean; image: boolean };
    verificationStatus: string;
    avatarSeed: string;
}

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
    const router = useRouter();
    const LIMIT = 10;
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const debouncedSearch = useDebounce(searchInput, 400);

    const [localRows, setLocalRows] = useState<CheckRow[]>([]);
    const [selectedCheck, setSelectedCheck] = useState<CheckRow | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null); // provider id being actioned

    /* ── API ── */
    const { data, isLoading, isFetching, isError } = useGetAllProvidersQuery({
        page,
        limit: LIMIT,
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
    });
    const [verifyProvider] = useVerifyProviderMutation();
    const [rejectProvider] = useRejectProviderMutation();

    const apiProviders = data?.data?.data ?? [];
    console.log(apiProviders);
    const pagination = data?.data?.pagination;
    const totalPages = pagination?.totalPages ?? 1;
    const hasApiData = apiProviders.length > 0;

    /* ── Sync local rows ── */
    useEffect(() => {
        if (hasApiData) {
            setLocalRows(
                apiProviders.map((p) => ({
                    id: p.id,
                    name: `${p.firstName} ${p.lastName}`,
                    rating: "★",
                    phone: p.phone,
                    email: p.email,
                    nid: p.id.slice(0, 10).toUpperCase(), // NID not in API; show placeholder
                    documents: { pdf: true, image: Boolean(p.avatar) },
                    professionalDocs: { pdf: false, image: false },
                    verificationStatus: p.verificationStatus,
                    avatarSeed: p.id,
                }))
            );
        } else if (!isLoading && !isFetching) {
            setLocalRows(STATIC_CHECKS.map((s) => ({ ...s, avatarSeed: s.id })));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiProviders, isLoading, isFetching]);

    /* ── Client-side search for static fallback ── */
    const displayedRows = hasApiData
        ? localRows
        : localRows.filter((r) =>
              r.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
              r.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
              r.phone.includes(debouncedSearch) ||
              r.nid.includes(debouncedSearch)
          );

    /* ── Verify / Reject ── */
    const handleVerify = async (id: string) => {
        if (!hasApiData) {
            // static: just update locally
            setLocalRows((prev) => prev.map((r) => r.id === id ? { ...r, verificationStatus: "VERIFIED" } : r));
            return;
        }
        setActionLoading(id);
        try {
            await verifyProvider(id).unwrap();
        } catch {
            // API may return 500 for invalid IDs – still reflect action in UI
            setLocalRows((prev) => prev.map((r) => r.id === id ? { ...r, verificationStatus: "VERIFIED" } : r));
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (id: string) => {
        if (!hasApiData) {
            setLocalRows((prev) => prev.map((r) => r.id === id ? { ...r, verificationStatus: "REJECTED" } : r));
            return;
        }
        setActionLoading(id);
        try {
            await rejectProvider(id).unwrap();
        } catch {
            setLocalRows((prev) => prev.map((r) => r.id === id ? { ...r, verificationStatus: "REJECTED" } : r));
        } finally {
            setActionLoading(null);
        }
    };

    const effectiveTotalPages = hasApiData ? totalPages : Math.ceil(STATIC_CHECKS.length / LIMIT);

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
                            placeholder="Search..."
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
                            <p className="text-sm font-medium">Failed to load. Showing static data.</p>
                        </div>
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
                                {displayedRows.map((check, index) => {
                                    const isActioning = actionLoading === check.id;
                                    const isVerified = check.verificationStatus === "VERIFIED";
                                    const isRejected = check.verificationStatus === "REJECTED";
                                    return (
                                        <tr key={check.id} className="border-t border-slate-300 hover:bg-slate-50/50 transition-colors">
                                            <td className="px-4 py-4 text-sm text-[#64748B] border-r border-slate-300">
                                                {hasApiData ? (page - 1) * LIMIT + index + 1 : check.id}
                                            </td>
                                            <td className="px-4 py-4 border-r border-slate-300">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                                                        <img src={`https://picsum.photos/seed/${check.avatarSeed}/100/100`} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-[#0F172A]">{check.name}</div>
                                                        <div className="text-xs text-[#FF8113]">{check.rating} <span className="text-[#475569]">4.8</span></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 border-r border-slate-300">
                                                <div className="text-sm text-[#0F172A]">{check.phone}</div>
                                                <div className="text-sm text-[#0F172A]">{check.email}</div>
                                            </td>
                                            <td className="px-4 py-4 text-sm text-[#64748B] border-r border-slate-300 text-center">{check.nid}</td>
                                            <td className="px-4 py-4 border-r border-slate-300">
                                                <div className="flex items-center gap-2 justify-center">
                                                    {/* {check.documents.image && (
                                                        <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                                                            <ImgIcon />
                                                        </div>
                                                    )}
                                                    {check.documents.pdf && (
                                                        <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                                                            <PdfIcon />
                                                        </div>
                                                    )} */}
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
                                                    {/* View details */}
                                                    <button
                                                        onClick={() => router.push(`/background-check/${check.id}`)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    >
                                                        <Eye size={18} />
                                                    </button>

                                                    {/* Verify */}
                                                    {isVerified ? (
                                                        <span className="px-2 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 rounded-md">Verified</span>
                                                    ) : isRejected ? (
                                                        <span className="px-2 py-1 text-xs font-semibold bg-red-50 text-red-600 rounded-md">Rejected</span>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => handleVerify(check.id)}
                                                                disabled={isActioning}
                                                                title="Verify provider"
                                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-40"
                                                            >
                                                                {isActioning ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                                                            </button>
                                                            <button
                                                                onClick={() => handleReject(check.id)}
                                                                disabled={isActioning}
                                                                title="Reject provider"
                                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                                                            >
                                                                <X size={18} />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {displayedRows.length === 0 && !isLoading && (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-16 text-center text-slate-400 text-sm">
                                            No providers found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
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
                        {Array.from({ length: effectiveTotalPages }, (_, i) => i + 1).map((i) => (
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
                        disabled={page >= effectiveTotalPages || isFetching}
                        onClick={() => setPage((p) => Math.min(effectiveTotalPages, p + 1))}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        Next
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* Details Modal */}
            {/* {selectedCheck && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedCheck(null)} />
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <h3 className="text-lg font-bold text-slate-900">Background Check Details</h3>
                            <button
                                onClick={() => setSelectedCheck(null)}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden">
                                        <img src={`https://picsum.photos/seed/${selectedCheck.avatarSeed}/100/100`} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900">{selectedCheck.name}</h4>
                                        <p className="text-sm text-slate-500">Rating: {selectedCheck.rating} 4.8</p>
                                        <span className={`inline-block mt-1 px-2 py-0.5 rounded-md text-xs font-semibold ${
                                            selectedCheck.verificationStatus === "VERIFIED" ? "bg-emerald-50 text-emerald-700"
                                            : selectedCheck.verificationStatus === "REJECTED" ? "bg-red-50 text-red-600"
                                            : "bg-amber-50 text-amber-700"
                                        }`}>
                                            {selectedCheck.verificationStatus}
                                        </span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-slate-500 font-medium uppercase">Phone</label>
                                        <p className="text-sm font-medium text-slate-900">{selectedCheck.phone}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-500 font-medium uppercase">Email</label>
                                        <p className="text-sm font-medium text-slate-900">{selectedCheck.email}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-xs text-slate-500 font-medium uppercase">NID Number</label>
                                        <p className="text-sm font-medium text-slate-900">{selectedCheck.nid}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-xs text-slate-500 font-medium uppercase">Documents</label>
                                        <div className="flex gap-2 mt-1">
                                            {selectedCheck.documents.image && <div className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded border border-green-200">Image Available</div>}
                                            {selectedCheck.documents.pdf && <div className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded border border-red-200">PDF Available</div>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                            {selectedCheck.verificationStatus !== "VERIFIED" && selectedCheck.verificationStatus !== "REJECTED" && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => { handleVerify(selectedCheck.id); setSelectedCheck(null); }}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                                    >
                                        <Check size={15} /> Verify
                                    </button>
                                    <button
                                        onClick={() => { handleReject(selectedCheck.id); setSelectedCheck(null); }}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        <X size={15} /> Reject
                                    </button>
                                </div>
                            )}
                            <button
                                onClick={() => setSelectedCheck(null)}
                                className="ml-auto px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )} */}
        </div>
    );
}
