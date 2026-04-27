"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Search, Loader2} from "lucide-react";
import { useGetAllCategoriesQuery } from "@/lib/features/super-admin/category/categoryAPI";
import { useGetAllJobsQuery } from "@/lib/features/super-admin/job/jobAPI";
import { useGetAllUsersQuery } from "@/lib/features/super-admin/user/userAPI";
import { useGetAllProvidersQuery } from "@/lib/features/super-admin/provider/providerAPI";
import { useGetAllBookingsQuery } from "@/lib/features/super-admin/booking/bookingAPI";
import { useGetAllTransactionsQuery } from "@/lib/features/super-admin/transaction/transactionAPI";
import { useGetAllWithdrawalsQuery } from "@/lib/features/super-admin/withdraw/withdrawAPI";
import { useGetSubAdminsQuery } from "@/lib/features/super-admin/admin/adminAPI";
import { useGetMarketingBannersQuery } from "@/lib/features/super-admin/marketing/marketingAPI";
import Link from "next/link";
import { CalendarCheck, CreditCard, Wallet, ShieldCheck, ChevronRight, Briefcase, Layers, UserCheck, Megaphone } from "lucide-react";

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const { data: categoriesData, isLoading: isCatLoading } = useGetAllCategoriesQuery({ limit: 100 }, { skip: !query });
  const { data: jobsData, isLoading: isJobsLoading } = useGetAllJobsQuery({ search: query, limit: 10 }, { skip: !query });
  const { data: usersData, isLoading: isUsersLoading } = useGetAllUsersQuery({ search: query, limit: 10 }, { skip: !query });
  const { data: providersData, isLoading: isProvidersLoading } = useGetAllProvidersQuery({ search: query, limit: 10 }, { skip: !query });
  const { data: bookingsResponse, isLoading: isBookingsLoading } = useGetAllBookingsQuery({ search: query, limit: 10 }, { skip: !query });
  const { data: transactionsData, isLoading: isTxLoading } = useGetAllTransactionsQuery({ search: query, limit: 10 }, { skip: !query });
  const { data: withdrawalsData, isLoading: isWithdrawLoading } = useGetAllWithdrawalsQuery({ search: query, limit: 10 }, { skip: !query });
  const { data: subAdminsData, isLoading: isSubAdminLoading } = useGetSubAdminsQuery({ search: query, limit: 10 }, { skip: !query });
  const { data: bannersData, isLoading: isBannersLoading } = useGetMarketingBannersQuery({ limit: 100 }, { skip: !query });

  const categories = categoriesData?.data?.data?.data || [];
  const filteredCategories = categories.filter((c: any) => 
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  const jobs = jobsData?.data?.data?.data || [];
  const filteredJobs = jobs.filter((job: any) => 
    job.title.toLowerCase().includes(query.toLowerCase())
  );

  const users = usersData?.data?.data || [];
  console.log(users);
  const filteredUsers = users.filter((u: any) => 
    (u.firstName + " " + u.lastName).toLowerCase().includes(query.toLowerCase()) ||
    u.email.toLowerCase().includes(query.toLowerCase())
  );

  const providers = providersData?.data?.data || [];
  const filteredProviders = providers.filter((p: any) => 
    (p.firstName + " " + p.lastName).toLowerCase().includes(query.toLowerCase())
  );

  const bookings = bookingsResponse?.data?.data?.data || [];
  const filteredBookings = bookings.filter((b: any) => 
    (b.bookingNumber || "").toLowerCase().includes(query.toLowerCase()) ||
    (b.serviceName || "").toLowerCase().includes(query.toLowerCase())
  );

  const transactions = transactionsData?.data?.data || [];
  const filteredTransactions = transactions.filter((tx: any) => 
    (tx.transactionId || "").toLowerCase().includes(query.toLowerCase())
  );

  const withdrawals = withdrawalsData?.data?.data?.data || [];
  const filteredWithdrawals = withdrawals.filter((w: any) => 
    (w.withdrawalNumber || "").toLowerCase().includes(query.toLowerCase())
  );

  const subAdmins = subAdminsData?.data?.data || [];
  const filteredSubAdmins = subAdmins.filter((sa: any) => 
    (sa.firstName + " " + sa.lastName).toLowerCase().includes(query.toLowerCase()) ||
    sa.email.toLowerCase().includes(query.toLowerCase())
  );

  const banners = bannersData?.data || [];
  const filteredBanners = banners.filter((b: any) => 
    b.title.toLowerCase().includes(query.toLowerCase()) || 
    b.description.toLowerCase().includes(query.toLowerCase())
  );

  const isLoading = isCatLoading || isJobsLoading || isUsersLoading || isProvidersLoading || isBookingsLoading || isTxLoading || isWithdrawLoading || isSubAdminLoading || isBannersLoading;
  const hasResults = filteredCategories.length > 0 || filteredJobs.length > 0 || filteredUsers.length > 0 || filteredProviders.length > 0 || filteredBookings.length > 0 || filteredTransactions.length > 0 || filteredWithdrawals.length > 0 || filteredSubAdmins.length > 0 || filteredBanners.length > 0;

  if (!query) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <Search size={32} className="text-slate-300" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Search Protiva</h2>
        <p className="text-slate-500 mt-2">Enter a keyword in the search bar to find categories, jobs, or users.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Search Results</h1>
        <p className="text-sm text-slate-500 mt-1">Found {filteredCategories.length + filteredJobs.length + filteredProviders.length + filteredUsers.length + filteredBookings.length + filteredTransactions.length + filteredWithdrawals.length + filteredSubAdmins.length + filteredBanners.length} results for <span className="font-bold text-indigo-600">"{query}"</span></p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
          <p className="text-slate-500 font-medium">Aggregating platform data...</p>
        </div>
      ) : !hasResults ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-20 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search size={40} className="text-slate-200" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">No matches found</h2>
          <p className="text-slate-500 mt-2 max-w-md mx-auto">We couldn't find anything matching your search. Try adjusting your keywords or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Categories Section */}
          {filteredCategories.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm flex flex-col">
              <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <Layers size={18} className="text-indigo-600" />
                  <h3 className="font-bold text-slate-900">Service Categories</h3>
                </div>
                <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full uppercase tracking-wider">{filteredCategories.length}</span>
              </div>
              <div className="divide-y divide-slate-50 flex-1">
                {filteredCategories.map((cat: any) => (
                  <Link href="/categories" key={cat.id} className="block group">
                    <div className="px-6 py-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-lg">
                          {cat.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{cat.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{cat.description || "Service category for providers"}</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Jobs Section */}
          {filteredJobs.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm flex flex-col">
              <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <Briefcase size={18} className="text-amber-600" />
                  <h3 className="font-bold text-slate-900">Jobs</h3>
                </div>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full uppercase tracking-wider">{filteredJobs.length}</span>
              </div>
              <div className="divide-y divide-slate-50 flex-1">
                {filteredJobs.map((job: any) => (
                  <Link href="/jobs" key={job.id} className="block group">
                    <div className="px-6 py-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                          <Briefcase size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">{job.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold uppercase text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{job.status}</span>
                            <span className="text-[10px] font-medium text-slate-400">• Created {new Date(job.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-slate-300 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Users Section */}
          {filteredUsers.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm flex flex-col">
              <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <UserCheck size={18} className="text-sky-600" />
                  <h3 className="font-bold text-slate-900">Users</h3>
                </div>
                <span className="text-[10px] font-bold bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full uppercase tracking-wider">{filteredUsers.length}</span>
              </div>
              <div className="divide-y divide-slate-50 flex-1">
                {filteredUsers.map((user: any) => (
                  <Link href="/users" key={user.id} className="block group">
                    <div className="px-6 py-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full border-2 border-slate-100 overflow-hidden shrink-0">
                          {user.avatar ? (
                            <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-sky-50 flex items-center justify-center text-sky-600 font-bold">
                              {user.firstName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-sky-600 transition-colors">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-slate-300 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Providers Section */}
          {filteredProviders.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm flex flex-col">
              <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <UserCheck size={18} className="text-emerald-600" />
                  <h3 className="font-bold text-slate-900">Service Providers</h3>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full uppercase tracking-wider">{filteredProviders.length}</span>
              </div>
              <div className="divide-y divide-slate-50 flex-1">
                {filteredProviders.map((provider: any) => (
                  <Link href="/providers" key={provider.id} className="block group">
                    <div className="px-6 py-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full border-2 border-slate-100 overflow-hidden shrink-0">
                          {provider.avatar ? (
                            <img src={provider.avatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold">
                              {provider.firstName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{provider.firstName} {provider.lastName}</p>
                          <p className="text-xs text-slate-500 mt-0.5 uppercase tracking-wide font-medium">{provider.status} • {provider.verificationStatus}</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-slate-300 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Bookings Section */}
          {filteredBookings.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm flex flex-col">
              <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <CalendarCheck size={18} className="text-blue-600" />
                  <h3 className="font-bold text-slate-900">Bookings</h3>
                </div>
                <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase tracking-wider">{filteredBookings.length}</span>
              </div>
              <div className="divide-y divide-slate-50 flex-1">
                {filteredBookings.map((booking: any) => (
                  <Link href="/bookings/requests" key={booking.id} className="block group">
                    <div className="px-6 py-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                          BK
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">ID: {booking.bookingNumber || booking.id.slice(-8).toUpperCase()}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{booking.serviceName} • {booking.status}</p>
                          <p className="text-[10px] text-slate-400 mt-1">Client: {booking.client?.firstName} {booking.client?.lastName}</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Marketing Tool Section */}
          {filteredBanners.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm flex flex-col">
              <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <Megaphone size={18} className="text-orange-600" />
                  <h3 className="font-bold text-slate-900">Marketing Tools</h3>
                </div>
                <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full uppercase tracking-wider">{filteredBanners.length}</span>
              </div>
              <div className="divide-y divide-slate-50 flex-1">
                {filteredBanners.map((banner: any) => (
                  <Link href="/marketing" key={banner.id} className="block group">
                    <div className="px-6 py-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 font-bold">
                          <Megaphone size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors">{banner.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{banner.description}</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-slate-300 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Transactions Section */}
          {filteredTransactions.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm flex flex-col">
              <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <CreditCard size={18} className="text-violet-600" />
                  <h3 className="font-bold text-slate-900">Transactions</h3>
                </div>
                <span className="text-[10px] font-bold bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full uppercase tracking-wider">{filteredTransactions.length}</span>
              </div>
              <div className="divide-y divide-slate-50 flex-1">
                {filteredTransactions.map((tx: any) => (
                  <Link href="/transactions" key={tx.id} className="block group">
                    <div className="px-6 py-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600">
                          <CreditCard size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-violet-600 transition-colors">ID: {tx.transactionId}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{tx.amount} {tx.currency} • {tx.status}</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-slate-300 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Withdrawals Section */}
          {filteredWithdrawals.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm flex flex-col">
              <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <Wallet size={18} className="text-rose-600" />
                  <h3 className="font-bold text-slate-900">Withdrawals</h3>
                </div>
                <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full uppercase tracking-wider">{filteredWithdrawals.length}</span>
              </div>
              <div className="divide-y divide-slate-50 flex-1">
                {filteredWithdrawals.map((w: any) => (
                  <Link href="/transactions/withdrawals" key={w.id} className="block group">
                    <div className="px-6 py-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                          <Wallet size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-rose-600 transition-colors">ID: {w.withdrawalNumber || w.id.slice(-8).toUpperCase()}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{w.amount} • {w.status}</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-slate-300 group-hover:text-rose-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Sub-Admins Section */}
          {filteredSubAdmins.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm flex flex-col">
              <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-cyan-600" />
                  <h3 className="font-bold text-slate-900">Sub-Admins</h3>
                </div>
                <span className="text-[10px] font-bold bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full uppercase tracking-wider">{filteredSubAdmins.length}</span>
              </div>
              <div className="divide-y divide-slate-50 flex-1">
                {filteredSubAdmins.map((admin: any) => (
                  <Link href="/sub-admin" key={admin.id} className="block group">
                    <div className="px-6 py-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full border-2 border-slate-100 overflow-hidden shrink-0">
                          {admin.avatar ? (
                            <img src={admin.avatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-cyan-50 flex items-center justify-center text-cyan-600 font-bold">
                              {admin.firstName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">{admin.firstName} {admin.lastName}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{admin.email}</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-slate-300 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  );
}
