import EnhancedBackgroundPaths from "@/components/ui/modern-background-paths";
import NavbarV2 from "@/app/home-page-components/navbar-v2";
import GridOverlay from "@/components/ui/grid-layer";
import { Footer } from "@/components/footer-section/Footer";
import BgContainer from "@/app/home-page-components/bg-container";

export default function DemoPage() {
  return (
    <BgContainer>
      <NavbarV2 />
      <GridOverlay />
      <div className="relative z-10 w-full">
        <EnhancedBackgroundPaths />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Footer />
        </div>
      </div>
    </BgContainer>
  );
}

