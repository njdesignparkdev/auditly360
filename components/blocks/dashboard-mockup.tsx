import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FolderKanban, User, LogOut } from "lucide-react";

export function DashboardMockup() {
    return (
        <div className="flex h-full w-full overflow-hidden rounded-lg bg-[#F9FAFB] text-left font-sans text-slate-900 shadow-xl border border-slate-200 text-[10px]">
            {/* Sidebar */}
            <aside className="w-40 flex-shrink-0 border-r border-slate-200 bg-white flex flex-col">
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
                    <a
                        href="#"
                        className="flex items-center gap-2 rounded-lg px-2 py-1 text-[10px] font-medium text-slate-700 hover:bg-slate-50"
                    >
                        <LayoutDashboard className="h-3 w-3" />
                        Dashboard
                    </a>
                    <a
                        href="#"
                        className="flex items-center gap-2 rounded-lg px-2 py-1 text-[10px] font-medium text-slate-700 hover:bg-slate-50"
                    >
                        <FolderKanban className="h-3 w-3" />
                        Projects
                    </a>
                    <a
                        href="#"
                        className="flex items-center gap-2 rounded-lg px-2 py-1 text-[10px] font-medium text-slate-700 hover:bg-slate-50"
                    >
                        <User className="h-3 w-3" />
                        Profile
                    </a>
                </nav>

                <div className="p-2 border-t border-slate-200">
                    <button className="flex w-full items-center gap-2 rounded-lg px-2 py-1 text-[10px] font-medium text-slate-700 hover:bg-slate-50">
                        <LogOut className="h-3 w-3" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-[#F9FAFB] p-4 flex flex-col">
                {/* Header */}
                <div className="mb-3 flex items-center gap-2 flex-shrink-0">
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

                {/* Tabs */}
                <div className="mb-3 border-b border-slate-200 flex-shrink-0">
                    <nav className="-mb-px flex space-x-4 overflow-x-auto no-scrollbar">
                        {["Overview", "Links", "Images", "Grammar & Content", "SEO & Structure", "UI Quality", "Technical", "Performance", "Accessibility"].map((tab) => (
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

                {/* Sub-Tabs */}
                <div className="mb-3 flex space-x-1 rounded-lg bg-slate-100 p-0.5 w-fit flex-shrink-0">
                    {["HTML Structure", "Security Keys", "Web Standards", "Issues & Fixes"].map((subTab, index) => (
                        <button
                            key={subTab}
                            className={cn(
                                "rounded-md px-2 py-1 text-[10px] font-medium transition-all",
                                index === 0
                                    ? "bg-[#FFE0B2] text-[#E65100] shadow-sm"
                                    : "text-slate-600 hover:bg-white/50"
                            )}
                        >
                            {subTab}
                        </button>
                    ))}
                </div>

                {/* Score Card */}
                <div className="mb-3 rounded-lg bg-white p-3 shadow-sm border border-slate-100 flex-shrink-0">
                    <h3 className="mb-1 text-xs font-semibold text-slate-900">Technical Score</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-[#FF5722]">80</span>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-medium text-slate-900">Out of 100</span>
                            <span className="text-[8px] text-slate-500">Based on Technical Standards</span>
                        </div>
                    </div>
                </div>

                {/* HTML Structure Section */}
                <div className="mb-3 flex-shrink-0">
                    <h3 className="mb-2 text-xs font-semibold text-slate-900">HTML Structure</h3>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                        <div>
                            <h4 className="mb-1 text-[10px] font-medium text-slate-900">Basic Structure</h4>
                            <div className="space-y-1">
                                {["DOCTYPE Declaration", "HTML Tag", "HEAD Tag", "BODY Tag"].map((item) => (
                                    <div key={item} className="flex items-center justify-between">
                                        <span className="text-[10px] text-slate-600">{item}</span>
                                        <span className="rounded bg-green-100 px-1.5 py-0.5 text-[8px] font-medium text-green-700">Present</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="mb-1 text-[10px] font-medium text-slate-900">Meta Information</h4>
                            <div className="space-y-1">
                                {["Charset Declaration", "Viewport Meta", "Language Attribute"].map((item) => (
                                    <div key={item} className="flex items-center justify-between">
                                        <span className="text-[10px] text-slate-600">{item}</span>
                                        <span className="rounded bg-green-100 px-1.5 py-0.5 text-[8px] font-medium text-green-700">Present</span>
                                    </div>
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
                        ].map((stat) => (
                            <div key={stat.label} className="flex flex-col items-center justify-center rounded-lg bg-white p-2 shadow-sm border border-slate-100">
                                <span className="text-lg font-bold text-[#FF5722]">{stat.count}</span>
                                <span className="text-[10px] font-medium text-slate-600">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
