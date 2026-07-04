"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BoltIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const navLinks = [
        { name: "How it Works", href: "#how-it-works" },
        { name: "SkillScan", href: "/resume-upload" },
        { name: "Pricing", href: "#pricing" },
    ];

    return (
        <nav
            className="sticky top-0 z-[60] backdrop-blur-xl"
            style={{ backgroundColor: '#0a0a14', borderBottom: '1px solid #1e1e3a' }}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex items-center justify-between h-[72px]">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2.5 group">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center brand-gradient">
                            <BoltIcon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-black tracking-tight">
                            <span className="text-gradient">Joblenso</span>
                            <span style={{ color: '#475569' }}>.ai</span>
                        </span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-semibold transition-colors hover:text-white"
                                style={{ color: pathname === link.href ? '#6366f1' : '#94a3b8' }}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="hidden md:flex items-center space-x-3">
                        <Link
                            href="/login"
                            className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:text-white"
                            style={{ color: '#94a3b8', border: '1px solid #1e1e3a' }}
                        >
                            Login
                        </Link>
                        <Link
                            href="/register"
                            className="px-5 py-2.5 rounded-xl text-sm font-black text-white brand-gradient hover:opacity-90 transition-all glow-brand"
                        >
                            Get Started
                        </Link>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl transition-colors"
                        style={{ backgroundColor: '#0f0f1e', color: '#94a3b8', border: '1px solid #1e1e3a' }}
                    >
                        {isOpen ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div
                    className="md:hidden p-4 space-y-2"
                    style={{ backgroundColor: '#0a0a14', borderTop: '1px solid #1e1e3a' }}
                >
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="block px-4 py-3 rounded-xl text-sm font-semibold transition-colors"
                            style={{ color: '#94a3b8', backgroundColor: pathname === link.href ? '#0f0f1e' : 'transparent' }}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="pt-2 space-y-2">
                        <Link
                            href="/login"
                            onClick={() => setIsOpen(false)}
                            className="block px-4 py-3 rounded-xl text-sm font-semibold text-center"
                            style={{ color: '#94a3b8', border: '1px solid #1e1e3a' }}
                        >
                            Login
                        </Link>
                        <Link
                            href="/register"
                            onClick={() => setIsOpen(false)}
                            className="block px-4 py-3 rounded-xl text-sm font-black text-white text-center brand-gradient"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
