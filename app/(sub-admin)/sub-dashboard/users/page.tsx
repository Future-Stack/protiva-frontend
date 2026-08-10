"use client";

import { useState, useEffect } from "react";
import {
    Search, Download, Filter, Trash2,
    ChevronLeft, ChevronRight, Loader2, AlertCircle, X,
} from "lucide-react";
import DeleteModal from "@/components/DeleteModal";
import { useGetAllUsersQuery, useDeleteUserMutation } from "@/lib/features/super-admin/user/userAPI";
import { useGetUserTotalBookingQuery } from "@/lib/features/super-admin/booking/bookingAPI";
import { useAppSelector } from "@/lib/hooks";
import Swal from "sweetalert2";

function useDebounce<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState<T>(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
}

const BookingCountCell = ({ userId }: { userId: string }) => {
    const { data, isLoading } = useGetUserTotalBookingQuery(userId);
    if (isLoading) return <div className="h-4 w-8 bg-slate-100 animate-pulse rounded mx-auto" />;
    return <div className="text-sm text-[#2C2C2C]">{data?.data ?? 0}</div>;
};

const getStatusStyles = (s: string) =>
    s === "ACTIVE" ? "text-green-500" : s === "SUSPENDED" ? "text-red-500" : "text-yellow-500";
const getStatusLabel = (s: string) =>
    s === "ACTIVE" ? "Active" : s === "SUSPENDED" ? "Suspended" : "Pending";

const STATUS_OPTIONS = [
    { value: "", label: "All Status" },
    { value: "ACTIVE", label: "Active" },
    { value: "PENDING", label: "Pending" },
    { value: "SUSPENDED", label: "Suspended" },
];

export default function UsersPage() {
    const { user } = useAppSelector((state) => state.auth);
    const hasViewPermission   = user?.role === "SUPER_ADMIN" || user?.adminPermissions?.isViewUser || user?.adminPermissions?.isManageUser;
    const hasManagePermission = user?.role === "SUPER_ADMIN" || user?.adminPermissions?.isManageUser;
    const canDelete           = user?.role === "SUPER_ADMIN";

    const LIMIT = 10;
    const [page, setPage]           = useState(1);
    const globalSearch = useAppSelector((state) => state.search.query);
    const [searchInput, setSearchInput] = useState(globalSearch || "");
    const [statusFilter, setStatusFilter] = useState("");
    const [showFilter, setShowFilter] = useState(false);
    const debouncedSearch = useDebounce(searchInput, 400);

    // Sync with global search
    useEffect(() => {
        setSearchInput(globalSearch);
    }, [globalSearch]);
    useEffect(() => { setPage(1); }, [debouncedSearch, statusFilter]);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete]           = useState<string | null>(null);

    const queryParams = {
        page, limit: LIMIT,
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
        ...(statusFilter    ? { status: statusFilter }    : {}),
    };
    const { data, isLoading, isFetching, isError, refetch } = useGetAllUsersQuery(queryParams, {
        skip: !hasViewPermission,
    });
    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

    const apiUsers   = data?.data?.data ?? [];
    const pagination = data?.data?.pagination;
    const totalPages = pagination?.totalPages ?? 1;
    const total      = pagination?.total ?? 0;

    const handleDelete = (id: string) => { setItemToDelete(id); setIsDeleteModalOpen(true); };
    const confirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            await deleteUser(itemToDelete).unwrap();
            refetch();
            Swal.fire({ icon: "success", title: "Deleted!", text: "User removed.", timer: 1800, showConfirmButton: false });
        } catch {
            Swal.fire({ icon: "error", title: "Failed", text: "Could not delete user." });
        } finally {
            setItemToDelete(null);
            setIsDeleteModalOpen(false);
        }
    };

    const renderPageButtons = () => {
        const pages: (number | "...")[] = [];
        if (totalPages <= 7) { for (let i = 1; i <= totalPages; i++) pages.push(i); }
        else {
            pages.push(1);
            if (page > 3) pages.push("...");
            for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
            if (page < totalPages - 2) pages.push("...");
            pages.push(totalPages);
        }
        return pages;
    };

    if (!hasViewPermission) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h2>
                    <p className="text-slate-500">You do not have permission to view users.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">User List</h2>
                <p className="text-sm text-slate-500 mt-2">
                    Monitor user activity and account status
                    {total > 0 && <span className="ml-2 text-slate-400">— {total} total users</span>}
                </p>
            </div>

            <div className="bg-white px-[26px] py-[34px] rounded-lg">
                <div className="pb-6 flex flex-wrap items-center justify-between gap-4">
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
                        <div className="relative">
                            <button
                                onClick={() => setShowFilter((v) => !v)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${showFilter || statusFilter ? "bg-[#787BEB] text-white" : "bg-slate-900 text-white hover:bg-slate-800"}`}
                            >
                                <Filter size={16} /> Filter
                                {statusFilter && <span className="ml-1 bg-white/20 text-white rounded-full px-1.5 py-0.5 text-xs">1</span>}
                            </button>
                            {showFilter && (
                                <div className="absolute right-0 top-full mt-2 z-20 bg-white border border-slate-200 rounded-xl shadow-lg p-4 w-56">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-semibold text-slate-700">Filter by Status</span>
                                        <button onClick={() => setShowFilter(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
                                    </div>
                                    <div className="space-y-1">
                                        {STATUS_OPTIONS.map((opt) => (
                                            <button key={opt.value} onClick={() => { setStatusFilter(opt.value); setShowFilter(false); }}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${statusFilter === opt.value ? "bg-[#787BEB]/10 text-[#787BEB] font-medium" : "text-slate-600 hover:bg-slate-50"}`}
                                            >{opt.label}</button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="w-full overflow-x-auto rounded-xl border border-slate-200 scrollbar-hide">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-24 gap-3 text-slate-400">
                            <Loader2 size={28} className="animate-spin" /><span className="text-sm">Loading users…</span>
                        </div>
                    ) : isError ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3 text-red-500">
                            <AlertCircle size={36} /><p className="text-sm font-medium">Failed to load users.</p>
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
                                    <th className="px-4 py-3 text-base font-semibold text-slate-600 border-r-2 border-slate-300 text-center">Last Login</th>
                                    {hasManagePermission && canDelete && <th className="px-4 py-3 text-base font-semibold text-slate-600 text-center">Action</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-300">
                                {apiUsers.length === 0 ? (
                                    <tr><td colSpan={7} className="px-4 py-16 text-center text-slate-400 text-sm">No users found.</td></tr>
                                ) : (
                                    apiUsers.map((u: any, index: number) => (
                                        <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-4 py-4 text-sm text-slate-600 border-r-2 border-slate-300">{(page - 1) * LIMIT + index + 1}</td>
                                            <td className="px-4 py-4 border-r-2 border-slate-300">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                                                        <img src={u.avatar || `https://picsum.photos/seed/${u.id}/100/100`} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="text-sm font-medium text-[#0F172A]">{u.firstName} {u.lastName}</div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 border-r-2 border-slate-300">
                                                <div className="text-sm text-[#2C2C2C]">{u.phone}</div>
                                                <div className="text-sm text-[#2C2C2C]">{u.email}</div>
                                            </td>
                                            <td className="px-4 py-4 border-r-2 border-slate-300 text-center"><BookingCountCell userId={u.id} /></td>
                                            <td className="px-4 py-4 border-r-2 border-slate-300 text-center">
                                                <span className={`inline-block px-3 py-1 rounded-md text-sm font-medium ${getStatusStyles(u.status)}`}>{getStatusLabel(u.status)}</span>
                                            </td>
                                            <td className="px-4 py-4 text-sm text-slate-500 border-r-2 border-slate-300 text-center">
                                                {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : <span className="text-slate-300">—</span>}
                                            </td>
                                            {canDelete && hasManagePermission && (
                                                <td className="px-4 py-4 text-center">
                                                    <button onClick={() => handleDelete(u.id)} disabled={isDeleting && itemToDelete === u.id}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                                                    >
                                                        {isDeleting && itemToDelete === u.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="py-6 border-t border-slate-200 flex items-center justify-center md:justify-end gap-1 md:gap-4">
                        <button disabled={page <= 1 || isFetching} onClick={() => setPage((p) => Math.max(1, p - 1))}
                            className="flex items-center gap-1 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                            <ChevronLeft size={16} className="-mt-1" /> Previous
                        </button>
                        <div className="flex items-center gap-1">
                            {renderPageButtons().map((item, i) => item === "..." ? (
                                <span key={`e-${i}`} className="px-2 text-slate-400">...</span>
                            ) : (
                                <button key={item} onClick={() => setPage(item as number)} disabled={isFetching}
                                    className={`w-8 h-8 rounded-lg text-sm flex items-center justify-center font-medium transition-all ${item === page ? "border border-slate-200 text-black" : "text-slate-600 hover:bg-slate-100"}`}
                                >{item}</button>
                            ))}
                        </div>
                        <button disabled={page >= totalPages || isFetching} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            className="flex items-center gap-1 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                            Next <ChevronRight size={16} className="-mt-1" />
                        </button>
                    </div>
                )}
            </div>

            <DeleteModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete}
                title="Delete User" description="Are you sure you want to delete this user? This action cannot be undone." />
        </div>
    );
}
