"use client";

import { Bell, Search, User, Globe, Menu, User2Icon, Settings, LogOut } from "lucide-react";
import Logo from "@/app/assets/logo";
import { MdArrowDropDown } from "react-icons/md";
import user from "@/app/assets/user1.png";
import { useEffect, useRef, useState } from "react";

interface NavbarProps {
  onMenuClick?: () => void;
}
type ModalType = "language" | "notification" | "user" | null;

export default function Navbar({ onMenuClick }: NavbarProps) {
  const [openModal, setOpenModal] = useState<ModalType>(null);
  const ref = useRef<HTMLDivElement>(null);
  const [mobileSearch, setMobileSearch] = useState(false);


  const toggle = (type: ModalType) => {
    setOpenModal((prev) => (prev === type ? null : type));
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

  return (

    // <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between mx-6 my-5 px-4 md:px-5 py-3 sticky top-0 z-20 rounded-[10px]">
    <header className="
  h-16 md:h-20
  bg-white border-b border-slate-100
  flex items-center justify-between
  mx-3 my-3 md:mx-6 md:my-5
  px-3 md:px-5
  sticky top-0 z-20 rounded-[10px]
">

      <div className="hidden lg:block cursor-pointer w-[100px] h-[20px] lg:w-[245px] lg:h-[57px] ">
        <Logo />
      </div>
      <div className="flex gap-[29px] w-full md:w-fit  items-center justify-between">
      {/* <div className="flex items-center justify-between w-full gap-3"> */}

        <div className="flex items-center gap-4 flex-1">
          {/* Mobile Menu Toggle */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>

          {/* Search Bar */}
          <div className="hidden sm:flex items-center flex-1 max-w-md relative group w-[300px] xl:w-[500px] ">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-1.5 h-[45px] bg-white border border-[#00000024] rounded-[50px] text-sm font-normal text-black focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
            <button className="absolute right-1.5 top-1 bottom-1 w-9 h-9 flex items-center justify-center bg-[#787BEB] text-white rounded-full hover:bg-blue-700 transition-colors shadow-sm">
              <Search size={18} />
            </button>
          </div>

          {/* Mobile Search Button */}
          <button
            onClick={() => setMobileSearch(true)}
            className="sm:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg"
          >
            <Search size={20} />
          </button>

          {mobileSearch && (
            <div className="fixed  bg-white z-50 p-4">
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  type="text"
                  placeholder="Search..."
                  className="flex-1 h-10 px-4 text-black border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                />
                <button
                  onClick={() => setMobileSearch(false)}
                  className="text-sm text-slate-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => toggle("language")}
            className="hidden md:flex items-center gap-2 text-[#09090B] hover:text-slate-900 transition-colors"
          >
            <Globe size={20} />
            <span className="text-base font-medium text-[#18181A]">
              English (en)
            </span>
            <MdArrowDropDown size={24} className="text-[#000]" />
          </button>

          {openModal === "language" && (
            <div className="absolute top-[60px] right-[180px] bg-white border border-slate-200 rounded-md shadow-md w-[140px]">
              <button className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-100 transition">
                English
              </button>
              <button className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-100 transition">
                বাংলা
              </button>
            </div>
          )}

          <button
            onClick={() => toggle("notification")}
            className="p-2 md:p-2.5 text-slate-500 hover:bg-slate-50 rounded-full relative transition-colors"
          >
            <Bell size={24} color="#09090B" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-[#4153B3] text-white text-[10px] flex items-center justify-center rounded-full ">
              2
            </span>
          </button>
          {openModal === "notification" && (
            <div className="absolute top-[60px] right-[80px] bg-white border rounded-lg shadow-md w-[250px] p-4">
              <p className="text-sm text-slate-600">No new notifications</p>
            </div>
          )}

          <div className="">
            <div
              onClick={() => toggle("user")}
              className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer overflow-hidden"
            >
              {user?.src ? (
                <img
                  src={user.src}
                  alt="user"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={20} />
              )}
            </div>
          </div>
          {openModal === "user" && (
            <div className="absolute top-[60px] right-0 bg-white border rounded-lg shadow-md w-[260px] overflow-hidden">
              {/* User Info */}
              <div className="flex items-center gap-3 px-4 py-3 bg-slate-50">
                <div className="w-12 h-12 rounded-full overflow-hidden border">
                  <img
                    src={user.src}
                    alt="user"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Sahara Islam
                  </p>
                  <p className="text-xs text-slate-500">sahara@email.com</p>
                  <span className="inline-block mt-1 px-2 py-[2px] text-[10px] rounded-full bg-indigo-100 text-indigo-600">
                    Super Admin
                  </span>
                </div>
              </div>

              {/* Menu */}
              {/* User Actions */}
              <div className="py-1">
                <button
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium
                 text-slate-800 hover:bg-slate-100 transition-colors"
                >
                  <User size={16} className="text-slate-500" />
                  Profile
                </button>

                <button
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium
                 text-slate-800 hover:bg-slate-100 transition-colors"
                >
                  <Settings size={16} className="text-slate-500" />
                  Settings
                </button>
              </div>

              {/* Divider */}
              <div className="h-px bg-slate-200" />

              {/* Logout */}
              <button
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
  );
}
