'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Code2, ShoppingBag, FileText, Briefcase, GraduationCap, Scale } from 'lucide-react';

const useCases = [
    {
        icon: Code2,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        title: 'SaaS Startups',
        description: 'Protect your unique UI/UX, landing page copy, and pricing models from being cloned by copycat competitors.'
    },
    {
        icon: ShoppingBag,
        color: 'text-green-600',
        bg: 'bg-green-50',
        title: 'E-commerce Brands',
        description: "Identify fake stores and scam sites using your product photos and descriptions to defraud customers."
    },
    {
        icon: FileText,
        color: 'text-purple-600',
        bg: 'bg-purple-50',
        title: 'Bloggers & Publishers',
        description: 'Recover lost SEO traffic by instantly finding and reporting scraper sites that republish your articles.'
    },
    {
        icon: Briefcase,
        color: 'text-orange-600',
        bg: 'bg-orange-50',
        title: 'Digital Agencies',
        description: 'Guarantee design exclusivity to your clients by actively monitoring their custom web assets for unauthorized use.'
    },
    {
        icon: GraduationCap,
        color: 'text-pink-600',
        bg: 'bg-pink-50',
        title: 'Course Creators',
        description: 'Track down leaked course materials and sales page clones that dilute your brand and steal revenue.'
    },
    {
        icon: Scale,
        color: 'text-indigo-600',
        bg: 'bg-indigo-50',
        title: 'Legal Professionals',
        description: 'Automate the evidence gathering process with instant, date-stamped reports to speed up DMCA takedowns.'
    }
];

export default function UseCases() {
    return (
        <section className="w-full py-24 bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Header */}
                <div className="mb-16">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-jakarta"
                    >
                        Who It&apos;s For
                    </motion.h2>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-gray-500 max-w-2xl"
                    >
                        Auditly helps professionals and businesses protect their visual content from unauthorized use across the web.
                    </motion.p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {useCases.map((useCase, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 group"
                        >
                            <div className={`w-12 h-12 rounded-xl ${useCase.bg} ${useCase.color} flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300`}>
                                <useCase.icon size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                                {useCase.title}
                            </h3>
                            <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                                {useCase.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
