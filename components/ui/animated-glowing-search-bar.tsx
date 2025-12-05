"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export interface AnimatedGlowingSearchBarProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    onSearch?: (value: string) => void;
    containerClassName?: string;
}

export function AnimatedGlowingSearchBar({
    className,
    containerClassName,
    onSearch,
    ...props
}: AnimatedGlowingSearchBarProps) {
    const [isFocused, setIsFocused] = React.useState(false);
    const [value, setValue] = React.useState("");

    const handleSearch = () => {
        if (onSearch) {
            onSearch(value);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
        props.onKeyDown?.(e);
    };

    return (
        <div
            className={cn(
                "relative flex items-center justify-center w-full max-w-md mx-auto",
                containerClassName
            )}
        >
            {/* Glowing Background Effect */}
            <AnimatePresence>
                {isFocused && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute -inset-0.5 bg-gradient-to-r from-[#ff4b01] via-[#ff8040] to-[#ff4b01] rounded-full blur opacity-75 animate-tilt"
                    />
                )}
            </AnimatePresence>

            {/* Search Bar Container */}
            <div className="relative w-full group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Search
                        className={cn(
                            "w-5 h-5 transition-colors duration-300",
                            isFocused ? "text-[#ff4b01]" : "text-gray-400"
                        )}
                    />
                </div>
                <input
                    type="text"
                    className={cn(
                        "block w-full py-3 pl-12 pr-4 text-sm text-gray-900 bg-white border border-gray-200 rounded-full focus:outline-none focus:border-transparent focus:ring-0 transition-all duration-300 placeholder:text-gray-400 shadow-sm",
                        isFocused && "shadow-lg",
                        className
                    )}
                    placeholder="Search..."
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onKeyDown={handleKeyDown}
                    {...props}
                />

                {/* Optional: Right side action or clear button could go here */}
            </div>
        </div>
    );
}
