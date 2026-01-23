"use client";
import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Dribbble,
  Globe,
  Linkedin,
  Youtube,
} from "lucide-react";
import { FooterBackgroundGradient } from "@/components/ui/hover-footer";
import { TextHoverEffect } from "@/components/ui/hover-footer";
import { cn } from "@/lib/utils";

interface FooterProps {
  variant?: "home" | "dashboard";
}

export function Footer({ variant = "home" }: FooterProps) {
  const isDashboard = variant === "dashboard";
  const [isHovered, setIsHovered] = React.useState(false);

  // Footer link data adapted for Auditly360
  const footerLinks = [
    {
      title: "Solutions",
      links: [
        { label: "Auditly Audit", href: "#" },
        { label: "Performance Monitor", href: "#" },
        { label: "AI SEO Analysis", href: "#" },
        { label: "Pricing", href: "/#pricing" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Customers", href: "#" },
        { label: "Blog", href: "/blogs" },
        { label: "FAQs", href: "#" },
        {
          label: "Live Support",
          href: "#",
          pulse: true,
        },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "#" },
        { label: "Terms & Conditions", href: "/terms-condition" },
        { label: "Privacy Policy", href: "/privacy-policy" },
        { label: "Contact Us", href: "/contact" },
      ],
    },
  ];

  // Contact info data
  const contactInfo = [
    {
      icon: <Mail size={18} className="text-[#3ca2fa]" />,
      text: "hello@auditly360.com",
      href: "mailto:hello@auditly360.com",
    },
    {
      icon: <Phone size={18} className="text-[#3ca2fa]" />,
      text: "+1 (555) 123-4567",
      href: "tel:+15551234567",
    },
  ];

  // Social media icons
  const socialLinks = [
    { icon: <Facebook size={20} />, label: "Facebook", href: "#" },
    { icon: <Instagram size={20} />, label: "Instagram", href: "#" },
    { icon: <Twitter size={20} />, label: "Twitter", href: "#" },
    { icon: <Linkedin size={20} />, label: "Linkedin", href: "#" },
    { icon: <Globe size={20} />, label: "Globe", href: "#" },
  ];

  return (
    <footer
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative h-fit -[2.5rem] overflow-hidden m-4 sm:m-8 transition-all duration-700 group border border-transparent",
        isDashboard
          ? "bg-white/80 dark:bg-[#0F0F11]/80 border-gray-100 dark:border-neutral-800"
          : "bg-[#0F0F11]/90 text-neutral-300",
        !isDashboard &&
          isHovered &&
          "border-[#3ca2fa]/30 shadow-[0_0_50px_-12px_rgba(60,162,250,0.3)]",
      )}
    >
      <div className="max-w-7xl mx-auto py-10 px-8 sm:px-14 z-40 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 lg:gap-16 pb-8">
          {/* Brand section */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-[#3ca2fa] text-3xl font-extrabold">
                &hearts;
              </span>
              <span
                className={cn(
                  "text-3xl font-bold",
                  isDashboard
                    ? "text-neutral-900 dark:text-white"
                    : "text-white",
                )}
              >
                Auditly/360
              </span>
            </div>
            <p className="text-sm leading-relaxed opacity-80">
              Transform your website performance with AI-powered audits.
              Optimize SEO, performance, and accessibility in seconds.
            </p>
          </div>

          {/* Footer link sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4
                className={cn(
                  "text-lg font-semibold mb-6",
                  isDashboard
                    ? "text-neutral-900 dark:text-white"
                    : "text-white",
                )}
              >
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label} className="relative group w-fit">
                    <a
                      href={link.href}
                      className="hover:text-[#3ca2fa] transition-colors flex items-center gap-2"
                    >
                      {link.label}
                      {link.pulse && (
                        <span className="w-2 h-2 -full bg-[#3ca2fa] animate-pulse"></span>
                      )}
                    </a>
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#3ca2fa] transition-all duration-300 group-hover:w-full"></span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact section */}
          <div>
            <h4
              className={cn(
                "text-lg font-semibold mb-6",
                isDashboard ? "text-neutral-900 dark:text-white" : "text-white",
              )}
            >
              Contact Us
            </h4>
            <ul className="space-y-4">
              {contactInfo.map((item, i) => (
                <li key={i} className="flex items-center space-x-3 group">
                  <div className="p-2 -lg bg-[#3ca2fa]/10 transition-colors group-hover:bg-[#3ca2fa]/20">
                    {item.icon}
                  </div>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="hover:text-[#3ca2fa] transition-colors text-sm"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span className="text-sm">{item.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="border-t border-neutral-800 dark:border-neutral-800/50 my-6" />

        {/* Footer bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm space-y-4 md:space-y-0">
          {/* Social icons */}
          <div className="flex space-x-6">
            {socialLinks.map(({ icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="text-neutral-500 hover:text-[#3ca2fa] transition-all hover:scale-110"
              >
                {icon}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="flex flex-col items-center md:items-end gap-1">
            <p className="text-neutral-500">
              &copy; {new Date().getFullYear()} Auditly360. All rights reserved.
            </p>
            {!isDashboard && (
              <p className="text-[10px] text-neutral-600 max-w-xs text-center md:text-right">
                Not affiliated with Google or Microsoft. All trademarks belong
                to their respective owners.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Text hover effect - Only for home variant and large screens */}
      {!isDashboard && (
        <div className="lg:flex hidden h-[22rem] -mt-40 -mb-28 pointer-events-none">
          <TextHoverEffect
            text="Auditly360"
            isHovered={isHovered}
            className="z-10 opacity-20 group-hover:opacity-100 transition-opacity duration-700"
          />
        </div>
      )}

      {!isDashboard && <FooterBackgroundGradient />}
    </footer>
  );
}
