"use client";

import { useEffect, useState, useMemo } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Star,
    StarOff,
    Calendar,
    Search,
    Filter,
    Image as ImageIcon,
    Image,
    Plus,
} from "lucide-react";
import { useGetAllJobsQuery, useMakePopularJobMutation } from "@/lib/features/super-admin/job/jobAPI";
import Swal from "sweetalert2";
import { useAppSelector } from "@/lib/hooks";
// import CreateJobModal from "@/components/CreateJobModal";

const StatsCard = ({ title, value, subtext, isLoading }: any) => (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex-1">
        {isLoading ? (
            <div className="h-9 w-16 bg-slate-100 animate-pulse rounded mb-7"></div>
        ) : (
            <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
        )}
        <p className="text-sm text-slate-500 mt-7">{title}</p>
        {subtext && <p className="text-xs text-slate-400 mt-2">{subtext}</p>}
    </div>
);

function useDebounce(value: string, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

export default function JobListPage() {
    const { user } = useAppSelector((state) => state.auth);
    const globalSearch = useAppSelector((state) => state.search.query);
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState(globalSearch || "");
    const [isPopularFilter, setIsPopularFilter] = useState<boolean | undefined>(undefined);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const debouncedSearch = useDebounce(searchQuery, 500);

    // Sync local search with global search
    useEffect(() => {
        setSearchQuery(globalSearch);
    }, [globalSearch]);

    const hasViewPermission = user?.role === "SUPER_ADMIN";

    // Fetch jobs from API (fetch 100 for frontend pagination & filtering)
    const { data: response, isLoading, isFetching } = useGetAllJobsQuery({ 
        page: 1, 
        limit: 100 
    }, { skip: !hasViewPermission });

    // Reset page to 1 when search or filter changes
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, isPopularFilter]);

    const [makePopular] = useMakePopularJobMutation();

    const jobs = response?.data?.data?.data || [];
    const meta = response?.data?.data?.meta;

    // FRONTEND FILTERING LOGIC
    const filteredJobs = useMemo(() => {
        return jobs.filter(job => {
            const matchesSearch = 
                job.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
                job.id?.toLowerCase().includes(debouncedSearch.toLowerCase());
            
            const matchesPopular = isPopularFilter === undefined ? true : job.isPopuler === isPopularFilter;
            
            return matchesSearch && matchesPopular;
        });
    }, [jobs, debouncedSearch, isPopularFilter]);

    const totalPagesFiltered = Math.ceil(filteredJobs.length / 10);
    const displayedJobs = filteredJobs.slice((page - 1) * 10, page * 10);

    const handleTogglePopular = async (id: string, currentStatus: boolean) => {
        try {
            await makePopular({ id, isPopuler: !currentStatus }).unwrap();
            Swal.fire({
                icon: "success",
                title: !currentStatus ? "Marked as Popular" : "Removed from Popular",
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
        } catch (error: any) {
            Swal.fire({
                icon: "error",
                title: "Update Failed",
                text: error.data?.message || "Failed to update job status",
            });
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="space-y-6 bg-white min-h-[calc(100vh-100px)] p-4 sm:p-8 rounded-xl">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 uppercase tracking-tight">Job Management</h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">Monitor and manage all service listings and featured jobs</p>
                </div>
                {/* <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-4 py-2 bg-primary text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm"
                >
                    <Plus size={18} />
                    Create Job
                </button> */}
            </div>

            {/* Actions Bar */}
            <div className="pb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-slate-100">
                <div className="flex items-center w-full md:flex-1 md:max-w-md relative group">
                    <input
                        type="text"
                        placeholder="Search by ID or service title..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-full text-sm text-black focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
                    />
                    <div className="absolute left-1 top-1 bottom-1 w-9 h-9 flex items-center justify-center bg-primary text-white rounded-full">
                        <Search size={18} />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-200">
                        <button 
                            onClick={() => { setIsPopularFilter(undefined); }}
                            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${isPopularFilter === undefined ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"}`}
                        >
                            All
                        </button>
                        <button 
                            onClick={() => { setIsPopularFilter(true); }}
                            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${isPopularFilter === true ? "bg-white text-amber-500 shadow-sm" : "text-slate-400"}`}
                        >
                            Popular
                        </button>
                        <button 
                            onClick={() => { setIsPopularFilter(false); }}
                            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${isPopularFilter === false ? "bg-white text-slate-600 shadow-sm" : "text-slate-400"}`}
                        >
                            Not Popular
                        </button>
                    </div>
                </div>
            </div>

            {/* Frontend filtered Results Info */}
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
                <div className="w-1 h-1 rounded-full bg-primary animate-pulse"></div>
                Showing {filteredJobs.length} results
            </div>

            {/* Job Cards */}
            <div className="space-y-4 pt-4">
                {(isLoading || isFetching) && jobs.length === 0 ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-40 bg-slate-50 animate-pulse rounded-xl border border-slate-200"></div>
                        ))}
                    </div>
                ) : (
                    displayedJobs.map((job) => (
                        <div key={job.id} className="flex flex-col md:flex-row gap-6 p-5 border border-slate-200 rounded-xl bg-white hover:border-slate-300 transition-all hover:shadow-sm">
                            <div className="w-full md:w-52 h-36 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200 relative group">
                                {job.images && job.images.length > 0 ? (
                                    <img src={job.images[0]} alt={job.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                        <Image size={40} className="text-slate-300"/>
                                    </div>
                                )}
                                <div className="absolute top-2 right-2">
                                    <button
                                        onClick={() => handleTogglePopular(job.id, job.isPopuler)}
                                        className={`p-1 rounded-full shadow-sm transition-all ${job.isPopuler
                                            ? 'bg-amber-100 text-amber-600'
                                            : 'bg-white/80 text-slate-400 hover:text-slate-600'}`}
                                    >
                                        {job.isPopuler ? <Star size={12} fill="currentColor" /> : <StarOff size={12} />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 space-y-3">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors uppercase">{job.title}</h3>
                                        <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-lg uppercase tracking-wider ${job.status === 'PUBLISHED' ? "bg-green-50 text-green-600 border border-green-100" :
                                            job.status === 'DRAFT' ? "bg-amber-50 text-amber-600 border border-amber-100" :
                                                "bg-slate-50 text-slate-600 border border-slate-100"
                                            }`}>
                                            {job.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 mt-1 line-clamp-2 leading-relaxed" title={job.description}>
                                        {job.description || "No description provided."}
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-y-2 gap-x-6 pt-1 border-t border-slate-50 mt-2">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Calendar size={16} />
                                        <span className="text-xs font-medium">Created: {formatDate(job.createdAt)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-tight">Price:</span>
                                        <span className="text-sm font-bold text-slate-900">৳{job.basePrice}</span>
                                        <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded uppercase">{job.priceType}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-tight">ID:</span>
                                    {
                                        user?.role === 'SUPER_ADMIN' ? (
                                            <span className="text-[11px] font-mono text-slate-500">{job.id}</span>
                                        ) : (
                                            <span className="text-[11px] font-mono text-slate-500">***{job.id.slice(-8)}</span>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {(!isLoading && !isFetching) && filteredJobs.length === 0 && (
                    <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <StarOff className="text-slate-400" size={32} />
                        </div>
                        <h3 className="text-slate-900 font-bold text-lg uppercase tracking-tight">No results found</h3>
                        <p className="text-slate-500 text-sm mt-1">Try adjusting your frontend search or popularity filters.</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPagesFiltered > 1 && (
                <div className="py-6 border-t border-slate-300 flex items-center justify-end gap-3">
                    <button
                        disabled={page === 1 || isLoading || isFetching}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-50"
                    >
                        <ChevronLeft size={16} />
                        Previous
                    </button>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(totalPagesFiltered, 5) }, (_, i) => {
                            let pageNum = i + 1;
                            if (totalPagesFiltered > 5 && page > 3) {
                                pageNum = page - 3 + i;
                                if (pageNum + (5 - i) > totalPagesFiltered) {
                                    pageNum = totalPagesFiltered - 5 + i + 1;
                                }
                            }
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setPage(pageNum)}
                                    className={`w-8 h-8 rounded text-sm flex items-center justify-center font-medium transition-all ${pageNum === page
                                        ? 'bg-slate-100 text-slate-900 border border-slate-300 shadow-sm'
                                        : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                    </div>
                    <button
                        disabled={page >= totalPagesFiltered || isLoading || isFetching}
                        onClick={() => setPage((p) => Math.min(totalPagesFiltered, p + 1))}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-50"
                    >
                        Next
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}

            {/* <CreateJobModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
            /> */}
        </div>
    );
}
