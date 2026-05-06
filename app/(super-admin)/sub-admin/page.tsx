"use client"

import { useState, useEffect } from "react";
import { Search, Plus, ChevronDown, X, Check, Loader2, ChevronLeft, ChevronRight, Edit, Eye, EyeOff } from "lucide-react";
// import DeleteModal from "@/components/DeleteModal";
import { useCreateAdminMutation, useGetSubAdminsQuery, useUpdateAdminPermissionsMutation, useLazyGetSubAdminByIdQuery } from "@/lib/features/super-admin/admin/adminAPI";
import { useAppSelector } from "@/lib/hooks";
import Swal from "sweetalert2";
import { useMemo } from "react";
import { z } from "zod";

/* ─── Debounce hook ──────────────────────────────────────────────────── */
function useDebounce<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState<T>(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debounced;
}
interface SubAdmin {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    status: "ACTIVE" | "INACTIVE";
}



const ROLES = ["Booking Manager", "Provider Manager", "User Manager", "Service Manager", "Business Manager", "Marketing Manager"];

const PERMISSIONS_DATA = {
    "Booking Manager": [
        { id: "view_bookings", label: "View Bookings", description: "View booking records" },
        { id: "manage_bookings", label: "Manage Bookings", description: "Create and edit bookings (No deletion)" },
        { id: "export_bookings", label: "Export Bookings", description: "Export booking data to CSV" },
    ],
    "Provider Manager": [
        { id: "view_providers", label: "View Providers", description: "View provider information" },
        { id: "manage_providers", label: "Manage Providers", description: "Approve/Reject provider applications" },
    ],
    "User Manager": [
        { id: "view_users", label: "View Users", description: "View user information" },
        { id: "manage_users", label: "Manage Users", description: "Create and edit users (No deletion)" },
    ],
    "Service Manager": [
        { id: "view_categories", label: "View Categories", description: "View service categories" },
        { id: "manage_categories", label: "Manage Categories", description: "Add and edit service categories (No deletion)" },
        { id: "view_jobs", label: "View Jobs", description: "Monitor all service listings" },
        { id: "manage_jobs", label: "Manage Jobs", description: "Feature popular jobs in your region" },
    ],
    "Business Manager": [
        { id: "view_transactions", label: "View Transactions", description: "Access transaction records" },
        { id: "view_withdrawals", label: "View Withdrawals", description: "View withdrawal requests" },
        { id: "manage_withdrawals", label: "Manage Withdrawals", description: "Approve/Reject withdrawal requests" },
    ],
    "Marketing Manager": [
        { id: "isViewManageMarketing", label: "View Marketing", description: "Access marketing tools and banners" },
        { id: "isManageMarketing", label: "Manage Marketing", description: "Add and edit marketing banners (No deletion)" },
    ],
};

const adminSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    password: z.string().min(8, "Password must be at least 8 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

const editAdminSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
});

export default function SubAdminManagementPage() {
    const [page, setPage] = useState(1);
    const globalSearch = useAppSelector((state) => state.search.query);
    const [searchInput, setSearchInput] = useState(globalSearch || "");
    const [status, setStatus] = useState("All");
    const [showPassword, setShowPassword] = useState(false);

    // Sync with global search
    useEffect(() => {
        setSearchInput(globalSearch);
    }, [globalSearch]);

    const { data: subAdminsData, isLoading, isError, refetch, isFetching } = useGetSubAdminsQuery({
        page: 1,
        limit: 100,
        status: status === "All" ? "" : status.toUpperCase()
    });
    console.log(subAdminsData);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"basic" | "permission">("basic");
    // const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [adminToDelete, setAdminToDelete] = useState<string | null>(null);
    const [selectedRole, setSelectedRole] = useState("Booking Manager");

    const [isEditMode, setIsEditMode] = useState(false);
    const [editAdminId, setEditAdminId] = useState<string | null>(null);

    const rawSubAdmins = subAdminsData?.data?.data || [];
    
    /* ── Client-side Filter ── */
    const filteredSubAdmins = useMemo(() => {
        return rawSubAdmins.filter((admin: any) => {
            const s = searchInput.toLowerCase();
            const fullName = `${admin.firstName || ""} ${admin.lastName || ""}`.toLowerCase();
            const matchesSearch = 
                fullName.includes(s) ||
                (admin.email || "").toLowerCase().includes(s) ||
                (admin.role || "").toLowerCase().includes(s.replace(' ', '_'));
            
            return matchesSearch;
        });
    }, [rawSubAdmins, searchInput]);

    const displayedSubAdmins = filteredSubAdmins.slice((page - 1) * 10, page * 10);
    const totalFiltered = filteredSubAdmins.length;
    const effectiveTotalPages = Math.ceil(totalFiltered / 10);

    const [createAdmin, { isLoading: isCreating }] = useCreateAdminMutation();
    const [updateAdminPermissions, { isLoading: isUpdating }] = useUpdateAdminPermissionsMutation();
    const [getSubAdminById, { isFetching: isFetchingAdminDetails }] = useLazyGetSubAdminByIdQuery();
    console.log(getSubAdminById);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        permissions: [] as string[]
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const countPermissions = (admin: any) => {
        let count = 0;
        if (admin.isViewBooking) count++;
        if (admin.isManageBooking) count++;
        if (admin.isExportBooking) count++;
        if (admin.isViewProvider) count++;
        if (admin.isManageProvider) count++;
        if (admin.isViewUser) count++;
        if (admin.isManageUser) count++;
        if (admin.isViewCategory) count++;
        if (admin.isManageCategory) count++;
        if (admin.isJobView) count++;
        if (admin.isJobManage) count++;
        if (admin.isViewTransaction) count++;
        if (admin.isViewWithdrawal) count++;
        if (admin.isManageWithdrawal) count++;
        if (admin.isViewManageMarketing) count++;
        if (admin.isManageMarketing) count++;
        return count;
    };

    const handleEditAdmin = async (admin: any) => {
        setIsEditMode(true);
        setEditAdminId(admin.id);
        setIsModalOpen(true);
        setActiveTab("permission");
        setSelectedRole(admin.role || "");

        // Pre-fill with list data while fetching details
        setFormData({
            firstName: admin.firstName || "",
            lastName: admin.lastName || "",
            email: admin.email || "",
            phone: admin.phone || "",
            password: "",
            permissions: []
        });

        try {
            const response = await getSubAdminById(admin.id).unwrap();
            console.log(response);
            const detailedAdmin = response?.data?.user || response?.data || response;
            console.log(detailedAdmin);
            
            const perms: string[] = [];
            const permissionsObj = detailedAdmin.adminPermissions || detailedAdmin;

            if (permissionsObj.isViewBooking) perms.push("view_bookings");
            if (permissionsObj.isManageBooking) perms.push("manage_bookings");
            if (permissionsObj.isViewProvider) perms.push("view_providers");
            if (permissionsObj.isManageProvider) perms.push("manage_providers");
            if (permissionsObj.isViewUser) perms.push("view_users");
            if (permissionsObj.isManageUser) perms.push("manage_users");
            if (permissionsObj.isViewCategory) perms.push("view_categories");
            if (permissionsObj.isManageCategory) perms.push("manage_categories");
            if (permissionsObj.isJobView) perms.push("view_jobs");
            if (permissionsObj.isJobManage) perms.push("manage_jobs");
            if (permissionsObj.isViewTransaction) perms.push("view_transactions");
            if (permissionsObj.isViewWithdrawal) perms.push("view_withdrawals");
            if (permissionsObj.isManageWithdrawal) perms.push("manage_withdrawals");
            if (permissionsObj.isViewManageMarketing) perms.push("isViewManageMarketing");
            if (permissionsObj.isManageMarketing) perms.push("isManageMarketing");
            if (permissionsObj.isExportBooking) perms.push("export_bookings");

            setFormData(prev => ({
                ...prev,
                firstName: detailedAdmin.firstName || prev.firstName,
                lastName: detailedAdmin.lastName || prev.lastName,
                email: detailedAdmin.email || prev.email,
                phone: detailedAdmin.phone || prev.phone,
                permissions: perms
            }));
            if (detailedAdmin.role) {
                setSelectedRole(detailedAdmin.role);
            }
        } catch (error) {
            console.error("Failed to fetch detailed sub-admin info", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to load sub-admin details.",
            });
            setIsModalOpen(false);
        }
    };

    const togglePermission = (permissionId: string) => {
        setFormData(prev => {
            const permissions = prev.permissions.includes(permissionId)
                ? prev.permissions.filter(p => p !== permissionId)
                : [...prev.permissions, permissionId];
            return { ...prev, permissions };
        });
    };

    const handleSaveAdmin = async () => {
        setErrors({});
        
        const schema = isEditMode ? editAdminSchema : adminSchema;
        const validation = schema.safeParse({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            password: formData.password
        });

        if (!validation.success) {
            const newErrors: Record<string, string> = {};
            validation.error.issues.forEach((err) => {
                if (err.path[0]) {
                    newErrors[err.path[0] as string] = err.message;
                }
            });
            setErrors(newErrors);
            
            // Show first error in toast if needed, or just let the UI handle it
            if (newErrors.password) {
                 Swal.fire({
                    icon: "error",
                    title: "Validation Error",
                    text: newErrors.password,
                });
            }
            return;
        }

        const permissionsPayload = {
            isViewBooking: formData.permissions.includes("view_bookings"),
            isManageBooking: formData.permissions.includes("manage_bookings"),
            isExportBooking: formData.permissions.includes("export_bookings"),
            isViewProvider: formData.permissions.includes("view_providers"),
            isManageProvider: formData.permissions.includes("manage_providers"),
            isViewUser: formData.permissions.includes("view_users"),
            isManageUser: formData.permissions.includes("manage_users"),
            isViewCategory: formData.permissions.includes("view_categories"),
            isManageCategory: formData.permissions.includes("manage_categories"),
            isJobView: formData.permissions.includes("view_jobs"),
            isJobManage: formData.permissions.includes("manage_jobs"),
            isViewTransaction: formData.permissions.includes("view_transactions"),
            isViewWithdrawal: formData.permissions.includes("view_withdrawals"),
            isManageWithdrawal: formData.permissions.includes("manage_withdrawals"),
            isViewManageMarketing: formData.permissions.includes("isViewManageMarketing"),
            isManageMarketing: formData.permissions.includes("isManageMarketing"),
        };

        if (isEditMode) {
            if (!editAdminId) return;
            try {
                // Ensure all flags are sent by spreading explicitly
                await updateAdminPermissions({
                    userId: editAdminId,
                    ...permissionsPayload
                }).unwrap();
                Swal.fire({
                    icon: "success",
                    title: "Permissions Updated",
                    text: "Sub-admin permissions have been successfully updated.",
                    timer: 2000,
                    showConfirmButton: false
                });
                setIsModalOpen(false);
                setIsEditMode(false);
                setEditAdminId(null);
                setFormData({ firstName: "", lastName: "", email: "", phone: "", password: "", permissions: [] });
                setErrors({});
            } catch (err: any) {
                Swal.fire({
                    icon: "error",
                    title: "Update Failed",
                    text: err?.data?.message || "Something went wrong while updating permissions.",
                });
            }
        } else {
            const payload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                ...permissionsPayload
            };

            try {
                await createAdmin(payload).unwrap();

                Swal.fire({
                    icon: "success",
                    title: "Sub-Admin Created",
                    text: "The new sub-admin has been successfully added.",
                    timer: 2000,
                    showConfirmButton: false
                });

                setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    phone: "",
                    password: "",
                    permissions: []
                });
                setErrors({});
                setIsModalOpen(false);
                setActiveTab("basic");
                refetch();
            } catch (err: any) {
                Swal.fire({
                    icon: "error",
                    title: "Creation Failed",
                    text: err?.data?.message || "Something went wrong while creating the sub-admin.",
                });
            }
        }
    };

    // const handleDeleteAdmin = (id: string) => {
    //     setAdminToDelete(id);
    //     setIsDeleteModalOpen(true);
    // };

    // const confirmDelete = () => {
    //     if (adminToDelete) {
    //         // No delete API provided yet based on prompt, keeping UI feedback
    //         Swal.fire("Note", "Delete API not yet implemented", "info");
    //         setAdminToDelete(null);
    //     }
    //     setIsDeleteModalOpen(false);
    // };

    return (
        <div className="space-y-6 bg-white rounded-lg overflow-hidden px-[26px] py-[34px] min-h-[calc(100vh-140px)]">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Sub Admin Management</h2>
                    <p className="text-sm text-slate-500 mt-1">Manage sub admin users, roles and access permissions across all sections</p>
                </div>
                <button
                    onClick={() => {
                        setIsEditMode(false);
                        setEditAdminId(null);
                        setFormData({ firstName: "", lastName: "", email: "", phone: "", password: "", permissions: [] });
                        setErrors({});
                        setActiveTab("basic");
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#6366F1] text-white rounded-lg text-sm font-medium hover:bg-[#6366F1]/90 transition-colors shadow-sm"
                >
                    <Plus size={18} />
                    Create new Sub Admin
                </button>
            </div>

            {/* Main Content */}
            <div className="mt-8">
                {/* Search Bar */}
                <div className="pb-6 flex flex-wrap items-center gap-4">
                    <div className="hidden sm:flex items-center flex-1 relative group">
                        <input
                            type="text"
                            placeholder="Search sub admin by name or email..."
                            className="w-full pl-15 px-4 py-1.5 h-[45px] bg-white border border-blue-300 rounded-[50px] text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] transition-all placeholder:text-slate-400"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                        <div className="absolute left-1.5 w-9 h-9 flex items-center justify-center bg-[#787BEB] text-white rounded-full">
                            <Search size={18} />
                        </div>
                    </div>
                    <div className="relative min-w-[240px]">
                        <select
                            className="w-full appearance-none px-4 py-2.5 pr-10 text-black border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent bg-white text-sm"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="All">All</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">User</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Role</th>
                                {/* <th className="px-6 py-4 text-sm font-semibold text-slate-600">Permissions</th> */}
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-center">Status</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                            <p className="text-sm text-slate-500 font-medium">Loading sub admins...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : displayedSubAdmins.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center text-slate-500 italic">
                                        No sub admins found.
                                    </td>
                                </tr>
                            ) : (
                                displayedSubAdmins.map((admin: any) => (
                                    <tr key={admin.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-medium text-lg uppercase">
                                                    {admin.firstName.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-slate-900">{admin.firstName} {admin.lastName}</div>
                                                    <div className="text-sm text-slate-500">{admin.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#EEF2FF] text-[#6366F1]">
                                                {admin.role.replace('_', ' ')}
                                            </span>
                                        </td>
                                        {/* <td className="px-6 py-4 text-sm text-slate-600">
                                            {countPermissions(admin) > 0 ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700">
                                                    {countPermissions(admin)} Permissions
                                                </span>
                                            ) : (
                                                "No Permissions assigned"
                                            )}
                                        </td> */}
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${admin.status === 'ACTIVE' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                                }`}>
                                                {admin.status.toLowerCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleEditAdmin(admin)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <Edit size={18} />
                                                </button>
                                                {/* <button
                                                    onClick={() => handleDeleteAdmin(admin.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 size={18} />
                                                </button> */}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {effectiveTotalPages > 1 && (
                    <div className="mt-6 flex items-center justify-end gap-3">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-50"
                        >
                            <ChevronLeft size={16} />
                            Previous
                        </button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: effectiveTotalPages }, (_, i) => i + 1).map((pageNum) => (
                                <button
                                    key={pageNum}
                                    onClick={() => setPage(pageNum)}
                                    className={`w-8 h-8 rounded text-sm flex items-center justify-center font-medium transition-all ${pageNum === page
                                        ? 'bg-slate-100 text-slate-900 border border-slate-300 shadow-sm'
                                        : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            ))}
                        </div>
                        <button
                            disabled={page === effectiveTotalPages}
                            onClick={() => setPage(p => Math.min(effectiveTotalPages, p + 1))}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-50"
                        >
                            Next
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>

            {/* Create New Sub Admin Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 overflow-y-auto">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-[800px] flex flex-col max-h-[85vh]">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-8 py-6">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">{isEditMode ? "Edit Sub Admin Permissions" : "Create New Sub Admin"}</h3>
                                <p className="text-sm text-slate-500 mt-1.5">{isEditMode ? "Modify permissions for the selected sub admin" : "Add a new sub admin and assign roles and permissions"}</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Tabs */}
                        <div className="px-8 w-full">
                            <div className="grid grid-cols-2 gap-4 px-3.5 py-3 bg-blue-50 rounded-[50px] w-full">
                                <button
                                    disabled={isEditMode}
                                    onClick={() => setActiveTab("basic")}
                                    className={`px-3 md:px-6 md:py-3 py-1.5 md:text-base text-xs font-normal rounded-full transition-all
    ${activeTab === "basic"
                                            ? "bg-primary text-white shadow-sm"
                                            : "text-black hover:text-slate-700 hover:bg-slate-100"
                                        } ${isEditMode ? "opacity-50 cursor-not-allowed" : ""}`}
                                >
                                    <div className="flex justify-center items-center gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            className={`transition-colors ${activeTab === "basic" ? "stroke-white" : "stroke-black"
                                                }`}
                                        >
                                            <path
                                                d="M4.23399 12.7463C3.21876 13.3606 0.556894 14.6149 2.17815 16.1843C2.97012 16.951 3.85217 17.4993 4.96112 17.4993L11.289 17.4993C12.398 17.4993 13.28 16.951 14.072 16.1843C15.6933 14.6149 13.0314 13.3606 12.0162 12.7463C9.63548 11.3059 6.61468 11.3059 4.23399 12.7463Z"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M11.2499 5.83333C11.2499 7.67428 9.75753 9.16667 7.91659 9.16667C6.07564 9.16667 4.58325 7.67428 4.58325 5.83333C4.58325 3.99238 6.07564 2.5 7.91659 2.5C9.75753 2.5 11.2499 3.99238 11.2499 5.83333Z"
                                                strokeWidth="1.5"
                                            />
                                            <path d="M14.1667 4.16602L18.3334 4.16602" strokeWidth="1.5" strokeLinecap="round" />
                                            <path d="M14.1667 6.66602L18.3334 6.66602" strokeWidth="1.5" strokeLinecap="round" />
                                            <path d="M16.6667 9.16602L18.3334 9.16602" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>

                                        <span className="pt-0.5">Basic Information</span>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab("permission")}
                                    className={`px-3 md:px-6 md:py-3 py-1.5 md:text-base text-xs font-normal rounded-full transition-all
    ${activeTab === "permission"
                                            ? "bg-[#6366F1] text-white shadow-sm"
                                            : "text-black hover:text-slate-700 hover:bg-slate-100"
                                        }`}
                                >
                                    <div className="flex justify-center items-center gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            className="stroke-current transition-colors"
                                        >
                                            <path
                                                d="M2.08325 10.0007C2.08325 6.2687 2.08325 4.40272 3.24262 3.24335C4.40199 2.08398 6.26797 2.08398 9.99992 2.08398C13.7319 2.08398 15.5978 2.08398 16.7572 3.24335C17.9166 4.40272 17.9166 6.2687 17.9166 10.0007C17.9166 13.7326 17.9166 15.5986 16.7572 16.7579C15.5978 17.9173 13.7319 17.9173 9.99992 17.9173C6.26797 17.9173 4.40199 17.9173 3.24262 16.7579C2.08325 15.5986 2.08325 13.7326 2.08325 10.0007Z"
                                                strokeWidth="1.5"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M7.08325 8.33398C6.3929 8.33398 5.83325 7.77434 5.83325 7.08398C5.83325 6.39363 6.3929 5.83398 7.08325 5.83398C7.77361 5.83398 8.33325 6.39363 8.33325 7.08398C8.33325 7.77434 7.77361 8.33398 7.08325 8.33398Z"
                                                strokeWidth="1.5"
                                            />
                                            <path
                                                d="M12.9167 14.166C13.6071 14.166 14.1667 13.6064 14.1667 12.916C14.1667 12.2257 13.6071 11.666 12.9167 11.666C12.2264 11.666 11.6667 12.2257 11.6667 12.916C11.6667 13.6064 12.2264 14.166 12.9167 14.166Z"
                                                strokeWidth="1.5"
                                            />
                                            <path
                                                d="M8.33341 7.08398L14.1667 7.08398"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                            />
                                            <path
                                                d="M11.6666 12.916L5.83325 12.916"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                            />
                                        </svg>

                                        <span className="pt-0.5">Permission</span>
                                    </div>
                                </button>


                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 overflow-y-auto custom-scrollbar">
                            {activeTab === "basic" ? (
                                <div className="space-y-5">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-slate-700 ">First Name</label>
                                            <input
                                                type="text"
                                                placeholder="Ex. John"
                                                className={`w-full mt-2.5 px-4 py-2.5 bg-[#E8EFFC] border rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] transition-all ${errors.firstName ? 'border-red-500' : 'border-[#E8EFFC]'}`}
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            />
                                            {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-slate-700 ">Last Name</label>
                                            <input
                                                type="text"
                                                placeholder="Ex. Doe"
                                                className={`w-full mt-2.5 px-4 py-2.5 bg-[#E8EFFC] border rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] transition-all ${errors.lastName ? 'border-red-500' : 'border-[#E8EFFC]'}`}
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            />
                                            {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-700">Email Address</label>
                                        <input
                                            type="email"
                                            placeholder="john.doe@email.com"
                                            className={`w-full mt-2.5 px-4 py-2.5 bg-[#E8EFFC] border rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] transition-all ${errors.email ? 'border-red-500' : 'border-[#E8EFFC]'}`}
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-700">Phone Number</label>
                                        <input
                                            type="tel"
                                            placeholder="+1 (555) 000-0000"
                                            className="w-full mt-2.5 px-4 py-2.5 bg-[#E8EFFC] border border-[#E8EFFC] rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] transition-all"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-700">Password</label>
                                        <div className="relative flex items-center">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className={`w-full mt-2.5 px-4 py-2.5 bg-[#E8EFFC] border rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] transition-all ${errors.password ? 'border-red-500' : 'border-[#E8EFFC]'}`}
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-3 top-5.5  text-slate-500 hover:text-slate-700 transition-colors"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                                    </div>
                                    <div className="pt-4 flex items-center gap-3">
                                        <button
                                            disabled={isCreating || isUpdating || isFetchingAdminDetails}
                                            onClick={handleSaveAdmin}
                                            className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/80 transition-colors shadow-sm shadow-blue-100 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2">
                                            {isCreating || isUpdating || isFetchingAdminDetails ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                            {isFetchingAdminDetails ? "Loading..." : (isCreating || isUpdating ? "Saving..." : (isEditMode ? "Save Changes" : "Add Admin"))}
                                        </button>
                                        <button
                                            onClick={() => setIsModalOpen(false)}
                                            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col md:flex-row gap-8 h-full">
                                    {/* Sidebar Roles */}
                                    <div className={`w-1/3 min-w-[200px] border-r border-slate-100 pr-6 space-y-1 ${isFetchingAdminDetails ? 'opacity-50 pointer-events-none' : ''}`}>
                                        {ROLES.map((role) => (
                                            <button
                                                key={role}
                                                onClick={() => setSelectedRole(role)}
                                                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${selectedRole === role
                                                    ? "bg-[#EEF2FF] text-[#6366F1]"
                                                    : "text-slate-600 hover:bg-slate-50"
                                                    }`}
                                            >
                                                {role}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Permissions List */}
                                    <div className={`flex-1 space-y-6 ${isFetchingAdminDetails ? 'opacity-50 pointer-events-none' : ''}`}>
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-semibold text-slate-900">{selectedRole || "Select a role"}</h4>
                                            {selectedRole && PERMISSIONS_DATA[selectedRole as keyof typeof PERMISSIONS_DATA] && (
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="w-4 h-4 rounded border-gray-300 text-[#6366F1] focus:ring-[#6366F1]"
                                                        checked={
                                                            PERMISSIONS_DATA[selectedRole as keyof typeof PERMISSIONS_DATA]?.every(p => formData.permissions.includes(p.id)) || false
                                                        }
                                                        onChange={(e) => {
                                                            const rolePerms = PERMISSIONS_DATA[selectedRole as keyof typeof PERMISSIONS_DATA].map(p => p.id);
                                                            if (e.target.checked) {
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    permissions: Array.from(new Set([...prev.permissions, ...rolePerms]))
                                                                }));
                                                            } else {
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    permissions: prev.permissions.filter(p => !rolePerms.includes(p))
                                                                }));
                                                            }
                                                        }}
                                                    />
                                                    <span className="text-sm text-slate-600 mt-[2px]">Select All</span>
                                                </label>
                                            )}
                                        </div>

                                        {PERMISSIONS_DATA[selectedRole as keyof typeof PERMISSIONS_DATA] ? (
                                            <div className="space-y-4">
                                                {PERMISSIONS_DATA[selectedRole as keyof typeof PERMISSIONS_DATA].map((perm) => (
                                                    <div key={perm.id} className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors group">
                                                        <div className="pt-0.5">
                                                            <div
                                                                onClick={() => togglePermission(perm.id)}
                                                                className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-colors ${formData.permissions.includes(perm.id)
                                                                    ? "bg-[#6366F1] border-[#6366F1]"
                                                                    : "border-slate-300 bg-white group-hover:border-[#6366F1]"
                                                                    }`}
                                                            >
                                                                {formData.permissions.includes(perm.id) && <Check size={14} className="text-white" />}
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 cursor-pointer" onClick={() => togglePermission(perm.id)}>
                                                            <div className="text-sm font-medium text-slate-900 mb-0.5">{perm.label}</div>
                                                            <div className="text-xs text-slate-500">{perm.description}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-12 text-slate-400 text-sm">
                                                Select a role to view permissions
                                            </div>
                                        )}

                                        <div className="pt-8 flex items-center gap-3">
                                            <button
                                                disabled={isCreating || isUpdating || isFetchingAdminDetails}
                                                onClick={handleSaveAdmin}
                                                className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/80 transition-colors shadow-sm shadow-blue-100 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2">
                                                {isCreating || isUpdating || isFetchingAdminDetails ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                                {isFetchingAdminDetails ? "Loading..." : (isCreating || isUpdating ? "Saving..." : (isEditMode ? "Save Changes" : "Add Admin"))}
                                            </button>
                                            <button
                                                onClick={() => setIsModalOpen(false)}
                                                className="px-6 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Sub Admin"
                description="Are you sure you want to delete this sub-admin? This will remove their access to the platform."
            /> */}
        </div >
    );
}

