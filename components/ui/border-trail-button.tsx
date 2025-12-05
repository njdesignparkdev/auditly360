"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BorderTrail } from "@/components/ui/border-trail";

interface BorderTrailButtonProps {
    href: string;
    children: React.ReactNode;
    className?: string;
    innerClassName?: string;
    trailClassName?: string;
}

const BorderTrailButton = ({
    href,
    children,
    className,
    innerClassName,
    trailClassName,
}: BorderTrailButtonProps) => {
    return (
        <Link
            href={href}
            className={cn(
                "relative flex items-center justify-center rounded-lg overflow-hidden group",
                className
            )}
        >
            <div className="absolute inset-0 rounded-lg z-20 pointer-events-none">
                <BorderTrail
                    className={cn("bg-white/50", trailClassName)}
                    size={80}
                />
            </div>
            <div
                className={cn(
                    "relative z-10 flex items-center justify-center w-full h-full bg-zinc-900/90 text-white rounded-lg px-6 py-2.5 text-sm font-medium transition-colors hover:bg-zinc-800/90",
                    innerClassName
                )}
            >
                {children}
            </div>
        </Link>
    );
};

export default BorderTrailButton;
