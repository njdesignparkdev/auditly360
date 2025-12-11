'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FolderKanban, User, LogOut, CheckCircle2, Loader2, Stethoscope, Activity, ScanLine } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function DashboardMockup() {
    const [stage, setStage] = useState(0); // 0: Intro, 1: Scanning, 2: Results

    useEffect(() => {
        const timer1 = setTimeout(() => setStage(1), 2000); // Shortened Intro
        const timer2 = setTimeout(() => setStage(2), 6500); // 4.5s scanning
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    return (
        <div className="flex h-full w-full overflow-hidden rounded-lg bg-[#F9FAFB] text-left font-sans text-slate-900 shadow-xl border border-slate-200 text-[10px] relative group min-h-[400px]">
            {/* Added min-h to prevent layout shift or cramped spacing */}
            
            {/* Sidebar - Always Visible */}
            <aside className="w-40 flex-shrink-0 border-r border-slate-200 bg-white flex flex-col relative z-20">
                <div className="p-3">
                    <Image
                        src="/orange-black-auditly.png"
                        alt="Auditly"
                        width={70}
                        height={20}
                        className="h-5 w-auto object-contain"
                    />
                </div>

                <div className="px-2 py-1">
                    <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-700">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[8px] font-bold text-slate-600">
                            U
                        </div>
                        <span>User</span>
                    </div>
                </div>

                <nav className="flex-1 space-y-0.5 px-2 py-1">
                    <a href="#" className="flex items-center gap-2 rounded-lg px-2 py-1 text-[10px] font-medium text-slate-700 hover:bg-slate-50">
                        <LayoutDashboard className="h-3 w-3" />
                        Dashboard
                    </a>
                    <a href="#" className="flex items-center gap-2 rounded-lg px-2 py-1 text-[10px] font-medium text-slate-700 hover:bg-slate-50">
                        <FolderKanban className="h-3 w-3" />
                        Projects
                    </a>
                    <a href="#" className="flex items-center gap-2 rounded-lg px-2 py-1 text-[10px] font-medium text-slate-700 hover:bg-slate-50">
                        <User className="h-3 w-3" />
                        Profile
                    </a>
                </nav>

                <div className="p-2">
                    <button className="flex w-full items-center gap-2 rounded-lg px-2 py-1 text-[10px] font-medium text-slate-700 hover:bg-slate-50">
                        <LogOut className="h-3 w-3" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area - Animates */}
            <main className="flex-1 bg-[#F9FAFB] relative z-10 overflow-hidden flex flex-col h-full">
                <AnimatePresence mode="wait">
                    
                    {/* Stage 0: Intro - Health Check */}
                    {stage === 0 && (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-white to-blue-50 p-8 text-center"
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 10 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="relative w-[300px] h-[220px] mb-8"
                            >
                                <Image
                                    src="/health-check.png"
                                    alt="Health Check"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </motion.div>
                            <motion.h2 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-2xl font-bold text-slate-900 mb-3"
                            >
                                Take Care of Your Website Health
                            </motion.h2>
                            <motion.div 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="flex items-center gap-2 text-slate-500 bg-white/60 px-4 py-2 rounded-full border border-slate-200"
                            >
                                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                                <span>Initializing diagnostics...</span>
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Stage 1: Scanning - Doctor */}
                    {stage === 1 && (
                        <motion.div
                            key="scanning"
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 p-8 text-center overflow-hidden"
                        >
                             {/* Background Tech Pattern */}
                             <div className="absolute inset-0 z-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

                             <motion.div
                                className="relative w-[340px] h-[260px] mb-8 z-10"
                            >
                                <Image
                                    src="/doctor-scan.png"
                                    alt="Doctor Scanning"
                                    fill
                                    className="object-contain drop-shadow-xl"
                                    priority
                                />
                                {/* Modern Scan Line Effect */}
                                <motion.div 
                                    className="absolute left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_20px_4px_rgba(59,130,246,0.5)] z-20"
                                    initial={{ top: "10%" }}
                                    animate={{ top: ["10%", "90%", "10%"] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                />
                                {/* Scanning Overlay Gradient */}
                                <motion.div 
                                    className="absolute inset-0 bg-gradient-to-b from-blue-400/10 via-transparent to-blue-400/10 pointer-events-none"
                                />
                            </motion.div>

                            <div className="z-10 relative">
                                <motion.div 
                                    className="flex items-center justify-center gap-3 mb-3"
                                    animate={{ opacity: [0.8, 1, 0.8] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <ScanLine className="w-6 h-6 text-blue-600" />
                                    <h2 className="text-2xl font-bold text-slate-900">AI Doctor Analysis</h2>
                                </motion.div>
                                <div className="space-y-1">
                                    <p className="text-slate-600 font-medium">Scanning code structure...</p>
                                    <div className="flex gap-2 justify-center mt-2">
                                        {['Security', 'SEO', 'Performance', 'Accessibility'].map((tag, i) => (
                                            <motion.span
                                                key={tag}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.5 }}
                                                className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[9px] font-semibold"
                                            >
                                                {tag}
                                            </motion.span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Stage 2: Results - Dashboard UI */}
                    {stage === 2 && (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="h-full w-full p-4 flex flex-col"
                        >
                            <DashboardResultsUI />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}

function DashboardResultsUI() {
    return (
        <div className="flex flex-col h-full animate-in fade-in duration-500 slide-in-from-bottom-2">
            {/* Header */}
            <div className="mb-3 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm border border-slate-100">
                        <Image
                            src="/google-icon-logo-svgrepo-com.svg"
                            alt="Google"
                            width={16}
                            height={16}
                        />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-slate-900">Google</h2>
                        <p className="text-[10px] text-slate-500">https://www.google.com</p>
                    </div>
                </div>
                 <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-50 border border-green-100 shadow-sm">
                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                    <span className="font-medium text-green-700">Audit Complete</span>
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-3 border-b border-slate-200 flex-shrink-0">
                <nav className="-mb-px flex space-x-4 overflow-x-auto no-scrollbar">
                    {["Overview", "Links", "Images", "Grammar", "SEO", "UI", "Technical", "Performance"].map((tab) => (
                        <a
                            key={tab}
                            href="#"
                            className={cn(
                                "whitespace-nowrap border-b-2 px-1 pb-2 text-[10px] font-medium",
                                tab === "Technical"
                                    ? "border-[#FF5722] text-[#FF5722]"
                                    : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                            )}
                        >
                            {tab}
                        </a>
                    ))}
                </nav>
            </div>

            {/* Score Card */}
            <div className="mb-3 rounded-lg bg-white p-3 shadow-sm border border-slate-100 flex-shrink-0 flex items-center justify-between">
                <div>
                    <h3 className="mb-1 text-xs font-semibold text-slate-900">Technical Score</h3>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-medium text-slate-900">Out of 100</span>
                    </div>
                </div>
                <div className="relative flex items-center justify-center">
                     <svg className="w-12 h-12 transform -rotate-90">
                        <circle
                            className="text-slate-100"
                            strokeWidth="4"
                            stroke="currentColor"
                            fill="transparent"
                            r="20"
                            cx="24"
                            cy="24"
                        />
                        <motion.circle
                            className="text-[#FF5722]"
                            strokeWidth="4"
                            strokeDasharray={126}
                            strokeDashoffset={126}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="20"
                            cx="24"
                            cy="24"
                            initial={{ strokeDashoffset: 126 }}
                            animate={{ strokeDashoffset: 126 - (126 * 0.8) }}
                            transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                        />
                    </svg>
                    <motion.span 
                        className="absolute text-lg font-bold text-[#FF5722]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <UserCountUp target={80} />
                    </motion.span>
                </div>
            </div>

            {/* HTML Structure Section */}
            <div className="mb-3 flex-shrink-0">
                <h3 className="mb-2 text-xs font-semibold text-slate-900">HTML Structure</h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                    <div>
                        <h4 className="mb-1 text-[10px] font-medium text-slate-900">Basic Structure</h4>
                        <div className="space-y-1">
                            {["DOCTYPE Declaration", "HTML Tag", "HEAD Tag", "BODY Tag"].map((item, i) => (
                                <AuditItem key={item} label={item} delay={i * 0.2} />
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="mb-1 text-[10px] font-medium text-slate-900">Meta Information</h4>
                        <div className="space-y-1">
                            {["Charset Declaration", "Viewport Meta", "Language Attribute"].map((item, i) => (
                                <AuditItem key={item} label={item} delay={0.8 + (i * 0.2)} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Element Analysis */}
            <div className="flex-shrink-0">
                <h3 className="mb-2 text-xs font-semibold text-slate-900">Element Analysis</h3>
                <div className="grid grid-cols-4 gap-2">
                     {[
                        { label: "Scripts", count: 6 },
                        { label: "Links", count: 9 },
                        { label: "Meta Tags", count: 7 },
                        { label: "Styles", count: 6 },
                    ].map((stat, i) => (
                         <motion.div 
                            key={stat.label} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.5 + (i * 0.1) }}
                            className="flex flex-col items-center justify-center rounded-lg bg-white p-2 shadow-sm border border-slate-100"
                        >
                            <span className="text-lg font-bold text-[#FF5722]">{stat.count}</span>
                            <span className="text-[10px] font-medium text-slate-600">{stat.label}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function AuditItem({ label, delay }: { label: string, delay: number }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-600">{label}</span>
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: delay, duration: 0.4 }}
            >
                 <span className="rounded bg-green-100 px-1.5 py-0.5 text-[8px] font-medium text-green-700 flex items-center gap-1">
                    Present
                </span>
            </motion.div>
        </div>
    )
}

function UserCountUp({ target }: { target: number }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTimestamp: number | null = null;
        const duration = 1500;

        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }, [target]);

    return <>{count}</>;
}
