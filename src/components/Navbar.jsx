"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BriefcaseIcon,
    HomeIcon,
    DocumentTextIcon,
    TableCellsIcon,
    UserCircleIcon,
    Bars3Icon,
    XMarkIcon
} from "@heroicons/react/24/outline";
import { useState } from "react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const navigation = [
        { name: "Home", href: "/", icon: HomeIcon },
        { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
        { name: "Jobs", href: "/jobs", icon: BriefcaseIcon },
        { name: "Applications", href: "/applications", icon: TableCellsIcon },
        { name: "Resume", href: "/resume-upload", icon: DocumentTextIcon },
    ];

    return (
        <nav className="sticky top-0 z-[60] bg-white/70 backdrop-blur-xl border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-3 group">
                            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:rotate-6 transition-transform">
                                <BriefcaseIcon className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                                ApplyMate<span className="text-blue-600">.ai</span>
                            </span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`text-sm font-semibold transition-all hover:text-blue-600 relative py-1 ${isActive ? "text-blue-600" : "text-slate-500"
                                        }`}
                                >
                                    {item.name}
                                    {isActive && (
                                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
                                    )}
                                </Link>
                            );
                        })}
                        <Link
                            href="/register"
                            className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-600/20 transition-all active:scale-95"
                        >
                            Get Started
                        </Link>
                    </div>

                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-500 hover:text-blue-600 transition-colors"
                        >
                            {isOpen ? (
                                <XMarkIcon className="w-6 h-6" />
                            ) : (
                                <Bars3Icon className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden absolute top-20 left-0 w-full bg-white/95 backdrop-blur-xl border-b border-slate-100 p-6 space-y-3 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={`block px-4 py-3 rounded-xl text-sm font-semibold ${pathname === item.href
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-slate-600 hover:bg-slate-50"
                                }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                    <Link
                        href="/register"
                        onClick={() => setIsOpen(false)}
                        className="w-full py-3.5 rounded-xl bg-blue-600 text-white text-center text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all block active:scale-[0.98]"
                    >
                        Get Started
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
