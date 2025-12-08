'use client';

interface SectionSeparatorProps {
  className?: string;
}

export default function SectionSeparator({ className = '' }: SectionSeparatorProps) {
  return (
    <div className={`w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] ${className}`}>
      <div className="mx-auto max-w-[1400px] px-6 relative">
        {/* Horizontal grid line separator */}
        <div className="h-px w-full bg-gray-900/20" />
      </div>
    </div>
  );
}
