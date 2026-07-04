"use client";

// Sidebar — white, fixed left panel with nav links and logout
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    HomeIcon,
    BriefcaseIcon,
    TableCellsIcon,
    DocumentTextIcon,
    UserCircleIcon,
    Cog6ToothIcon,
    ArrowLeftOnRectangleIcon,
    SparklesIcon,
} from "@heroicons/react/24/outline";

// Primary navigation links
const navigation = [
    { name: "Dashboard",    href: "/dashboard",      icon: HomeIcon          },
    { name: "Browse Jobs",  href: "/jobs",           icon: BriefcaseIcon     },
    { name: "My Resume",    href: "/resume-upload",  icon: DocumentTextIcon  },
    { name: "Applications", href: "/applications",   icon: TableCellsIcon    },
    { name: "Profile",      href: "/profile",        icon: UserCircleIcon    },
    { name: "Pricing Plans",href: "/pricing",        icon: SparklesIcon      },
];

const Sidebar = () => {
    const pathname = usePathname();
    const router   = useRouter();

    // Logout — clear auth keys and send user to login
    const handleLogout = () => {
        localStorage.removeItem("applync_token");
        localStorage.removeItem("applync_user");
        router.push("/login");
    };

    return (
        <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 z-50 bg-surface border-r border-border-color shadow-sm">
            {/* Logo */}
            <div className="flex items-center h-16 px-6 border-b border-border-color">
                <Link href="/" className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center brand-gradient">
                        <span className="text-white text-xs font-bold">A</span>
                    </div>
                    <span className="text-lg font-bold tracking-tight text-primary">Joblenso</span>
                </Link>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
                {navigation.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                                isActive 
                                    ? "bg-primary/10 text-primary" 
                                    : "text-text-secondary hover:bg-gray-50 hover:text-text-primary"
                            }`}
                        >
                            <item.icon
                                className={`mr-3 w-5 h-5 shrink-0 transition-colors ${
                                    isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-500"
                                }`}
                            />
                            {item.name}
                            {/* Active indicator dot */}
                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom section — settings + logout */}
            <div className="px-4 pb-6 pt-4 space-y-2 border-t border-border-color">
                <Link
                    href="/settings"
                    className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-text-primary transition-all"
                >
                    <Cog6ToothIcon className="mr-3 w-5 h-5 text-gray-400" />
                    Settings
                </Link>
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all mt-4"
                >
                    <div className="mr-3 w-8 h-8 rounded-full bg-[#333333] flex items-center justify-center text-white font-medium text-sm">
                        N
                    </div>
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
