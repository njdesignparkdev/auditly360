"use client";

import { ReactNode } from "react";

interface BgContainerProps {
  children: ReactNode;
}

export default function BgContainer({ children }: BgContainerProps) {
  return (
    <div className="bg-container-full min-h-screen w-full relative">
      {children}
    </div>
  );
}