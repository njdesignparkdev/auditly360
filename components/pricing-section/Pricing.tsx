'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const plans = [
    {
        name: 'Free',
        price: 'Free',
        description: 'Perfect for individuals and hobbyists',
        features: [
            'Single-Page Website Scan',
            'Limit: 1 Project',
            'Basic Content Fingerprinting',
            'Manual Search',
            'Weekly Scan Reports'
        ],
        buttonText: 'Get Started Free',
        popular: false
    },
    {
        name: 'Pro Plan',
        price: '50.00',
        yearlyPrice: '1188.00',
        period: 'per month',
        description: 'For growing brands and creators',
        features: [
            'Multi-Page Website Scanning',
            'Up to 10 Active Projects',
            'AI-Powered Visual Matching',
            'Real-time Theft Alerts',
            'DMCA Takedown Templates',
            'Brand Consistency Audit',
            'Unlimited Access to All Tools'
        ],
        buttonText: 'Get Started Now',
        popular: true
    },
    {
        name: 'Enterprise Plan',
        price: '159.00',
        yearlyPrice: '1908.00',
        period: 'per month',
        description: 'For agencies and large organizations',
        features: [
            'Unlimited Projects & Workspaces',
            'Automated Legal Takedowns',
            'API Access for Integrations',
            'Dedicated Account Manager',
            'White-label Reports',
            'Includes All Pro Features'
        ],
        buttonText: 'Contact Sales',
        popular: false
    }
];

export default function Pricing() {
    const [isYearly, setIsYearly] = useState(false);

    return (
        <section className="w-full mt-8 pt-8 pb-10 px-4 sm:px-6 lg:px-8 relative text-gray-900" data-border="true" data-framer-name="Section Structure">
                
                {/* Header & Toggle */}
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-jakarta">
                        Simple, transparent pricing
                    </h2>
                    
                    <div className="flex flex-col items-center justify-center gap-3 mt-8">
                        <div className="bg-gray-100 p-1 rounded-full flex items-center relative">
                            <button 
                                onClick={() => setIsYearly(false)}
                                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer ${!isYearly ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                            >
                                Monthly
                            </button>
                            <button 
                                onClick={() => setIsYearly(true)}
                                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer ${isYearly ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                            >
                                Yearly
                            </button>
                        </div>
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                            Yearly 17% Save
                        </span>
                    </div>
                </div>

                {/* Pricing Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-8 rounded-3xl border ${plan.popular ? 'border-orange-500 shadow-xl relative' : 'border-gray-100 bg-gray-50/50'} flex flex-col`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    {plan.price !== 'Free' && <span className="text-2xl font-bold text-gray-900">$</span>}
                                    <span className="text-5xl font-bold text-gray-900">
                                        {isYearly && plan.price !== 'Free' && plan.yearlyPrice
                                            ? plan.yearlyPrice
                                            : plan.price}
                                    </span>
                                    {plan.period && (
                                        <span className="text-gray-500 font-medium ml-2">
                                            {isYearly && plan.price !== 'Free' ? 'per year' : plan.period}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <button className={`w-full py-3 rounded-xl font-bold mb-8 transition-colors duration-200 cursor-pointer ${
                                plan.popular 
                                    ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/30' 
                                    : 'border-2 border-orange-500 text-orange-600 hover:bg-orange-50'
                            }`}>
                                {plan.buttonText}
                            </button>

                            <div className="space-y-4 flex-1">
                                {plan.features.map((feature, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="mt-1 min-w-[18px] min-h-[18px] w-[18px] h-[18px] rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                                            <Check size={12} strokeWidth={3} />
                                        </div>
                                        <span className="text-sm text-gray-600 font-medium leading-tight">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

        </section>
    );
}
