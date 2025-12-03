"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";

interface NavColumn {
  title: string;
  links: { label: string; href: string }[];
}

const navColumns: NavColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it Works", href: "#how-it-works" },
      { label: "Pricing", href: "#pricing" },
      { label: "Free Audit", href: "#free-audit" },
    ],
  },
  {
    title: "Support",
    links: [
      // { label: "Help Center", href: "#help" },
      { label: "Contact", href: "/contact" },
      // { label: "Status", href: "#status" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },

    ],
  },
  // {
  //   title: "Company",
  //   links: [
  //     { label: "About", href: "#about" },
  //     { label: "Teams", href: "#teams" },
  //     { label: "Contact", href: "#contact" },
  //   ],
  // },
];

export default function Footer() {
  const { isAuthenticated } = useAuth();

  return (
    <footer className="bg-black text-white">
      <div className="max-w-[90rem] mx-auto px-4 md:px-8 lg:px-12 py-12 md:py-16 lg:py-20">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12 md:mb-16 lg:mb-20 gap-6 lg:gap-8">
          <div className="flex items-center gap-4 md:gap-6">
            <Image
              src="/whitelogo.svg"
              alt="Auditly"
              width={150}
              height={50}
              className="h-8 md:h-10 lg:h-12 w-auto"
            />
            <div className="h-6 w-0.5 bg-gray-600 mx-2"></div>
            <span className="text-sm md:text-base text-gray-400 whitespace-nowrap font-bold">
              Audit Smarter Fix Faster Rank Higher
            </span>
          </div>

          <p className="text-sm md:text-base text-gray-400 text-right">
            From SEO to security, get everything you need to optimize your site
          </p>
        </div>

        {/* Middle Section - Logo and Navigation */}
        <div className="mb-8 md:mb-12 lg:mb-16">
          <div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-16">


            {/* Navigation Columns */}
            <div className="grid grid-cols-3 gap-8 md:gap-12 lg:gap-16 max-w-2xl">
              {navColumns.map((column, index) => (
                <div key={index}>
                  <h3 className="font-bold text-base md:text-lg mb-4 md:mb-5">
                    {column.title}
                  </h3>
                  <ul className="space-y-3 md:space-y-4">
                    {column.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link
                          href={link.href}
                          className="text-sm md:text-base text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Separator Line */}
        <div className="border-t border-gray-700 mb-8 md:mb-12"></div>

        {/* Bottom Section - Social Media and Action Buttons */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-8">
          {/* Social Media Links */}


          {/* Action Buttons */}
          <div className="flex items-center gap-3 md:gap-4">
            <Link
              href={isAuthenticated ? '/dashboard' : '/login'}
              className="bg-white text-black font-semibold px-5 md:px-6 py-2.5 md:py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200 whitespace-nowrap inline-block cursor-pointer"
            >
              Get started
            </Link>

            <Link
              href="/contact"
              className="bg-white text-black font-semibold px-5 md:px-6 py-2.5 md:py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200 whitespace-nowrap inline-block cursor-pointer"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
