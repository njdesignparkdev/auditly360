'use client';

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedGroup } from '@/components/ui/animated-group'
import GridOverlay from '@/components/ui/grid-layer'
import { useAuth } from '@/hooks/useAuth'
import { Variants } from 'framer-motion'

const transitionVariants: { item: Variants } = {
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
        type: 'spring',
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
}

export default function HeroSection() {
  const { isAuthenticated } = useAuth();

  return (
    <div className='relative bg-white overflow-hidden'>
      {/* Grid Layer Overlay */}
      <GridOverlay />

      {/* Background Gradients */}
      <div
        aria-hidden
        className="z-[0] absolute inset-0 pointer-events-none isolate opacity-60 contain-strict hidden lg:block">
        <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(18,85%,85%,.15)_0,hsla(18,55%,55%,.05)_50%,hsla(18,45%,45%,0)_80%)]" />
        <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(18,85%,85%,.1)_0,hsla(18,45%,45%,.05)_80%,transparent_100%)] [translate:5%_-50%]" />
        <div className="h-[80rem] -translate-y-[350px] absolute left-0 top-0 w-56 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(18,85%,85%,.08)_0,hsla(18,45%,45%,.05)_80%,transparent_100%)]" />
      </div>

      <div className='min-h-[70vh] md:min-h-screen px-4 relative' >
        {/* Content Layer */}
        <div className="relative flex flex-col text-black z-10 md:min-h-screen pt-32 md:pt-48 ">
          <div className="mx-auto max-w-[1400px] px-6">
            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
              <AnimatedGroup variants={transitionVariants}>
                <Link
                  href="#how-it-works"
                  className="hover:bg-gray-50 bg-white group mx-auto flex w-fit items-center gap-4 rounded-full border border-gray-200 p-1 pl-4 shadow-sm transition-all duration-300">
                  <span className="text-gray-600 text-sm font-medium">AI Powered | Explore the future of website audits</span>
                  <span className="block h-4 w-0.5 border-l bg-gray-200"></span>

                  <div className="bg-gray-100 group-hover:bg-gray-200 size-6 overflow-hidden rounded-full duration-500 flex items-center justify-center">
                    <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                      <span className="flex size-6 items-center justify-center">
                        <ArrowRight className="size-3 text-gray-600" />
                      </span>
                      <span className="flex size-6 items-center justify-center">
                        <ArrowRight className="size-3 text-gray-600" />
                      </span>
                    </div>
                  </div>
                </Link>

                <h1
                  className="mt-8 max-w-4xl mx-auto text-balance text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900 raleway">
                  Your Website, Audited
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e35e24] to-[#ff8a50] block sm:inline ml-0 sm:ml-4">in Seconds</span>
                </h1>
                <p
                  className="mx-auto mt-8 max-w-2xl text-balance text-lg md:text-xl text-gray-600 raleway leading-relaxed">
                  Uncover SEO, performance, and security Issues
                  instantly with AI-powered audits.
                </p>
              </AnimatedGroup>

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
                className="mt-12 flex flex-col items-center justify-center gap-4 md:flex-row">
                <div
                  key={1}
                  className="rounded-[14px] p-0.5">
                  <Button
                    asChild
                    size="lg"
                    className="rounded-full px-8 py-6 text-lg bg-[#e35e24] hover:bg-[#c94e1b] text-white shadow-lg shadow-orange-500/20 transition-all">
                    <Link href={isAuthenticated ? '/dashboard' : '/login'}>
                      <span className="text-nowrap font-semibold">Get Started Free</span>
                    </Link>
                  </Button>
                </div>
                <Button
                  key={2}
                  asChild
                  size="lg"
                  variant="ghost"
                  className="rounded-full px-8 py-6 text-lg text-gray-700 hover:bg-gray-50 border border-gray-200">
                  <Link href="#how-it-works">
                    <span className="text-nowrap font-semibold">How it works</span>
                  </Link>
                </Button>
              </AnimatedGroup>
            </div>
          </div>

          {/* Dashboard Preview (Placeholder/Future) */}
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
            }}>
            <div className="relative mt-16 md:mt-24 mx-auto max-w-6xl px-4">
              <div
                aria-hidden
                className="bg-gradient-to-b from-transparent to-white absolute inset-0 z-10 h-full w-full pointer-events-none"
              />
              {/* Placeholder for Dashboard Image - Using a subtle border/shadow container for now */}
              <div className="relative mx-auto overflow-hidden rounded-2xl border border-gray-200 bg-white/50 shadow-2xl shadow-gray-200/50 backdrop-blur-sm p-2 md:p-4">
                <div className="aspect-[16/9] rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 overflow-hidden relative">
                  {/* Fallback visual until real screenshot is added */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-50/50 via-transparent to-transparent opacity-50"></div>
                  <div className="text-center p-8">
                    <div className="w-16 h-16 bg-orange-100 text-[#e35e24] rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-dashboard"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
                    </div>
                    <p className="text-gray-400 font-medium">Dashboard Preview</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedGroup>

          {/* Customers Section */}
          <section className="py-16 md:py-24">
            <div className="group relative m-auto max-w-5xl px-6">
              <div className="absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100 pointer-events-none">
                <div
                  className="flex items-center text-sm duration-150 text-gray-500 bg-white/80 backdrop-blur px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                  <span>Trusted by industry leaders</span>
                </div>
              </div>
              <div className="group-hover:blur-sm mx-auto mt-12 grid max-w-2xl grid-cols-4 gap-x-12 gap-y-8 transition-all duration-500 group-hover:opacity-50 sm:gap-x-16 sm:gap-y-14 grayscale opacity-60">
                {/* Using placeholders for logos to avoid broken images */}
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="flex items-center justify-center">
                    <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
