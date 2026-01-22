import { HeroSection3 } from "@/components/home/hero-section";
import BgContainer from "../components/ui/bg-container";
import GridOverlay from "@/components/ui/grid-layer";
import { Footer } from "@/components/home/Footer-section";
import TestimonialSlider from "@/components/home/Testimonial-section";
import HowItWorks from "@/components/home/HowitsWork-section";
import { FeaturesSection } from "@/components/home/features-section";
import WhyChooseUsSection from "@/components/home/WhyChooseUs-Section";
import FaqSection from "@/components/home/faq-section";
import CtaSection from "@/components/home/cta-section";
import Pricing from "@/components/home/Pricing-section";
import Navbar from "@/components/home/navbar-section";

export default function Page() {
  return (
    <BgContainer>
      {/* Grid Overlay - Provides visual grid lines */}
      <GridOverlay />

      {/* Navbar - Sticky header */}
      <Navbar />

      {/* Main Content Container - Matches grid padding structure */}
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Hero Section */}
          <HeroSection3 />

          {/* Divider */}
          <div className="w-full h-px bg-gray-900/10 dark:bg-white/10 mb-6" />

          {/* Features Section */}
          <section id="features" className="scroll-mt-32">
            <div className="pb-0 relative z-10">
              <div className="sm:mx-auto lg:mr-auto text-left mb-6 sm:mb-8 px-4 sm:px-6 lg:px-8">
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
          </section>

          {/* Divider */}
          <div className="w-full h-px bg-gray-900/10 dark:bg-white/10 mt-4" />

          {/* How It Works Section */}
          <section id="how-it-works" className="scroll-mt-32">
            <HowItWorks />
          </section>

          {/* Divider */}
          <div className="w-full h-px bg-gray-900/10 dark:bg-white/10" />

          {/* Why Choose Us Section */}
          <section>
            <WhyChooseUsSection />
          </section>

          {/* Divider */}
          <div className="w-full h-px bg-gray-900/10 dark:bg-white/10" />

          {/* Testimonials Section */}
          <section id="testimonials" className="scroll-mt-32">
            <TestimonialSlider />
          </section>

          {/* Divider */}
          <div className="w-full h-px bg-gray-900/10 dark:bg-white/10" />

          {/* Pricing Section */}
          <section id="pricing" className="scroll-mt-24">
            <Pricing />
          </section>

          {/* Divider */}
          <div className="w-full h-px bg-gray-900/10 dark:bg-white/10" />

          {/* FAQ Section */}
          <section>
            <FaqSection />
          </section>

          {/* Divider */}
          <div className="w-full h-px bg-gray-900/10 dark:bg-white/10" />

          {/* CTA Section */}
          <section>
            <CtaSection />
          </section>
        </div>
      </div>

      {/* Footer - Outside main container */}
      <Footer />
    </BgContainer>
  );
}
