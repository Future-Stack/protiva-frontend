"use client";

import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useAppDispatch } from "@/lib/hooks";
import { setDropdownOpen } from "@/lib/features/search/searchSlice";
import { useRouter } from "next/navigation";
import { Search, Loader2, ChevronRight, Briefcase, Layers, Users, CalendarCheck, ShieldCheck, AlertCircle } from "lucide-react";
import { useGlobalSearchQuery } from "@/lib/features/search/searchApi";

export default function SearchDropdown() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { query, isDropdownOpen } = useSelector((state: RootState) => state.search);
  const { user: authUser } = useSelector((state: RootState) => state.auth);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isSuperAdmin = authUser?.role === "SUPER_ADMIN";

  const { data: searchResponse, isLoading, error, isError } = useGlobalSearchQuery(query, {
    skip: !query || query.length < 1,
  });

  // Debug logs
  useEffect(() => {
    if (query) {
      console.log("Search query:", query);
      if (searchResponse) console.log("Search response:", searchResponse);
      if (error) {
        console.error("Search error detail:", error);
        if ('status' in error) console.log("Error status:", error.status);
      }
    }
  }, [query, searchResponse, error]);

  const results = searchResponse?.data || [];
  const hasResults = results.length > 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        dispatch(setDropdownOpen(false));
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dispatch]);

  if (!isDropdownOpen || !query) return null;

  const handleResultClick = (result: any) => {
    let path = "/dashboard";
    const base = isSuperAdmin ? "" : "/sub-dashboard";

    switch (result.type) {
      case "job":
        path = `${base}/jobs`;
        break;
      case "provider":
        path = `${base}/providers`;
        break;
      case "user":
        path = `${base}/users`;
        break;
      case "category":
        path = `${base}/categories`;
        break;
      case "booking":
        path = `${base}/bookings/requests`;
        break;
      default:
        path = isSuperAdmin ? "/dashboard" : "/sub-dashboard";
    }

    router.push(path);
    dispatch(setDropdownOpen(false));
  };

  const getIcon = (result: any) => {
    if (result.thumbnail) {
      return <img src={result.thumbnail} alt="" className="w-full h-full object-cover rounded-lg" />;
    }

    switch (result.type) {
      case "job": return <Briefcase size={16} className="text-amber-500" />;
      case "provider": return <ShieldCheck size={16} className="text-emerald-500" />;
      case "user": return <Users size={16} className="text-blue-500" />;
      case "category": return <Layers size={16} className="text-indigo-500" />;
      case "booking": return <CalendarCheck size={16} className="text-rose-500" />;
      default: return <Search size={16} className="text-slate-400" />;
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[9999] animate-in fade-in slide-in-from-top-2 duration-200"
      style={{ minWidth: "300px" }}
    >
      <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
        {isLoading ? (
          <div className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-500 mb-2" />
            <p className="text-sm text-slate-500 font-medium">Searching platform...</p>
          </div>
        ) : isError ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertCircle size={20} className="text-red-500" />
            </div>
            <p className="text-sm text-slate-500 font-semibold">Search failed</p>
            <p className="text-xs text-slate-400 mt-1">
              {error && 'status' in error ? `Status: ${error.status}` : 'Unknown Error'}
            </p>
            <p className="text-[10px] text-slate-300 mt-2 break-all">
              Please check if the API is reachable
            </p>
          </div>
        ) : !hasResults ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search size={20} className="text-slate-300" />
            </div>
            <p className="text-sm text-slate-500 font-semibold">No results found for "{query}"</p>
          </div>
        ) : (
          <div className="py-2">
            <div className="px-4 py-2 flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Search Results</span>
            </div>
            {results.map((result) => (
              <div
                key={result.id}
                onClick={() => handleResultClick(result)}
                className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center gap-3 w-full overflow-hidden">
                  <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden">
                    {getIcon(result)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors truncate">
                      {result.title}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight shrink-0">
                        {result.type}
                      </p>
                      {result.description && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-slate-200" />
                          <p className="text-[10px] text-slate-400 truncate">
                            {result.description}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-400 transition-transform group-hover:translate-x-1" />
              </div>
            ))}
          </div>
        )}
      </div>

      {hasResults && (
        <button
          onClick={() => {
            const searchPath = isSuperAdmin ? "/search" : "/sub-dashboard/search";
            router.push(`${searchPath}?q=${encodeURIComponent(query)}`);
            dispatch(setDropdownOpen(false));
          }}
          className="w-full py-3 bg-slate-50 border-t border-slate-100 text-sm font-bold text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2 group"
        >
          View All Results
          <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </div>
  );
}
