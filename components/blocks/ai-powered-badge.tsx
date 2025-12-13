'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AIPoweredBadgeProps {
  mainText?: string;
  secondaryText?: string;
  className?: string;
}

export default function AIPoweredBadge({
  mainText = "AI Powered",
  secondaryText = "Explore the future of website audits",
  className = ""
}: AIPoweredBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }}
      className={`group relative inline-flex items-center ${className}`}
    >
      {/* Main Badge Container */}
      <div className="relative inline-flex items-center rounded-full overflow-hidden border-2 border-slate-300 shadow-lg bg-white">
        {/* Left Section - AI Powered (White) */}
        <motion.div
          className="relative flex items-center bg-white text-black px-5 py-2.5 sm:px-6 sm:py-3"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <span className="text-sm sm:text-base font-bold tracking-tight">
            {mainText}
          </span>
        </motion.div>

        {/* Right Section - Secondary Text (Dark) */}
        <div className="relative px-5 py-2.5 sm:px-6 sm:py-3 bg-[#4a5568]">
          <span className="text-xs sm:text-sm text-white/95 font-medium tracking-wide">
            {secondaryText}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
