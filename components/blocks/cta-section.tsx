'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { AnimatedGroup } from '@/components/ui/animated-group';

export default function CtaSection() {
  return (
    <section className="w-full py-6 relative overflow-hidden bg-transparent">
      {/* Background removed as per request - now transparent */}
      
      <AnimatedGroup 
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center"
        variants={{
          container: {
              visible: {
                  transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.2,
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
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-jakarta text-gray-900 dark:text-white mb-6 tracking-tight">
          Ready to optimize your website?
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
          Join thousands of developers and founders using Auditly360 to build better, faster, and safer web experiences.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            asChild 
            size="lg" 
            className="rounded-full bg-orange-500 hover:bg-orange-600 text-white px-8 h-14 text-lg -lg hover:-xl transition-all"
          >
            <Link href="/signup">
              Get Started for Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <Button 
            asChild 
            variant="outline" 
            size="lg" 
            className="rounded-full border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white px-8 h-14 text-lg bg-transparent"
          >
            <Link href="/demo">
              View Live Demo
            </Link>
          </Button>
        </div>
        
        <p className="mt-8 text-sm text-gray-500">
          No credit card required · Free 14-day trial · Cancel anytime
        </p>
      </AnimatedGroup>
    </section>
  );
}
