"use client";

import { Bell, Search, User, Globe, Menu, User2Icon, Settings, LogOut, Info, CheckCircle, AlertCircle, CircleDollarSign, Clock, X } from "lucide-react";
import Logo from "@/app/assets/logo";
import { MdArrowDropDown } from "react-icons/md";
import user1 from "@/app/assets/user1.png";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useAppDispatch } from "@/lib/hooks";
import { logout } from "@/lib/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { useGetMeQuery } from "@/lib/features/auth/authApi";
import { useGetNotificationsQuery, useReadNotificationMutation } from "@/lib/features/notification/notificationAPI";
import { setSearchQuery, setDropdownOpen } from "@/lib/features/search/searchSlice";
import SearchDropdown from "./SearchDropdown";

interface NavbarProps {
  onMenuClick?: () => void;
}

type ModalType = "language" | "notification" | "user" | null;

export default function Navbar({ onMenuClick }: NavbarProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: profileResponse } = useGetMeQuery();
  const reduxUser = useSelector((state: RootState) => state.auth.user);
  const user = profileResponse?.data || reduxUser;

  const { data: notificationsResponse } = useGetNotificationsQuery();
  const [readNotification] = useReadNotificationMutation();
  const notifications = notificationsResponse?.data || [];
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const [openModal, setOpenModal] = useState<ModalType>(null);
  const ref = useRef<HTMLDivElement>(null);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [language, setLanguage] = useState("English");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const { query: searchQuery, isDropdownOpen } = useSelector((state: RootState) => state.search);
  console.log(searchQuery);

  const toggle = (type: ModalType) => {
    setOpenModal((prev) => (prev === type ? null : type));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log("Input changed:", value);
    dispatch(setSearchQuery(value));
    if (value) {
      dispatch(setDropdownOpen(true));
    } else {
      dispatch(setDropdownOpen(false));
    }
  };

  const handleSearchSubmit = () => {
    console.log("Search submitted:", searchQuery);
    if (!searchQuery.trim()) return;
    const searchPath = user?.role === "SUPER_ADMIN" ? "/search" : "/sub-dashboard/search";
    router.push(`${searchPath}?q=${encodeURIComponent(searchQuery)}`);
    dispatch(setDropdownOpen(false));
    setMobileSearch(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpenModal(null);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/";
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInMs = now.getTime() - past.getTime();
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMins / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMins < 1) return 'Just now';
    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return past.toLocaleDateString();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'PROFILE_UPDATE': return <User size={16} className="text-blue-500" />;
      case 'PAYMENT_SUCCESS': return <CircleDollarSign size={16} className="text-green-500" />;
      case 'BOOKING_ALERT': return <Clock size={16} className="text-amber-500" />;
      case 'SYSTEM': return <Info size={16} className="text-slate-500" />;
      default: return <Info size={16} className="text-slate-500" />;
    }
  };

  return (
    <>
      <header className="
        h-16 md:h-20
        bg-white border-b border-slate-100
        flex items-center justify-between
        mx-3 my-3 md:mx-6 md:my-5
        px-3 md:px-5
        sticky top-0 z-40 rounded-[10px]
      ">
        <div className="hidden lg:block cursor-pointer w-25 h-5 lg:w-61.25 lg:h-14.25 ">
          <Logo />
        </div>
        <div className="flex gap-7.25 w-full md:w-fit  items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="hidden sm:flex items-center flex-1 max-w-md relative group w-75 xl:w-125 ">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                onFocus={() => searchQuery && dispatch(setDropdownOpen(true))}
                className="w-full px-4 py-1.5 h-11.25 bg-white border border-[#00000024] rounded-[50px] text-sm font-normal text-black focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
              />
              <button 
                onClick={handleSearchSubmit}
                className="absolute right-1.5 top-1 bottom-1 w-9 h-9 flex items-center justify-center bg-[#787BEB] text-white rounded-full hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Search size={18} />
              </button>
              <SearchDropdown />
            </div>
            <button
              onClick={() => setMobileSearch(true)}
              className="sm:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg"
            >
              <Search size={20} />
            </button>
            {mobileSearch && (
              <div className="fixed inset-0 bg-white z-60 p-4 animate-in slide-in-from-top duration-300">
                <div className="flex items-center gap-2 max-w-lg mx-auto relative">
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => searchQuery && dispatch(setDropdownOpen(true))}
                    className="flex-1 h-11 px-4 text-black border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                  />
                  <button
                    onClick={() => setMobileSearch(false)}
                    className="p-2 text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    <X size={24} />
                  </button>
                  <SearchDropdown />
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            {/* <button
              onClick={() => toggle("language")}
              className="hidden w-[120px] md:flex items-center gap-2 text-[#09090B] hover:text-slate-900 transition-colors"
            >
              <Globe size={20} />
              <span className="text-base font-medium text-[#18181A]">
                {language}
              </span>
              <MdArrowDropDown size={24} className="text-[#000]" />
            </button>
            {openModal === "language" && (
              <div
                ref={ref}
                className="absolute top-[60px] right-[180px] bg-white border border-slate-200 rounded-md shadow-md w-[140px]"
              >
                <button
                  onClick={() => {
                    setLanguage("English");
                    setOpenModal(null);
                  }}
                  className="w-full text-left text-black cursor-pointer duration-300 px-4 py-2.5 text-sm hover:bg-slate-100"
                >
                  English
                </button>
                <button
                  onClick={() => {
                    setLanguage("বাংলা");
                    setOpenModal(null);
                  }}
                  className="w-full text-left text-black cursor-pointer duration-300 px-4 py-2.5 text-sm hover:bg-slate-100"
                >
                  বাংলা
                </button>
              </div>
            )} */}
            <button
              onClick={() => toggle("notification")}
              className="p-2 md:p-2.5 text-slate-500 hover:bg-slate-50 rounded-full relative transition-colors"
            >
              <Bell size={24} color="#09090B" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-[#EF4444] text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            {openModal === "notification" && (
              <div ref={ref} className="absolute top-16.25 right-2 md:right-20 bg-white border border-slate-200 rounded-xl shadow-xl w-[320px] md:w-95 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <button className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider">
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-105 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="py-12 text-center">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Bell size={20} className="text-slate-300" />
                      </div>
                      <p className="text-sm text-slate-500 font-medium">No notifications yet</p>
                      <p className="text-xs text-slate-400 mt-1">We'll let you know when something happens</p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => !n.isRead && readNotification(n.id)}
                        className={`px-4 py-4 flex gap-4 cursor-pointer hover:bg-slate-50 transition-colors relative ${!n.isRead ? 'bg-indigo-50/20' : ''}`}
                      >
                        <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center border ${!n.isRead ? 'bg-white border-indigo-100 shadow-sm' : 'bg-slate-50 border-slate-100'}`}>
                          {getNotificationIcon(n.type)}
                        </div>
                        <div className="flex-1 min-w-0 mt-2">
                          <div className="flex items-center justify-between mb-1">
                            <p className={`text-sm font-bold truncate pr-2 ${!n.isRead ? 'text-slate-900' : 'text-slate-600'}`}>{n.title}</p>
                            <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">{getTimeAgo(n.createdAt)}</span>
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {n.message}
                          </p>
                        </div>
                        {!n.isRead && (
                          <div className="absolute top-4 right-4 w-2 h-2 bg-indigo-500 rounded-full shadow-sm shadow-indigo-200"></div>
                        )}
                      </div>
                    ))
                  )}
                </div>
                {notifications.length > 5 && (
                  <div className="px-4 py-2 text-center border-t border-slate-100">
                    <button className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors">
                      View all notifications
                    </button>
                  </div>
                )}
              </div>
            )}
            <div className="">
              <div
                onClick={() => toggle("user")}
                className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer overflow-hidden"
              >
                {user?.avatar ? (
                  <img
                    src={user?.avatar}
                    alt="user"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{user?.firstName?.[0]?.toUpperCase()}{user?.lastName?.[0]?.toUpperCase()}</span>
                  </div>
                )}
              </div>
            </div>
            {openModal === "user" && (
              <div className="absolute top-15 right-0 bg-white rounded-lg shadow-md w-65 overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50">
                  <div className="w-12 h-12 rounded-full overflow-hidden ">
                    {user?.avatar ? (
                      <img
                        src={user?.avatar}
                        alt="user"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{user?.firstName?.[0]?.toUpperCase()}{user?.lastName?.[0]?.toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-[10px] rounded-full bg-indigo-100 text-indigo-600">
                      {user?.role?.replace("_", " ")}
                    </span>
                  </div>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      const profilePath = user?.role === "SUPER_ADMIN" ? "/settings" : "/sub-dashboard/settings";
                      router.push(profilePath);
                      setOpenModal(null);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium
                   text-slate-800 hover:bg-slate-100 transition-colors"
                  >
                    <User size={16} className="text-slate-500" />
                    Profile
                  </button>
                </div>
                <div className="h-px bg-slate-200" />
                <button
                  onClick={() => {
                    setShowLogoutModal(true);
                    setOpenModal(null);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium
                 text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} className="text-red-500" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-999 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-50 mb-6 transition-transform hover:scale-110 duration-300">
                <LogOut className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Logout Confirmation</h3>
              <p className="text-sm text-slate-500 mb-8">
                Are you sure you want to log out? <br /> You will need to sign in again to access your account.
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleLogout}
                  className="w-full py-3 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 active:scale-[0.98] transition-all shadow-lg shadow-red-100"
                >
                  Yes, Log Me Out
                </button>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="w-full py-3 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 active:scale-[0.98] transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
