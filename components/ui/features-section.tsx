'use client';

import React from "react";
import { Code, ShoppingBag, FileText, Briefcase, GraduationCap, Scale } from "lucide-react";

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            {/* Icon */}
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.iconBgColor} ${feature.iconColor} mb-5`}>
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
      </div>
    </div>
  );
}
