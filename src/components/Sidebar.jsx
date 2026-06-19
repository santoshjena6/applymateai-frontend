"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    HomeIcon,
    BriefcaseIcon,
    TableCellsIcon,
    DocumentTextIcon,
    UserCircleIcon,
    Cog6ToothIcon,
    ArrowLeftOnRectangleIcon,
    PaperAirplaneIcon
} from "@heroicons/react/24/outline";

const Sidebar = () => {
    const pathname = usePathname();

    const navigation = [
        { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
        { name: "Jobs", href: "/jobs", icon: BriefcaseIcon },
        { name: "Applications", href: "/applications", icon: TableCellsIcon },
        { name: "Resume", href: "/resume-upload", icon: DocumentTextIcon },
        { name: "Email Automation", href: "/email-automation", icon: PaperAirplaneIcon },
    ];

    const secondaryNavigation = [
        { name: "Profile", href: "/profile", icon: UserCircleIcon },
        { name: "Settings", href: "/settings", icon: Cog6ToothIcon },
    ];

    return (
        <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-slate-100 bg-white/80 backdrop-blur-xl z-50">
            <div className="flex items-center h-20 px-8">
                <Link href="/" className="flex items-center space-x-3">
                    <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 rotate-3 group-hover:rotate-0 transition-transform">
                        <BriefcaseIcon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900">
                        ApplyMate<span className="text-blue-600">.ai</span>
                    </span>
                </Link>
            </div>

            <div className="flex-1 flex flex-col justify-between overflow-y-auto px-4 py-6">
                <nav className="space-y-1.5">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                                        ? "bg-blue-600 text-white shadow-xl shadow-blue-600/15"
                                        : "text-slate-500 hover:text-blue-600 hover:bg-blue-50/50"
                                    }`}
                            >
                                <item.icon className={`mr-3 w-5 h-5 transition-colors ${isActive ? "text-white" : "text-slate-400 group-hover:text-blue-600"
                                    }`} />
                                <span className="text-sm font-semibold tracking-tight">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="pt-6 border-t border-slate-50 space-y-4">
                    <div>
                        <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 opacity-60">
                            Management
                        </p>
                        <div className="space-y-1">
                            {secondaryNavigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center px-4 py-2.5 text-sm font-semibold text-slate-500 rounded-xl hover:text-blue-600 hover:bg-blue-50/50 transition-all group"
                                >
                                    <item.icon className="mr-3 w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <button className="flex items-center w-full px-4 py-3 text-sm font-semibold text-rose-500 rounded-xl hover:bg-rose-50 transition-all group">
                        <ArrowLeftOnRectangleIcon className="mr-3 w-5 h-5 text-rose-400 group-hover:text-rose-600 transition-colors" />
                        Logout
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
