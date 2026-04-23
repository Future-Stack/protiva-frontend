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
    Image,
} from "lucide-react";
import DeleteModal from "@/components/DeleteModal";
import { 
    useGetAllProvidersQuery,
    useToggleRecommendationMutation,
    useVerifyProviderMutation,
    useRejectProviderMutation,
    useUpdateServiceAvailabilityMutation,
    useGetProviderJobsQuery
} from "@/lib/features/super-admin/provider/providerAPI";
import { useDeleteUserMutation } from "@/lib/features/super-admin/user/userAPI";
import { useGetUserTotalBookingQuery } from "@/lib/features/super-admin/booking/bookingAPI";
import { useAppSelector } from "@/lib/hooks";
import Swal from "sweetalert2";

/* ─── Normalised row shape ──────────────────────────────────────────── */
interface ProviderRow {
    id: string;
    name: string;
    rating: string;
    phone: string;
    email: string;
    bookings: number;
    providerServiceAvailability: boolean;
    verificationStatus: string; 
    avatar: string | null;
    avatarSeed: string;
    isProviderRecomendation: boolean;
    status: string;
}

const VERIFICATION_OPTIONS = [
    { value: "",          label: "All Status" },
    { value: "VERIFIED",  label: "Verified" },
    { value: "UNVERIFIED",label: "Unverified" },
];

const STATUS_OPTIONS = [
    { value: "",          label: "All Activity" },
    { value: "ACTIVE",    label: "Active" },
    { value: "PENDING",   label: "Pending" },
    { value: "SUSPENDED", label: "Suspended" },
];

/* ─── Debounce hook ──────────────────────────────────────────────────── */
function useDebounce<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState<T>(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debounced;
}

/* ─── Cell Components ────────────────────────────────────────────────── */
const BookingCountCell = ({ userId }: { userId: string }) => {
    const { data, isLoading } = useGetUserTotalBookingQuery(userId);
    if (isLoading) return <div className="h-4 w-8 bg-slate-100 animate-pulse rounded mx-auto" />;
    return <span className="text-base text-[#2C2C2C]">{data?.data ?? 0}</span>;
};

const ServiceCountCell = ({ providerId, onViewServices }: { providerId: string; onViewServices: (id: string) => void }) => {
    const { data, isLoading } = useGetProviderJobsQuery(providerId);
    if (isLoading) return <div className="h-4 w-8 bg-slate-100 animate-pulse rounded mx-auto" />;
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
                    <button onClick={onClose} className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function SubAdminProviderListPage() {
    const { user } = useAppSelector((state) => state.auth);
    const hasViewPermission    = user?.role === "SUPER_ADMIN" || user?.adminPermissions?.isViewProvider || user?.adminPermissions?.isManageProvider;
    const hasManagePermission  = user?.role === "SUPER_ADMIN" || user?.adminPermissions?.isManageProvider;
    const canDelete            = user?.role === "SUPER_ADMIN";

    const [localRows, setLocalRows] = useState<ProviderRow[]>([]);
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [verificationFilter, setVerificationFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [showVerifyFilter, setShowVerifyFilter] = useState(false);

    const debouncedSearch = useDebounce(searchInput, 400);

    const { data, isLoading, isFetching, isError, refetch } = useGetAllProvidersQuery({
        page,
        limit: 100, // Fetch more for frontend filtering
    }, { skip: !hasViewPermission });

    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
    const [verifyProvider] = useVerifyProviderMutation();
    const [rejectProvider] = useRejectProviderMutation();
    const [updateServiceAvailability] = useUpdateServiceAvailabilityMutation();
    const [toggleRecommendation] = useToggleRecommendationMutation();

    const apiProviders = data?.data?.data ?? [];
    const pagination = data?.data?.pagination;
    const totalPages = pagination?.totalPages ?? 1;

    useEffect(() => {
        if (apiProviders.length > 0) {
            setLocalRows(
                apiProviders.map((p: any) => ({
                    id: p.id,
                    name: `${p.firstName} ${p.lastName}`,
                    rating: p.averageRating?.toString() || "0",
                    phone: p.phone,
                    email: p.email,
                    bookings: p.totalJobs,
                    providerServiceAvailability: p.providerServiceAvailability,
                    verificationStatus: p.verificationStatus,
                    avatar: p.avatar,
                    avatarSeed: p.id,
                    isProviderRecomendation: p.isProviderRecomendation,
                    status: p.status,
                }))
            );
        }
    }, [apiProviders, isLoading, isFetching]);

    // FRONTEND FILTERING
    const displayedRows = useMemo(() => {
        return localRows.filter((r) => {
            const matchesSearch = 
                r.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                r.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                r.phone.includes(debouncedSearch);
            
            const matchesVerification = verificationFilter ? r.verificationStatus === verificationFilter : true;
            const matchesStatus = statusFilter ? r.status === statusFilter : true;

            return matchesSearch && matchesVerification && matchesStatus;
        });
    }, [localRows, debouncedSearch, verificationFilter, statusFilter]);

    /* ── Handlers ── */
    const toggleAvailability = async (id: string, currentStatus: boolean) => {
        try {
            await updateServiceAvailability({ providerId: id, isAvailable: !currentStatus }).unwrap();
            setLocalRows(prev => prev.map(r => r.id === id ? { ...r, providerServiceAvailability: !currentStatus } : r));
            Swal.fire({ icon: "success", title: "Updated", text: "Availability toggled.", timer: 1500, showConfirmButton: false });
        } catch { Swal.fire({ icon: "error", title: "Failed", text: "Update failed." }); }
    };

    const toggleRecomend = async (id: string, currentStatus: boolean) => {
        try {
            await toggleRecommendation({ id, isRecmmendation: !currentStatus }).unwrap();
            setLocalRows(prev => prev.map(r => r.id === id ? { ...r, isProviderRecomendation: !currentStatus } : r));
            Swal.fire({ icon: "success", title: "Updated", text: "Recommendation updated.", timer: 1500, showConfirmButton: false });
        } catch { Swal.fire({ icon: "error", title: "Failed", text: "Update failed." }); }
    };

    const handleVerify = async (id: string) => {
        try {
            await verifyProvider(id).unwrap();
            setLocalRows(prev => prev.map(r => r.id === id ? { ...r, verificationStatus: "VERIFIED" } : r));
            Swal.fire({ icon: "success", title: "Verified", text: "Provider verified.", timer: 1500, showConfirmButton: false });
        } catch { Swal.fire({ icon: "error", title: "Failed", text: "Verification failed." }); }
    };

    const handleReject = async (id: string) => {
        try {
            await rejectProvider(id).unwrap();
            setLocalRows(prev => prev.map(r => r.id === id ? { ...r, verificationStatus: "REJECTED" } : r));
            Swal.fire({ icon: "success", title: "Rejected", text: "Provider rejected.", timer: 1500, showConfirmButton: false });
        } catch { Swal.fire({ icon: "error", title: "Failed", text: "Rejection failed." }); }
    };

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [isServicesModalOpen, setIsServicesModalOpen] = useState(false);
    const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);

    const handleDelete = (id: string) => { setItemToDelete(id); setIsDeleteModalOpen(true); };
    const confirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            await deleteUser(itemToDelete).unwrap();
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
            refetch();
            Swal.fire({ icon: "success", title: "Deleted!", text: "Provider removed.", timer: 1800, showConfirmButton: false });
        } catch { Swal.fire({ icon: "error", title: "Failed", text: "Delete failed." }); }
    };

    const handleDownload = () => {
        const headers = ["ID", "Name", "Email", "Phone", "Status", "Verification"];
        const csv = [headers.join(","), ...displayedRows.map(r => [r.id, `"${r.name}"`, r.email, `"${r.phone}"`, r.status, r.verificationStatus].join(","))].join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "providers.csv";
        link.click();
    };

    if (!hasViewPermission) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h2>
                    <p className="text-slate-500">You do not have permission to view providers.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Provider list</h2>
                    <p className="text-sm text-slate-500 mt-2">View and manage all registered providers</p>
                </div>
            </div>

            <div className="bg-white px-[26px] py-[34px] rounded-lg">
                <div className="pb-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="hidden sm:flex items-center flex-1 max-w-md relative group">
                        <input
                            type="text"
                            placeholder="Search providers..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full pl-15 px-4 py-1.5 h-[45px] bg-white border border-blue-300 rounded-[50px] text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                        />
                        <button className="absolute left-1.5 top-1.2 bottom-1.2 w-9 h-9 flex items-center justify-center bg-[#787BEB] text-white rounded-full">
                            <Search size={18} />
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                            <Download size={16} />
                            Download CSV
                        </button>
                        <div className="relative">
                            <button
                                onClick={() => setShowVerifyFilter(!showVerifyFilter)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${showVerifyFilter || verificationFilter || statusFilter ? "bg-[#787BEB] text-white" : "bg-slate-900 text-white"}`}
                            >
                                <Filter size={16} />
                                Filter
                            </button>
                            {showVerifyFilter && (
                                <div className="absolute right-0 top-full mt-2 z-20 bg-white border border-slate-200 rounded-xl shadow-lg p-4 w-64 space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Verification</label>
                                        <div className="flex flex-col gap-1">
                                            {VERIFICATION_OPTIONS.map(opt => (
                                                <button key={opt.value} onClick={() => { setVerificationFilter(opt.value); setShowVerifyFilter(false); }} className={`text-left px-3 py-2 rounded-lg text-sm ${verificationFilter === opt.value ? "bg-[#787BEB]/10 text-[#787BEB] font-bold" : "text-slate-600 hover:bg-slate-50"}`}>
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Activity Status</label>
                                        <div className="flex flex-col gap-1">
                                            {STATUS_OPTIONS.map(opt => (
                                                <button key={opt.value} onClick={() => { setStatusFilter(opt.value); setShowVerifyFilter(false); }} className={`text-left px-3 py-2 rounded-lg text-sm ${statusFilter === opt.value ? "bg-[#787BEB]/10 text-[#787BEB] font-bold" : "text-slate-600 hover:bg-slate-50"}`}>
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Active Filter Chips */}
                {(verificationFilter || statusFilter) && (
                    <div className="mb-4 flex flex-wrap gap-2">
                        {verificationFilter && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#787BEB]/10 text-[#787BEB] text-xs font-bold rounded-full">
                                {VERIFICATION_OPTIONS.find(o => o.value === verificationFilter)?.label}
                                <button onClick={() => setVerificationFilter("")}><X size={12} /></button>
                            </span>
                        )}
                        {statusFilter && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#787BEB]/10 text-[#787BEB] text-xs font-bold rounded-full">
                                {STATUS_OPTIONS.find(o => o.value === statusFilter)?.label}
                                <button onClick={() => setStatusFilter("")}><X size={12} /></button>
                            </span>
                        )}
                    </div>
                )}

                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-24 gap-3 text-slate-400"><Loader2 size={28} className="animate-spin" /><span>Loading providers…</span></div>
                    ) : isError ? (
                        <div className="text-center py-20 text-red-500"><AlertCircle size={36} className="mx-auto mb-2" /><p>Failed to load data.</p></div>
                    ) : (
                        <table className={`w-full text-left border ${isFetching ? "opacity-60" : ""}`}>
                            <thead>
                                <tr className="bg-blue-50 border-r border-b border-slate-300">
                                    <th className="px-4 py-3 text-sm font-bold text-slate-600 border-r-2 border-slate-300">SL</th>
                                    <th className="px-4 py-3 text-sm font-bold text-slate-600 border-r-2 border-slate-300">Provider</th>
                                    <th className="px-4 py-3 text-sm font-bold text-slate-600 border-r-2 border-slate-300">Contact</th>
                                    <th className="px-4 py-3 text-sm font-bold text-slate-600 border-r-2 border-slate-300 text-center">Services</th>
                                    <th className="px-4 py-3 text-sm font-bold text-slate-600 border-r-2 border-slate-300 text-center">Bookings</th>
                                    <th className="px-4 py-3 text-sm font-bold text-slate-600 border-r-2 border-slate-300 text-center">Verification</th>
                                    {hasManagePermission && <th className="px-4 py-3 text-sm font-bold text-slate-600 text-center">Actions</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-300">
                                {displayedRows.map((provider, index) => (
                                    <tr key={provider.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-4 text-sm text-slate-500 border-r-2 border-slate-300">{(page-1)*10 + index + 1}</td>
                                        <td className="px-4 py-4 border-r-2 border-slate-300">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                                                    {provider.avatar ? <img src={provider.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-500 font-bold">{provider.name.charAt(0)}</div>}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-slate-900">{provider.name}</div>
                                                    <div className="text-xs text-amber-500">★ <span className="text-slate-400">{provider.rating}</span></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 border-r-2 border-slate-300">
                                            <div className="text-sm text-slate-900">{provider.phone}</div>
                                            <div className="text-xs text-slate-400">{provider.email}</div>
                                        </td>
                                        <td className="px-4 py-4 border-r-2 border-slate-300 text-center">
                                            <ServiceCountCell providerId={provider.id} onViewServices={(id) => { setSelectedProviderId(id); setIsServicesModalOpen(true); }} />
                                        </td>
                                        <td className="px-4 py-4 border-r-2 border-slate-300 text-center"><BookingCountCell userId={provider.id} /></td>
                                        <td className="px-4 py-4 border-r-2 border-slate-300 text-center">
                                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-tight ${provider.verificationStatus === 'VERIFIED' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                                                {provider.verificationStatus}
                                            </span>
                                        </td>
                                        {hasManagePermission && (
                                            <td className="px-4 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button onClick={() => handleVerify(provider.id)} disabled={provider.verificationStatus === 'VERIFIED'} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg disabled:opacity-30"><Check size={18} /></button>
                                                    <button onClick={() => handleReject(provider.id)} disabled={provider.verificationStatus === 'REJECTED'} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg disabled:opacity-30"><X size={18} /></button>
                                                    {canDelete && <button onClick={() => handleDelete(provider.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 size={18} /></button>}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <DeleteModal isOpen={isDeleteModalOpen} onClose={() => { setIsDeleteModalOpen(false); setItemToDelete(null); }} onConfirm={confirmDelete} title="Delete Provider" description="Are you sure?" />
            <ServicesModal isOpen={isServicesModalOpen} onClose={() => setIsServicesModalOpen(false)} providerId={selectedProviderId} />
        </div>
    );
}
