"use client";

import React from "react";

export const PageBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 bg-blue-50 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-700 opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-3/4 h-3/4 bg-blue-600 transform origin-bottom-right rotate-12 translate-y-1/3 -translate-x-1/4 opacity-90"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-700 opacity-80"></div>
      <div className="absolute top-0 left-0 w-1/2 h-full bg-blue-400 transform -skew-y-6 origin-top-left -translate-y-1/4 opacity-30"></div>
    </div>
  );
};
