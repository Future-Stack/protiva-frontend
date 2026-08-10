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
    X,
} from "lucide-react";
import DeleteModal from "@/components/DeleteModal";
import { useGetAllUsersQuery, useDeleteUserMutation } from "@/lib/features/super-admin/user/userAPI";
import { useGetUserTotalBookingQuery } from "@/lib/features/super-admin/booking/bookingAPI";
import { useAppSelector } from "@/lib/hooks";

/* ─── Static fallback data ───────────────────────────────────────────── */
const STATIC_USERS = [
    { id: "01", name: "Emir Ansal", phone: "+65824125", email: "polo@gmail.com", totalBooking: 10, status: "ACTIVE", verificationStatus: "VERIFIED", },
    { id: "02", name: "John Doe", phone: "+65954425", email: "john@gmail.com", totalBooking: 10, status: "PENDING", verificationStatus: "VERIFIED" },
    { id: "03", name: "Jane Smith", phone: "+65734210", email: "jane@gmail.com", totalBooking: 10, status: "PENDING", verificationStatus: "UNVERIFIED" },
    { id: "04", name: "Kamrul Biswas", phone: "+65612345", email: "kamrul@gmail.com", totalBooking: 10, status: "ACTIVE", verificationStatus: "VERIFIED" },
    { id: "05", name: "Md Arman", phone: "+65901234", email: "arman@gmail.com", totalBooking: 10, status: "PENDING", verificationStatus: "VERIFIED" },
    { id: "06", name: "Rosul Ahmed", phone: "+65456789", email: "rosul@gmail.com", totalBooking: 10, status: "PENDING", verificationStatus: "UNVERIFIED" },
    { id: "07", name: "Nafis Hasan", phone: "+65876543", email: "nafis@gmail.com", totalBooking: 10, status: "ACTIVE", verificationStatus: "VERIFIED" },
    { id: "08", name: "Rafi Islam", phone: "+65234567", email: "rafi@gmail.com", totalBooking: 10, status: "PENDING", verificationStatus: "UNVERIFIED" },
    { id: "09", name: "Sara Begum", phone: "+65345678", email: "sara@gmail.com", totalBooking: 10, status: "ACTIVE", verificationStatus: "VERIFIED" },
    { id: "10", name: "Tanvir Hossain", phone: "+65123456", email: "tanvir@gmail.com", totalBooking: 10, status: "PENDING", verificationStatus: "UNVERIFIED" },
];
const totalBooking = 10;

/* ─── Debounce hook ──────────────────────────────────────────────────── */
function useDebounce<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState<T>(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debounced;
}

/* ─── Normalised row shape ───────────────────────────────────────────── */
interface UserRow {
    id: string;
    name: string;
    phone: string;
    email: string;
    totalBooking: number;
    status: string;             // "ACTIVE" | "PENDING" | "SUSPENDED"
    verificationStatus: string; // "VERIFIED" | "UNVERIFIED"
    emailVerified: boolean;
    lastLogin: string | null;
    createdAt: string;
    avatarSeed: string;
}

const BookingCountCell = ({ userId }: { userId: string }) => {
    const { data, isLoading } = useGetUserTotalBookingQuery(userId);
    if (isLoading) return <div className="h-4 w-8 bg-slate-100 animate-pulse rounded mx-auto"></div>;
    return <div className="text-sm text-[#2C2C2C]">{data?.data ?? 0}</div>;
};

/* ─── Status badge helper ────────────────────────────────────────────── */
const getStatusStyles = (status: string) => {
    switch (status) {
        case "ACTIVE": return "text-green-500";
        case "SUSPENDED": return "text-red-500";
        default: return "text-yellow-500";
    }
};
const getStatusLabel = (status: string) => {
    switch (status) {
        case "ACTIVE": return "Active";
        case "SUSPENDED": return "Suspended";
        default: return "Pending";
    }
};

const getVerificationStyles = (vs: string) =>
    vs === "VERIFIED"
        ? "bg-blue-50 text-blue-700"
        : "bg-slate-100 text-slate-500";

const STATUS_OPTIONS = [
    { value: "", label: "All Status" },
    { value: "ACTIVE", label: "Active" },
    { value: "PENDING", label: "Pending" },
    { value: "SUSPENDED", label: "Suspended" },
];

export default function UsersPage() {
    /* ── Pagination & filter state ── */
    const LIMIT = 10;
    const [page, setPage] = useState(1);
    const globalSearch = useAppSelector((state) => state.search.query);
    const [searchInput, setSearchInput] = useState(globalSearch || "");
    const [statusFilter, setStatusFilter] = useState("");
    const [showFilter, setShowFilter] = useState(false);

    const debouncedSearch = useDebounce(searchInput, 400);

    // Sync local search with global search
    useEffect(() => {
        setSearchInput(globalSearch);
    }, [globalSearch]);

    useEffect(() => { setPage(1); }, [debouncedSearch, statusFilter]);

    /* ── Local UI state ── */
    const [localRows, setLocalRows] = useState<UserRow[]>([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

    /* ── API ── */
    const queryParams = {
        page,
        limit: LIMIT,
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
        ...(statusFilter ? { status: statusFilter } : {}),
    };
    const { data, isLoading, isFetching, isError } = useGetAllUsersQuery(queryParams);
    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

    const apiUsers = data?.data?.data ?? [];
    const pagination = data?.data?.pagination;
    const totalPages = pagination?.totalPages ?? 1;
    const total = pagination?.total ?? 0;
    const hasApiData = apiUsers.length > 0;

    /* ── Sync local rows ── */
    useEffect(() => {
        if (hasApiData) {
            setLocalRows(
                apiUsers.map((u) => ({
                    id: u.id,
                    name: `${u.firstName} ${u.lastName}`,
                    phone: u.phone,
                    email: u.email,
                    totalBooking: totalBooking,
                    status: u.status,
                    verificationStatus: u.verificationStatus,
                    emailVerified: u.emailVerified,
                    lastLogin: u.lastLogin,
                    createdAt: u.createdAt,
                    avatarSeed: u.id,
                }))
            );
        } 
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiUsers, isLoading, isFetching]);

    /* ── Client-side filter for static fallback ── */
    const displayedRows = useMemo(() => {
        const rows = hasApiData ? localRows : localRows;
        return rows.filter((r) => {
            const searchLower = debouncedSearch.toLowerCase();
            const matchesSearch =
                r.id.toLowerCase().includes(searchLower) ||
                r.name.toLowerCase().includes(searchLower) ||
                r.email.toLowerCase().includes(searchLower) ||
                r.phone.includes(debouncedSearch);

            const matchesStatus = statusFilter ? r.status === statusFilter : true;
            return matchesSearch && matchesStatus;
        });
    }, [localRows, debouncedSearch, statusFilter, hasApiData]);

    /* ── Delete ── */
    const handleDelete = (id: string) => { setItemToDelete(id); setIsDeleteModalOpen(true); };
    const confirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            if (hasApiData) {
                // Optimistic remove
                setLocalRows((prev) => prev.filter((r) => r.id !== itemToDelete));
                await deleteUser(itemToDelete).unwrap();
            } else {
                setLocalRows((prev) => prev.filter((r) => r.id !== itemToDelete));
            }
        } catch {
            // If API call fails, refresh will restore data
        } finally {
            setItemToDelete(null);
            setIsDeleteModalOpen(false);
        }
    };

    /* ── CSV download ── */
    const handleDownload = () => {
        const headers = ["SL", "Name", "Email", "Phone", "Total Booking", "Status", "Verification", "Email Verified", "Last Login", "Joined"];
        const csvContent = [
            headers.join(","),
            ...displayedRows.map((u, i) => [
                hasApiData ? (page - 1) * LIMIT + i + 1 : String(i + 1).padStart(2, "0"),
                `"${u.name}"`,
                u.email,
                `"${u.phone}"`,
                u.totalBooking,
                u.status,
                u.verificationStatus,
                u.emailVerified ? "Yes" : "No",
                u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : "—",
                new Date(u.createdAt).toLocaleDateString(),
            ].join(","))
        ].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "users_list.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    /* ── Pagination ── */
    const effectiveTotalPages = hasApiData ? totalPages : Math.ceil(STATIC_USERS.length / LIMIT);
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
                <h2 className="text-2xl font-bold text-slate-900">User List</h2>
                <p className="text-sm text-slate-500 mt-2">
                    Monitor user activity and account status
                    {hasApiData && (
                        <span className="ml-2 text-slate-400">— {total} total users</span>
                    )}
                </p>
            </div>

            {/* Main Card */}
            <div className="bg-white p-4 sm:px-[26px] sm:py-[34px] rounded-lg">
                {/* Actions Bar */}
                <div className="pb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                    {/* Search */}
                    <div className="flex items-center w-full md:flex-1 md:max-w-md relative group">
                        <input
                            type="text"
                            placeholder="Search by name, email or phone…"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full pl-15 px-4 py-1.5 h-[45px] bg-white border border-blue-300 rounded-[50px] text-sm font-normal text-black focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                        />
                        <button className="absolute left-1.5 w-9 h-9 flex items-center justify-center bg-[#787BEB] text-white rounded-full hover:bg-blue-700 transition-colors shadow-sm">
                            <Search size={18} />
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                            <Download size={16} />
                            Download CSV
                        </button>
                        <div className="relative">
                            <button
                                onClick={() => setShowFilter((v) => !v)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${showFilter || statusFilter
                                        ? "bg-[#787BEB] text-white"
                                        : "bg-slate-900 text-white hover:bg-slate-800"
                                    }`}
                            >
                                <Filter size={16} />
                                Filter
                                {statusFilter && (
                                    <span className="ml-1 bg-white/20 text-white rounded-full px-1.5 py-0.5 text-xs">1</span>
                                )}
                            </button>
                            {showFilter && (
                                <div className="absolute right-0 top-full mt-2 z-20 bg-white border border-slate-200 rounded-xl shadow-lg p-4 w-56">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-semibold text-slate-700">Filter by Status</span>
                                        <button onClick={() => setShowFilter(false)} className="text-slate-400 hover:text-slate-600">
                                            <X size={16} />
                                        </button>
                                    </div>
                                    <div className="space-y-1">
                                        {STATUS_OPTIONS.map((opt) => (
                                            <button
                                                key={opt.value}
                                                onClick={() => { setStatusFilter(opt.value); setShowFilter(false); }}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${statusFilter === opt.value
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

                {/* Active filter chip */}
                {statusFilter && (
                    <div className="mb-4 flex items-center gap-2">
                        <span className="text-xs text-slate-500">Active filter:</span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#787BEB]/10 text-[#787BEB] text-xs font-medium rounded-full">
                            {STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label}
                            <button onClick={() => setStatusFilter("")} className="hover:text-blue-900">
                                <X size={12} />
                            </button>
                        </span>
                    </div>
                )}

                {/* Table */}
                <div className="w-full overflow-x-auto rounded-xl border border-slate-200 scrollbar-hide">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-24 gap-3 text-slate-400">
                            <Loader2 size={28} className="animate-spin" />
                            <span className="text-sm">Loading users…</span>
                        </div>
                    ) : isError ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3 text-red-500">
                            <AlertCircle size={36} />
                            <p className="text-sm font-medium">Failed to load users. Showing static fallback.</p>
                        </div>
                    ) : (
                        <table className={`w-full text-left border min-w-[850px] transition-opacity ${isFetching ? "opacity-60" : "opacity-100"}`}>
                            <thead>
                                <tr className="bg-blue-50 border-r border-b border-slate-300">
                                    <th className="px-4 py-3 text-base font-semibold text-slate-600 border-r-2 border-slate-300">SL</th>
                                    <th className="px-4 py-3 text-base font-semibold text-slate-600 border-r-2 border-slate-300">User Name</th>
                                    <th className="px-4 py-3 text-base font-semibold text-slate-600 border-r-2 border-slate-300">Contact Information</th>
                                    <th className="px-4 py-3 text-base font-semibold text-slate-600 border-r-2 border-slate-300 text-center">Total Booking</th>
                                    <th className="px-4 py-3 text-base font-semibold text-slate-600 border-r-2 border-slate-300 text-center">Status</th>
                                    {/* <th className="px-4 py-3 text-base font-semibold text-slate-600 border-r-2 border-slate-300 text-center">Verification</th> */}
                                    <th className="px-4 py-3 text-base font-semibold text-slate-600 border-r-2 border-slate-300 text-center">Last Login</th>
                                    <th className="px-4 py-3 text-base font-semibold text-slate-600 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-300">
                                {displayedRows.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-16 text-center text-slate-400 text-sm">
                                            No users found.
                                        </td>
                                    </tr>
                                ) : (
                                    displayedRows.map((user, index) => (
                                        <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-4 py-4 text-sm text-slate-600 border-r-2 border-slate-300">
                                                {hasApiData ? (page - 1) * LIMIT + index + 1 : String(index + 1).padStart(2, "0")}
                                            </td>
                                            <td className="px-4 py-4 border-r-2 border-slate-300">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                                                        <img
                                                            src={`https://picsum.photos/seed/${user.avatarSeed}/100/100`}
                                                            alt=""
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-[#0F172A]">{user.name}</div>
                                                        {/* <div className="text-xs text-slate-400 mt-0.5">
                                                            {user.emailVerified ? "✉ Verified" : "✉ Unverified"}
                                                        </div> */}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 border-r-2 border-slate-300">
                                                <div className="text-sm text-[#2C2C2C]">{user.phone}</div>
                                                <div className="text-sm text-[#2C2C2C]">{user.email}</div>
                                            </td>
                                            <td className="px-4 py-4 border-r-2 border-slate-300 text-center">
                                                <BookingCountCell userId={user.id} />
                                            </td>
                                            <td className="px-4 py-4 border-r-2 border-slate-300 text-center">
                                                <span className={`inline-block px-3 py-1 rounded-md text-sm font-medium ${getStatusStyles(user.status)}`}>
                                                    {getStatusLabel(user.status)}
                                                </span>
                                            </td>
                                            {/* <td className="px-4 py-4 border-r-2 border-slate-300 text-center">
                                                <span className={`inline-block px-3 py-1 rounded-md text-sm font-medium ${getVerificationStyles(user.verificationStatus)}`}>
                                                    {user.verificationStatus === "VERIFIED" ? "Verified" : "Unverified"}
                                                </span>
                                            </td> */}
                                            <td className="px-4 py-4 text-sm text-slate-500 border-r-2 border-slate-300 text-center">
                                                {user.lastLogin
                                                    ? new Date(user.lastLogin).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                                                    : <span className="text-slate-300">—</span>
                                                }
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    disabled={isDeleting && itemToDelete === user.id}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                                                >
                                                    {isDeleting && itemToDelete === user.id
                                                        ? <Loader2 size={18} className="animate-spin" />
                                                        : <Trash2 size={18} />
                                                    }
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
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
                title="Delete User"
                description="Are you sure you want to delete this user? This action cannot be undone."
            />
        </div>
    );
}
