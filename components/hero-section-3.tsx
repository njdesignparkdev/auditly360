'use client'
import React from 'react'
import { Link as LinkIcon, SendHorizonal, Zap, Search, Image, Link2Off, SpellCheck, Palette, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'
import Navbar from '@/components/navbar/navbar-dropdown'

const FEATURES = [
    { name: 'Performance', icon: Zap },
    { name: 'Manual SEO', icon: Search },
    { name: 'Image Scan', icon: Image },
    { name: 'Broken Links', icon: Link2Off },
    { name: 'Grammar Check', icon: SpellCheck },
    { name: 'UI/UX Quality', icon: Palette },
    { name: 'Security', icon: ShieldCheck },
]

export function HeroSection3() {
    return (
        <>
            <Navbar />
            <main className="overflow-hidden">
                <section>
                    <div className="relative mx-auto max-w-6xl px-6 sm:px-8 lg:px-16 pt-6 lg:pt-20 pb-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                            <div className="relative z-10 text-left">
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
                                            hidden: { opacity: 0, filter: 'blur(12px)', y: 12 },
                                            visible: { 
                                                opacity: 1, 
                                                filter: 'blur(0px)', 
                                                y: 0,
                                                transition: { type: 'spring', bounce: 0.3, duration: 1.5 }
                                            },
                                        },
                                    }}
                                >
                                    <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl font-jakarta leading-[1.1]">
                                        Transform Your Website Performance
                                    </h1>

                                    <p className="mt-6 max-w-2xl text-lg font-poppins text-gray-600">
                                        AI-powered audits that identify issues, optimize performance, and boost your SEO rankings in seconds.
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
                                                className="h-9 px-8 rounded-none bg-[#ff6a00] hover:bg-[#e66000] text-white font-bold">
                                                <span className="hidden md:block">Search</span>
                                                <SendHorizonal className="md:hidden size-5" strokeWidth={2} />
                                            </Button>
                                        </div>
                                    </form>
                                </AnimatedGroup>
                            </div>

                            <div className="relative mt-12 lg:mt-0 flex justify-center lg:justify-end">
                                <div className="relative max-w-md w-full">
                                    <div className="bg-background border-border/50 absolute inset-0 mx-auto w-full max-w-[320px] -translate-x-4 -translate-y-8 rounded-none border p-2 opacity-50 lg:-translate-x-8 lg:-translate-y-12">
                                        <div className="relative h-96 overflow-hidden rounded-none border p-2 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                                    </div>
                                    <div className="bg-muted border-border/50 mx-auto w-full max-w-[320px] translate-x-4 rounded-none border p-2 backdrop-blur-sm lg:translate-x-8">
                                        <div className="bg-background overflow-hidden rounded-none border p-2">
                                            <AppComponent />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Feature Icons Slider */}
                        <div className="mt-24 lg:mt-32 overflow-hidden">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="md:max-w-64 md:border-r md:pr-8 shrink-0">
                                    <p className="text-lg font-semibold text-foreground/80">Explore our comprehensive analysis tools</p>
                                </div>
                                <div className="relative flex-1 overflow-hidden">
                                    <InfiniteSlider duration={20} gap={112}>
                                        {FEATURES.map((feature) => (
                                            <div key={feature.name} className="flex items-center gap-3">
                                                <feature.icon className="h-8 w-8 text-foreground/70" />
                                                <span className="text-lg font-medium text-foreground/70">{feature.name}</span>
                                            </div>
                                        ))}
                                    </InfiniteSlider>
                                    <ProgressiveBlur className="pointer-events-none absolute left-0 top-0 h-full w-20" direction="left" blurIntensity={1} />
                                    <ProgressiveBlur className="pointer-events-none absolute right-0 top-0 h-full w-20" direction="right" blurIntensity={1} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

const AppComponent = () => (
    <div className="relative space-y-3 rounded-none bg-gray-50 p-4">
        <div className="flex items-center gap-1.5 text-orange-400">
            <svg className="size-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
            </svg>
            <div className="text-sm font-medium">Performance Score</div>
        </div>
        <div className="space-y-3">
            <div className="text-foreground border-b border-white/10 pb-3 text-sm font-medium">
                Your website performance improved by 45% this month.
            </div>
            <div className="space-y-3">
                <div className="space-y-1">
                    <div className="space-x-1">
                        <span className="text-foreground text-xl font-medium">95</span>
                        <span className="text-muted-foreground text-xs">Performance</span>
                    </div>
                <div className="flex h-5 items-center rounded-none bg-gradient-to-l from-emerald-400 to-blue-600 px-2 text-xs text-white">
                        After Audit
                    </div>
                </div>
                <div className="space-y-1">
                    <div className="space-x-1">
                        <span className="text-foreground text-xl font-medium">65</span>
                        <span className="text-muted-foreground text-xs">Performance</span>
                    </div>
                <div className="text-foreground bg-muted flex h-5 w-2/3 items-center rounded-none px-2 text-xs">
                        Before Audit
                    </div>
                </div>  
            </div>
        </div>
    </div>
)
