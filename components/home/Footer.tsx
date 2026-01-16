"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Linkedin,
  Youtube,
  Instagram,
  Twitter,
  Moon,
  Sparkles,
} from "lucide-react";
import AuditlyLogo from "@/components/ui/auditly-logo";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { cn } from "@/lib/utils";

interface FooterProps {
  variant?: "home" | "dashboard";
}

export function Footer({ variant = "home" }: FooterProps) {
  const isDashboard = variant === "dashboard";

  // Data for the links based on the variant
  const links = {
    solutions: isDashboard
      ? [
          { label: "Auditly Audit", href: "#" },
          { label: "Performance Monitor", href: "#" },
          { label: "Enterprise", href: "#" },
          { label: "API Access", href: "#" },
          { label: "Integrations", href: "#" },
          { label: "Pricing", href: "/#pricing" },
        ]
      : [
          { label: "Auditly Prospect", href: "#" },
          { label: "Pricing", href: "/#pricing" },
        ],
    resources: isDashboard
      ? [
          { label: "Case Studies", href: "#" },
          { label: "Blog", href: "/blogs" },
          { label: "Knowledge base", href: "#" },
          { label: "Support", href: "#" },
          { label: "System Status", href: "#" },
        ]
      : [
          { label: "Customers", href: "#" },
          { label: "Blog", href: "/blogs" },
        ],
    company: isDashboard
      ? [
          { label: "Feature requests", href: "#" },
          { label: "Changelog", href: "#" },
          { label: "Terms & Conditions", href: "/terms-condition" },
          { label: "Privacy policy", href: "/privacy-policy" },
          { label: "Security", href: "#" },
        ]
      : [
          { label: "Terms & Conditions", href: "/terms-condition" },
          { label: "Privacy policy", href: "/privacy-policy" },
        ],
  };

  return (
    <footer
      className={cn(
        "w-full py-12 relative overflow-hidden z-10",
        isDashboard
          ? "bg-white text-gray-600 border-t border-gray-100 rounded-t-3xl mt-8 px-6"
          : "bg-slate-950 text-slate-300 px-4 sm:px-6 lg:px-8 mt-0"
      )}
    >
      {/* Background Atmosphere - Home Variant Only */}
      {!isDashboard && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-50" />
        </div>
      )}

      {/* Decorative Top Divider - Dashboard Variant Only */}
      {isDashboard && (
        <div className="flex items-center justify-center gap-8 mb-12 text-gray-300">
          <div className="h-px bg-gray-100 w-full max-w-[200px]" />
          <Moon size={16} strokeWidth={1.5} />
          <Sparkles size={16} strokeWidth={1.5} />
          <Moon size={16} strokeWidth={1.5} className="rotate-180" />
          <div className="h-px bg-gray-100 w-full max-w-[200px]" />
        </div>
      )}

      {/* Bottom Large Title - Background Layer (Home Only) */}
      {!isDashboard && (
        <AnimatedGroup
          className="absolute bottom-0 left-0 w-full text-center select-none pointer-events-none overflow-hidden leading-none z-0"
          variants={{
            container: { visible: { transition: { staggerChildren: 0.1 } } },
            item: {
              hidden: { opacity: 0, y: 50 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 1.5, ease: "easeOut" },
              },
            },
          }}
        >
          <h1 className="text-[13vw] font-bold text-white tracking-tight opacity-[0.03] font-jakarta translate-y-[10%]">
            Auditly360
          </h1>
        </AnimatedGroup>
      )}

      <AnimatedGroup
        className="relative z-10 max-w-7xl mx-auto"
        variants={{
          container: {
            visible: {
              transition: {
                staggerChildren: 0.05,
                delayChildren: 0.2,
              },
            },
          },
          item: {
            hidden: { opacity: 0, filter: "blur(12px)", y: 12 },
            visible: {
              opacity: 1,
              filter: "blur(0px)",
              y: 0,
              transition: { type: "spring", bounce: 0.3, duration: 1.5 },
            },
          },
        }}
      >
        {/* Top Separator Line */}
        {!isDashboard && <div className="w-full h-px bg-white/10 mb-2"></div>}

        {/* Header Row: Logo | Tagline | Copyright */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-2 gap-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div
              className={cn(
                "scale-[0.8] origin-left",
                !isDashboard && "invert brightness-0 filter"
              )}
            >
              <AuditlyLogo />
            </div>
            <div
              className={cn(
                "hidden md:block w-px h-6",
                isDashboard ? "bg-gray-200" : "bg-white/20"
              )}
            />
            <span
              className={cn(
                "text-sm font-poppins font-semibold",
                isDashboard ? "text-gray-500" : "text-slate-400"
              )}
            >
              The future of website auditing © 2025 Auditly360
            </span>
          </div>
          <p
            className={cn(
              "text-sm font-poppins font-semibold",
              isDashboard ? "text-gray-500" : "text-slate-500"
            )}
          >
            {isDashboard
              ? "Auditly360 is a complete website audit & analysis platform."
              : "From SEO to security, get everything you need to optimize your site"}
          </p>
        </div>

        {/* Separator Line after Header */}
        {!isDashboard && <div className="w-full h-px bg-white/10 mb-8"></div>}

        {/* Main Content Areas */}
        <div className="flex flex-col justify-between lg:flex-row gap-16 lg:gap-32">
          {/* Left: Contact & Social Icons */}
          <div className="flex flex-col gap-4 lg:w-1/4">
            <a
              href="mailto:hello@auditly360.com"
              className={cn(
                "inline-flex items-center gap-3 px-5 py-2.5 border transition-all duration-300 shadow-sm w-fit group",
                isDashboard
                  ? "bg-white border-gray-300 rounded-full text-gray-700 hover:border-[#ff4b01] hover:text-[#ff4b01]"
                  : "bg-white/5 border-white/10 text-slate-200 hover:border-[#EF4600] hover:shadow-[0_4px_15px_rgba(255,139,66,0.25)] hover:scale-105 active:scale-95"
              )}
            >
              <Mail
                size={18}
                className={cn(
                  "transition-all duration-300 ease-out",
                  !isDashboard &&
                    "group-hover:text-[#EF4600] group-hover:rotate-12"
                )}
              />
              <span className="font-medium text-sm">hello@auditly360.com</span>
              <span
                className={cn(
                  "ml-1 transition-all duration-300",
                  !isDashboard &&
                    "group-hover:text-[#EF4600] group-hover:translate-x-1"
                )}
              >
                &gt;
              </span>
            </a>

            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-4">
              {isDashboard ? (
                <>
                  <Link
                    href="#"
                    className="p-2 bg-blue-600 text-white rounded hover:opacity-90 transition-opacity"
                  >
                    <Linkedin size={20} fill="currentColor" strokeWidth={0} />
                  </Link>
                  <Link
                    href="#"
                    className="p-2 bg-red-600 text-white rounded hover:opacity-90 transition-opacity"
                  >
                    <Youtube size={20} fill="currentColor" strokeWidth={0} />
                  </Link>
                  <Link
                    href="#"
                    className="p-2 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white rounded hover:opacity-90 transition-opacity"
                  >
                    <Instagram size={20} strokeWidth={2} />
                  </Link>
                  <Link
                    href="#"
                    className="p-2 bg-black text-white rounded hover:opacity-90 transition-opacity"
                  >
                    <span
                      className="font-bold text-lg leading-none"
                      style={{ fontFamily: "sans-serif" }}
                    >
                      X
                    </span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="#"
                    className="hover:opacity-80 transition-opacity"
                  >
                    <Image
                      src="/footer-icons/linkdn (1).svg"
                      alt="LinkedIn"
                      width={30}
                      height={30}
                      className="hover:scale-105 transition-transform"
                    />
                  </Link>
                  <Link
                    href="#"
                    className="hover:opacity-80 transition-opacity"
                  >
                    <Image
                      src="/footer-icons/Frame 8.svg"
                      alt="Facebook"
                      width={30}
                      height={30}
                      className="hover:scale-105 transition-transform"
                    />
                  </Link>
                  <Link
                    href="#"
                    className="hover:opacity-80 transition-opacity"
                  >
                    <Image
                      src="/footer-icons/Instagram.svg"
                      alt="Instagram"
                      width={30}
                      height={30}
                      className="hover:scale-105 transition-transform"
                    />
                  </Link>
                  <Link
                    href="#"
                    className="hover:opacity-80 transition-opacity"
                  >
                    <Image
                      src="/footer-icons/Twitter.svg"
                      alt="X (Twitter)"
                      width={30}
                      height={30}
                      className="hover:scale-105 transition-transform"
                    />
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right: Link Columns */}
          <div className="flex grid-cols-3 gap-8">
            <div className="flex flex-col gap-5">
              <h3
                className={cn(
                  "font-jakarta font-extrabold",
                  isDashboard ? "text-gray-900" : "text-white"
                )}
              >
                Solutions
              </h3>
              <div className="flex flex-col gap-3">
                {links.solutions.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "text-sm transition-colors",
                      isDashboard
                        ? "hover:text-[#ff4b01]"
                        : "text-slate-400 hover:text-[#ff4b01]"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <h3
                className={cn(
                  "font-jakarta font-extrabold",
                  isDashboard ? "text-gray-900" : "text-white"
                )}
              >
                Resources
              </h3>
              <div className="flex flex-col gap-3">
                {links.resources.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "text-sm transition-colors",
                      isDashboard
                        ? "hover:text-[#ff4b01]"
                        : "text-slate-400 hover:text-[#ff4b01]"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <h3
                className={cn(
                  "font-jakarta font-extrabold",
                  isDashboard ? "text-gray-900" : "text-white"
                )}
              >
                Company
              </h3>
              <div className="flex flex-col gap-3">
                {links.company.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "text-sm transition-colors",
                      isDashboard
                        ? "hover:text-[#ff4b01]"
                        : "text-slate-400 hover:text-[#ff4b01]"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer & Divider */}
        {isDashboard && (
          <div className="flex items-center justify-center gap-8 mt-16 mb-8 text-gray-300">
            <div className="h-px bg-gray-100 w-full max-w-[200px]" />
            <Moon size={16} strokeWidth={1.5} />
            <Sparkles size={16} strokeWidth={1.5} />
            <div className="h-px bg-gray-100 w-full max-w-[200px]" />
          </div>
        )}

        <div
          className={cn(
            "text-center leading-relaxed max-w-5xl mx-auto opacity-70 mt-8 font-poppins font-medium",
            isDashboard ? "text-xs text-gray-400" : "text-[11px] text-slate-600"
          )}
        >
          Disclaimer: Auditly360, Inc is not affiliated, associated, authorized,
          endorsed by, or in any way officially connected with Microsoft,
          Google, or any of their subsidiaries or affiliates. The names and
          logos are registered trademarks of their respective owners.
        </div>
      </AnimatedGroup>
    </footer>
  );
}
