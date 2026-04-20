"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { ImgIcon } from "@/app/assets/DocumentsIcon";
import {
    Phone, Mail, MapPin, ArrowLeft, Loader2,
    ShieldCheck, ShieldAlert, Clock, X,
    Image as ImageIcon, User, Briefcase, CreditCard,
    Calendar, Globe, Activity, Star,
} from "lucide-react";
import {
    useGetAllProvidersQuery,
    useVerifyProviderMutation,
    useRejectProviderMutation,
} from "@/lib/features/super-admin/provider/providerAPI";
import { useAppSelector } from "@/lib/hooks";

/* ─── Verification badge ─────────────────────────────────────────────── */
function VerificationBadge({ status }: { status: string }) {
    const map: Record<string, { cls: string; label: string; icon: React.ReactNode }> = {
        VERIFIED:   { cls: "bg-emerald-50 text-emerald-700 border border-emerald-200", label: "Verified",   icon: <ShieldCheck size={13} /> },
        PENDING:    { cls: "bg-amber-50  text-amber-700  border border-amber-200",     label: "Pending",    icon: <Clock size={13} /> },
        UNVERIFIED: { cls: "bg-red-50    text-red-600    border border-red-200",       label: "Unverified", icon: <ShieldAlert size={13} /> },
        REJECTED:   { cls: "bg-red-100   text-red-700    border border-red-300",       label: "Rejected",   icon: <ShieldAlert size={13} /> },
    };
    const config = map[status] ?? map["UNVERIFIED"];
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${config.cls}`}>
            {config.icon} {config.label}
        </span>
    );
}

/* ─── Info row helper ────────────────────────────────────────────────── */
function InfoRow({ label, value }: { label: string; value?: string | null }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</span>
            <span className="text-sm font-medium text-slate-800">{value || <span className="text-slate-400 italic">N/A</span>}</span>
        </div>
    );
}

/* ─── Section card ───────────────────────────────────────────────────── */
function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
    return (
        <div className="bg-[#EFF6FF] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-[#6366F1]">{icon}</span>
                <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {children}
            </div>
        </div>
    );
}

/* ─── Page ───────────────────────────────────────────────────────────── */
export default function BackgroundCheckDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    /* Auth — determine role */
    const currentUser = useAppSelector((state) => state.auth.user);
    const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";

    const [verifyProvider, { isLoading: isVerifying }] = useVerifyProviderMutation();
    const [rejectProvider, { isLoading: isRejecting }] = useRejectProviderMutation();
    const [localStatus, setLocalStatus] = useState<string | null>(null);
    const [previewDoc, setPreviewDoc] = useState<{ url: string; label: string } | null>(null);

    /* Fetch */
    const { data, isLoading, isError } = useGetAllProvidersQuery({ page: 1, limit: 100 });
    const provider = data?.data?.data?.find((p) => p.id === id);

    const rawStatus = localStatus ?? provider?.verificationStatus ?? "UNVERIFIED";
    const isAlreadyActioned = rawStatus === "VERIFIED" || rawStatus === "REJECTED";

    const handleApprove = async () => {
        try { await verifyProvider(id).unwrap(); } catch { /* optimistic */ }
        setLocalStatus("VERIFIED");
    };
    const handleReject = async () => {
        try { await rejectProvider(id).unwrap(); } catch { /* optimistic */ }
        setLocalStatus("REJECTED");
    };

    /* Derived display values */
    const name      = provider ? `${provider.firstName} ${provider.lastName}` : "—";
    const location  = [provider?.city, provider?.state, provider?.country].filter(Boolean).join(", ") || "—";
    const nidImage  = provider?.nidImage ?? null;
    const avatar    = provider?.avatar ?? null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => router.back()}
                    className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Background Check</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Check the identification for authentic providers</p>
                </div>
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="flex items-center justify-center py-24 gap-3 text-slate-400">
                    <Loader2 size={28} className="animate-spin" />
                    <span className="text-sm">Loading provider details…</span>
                </div>
            )}

            {/* Error */}
            {isError && !provider && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-6 py-4 text-sm text-red-600">
                    Failed to load provider details.
                </div>
            )}

            {!isLoading && (
                <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                    <div className="px-8 py-10 space-y-6">

                        {/* ── Profile header ── */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-slate-100">
                            <div className="w-20 h-20 rounded-full bg-slate-200 overflow-hidden flex-shrink-0 ring-4 ring-slate-100">
                                {avatar ? (
                                    <img src={avatar} alt={name} className="w-full h-full object-cover" />
                                ) : (
                                    <img src={`https://picsum.photos/seed/${id}/200/200`} alt={name} className="w-full h-full object-cover" />
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                    <h3 className="text-xl font-bold text-slate-900">{name}</h3>
                                    <VerificationBadge status={rawStatus} />
                                </div>
                                <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                                    <span className="flex items-center gap-1.5"><Phone size={14} className="text-[#6366F1]" />{provider?.phone ?? "—"}</span>
                                    <span className="flex items-center gap-1.5"><Mail size={14} className="text-[#6366F1]" />{provider?.email ?? "—"}</span>
                                    <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[#6366F1]" />{location}</span>
                                </div>
                            </div>
                        </div>

                        {/* ══ SUPER ADMIN: full data ══════════════════════════════ */}
                        {isSuperAdmin && provider && (
                            <div className="space-y-5">

                                {/* Personal Info */}
                                <Section icon={<User size={16} />} title="Personal Information">
                                    <InfoRow label="First Name"   value={provider.firstName} />
                                    <InfoRow label="Last Name"    value={provider.lastName} />
                                    <InfoRow label="Email"        value={provider.email} />
                                    <InfoRow label="Phone"        value={provider.phone} />
                                    <InfoRow label="City"         value={provider.city} />
                                    <InfoRow label="State"        value={provider.state} />
                                    <InfoRow label="Zip Code"     value={provider.zipCode} />
                                    <InfoRow label="Country"      value={provider.country} />
                                    <div className="sm:col-span-2">
                                        <InfoRow label="Bio" value={provider.bio} />
                                    </div>
                                </Section>

                                {/* Service Info */}
                                <Section icon={<Briefcase size={16} />} title="Service Information">
                                    <InfoRow label="Service Location" value={provider.streetAddress} />
                                    <InfoRow label="Years of Experience" value={provider.yearsOfExprience} />
                                    <InfoRow label="Total Jobs"   value={String(provider.totalJobs)} />
                                    <InfoRow label="Total Reviews" value={String(provider.totalReviews)} />
                                    <InfoRow label="Average Rating" value={provider.averageRating.toFixed(1)} />
                                    <InfoRow label="Service Availability" value={provider.providerServiceAvailability ? "Available" : "Unavailable"} />
                                </Section>

                                {/* Account & Security */}
                                <Section icon={<Activity size={16} />} title="Account & Security">
                                    <InfoRow label="Role"                value={provider.role} />
                                    <InfoRow label="Status"              value={provider.status} />
                                    <InfoRow label="Verification Status" value={provider.verificationStatus} />
                                    <InfoRow label="Email Verified"      value={provider.emailVerified ? "Yes" : "No"} />
                                    <InfoRow label="Phone Verified"      value={provider.phoneVerified ? "Yes" : "No"} />
                                    <InfoRow label="2FA Enabled"         value={provider.twoFactorEnabled ? "Yes" : "No"} />
                                    <InfoRow label="Login Attempts"      value={String(provider.loginAttempts)} />
                                    <InfoRow label="Language"            value={provider.language} />
                                    <InfoRow label="Timezone"            value={provider.timezone} />
                                    <InfoRow label="Last Login"          value={provider.lastLogin ? new Date(provider.lastLogin).toLocaleString() : undefined} />
                                    <InfoRow label="Last Active"         value={provider.lastActive ? new Date(provider.lastActive).toLocaleString() : undefined} />
                                    <InfoRow label="Created At"          value={new Date(provider.createdAt).toLocaleString()} />
                                </Section>

                                {/* Identity */}
                                <Section icon={<CreditCard size={16} />} title="Identity Verification">
                                    <InfoRow label="NID Number" value={provider.nidNumber} />
                                    <InfoRow label="Recommendation" value={provider.isProviderRecomendation ? "Yes" : "No"} />
                                </Section>

                                {/* Documents */}
                                <div className="bg-[#EFF6FF] rounded-xl p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <ImageIcon size={16} className="text-[#6366F1]" />
                                        <h4 className="text-sm font-semibold text-slate-800">Provided Documents</h4>
                                    </div>
                                    {nidImage ? (
                                        <button
                                            onClick={() => setPreviewDoc({ url: nidImage, label: "NID Image" })}
                                            className="flex items-center gap-3 py-3 px-3 hover:bg-white rounded-lg transition-colors group w-full sm:w-auto"
                                        >
                                            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                                                <ImgIcon />
                                            </div>
                                            <span className="text-sm font-medium text-slate-600 group-hover:text-[#6366F1] transition-colors">NID Image</span>
                                            <span className="ml-auto text-xs text-slate-400 group-hover:text-[#6366F1] transition-colors">Preview ›</span>
                                        </button>
                                    ) : (
                                        <div className="flex items-center gap-3 py-3 px-3 text-slate-400">
                                            <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center text-lg font-semibold">—</div>
                                            <span className="text-sm">No NID image available</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ══ SUB ADMIN: limited data ════════════════════════════ */}
                        {!isSuperAdmin && provider && (
                            <div className="space-y-5">
                                <Section icon={<User size={16} />} title="Contact Information">
                                    <InfoRow label="Full Name" value={name} />
                                    <InfoRow label="Email"     value={provider.email} />
                                    <InfoRow label="Phone"     value={provider.phone} />
                                    <InfoRow label="Location"  value={location} />
                                </Section>

                                <Section icon={<Briefcase size={16} />} title="Service Summary">
                                    <InfoRow label="Years of Experience"  value={provider.yearsOfExprience} />
                                    <InfoRow label="Total Jobs"           value={String(provider.totalJobs)} />
                                    <InfoRow label="Average Rating"       value={provider.averageRating.toFixed(1)} />
                                    <InfoRow label="Service Availability" value={provider.providerServiceAvailability ? "Available" : "Unavailable"} />
                                </Section>

                                <Section icon={<Activity size={16} />} title="Verification">
                                    <InfoRow label="Status"              value={provider.status} />
                                    <InfoRow label="Verification Status" value={provider.verificationStatus} />
                                </Section>

                                {/* Documents — NID image preview only */}
                                <div className="bg-[#EFF6FF] rounded-xl p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <ImageIcon size={16} className="text-[#6366F1]" />
                                        <h4 className="text-sm font-semibold text-slate-800">Provided Documents</h4>
                                    </div>
                                    {nidImage ? (
                                        <button
                                            onClick={() => setPreviewDoc({ url: nidImage, label: "NID Image" })}
                                            className="flex items-center gap-3 py-3 px-3 hover:bg-white rounded-lg transition-colors group w-full sm:w-auto"
                                        >
                                            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                                                <ImgIcon />
                                            </div>
                                            <span className="text-sm font-medium text-slate-600 group-hover:text-[#6366F1] transition-colors">NID Image</span>
                                            <span className="ml-auto text-xs text-slate-400 group-hover:text-[#6366F1] transition-colors">Preview ›</span>
                                        </button>
                                    ) : (
                                        <div className="flex items-center gap-3 py-3 px-3 text-slate-400">
                                            <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center text-lg font-semibold">—</div>
                                            <span className="text-sm">No NID image available</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* No provider found */}
                        {!provider && !isLoading && (
                            <div className="py-16 text-center text-slate-400 text-sm">Provider not found.</div>
                        )}
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            {!isLoading && provider && (
                <div className="flex items-center gap-4 py-4">
                    {isAlreadyActioned ? (
                        <div className={`px-6 py-2.5 rounded-lg text-sm font-medium ${rawStatus === "VERIFIED"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-red-50 text-red-600 border border-red-200"
                        }`}>
                            Provider has been <strong>{rawStatus === "VERIFIED" ? "Approved" : "Rejected"}</strong>
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={handleApprove}
                                disabled={isVerifying || isRejecting}
                                className="flex items-center gap-2 px-16 py-2.5 bg-[#6366F1] text-white rounded-lg text-sm font-medium hover:bg-[#6366F1]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isVerifying ? <Loader2 size={15} className="animate-spin" /> : null}
                                Approve
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={isVerifying || isRejecting}
                                className="flex items-center gap-2 px-16 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isRejecting ? <Loader2 size={15} className="animate-spin" /> : null}
                                Reject
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* NID Image Preview Modal */}
            {previewDoc && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setPreviewDoc(null)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <ImageIcon size={18} className="text-green-500" />
                                <span className="text-sm font-semibold text-slate-800">{previewDoc.label}</span>
                            </div>
                            <button
                                onClick={() => setPreviewDoc(null)}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        {/* Body */}
                        <div className="flex items-center justify-center bg-slate-50" style={{ minHeight: 420 }}>
                            <img
                                src={previewDoc.url}
                                alt={previewDoc.label}
                                className="max-w-full max-h-[60vh] object-contain rounded"
                            />
                        </div>
                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
                            <button
                                onClick={() => setPreviewDoc(null)}
                                className="px-5 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
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
