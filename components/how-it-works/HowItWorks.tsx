'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Zap, BarChart3, ArrowRight, Search, FileText } from 'lucide-react';

export default function HowItWorks() {
    return (
        <section className="w-full py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Section Header */}
                <div className="mb-20">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-jakarta"
                    >
                        Detect Content Theft in 3 Steps
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-gray-500 max-w-2xl"
                    >
                        From URL input to legal-ready copyright evidence in under 60 seconds
                    </motion.p>
                </div>

                {/* Steps Container */}
                <div className="flex flex-col gap-32">

                    {/* Step 1: Enter URL - Text Left, Visual Right */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Text Column */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 text-orange-600 text-xs font-semibold mb-4">
                                <Globe size={14} />
                                <span>Step 1</span>
                            </div>
                            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-jakarta">
                                Enter your original content URL
                            </h3>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Simply paste your website or product link into our protection engine. We support e-commerce stores, SaaS landing pages, and creative portfolios.
                            </p>
                        </motion.div>

                        {/* Visual Column */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-3xl p-8 lg:p-12 border border-gray-100 shadow-sm"
                        >
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                                {/* Browser Chrome */}
                                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center gap-2">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-400" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                        <div className="w-3 h-3 rounded-full bg-green-400" />
                                    </div>
                                </div>
                                {/* Content */}
                                <div className="p-8 space-y-4">
                                    <div className="text-center mb-6">
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-50 text-orange-500 mb-4">
                                            <Search size={32} strokeWidth={2} />
                                        </div>
                                        <h4 className="text-xl font-bold text-gray-900 mb-2">Start Protection Scan</h4>
                                        <p className="text-sm text-gray-500">Enter your website URL below</p>
                                    </div>
                                    <div className="relative">
                                        {/* Input Box Container */}
                                        <div className="w-full h-[46px] px-4 bg-gray-50 border border-gray-200 rounded-xl flex items-center overflow-hidden">
                                            {/* Typewriter Text */}
                                            <motion.div
                                                className="text-gray-700 font-mono text-sm whitespace-nowrap overflow-hidden border-r-2 border-orange-500"
                                                initial={{ width: "0%" }}
                                                animate={{ 
                                                    width: ["0%", "100%", "100%", "100%", "0%"],
                                                    borderColor: ["transparent", "transparent", "#f97316", "transparent", "transparent"] 
                                                }}
                                                transition={{
                                                    duration: 8,
                                                    times: [0, 0.3, 0.35, 0.9, 1], // Type (30%), Wait, Clear
                                                    repeat: Infinity,
                                                    ease: "linear"
                                                }}
                                            >
                                                https://yourwebsite.com
                                            </motion.div>
                                        </div>

                                        {/* Mouse Cursor Animation Sequence 
                                            1. Hidden during typing (0-30%)
                                            2. Appears (30%)
                                            3. Moves to button (30-50%)
                                            4. Clicks (55%)
                                            5. Disappears (90%)
                                        */}
                                        <motion.div
                                            className="absolute top-0 left-0 z-20 pointer-events-none"
                                            animate={{
                                                opacity: [0, 0, 1, 1, 0],
                                                x: ['100px', '100px', '180px', '180px', '180px'],
                                                y: ['20px', '20px', '76px', '76px', '76px'],
                                                scale: [1, 1, 1, 0.9, 1]
                                            }}
                                            transition={{
                                                duration: 8,
                                                repeat: Infinity,
                                                times: [0, 0.35, 0.36, 0.9, 0.95]
                                            }}
                                        >
                                            <svg 
                                                width="28" 
                                                height="28" 
                                                viewBox="0 0 24 24" 
                                                fill="none" 
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="drop-shadow-lg"
                                            >
                                                <path 
                                                    d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z" 
                                                    fill="#000000" 
                                                    stroke="white" 
                                                    strokeWidth="2" 
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </motion.div>
                                    </div>
                                    <motion.button
                                        animate={{
                                            scale: [1, 1, 1, 0.95, 1, 1],
                                            backgroundColor: [
                                                'rgb(255, 255, 255)',
                                                'rgb(255, 255, 255)',
                                                'rgb(239, 70, 0)',
                                                'rgb(239, 70, 0)',
                                                'rgb(255, 255, 255)',
                                                'rgb(255, 255, 255)'
                                            ],
                                            color: [
                                                'rgb(239, 70, 0)',
                                                'rgb(239, 70, 0)',
                                                'rgb(255, 255, 255)',
                                                'rgb(255, 255, 255)',
                                                'rgb(239, 70, 0)',
                                                'rgb(239, 70, 0)'
                                            ]
                                        }}
                                        transition={{
                                            duration: 8,
                                            repeat: Infinity,
                                            times: [0, 0.45, 0.5, 0.55, 0.6, 1] // Sync with cursor click at ~55%
                                        }}
                                        className="w-full border border-gray-200 font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 relative overflow-hidden"
                                    >
                                        <span className="relative z-10">Scan Now</span>
                                        <ArrowRight size={18} className="relative z-10" />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Step 2: AI Analysis - Visual Left, Text Right */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Visual Column */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-3xl p-8 lg:p-12 border border-blue-100 shadow-sm order-2 lg:order-1"
                        >
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 min-h-[320px] flex flex-col items-center justify-center">
                                <div className="relative w-24 h-24 mb-8">
                                    {/* Static background ring */}
                                    <div className="absolute inset-0 border-[6px] border-gray-100 rounded-full" />
                                    
                                    {/* Spinning indicator */}
                                    <motion.div
                                        className="absolute inset-0 border-[6px] border-orange-500 rounded-full border-t-transparent border-l-transparent"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                    />
                                    
                                    {/* Icon in center */}
                                    <div className="absolute inset-0 flex items-center justify-center text-orange-500">
                                        <Search size={32} strokeWidth={2.5} />
                                    </div>
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-2">Analyzing fingerprints...</h4>
                                <p className="text-gray-500 text-center">Comparing visual signatures against<br/>2.5M+ indexed suspicious sites</p>
                            </div>
                        </motion.div>

                        {/* Text Column */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="order-1 lg:order-2"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold mb-4">
                                <Zap size={14} />
                                <span>Step 2</span>
                            </div>
                            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-jakarta">
                                Visual AI scans for duplicates
                            </h3>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Our advanced computer vision algorithms create a unique fingerprint of your design, content, and assets, comparing it against millions of sites to find unauthorized clones.
                            </p>
                        </motion.div>
                    </div>

                    {/* Step 3: Get Results - Text Left, Visual Right */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Text Column */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 text-green-600 text-xs font-semibold mb-4">
                                <BarChart3 size={14} />
                                <span>Step 3</span>
                            </div>
                            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-jakarta">
                                Instant Copy & Theft Reports
                            </h3>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Get a clear breakdown of who is copying you. We flag exact matches, partial clones, and asset theft with side-by-side comparisons and similarity scores.
                            </p>
                        </motion.div>

                        {/* Visual Column */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-gradient-to-br from-green-50 to-emerald-50/50 rounded-3xl p-8 lg:p-12 border border-green-100 shadow-sm"
                        >
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                                            <FileText size={20} className="fill-current" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 line-clamp-1">3 Potential Matches</h4>
                                            <p className="text-xs text-orange-500 font-semibold">High Priority</p>
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-500">0.8s scan</span>
                                </div>
                                
                                {/* Comparison Visual */}
                                <div className="flex items-stretch gap-4 mb-6">
                                    {/* Original */}
                                    <div className="flex-1 space-y-2">
                                        <div className="aspect-video bg-gray-100 rounded-lg border border-gray-200 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-blue-500/10" />
                                            <div className="absolute top-2 left-2 w-12 h-2 bg-blue-200 rounded-sm" />
                                            <div className="absolute top-6 left-2 w-3/4 h-2 bg-gray-200 rounded-sm" />
                                            <div className="absolute top-10 left-2 w-1/2 h-2 bg-gray-200 rounded-sm" />
                                            <div className="absolute bottom-0 right-0 w-12 h-12 bg-blue-500/20 rounded-tl-full" />
                                        </div>
                                        <p className="text-xs font-semibold text-center text-gray-500">Your Original</p>
                                    </div>

                                    {/* Match Badge */}
                                    <div className="flex flex-col items-center justify-center z-10 -mx-6">
                                        <div className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg border-2 border-white">
                                            98%
                                        </div>
                                    </div>

                                    {/* Suspicious */}
                                    <div className="flex-1 space-y-2 relative">
                                        <div className="aspect-video bg-orange-50 rounded-lg border-2 border-orange-500/30 relative overflow-hidden">
                                             {/* Identical Layout */}
                                            <div className="absolute inset-0 bg-orange-500/5" />
                                            <div className="absolute top-2 left-2 w-12 h-2 bg-orange-200 rounded-sm" />
                                            <div className="absolute top-6 left-2 w-3/4 h-2 bg-gray-200 rounded-sm" />
                                            <div className="absolute top-10 left-2 w-1/2 h-2 bg-gray-200 rounded-sm" />
                                            <div className="absolute bottom-0 right-0 w-12 h-12 bg-orange-500/20 rounded-tl-full" />
                                        </div>
                                        <p className="text-xs font-semibold text-center text-orange-600">Match Found</p>

                                        {/* Animation: Cursor Clicking Match */}
                                        <motion.div
                                            className="absolute md:top-[40%] top-[30%] left-[40%] z-50 pointer-events-none"
                                            initial={{ opacity: 0, x: 50, y: 50 }}
                                            whileInView={{ opacity: 1, x: 0, y: 0 }}
                                            transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                                        >
                                            <motion.div
                                                animate={{ 
                                                    scale: [1, 1, 0.85, 1, 1],
                                                }}
                                                transition={{ 
                                                    duration: 2, 
                                                    repeat: Infinity, 
                                                    delay: 1.5,
                                                    times: [0, 0.1, 0.2, 0.3, 1]
                                                }}
                                            >
                                                <svg 
                                                    width="42" 
                                                    height="42" 
                                                    viewBox="0 0 24 24" 
                                                    fill="none" 
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="drop-shadow-2xl"
                                                >
                                                    <path 
                                                        d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z" 
                                                        fill="#000000" 
                                                        stroke="white" 
                                                        strokeWidth="2" 
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </motion.div>
                                        </motion.div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <button className="w-full bg-orange-600 text-white text-sm font-semibold py-2.5 rounded-lg shadow-sm hover:bg-orange-700 transition-colors">
                                        View Evidence Report
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
