"use client";

import React from "react";
import {
  Code,
  ShoppingBag,
  FileText,
  Briefcase,
  GraduationCap,
  Scale,
} from "lucide-react";
import { AnimatedGroup } from "@/components/ui/animated-group";

type FeatureCard = {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
};

export function FeaturesSection() {
  const features: FeatureCard[] = [
    {
      title: "SaaS Startups",
      description:
        "Protect your unique UI/UX, landing page copy, and pricing models from being cloned by copycat competitors.",
      icon: <Code className="w-5 h-5" />,
      iconBgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "E-commerce Brands",
      description:
        "Identify fake stores and scam sites using your product photos and descriptions to defraud customers.",
      icon: <ShoppingBag className="w-5 h-5" />,
      iconBgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Bloggers & Publishers",
      description:
        "Recover lost SEO traffic by instantly finding and reporting scraper sites that republish your articles.",
      icon: <FileText className="w-5 h-5" />,
      iconBgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Digital Agencies",
      description:
        "Guarantee design exclusivity to your clients by actively monitoring their custom assets for unauthorized use.",
      icon: <Briefcase className="w-5 h-5" />,
      iconBgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      title: "Course Creators",
      description:
        "Track down leaked course materials and sales page clones that dilute your brand and steal revenue.",
      icon: <GraduationCap className="w-5 h-5" />,
      iconBgColor: "bg-pink-50",
      iconColor: "text-pink-600",
    },
    {
      title: "Legal Professionals",
      description:
        "Automate the evidence gathering process with instant, date-stamped reports to speed up DMCA takedowns.",
      icon: <Scale className="w-5 h-5" />,
      iconBgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
  ];

  return (
    <div className="w-full">
      <div className="relative z-10 w-full bg-white/90 backdrop-blur-sm -xl shadow-2xl overflow-hidden border border-white/20 p-8 md:p-12">
        <div className="sm:mx-auto lg:mr-auto text-left mb-6 sm:mb-8 px-4 sm:px-6 lg:px-8">
          <div className="space-y-2 sm:space-y-3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-gray-900 font-jakarta">
              Features & Use Cases
            </h2>
            <p className="text-gray-600 text-sm sm:text-base font-poppins max-w-2xl">
              Tailored solutions for every member of your team.
            </p>
          </div>
        </div>

        <AnimatedGroup
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-6 lg:px-8"
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
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white/60 backdrop-blur-md -2xl p-8 border border-gray-100/30 transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 active:!border-white focus:!border-white shadow-sm hover:shadow-md outline-none focus:outline-none select-none cursor-pointer h-full"
            >
              {/* Icon */}
              <div
                className={`inline-flex items-center justify-center w-12 h-12 -none ${feature.iconBgColor} ${feature.iconColor} mb-5`}
              >
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-gray-900 mb-3 font-jakarta">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed font-poppins">
                {feature.description}
              </p>
            </div>
          ))}
        </AnimatedGroup>
      </div>
    </div>
  );
}
