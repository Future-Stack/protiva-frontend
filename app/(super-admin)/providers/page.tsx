"use client";

import { useState, useEffect, useMemo } from "react";
import {
    Search,
    Download,
    Filter,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Loader2,
    AlertCircle,
    Check,
    X,
} from "lucide-react";
import DeleteModal from "@/components/DeleteModal";
import {
    useGetAllProvidersQuery,
    useToggleRecommendationMutation,
    useVerifyProviderMutation,
    useUpdateServiceAvailabilityMutation,
    useGetProviderJobsQuery,
    useRejectProviderMutation,
} from "@/lib/features/super-admin/provider/providerAPI";
import { useGetUserTotalBookingQuery } from "@/lib/features/super-admin/booking/bookingAPI";
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

/* ─── Normalised row shape (works for both API + static) ─────────────── */
interface ProviderRow {
    id: string;
    name: string;
    rating: string;
    phone: string;
    email: string;
    bookings: number;
    providerServiceAvailability: boolean;
    // available: boolean;
    verificationStatus: string; // "VERIFIED" | "UNVERIFIED" | "PENDING"
    avatar: string | null;
    isProviderRecomendation: boolean;
    status: string;
}

const STATUS_OPTIONS = [
    { value: "",          label: "All Status" },
    { value: "ACTIVE",    label: "Active" },
    { value: "PENDING",   label: "Pending" },
    { value: "SUSPENDED", label: "Suspended" },
];

const VERIFICATION_OPTIONS = [
    { value: "",          label: "All Verification" },
    { value: "VERIFIED",  label: "Verified" },
    { value: "UNVERIFIED",label: "Unverified" },
];

const BookingCountCell = ({ userId }: { userId: string }) => {
    const { data, isLoading } = useGetUserTotalBookingQuery(userId);
    if (isLoading) return <div className="h-4 w-8 bg-slate-100 animate-pulse rounded mx-auto"></div>;
    return <span className="text-base text-[#2C2C2C]">{data?.data ?? 0}</span>;
};

const ServiceCountCell = ({ providerId, onViewServices }: { providerId: string; onViewServices: (id: string) => void }) => {
    const { data, isLoading } = useGetProviderJobsQuery(providerId);
    if (isLoading) return <div className="h-4 w-8 bg-slate-100 animate-pulse rounded mx-auto"></div>;
    const count = Array.isArray(data?.data) ? data.data.length : 0;
    return (
        <div className="flex flex-col items-center">
            <span className="text-base font-semibold text-[#2C2C2C]">{count}</span>
            <button
                onClick={() => onViewServices(providerId)}
                className="text-xs text-[#787BEB] hover:underline mt-1 font-medium"
            >
                (Click to view)
            </button>
        </div>
    );
};

const ServicesModal = ({ isOpen, onClose, providerId }: { isOpen: boolean; onClose: () => void; providerId: string | null }) => {
    const { data, isLoading, isError } = useGetProviderJobsQuery(providerId as string, { skip: !providerId });

    if (!isOpen) return null;

    const services = data?.data || [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Provider Services</h3>
                        <p className="text-sm text-slate-500">List of all services offered by this provider</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <Loader2 size={40} className="animate-spin text-[#787BEB]" />
                            <p className="text-slate-500">Loading services...</p>
                        </div>
                    ) : isError ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3 text-red-500">
                            <AlertCircle size={40} />
                            <p className="font-medium">Failed to load services</p>
                        </div>
                    ) : services.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                            <p>No services found for this provider.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto border border-slate-200 rounded-xl">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-4 py-3 text-sm font-semibold text-slate-600">Service Title</th>
                                        <th className="px-4 py-3 text-sm font-semibold text-slate-600 text-center">Price</th>
                                        <th className="px-4 py-3 text-sm font-semibold text-slate-600 text-center">Status</th>
                                        <th className="px-4 py-3 text-sm font-semibold text-slate-600 text-center">Bookings</th>
                                        <th className="px-4 py-3 text-sm font-semibold text-slate-600 text-center">Rating</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {services.map((job: any) => (
                                        <tr key={job.id} className="hover:bg-slate-50/50">
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    {job.thumbnail ? (
                                                        <img src={job.thumbnail} alt="service-img" className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center text-slate-400">
                                                            <Loader2 size={16} />
                                                        </div>
                                                    )}
                                                    <span className="text-sm font-medium text-slate-900 line-clamp-1">{job.title}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <span className="text-sm font-bold text-slate-900">${job.basePrice}</span>
                                                <span className="text-[10px] text-slate-500 block capitalize">{job.priceType}</span>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                                    job.status === "PUBLISHED" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                                                }`}>
                                                    {job.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-center text-sm text-slate-600">{job.totalBookings}</td>
                                            <td className="px-4 py-4 text-center text-sm text-amber-500 font-medium">
                                                ★ {job.averageRating || "N/A"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function ProviderListPage() {
    /* ── Pagination & filter state ── */
    const LIMIT = 10;
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [verificationFilter, setVerificationFilter] = useState("");
    const [showVerifyFilter, setShowVerifyFilter] = useState(false);

    const debouncedSearch = useDebounce(searchInput, 400);
    useEffect(() => { setPage(1); }, [debouncedSearch, statusFilter, verificationFilter]);

    /* ── Local UI state ── */
    const [localRows, setLocalRows] = useState<ProviderRow[]>([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [isServicesModalOpen, setIsServicesModalOpen] = useState(false);
    const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);

    const [verifyProvider] = useVerifyProviderMutation();
    const [rejectProvider] = useRejectProviderMutation();
    const [updateServiceAvailability] = useUpdateServiceAvailabilityMutation();

    /* ── API ── */
    const queryParams = {
        page,
        limit: 100, // Fetch more records for better frontend filtering
    };
    const { data, isLoading, isFetching, isError } = useGetAllProvidersQuery(queryParams);

    const apiProviders = data?.data?.data ?? [];
    const pagination = data?.data?.pagination;
    const totalPages = pagination?.totalPages ?? 1;
    const total = pagination?.total ?? 0;
    const hasApiData = apiProviders.length > 0;

    useEffect(() => {
        if (hasApiData) {
            setLocalRows(
                apiProviders.map((p) => ({
                    id: p.id,
                    name: `${p.firstName} ${p.lastName}`,
                    rating: p.averageRating?.toString() || "0",
                    phone: p.phone,
                    email: p.email,
                    bookings: p.totalJobs,
                    providerServiceAvailability: p.providerServiceAvailability,
                    verificationStatus: p.verificationStatus,
                    avatar: p.avatar,
                    isProviderRecomendation: p.isProviderRecomendation,
                    status: p.status,
                }))
            );
        }
    }, [apiProviders, isLoading, isFetching]);

    const displayedRows = useMemo(() => {
        return localRows.filter((r) => {
            const matchesSearch = 
                r.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                r.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                r.phone.includes(debouncedSearch);
            
            const matchesStatus = statusFilter ? r.status === statusFilter : true;
            const matchesVerification = verificationFilter ? r.verificationStatus === verificationFilter : true;

            return matchesSearch && matchesVerification;
        });
    }, [localRows, debouncedSearch, verificationFilter]);

    /* ── Toggle handlers (local state) ── */
    const toggleAvailability = async (id: string, currentStatus: boolean) => {
        try {
            await updateServiceAvailability({ providerId: id, isAvailable: !currentStatus }).unwrap();
            setLocalRows((prev) =>
                prev.map((r) => r.id === id ? { ...r, providerServiceAvailability: !currentStatus } : r)
            );
            Swal.fire({
                icon: "success",
                title: "Updated",
                text: `Service availability ${!currentStatus ? "enabled" : "disabled"}.`,
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Failed",
                text: "Could not update service availability.",
            });
        }
    };


    const [toggleRecommendation] = useToggleRecommendationMutation();
    const toggleRecomendation = async (id: string, currentStatus: boolean) => {
        try {
            await toggleRecommendation({ id, isRecmmendation: !currentStatus }).unwrap();
            setLocalRows((prev) =>
                prev.map((r) => r.id === id ? { ...r, isProviderRecomendation: !currentStatus } : r)
            );
            Swal.fire({
                icon: "success",
                title: "Updated",
                text: `Provider recommendation status ${!currentStatus ? "enabled" : "disabled"}.`,
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Failed",
                text: "Could not update recommendation status.",
            });
        }
    };

    const handleVerify = async (id: string) => {
        try {
            await verifyProvider(id).unwrap();
            setLocalRows((prev) =>
                prev.map((r) => r.id === id ? { ...r, verificationStatus: "VERIFIED" } : r)
            );
            Swal.fire({
                icon: "success",
                title: "Verified",
                text: "Provider has been verified successfully.",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Failed",
                text: "Could not verify provider.",
            });
        }
    };

    const handleReject = async (id: string) => {
        try {
            await rejectProvider(id).unwrap();
            setLocalRows((prev) =>
                prev.map((r) => r.id === id ? { ...r, verificationStatus: "REJECTED" } : r)
            );
            Swal.fire({
                icon: "success",
                title: "Rejected",
                text: "Provider has been rejected successfully.",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Failed",
                text: "Could not reject provider.",
            });
        }
    };

    /* ── Services Modal Handlers ── */
    const handleViewServices = (id: string) => {
        setSelectedProviderId(id);
        setIsServicesModalOpen(true);
    };

    /* ── Delete ── */
    const handleDelete = (id: string) => { setItemToDelete(id); setIsDeleteModalOpen(true); };
    const confirmDelete = () => {
        if (itemToDelete) setLocalRows((prev) => prev.filter((r) => r.id !== itemToDelete));
        setItemToDelete(null);
        setIsDeleteModalOpen(false);
    };

    /* ── CSV download ── */
    const handleDownload = () => {
        const headers = ["ID", "Name", "Email", "Phone", "Bookings", "Verification Status", "Available"];
        const csvContent = [
            headers.join(","),
            ...displayedRows.map((p) => [
                p.id,
                `"${p.name}"`,
                p.email,
                `"${p.phone}"`,
                p.bookings,
                p.verificationStatus,
                p.providerServiceAvailability ? "Yes" : "No",
            ].join(","))
        ].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "providers_list.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    /* ── Pagination buttons ── */
    const effectiveTotalPages = hasApiData ? totalPages : Math.ceil(apiProviders.length / LIMIT);
    const renderPageButtons = () => {
        const pages: (number | "...")[] = [];
        if (effectiveTotalPages <= 7) {
            for (let i = 1; i <= effectiveTotalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (page > 3) pages.push("...");
            for (let i = Math.max(2, page - 1); i <= Math.min(effectiveTotalPages - 1, page + 1); i++) pages.push(i);
            if (page < effectiveTotalPages - 2) pages.push("...");
            pages.push(effectiveTotalPages);
        }
        return pages;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Provider list</h2>
                <p className="text-sm text-slate-500 mt-2">View and manage all registered providers</p>
            </div>

            {/* Main Card */}
            <div className="bg-white px-[26px] py-[34px] rounded-lg">
                {/* Actions Bar */}
                <div className="pb-6 flex flex-wrap items-center justify-between gap-4">
                    {/* Search */}
                    <div className="hidden sm:flex items-center flex-1 max-w-md relative group">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full pl-15 px-4 py-1.5 h-[45px] bg-white border border-blue-300 rounded-[50px] text-sm font-normal text-black focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                        />
                        <button className="absolute left-1.5 top-1.2 bottom-1.2 w-9 h-9 flex items-center justify-center bg-[#787BEB] text-white rounded-full hover:bg-blue-700 transition-colors shadow-sm">
                            <Search size={18} />
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <button
                                onClick={() => setShowVerifyFilter((v) => !v)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                    showVerifyFilter || verificationFilter
                                        ? "bg-[#787BEB] text-white"
                                        : "bg-slate-900 text-white hover:bg-slate-800"
                                }`}
                            >
                                <Filter size={16} />
                                Status
                                {verificationFilter && (
                                    <span className="ml-1 bg-white/20 text-white rounded-full px-1.5 py-0.5 text-xs">1</span>
                                )}
                            </button>
                            {showVerifyFilter && (
                                <div className="absolute right-0 top-full mt-2 z-20 bg-white border border-slate-200 rounded-xl shadow-lg p-4 w-56">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-semibold text-slate-700">Verification Status</span>
                                        <button onClick={() => setShowVerifyFilter(false)} className="text-slate-400 hover:text-slate-600">
                                            <X size={16} />
                                        </button>
                                    </div>
                                    <div className="space-y-1">
                                        {VERIFICATION_OPTIONS.map((opt) => (
                                            <button
                                                key={opt.value}
                                                onClick={() => { setVerificationFilter(opt.value); setShowVerifyFilter(false); }}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                                    verificationFilter === opt.value
                                                        ? "bg-[#787BEB]/10 text-[#787BEB] font-medium"
                                                        : "text-slate-600 hover:bg-slate-50"
                                                }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Active filter chips */}
                {(statusFilter || verificationFilter) && (
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                        <span className="text-xs text-slate-500">Active filters:</span>
                        {verificationFilter && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#787BEB]/10 text-[#787BEB] text-xs font-medium rounded-full">
                                {VERIFICATION_OPTIONS.find((o) => o.value === verificationFilter)?.label}
                                <button onClick={() => setVerificationFilter("")} className="hover:text-blue-900">
                                    <X size={12} />
                                </button>
                            </span>
                        )}
                        {statusFilter && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#787BEB]/10 text-[#787BEB] text-xs font-medium rounded-full">
                                {STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label}
                                <button onClick={() => setStatusFilter("")} className="hover:text-blue-900">
                                    <X size={12} />
                                </button>
                            </span>
                        )}
                    </div>
                )}

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
                            <p className="text-sm font-medium">Failed to load providers. Showing static data.</p>
                        </div>
                    ) : (
                        <table className={`w-full text-left border transition-opacity ${isFetching ? "opacity-60" : "opacity-100"}`}>
                            <thead>
                                <tr className="bg-blue-50 border-r border-b border-slate-300">
                                    <th className="px-4 py-3 text-base font-semibold text-slate-600 capitalize border-r-2 border-slate-300">SL</th>
                                    <th className="px-4 py-3 text-base font-semibold text-slate-600 capitalize border-r-2 border-slate-300">Provider</th>
                                    <th className="px-4 py-3 text-base font-semibold text-slate-600 capitalize border-r-2 border-slate-300">Contact information</th>
                                    <th className="px-4 py-3 text-base font-semibold text-slate-600 capitalize border-r-2 border-slate-300 text-center">Services</th>
                                    <th className="px-4 py-3 text-base font-semibold text-slate-600 capitalize border-r-2 border-slate-300 text-center">Total Bookings served</th>
                                    <th className="px-4 py-3 text-base font-semibold text-slate-600 capitalize border-r-2 border-slate-300 text-center">Service Availability</th>
                                    <th className="px-4 py-3 text-base font-semibold text-slate-600 capitalize border-r-2 border-slate-300 text-center">Verification Status</th>
                                    <th className="px-4 py-3 text-base font-semibold text-slate-600 capitalize border-r-2 border-slate-300 text-center">Recommendation</th>
                                    <th className="px-4 py-3 text-base font-semibold text-slate-600 capitalize text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-300">
                                {displayedRows.map((provider, index) => (
                                    <tr key={provider.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-4 py-4 text-sm text-slate-600 border-r-2 border-slate-300">
                                            {hasApiData ? (page - 1) * LIMIT + index + 1 : String(index + 1).padStart(2, "0")}
                                        </td>
                                        <td className="px-4 py-4 border-r-2 border-slate-300">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                                                    {provider.avatar ? (
                                                        <img
                                                            src={provider.avatar}
                                                            alt={provider.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold">
                                                            {provider.name.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-[#0F172A]">{provider.name}</div>
                                                    <div className="text-xs text-[#FF8113]">
                                                        ★ <span className="text-[#475569]">{provider.rating}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 border-r-2 border-slate-300">
                                            <div className="text-base text-[#2C2C2C]">{provider.phone}</div>
                                            <div className="text-sm text-[#2C2C2C]">{provider.email}</div>
                                        </td>
                                        <td className="px-4 py-4 text-base text-[#2C2C2C] border-r-2 border-slate-300 text-center">
                                            <ServiceCountCell providerId={provider.id} onViewServices={handleViewServices} />
                                        </td>
                                        <td className="px-4 py-4 text-base text-[#2C2C2C] border-r-2 border-slate-300 text-center">
                                            <BookingCountCell userId={provider.id} />
                                        </td>
                                        <td className="px-4 py-4 border-r-2 border-slate-300 text-center">
                                            <button
                                                onClick={() => toggleAvailability(provider.id, provider.providerServiceAvailability)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${provider.providerServiceAvailability ? "bg-[#000000]" : "bg-slate-500"
                                                    }`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${provider.providerServiceAvailability ? "translate-x-6" : "translate-x-1"
                                                        }`}
                                                />
                                            </button>
                                        </td>
                                        <td className="px-4 py-4 border-r-2 border-slate-300 text-center">
                                            <span className={`inline-block px-3 py-1 rounded-md text-sm font-semibold ${provider.verificationStatus === "VERIFIED"
                                                ? "bg-emerald-50 text-emerald-700"
                                                : provider.verificationStatus === "PENDING"
                                                    ? "bg-amber-50 text-amber-700"
                                                    : provider.verificationStatus === "REJECTED"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-red-50 text-red-600"
                                                }`}>
                                                {provider.verificationStatus === "VERIFIED" ? "Verified"
                                                    : provider.verificationStatus === "PENDING" ? "Pending"
                                                        : provider.verificationStatus === "REJECTED" ? "Rejected"
                                                            : "Unverified"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 border-r-2 border-slate-300 text-center">

                                            <button
                                                onClick={() => toggleRecomendation(provider.id, provider.isProviderRecomendation)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${provider.isProviderRecomendation ? "bg-[#000000]" : "bg-slate-500"
                                                    } ${provider.verificationStatus !== "VERIFIED" && "opacity-50 cursor-not-allowed"}`}
                                                disabled={provider.verificationStatus !== "VERIFIED"}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${provider.isProviderRecomendation ? "translate-x-6" : "translate-x-1"
                                                        }`}
                                                />
                                            </button>
                                                
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <button
                                                onClick={() => handleVerify(provider.id)}
                                                disabled={provider.verificationStatus === "VERIFIED"}
                                                className={`p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed`}
                                                title="Verify"
                                            >
                                                <Check size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleReject(provider.id)}
                                                disabled={provider.verificationStatus === "REJECTED"}
                                                className={`p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed`}
                                                title="Reject"
                                            >
                                                <X size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(provider.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                <div className="py-6 border-t border-slate-200 flex items-center justify-center md:justify-end gap-1 md:gap-4">
                    <button
                        disabled={page <= 1 || isFetching}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="flex items-center gap-1 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft size={16} className="-mt-1" />
                        Previous
                    </button>
                    <div className="flex items-center gap-1">
                        {renderPageButtons().map((item, i) =>
                            item === "..." ? (
                                <span key={`ellipsis-${i}`} className="px-2 text-slate-400">...</span>
                            ) : (
                                <button
                                    key={item}
                                    onClick={() => setPage(item as number)}
                                    disabled={isFetching}
                                    className={`w-8 h-8 rounded-lg text-sm flex items-center justify-center -mt-1 font-medium transition-all ${item === page
                                        ? "border border-slate-200 text-black"
                                        : "text-slate-600 hover:bg-slate-100"
                                        }`}
                                >
                                    {item}
                                </button>
                            )
                        )}
                    </div>
                    <button
                        disabled={page >= effectiveTotalPages || isFetching}
                        onClick={() => setPage((p) => Math.min(effectiveTotalPages, p + 1))}
                        className="flex items-center gap-1 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        Next
                        <ChevronRight size={16} className="-mt-1" />
                    </button>
                </div>
            </div>

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Provider"
                description="Are you sure you want to delete this provider? This action cannot be undone."
            />

            <ServicesModal
                isOpen={isServicesModalOpen}
                onClose={() => setIsServicesModalOpen(false)}
                providerId={selectedProviderId}
            />
        </div>
    );
}
