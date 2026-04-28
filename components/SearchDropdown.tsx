// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import { useSelector } from "react-redux";
// import { RootState } from "@/lib/store";
// import { useAppDispatch } from "@/lib/hooks";
// import { setDropdownOpen } from "@/lib/features/search/searchSlice";
// import { useRouter } from "next/navigation";
// import { Search, Loader2, ChevronRight, Briefcase, Layers, Users, UserCheck } from "lucide-react";
// import { useGetAllCategoriesQuery } from "@/lib/features/super-admin/category/categoryAPI";
// import { useGetAllJobsQuery } from "@/lib/features/super-admin/job/jobAPI";
// import { useGetAllUsersQuery } from "@/lib/features/super-admin/user/userAPI";
// import { useGetAllProvidersQuery } from "@/lib/features/super-admin/provider/providerAPI";
// import { useGetAllBookingsQuery } from "@/lib/features/super-admin/booking/bookingAPI";
// import { useGetAllTransactionsQuery } from "@/lib/features/super-admin/transaction/transactionAPI";
// import { useGetAllWithdrawalsQuery } from "@/lib/features/super-admin/withdraw/withdrawAPI";
// import { useGetSubAdminsQuery } from "@/lib/features/super-admin/admin/adminAPI";
// import { useGetMarketingBannersQuery } from "@/lib/features/super-admin/marketing/marketingAPI";
// import { CalendarCheck, CreditCard, Wallet, ShieldCheck, Megaphone } from "lucide-react";

// export default function SearchDropdown() {
//   const router = useRouter();
//   const dispatch = useAppDispatch();
//   const { query, isDropdownOpen } = useSelector((state: RootState) => state.search);
//   const { user } = useSelector((state: RootState) => state.auth);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   const isSuperAdmin = user?.role === "SUPER_ADMIN";

//   // Fetching data
//   const { data: categoriesData, isLoading: isCatLoading } = useGetAllCategoriesQuery({ limit: 100 }, { skip: !query });
//   console.log(categoriesData)
//   const { data: jobsData, isLoading: isJobsLoading } = useGetAllJobsQuery({ search: query, limit: 5 }, { skip: !query });
//   console.log(jobsData)
//   const { data: usersData, isLoading: isUsersLoading } = useGetAllUsersQuery({ search: query, limit: 5 }, { skip: !query });
//   console.log(usersData)
//   const { data: providersData, isLoading: isProvidersLoading } = useGetAllProvidersQuery({ search: query, limit: 5 }, { skip: !query });
//   console.log(providersData)
//   const { data: bookingsResponse, isLoading: isBookingsLoading } = useGetAllBookingsQuery({
//           // page: 1,
//           limit: 5,
//           search: query,
//       }, { skip: !query });
//   console.log(bookingsResponse)
//   const { data: transactionsData, isLoading: isTxLoading } = useGetAllTransactionsQuery({ search: query, limit: 5 }, { skip: !query });
//   console.log(transactionsData)
//   const { data: withdrawalsData, isLoading: isWithdrawLoading } = useGetAllWithdrawalsQuery({ search: query, limit: 5 }, { skip: !query });
//   console.log(withdrawalsData)
//   const { data: subAdminsData, isLoading: isSubAdminLoading } = useGetSubAdminsQuery({ search: query, limit: 5 }, { skip: !query });
//   console.log(subAdminsData)
//   const { data: bannersData, isLoading: isBannersLoading } = useGetMarketingBannersQuery({ limit: 100 }, { skip: !query });
//   console.log(bannersData)

//   const extractArray = (obj: any): any[] => {
//     if (!obj) return [];
//     if (Array.isArray(obj)) return obj;
//     if (obj.data && Array.isArray(obj.data)) return obj.data;
//     if (obj.data?.data && Array.isArray(obj.data.data)) return obj.data.data;
//     if (obj.data?.data?.data && Array.isArray(obj.data.data.data)) return obj.data.data.data;
//     return [];
//   };

//   const categories = extractArray(categoriesData);
//   const filteredCategories = categories.filter((c: any) => 
//     c?.name?.toLowerCase().includes(query.toLowerCase())
//   ).slice(0, 5);

//   const jobs = extractArray(jobsData);
//   const filteredJobs = jobs.filter((job: any) => 
//     job?.title?.toLowerCase().includes(query.toLowerCase())
//   ).slice(0, 5);

//   const users = extractArray(usersData);
//   const filteredUsers = users.filter((u: any) => 
//     (u?.firstName + " " + u?.lastName)?.toLowerCase().includes(query.toLowerCase()) ||
//     u?.email?.toLowerCase().includes(query.toLowerCase())
//   ).slice(0, 5);

//   const providers = extractArray(providersData);
//   const filteredProviders = providers.filter((p: any) => 
//     (p?.firstName + " " + p?.lastName)?.toLowerCase().includes(query.toLowerCase()) ||
//     p?.email?.toLowerCase().includes(query.toLowerCase())
//   ).slice(0, 5);

//   const bookings = extractArray(bookingsResponse);
//   const filteredBookings = bookings.filter((b: any) => 
//     (b?.bookingNumber || "")?.toLowerCase().includes(query.toLowerCase()) ||
//     (b?.serviceName || "")?.toLowerCase().includes(query.toLowerCase())
//   ).slice(0, 5);

//   const transactions = extractArray(transactionsData);
//   const filteredTransactions = transactions.filter((tx: any) => 
//     (tx?.transactionId || "")?.toLowerCase().includes(query.toLowerCase())
//   ).slice(0, 5);

//   const withdrawals = extractArray(withdrawalsData);
//   const filteredWithdrawals = withdrawals.filter((w: any) => 
//     (w?.withdrawalNumber || "")?.toLowerCase().includes(query.toLowerCase())
//   ).slice(0, 5);

//   const subAdmins = extractArray(subAdminsData);
//   const filteredSubAdmins = subAdmins.filter((sa: any) => 
//     (sa?.firstName + " " + sa?.lastName)?.toLowerCase().includes(query.toLowerCase()) ||
//     sa?.email?.toLowerCase().includes(query.toLowerCase())
//   ).slice(0, 5);

//   const banners = extractArray(bannersData);
//   const filteredBanners = banners.filter((b: any) => 
//     b?.title?.toLowerCase().includes(query.toLowerCase()) || 
//     b?.description?.toLowerCase().includes(query.toLowerCase())
//   ).slice(0, 5);

//   const hasResults = filteredCategories.length > 0 || filteredJobs.length > 0 || filteredUsers.length > 0 || filteredProviders.length > 0 || filteredBookings.length > 0 || filteredTransactions.length > 0 || filteredWithdrawals.length > 0 || filteredSubAdmins.length > 0 || filteredBanners.length > 0;
//   const isLoading = isCatLoading || isJobsLoading || isBookingsLoading || isTxLoading || isWithdrawLoading || isUsersLoading || isProvidersLoading || isSubAdminLoading || isBannersLoading;

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         dispatch(setDropdownOpen(false));
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [dispatch]);

//   if (!isDropdownOpen || !query) return null;

//   const handleResultClick = (path: string) => {
//     router.push(path);
//     dispatch(setDropdownOpen(false));
//   };

//   const handleViewAll = () => {
//     const searchPath = isSuperAdmin ? "/search" : "/sub-dashboard/search";
//     router.push(`${searchPath}?q=${encodeURIComponent(query)}`);
//     dispatch(setDropdownOpen(false));
//   };

//   return (
//     <div
//       ref={dropdownRef}
//       className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
//     >
//       <div className="max-h-[480px] overflow-y-auto scrollbar-hide">
//         {isLoading ? (
//           <div className="p-8 text-center">
//             <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-500 mb-2" />
//             <p className="text-sm text-slate-500 font-medium">Searching across platform...</p>
//           </div>
//         ) : !hasResults ? (
//           <div className="p-8 text-center">
//             <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
//               <Search size={20} className="text-slate-300" />
//             </div>
//             <p className="text-sm text-slate-500 font-semibold">No results found for "{query}"</p>
//             <p className="text-xs text-slate-400 mt-1">Try different keywords or check spelling</p>
//           </div>
//         ) : (
//           <div className="py-2">
//             {/* Categories */}
//             {filteredCategories.length > 0 && (
//               <div className="mb-4">
//                 <div className="px-4 py-2 flex items-center gap-2">
//                   <Layers size={14} className="text-indigo-500" />
//                   <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Categories</span>
//                 </div>
//                 {filteredCategories.map((cat: any) => (
//                   <div
//                     key={cat.id}
//                     onClick={() => handleResultClick(isSuperAdmin ? `/categories` : `/sub-dashboard/categories`)}
//                     className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer flex items-center justify-between group transition-colors"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs uppercase">
//                         {cat.name.charAt(0)}
//                       </div>
//                       <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-600">{cat.name}</span>
//                     </div>
//                     <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-400" />
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* Jobs */}
//             {filteredJobs.length > 0 && (
//               <div className="mb-4">
//                 <div className="px-4 py-2 flex items-center gap-2">
//                   <Briefcase size={14} className="text-amber-500" />
//                   <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Recent Jobs</span>
//                 </div>
//                 {filteredJobs.map((job: any) => (
//                   <div
//                     key={job.id}
//                     onClick={() => handleResultClick(isSuperAdmin ? `/jobs` : `/sub-dashboard/jobs`)}
//                     className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer flex items-center justify-between group transition-colors"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
//                         <Briefcase size={14} />
//                       </div>
//                       <span className="text-sm font-medium text-slate-700 group-hover:text-amber-600">{job.title}</span>
//                     </div>
//                     <ChevronRight size={14} className="text-slate-300 group-hover:text-amber-400" />
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* Bookings */}
//             {filteredBookings.length > 0 && (
//               <div className="mb-4">
//                 <div className="px-4 py-2 flex items-center gap-2">
//                   <CalendarCheck size={14} className="text-blue-500" />
//                   <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Bookings</span>
//                 </div>
//                 {filteredBookings.map((booking: any) => (
//                   <div
//                     key={booking.id}
//                     onClick={() => handleResultClick(isSuperAdmin ? `/bookings/requests` : `/sub-dashboard/bookings/requests`)}
//                     className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer flex items-center justify-between group transition-colors"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
//                         <CalendarCheck size={14} />
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium text-slate-700 group-hover:text-blue-600">ID: {booking.bookingNumber || booking.id.slice(-8).toUpperCase()}</p>
//                         <p className="text-[10px] text-slate-400">{booking.serviceName}</p>
//                       </div>
//                     </div>
//                     <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-400" />
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* Transactions */}
//             {filteredTransactions.length > 0 && (
//               <div className="mb-4">
//                 <div className="px-4 py-2 flex items-center gap-2">
//                   <CreditCard size={14} className="text-violet-500" />
//                   <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Transactions</span>
//                 </div>
//                 {filteredTransactions.map((tx: any) => (
//                   <div
//                     key={tx.id}
//                     onClick={() => handleResultClick(isSuperAdmin ? `/transactions` : `/sub-dashboard/transactions`)}
//                     className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer flex items-center justify-between group transition-colors"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600">
//                         <CreditCard size={14} />
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium text-slate-700 group-hover:text-violet-600">ID: {tx.transactionId}</p>
//                         <p className="text-[10px] text-slate-400">{tx.amount} {tx.currency} • {tx.status}</p>
//                       </div>
//                     </div>
//                     <ChevronRight size={14} className="text-slate-300 group-hover:text-violet-400" />
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* Withdrawals */}
//             {filteredWithdrawals.length > 0 && (
//               <div className="mb-4">
//                 <div className="px-4 py-2 flex items-center gap-2">
//                   <Wallet size={14} className="text-rose-500" />
//                   <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Withdrawals</span>
//                 </div>
//                 {filteredWithdrawals.map((w: any) => (
//                   <div
//                     key={w.id}
//                     onClick={() => handleResultClick(isSuperAdmin ? `/transactions/withdrawals` : `/sub-dashboard/transactions/withdrawals`)}
//                     className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer flex items-center justify-between group transition-colors"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
//                         <Wallet size={14} />
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium text-slate-700 group-hover:text-rose-600">ID: {w.withdrawalNumber || w.id.slice(-8).toUpperCase()}</p>
//                         <p className="text-[10px] text-slate-400">{w.amount} • {w.status}</p>
//                       </div>
//                     </div>
//                     <ChevronRight size={14} className="text-slate-300 group-hover:text-rose-400" />
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* Sub-Admins */}
//             {filteredSubAdmins.length > 0 && (
//               <div className="mb-4">
//                 <div className="px-4 py-2 flex items-center gap-2">
//                   <ShieldCheck size={14} className="text-cyan-500" />
//                   <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sub-Admins</span>
//                 </div>
//                 {filteredSubAdmins.map((admin: any) => (
//                   <div
//                     key={admin.id}
//                     onClick={() => handleResultClick(isSuperAdmin ? `/sub-admin` : `/sub-dashboard/sub-admin`)}
//                     className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer flex items-center justify-between group transition-colors"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="w-8 h-8 rounded-full bg-cyan-50 overflow-hidden flex items-center justify-center">
//                         {admin.avatar ? (
//                           <img src={admin.avatar} alt="" className="w-full h-full object-cover" />
//                         ) : (
//                           <ShieldCheck size={14} className="text-cyan-600" />
//                         )}
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium text-slate-700 group-hover:text-cyan-600">
//                           {admin.firstName} {admin.lastName}
//                         </p>
//                         <p className="text-[10px] text-slate-400">{admin.email}</p>
//                       </div>
//                     </div>
//                     <ChevronRight size={14} className="text-slate-300 group-hover:text-cyan-400" />
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* Providers */}
//             {filteredProviders.length > 0 && (
//               <div className="mb-4">
//                 <div className="px-4 py-2 flex items-center gap-2">
//                   <UserCheck size={14} className="text-emerald-500" />
//                   <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Providers</span>
//                 </div>
//                 {filteredProviders.map((provider: any) => (
//                   <div
//                     key={provider.id}
//                     onClick={() => handleResultClick(isSuperAdmin ? `/providers` : `/sub-dashboard/providers`)}
//                     className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer flex items-center justify-between group transition-colors"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="w-8 h-8 rounded-full bg-emerald-50 overflow-hidden flex items-center justify-center">
//                         {provider.avatar ? (
//                           <img src={provider.avatar} alt="" className="w-full h-full object-cover" />
//                         ) : (
//                           <Users size={14} className="text-emerald-600" />
//                         )}
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium text-slate-700 group-hover:text-emerald-600">
//                           {provider.firstName} {provider.lastName}
//                         </p>
//                         <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">{provider.role}</p>
//                       </div>
//                     </div>
//                     <ChevronRight size={14} className="text-slate-300 group-hover:text-emerald-400" />
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* Users */}
//             {filteredUsers.length > 0 && (
//               <div className="mb-2">
//                 <div className="px-4 py-2 flex items-center gap-2">
//                   <Users size={14} className="text-blue-500" />
//                   <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Platform Users</span>
//                 </div>
//                 {filteredUsers.map((u: any) => (
//                   <div
//                     key={u.id}
//                     onClick={() => handleResultClick(isSuperAdmin ? `/users` : `/sub-dashboard/users`)}
//                     className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer flex items-center justify-between group transition-colors"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="w-8 h-8 rounded-full bg-blue-50 overflow-hidden flex items-center justify-center">
//                         {u.avatar ? (
//                           <img src={u.avatar} alt="" className="w-full h-full object-cover" />
//                         ) : (
//                           <Users size={14} className="text-blue-600" />
//                         )}
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium text-slate-700 group-hover:text-blue-600">
//                           {u.firstName} {u.lastName}
//                         </p>
//                         <p className="text-[10px] text-slate-400">{u.email}</p>
//                       </div>
//                     </div>
//                     <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-400" />
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* Marketing Banners */}
//             {filteredBanners.length > 0 && (
//               <div className="mb-2">
//                 <div className="px-4 py-2 flex items-center gap-2">
//                   <Megaphone size={14} className="text-pink-500" />
//                   <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Marketing Banners</span>
//                 </div>
//                 {filteredBanners.map((b: any) => (
//                   <div
//                     key={b.id}
//                     onClick={() => handleResultClick(isSuperAdmin ? `/marketing` : `/sub-dashboard/marketing`)}
//                     className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer flex items-center justify-between group transition-colors"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="w-8 h-8 rounded-lg bg-pink-50 overflow-hidden flex items-center justify-center">
//                         {b.image ? (
//                           <img src={b.image} alt="" className="w-full h-full object-cover" />
//                         ) : (
//                           <Megaphone size={14} className="text-pink-600" />
//                         )}
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium text-slate-700 group-hover:text-pink-600">
//                           {b.title}
//                         </p>
//                         <p className="text-[10px] text-slate-400 truncate max-w-[150px]">{b.description}</p>
//                       </div>
//                     </div>
//                     <ChevronRight size={14} className="text-slate-300 group-hover:text-pink-400" />
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* View All Footer */}
//       {hasResults && (
//         <button
//           onClick={handleViewAll}
//           className="w-full py-3 bg-slate-50 border-t border-slate-100 text-sm font-bold text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2 group"
//         >
//           View All Results
//           <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
//         </button>
//       )}
//     </div>
//   );
// }
