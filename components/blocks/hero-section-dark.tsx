import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DashboardMockup } from "@/components/blocks/dashboard-mockup";


interface HeroSectionProps {
    title: string;
    subtitle: {
        regular: string;
        gradient: string;
    };
    description: string;
    ctaText: string;
    ctaHref: string;
    bottomImage: {
        light: string;
        dark: string;
    };
    gridOptions: {
        angle: number;
        opacity: number;
        cellSize: number;
        lightLineColor: string;
        darkLineColor: string;
    };
}

export function HeroSection({
    title,
    subtitle,
    description,
    ctaText,
    ctaHref,
    bottomImage,
    gridOptions,
}: HeroSectionProps) {
    return (
        <div className="relative overflow-hidden bg-background pt-8 md:pt-12">
            {/* Grid Background */}
            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(${gridOptions.angle}deg, ${gridOptions.darkLineColor} 1px, transparent 1px), linear-gradient(${gridOptions.angle + 90}deg, ${gridOptions.darkLineColor} 1px, transparent 1px)`,
                    backgroundSize: `${gridOptions.cellSize}px ${gridOptions.cellSize}px`,
                    opacity: gridOptions.opacity,
                }}
            />

            <div className="relative z-10 flex flex-col items-center text-center">


                <h1 className="mt-4 max-w-4xl mx-auto text-balance text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 raleway leading-tight">
                    {subtitle.regular} <br />
                    <span className="bg-[linear-gradient(87.33deg,#FF8B42_3.83%,#EF4600_92.4%)] bg-clip-text text-transparent">{subtitle.gradient}</span>
                </h1>

                {/* Description */}
                <p className="mb-6 mt-4 max-w-2xl text-lg font-poppins font-semibold text-muted-foreground sm:text-xl">
                    {description}
                </p>

                {/* CTA Button */}
                <div className="mb-8">
                    <span className="sr-only">{title}</span>
                    <Button
                        asChild
                        size="lg"
                        className="rounded-full bg-gradient-to-r from-[#F08644] to-[#FF6606] px-8 py-3 text-lg font-semibold text-white shadow-lg shadow-[#FF6606]/25 hover:from-[#F08644]/90 hover:to-[#FF6606]/90 hover:shadow-[#FF6606]/40 transition-all duration-300"
                    >
                        <Link href={ctaHref}>{ctaText}</Link>
                    </Button>
                </div>

                {/* Bottom Image / Mockup Container */}
                <div className="relative w-full mx-auto mt-4">
                    <div className="relative z-10 rounded-xl border border-white/10 bg-white/5 p-2 shadow-2xl backdrop-blur-sm">
                        <div className="relative aspect-video overflow-hidden rounded-lg bg-background/50">
                            <DashboardMockup />
                        </div>
                    </div>

                    {/* Glow effect behind the image */}
                    <div className="absolute -inset-4 -z-10 bg-gradient-to-r from-[#F08644]/20 to-[#FF6606]/20 blur-3xl opacity-50 rounded-[3rem]" />
                </div>
            </div>
        </div>
    );
}
