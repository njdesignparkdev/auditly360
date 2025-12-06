'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail } from 'lucide-react';
import AuditlyLogo from '@/components/blocks/auditly-logo';

export function Footer() {
    return (
        <footer className="w-full bg-white text-[#4A4A4A] py-8 mt-0 relative z-50">
            {/* Top Separator Line */}
            <div className="w-full h-px bg-gray-200 mb-8"></div>


            {/* Header Row: Logo | Tagline | Copyright */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="scale-[0.8] origin-left">
                        <AuditlyLogo />
                    </div>
                    <div className="hidden md:block w-px h-6 bg-gray-300" />
                    <span className="text-sm text-gray-400 font-poppins font-semibold">
                        The future of website auditing © 2025 Auditly360
                    </span>
                </div>
                <p className="text-sm text-gray-500 font-poppins font-semibold">
                    From SEO to security, get everything you need to optimize your site
                </p>
            </div>

            {/* Separator Line after Header */}
            <div className="w-full h-px bg-gray-200 mb-8"></div>

            {/* Main Content Areas */}
            <div className="flex flex-col lg:flex-row gap-16 lg:gap-32 mt-16">

                {/* Left: Contact & Social Icons */}
                <div className="flex flex-col gap-8 lg:w-1/4">
                    <a
                        href="mailto:hello@auditly360.com"
                        className="inline-flex items-center gap-3 px-5 py-2.5 bg-white border border-[#FF8B42] rounded-full text-[#EF4600] hover:shadow-md transition-all shadow-sm w-fit group"
                    >
                        <Mail size={18} className="text-[#EF4600]" />
                        <span className="font-medium text-sm bg-[linear-gradient(87.33deg,#FF8B42_3.83%,#EF4600_92.4%)] bg-clip-text text-transparent">hello@auditly360.com</span>
                        <span className="text-[#EF4600] ml-1">&gt;</span>
                    </a>

                    {/* Social Icons - Below Email */}
                    <div className="flex items-center justify-center gap-4">
                        <Link href="#" className="hover:opacity-80 transition-opacity">
                            <Image src="/footer-icons/linkedin.png" alt="LinkedIn" width={40} height={40} />
                        </Link>
                        <Link href="#" className="hover:opacity-80 transition-opacity">
                            <Image src="/footer-icons/facebook (1).png" alt="Facebook" width={40} height={40} />
                        </Link>
                        <Link href="#" className="hover:opacity-80 transition-opacity">
                            <Image src="/footer-icons/instagram.png" alt="Instagram" width={40} height={40} />
                        </Link>
                        <Link href="#" className="hover:opacity-80 transition-opacity">
                            <Image src="/footer-icons/twitter.png" alt="Twitter" width={40} height={40} />
                        </Link>
                    </div>
                </div>

                {/* Right: Link Columns */}
                <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-10 lg:gap-16">

                    <div className="flex flex-col gap-5">
                        <h3 className="font-jakarta font-extrabold text-gray-900">Solutions</h3>
                        <div className="flex flex-col gap-3">
                            {['Auditly Prospect', 'Auditly Monitor', 'Auditly Enterprise', 'API', 'Integrations', 'Pricing', 'Get a demo'].map(item => (
                                <Link key={item} href="#" className="text-[15px] text-gray-500 hover:text-[#ff4b01] transition-colors">{item}</Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-5">
                        <h3 className="font-jakarta font-extrabold text-gray-900">Resources</h3>
                        <div className="flex flex-col gap-3">
                            {['Customers', 'Blog', 'Knowledge base', 'Support', 'Status', 'Free email finder', 'Free email verifier', 'Company directory'].map(item => (
                                <Link key={item} href="#" className="text-[15px] text-gray-500 hover:text-[#ff4b01] transition-colors">{item}</Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-5">
                        <h3 className="font-jakarta font-extrabold text-gray-900">Company</h3>
                        <div className="flex flex-col gap-3">
                            {['Feature requests', 'Changelog', 'Become an affiliate', 'Terms of service', 'Privacy policy', 'Vulnerability disclosure', 'Opt out', 'Do not sell or share my personal information'].map(item => (
                                <Link key={item} href="#" className="text-[15px] text-gray-500 hover:text-[#ff4b01] transition-colors">{item}</Link>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* Disclaimer */}
            <div className="text-[11px] text-gray-400 text-center leading-relaxed max-w-5xl mx-auto opacity-70 mt-8 font-poppins font-medium">
                Disclaimer: Auditly360, Inc is not affiliated, associated, authorized, endorsed by, or in any way officially connected with Microsoft or LinkedIn, or any of their subsidiaries or affiliates. The name LinkedIn, as well as related names, marks, logos, emblems, and images are registered trademarks of their respective owners.
            </div>
        </footer>
    );
}
