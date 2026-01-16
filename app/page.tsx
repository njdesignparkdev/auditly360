import { HeroSection3 } from "@/components/home/hero-section-3";

import BgContainer from "../components/ui/bg-container";
import GridOverlay from "@/components/ui/grid-layer";
import { Footer } from "@/components/home/Footer";
import TestimonialSlider from "@/components/home/TestimonialSlider";
import HowItWorks from "@/components/home/HowItWorks";
import { FeaturesSection } from "@/components/home/features-section";
import WhyChooseUsSection from "@/components/home/WhyChooseUsSection";
import FaqSection from "@/components/home/faq-section";
import CtaSection from "@/components/home/cta-section";
import Pricing from "@/components/home/Pricing";
import Navbar from "@/components/home/navbar-dropdown";

export default function Page() {
  return (
    <BgContainer>
      {/* New Hero Section with built-in navbar */}
      <GridOverlay />
      <Navbar />
      <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-16 xl:px-10 2xl:px-10">
        <HeroSection3 />
        {/* 3. Features (Who It's For) */}
        {/* Note: User requested "Features" next. Using FeaturesSectionWithHoverEffects. */}
        <div
          id="features"
          className="relative scroll-mt-32"
          data-border="true"
          data-framer-name="Section Structure"
        >
          <div className="w-full h-px bg-gray-900/10 dark:bg-white/10 mb-6" />
          <div className="pb-0 relative z-10 px-0 sm:px-2 md:px-4 lg:px-8">
            <div className="sm:mx-auto lg:mr-auto text-left mb-6 sm:mb-8">
              <div className="space-y-2 sm:space-y-3">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-gray-900 font-jakarta">
                  Features & Use Cases
                </h2>
                <p className="text-gray-600 text-sm sm:text-base font-poppins max-w-2xl">
                  Tailored solutions for every member of your team.
                </p>
              </div>
            </div>
            <FeaturesSection />
          </div>
        </div>

        <div className="w-full h-px bg-gray-900/10 dark:bg-white/10 mt-4" />

        {/* 4. How It Works (Optional -> Included) */}
        <div id="how-it-works" className="scroll-mt-32">
          <HowItWorks />
        </div>

        <div className="w-full h-px bg-gray-900/10 dark:bg-white/10" />
        {/* 5. Why Choose Us */}
        <WhyChooseUsSection />

        <div className="w-full h-px bg-gray-900/10 dark:bg-white/10" />

        {/* 7. Testimonials */}
        <div id="testimonials" className="scroll-mt-32">
          <TestimonialSlider />
        </div>

        <div className="w-full h-px bg-gray-900/10 dark:bg-white/10" />

        {/* 8. Pricing */}
        <div id="pricing" className="scroll-mt-24">
          <Pricing />
        </div>

        <div className="w-full h-px bg-gray-900/10 dark:bg-white/10" />

        {/* 9. FAQ */}
        <FaqSection />
        <div className="w-full h-px bg-gray-900/10 dark:bg-white/10" />
        {/* 10. Final CTA */}
        <CtaSection />

        {/* 11. Footer */}
      </div>
      <Footer />
    </BgContainer>
  );
}
