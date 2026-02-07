"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    FileText,
    Calendar,
    UserCheck,
    Shapes,
    UserPlus,
    CreditCard,
    History,
    Wallet,
    Globe,
    MonitorCheck,
    ChevronDown,
} from "lucide-react";
import { useState, useEffect } from "react";
import user from "@/app/assets/user1.png";


interface SidebarProps {
    role: "super-admin" | "sub-admin";
    isOpen?: boolean;
    onClose?: () => void;
}

interface MenuItem {
    title: string;
    href: string;
    icon: any;
    badge?: string;
    children?: MenuItem[];
}

interface MenuSection {
    title: string;
    items: MenuItem[];
}
const SUB_ADMIN_MENU: MenuSection[] = [
    {
        title: "Main",
        items: [
            { title: "Dashboard", href: "/sub-dashboard", icon: LayoutDashboard },
        ]
    },
    {
        title: "Booking Management",
        items: [
            {
                title: "Bookings",
                href: "/sub-dashboard/bookings",
                icon: Calendar,
                children: [
                    { title: "Booking Requests", href: "/sub-dashboard/bookings/requests", icon: FileText, badge: "88" }
                ]
            },
        ]
    },
    {
        title: "Provider Management",
        items: [
            {
                title: "Providers",
                href: "/sub-dashboard/providers",
                icon: Users,
                children: [
                    { title: "Provider list", href: "/sub-dashboard/providers", icon: Users },
                    { title: "Add New Provider", href: "/sub-dashboard/providers/add", icon: UserPlus },
                ]
            },
            { title: "Background check", href: "/sub-dashboard/background-check", icon: UserCheck },
        ]
    },
    {
        title: "Service Management",
        items: [
            {
                title: "Categories",
                href: "/sub-dashboard/categories",
                icon: Shapes,
                children: [
                    { title: "Category Setup", href: "/sub-dashboard/categories", icon: Shapes },
                    // { title: "Sub Category Setup", href: "/sub-categories", icon: Shapes },
                ]
            },
        ]
    },
    {
        title: "User Management",
        items: [
            { title: "Users", href: "/sub-dashboard/users", icon: UserPlus },
        ]
    },
    {
        title: "Business Management",
        items: [
            { title: "Subscription", href: "/sub-dashboard/subscription", icon: CreditCard },
            { title: "Transaction", href: "/sub-dashboard/transactions", icon: History },
        ]
    },
   
];

const SUPER_ADMIN_MENU: MenuSection[] = [
    {
        title: "Main",
        items: [
            { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        ]
    },
    {
        title: "Booking Management",
        items: [
            {
                title: "Bookings",
                href: "/bookings",
                icon: Calendar,
                children: [
                    { title: "Booking Requests", href: "/bookings/requests", icon: FileText, badge: "88" }
                ]
            },
        ]
    },
    {
        title: "Provider Management",
        items: [
            {
                title: "Provider list",
                href: "/providers",
                icon: Users,
                children: [
                    { title: "Provider list", href: "/providers", icon: Users },
                    { title: "Add New Provider", href: "/providers/add", icon: UserPlus },
                ]
            },
            { title: "Background check", href: "/background-check", icon: UserCheck },
        ]
    },
    {
        title: "Service Management",
        items: [
            {
                title: "Categories",
                href: "/categories",
                icon: Shapes,
                children: [
                    { title: "Category Setup", href: "/categories", icon: Shapes },
                    // { title: "Sub Category Setup", href: "/sub-categories", icon: Shapes },
                ]
            },
        ]
    },
    {
        title: "User Management",
        items: [
            { title: "Users", href: "/users", icon: UserPlus },
        ]
    },
    {
        title: "Business Management",
        items: [
            { title: "Subscription", href: "/subscription", icon: CreditCard },
            { title: "Transaction", href: "/transactions", icon: History },
            { title: "Withdrawals", href: "/transactions/withdrawals", icon: Wallet, badge: "2" },
        ]
    },
    {
        title: "Marketing",
        items: [
            { title: "Marketing Tool", href: "/marketing", icon: Globe },
        ]
    },
    {
        title: "Admin Management",
        items: [
            // { title: "System Settings", href: "/settings", icon: Settings },
            { title: "Sub-Admin Management", href: "/sub-admin", icon: MonitorCheck },
        ]
    }
];

export default function Sidebar({ role, isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    

    const toggleExpand = (title: string) => {
        setExpandedItems(prev =>
            prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
        );
    };

    // Close sidebar on route change on mobile
    useEffect(() => {
        if (onClose) onClose();
    }, [pathname]);

    const sections = role === "super-admin" ? SUPER_ADMIN_MENU : SUB_ADMIN_MENU;

    return (
        <aside className={`fixed lg:sticky top-0 left-0 bottom-0 z-40 w-[280px] bg-white  flex flex-col transition-transform duration-300 transform ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} border-r border-[#F1F5F9] mb-6`}>
            {/* User Profile Card */}
            <div className="px-6 pt-8 pb-4 ">
                <div className="bg-[#F8FAFC] rounded-xl p-4 flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                            <img src={user.src} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#22C55E] border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[12px] text-slate-500 truncate">admin@admin.com</p>
                        <p className="text-[14px] font-semibold text-slate-900 truncate capitalize">{role}</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar">
                {sections.map((section) => (
                    <div key={section.title} className="mb-6 last:mb-0">
                        <h3 className="px-3 text-sm font-bold text-slate-900  tracking-tight mb-2">
                            {section.title}
                        </h3>
                        <ul className="space-y-1">
                            {section.items.map((item) => (
                                <li key={item.title}>
                                    <div className="group">
                                        {item.children ? (
                                            <button
                                                onClick={() => toggleExpand(item.title)}
                                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${pathname.startsWith(item.href)
                                                    ? "bg-[#EEF2FF] text-[#4F46E5]"
                                                    : "text-slate-600 hover:bg-slate-50"
                                                    }`}
                                            >
                                                <item.icon size={20} className={pathname.startsWith(item.href) ? "text-[#4F46E5]" : "text-slate-500"} />
                                                <span className="text-[14px] font-semibold flex-1 text-left">{item.title}</span>
                                                <ChevronDown size={16} className={`transition-transform duration-500 ${expandedItems.includes(item.title) ? "rotate-180 " : ""}`} />
                                            </button>
                                        ) : (
                                            <Link
                                                href={item.href}
                                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${pathname === item.href
                                                    ? "bg-[#EEF2FF] text-[#4F46E5]"
                                                    : "text-slate-600 hover:bg-slate-50"
                                                    }`}
                                            >
                                                <item.icon size={20} className={pathname === item.href ? "text-[#4F46E5]" : "text-slate-500"} />
                                                <span className="text-[14px] font-semibold flex-1 text-left">{item.title}</span>
                                                {item.badge && (
                                                    <span className={`text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold min-w-[20px] text-center ${item.badge === "2" ? "bg-[#EF4444]" : "bg-[#4F46E5]"}`}>
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </Link>
                                        )}

                                        {item.children && expandedItems.includes(item.title) && (
                                            <ul className="mt-1 space-y-1">
                                                {item.children.map(child => (
                                                    <li key={child.title}>
                                                        <Link
                                                            href={child.href}
                                                            className={`flex items-center justify-between pl-11 pr-3 py-2 rounded-lg text-[13px] transition-all ${pathname === child.href
                                                                ? "text-[#4F46E5] font-semibold"
                                                                : "text-slate-500 hover:text-slate-900"
                                                                }`}
                                                        >
                                                            <span>{child.title}</span>
                                                            {child.badge && (
                                                                <span className="bg-[#4153B3] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold min-w-[20px] text-center">
                                                                    {child.badge}
                                                                </span>
                                                            )}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </nav>
        </aside>
    );
}
