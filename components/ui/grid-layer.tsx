'use client';

export default function GridOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* 
        Container for the grid borders.
        Matches the max-w-7xl used in Navbar and Hero.
        px-4 sm:px-6 lg:px-8 aligns with the content padding.
      */}
      <div className="mx-auto h-full max-w-[1200px]">
        <div className="relative h-full w-full">
          {/* Left Border */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-900/20" />

          {/* Right Border */}
          <div className="absolute right-0 top-0 bottom-0 w-px bg-gray-900/20" />

          {/* Optional: Middle border if you want a split, otherwise just the edges */}
          {/* <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-900/10 -translate-x-1/2" /> */}
        </div>
      </div>
    </div>
  );
}
