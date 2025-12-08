import { HeroSection } from "@/components/blocks/hero-section-dark"
import NavbarV2 from './home-page-components/navbar-v2'
import BgContainer from './home-page-components/bg-container'
import GridOverlay from '@/components/ui/grid-layer'
import SectionSeparator from '@/components/ui/section-separator'
import { Footer } from '@/components/footer-section/Footer'
import TestimonialSlider from '@/components/testimonial-section/TestimonialSlider'
import HowItWorks from "@/components/how-it-works/HowItWorks"
import UseCases from "@/components/use-cases/UseCases"
import { FeaturesSectionWithHoverEffects } from "@/components/ui/feature-section-with-hover-effects"

import Pricing from "@/components/pricing-section/Pricing"

export default function Page() {
  return (
    <BgContainer>
      <GridOverlay />
      <div className="relative z-10 max-w-[1400px] mx-auto px-6">
        <NavbarV2 />
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
        <div className="mt-8 sm:mt-10 lg:mt-12">
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
        
        <SectionSeparator className="my-8 md:my-12" />
        <UseCases />
        
        <SectionSeparator className="my-8 md:my-12" />
        <HowItWorks />
        
        <SectionSeparator className="my-8 md:my-12" />
        <TestimonialSlider />
        
        <SectionSeparator className="my-8 md:my-12" />
        <Pricing />
        
        <SectionSeparator className="my-8 md:my-12" />
        <Footer />
      </div>
    </BgContainer>
  )
}
