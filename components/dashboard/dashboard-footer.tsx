'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Linkedin, Youtube, Instagram, Twitter, Moon, Sparkles } from 'lucide-react';
import AuditlyLogo from '@/components/blocks/auditly-logo';

export function DashboardFooter() {
    return (
        <footer className="w-full bg-white text-gray-600 py-6 px-6 mt-8 rounded-t-3xl border-t border-gray-100">

            {/* Top Divider with Icons */}
            <div className="flex items-center justify-center gap-8 mb-12 text-gray-300">
                <div className="h-px bg-gray-100 w-full max-w-[200px]" />
                <Moon size={16} strokeWidth={1.5} />
                <Sparkles size={16} strokeWidth={1.5} />
                <Moon size={16} strokeWidth={1.5} className="rotate-180" />
                <div className="h-px bg-gray-100 w-full max-w-[200px]" />
            </div>

            <div className="max-w-7xl mx-auto">
                {/* Top Bar: Logo & Tagline */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6 text-center md:text-left">
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                        <div className="scale-75 origin-left">
                            <AuditlyLogo />
                        </div>
                        <div className="hidden md:block w-px h-8 bg-gray-200" />
                        <span className="text-sm text-gray-500">
                            The future of website auditing © 2025 Auditly360
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">
                        Auditly360 is a complete website audit & analysis platform.
                    </p>
                </div>

                {/* Main Links Section */}
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">

                    {/* Left Column: Contact & Socials */}
                    <div className="flex flex-col gap-8 lg:w-1/4">
                        <a
                            href="mailto:hello@auditly360.com"
                            className="inline-flex items-center gap-3 px-6 py-3 bg-white border border-gray-300 rounded-full text-gray-700 hover:border-[#ff4b01] hover:text-[#ff4b01] transition-colors shadow-sm w-fit"
                        >
                            <Mail size={18} />
                            <span className="font-medium">hello@auditly360.com</span>
                            <span className="text-gray-400">&gt;</span>
                        </a>

                        <div className="flex items-center gap-5 mt-4">
                            <Link href="#" className="p-2 bg-blue-600 text-white rounded hover:opacity-90 transition-opacity">
                                <Linkedin size={20} fill="currentColor" strokeWidth={0} />
                            </Link>
                            <Link href="#" className="p-2 bg-red-600 text-white rounded hover:opacity-90 transition-opacity">
                                <Youtube size={20} fill="currentColor" strokeWidth={0} />
                            </Link>
                            <Link href="#" className="p-2 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white rounded hover:opacity-90 transition-opacity">
                                <Instagram size={20} strokeWidth={2} />
                            </Link>
                            <Link href="#" className="p-2 bg-black text-white rounded hover:opacity-90 transition-opacity">
                                <span className="font-bold text-lg leading-none" style={{ fontFamily: 'sans-serif' }}>X</span>
                            </Link>
                        </div>
                    </div>

                    {/* Right Columns: Links */}
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-8 lg:gap-12">

                        {/* Solutions Column */}
                        <div className="flex flex-col gap-4">
                            <h3 className="font-semibold text-gray-900 mb-2">Solutions</h3>
                            <Link href="#" className="text-sm hover:text-[#ff4b01] transition-colors">Auditly Audit</Link>
                            <Link href="#" className="text-sm hover:text-[#ff4b01] transition-colors">Performance Monitor</Link>
                            <Link href="#" className="text-sm hover:text-[#ff4b01] transition-colors">Enterprise</Link>
                            <Link href="#" className="text-sm hover:text-[#ff4b01] transition-colors">API Access</Link>
                            <Link href="#" className="text-sm hover:text-[#ff4b01] transition-colors">Integrations</Link>
                            <Link href="#" className="text-sm hover:text-[#ff4b01] transition-colors">Pricing</Link>
                            <Link href="#" className="text-sm hover:text-[#ff4b01] transition-colors">Get a demo</Link>
                        </div>

                        {/* Resources Column */}
                        <div className="flex flex-col gap-4">
                            <h3 className="font-semibold text-gray-900 mb-2">Resources</h3>
                            <Link href="#" className="text-sm hover:text-[#ff4b01] transition-colors">Case Studies</Link>
                            <Link href="#" className="text-sm hover:text-[#ff4b01] transition-colors">Blog</Link>
                            <Link href="#" className="text-sm hover:text-[#ff4b01] transition-colors">Knowledge base</Link>
                            <Link href="#" className="text-sm hover:text-[#ff4b01] transition-colors">Support</Link>
                            <Link href="#" className="text-sm hover:text-[#ff4b01] transition-colors">System Status</Link>
                            <Link href="#" className="text-sm hover:text-[#ff4b01] transition-colors">Free SEO Checker</Link>
                            <Link href="#" className="text-sm hover:text-[#ff4b01] transition-colors">Broken Link Checker</Link>
                            <Link href="#" className="text-sm hover:text-[#ff4b01] transition-colors">Tools Directory</Link>
                        </div>

                        {/* Company Column */}
                        <div className="flex flex-col gap-4">
                            <h3 className="font-semibold text-gray-900 mb-2">Company</h3>
                            <Link href="#" className="text-sm hover:text-[#ff4b01] transition-colors">Feature requests</Link>
                            <Link href="#" className="text-sm hover:text-[#ff4b01] transition-colors">Changelog</Link>
                            <Link href="#" className="text-sm hover:text-[#ff4b01] transition-colors">Become an affiliate</Link>
                            <Link href="#" className="text-sm hover:text-[#ff4b01] transition-colors">Terms of service</Link>
                            <Link href="#" className="text-sm hover:text-[#ff4b01] transition-colors">Privacy policy</Link>
                            <Link href="#" className="text-sm hover:text-[#ff4b01] transition-colors">Security</Link>
                            <Link href="#" className="text-sm hover:text-[#ff4b01] transition-colors">Opt out</Link>
                            <Link href="#" className="text-sm hover:text-[#ff4b01] transition-colors">Contact Us</Link>
                        </div>

                    </div>
                </div>

                {/* Bottom Divider */}
                <div className="flex items-center justify-center gap-8 mt-16 mb-8 text-gray-300">
                    <div className="h-px bg-gray-100 w-full max-w-[200px]" />
                    <Moon size={16} strokeWidth={1.5} />
                    <Sparkles size={16} strokeWidth={1.5} />
                    <div className="h-px bg-gray-100 w-full max-w-[200px]" />
                </div>

                {/* Disclaimer */}
                <div className="text-xs text-gray-400 text-center leading-relaxed max-w-4xl mx-auto">
                    Disclaimer: Auditly360 is not affiliated, associated, authorized, endorsed by, or in any way officially connected with Google, Microsoft, or any other third-party platforms mentioned. All product and company names are trademarks™ or registered® trademarks of their respective holders. Use of them does not imply any affiliation with or endorsement by them.
                </div>
            </div>
        </footer>
    );
}
