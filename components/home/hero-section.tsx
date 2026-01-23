"use client";
import React from "react";
import {
  Link as LinkIcon,
  SendHorizonal,
  Zap,
  Search,
  Image,
  Link2Off,
  SpellCheck,
  Palette,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

const FEATURES = [
  { name: "Performance", icon: Zap },
  { name: "Manual SEO", icon: Search },
  { name: "Image Scan", icon: Image },
  { name: "Broken Links", icon: Link2Off },
  { name: "Grammar Check", icon: SpellCheck },
  { name: "UI/UX Quality", icon: Palette },
  { name: "Security", icon: ShieldCheck },
];

export function HeroSection3() {
  return (
    <>
      <main className="overflow-hidden">
        <section>
          <div className="relative pt-4 lg:pt-16 pb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center px-4 sm:px-6 lg:px-8">
              <div className="relative z-10 pb-0 text-left">
                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.05,
                          delayChildren: 0.75,
                        },
                      },
                    },
                    item: {
                      hidden: { opacity: 0, filter: "blur(12px)", y: 12 },
                      visible: {
                        opacity: 1,
                        filter: "blur(0px)",
                        y: 0,
                        transition: {
                          type: "spring",
                          bounce: 0.3,
                          duration: 1.5,
                        },
                      },
                    },
                  }}
                >
                  <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl font-jakarta leading-[1.1]">
                    Transform Your Website Performance
                  </h1>

                  <p className="mt-6 max-w-2xl text-lg font-poppins text-gray-600">
                    AI-powered audits that identify issues, optimize
                    performance, and boost your SEO rankings in seconds.
                  </p>

                  <form className="mt-8 max-w-lg">
                    <div className="bg-background relative grid grid-cols-[1fr_auto] p-1.5 items-center rounded-none border has-[input:focus]:ring-2 has-[input:focus]:ring-muted">
                      <LinkIcon className="pointer-events-none absolute left-4 size-4" />
                      <input
                        placeholder="Upload your website url"
                        className="h-11 w-full bg-transparent pl-12 focus:outline-none"
                        type="url"
                      />
                      <Button
                        aria-label="submit"
                        className="h-8 md:h-10 px-4 md:px-8 rounded-none bg-[#ff6a00] hover:bg-[#e66000] text-white font-bold"
                      >
                        <span className="hidden md:block">Search</span>
                        <SendHorizonal
                          className="md:hidden size-4"
                          strokeWidth={2}
                        />
                      </Button>
                    </div>
                  </form>
                </AnimatedGroup>
              </div>

              {/* Right column empty - Card removed */}
              <div className="hidden lg:block" />
            </div>

            {/* Feature Icons Slider */}
            <div className="mt-24 lg:mt-32 overflow-hidden">
              <div className="flex flex-col md:flex-row items-center gap-6 px-4 sm:px-6 lg:px-8">
                <div className="md:max-w-64 md:border-r md:pr-8 shrink-0">
                  <p className="text-lg font-semibold text-foreground/80">
                    Explore our comprehensive analysis tools
                  </p>
                </div>
                <div className="relative flex-1 overflow-hidden">
                  <InfiniteSlider duration={20} gap={112}>
                    {FEATURES.map((feature) => (
                      <div
                        key={feature.name}
                        className="flex items-center gap-3"
                      >
                        <feature.icon className="h-8 w-8 text-foreground/70" />
                        <span className="text-lg font-medium text-foreground/70">
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </InfiniteSlider>
                  <ProgressiveBlur
                    className="pointer-events-none absolute left-0 top-0 h-full w-20"
                    direction="left"
                    blurIntensity={1}
                  />
                  <ProgressiveBlur
                    className="pointer-events-none absolute right-0 top-0 h-full w-20"
                    direction="right"
                    blurIntensity={1}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
