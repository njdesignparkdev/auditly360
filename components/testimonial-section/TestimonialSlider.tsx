"use client"
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  title: string;
}

const testimonials: Testimonial[] = [
  { 
    id: 1, 
    quote: "Web Audit caught issues I never knew existed — it's like having a second pair of expert eyes.", 
    name: "Aarav Mehta", 
    title: "CEO, FinTech Startup" 
  },
  { 
    id: 2, 
    quote: "Exporting and sharing reports with my dev team was seamless — we fixed things faster.", 
    name: "Isabella Novak", 
    title: "CTO, Beta User" 
  },
  { 
    id: 3, 
    quote: "The best part is the clear, step-by-step recommendations. It's not just scores, it's real fixes.", 
    name: "Liam Chen", 
    title: "Product Designer, SaaS Platform" 
  },
];

const TestimonialSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const itemsPerPage = 3;
  
  // Create extended array by duplicating testimonials for seamless loop
  const extendedTestimonials = [...testimonials, ...testimonials, ...testimonials];

  const goNext = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const goPrev = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  // Reset position when reaching duplicates for seamless infinite scroll
  useEffect(() => {
    if (currentIndex >= testimonials.length) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(currentIndex - testimonials.length);
      }, 500);
      return () => clearTimeout(timer);
    } else if (currentIndex < 0) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(currentIndex + testimonials.length);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (!isTransitioning) {
      requestAnimationFrame(() => {
        setIsTransitioning(true);
      });
    }
  }, [isTransitioning]);

  // Auto-play functionality
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      goNext();
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isPaused, currentIndex]); // Dependencies ensure interval resets on interaction

  const goToSlide = (index: number) => {
    setIsTransitioning(true);
    setCurrentIndex(index);
  };

  const visibleDotIndex = ((currentIndex % testimonials.length) + testimonials.length) % testimonials.length;

  return (
    <div className="px-4 py-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 font-jakarta mb-2">
            Trusted by Professionals
          </h2>
          <p className="text-gray-600 text-sm sm:text-base font-poppins">
            See what our users are saying
          </p>
        </div>

        {/* Testimonial Carousel Container */}
        <div 
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Navigation Arrows */}
          <div className="absolute -top-16 right-0 flex gap-2 z-10">
            <button
              onClick={goPrev}
              className="p-2 rounded-full border border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all"
              aria-label="Previous testimonials"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goNext}
              className="p-2 rounded-full border border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all"
              aria-label="Next testimonials"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Testimonial Grid with Overflow */}
          <div className="overflow-hidden">
            <div 
              className={`flex ${isTransitioning ? 'transition-transform duration-500 ease-in-out' : ''}`}
              style={{ transform: `translateX(-${(currentIndex + testimonials.length) * (100 / itemsPerPage)}%)` }}
            >
              {extendedTestimonials.map((testimonial, index) => (
                <motion.div
                  key={`${testimonial.id}-${index}`}
                  className="w-1/3 flex-shrink-0 px-3"
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                >
                  <motion.div 
                    className="bg-gray-50 rounded-lg p-6 h-full relative flex flex-col overflow-hidden"
                    variants={{
                      rest: { scale: 1, y: 0, boxShadow: "none" },
                      hover: { scale: 1.02, y: -5, boxShadow: "0 10px 25px -5px rgba(255, 102, 6, 0.4)" }
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    {/* Gradient Background on Hover */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-br from-[#FF8B42] via-[#FF6B35] to-[#EF4600]"
                      variants={{
                        rest: { opacity: 0 },
                        hover: { opacity: 1 }
                      }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    {/* Quote Text */}
                    <motion.p 
                      className="text-sm mb-6 leading-relaxed relative z-10 font-poppins font-semibold"
                      variants={{
                        rest: { color: "#374151" }, // text-gray-700
                        hover: { color: "#ffffff" } // text-white
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {testimonial.quote}
                    </motion.p>

                    {/* Author Info */}
                    <motion.div 
                      className="border-t pt-4 relative z-10 mt-auto"
                      variants={{
                        rest: { borderColor: "#e5e7eb" }, // border-gray-200
                        hover: { borderColor: "rgba(255, 255, 255, 0.3)" } // border-white/30
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.h4 
                        className="font-jakarta font-bold text-sm"
                        variants={{
                          rest: { color: "#111827" }, // text-gray-900
                          hover: { color: "#ffffff" } // text-white
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {testimonial.name}
                      </motion.h4>
                      <motion.p 
                        className="text-xs mt-1 font-poppins font-medium"
                        variants={{
                          rest: { color: "#4b5563" }, // text-gray-600
                          hover: { color: "rgba(255, 255, 255, 0.9)" } // text-white/90
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {testimonial.title}
                      </motion.p>
                    </motion.div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, dotIndex) => (
              <button
                key={dotIndex}
                onClick={() => goToSlide(dotIndex)}
                className={`h-2 rounded-full transition-all ${
                  dotIndex === visibleDotIndex
                    ? 'bg-gray-900 w-8'
                    : 'bg-gray-300 w-2 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${dotIndex + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSlider;
