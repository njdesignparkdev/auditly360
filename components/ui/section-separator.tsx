'use client';

interface SectionSeparatorProps {
  className?: string;
}

export default function SectionSeparator({ className = '' }: SectionSeparatorProps) {
  return (
    <div className={`mx-auto w-full max-w-[1240px] ${className}`}>
      <div className="h-px w-full bg-gray-200" />
    </div>
  );
}
