"use client";

import { useState } from "react";
import { Search, Plus, Trash2, ChevronDown, X, Check } from "lucide-react";
import DeleteModal from "@/components/DeleteModal";

interface SubAdmin {
    id: number;
    name: string;
    email: string;
    role: string;
    permissions: number;
    status: "Active" | "Inactive";
}

const SUB_ADMINS: SubAdmin[] = [
    { id: 1, name: "John Smith", email: "john.smith@example.com", role: "Booking Manager", permissions: 5, status: "Active" },
    { id: 2, name: "Sarah Johnson", email: "sarah.johnson@example.com", role: "User Manager", permissions: 6, status: "Active" },
    { id: 3, name: "Michael Brown", email: "michael.brown@example.com", role: "Business Manager", permissions: 7, status: "Active" },
];

const ROLES = ["Booking Manager", "Provider Manager", "User Manager", "Service Manager", "Business Manager"];

const PERMISSIONS_DATA = {
    "Booking Manager": [
        { id: "view_bookings", label: "View Bookings", description: "View booking records" },
        { id: "manage_bookings", label: "Manage Bookings", description: "Create, edit, delete bookings" },
        { id: "export_bookings", label: "Export Bookings", description: "Export booking data" },
    ],
    "Provider Manager": [
        { id: "view_providers", label: "View Providers", description: "View provider information" },
        { id: "manage_providers", label: "Manage Providers", description: "Approve/Reject provider applications" },
    ],
    "User Manager": [
        { id: "view_users", label: "View Users", description: "View user information" },
        { id: "manage_users", label: "Manage Users", description: "Create, edit, delete users" },
    ],
    "Service Manager": [
        { id: "view_categories", label: "View Categories", description: "View service categories" },
        { id: "manage_categories", label: "Manage Categories", description: "Add, edit service categories" },
    ],
    "Business Manager": [
        { id: "view_subscription", label: "View Subscription", description: "View subscription plans" },
        { id: "manage_subscription", label: "Manage Subscription", description: "Create, edit subscription plans" },
        { id: "view_transactions", label: "View Transactions", description: "Access transaction records" },
        { id: "export_transactions", label: "Export Transactions", description: "Export transaction reports" },
    ],
};

export default function SubAdminManagementPage() {
    const [subAdmins, setSubAdmins] = useState<SubAdmin[]>(SUB_ADMINS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"basic" | "permission">("basic");
    const [selectedRole, setSelectedRole] = useState<string>("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [adminToDelete, setAdminToDelete] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        role: "",
        permissions: [] as string[]
    });

    const togglePermission = (permissionId: string) => {
        setFormData(prev => {
            const permissions = prev.permissions.includes(permissionId)
                ? prev.permissions.filter(p => p !== permissionId)
                : [...prev.permissions, permissionId];
            return { ...prev, permissions };
        });
    };

    const handleAddAdmin = () => {
        if (!formData.fullName || !formData.email || !formData.role) {
            alert("Please fill in all required fields (Name, Email, Role)");
            return;
        }

        const newAdmin: SubAdmin = {
            id: Math.max(...subAdmins.map(a => a.id), 0) + 1,
            name: formData.fullName,
            email: formData.email,
            role: formData.role,
            permissions: formData.permissions.length,
            status: "Active"
        };

        setSubAdmins([...subAdmins, newAdmin]);
        setFormData({
            fullName: "",
            email: "",
            phone: "",
            password: "",
            role: "",
            permissions: []
        });
        setIsModalOpen(false);
    };

    const handleDeleteAdmin = (id: number) => {
        setAdminToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (adminToDelete) {
            setSubAdmins(subAdmins.filter(a => a.id !== adminToDelete));
            setAdminToDelete(null);
        }
        setIsDeleteModalOpen(false);
    };

    return (
        <div className="space-y-6 bg-white rounded-lg overflow-hidden px-[26px] py-[34px] min-h-[calc(100vh-140px)]">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Sub Admin Management</h2>
                    <p className="text-sm text-slate-500 mt-1">Manage sub admin users, roles and access permissions across all sections</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
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
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search sub admin by name or email..."
                            className="w-full pl-10 pr-4 py-2.5 text-sm text-black border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent placeholder:text-[#94A3B8]"
                        />
                    </div>
                    <div className="relative min-w-[240px]">
                        <select className="w-full appearance-none px-4 py-2.5 pr-10 text-black border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent bg-white text-sm">
                            <option>Active</option>
                            <option>Inactive</option>
                            <option>All</option>
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
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Permissions</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-center">Status</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {subAdmins.map((admin) => (
                                <tr key={admin.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-medium text-lg">
                                                {admin.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-slate-900">{admin.name}</div>
                                                <div className="text-sm text-slate-500">{admin.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#EEF2FF] text-[#6366F1]">
                                            {admin.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{admin.permissions} permissions assigned</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${admin.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                            }`}>
                                            {admin.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleDeleteAdmin(admin.id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create New Sub Admin Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 overflow-y-auto">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-[800px] flex flex-col max-h-[85vh]">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-8 py-6">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Create New Sub Admin</h3>
                                <p className="text-sm text-slate-500 mt-1.5">Add a new sub admin and assign roles and permissions</p>
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
                                    onClick={() => setActiveTab("basic")}
                                    className={`px-6 py-3 text-base font-normal rounded-full transition-all
    ${activeTab === "basic"
                                            ? "bg-primary text-white shadow-sm"
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
                                    className={`px-6 py-2 text-base font-normal rounded-full transition-all
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
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-700 ">Full Name</label>
                                        <input
                                            type="text"
                                            placeholder="Ex. John Doe"
                                            className="w-full mt-2.5 px-4 py-2.5 bg-[#E8EFFC] border border-[#E8EFFC] rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] transition-all"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-700">Email Address</label>
                                        <input
                                            type="email"
                                            placeholder="john.doe@email.com"
                                            className="w-full mt-2.5 px-4 py-2.5 bg-[#E8EFFC] border border-[#E8EFFC] rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] transition-all"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
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
                                        <input
                                            type="password"
                                            className="w-full mt-2.5 px-4 py-2.5 bg-[#E8EFFC] border border-[#E8EFFC] rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] transition-all"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />
                                    </div>
                                    <div className="">
                                        <label className="text-sm font-medium text-slate-700">Role</label>
                                        <div className="relative">
                                            <select
                                                className="w-full appearance-none  mt-2.5 px-4 py-2.5 bg-[#E8EFFC] border border-[#E8EFFC] rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] transition-all text-slate-600"
                                                value={formData.role}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, role: e.target.value });
                                                    setSelectedRole(e.target.value);
                                                }}
                                            >
                                                <option value="">Select role</option>
                                                {ROLES.map(role => (
                                                    <option key={role} value={role}>{role}</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div className="pt-4 flex items-center gap-3">
                                        <button
                                            onClick={handleAddAdmin}
                                            className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/80 transition-colors shadow-sm shadow-blue-100">
                                            Add Admin
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
                                <div className="flex gap-8 h-full">
                                    {/* Sidebar Roles */}
                                    <div className="w-1/3 min-w-[200px] border-r border-slate-100 pr-6 space-y-1">
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
                                    <div className="flex-1 space-y-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-semibold text-slate-900">{selectedRole || "Select a role"}</h4>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#6366F1] focus:ring-[#6366F1]" />
                                                <span className="text-sm text-slate-600 mt-[2px]">Select All</span>
                                            </label>
                                        </div>

                                        {selectedRole && PERMISSIONS_DATA[selectedRole as keyof typeof PERMISSIONS_DATA] ? (
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
                                                onClick={handleAddAdmin}
                                                className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/80 transition-colors shadow-sm shadow-blue-100">
                                                Add Admin
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

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Sub Admin"
                description="Are you sure you want to delete this sub-admin? This will remove their access to the platform."
            />
        </div >
    );
}

