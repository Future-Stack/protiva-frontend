"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Star,
  StarOff,
  Calendar,
} from "lucide-react";
import { useGetAllJobsQuery, useMakePopularJobMutation } from "@/lib/features/super-admin/job/jobAPI";
import Swal from "sweetalert2";

export default function SubAdminJobListPage() {
  const [page, setPage] = useState(1);
  const { data: response, isLoading, isError } = useGetAllJobsQuery({ page, limit: 10 });
  const [makePopular] = useMakePopularJobMutation();

  const jobs = response?.data?.data?.data || [];
  const meta = response?.data?.data?.meta;

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
    <div className="space-y-6 bg-white px-[26px] py-[34px] rounded-lg overflow-hidden min-h-[80vh]">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Job Management</h2>
        <p className="text-sm text-slate-500 mt-1">Monitor all service listings and feature popular jobs</p>
      </div>

      <div className="mt-6">
        {/* Table */}
        <div className="overflow-x-auto border border-slate-300 rounded-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#EFF6FF]">
                <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300 text-center">SL</th>
                <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300">Job Details</th>
                <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300 text-center">Pricing</th>
                <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300 text-center">Status</th>
                <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300 text-center">Popular</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      <p className="text-sm text-slate-500 font-medium">Loading jobs...</p>
                    </div>
                  </td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-slate-500 italic">
                    No jobs found.
                  </td>
                </tr>
              ) : (
                jobs.map((job, index) => (
                  <tr key={job.id} className="border-t border-slate-300 hover:bg-slate-50/50 transition-colors group">
                    <td className="px-4 py-4 text-sm text-[#2C2C2C] border-r border-slate-300 text-center">
                      {index + 1 + (page - 1) * 10}
                    </td>
                    <td className="px-4 py-4 border-r border-slate-300">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-200">
                          {job.images.length > 0 ? (
                            <img src={job.images[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <img src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=200&auto=format&fit=crop" alt="" className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate max-w-[200px]">{job.title}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Calendar size={12} /> {formatDate(job.createdAt)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 border-r border-slate-300 text-center">
                      <div className="text-sm font-bold text-slate-900">৳{job.basePrice}</div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-0.5">{job.priceType}</div>
                    </td>
                    <td className="px-4 py-4 border-r border-slate-300 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${job.status === 'PUBLISHED' ? 'bg-green-50 text-green-600' :
                          job.status === 'DRAFT' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-600'
                        }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center border-r border-slate-300">
                      <button
                        onClick={() => handleTogglePopular(job.id, job.isPopuler)}
                        className={`p-1.5 rounded-lg transition-all ${job.isPopuler
                            ? 'text-amber-600 hover:bg-amber-50'
                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                          }`}
                      >
                        {job.isPopuler ? <Star size={20} fill="currentColor" /> : <StarOff size={20} />}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination inspired by Transaction Page */}
        {meta && meta.totalPage > 1 && (
          <div className="py-4 border-t border-slate-300 flex items-center justify-end gap-3">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-50"
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(meta.totalPage, 5) }, (_, i) => {
                let pageNum = i + 1;
                if (meta.totalPage > 5 && page > 3) {
                  pageNum = page - 3 + i;
                  if (pageNum + (5 - i) > meta.totalPage) {
                    pageNum = meta.totalPage - 5 + i + 1;
                  }
                }
                return (
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
                );
              })}
              {meta.totalPage > 5 && page < meta.totalPage - 2 && (
                <span className="px-1 text-slate-400">...</span>
              )}
            </div>
            <button
              disabled={page === meta.totalPage}
              onClick={() => setPage(p => Math.min(meta.totalPage, p + 1))}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-50"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
