import { HeroSection } from "@/components/blocks/hero-section-dark"
import NavbarV2 from './home-page-components/navbar-v2'
import BgContainer from './home-page-components/bg-container'
import GridOverlay from '@/components/ui/grid-layer'
import SectionSeparator from '@/components/ui/section-separator'
import { Footer } from '@/components/footer-section/Footer'
import TestimonialSlider from '@/components/testimonial-section/TestimonialSlider'
import HowItWorks from "@/components/how-it-works/HowItWorks"
import { FeaturesSectionWithHoverEffects } from "@/components/ui/feature-section-with-hover-effects"

import Pricing from "@/components/pricing-section/Pricing"

export default function Page() {
  return (
    <BgContainer>
      <GridOverlay />
      <div className="relative z-10 max-w-[1240px] mx-auto px-0">
        <NavbarV2 />
        <div className="px-2 md:px-4">
          <HeroSection
            title="AI Powered"
            subtitle={{
              regular: "Your Website,",
              gradient: "Audited in Seconds",
            }}
            description="Uncover SEO, performance, and security Issues instantly with AI-powered audits."
            ctaText="Get Started"
            ctaHref="/signup"
            bottomImage={{
              light: "https://www.launchuicomponents.com/app-light.png",
              dark: "https://www.launchuicomponents.com/app-dark.png",
            }}
            gridOptions={{
              angle: 65,
              opacity: 0.4,
              cellSize: 50,
              lightLineColor: "#4a4a4a",
              darkLineColor: "#2a2a2a",
            }}
          />
        </div>
        <SectionSeparator className="my-8 md:my-12" />
        <div className="mt-8 sm:mt-10 lg:mt-12 relative px-6 md:px-10" data-border="true" data-framer-name="Section Structure">
          {/* Grid borders */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Left border */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-900/20" />
            {/* Right border */}
            <div className="absolute right-0 top-0 bottom-0 w-px bg-gray-900/20" />
            {/* Top border */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gray-900/20" />
            {/* Bottom border */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-900/20" />
          </div>
          <div className="py-8 relative z-10 px-0">
            <div className="space-y-3 sm:mx-auto lg:mr-auto text-left">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 font-jakarta">
                Who It&apos;s For
              </h2>
              <p className="text-gray-600 text-sm sm:text-base font-poppins max-w-2xl">
                Teams, founders, and developers who need fast, actionable audit insights without slowing down shipping.
              </p>
            </div>
            <FeaturesSectionWithHoverEffects />
          </div>
        </div>
        
        <SectionSeparator className="my-8 md:my-12" />
        <div id="how-it-works">
          <HowItWorks />
        </div>
        
        <SectionSeparator className="my-8 md:my-12" />
        <TestimonialSlider />
        
        <SectionSeparator className="my-8 md:my-12" />
        <div id="pricing">
          <Pricing />
        </div>
        <Footer />
      </div>
    </BgContainer>
  )
}
