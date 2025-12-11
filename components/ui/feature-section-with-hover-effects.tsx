'use client';

import React from "react";
import { cn } from "@/lib/utils";
import {
  IconCode,
  IconShoppingBag,
  IconFileText,
  IconBriefcase,
  IconSchool,
  IconScale,
} from "@tabler/icons-react";

type FeatureItem = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

export function FeaturesSectionWithHoverEffects() {
  const features: FeatureItem[] = [
    {
      title: "SaaS Startups",
      description:
        "Protect your unique UI/UX, landing page copy, and pricing models from copycat competitors.",
      icon: <IconCode />,
    },
    {
      title: "E-commerce Brands",
      description:
        "Identify fake stores and scam sites using your product photos and descriptions to defraud customers.",
      icon: <IconShoppingBag />,
    },
    {
      title: "Bloggers & Publishers",
      description:
        "Recover lost SEO traffic by reporting scraper sites that republish your articles.",
      icon: <IconFileText />,
    },
    {
      title: "Digital Agencies",
      description:
        "Guarantee design exclusivity for clients by monitoring and acting on copied assets.",
      icon: <IconBriefcase />,
    },
    {
      title: "Course Creators",
      description:
        "Track down leaked course materials and cloned sales pages before they impact revenue.",
      icon: <IconSchool />,
    },
    {
      title: "Legal Professionals",
      description:
        "Automate evidence gathering with date-stamped captures to streamline takedown actions.",
      icon: <IconScale />,
    },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 relative z-10">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({ title, description, icon, index }: FeatureItem & { index: number }) => {
  return (
    <div
      className={cn(
        "flex flex-col py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 1 || index === 3 || index === 4) && "lg:border-r dark:border-neutral-800",
        index < 3 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 3 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 3 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-[#ff6606] transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};

