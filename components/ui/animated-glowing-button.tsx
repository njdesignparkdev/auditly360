"use client";

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface AnimatedGlowingButtonProps {
    href: string;
    children: React.ReactNode;
    className?: string;
    innerClassName?: string;
    glowClassName?: string;
}

const AnimatedGlowingButton = ({ href, children, className, innerClassName, glowClassName }: AnimatedGlowingButtonProps) => {
    return (
        <Link href={href} className={cn("relative flex items-center justify-center", className)}>
            <div id="poda" className="relative flex items-center justify-center group w-full">
                {/* Glow Layer 1 */}
                <div className={cn("absolute z-0 overflow-hidden h-full w-full max-h-[50px] max-w-[180px] rounded-xl blur-[3px] before:absolute before:content-[''] before:z-[-2] before:w-[999px] before:h-[999px] before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-60 before:bg-[conic-gradient(#000,#402fb5_5%,#000_38%,#000_50%,#cf30aa_60%,#000_87%)] before:transition-all before:duration-2000 group-hover:before:rotate-[-120deg] group-focus-within:before:rotate-[420deg] group-focus-within:before:duration-[4000ms]", glowClassName)}>
                </div>
                {/* Glow Layer 2 */}
                <div className={cn("absolute z-0 overflow-hidden h-full w-full max-h-[45px] max-w-[175px] rounded-xl blur-[3px] before:absolute before:content-[''] before:z-[-2] before:w-[600px] before:h-[600px] before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-[82deg] before:bg-[conic-gradient(rgba(0,0,0,0),#18116a,rgba(0,0,0,0)_10%,rgba(0,0,0,0)_50%,#6e1b60,rgba(0,0,0,0)_60%)] before:transition-all before:duration-2000 group-hover:before:rotate-[-98deg] group-focus-within:before:rotate-[442deg] group-focus-within:before:duration-[4000ms]", glowClassName)}>
                </div>

                {/* Main Button Container */}
                <div id="main" className="relative group cursor-pointer w-full flex justify-center">
                    <div className={cn("bg-white border border-black/10 w-[170px] h-[44px] rounded-lg text-[#121212] flex items-center justify-center text-sm font-semibold relative z-10 transition-transform active:scale-95", innerClassName)}>
                        {children}
                    </div>

                    {/* Pink Mask Effect */}
                    <div id="pink-mask" className="pointer-events-none w-[30px] h-[20px] absolute bg-[#cf30aa] top-[10px] left-[5px] blur-2xl opacity-80 transition-all duration-2000 group-hover:opacity-0"></div>

                    {/* Spinning Corner Effect */}
                    <div className="absolute h-[30px] w-[30px] overflow-hidden top-[2px] right-[2px] rounded-lg pointer-events-none
                          before:absolute before:content-[''] before:w-[600px] before:h-[600px] before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-90
                          before:bg-[conic-gradient(rgba(0,0,0,0),#3d3a4f,rgba(0,0,0,0)_50%,rgba(0,0,0,0)_50%,#3d3a4f,rgba(0,0,0,0)_100%)]
                          before:brightness-135 before:animate-spin-slow">
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default AnimatedGlowingButton;
