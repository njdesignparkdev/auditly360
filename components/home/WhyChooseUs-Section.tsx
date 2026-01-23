"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, FileText, Zap, Search, ArrowRight } from "lucide-react";

// Reusable Animation Component (Adapted for single container)
const AnimationDisplay = ({
  type,
  icon,
  color,
}: {
  type: string;
  icon: React.ReactNode;
  color: string;
}) => {
  return (
    <div className={`w-full h-full flex items-center justify-center relative`}>
      {/* Background Decor */}
      <div className={`absolute inset-0 opacity-20 ${color} -[2rem]`} />

      <div className="relative z-10 flex flex-col items-center justify-center transform scale-75 sm:scale-90 md:scale-100">
        {type === "scanning" && (
          <div className="relative flex flex-col items-center">
            {/* Feature Image with Animation */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative"
            >
              <img
                src="/feature-img/seo_vector.png"
                alt="SEO Optimization"
                className="w-64 h-64 sm:w-80 sm:h-80 object-contain"
              />

              {/* Glow Effect */}
              <motion.div
                className="absolute inset-0 bg-blue-400/20 blur-3xl -full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>

            {/* Status Badge */}
            <motion.div
              className="mt-4 bg-blue-50 border border-blue-200 px-4 py-1.5 -full"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-xs font-semibold text-blue-600">
                SEO Optimized ✓
              </span>
            </motion.div>
          </div>
        )}

        {type === "shield" && (
          <div className="relative flex flex-col items-center">
            {/* Feature Image with Animation */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative"
            >
              <img
                src="/feature-img/security_vector.png"
                alt="Protect Your Site 24/7"
                className="w-64 h-64 sm:w-80 sm:h-80 object-contain"
              />

              {/* Glow Effect */}
              <motion.div
                className="absolute inset-0 bg-emerald-400/20 blur-3xl -full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>

            {/* Status Badge */}
            <motion.div
              className="mt-4 bg-emerald-50 border border-emerald-200 px-4 py-1.5 -full"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-xs font-semibold text-emerald-600">
                System Secure ✓
              </span>
            </motion.div>
          </div>
        )}

        {type === "scanning-text" && (
          <div className="relative flex flex-col items-center">
            {/* Feature Image with Animation */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative"
            >
              <img
                src="/feature-img/content_vector.png"
                alt="Grammar & Consistency Check"
                className="w-64 h-64 sm:w-80 sm:h-80 object-contain"
              />

              {/* Glow Effect */}
              <motion.div
                className="absolute inset-0 bg-orange-400/20 blur-3xl -full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>

            {/* Status Badge */}
            <motion.div
              className="mt-4 bg-orange-50 border border-orange-200 px-4 py-1.5 -full"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-xs font-semibold text-orange-600">
                Content Reviewed ✓
              </span>
            </motion.div>
          </div>
        )}

        {type === "pulse" && (
          <div className="relative flex flex-col items-center">
            {/* Feature Image with Animation */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative"
            >
              <img
                src="/feature-img/speed_vector.png"
                alt="Deliver Better UX & Speed"
                className="w-64 h-64 sm:w-80 sm:h-80 object-contain"
              />

              {/* Glow Effect */}
              <motion.div
                className="absolute inset-0 bg-purple-400/20 blur-3xl -full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>

            {/* Status Badge */}
            <motion.div
              className="mt-4 bg-purple-50 border border-purple-200 px-4 py-1.5 -full"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-xs font-semibold text-purple-600">
                99/100 Speed Score ✓
              </span>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function WhyChooseUsSection() {
  const [activeFeature, setActiveFeature] = useState(0);

  // Auto-rotate tabs if user isn't interacting (optional, keeping it manual-friendly for now but auto-switch adds dynamism like HowItWorks)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 5000); // 5 seconds per slide
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      id: "seo",
      badge: "SEO Optimization",
      title: "Improve Rankings & Visibility",
      description:
        "Boost SEO visibility with clear fixes. Identify indexing issues, optimize metadata, and stay ahead of algorithm changes.",
      icon: <Search className="w-6 h-6 text-blue-600" />,
      color: "bg-blue-50",
      accent: "border-blue-200",
      animationType: "scanning",
    },
    {
      id: "security",
      badge: "Security",
      title: "Protect Your Site 24/7",
      description:
        "Spot security risks early. Detect vulnerabilities and malware before they become threats to safeguard user data.",
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      color: "bg-emerald-50",
      accent: "border-emerald-200",
      animationType: "shield",
    },
    {
      id: "content",
      badge: "Content Quality",
      title: "Grammar & Consistency Check",
      description:
        "AI-powered grammar and content analysis catch spelling errors and maintain visual consistency across your site.",
      icon: <FileText className="w-6 h-6 text-orange-600" />,
      color: "bg-orange-50",
      accent: "border-orange-200",
      animationType: "scanning-text",
    },
    {
      id: "ux",
      badge: "User Experience",
      title: "Deliver Better UX & Speed",
      description:
        "Identify performance bottlenecks. Optimize page speed for smoother browsing and ensure easy navigation.",
      icon: <Zap className="w-6 h-6 text-purple-600" />,
      color: "bg-purple-50",
      accent: "border-purple-200",
      animationType: "pulse",
    },
  ];

  return (
    <div className="w-full py-6 md:py-10 px-4 sm:px-6 lg:px-8 relative text-gray-900">
      <div className="relative z-10 w-full bg-white/90 backdrop-blur-sm -xl shadow-2xl overflow-hidden border border-white/20 p-8 sm:p-12">
        {/* Section Header */}
        <div className="text-start mb-10 md:mb-16 space-y-2 sm:space-y-3">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-gray-900 font-jakarta">
            Why Choose Us
          </h2>
          <p className="text-gray-600 text-sm sm:text-base font-poppins max-w-2xl">
            Our comprehensive toolkit ensures your website is performant,
            secure, and SEO-ready at all times.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          {/* Left Column: Feature List */}
          <div className="flex flex-col gap-3">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                onClick={() => setActiveFeature(index)}
                className={`group p-4 -2xl border transition-all duration-300 cursor-pointer w-full flex items-start gap-4 min-h-[110px] sm:min-h-[130px] ${
                  activeFeature === index
                    ? `bg-white/80 backdrop-blur-md ${feature.accent} shadow-xl shadow-black/5`
                    : "border-transparent hover:bg-white/40 backdrop-blur-sm"
                }`}
              >
                <div
                  className={`flex-shrink-0 p-2 -lg transition-colors ${
                    activeFeature === index
                      ? feature.color
                      : "bg-slate-50 group-hover:bg-white"
                  }`}
                >
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-0.5">
                    <h3
                      className={`text-sm sm:text-base font-bold font-jakarta leading-tight pr-4 line-clamp-2 ${
                        activeFeature === index
                          ? "text-gray-900"
                          : "text-gray-600"
                      }`}
                    >
                      {feature.title}
                    </h3>
                    {activeFeature === index && (
                      <motion.div layoutId="active-indicator">
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </motion.div>
                    )}
                  </div>
                  <p
                    className={`text-xs sm:text-[13px] md:text-sm leading-snug transition-colors line-clamp-3 sm:line-clamp-none ${
                      activeFeature === index
                        ? "text-gray-600"
                        : "text-gray-500"
                    }`}
                  >
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Animation Display */}
          <div className="relative min-h-[400px] sm:h-[450px] w-full max-w-[500px] mx-auto bg-white/60 backdrop-blur-lg border border-white/20 p-6 md:p-8 overflow-hidden order-first lg:order-last flex flex-col items-center justify-between -[2.5rem] shadow-xl">
            {/* Mobile Header (Visible only on mobile) */}
            <div className="lg:hidden text-center mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                {features[activeFeature].title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 px-6">
                {features[activeFeature].description}
              </p>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.05, filter: "blur(4px)" }}
                transition={{ duration: 0.4 }}
                className="w-full h-full flex items-center justify-center relative z-10"
              >
                <AnimationDisplay
                  type={features[activeFeature].animationType}
                  icon={features[activeFeature].icon}
                  color={features[activeFeature].color}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
