'use client'
import React from 'react'
import { Link as LinkIcon, SendHorizonal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedGroup } from '@/components/ui/animated-group'
import Link from 'next/link'
import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'
import Navbar from '@/components/navbar/navbar-dropdown'

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring' as const,
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
}

export function HeroSection3() {
    return (
        <>
            <Navbar />

            <main className="overflow-hidden">
                <section>
                    <div className="relative mx-auto max-w-6xl px-6 pt-20 lg:pb-16 lg:pt-32">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
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
                                        ...transitionVariants,
                                    }}
                                >
                                    <h1 className="text-balance text-4xl font-medium sm:text-5xl md:text-6xl font-jakarta">
                                        Transform Your Website Performance
                                    </h1>

                                    <p className="mt-6 max-w-2xl text-pretty text-lg font-poppins text-gray-600">
                                        AI-powered audits that identify issues, optimize performance, and boost your SEO rankings in seconds.
                                    </p>

                                    <form action="" className="mt-8 max-w-md">
                                        <div className="bg-background has-[input:focus]:ring-muted relative grid grid-cols-[1fr_auto] p-2 items-center rounded-[1rem] border shadow shadow-zinc-950/5 has-[input:focus]:ring-2">
                                            <LinkIcon className="pointer-events-none absolute inset-y-0 left-4 my-auto size-4" />

                                            <input
                                                placeholder="Upload your website url"
                                                className="h-12 w-full bg-transparent pl-12 focus:outline-none"
                                                type="url"
                                            />

                                            <div>
                                                <Button
                                                    aria-label="submit"
                                                    className="h-10 px-8 rounded-xl bg-[#ff6a00] hover:bg-[#e66000] text-white font-bold shadow-md transition-all duration-200">
                                                    <span className="hidden md:block">Search</span>
                                                    <SendHorizonal
                                                        className="relative mx-auto size-5 md:hidden"
                                                        strokeWidth={2}
                                                    />
                                                </Button>
                                            </div>
                                        </div>
                                    </form>
                                </AnimatedGroup>
                            </div>

                            <div className="relative z-10 mt-12 lg:mt-0 flex justify-center lg:justify-end">
                                <div
                                    aria-hidden
                                    className="bg-radial from-primary/50 dark:from-primary/25 relative max-w-md w-full to-transparent to-55%"
                                >
                                    <div className="bg-background border-border/50 absolute inset-0 mx-auto w-full max-w-[320px] -translate-x-4 -translate-y-8 rounded-[2rem] border p-2 [mask-image:linear-gradient(to_bottom,#000_50%,transparent_90%)] lg:-translate-x-8 lg:-translate-y-12">
                                        <div className="relative h-96 overflow-hidden rounded-[1.5rem] border p-2 pb-12 before:absolute before:inset-0 before:bg-[repeating-linear-gradient(-45deg,var(--border),var(--border)_1px,transparent_1px,transparent_6px)] before:opacity-50"></div>
                                    </div>
                                    <div className="bg-muted dark:bg-background/50 border-border/50 mx-auto w-full max-w-[320px] translate-x-4 rounded-[2rem] border p-2 backdrop-blur-3xl lg:translate-x-8">
                                        <div className="bg-background space-y-2 overflow-hidden rounded-[1.5rem] border p-2 shadow-xl dark:bg-white/5 dark:shadow-black dark:backdrop-blur-3xl">
                                            <AppComponent />
                                            <div className="bg-muted rounded-[1rem] p-4 pb-8 dark:bg-white/5"></div>
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] mix-blend-overlay [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:opacity-5" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <LogoCloud />
            </main>
        </>
    )
}

const AppComponent = () => {
    return (
        <div className="relative space-y-3 rounded-[1rem] bg-white/5 p-4">
            <div className="flex items-center gap-1.5 text-orange-400">
                <svg
                    className="size-5"
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                </svg>
                <div className="text-sm font-medium">Performance Score</div>
            </div>
            <div className="space-y-3">
                <div className="text-foreground border-b border-white/10 pb-3 text-sm font-medium">Your website performance improved by 45% this month.</div>
                <div className="space-y-3">
                    <div className="space-y-1">
                        <div className="space-x-1">
                            <span className="text-foreground align-baseline text-xl font-medium">95</span>
                            <span className="text-muted-foreground text-xs">Performance</span>
                        </div>
                        <div className="flex h-5 items-center rounded bg-gradient-to-l from-emerald-400 to-blue-600 px-2 text-xs text-white">After Audit</div>
                    </div>
                    <div className="space-y-1">
                        <div className="space-x-1">
                            <span className="text-foreground align-baseline text-xl font-medium">65</span>
                            <span className="text-muted-foreground text-xs">Performance</span>
                        </div>
                        <div className="text-foreground bg-muted flex h-5 w-2/3 items-center rounded px-2 text-xs dark:bg-white/20">Before Audit</div>
                    </div>
                </div>
            </div>
        </div>
    )
}


const LogoCloud = () => {
    return (
        <section className="bg-background pb-16 md:pb-32">
            <div className="group relative m-auto max-w-6xl px-6">
                <div className="flex flex-col items-center md:flex-row">
                    <div className="inline md:max-w-44 md:border-r md:pr-6">
                        <p className="text-end text-sm">Trusted by teams worldwide</p>
                    </div>
                    <div className="relative py-6 md:w-[calc(100%-11rem)]">
                        <InfiniteSlider
                            duration={20}
                            gap={112}>
                            <div className="flex">
                                <img
                                    className="mx-auto h-5 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/nvidia.svg"
                                    alt="Nvidia Logo"
                                    height="20"
                                    width="auto"
                                />
                            </div>

                            <div className="flex">
                                <img
                                    className="mx-auto h-4 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/column.svg"
                                    alt="Column Logo"
                                    height="16"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-4 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/github.svg"
                                    alt="GitHub Logo"
                                    height="16"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-5 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/nike.svg"
                                    alt="Nike Logo"
                                    height="20"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-5 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/lemonsqueezy.svg"
                                    alt="Lemon Squeezy Logo"
                                    height="20"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-4 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/laravel.svg"
                                    alt="Laravel Logo"
                                    height="16"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-7 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/lilly.svg"
                                    alt="Lilly Logo"
                                    height="28"
                                    width="auto"
                                />
                            </div>

                            <div className="flex">
                                <img
                                    className="mx-auto h-6 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/openai.svg"
                                    alt="OpenAI Logo"
                                    height="24"
                                    width="auto"
                                />
                            </div>
                        </InfiniteSlider>

                        <div className="bg-linear-to-r from-background absolute inset-y-0 left-0 w-20"></div>
                        <div className="bg-linear-to-l from-background absolute inset-y-0 right-0 w-20"></div>
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
        </section>
    )
}
