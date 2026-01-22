"use client";

export default function GridOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {/* Outer viewport edge lines */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200/80 dark:bg-white/10" />
      <div className="absolute right-0 top-0 bottom-0 w-px bg-gray-200/80 dark:bg-white/10" />

      {/* 
        Container for the inner content border lines.
        Outer div has padding, inner div has the lines at its edges.
      */}
      <div className="mx-auto h-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="relative h-full w-full">
          {/* Left Border - at the left edge of content area (after padding) */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200/80 dark:bg-white/10" />

          {/* Right Border - at the right edge of content area (after padding) */}
          <div className="absolute right-0 top-0 bottom-0 w-px bg-gray-200/80 dark:bg-white/10" />
        </div>
      </div>
    </div>
  );
}
