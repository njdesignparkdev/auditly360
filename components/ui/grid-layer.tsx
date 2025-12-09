'use client';

export default function GridOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* 
        Container for the grid borders.
        Matches the max-w-7xl used in Navbar and Hero.
        px-4 sm:px-6 lg:px-8 aligns with the content padding.
      */}
      <div className="mx-auto h-full max-w-[1285px]">
        <div className="relative h-full w-full">
          {/* Left Border */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-900/20" />

          {/* Right Border */}
          <div className="absolute right-0 top-0 bottom-0 w-px bg-gray-900/20" />

          {/* Optional: Middle border if you want a split, otherwise just the edges */}
          {/* <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-900/10 -translate-x-1/2" /> */}

          {/* Corner markers */}
          {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos) => (
            <div
              key={pos}
              className={`absolute ${pos} translate-x-[-50%] translate-y-[-50%] text-gray-400 text-xs leading-none select-none`}
            >
              +
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
