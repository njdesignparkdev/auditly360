'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail } from 'lucide-react';
import AuditlyLogo from '@/components/blocks/auditly-logo';

export function Footer() {
    return (
        <footer className="w-full text-slate-300 py-16 mt-0 relative overflow-hidden bg-slate-950 z-10">
            {/* Background Grid */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                 <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            </div>

            <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Top Separator Line */}
                <div className="w-full h-px bg-white/10 mb-8"></div>


                {/* Header Row: Logo | Tagline | Copyright */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="scale-[0.8] origin-left invert brightness-0 filter">
                            <AuditlyLogo />
                        </div>
                        <div className="hidden md:block w-px h-6 bg-white/20" />
                        <span className="text-sm text-slate-400 font-poppins font-semibold">
                            The future of website auditing © 2025 Auditly360
                        </span>
                    </div>
                    <p className="text-sm text-slate-500 font-poppins font-semibold">
                        From SEO to security, get everything you need to optimize your site
                    </p>
                </div>

                {/* Separator Line after Header */}
                <div className="w-full h-px bg-white/10 mb-8"></div>

                {/* Main Content Areas */}
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-32 mt-16">

                    {/* Left: Contact & Social Icons */}
                    <div className="flex flex-col gap-8 lg:w-1/4">
                        <a
                            href="mailto:hello@auditly360.com"
                            className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full text-slate-200 hover:border-[#EF4600] hover:shadow-[0_4px_15px_rgba(255,139,66,0.25)] hover:scale-105 active:scale-95 transition-all duration-300 shadow-sm w-fit group"
                        >
                            <Mail size={18} className="text-slate-200 group-hover:text-[#EF4600] group-hover:rotate-12 transition-all duration-300 ease-out" />
                            <span className="font-medium text-sm text-slate-200 group-hover:text-[#EF4600] relative transition-colors duration-300">hello@auditly360.com</span>
                            <span className="text-slate-200 group-hover:text-[#EF4600] ml-1 group-hover:translate-x-1 transition-all duration-300">&gt;</span>
                        </a>

                        {/* Social Icons - Below Email */}
                        <div className="flex items-center justify-center gap-4">
                            <Link href="#" className="hover:opacity-80 transition-opacity">
                                <Image src="/footer-icons/linkedin.png" alt="LinkedIn" width={40} height={40} className="hover:scale-105 transition-transform" />
                            </Link>
                            <Link href="#" className="hover:opacity-80 transition-opacity">
                                <Image src="/footer-icons/facebook (1).png" alt="Facebook" width={40} height={40} className="hover:scale-105 transition-transform" />
                            </Link>
                            <Link href="#" className="hover:opacity-80 transition-opacity">
                                <Image src="/footer-icons/instagram.png" alt="Instagram" width={40} height={40} className="hover:scale-105 transition-transform" />
                            </Link>
                            <Link href="#" className="hover:opacity-80 transition-opacity">
                                <Image src="/footer-icons/Frame 2 (1) (1).png" alt="X (Twitter)" width={40} height={40} className="hover:scale-105 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    {/* Right: Link Columns */}
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-10 lg:gap-16">

                        <div className="flex flex-col gap-5">
                            <h3 className="font-jakarta font-extrabold text-white">Solutions</h3>
                            <div className="flex flex-col gap-3">
                                {['Auditly Prospect', 'Auditly Monitor', 'Auditly Enterprise', 'API', 'Integrations', 'Pricing', 'Get a demo'].map(item => (
                                    <Link key={item} href="#" className="text-[15px] text-slate-400 hover:text-[#ff4b01] transition-colors">{item}</Link>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-5">
                            <h3 className="font-jakarta font-extrabold text-white">Resources</h3>
                            <div className="flex flex-col gap-3">
                                {['Customers', 'Blog', 'Knowledge base', 'Support', 'Status', 'Free email finder', 'Free email verifier', 'Company directory'].map(item => (
                                    <Link key={item} href="#" className="text-[15px] text-slate-400 hover:text-[#ff4b01] transition-colors">{item}</Link>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-5">
                            <h3 className="font-jakarta font-extrabold text-white">Company</h3>
                            <div className="flex flex-col gap-3">
                                {['Feature requests', 'Changelog', 'Become an affiliate', 'Terms of service', 'Privacy policy', 'Vulnerability disclosure', 'Opt out', 'Do not sell or share my personal information'].map(item => (
                                    <Link key={item} href="#" className="text-[15px] text-slate-400 hover:text-[#ff4b01] transition-colors">{item}</Link>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

                {/* Disclaimer */}
                <div className="text-[11px] text-slate-600 text-center leading-relaxed max-w-5xl mx-auto opacity-70 mt-8 font-poppins font-medium">
                    Disclaimer: Auditly360, Inc is not affiliated, associated, authorized, endorsed by, or in any way officially connected with Microsoft or LinkedIn, or any of their subsidiaries or affiliates. The name LinkedIn, as well as related names, marks, logos, emblems, and images are registered trademarks of their respective owners.
                </div>
            </div>
        </footer>
    );
}
