import { HeroSection } from "@/components/blocks/hero-section-dark"
import NavbarV2 from './home-page-components/navbar-v2'
import BgContainer from './home-page-components/bg-container'
import GridOverlay from '@/components/ui/grid-layer'

export default function Page() {
  return (
    <BgContainer>
      <GridOverlay />
      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-8">
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
      </div>
    </BgContainer>
  )
}
