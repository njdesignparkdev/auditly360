"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus,
  Search,
  FileCheck,
  Globe,
  FileText,
  ArrowRight,
} from "lucide-react";

export default function HowItWorks() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // 7 seconds total loop -> ~2.33s per step
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 3);
    }, 2333);
    return () => clearInterval(timer);
  }, []);

  const steps = [
    {
      id: 0,
      title: "Sign Up",
      description: "Create your free account in seconds.",
      icon: <UserPlus className="w-6 h-6 text-orange-600" />,
      visual: (
        <div className="bg-white p-6 rounded-none -sm border border-slate-100 flex flex-col items-center justify-center h-full w-full relative overflow-hidden">
          {/* Abstract Profile Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-56 bg-white border border-slate-100 rounded-none -xl -slate-200/50 p-5 space-y-4 z-10"
          >
            <div className="flex gap-3 items-center border-b border-slate-50 pb-3">
              <div className="w-10 h-10 rounded-none bg-orange-50 flex items-center justify-center border border-orange-100">
                <UserPlus className="w-5 h-5 text-orange-500" />
              </div>
              <div className="space-y-1.5">
                <div className="h-2 w-20 bg-slate-200 rounded-none"></div>
                <div className="h-1.5 w-12 bg-slate-100 rounded-none"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-9 w-full bg-slate-50 rounded-none flex items-center px-3 border border-slate-100">
                <div className="h-1.5 w-12 bg-slate-200 rounded-none"></div>
              </div>
              <motion.div
                className="h-9 w-full bg-orange-500 rounded-none flex items-center justify-center -lg -orange-500/20"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <span className="text-xs font-semibold text-white">
                  Create Account
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* Decorative Background */}
          <div className="absolute inset-0 bg-slate-50/50 opacity-50" />
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute -top-12 -right-12 w-48 h-48 bg-orange-100/30 rounded-none blur-3xl pointer-events-none"
          />
        </div>
      ),
    },
    {
      id: 1,
      title: "Upload URL",
      description: "Paste your website link to start analyzing.",
      icon: <Globe className="w-6 h-6 text-blue-600" />,
      visual: (
        <div className="bg-slate-50/50 p-6 rounded-none -none border border-slate-100 flex flex-col items-center justify-center h-full w-full relative overflow-hidden">
          {/* The Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-64 bg-white rounded-none -xl -slate-200/50 border border-slate-100 p-6 space-y-5 relative z-10"
          >
            {/* Lines */}
            <div className="space-y-2.5">
              <div className="h-2 w-1/3 bg-slate-100 rounded-none"></div>
              <div className="h-2 w-full bg-slate-50 rounded-none"></div>

              {/* Active Line */}
              <div className="h-2 w-3/4 bg-slate-50 rounded-none relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-orange-100"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>

              <div className="h-2 w-5/6 bg-slate-50 rounded-none"></div>
              <div className="h-2 w-1/2 bg-slate-50 rounded-none"></div>
            </div>

            {/* Reviewing Badge */}
            <div className="flex justify-end pt-2">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 1.5,
                }}
                className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-none border border-orange-100"
              >
                <FileText className="w-3.5 h-3.5 text-orange-500" />
                <span className="text-xs font-semibold text-orange-600">
                  Reviewing
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-70"></div>
        </div>
      ),
    },
    {
      id: 2,
      title: "Get Results",
      description: "Receive actionable insights instantly.",
      icon: <FileCheck className="w-6 h-6 text-green-600" />,
      visual: (
        <div className="bg-white p-6 rounded-none -sm border border-slate-100 flex flex-col h-full w-full relative overflow-hidden justify-center bg-[radial-gradient(#f1f5f9_1px,transparent_1px)] [background-size:16px_16px]">
          {/* Header Mock */}
          <div className="flex items-center justify-between mb-6 border-b border-slate-50 pb-3 relative z-10">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-800 font-jakarta">
                example.com
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                SEO Checkup Score
              </span>
            </div>
            <div className="bg-slate-50 px-2.5 py-1 rounded-none text-[10px] font-semibold text-slate-500 border border-slate-100">
              Export
            </div>
          </div>

          <div className="flex gap-5 items-center relative z-10">
            {/* Left: Score Circle */}
            <div className="relative w-24 h-24 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#f1f5f9"
                  strokeWidth="6"
                  fill="none"
                />
                <motion.circle
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 0.83 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#22c55e"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray="251.2"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-slate-800 font-jakarta">
                  83
                </span>
              </div>
            </div>

            {/* Right: Stats List */}
            <div className="flex-1 space-y-2.5">
              {/* Failed */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-semibold text-slate-500">
                  <span>7 Failed</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-none overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "30%" }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="h-full bg-red-500 rounded-none"
                  />
                </div>
              </div>
              {/* Warnings */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-semibold text-slate-500">
                  <span>4 Warnings</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-none overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "20%" }}
                    transition={{ delay: 0.7, duration: 1 }}
                    className="h-full bg-yellow-500 rounded-none"
                  />
                </div>
              </div>
              {/* Passed */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-semibold text-slate-500">
                  <span>50 Passed</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-none overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "80%" }}
                    transition={{ delay: 0.9, duration: 1 }}
                    className="h-full bg-green-500 rounded-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="w-full py-6 md:py-10 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
          {/* Column 1: Text Content */}
          <div className="flex flex-col gap-6 order-2 lg:order-1">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-jakarta text-gray-900 leading-tight mb-4">
                How Auditly Works
              </h2>
              <p className="text-base text-gray-600 font-poppins leading-relaxed max-w-lg">
                We've simplified the complex world of website auditing into a
                streamlined process. Get detailed insights in seconds.
              </p>
            </div>

            <div className="space-y-3">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`group flex items-start gap-4 p-4 rounded-none transition-all duration-300 border ${
                    currentStep === step.id
                      ? "bg-orange-50/50 border-orange-100 -sm"
                      : "border-transparent hover:bg-slate-50"
                  }`}
                  onClick={() => setCurrentStep(step.id)}
                >
                  <div
                    className={`p-2.5 rounded-none transition-colors duration-300 ${
                      currentStep === step.id
                        ? "bg-white -sm"
                        : "bg-slate-100 group-hover:bg-white"
                    }`}
                  >
                    {step.icon}
                  </div>
                  <div>
                    <h3
                      className={`text-base font-bold font-jakarta mb-0.5 transition-colors ${
                        currentStep === step.id
                          ? "text-gray-900"
                          : "text-gray-600"
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed font-poppins">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Animation Showcase */}
          <div className="order-1 lg:order-2">
            <div className="relative h-[320px] w-full bg-slate-50 rounded-none p-4 md:p-5 flex items-center justify-center overflow-hidden border border-slate-100 -inner">
              {/* Background Grid */}
              <div className="absolute inset-0 bg-[linear-gradient(#d4d4d8_1px,transparent_1px),linear-gradient(to_right,#d4d4d8_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-[0.15]"></div>

              {/* Animated content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
                  animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                  exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                  transition={{ duration: 0.5, ease: "backOut" }}
                  className="w-full max-w-[300px] aspect-[4/5] md:aspect-square relative z-10 perspective-1000"
                >
                  {/* Floating Card Effect */}
                  <div className="w-full h-full transform transition-transform duration-500 hover:scale-[1.02]">
                    {steps[currentStep].visual}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Status Indicator Dots */}
              <div className="absolute bottom-8 flex gap-3">
                {steps.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 rounded-none transition-all duration-500 ease-out ${
                      currentStep === idx
                        ? "w-8 bg-orange-500"
                        : "w-2 bg-slate-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
