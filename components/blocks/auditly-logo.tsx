'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function AuditlyLogo() {
    return (
        <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Animated Circle Icon */}
            <motion.div
                className="relative w-8 h-8"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                    duration: 0.6,
                    type: "spring",
                    stiffness: 100
                }}
            >
                {/* Background circle */}
                <motion.div
                    className="absolute inset-0 rounded-full bg-orange-500 opacity-10"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* Rotating arc */}
                <motion.svg
                    viewBox="0 0 100 100"
                    className="absolute inset-0 w-full h-full"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#f97316"
                        strokeWidth="4"
                        strokeDasharray="125 125"
                        strokeDashoffset="31"
                        opacity="0.6"
                    />
                </motion.svg>

                {/* Center circle */}
                <motion.div
                    className="absolute inset-0 m-auto w-5 h-5 rounded-full border-2 border-orange-500"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                />

                {/* Inner dot with checkmark */}
                <motion.div
                    className="absolute inset-0 m-auto w-3 h-3 rounded-full bg-orange-500 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                >
                    <motion.svg
                        width="8"
                        height="8"
                        viewBox="0 0 14 14"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.5, duration: 0.3 }}
                    >
                        <motion.path
                            d="M 3 7 L 6 10 L 11 4"
                            fill="none"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </motion.svg>
                </motion.div>
            </motion.div>

            {/* Text Animation */}
            <div className="flex items-start">
                <motion.span
                    className="text-2xl font-normal text-orange-500 tracking-tight"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    auditly
                </motion.span>

                <motion.span
                    className="text-[8px] font-semibold text-black ml-0.5 relative top-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                >
                    360
                </motion.span>
            </div>
        </motion.div>
    );
}
