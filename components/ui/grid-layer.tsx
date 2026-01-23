"use client";

import { ReactNode } from "react";

interface GridOverlayProps {
  children: ReactNode;
  className?: string;
}

export default function GridOverlay({
  children,
  className = "",
}: GridOverlayProps) {
  return (
    <div
      className={`bg-container-full min-h-screen w-full relative ${className}`}
    >
      {/* Background Grid Lines */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Outer viewport edge lines */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200/80 dark:bg-white/10" />
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gray-200/80 dark:bg-white/10" />

        {/* Inner content border lines */}
        <div className="mx-auto h-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="relative h-full w-full">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200/80 dark:bg-white/10" />
            <div className="absolute right-0 top-0 bottom-0 w-px bg-gray-200/80 dark:bg-white/10" />
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
