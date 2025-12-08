"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

import AuditlyLogo from "@/components/blocks/auditly-logo";
import NavbarDropdown from "@/components/navbar/navbar-dropdown";

interface NavItem {
    name: string;
    href: string;
    dropdown?: Array<{
        title: string;
        description: string;
        href: string;
        icon?: React.ReactNode;
    }>;
}

const navItems: NavItem[] = [
    { name: "Home", href: "#" },
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "Testimonials", href: "#testimonials" },
];

export default function NavbarV2() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full py-4 flex items-center justify-between sticky top-0 z-50 border-b border-black/5 backdrop-blur-md"
        >
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
                <AuditlyLogo />
            </Link>

            {/* Desktop Navigation - Pill Shape */}
            <div className="hidden md:flex items-center justify-center">
                <div className="flex items-center gap-1">
                    {navItems.map((item) => (
                        item.dropdown ? (
                            <NavbarDropdown
                                key={item.name}
                                label={item.name}
                                href={item.href}
                                items={item.dropdown}
                            />
                        ) : (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="px-5 py-2 text-base font-medium text-[#29272A] hover:text-[#f0803c] transition-colors rounded-full hover:bg-white/5"
                            >
                                {item.name}
                            </Link>
                        )
                    ))}
                </div>
            </div>

            {/* Dashboard Button & Mobile Toggle */}
            <div className="flex items-center gap-4">
                <div className="hidden md:block">
                    <Link 
                        href="/dashboard" 
                        className="px-6 py-2.5 text-sm font-semibold text-gray-900 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-400 hover:scale-105 transition-all duration-200"
                    >
                        Dashboard
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-[#0B0D14] border border-white/10 rounded-2xl p-4 md:hidden flex flex-col gap-2 shadow-2xl overflow-hidden"
                    >
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                            >
                                {item.name}
                            </Link>
                        ))}
                        <div className="h-px bg-white/10 my-2" />
                        <Link
                            href="/dashboard"
                            className="flex items-center justify-center w-full px-4 py-3 text-sm font-bold text-[#121212] bg-white hover:bg-white/90 rounded-xl transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Dashboard
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
